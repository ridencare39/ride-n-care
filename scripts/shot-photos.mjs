/**
 * Preview screenshots for the photo-integration review.
 *
 * Captures, per page that received an owner photo:
 *   - the photo <figure> element at desktop (1280) and mobile (375)
 *   - the full homepage at both widths
 *
 * Usage: bun scripts/shot-photos.mjs [baseURL]   (default :8081)
 * Output: docs/preview/photos/<slug>-<width>.png (+ home-full-<width>.png)
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:8081";
const OUT = "docs/preview/photos";
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { path: "/", slug: "home", photo: "doorstep-service-apartment" },
  { path: "/", slug: "home-process", photo: "mechanic-tools-tray" },
  { path: "/bike-service", slug: "bike-service", photo: "royal-enfield-service-at-home" },
  { path: "/bike-repair", slug: "bike-repair", photo: "motorcycle-workshop-repair" },
  { path: "/doorstep-bike-service", slug: "doorstep-bike-service", photo: "doorstep-royal-enfield-repair" },
  { path: "/scooter-service", slug: "scooter-service", photo: "scooter-service-repair" },
  { path: "/about", slug: "about", photo: "ride-n-care-workshop-signage" },
];

const browser = await chromium.launch();

for (const width of [1280, 375]) {
  const ctx = await browser.newContext({
    viewport: { width, height: width === 1280 ? 900 : 800 },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();

  // Full homepage
  await p.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(1200);
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/home-full-${width}.png`, fullPage: true });
  console.log(`saved home-full-${width}.png`);

  // Each owner-photo figure
  for (const t of TARGETS) {
    if (t.path !== "/") {
      await p.goto(BASE + t.path, { waitUntil: "load", timeout: 60000 });
      await p.waitForTimeout(900);
    }
    const fig = p.locator(`figure:has(img[src*="${t.photo}"])`).first();
    try {
      await fig.scrollIntoViewIfNeeded({ timeout: 10000 });
      await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 10000 }).catch(() => {});
      await p.waitForTimeout(300);
      await fig.screenshot({ path: `${OUT}/${t.slug}-${width}.png`, timeout: 15000 });
      console.log(`saved ${t.slug}-${width}.png`);
    } catch (e) {
      console.log(`FAIL ${t.slug}-${width}: ${String(e).slice(0, 120)}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log("done");
