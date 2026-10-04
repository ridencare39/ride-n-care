/**
 * Capture the data payload the Trustindex widget loads and extract the
 * aggregate Google rating/count from it (first-party to the integration).
 * Usage: bun scripts/capture-rating-api.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

const jsonHits = [];
p.on("response", async (res) => {
  const url = res.url();
  if (!/trustindex/i.test(url)) return;
  const ct = res.headers()["content-type"] ?? "";
  if (!/json/.test(ct)) return;
  try {
    const body = await res.text();
    jsonHits.push({ url: url.slice(0, 120), len: body.length, body });
  } catch {}
});

await p.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(2000);
for (let i = 0; i < 40; i++) {
  await p.mouse.wheel(0, 420);
  await p.waitForTimeout(280);
  const done = await p.evaluate(() => document.querySelectorAll(".ti-review-item").length);
  if (done >= 3) break;
}
await p.waitForTimeout(4000);

const report = { when: new Date().toISOString(), payloads: [], rating: null, count: null };
for (const h of jsonHits) {
  report.payloads.push({ url: h.url, len: h.len });
  // look for aggregate fields in any payload
  const m =
    h.body.match(/"average"\s*:\s*(\d+(?:\.\d+)?)/i) ??
    h.body.match(/"rating"\s*:\s*(\d+(?:\.\d+)?)/i) ??
    h.body.match(/"ratingValue"\s*:\s*"?(\d+(?:\.\d+)?)/i);
  const c =
    h.body.match(/"reviewsCount"\s*:\s*"?(\d[\d,]*)/i) ??
    h.body.match(/"reviewCount"\s*:\s*"?(\d[\d,]*)/i) ??
    h.body.match(/"userRatingCount"\s*:\s*"?(\d[\d,]*)/i) ??
    h.body.match(/"count"\s*:\s*"?(\d[\d,]*)/i);
  if (m && !report.rating) report.rating = { value: m[1], source: h.url.slice(0, 90) };
  if (c && !report.count) report.count = { value: c[1], source: h.url.slice(0, 90) };
}

// Also compute the mean of the individual review star ratings actually rendered
const rendered = await p.evaluate(() => {
  const items = [...document.querySelectorAll(".ti-review-item")];
  const stars = items.map((it) => {
    const full = it.querySelectorAll('[class*="star"].on, [class*="Star"].on, .ti-star.on, img[src*="star"]').length;
    const label = it.getAttribute("aria-label") ?? "";
    return { full, label };
  });
  return { n: items.length, stars };
});
report.rendered = rendered;

console.log(JSON.stringify(report, null, 1).slice(0, 3000));
await browser.close();
