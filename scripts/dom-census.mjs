/**
 * Diagnostic (temporary): DOM element census of the homepage by section.
 * Usage: bun scripts/dom-census.mjs [url]
 */
import { chromium } from "playwright";

const URL_ = process.argv[2] ?? "https://ridencare.co.in/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(URL_, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(2500);

const out = await page.evaluate(() => {
  const total = document.getElementsByTagName("*").length;
  const counts = {};
  const sections = document.querySelectorAll("body > div > main > section, body > div > main > article, body > div > main > div");
  sections.forEach((s, i) => {
    const key = `section[${i}] ` + (s.id || s.getAttribute("aria-label") || (s.querySelector("h2,h1")?.textContent || "").trim().slice(0, 38) || s.className.slice(0, 30));
    counts[key] = s.getElementsByTagName("*").length;
  });
  // Direct chrome (header + footer + float bar) element counts
  const header = document.querySelector("header")?.getElementsByTagName("*").length ?? 0;
  const footer = document.querySelector("footer")?.getElementsByTagName("*").length ?? 0;
  const float = document.querySelector(".float-bar")?.getElementsByTagName("*").length ?? 0;
  const panel = document.getElementById("site-menu-panel")?.getElementsByTagName("*").length ?? 0;
  const menu = document.getElementById("services-menu")?.getElementsByTagName("*").length ?? 0;
  return { total, chrome: { header, footer, floatBar: float, panel, servicesMenu: menu }, sections: counts };
});

console.log(JSON.stringify(out, null, 1));
await browser.close();
