/**
 * 45-day warranty rollout verification:
 *  - /guarantee page: title, description, robots, canonical, H1, FAQPage JSON-LD,
 *    claim contact links, no old 7-day wording
 *  - site-wide sweep: no "7-day" / "seven days" in visible text of key pages
 *  - sitemap contains /guarantee
 * Usage: bun scripts/verify-warranty.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });

// ── /guarantee warranty page ──
await page.goto(`${BASE}/guarantee?v=${Date.now()}`, { waitUntil: "load" });
await page.waitForTimeout(900);
const w = await page.evaluate(() => {
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
    try { return JSON.parse(s.textContent); } catch { return null; }
  }).filter(Boolean);
  const faq = ld.flatMap((g) => g["@graph"] ?? [g]).find((n) => n["@type"] === "FAQPage");
  const bodyText = document.body.innerText;
  return {
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? "",
    robots: document.querySelector('meta[name="robots"]')?.content ?? "(absent = indexable)",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    h1: document.querySelector("h1")?.textContent.trim() ?? "",
    faqCount: faq?.mainEntity?.length ?? 0,
    hasTel: !!document.querySelector('a[href^="tel:+918069409289"]'),
    hasWa: !!document.querySelector('a[href^="https://wa.me/918296950339"]'),
    has7: /7[\s-]?day|seven days/i.test(bodyText),
    has45: bodyText.includes("45-day") || bodyText.includes("45-Day"),
    ldTypes: ld.flatMap((g) => g["@graph"]?.map((n) => n["@type"]) ?? [g["@type"]]).filter(Boolean).join(","),
  };
});
check("warranty: title", w.title === "45-Day Service Warranty in Bangalore | Ride N Care", w.title);
check("warranty: description mentions 45-day + Bangalore", /45-day/.test(w.desc) && /Bangalore/.test(w.desc));
check("warranty: robots indexable", w.robots === "(absent = indexable)" || /index/i.test(w.robots), w.robots);
check("warranty: canonical /guarantee", w.canonical === "https://ridencare.co.in/guarantee", w.canonical);
check("warranty: H1", w.h1 === "Our 45-Day Service Warranty", w.h1);
check("warranty: FAQPage JSON-LD with 6 Q&As", w.faqCount === 6, `n=${w.faqCount}`);
check("warranty: call link", w.hasTel);
check("warranty: WhatsApp link", w.hasWa);
check("warranty: no old 7-day wording", !w.has7);
check("warranty: 45-day present", w.has45);
check("warranty: schema types", /FAQPage/.test(w.ldTypes) && /WebPage/.test(w.ldTypes), w.ldTypes.slice(0, 80));
await page.screenshot({ path: "/tmp/warranty-mobile.png", fullPage: false });

// ── site-wide visible-text sweep ──
const PAGES = ["/", "/faq", "/terms", "/about", "/contact", "/privacy", "/cars", "/bikes", "/bike-service", "/bike-repair", "/car-periodic-service", "/breakdown-assistance", "/areas/hsr-layout", "/answers/guarantee", "/doorstep-bike-service/btm-layout"];
for (const p of PAGES) {
  try {
    await page.goto(`${BASE}${p}?v=${Date.now()}`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const t = await page.evaluate(() => document.body.innerText);
    const hasOld = /7[\s-]?day|seven days/i.test(t);
    const hasNew = /45[\s-]?day/i.test(t);
    check(`sweep: ${p} no 7-day`, !hasOld, hasOld ? (t.match(/.{0,40}7[\s-]?day.{0,40}/i)?.[0] ?? "") : `45-day present=${hasNew}`);
  } catch (e) {
    check(`sweep: ${p}`, false, String(e).slice(0, 100));
  }
}

// ── sitemap ──
try {
  const res = await fetch(`${BASE}/sitemap.xml?v=${Date.now()}`);
  const xml = await res.text();
  const urls = (xml.match(/<loc>/g) ?? []).length;
  check("sitemap: contains /guarantee", xml.includes("<loc>https://ridencare.co.in/guarantee</loc>"));
  check("sitemap: 230 urls", urls === 230, `n=${urls}`);
} catch (e) {
  check("sitemap", false, String(e).slice(0, 100));
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
