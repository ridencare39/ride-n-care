#!/usr/bin/env node
// Deploy the NITRO_PRESET=vercel build (.output/) to Vercel using the REST API.
//
// Usage:
//   node scripts/deploy-vercel.mjs env     # configure project settings + production env vars
//   node scripts/deploy-vercel.mjs deploy  # upload prebuilt .output and create a production deployment
//   node scripts/deploy-vercel.mjs poll    # wait for the last created deployment to finish
//
// Requires VERCEL_TOKEN in the environment (loaded automatically from .env.local
// in the Freebuff shell). Secret values are only sent to the Vercel API — never printed.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const API = "https://api.vercel.com";
const TEAM_ID = "team_QJjaaHmqUGLG7IArK9Sibaon";
const PROJECT = "ride-n-care";
const OUTPUT_DIR = ".output";
const STATE_FILE = "/tmp/ridencare-vercel-state.json";
const REGION = "bom1";

const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error("Missing VERCEL_TOKEN in environment.");
  process.exit(1);
}

const team = () => `teamId=${TEAM_ID}`;

async function api(p, { method = "GET", body, json } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  let payload;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(json);
  } else if (body !== undefined) {
    payload = body;
  }
  const res = await fetch(`${API}${p}`, { method, headers, body: payload });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

function fail(msg, data) {
  console.error(msg, data ?? "");
  process.exit(1);
}

// ---------- env subcommand ----------

const REQUIRED_ENV = ["SUPABASE_SERVICE_ROLE_KEY"];
const OPTIONAL_ENV = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PROJECT_ID",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_PROJECT_ID",
  "LOVABLE_API_KEY",
  "GOOGLE_SEARCH_CONSOLE_API_KEY",
];

async function setProjectEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) fail(`Missing required env var(s): ${missing.join(", ")}`);

  // Neutralize any dashboard build config so the prebuilt output is used as-is.
  const baseSettings = {
    framework: null,
    buildCommand: null,
    devCommand: null,
    installCommand: null,
    outputDirectory: null,
    rootDirectory: null,
  };
  let r = await api(`/v9/projects/${PROJECT}?${team()}`, {
    method: "PATCH",
    json: { ...baseSettings, serverlessFunctionRegion: REGION },
  });
  if (r.status === 400) {
    console.log(`Region ${REGION} not accepted, retrying without region override…`);
    r = await api(`/v9/projects/${PROJECT}?${team()}`, { method: "PATCH", json: baseSettings });
  }
  if (!r.ok) fail(`Could not update project settings [${r.status}]:`, r.data);

  const envs = [...REQUIRED_ENV, ...OPTIONAL_ENV].filter((k) => process.env[k]);
  for (const key of envs) {
    const e = await api(`/v10/projects/${PROJECT}/env?${team()}&upsert=true`, {
      method: "POST",
      json: {
        key,
        value: process.env[key],
        type: "encrypted",
        target: ["production", "preview", "development"],
      },
    });
    if (!e.ok) fail(`Could not set env ${key} [${e.status}]:`, e.data);
    console.log(`env set: ${key}`);
  }
  console.log(`Done. ${envs.length} env vars configured on project "${PROJECT}".`);
}

// ---------- deploy / poll ----------

function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).split(path.sep).join("/");
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push({ full, rel });
  }
  return out;
}

async function printEvents(id) {
  const r = await api(`/v2/deployments/${id}/events?${team()}&limit=100&builds=1`);
  const evs = Array.isArray(r.data) ? r.data : [];
  const lines = [];
  for (const e of evs) {
    const t = e?.payload?.text;
    if (typeof t === "string") lines.push(t);
  }
  if (lines.length) console.log("---- build log (tail) ----\n" + lines.slice(-40).join("\n"));
}

async function waitFor(id, seconds) {
  const end = Date.now() + seconds * 1000;
  while (Date.now() < end) {
    const r = await api(`/v13/deployments/${id}?${team()}`);
    if (!r.ok) fail(`Status check failed [${r.status}]:`, r.data);
    const { readyState, statusText, url } = r.data;
    if (readyState === "READY") {
      console.log(`\nREADY: https://${url}`);
      return "READY";
    }
    if (readyState === "ERROR" || readyState === "CANCELED") {
      console.error(`\n${readyState}: ${statusText || ""}`);
      await printEvents(id);
      process.exit(1);
    }
    process.stdout.write(".");
    await new Promise((res) => setTimeout(res, 8000));
  }
  console.log(`\nStill building after ${seconds}s — check later with: node scripts/deploy-vercel.mjs poll`);
  return "PENDING";
}

async function deploy() {
  if (!fs.existsSync(OUTPUT_DIR)) fail("No .output directory — run the build first (build:vercel)");
  const all = walk(OUTPUT_DIR);
  if (!all.length) fail("No files in .output — run the build first");

  const projectSettings = {
    framework: null,
    buildCommand: null,
    devCommand: null,
    installCommand: null,
    outputDirectory: null,
    rootDirectory: null,
    serverlessFunctionRegion: REGION,
  };

  const files = [];
  const byRel = new Map();
  const bySha = new Map();
  for (const f of all) {
    const buf = fs.readFileSync(f.full);
    const sha = createHash("sha256").update(buf).digest("hex");
    files.push({ file: f.rel, sha, size: buf.length });
    byRel.set(f.rel, buf);
    bySha.set(sha, buf);
  }
  console.log(`Uploading ${files.length} files (${(files.reduce((a, f) => a + f.size, 0) / 1e6).toFixed(1)} MB)…`);

  const res = await api(`/v13/deployments?${team()}&skipAutoDetectionConfirmation=1`, {
    method: "POST",
    json: { name: PROJECT, target: "production", files, projectSettings },
  });
  if (!res.ok) fail(`Deployment creation failed [${res.status}]:`, res.data);

  const dep = res.data;
  fs.writeFileSync(STATE_FILE, JSON.stringify({ id: dep.id, url: dep.url }));

  if (Array.isArray(dep.missing) && dep.missing.length) {
    console.log(`Uploading ${dep.missing.length} missing file(s)…`);
    for (const m of dep.missing) {
      const buf = byRel.get(m.file) ?? bySha.get(m.sha);
      if (!buf) fail(`Missing file content for ${m.file ?? m.sha}`);
      const u = await api(`/v2/deployments/${m.deploymentId ?? dep.id}/files?${team()}&sha=${m.sha}`, {
        method: "POST",
        body: buf,
      });
      if (!u.ok) fail(`File upload failed for ${m.file} [${u.status}]:`, u.data);
    }
  }

  console.log(`Deployment created: ${dep.id}`);
  await waitFor(dep.id, 140);
}

async function poll() {
  if (!fs.existsSync(STATE_FILE)) fail("No previous deployment state found — run deploy first");
  const { id } = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  console.log(`Polling ${id}…`);
  await waitFor(id, 140);
}

const cmd = process.argv[2] ?? "";
if (cmd === "env") await setProjectEnv();
else if (cmd === "deploy") await deploy();
else if (cmd === "poll") await poll();
else fail(`Unknown command "${cmd}" — use env | deploy | poll`);
