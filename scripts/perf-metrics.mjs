/**
 * Performance metrics for the SEOmator Part 1 before/after comparison.
 * Usage: bun scripts/perf-metrics.mjs [baseURL] [label]
 *
 * Measures, per page: LCP (+ element identity), CLS, FCP, TTFB, total script
 * transfer bytes, unused JS bytes (CDP precise coverage), DOM element count,
 * and HTML document size. Prints one JSON block per page.
 *
 * Read-only: navigates production, makes no changes.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const LABEL = process.argv[3] ?? "";
const PAGES = ["/", "/cars", "/bike-service"];

const browser = await chromium.launch();

async function measure(path) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // mobile viewport: LCP-critical case
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__perf = { lcp: null, cls: 0, fcp: null, lcpElement: null };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      window.__perf.lcp = last.startTime;
      const el = last.element;
      if (el) {
        window.__perf.lcpElement = {
          tag: el.tagName,
          src: el.currentSrc || el.src || null,
          text: (el.textContent || "").trim().slice(0, 60),
          cls: String(el.className || "").slice(0, 80),
        };
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__perf.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      const fcp = list.getEntries().find((e) => e.name === "first-contentful-paint");
      if (fcp) window.__perf.fcp = fcp.startTime;
    }).observe({ type: "paint", buffered: true });
  });

  const cdp = await context.newCDPSession(page);
  await cdp.send("Profiler.enable");
  await cdp.send("Debugger.enable");
  await cdp.send("Profiler.startPreciseCoverage", { callCount: false, detailed: false });

  const resp = await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(5000); // let LCP settle + lazy work

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const scriptBytes = resources
      .filter((r) => r.initiatorType === "script")
      .reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const scriptCount = resources.filter((r) => r.initiatorType === "script").length;
    const imgBytes = resources
      .filter((r) => r.initiatorType === "img" || r.initiatorType === "css" || r.initiatorType === "link")
      .reduce((sum, r) => sum + (r.transferSize || 0), 0);
    return {
      lcp: window.__perf.lcp,
      lcpElement: window.__perf.lcpElement,
      cls: window.__perf.cls,
      fcp: window.__perf.fcp,
      ttfb: nav ? nav.responseStart : null,
      domElements: document.getElementsByTagName("*").length,
      htmlBytes: nav ? nav.decodedBodySize : null,
      scriptBytes,
      scriptCount,
      otherBytes: imgBytes,
    };
  });

  // Unused JS: union of executed ranges vs script source length (same-origin only).
  let coverage = { totalBytes: 0, usedBytes: 0 };
  try {
    const { result } = await cdp.send("Profiler.takePreciseCoverage");
    await cdp.send("Profiler.stopPreciseCoverage");
    for (const script of result) {
      if (!script.url || !script.url.includes(new URL(BASE).host)) continue;
      if (script.url.startsWith("data:")) continue;
      try {
        const { scriptSource } = await cdp.send("Debugger.getScriptSource", { scriptId: script.scriptId });
        if (!scriptSource || scriptSource.length < 500) continue; // skip tiny inline shims
        const ranges = [];
        for (const fn of script.functions) {
          for (const r of fn.ranges) {
            if (r.count > 0) ranges.push([r.startOffset, r.endOffset]);
          }
        }
        ranges.sort((a, b) => a[0] - b[0]);
        let used = 0;
        let curEnd = 0;
        for (const [s, e] of ranges) {
          const start = Math.max(s, curEnd);
          if (e > start) used += e - start;
          curEnd = Math.max(curEnd, e);
        }
        coverage.totalBytes += scriptSource.length;
        coverage.usedBytes += Math.min(used, scriptSource.length);
      } catch {
        /* script source unavailable — skip */
      }
    }
  } catch {
    /* coverage unavailable */
  }

  await context.close();
  return {
    path,
    status: resp ? resp.status() : null,
    ...perf,
    unusedJsBytes: Math.max(0, coverage.totalBytes - coverage.usedBytes),
    coveredJsBytes: coverage.totalBytes,
    lcp: perf.lcp != null ? Math.round(perf.lcp) : null,
    fcp: perf.fcp != null ? Math.round(perf.fcp) : null,
    ttfb: perf.ttfb != null ? Math.round(perf.ttfb) : null,
    cls: Number(perf.cls.toFixed(4)),
  };
}

console.log(`# perf-metrics ${LABEL} base=${BASE} ${new Date().toISOString()}`);
for (const p of PAGES) {
  try {
    const m = await measure(p);
    console.log(JSON.stringify(m));
  } catch (err) {
    console.log(JSON.stringify({ path: p, error: String(err).slice(0, 200) }));
  }
  await new Promise((r) => setTimeout(r, 2500)); // be polite to the CDN
}
await browser.close();
