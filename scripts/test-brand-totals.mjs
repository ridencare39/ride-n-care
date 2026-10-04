/** Verify brand/model counts show in the booking modal. Usage: bun scripts/test-brand-totals.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8082";
const results = [];
function check(name, pass, note = "") { results.push(pass); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`); }

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));

await p.goto(BASE + "/", { waitUntil: "load" });

// Wait for React hydration (dev server can take several seconds in this sandbox).
let hydrated = false;
for (let i = 0; i < 60; i++) {
  await p.waitForTimeout(500);
  hydrated = await p.evaluate(() => {
    const btn = document.querySelector(".float-book");
    return !!btn && Object.keys(btn).some((k) => k.startsWith("__reactProps"));
  });
  if (hydrated) break;
}
check("React hydrated", hydrated);
if (!hydrated) { await browser.close(); process.exit(1); }
// reactProps ≠ committed (dev-cold effects lag): wait for the root layout's
// [data-root-ready] mount marker — set only after React commits (no scroll
// probes: scrolling during load was observed to interfere with hydration).
let committed = false;
for (let i = 0; i < 160; i++) {
  committed = await p.evaluate(() => !!document.querySelector("[data-root-ready]"));
  if (committed) break;
  await p.waitForTimeout(500);
}
check("React tree committed (effects flushed)", committed);

/** Poll until the predicate returns a value (max ~10s). */
async function until(fn, label) {
  for (let i = 0; i < 40; i++) {
    const v = await p.evaluate(fn);
    if (v) return v;
    await p.waitForTimeout(250);
  }
  console.log(`  (timeout waiting for ${label})`);
  return null;
}

/** The booking modal is the radix-portal dialog; the site-menu <aside> is also role=dialog, so scope to div. */
const DIALOG_SEL = 'div[role=dialog]';

// Open the booking modal (floating circular Book Now — the primary booking
// action since the hero CTA pair was removed per owner request 2026-10-04).
await p.evaluate(() => {
  document.querySelector(".float-book")?.click();
});

// Wait for the booking dialog itself to mount (lazy chunk).
await until(() => document.querySelector('div[role=dialog]') ? true : null, "booking dialog");

/** Click a button inside the booking modal by visible label (exact match preferred). */
async function clickInDialog(label) {
  await p.evaluate((lbl) => {
    const root = document.querySelector('div[role=dialog]');
    if (!root) return;
    const btns = [...root.querySelectorAll("button")];
    const exact = btns.find((b) => b.textContent?.trim() === lbl);
    const target = exact ?? btns.find((b) => b.textContent?.includes(lbl));
    target?.click();
  }, label);
}

// Step: vehicle — per-choice totals
const veh = await until(() => { const m = (document.querySelector('div[role=dialog]')?.textContent ?? "").match(/\d+ brands · \d+ models/g) ?? []; return m.length >= 2 ? m : null; }, "vehicle step");
check("vehicle step shows totals for both choices", Array.isArray(veh) && veh.length >= 2, (veh ?? []).join(" | "));
check("bike totals 30/348", (veh ?? []).some((t) => t.includes("30 brands · 348 models")));
check("car totals 13/53", (veh ?? []).some((t) => t.includes("13 brands · 53 models")));

// Click Bike → power step
await clickInDialog("Bike");
const pow = await until(() => { const m = (document.querySelector('div[role=dialog]')?.textContent ?? "").match(/\d+ brands · \d+ models/g) ?? []; return m.length >= 2 && m.some((t) => t.includes("17 brands")) ? m : null; }, "power step");
check("power step shows per-type totals (17/282 petrol, 13/66 EV)", Array.isArray(pow) && pow.some((t) => t.includes("17 brands · 282 models")) && pow.some((t) => t.includes("13 brands · 66 models")), (pow ?? []).join(" | "));

// Non-Electric → brand step
await clickInDialog("Non-Electric");
const brand = await until(() => { const note = [...document.querySelectorAll('div[role=dialog] p')].map((el) => el.textContent ?? "").find((t) => /brands · \d+ models available/.test(t)); return note || null; }, "brand step");
check("brand step header shows totals", /17 brands · 282 models available/.test(brand ?? ""), brand ?? "none");

// Pick Hero → model step
await clickInDialog("Hero");
const model = await until(() => [...document.querySelectorAll('div[role=dialog] p')].map((el) => el.textContent ?? "").find((t) => /models available/.test(t)) || null, "model step");
check("model step shows per-brand count (Hero = 38)", /Hero — 38 models available/.test(model ?? ""), model ?? "none");

check("no page errors", errors.length === 0, errors.slice(0, 2).join(" ;; "));

await p.screenshot({ path: "/tmp/brand-totals-model.png" }).catch(() => {});
await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`\n${results.length - fails}/${results.length} checks pass`);
process.exit(fails ? 1 : 0);
