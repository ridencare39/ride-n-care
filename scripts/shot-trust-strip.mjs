/**
 * Trust-strip design preview shots + content assertions.
 * Usage: bun scripts/shot-trust-strip.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

const browser = await chromium.launch();

for (const [w, label] of [[390, "mobile"], [1280, "desktop"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  try {
    await page.goto(BASE + "/?v=" + Date.now(), { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const ul = document.querySelector('ul[aria-label="Ride N Care trust highlights"]');
      if (!ul) return null;
      const items = [...ul.querySelectorAll("li")].map((li) => li.textContent.trim());
      const r = ul.getBoundingClientRect();
      const heroCtas = [...document.querySelectorAll("section .hero-cta")];
      const ctas = heroCtas.map((b) => b.textContent.trim());
      // strip must sit below the hero CTA grid
      const ctaGrid = heroCtas[0]?.closest(".grid");
      const belowCtas = ctaGrid ? ul.getBoundingClientRect().top >= ctaGrid.getBoundingClientRect().bottom - 1 : false;
      const icons = ul.querySelectorAll("svg").length;
      const firstLi = ul.querySelector("li");
      const starSvgs = firstLi ? firstLi.querySelectorAll("svg.lucide").length : 0;
      const googleMarks = firstLi ? firstLi.querySelectorAll("svg:not(.lucide)").length : 0;
      const srLabel = firstLi?.querySelector('[role="img"]')?.getAttribute("aria-label") ?? "";
      return { items, w: Math.round(r.width), h: Math.round(r.height), ctas, belowCtas, icons, starSvgs, googleMarks, srLabel, text: ul.textContent };
    });
    check(`${label}: trust strip rendered`, !!info);
    if (info) {
      check(`${label}: 4 items`, info.items.length === 4, `n=${info.items.length}`);
      check(`${label}: 5 gold stars + Google mark in item 1`, info.starSvgs === 5 && info.googleMarks === 1, `stars=${info.starSvgs} mark=${info.googleMarks}`);
      // Owner redesign 2026-10-04: the hero CTA pair was removed, so the old
      // "below CTAs" geometry check has no subject — the strip's position is
      // covered by the layout/overflow checks; assert the removal instead.
      check(`${label}: hero CTA pair removed`, info.ctas.length === 0, info.ctas.join("|"));
      check(`${label}: rating wording "4.8/5" + "Google Customer Rating"`, info.items[0].includes("4.8/5") && info.items[0].includes("Google Customer Rating"), info.items[0]);
      check(`${label}: accessible star label`, info.srLabel === "Rated 4.8 out of 5 on Google", info.srLabel);
      check(`${label}: diagnosis wording gone`, !info.text.includes("Get Diagnosis") && !info.text.includes("Written findings provided"));
      check(`${label}: other 3 items preserved`, info.items[1].includes("40+ Areas") && info.items[1].includes("Across Bangalore") && info.items[2].includes("12K+ Customers") && info.items[2].includes("Served with care"), `${info.items[1]} | ${info.items[2]}`);
      check(`${label}: old wording gone`, !info.text.includes("Free Diagnosis") && !info.text.includes("With written finding"));
      check(`${label}: strip shows 45-Day Warranty`, info.text.includes("45-Day Warranty") && info.text.includes("On eligible repairs"), info.items[3]);
      check(`${label}: no old 7-day wording`, !/7[\s-]?day|seven days/i.test(info.text));
      check(`${label}: no emoji icons`, !/[\u{2B50}\u{1F6E1}\u{1F4CA}\u{1F464}\u{1F4CD}]/u.test(info.text));
      // horizontal overflow check
      const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      check(`${label}: no horizontal overflow`, !hOverflow);
      await page.screenshot({ path: `/tmp/trust-${label}-viewport.png` });
      await page.locator('ul[aria-label="Ride N Care trust highlights"]').screenshot({ path: `/tmp/trust-${label}-strip.png` });
    }
  } catch (e) {
    check(`${label}: screenshot`, false, String(e).slice(0, 150));
  }
  await page.close();
}

// SEO metadata snapshot (homepage head)
{
  const page = await browser.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const head = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].length,
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().replace(/\s+/g, " ")),
  }));
  console.log("HEAD " + JSON.stringify(head));
  check("SEO: single H1 unchanged", head.h1.length === 1 && head.h1[0].includes("Trusted Bike & Car Service"), head.h1[0]);
  check("SEO: title unchanged", head.title === "Doorstep Bike & Car Service in Bangalore | Ride N Care", head.title);
  check("SEO: canonical unchanged", head.canonical === "https://ridencare.co.in/", head.canonical);
  check("SEO: JSON-LD blocks present", head.ld >= 1, `ld=${head.ld}`);
  const bodyText = await page.evaluate(() => document.body.innerText);
  check("DUP: no '12,000+ customers served' on home", !bodyText.includes("12,000+ customers served"));
  check("DUP: strip '12K+ Customers' still present", bodyText.includes("12K+ Customers"));
  check("DUP: '12,000' count on home", (bodyText.match(/12,000/g) ?? []).length === 0, `n=${(bodyText.match(/12,000/g) ?? []).length}`);
  await page.close();
}

// About page keeps its customer figure
{
  const page = await browser.newPage();
  await page.goto(BASE + "/about", { waitUntil: "load" });
  const t = await page.evaluate(() => document.body.innerText);
  check("ABOUT: customer figure untouched", t.includes("12,000"), "12,000 present on /about");
  await page.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
