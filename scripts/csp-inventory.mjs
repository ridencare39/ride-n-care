/**
 * CSP inventory (Part 2, task 6): record every cross-origin request the site
 * makes at runtime (reviews widget, GA4, map iframe, booking flow) so the CSP
 * allowlist is evidence-based.
 * Usage: bun scripts/csp-inventory.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const browser = await chromium.launch();
const requests = new Map();

function record(url, type) {
  try {
    const u = new URL(url);
    if (u.origin === new URL(BASE).origin) return;
    const key = `${u.origin} [${type}] ${u.pathname.slice(0, 40)}`;
    requests.set(key, (requests.get(key) ?? 0) + 1);
  } catch {}
}

async function run(path, extra) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on("request", (r) => record(r.url(), r.resourceType()));
  if (extra === "scroll") {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(3000);
  } else if (extra === "booking") {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Book Now"))?.click());
    await page.waitForTimeout(3500);
  } else {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(3000);
  }
  await context.close();
}

await run("/", "scroll");       // reviews widget + GA
await run("/", "booking");      // booking modal (Supabase via server fns)
await run("/map", "plain");     // Google Maps iframe
await run("/contact", "plain"); // GA + tel links

for (const [k, n] of [...requests.entries()].sort()) console.log(`${String(n).padStart(3)}×  ${k}`);
await browser.close();
