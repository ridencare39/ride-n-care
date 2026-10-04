/**
 * Measure the vertical gap chain: hero trust strip bottom → the
 * "Bangalore's friendliest doorstep mechanics" H2 top, mobile + desktop.
 * Reports every contributing box (with its padding) so the responsible
 * spacing is identified from the live layout, not guessed.
 * Usage: bun scripts/measure-gap.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8080";
const browser = await chromium.launch();

for (const [w, label] of [[390, "mobile"], [1280, "desktop"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE + "/?v=" + Date.now(), { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const m = await page.evaluate(() => {
    const strip = document.querySelector('ul[aria-label="Ride N Care trust highlights"]');
    const h2 = [...document.querySelectorAll("h2")].find((h) =>
      /friendliest doorstep mechanics/i.test(h.textContent),
    );
    const trustSection = document.querySelector('section[aria-label="Why riders trust Ride N Care"]');
    const hero = document.querySelector("section.navy-sheen") ?? strip?.closest("section");
    const seoSection = h2?.closest("section");
    const rect = (el) => (el ? { top: Math.round(el.getBoundingClientRect().top), bottom: Math.round(el.getBoundingClientRect().bottom), h: Math.round(el.getBoundingClientRect().height) } : null);
    const cs = (el, props) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, s.getPropertyValue(p)]));
    };
    const trustPoints = trustSection?.firstElementChild;
    const out = {
      strip: rect(strip),
      hero: rect(hero),
      heroPad: cs(hero, ["padding-top", "padding-bottom"]),
      trustSection: rect(trustSection),
      trustPad: cs(trustSection, ["padding-top", "padding-bottom"]),
      trustPoints: rect(trustPoints),
      trustPointsInfo: trustPoints
        ? { cls: trustPoints.className, pad: cs(trustPoints, ["padding-top", "padding-bottom", "margin-top", "margin-bottom"]) }
        : null,
      seoSection: rect(seoSection),
      seoPad: cs(seoSection, ["padding-top", "padding-bottom"]),
      h2: rect(h2),
    };
    out.gapStripToH2 = out.h2.top - out.strip.bottom;
    out.gapStripToTrustSection = out.trustSection.top - out.strip.bottom;
    out.gapTrustSectionToSeo = out.seoSection.top - out.trustSection.bottom;
    // list all elements between strip and h2 that occupy space (flow boxes)
    out.between = [];
    if (strip && h2) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let n;
      while ((n = walker.nextNode())) {
        const r = n.getBoundingClientRect();
        if (r.height > 0 && r.top >= strip.getBoundingClientRect().bottom - 2 && r.bottom <= h2.getBoundingClientRect().top + 2) {
          const s = getComputedStyle(n);
          if (s.position === "fixed" || s.position === "absolute") continue;
          const pt = parseFloat(s.paddingTop) || 0;
          const pb = parseFloat(s.paddingBottom) || 0;
          const mt = parseFloat(s.marginTop) || 0;
          const mb = parseFloat(s.marginBottom) || 0;
          if (pt || pb || mt || mb) {
            out.between.push({
              tag: n.tagName.toLowerCase(),
              cls: String(n.className).slice(0, 90),
              h: Math.round(r.height),
              pt, pb, mt, mb,
            });
          }
        }
      }
    }
    return out;
  });
  console.log(`\n===== ${label} (${w}px) =====`);
  console.log(JSON.stringify(m, null, 1));
  // annotated screenshot of the region
  await page.screenshot({ path: `/tmp/gap-${label}-full.png`, fullPage: false });
  await page.evaluate(() => window.scrollTo(0, 0));
  const clipH = 1400;
  await page.screenshot({
    path: `/tmp/gap-${label}-region.png`,
    clip: { x: 0, y: Math.max(0, (await page.evaluate(() => document.querySelector('ul[aria-label="Ride N Care trust highlights"]')?.getBoundingClientRect().bottom + window.scrollY - 60)) ?? 0), width: w, height: clipH },
  });
  await page.close();
}
await browser.close();
