/**
 * Disambiguate the official listing: for each Maps candidate, read the exact
 * aggregate rating + review count and sample reviewer names to match against
 * the names the live Trustindex widget displays (Sai Vamsi, Shwenga Rengma...).
 * Usage: bun scripts/match-listing.mjs
 */
import { chromium } from "playwright";

const WIDGET_NAMES = ["Sai Vamsi", "Shwenga Rengma", "Ashutosh Mishra", "Gokul Shetty", "Ankur keshari", "Parth Agarwal", "Ruksana Ahmed"];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 1000 },
  locale: "en-US",
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});
const p = await ctx.newPage();

await p.goto("https://www.google.com/maps/search/Ride+N+Care+bangalore", { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForTimeout(5000);

// collect result links
const results = await p.evaluate(() => {
  return [...document.querySelectorAll('a[href*="/maps/place/"]')]
    .map((a) => ({ href: a.href, label: (a.getAttribute("aria-label") ?? a.textContent ?? "").replace(/\s+/g, " ").slice(0, 120) }))
    .filter((r) => /ride n care/i.test(r.label))
    .slice(0, 5);
});
console.log("CANDIDATES:", JSON.stringify(results.map((r) => r.label), null, 1));

const report = [];
for (const r of results) {
  const page = await ctx.newPage();
  try {
    await page.goto(r.href, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    // open reviews tab
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button, [role="tab"], a')].find((b) => /reviews/i.test(b.getAttribute("aria-label") ?? b.textContent ?? "") && /review/i.test(b.getAttribute("aria-label") ?? ""));
      if (btn) { btn.click(); return true; }
      return false;
    });
    await page.waitForTimeout(3500);
    const info = await page.evaluate((names) => {
      const main = document.querySelector('div[role="main"]');
      const text = (main?.innerText ?? "").replace(/\s+/g, " ");
      const rating = text.match(/(\d\.\d)/)?.[1] ?? null;
      const count = text.match(/([\d,]+)\s*reviews?/i)?.[1] ?? null;
      const aria = [...document.querySelectorAll('[aria-label*="star" i]')].map((e) => e.getAttribute("aria-label")).filter((v) => v && v.trim()).slice(0, 3);
      const matched = names.filter((n) => text.includes(n));
      const header = text.slice(0, 220);
      return { rating, count, aria, matched, header, phone: /\+91\s*82969\s*50339|82969\s*50339/.test(text) };
    }, WIDGET_NAMES);
    report.push({ label: r.label, clicked, ...info });
  } catch (e) {
    report.push({ label: r.label, error: String(e).slice(0, 120) });
  }
  await page.close();
}

console.log(JSON.stringify({ when: new Date().toISOString(), report }, null, 1));
await browser.close();
