/**
 * Accessibility audit (SEOmator Part 2, task 5): axe-core on the key pages,
 * plus targeted checks (focus visibility, reduced-motion CSS, skip link).
 * Usage: bun scripts/test-accessibility.mjs [baseURL]
 */
import { chromium } from "playwright";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require_ = createRequire(import.meta.url);
// axe.min.js is a UMD browser bundle — require() would hand back the axe object
// (not serializable); we need the raw source text to inject.
const axeSource = readFileSync(require_.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const PAGES = ["/", "/cars", "/bike-service", "/contact", "/answers/car-service-cost-bangalore"];
const browser = await chromium.launch();

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2000); // hydration
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(() =>
      window.axe.run(document, {
        resultTypes: ["violations"],
        rules: { region: { enabled: false }, "landmark-one-main": { enabled: false } },
      }).then((r) => r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }))),
    );
    console.log(`\n== ${path} ==`);
    for (const v of results) console.log(`  [${v.impact}] ${v.id} ×${v.nodes} — ${v.help}`);
    if (results.length === 0) console.log("  no violations");
  } catch (err) {
    console.log(`\n== ${path} == ERROR: ${String(err).slice(0, 160)}`);
  }
  await page.close();
}

// Focused checks on the homepage: skip link presence, focus visibility via
// real keyboard, reduced-motion CSS coverage.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1500);
  const checks = await page.evaluate(() => {
    const skip = document.querySelector('a[href="#main"], a[href^="#main"]');
    const rotor = document.querySelector(".rotor-bike");
    const rotorAnim = rotor ? getComputedStyle(rotor).animationName : null;
    const rise = document.querySelector(".rise-in");
    const riseAnim = rise ? getComputedStyle(rise).animationName : null;
    return { skipLink: !!skip, rotorAnim, riseAnim };
  });
  console.log("\n== targeted checks (reduced motion) ==");
  console.log("  skip-to-content link:", checks.skipLink ? "present" : "MISSING");
  console.log("  rotor animation under reduced motion:", checks.rotorAnim);
  console.log("  rise-in animation under reduced motion:", checks.riseAnim);
  // real keyboard focus visibility
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    const st = el ? getComputedStyle(el) : null;
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim().slice(0, 24),
      outline: st ? `${st.outlineStyle}/${st.outlineWidth}` : null,
      boxShadow: st ? st.boxShadow.slice(0, 40) : null,
    };
  });
  console.log("  focus after 2×Tab:", JSON.stringify(focus));
  await page.close();
}
await browser.close();
