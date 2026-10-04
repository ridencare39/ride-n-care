/**
 * Diagnostic (temporary): LCP candidate A/B tests for the homepage hero.
 * Usage: bun scripts/lcp-debug.mjs [url]
 */
import { chromium } from "playwright";

const URL_ = process.argv[2] ?? "https://ridencare.co.in/";
const browser = await chromium.launch();

async function run(label, { reducedMotion = false, injectCss = null } = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__lcp.push({
          t: Math.round(e.startTime),
          size: e.size,
          tag: e.element ? e.element.tagName : null,
          text: e.element ? (e.element.textContent || "").trim().slice(0, 44) : null,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  if (injectCss) {
    await page.route(URL_.replace(/\/$/, "") + "/**", async (route) => {
      if (route.request().resourceType() !== "document") return route.continue();
      const resp = await route.fetch();
      let body = await resp.text();
      body = body.replace("</head>", `<style>${injectCss}</style></head>`);
      await route.fulfill({ response: resp, body });
    });
  }
  await page.goto(URL_, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(5000);
  const lcp = await page.evaluate(() => window.__lcp);
  console.log(`\n== ${label} ==`);
  for (const e of lcp) console.log(` ${e.t}ms size=${e.size} ${e.tag} ${e.text}`);
  await context.close();
}

await run("baseline");
await run("prefers-reduced-motion: reduce", { reducedMotion: true });
await run("rotor animation off (both words static)", {
  injectCss: ".rotor-bike,.rotor-car{animation:none!important}.rotor-car{opacity:1!important}",
});
await run("rise-in off only", {
  injectCss: ".rise-in,.rise-in-late,.rise-in-later{animation:none!important}",
});
await browser.close();
