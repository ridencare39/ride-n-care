#!/usr/bin/env node
/**
 * Purge the Cloudflare zone cache after every deploy (chained into `bun run deploy`).
 *
 * Why: HTML responses carry `s-maxage=60, stale-while-revalidate=300` so a
 * Cloudflare cache rule (if the owner enables one) can hold HTML for a short
 * window. This script makes deploys self-cleaning: whatever an edge may have
 * cached from the previous build is purged the moment the new Worker is live.
 *
 * Requires CLOUDFLARE_API_TOKEN (+ optional CLOUDFLARE_ACCOUNT_ID) in the
 * environment — the same token wrangler deploy already uses. Values are never
 * printed.
 */

const ZONE_NAME = "ridencare.co.in";
const API = "https://api.cloudflare.com/client/v4";

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.warn("purge-cache: CLOUDFLARE_API_TOKEN not set — skipping cache purge.");
  process.exit(0);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function cf(path, init) {
  const res = await fetch(`${API}${path}`, { headers, ...init });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

// 1. Look up the zone (scoped to the account when the account id is present).
const acct = process.env.CLOUDFLARE_ACCOUNT_ID ? `&account.id=${process.env.CLOUDFLARE_ACCOUNT_ID}` : "";
const zoneRes = await cf(`/zones?name=${ZONE_NAME}${acct}`);
const zone = zoneRes.data?.result?.[0];
if (!zone) {
  // Non-fatal: HTML carries s-maxage=60 + stale-while-revalidate=300, so a
  // failed purge only ever leaves ≤60 s of stale HTML, not a broken deploy.
  console.warn(
    `purge-cache: zone "${ZONE_NAME}" not found (HTTP ${zoneRes.status}) — skipping purge.` +
      (zoneRes.data?.errors?.length ? ` ${JSON.stringify(zoneRes.data.errors)}` : "") +
      " (a Zone.Cache Purge-scoped token is needed for automatic purges.)",
  );
  process.exit(0);
}

// 2. Purge everything for the zone.
const purge = await cf(`/zones/${zone.id}/purge_cache`, {
  method: "POST",
  body: JSON.stringify({ purge_everything: true }),
});
if (!purge.ok || !purge.data?.success) {
  // Non-fatal for the same reason as above (≤60 s s-maxage bounds staleness).
  console.warn(
    `purge-cache: purge failed for ${ZONE_NAME} (HTTP ${purge.status}) — continuing.` +
      (purge.data?.errors?.length ? ` ${JSON.stringify(purge.data.errors)}` : ""),
  );
  process.exit(0);
}

console.log(`purge-cache: purged Cloudflare cache for ${ZONE_NAME} (zone ${zone.id}).`);
