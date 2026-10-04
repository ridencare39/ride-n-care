/**
 * Read the verified Google rating from the LIVE homepage reviews section
 * (Trustindex widget / Places render) — no invented data, just extraction.
 * Usage: bun scripts/verify-rating.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`${BASE}/?v=${Date.now()}`, { waitUntil: "load" });
await page.waitForTimeout(2500);
await page.evaluate(() => document.getElementById("google-reviews")?.scrollIntoView());
await page.waitForTimeout(4000);

const out = { when: new Date().toISOString(), section: null, frames: [], ratingCandidates: [] };

const section = await page.evaluate(() => {
  const s = document.getElementById("google-reviews");
  if (!s) return null;
  return { present: true, text: s.innerText.replace(/\s+/g, " ").slice(0, 600), iframes: [...s.querySelectorAll("iframe")].map((f) => f.src) };
});
out.section = section;

// Trustindex widget may live in an iframe (cross-origin is fine for Playwright)
for (const f of page.frames()) {
  try {
    if (f === page.mainFrame()) continue;
    const t = await f.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    if (t && /review|rating|star|\d\.\d/i.test(t)) {
      out.frames.push({ url: f.url().slice(0, 90), text: t.replace(/\s+/g, " ").slice(0, 400) });
    }
  } catch {}
}

// Hunt any x.x / star-rating patterns everywhere incl. shadow-ish widgets
const all = await page.evaluate(() => {
  const html = document.getElementById("google-reviews")?.innerHTML ?? "";
  return html;
});
for (const m of all.matchAll(/(\d\.\d)\s*(?:\/\s*5|out of 5)/gi)) out.ratingCandidates.push(m[0]);
for (const m of all.matchAll(/(\d\.\d)/g)) out.ratingCandidates.push(m[1]);
out.ratingCandidates = [...new Set(out.ratingCandidates)].slice(0, 12);

// aria labels often carry "4.8 out of 5"
const aria = await page.evaluate(() => {
  const s = document.getElementById("google-reviews");
  if (!s) return [];
  return [...s.querySelectorAll("[aria-label]")].map((e) => e.getAttribute("aria-label")).filter((v) => v && /\d/.test(v)).slice(0, 10);
});
out.ariaLabels = aria;

await page.screenshot({ path: "/tmp/rating-source.png", fullPage: false });
console.log(JSON.stringify(out, null, 1));
await browser.close();
