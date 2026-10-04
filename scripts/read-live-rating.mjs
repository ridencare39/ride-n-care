/**
 * Mount the Trustindex Google Reviews widget (requires simulated user scroll)
 * and extract the aggregate rating it displays from live Google data.
 * Usage: bun scripts/read-live-rating.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
await p.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(2500);

let mounted = false;
for (let i = 0; i < 40; i++) {
  await p.mouse.wheel(0, 420);
  await p.waitForTimeout(300);
  mounted = await p.evaluate(() => !!document.querySelector(".ti-widget"));
  if (mounted) break;
}

let data = null;
for (let i = 0; i < 25; i++) {
  await p.waitForTimeout(1000);
  data = await p.evaluate(() => {
    const w = document.querySelector(".ti-widget");
    if (!w) return null;
    const aria = [...w.querySelectorAll("[aria-label]")]
      .map((e) => e.getAttribute("aria-label"))
      .filter((v) => v && /\d/.test(v) && /star|rating|review/i.test(v));
    const ratingish = [...w.querySelectorAll("[class*=rating], [class*=Rating], [class*=score], [class*=star]")]
      .map((e) => ({ cls: String(e.className).slice(0, 40), text: (e.textContent ?? "").trim().slice(0, 60) }))
      .filter((x) => x.text && /\d/.test(x.text));
    // header area of the widget (first 300 chars usually holds the aggregate)
    return {
      widgetText: w.innerText.replace(/\s+/g, " ").slice(0, 500),
      ariaLabels: [...new Set(aria)].slice(0, 8),
      ratingEls: ratingish.slice(0, 12),
      reviewItems: document.querySelectorAll(".ti-review-item").length,
      aggregate: w.innerText.match(/(\d\.\d)\s*(?:\/\s*5|out of 5)/i)?.[0] ?? null,
      countLike: w.innerText.match(/\((\d[\d,]*)\s*reviews?\)|(\d[\d,]*)\s*reviews?/i)?.[0] ?? null,
    };
  });
  if (data && data.reviewItems >= 3 && (data.aggregate || data.ariaLabels.length)) break;
}

console.log(JSON.stringify({ when: new Date().toISOString(), mounted, data }, null, 1));
await p.screenshot({ path: "/tmp/live-rating-widget.png" }).catch(() => {});
await browser.close();
