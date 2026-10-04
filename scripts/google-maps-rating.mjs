/**
 * Read the official Google Maps / Google Search listing rating for
 * Ride N Care — the authoritative Google Business Profile aggregate.
 * Usage: bun scripts/google-maps-rating.mjs
 */
import { chromium } from "playwright";

const browser = await chromium.launch({
  args: ["--lang=en-US"],
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: "en-US",
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});
const p = await ctx.newPage();
const out = { when: new Date().toISOString() };

// ── 1. Google Maps place page ──
try {
  await p.goto("https://www.google.com/maps/search/Ride+N+Care+bike+service+Bangalore", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await p.waitForTimeout(5000);
  const maps = await p.evaluate(() => {
    const main = document.querySelector('div[role="main"]');
    const text = (main?.innerText ?? "").replace(/\s+/g, " ").slice(0, 500);
    // rating lives in the place header: "4.8 ★★★★★ (120)"
    const m = text.match(/(\d\.\d)\s*[★☆]?\s*\(?(\d[\d,]*)\s*reviews?\)?/i);
    const m2 = text.match(/(\d\.\d)/);
    const stars = document.querySelector('[role="main"] [aria-label*="star" i]');
    return {
      text,
      rating: m?.[1] ?? m2?.[1] ?? null,
      count: m?.[2] ?? null,
      aria: stars?.getAttribute("aria-label") ?? null,
      url: location.href,
    };
  });
  out.maps = maps;
} catch (e) {
  out.maps = { error: String(e).slice(0, 150) };
}

// ── 2. Google Search knowledge panel (fallback) ──
try {
  const p2 = await ctx.newPage();
  await p2.goto("https://www.google.com/search?q=Ride+N+Care+bangalore+reviews", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await p2.waitForTimeout(3500);
  const search = await p2.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, " ").slice(0, 1200);
    const m = text.match(/(\d\.\d)\s*[★☆]/);
    const m2 = text.match(/(\d\.\d)\s*\(?(\d[\d,]*)\s*reviews?\)?/i);
    return { rating: m2?.[1] ?? m?.[1] ?? null, count: m2?.[2] ?? null, snippet: text.slice(0, 300) };
  });
  out.search = search;
  await p2.close();
} catch (e) {
  out.search = { error: String(e).slice(0, 150) };
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
