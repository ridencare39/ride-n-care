/**
 * Focused follow-up: locate the sticky Call/WhatsApp bar in the DOM and the
 * hero inner padding container, at scroll 0 and at page bottom.
 * Usage: bun scripts/inspect-bar.mjs [baseURL]
 */
import { chromium } from "playwright";
const BASE = process.argv[2] ?? "http://localhost:8080";
const browser = await chromium.launch();
for (const [w, label] of [[390, "mobile"], [1280, "desktop"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE + "/?v=" + Date.now(), { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const out = {};
    // hero inner container with pt-6 pb-16 md:pt-10 md:pb-24
    const hero = document.querySelector("section.navy-sheen");
    const heroInner = hero ? [...hero.querySelectorAll("div")].find((d) => getComputedStyle(d).paddingBottom !== "0px" && d.className.includes("pb-16")) : null;
    out.heroInner = heroInner
      ? { cls: String(heroInner.className).slice(0, 140), pb: getComputedStyle(heroInner).paddingBottom, pt: getComputedStyle(heroInner).paddingTop }
      : null;
    // sticky bar
    const bar = document.querySelector("div.sticky.bottom-0");
    if (bar) {
      const chain = [];
      let n = bar;
      while (n && n !== document.body) {
        chain.push(`${n.tagName.toLowerCase()}${n.id ? "#" + n.id : ""}.${String(n.className).split(" ").slice(0, 4).join(".")}`);
        n = n.parentElement;
      }
      const r = bar.getBoundingClientRect();
      out.bar = {
        chain,
        position: getComputedStyle(bar).position,
        naturalTopAtScroll0: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
        nextSectionTop: (() => {
          const h2 = [...document.querySelectorAll("h2")].find((h) => /friendliest doorstep mechanics/i.test(h.textContent));
          const seo = h2?.closest("section");
          return seo ? Math.round(seo.getBoundingClientRect().top + window.scrollY) : null;
        })(),
      };
    }
    // viewport overlap at page bottom: does bar cover trust-section content?
    window.scrollTo(0, document.body.scrollHeight);
    return out;
  });
  await page.waitForTimeout(400);
  const atBottom = await page.evaluate(() => {
    const bar = document.querySelector("div.sticky.bottom-0");
    const h2 = [...document.querySelectorAll("h2")].find((h) => /friendliest doorstep mechanics/i.test(h.textContent));
    const br = bar?.getBoundingClientRect();
    const hr = h2?.getBoundingClientRect();
    return {
      barBottomPx: br ? Math.round(br.bottom) : null,
      barTopPx: br ? Math.round(br.top) : null,
      h2Visible: hr ? hr.top < window.innerHeight && hr.bottom > 0 : false,
      h2Top: hr ? Math.round(hr.top) : null,
      viewportH: window.innerHeight,
    };
  });
  console.log(`\n===== ${label} (${w}px) =====`);
  console.log(JSON.stringify({ ...info, atBottom }, null, 1));
  await page.close();
}
await browser.close();
