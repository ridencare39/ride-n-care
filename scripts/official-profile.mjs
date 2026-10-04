/**
 * 1) Capture the "View all reviews on Google" href from the live homepage
 *    (identifies the official GBP the site is wired to).
 * 2) Open that exact listing and read its aggregate rating + review count.
 * Usage: bun scripts/official-profile.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 1000 },
  locale: "en-US",
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});
const out = { when: new Date().toISOString() };

// ── 1. the site's own Google link ──
const p = await ctx.newPage();
await p.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(2000);
for (let i = 0; i < 40; i++) {
  await p.mouse.wheel(0, 420);
  await p.waitForTimeout(280);
  if (await p.evaluate(() => document.querySelectorAll(".ti-review-item").length >= 3)) break;
}
out.siteLink = await p.evaluate(() => {
  const s = document.getElementById("google-reviews");
  const a = s ? [...s.querySelectorAll("a")].find((x) => /google|maps|review/i.test(x.href + x.textContent)) : null;
  return a ? { href: a.href, text: a.textContent.trim().slice(0, 60) } : null;
});
await p.close();

// ── 2. open the official listing and read the aggregate ──
if (out.siteLink?.href) {
  try {
    const m = await ctx.newPage();
    await m.goto(out.siteLink.href, { waitUntil: "domcontentloaded", timeout: 45000 });
    await m.waitForTimeout(6000);
    out.listing = await m.evaluate(() => {
      const role = document.querySelector('div[role="main"]');
      const text = (role?.innerText ?? "").replace(/\s+/g, " ").slice(0, 400);
      const aria = [...document.querySelectorAll('[aria-label*="star" i]')].map((e) => e.getAttribute("aria-label")).slice(0, 4);
      const m1 = text.match(/(\d\.\d)/);
      const m2 = text.match(/(\d[\d,]*)\s*reviews?/i);
      return { text, rating: m1?.[1] ?? null, count: m2?.[1] ?? null, aria, url: location.href.slice(0, 160) };
    });
    await m.screenshot({ path: "/tmp/official-listing.png" });
    await m.close();
  } catch (e) {
    out.listing = { error: String(e).slice(0, 150) };
  }
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
