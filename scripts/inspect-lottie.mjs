/**
 * Inspect the owner-provided animation page:
 *   https://lottiefiles.com/animation/sedan-car-animation_7000596
 * (shared via https://share.google/2FRdBrvcld7g6YN22)
 *
 * Reports: final title, og tags, any embedded Lottie JSON/dotLottie asset URLs,
 * and the visible license / download / sign-in wording. Lets the standard
 * Cloudflare browser challenge resolve on its own — never bypasses it.
 * Usage: bun scripts/inspect-lottie.mjs
 */
import { chromium } from "playwright";

const URL = "https://lottiefiles.com/animation/sedan-car-animation_7000596";

const browser = await chromium.launch({
  args: ["--disable-blink-features=AutomationControlled"],
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});

try {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45000 });
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(2500);
    const t = await page.title();
    if (!/just a moment/i.test(t)) break;
  }
  const title = await page.title();
  if (/just a moment/i.test(title)) {
    console.log(JSON.stringify({ status: "CHALLENGED", title }, null, 1));
  } else {
    const info = await page.evaluate(() => {
      const html = document.documentElement.innerHTML;
      const uniq = (re, n) => [...new Set(html.match(re) || [])].slice(0, n);
      const bodyText = document.body.innerText;
      const license = (
        bodyText.match(
          /.{0,100}(license|attribution|free download|sign in|log in|premium).{0,140}/gi,
        ) || []
      ).slice(0, 8);
      return {
        title: document.title,
        ogVideo: document
          .querySelector('meta[property="og:video"]')
          ?.getAttribute("content"),
        ogImage: document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content"),
        assetUrls: uniq(/https:\/\/assets\d*\.lottiefiles\.com[^"'\s\\]*/g, 8),
        hostUrls: uniq(/https:\/\/lottie\.host[^"'\s\\]*/g, 8),
        dotLottieUrls: uniq(/https:\/\/[^"'\s\\]+\.lottie/g, 8),
        license,
        head: bodyText.slice(0, 800),
      };
    });
    console.log(JSON.stringify(info, null, 1));
  }
} catch (e) {
  console.log("ERR " + String(e).slice(0, 300));
}
await browser.close();
