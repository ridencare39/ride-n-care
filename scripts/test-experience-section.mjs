/** ExperienceSection verification — owner request 2026-10-04 (REPLACE expired
 *  Trustindex reviews widget with a native "The Ride N Care Experience" section).
 *
 *  Checks at desktop 1440 / tablet 820 / mobile 375 / narrow 320:
 *   - section + exact heading + exact supporting text
 *   - 10–12 content cards with titles from the owner's brief
 *   - NO expired-trial / subscription notice anywhere on the page
 *   - NO Trustindex DOM, scripts or network requests
 *   - NO rating UI inside the section (no stars, no "Rated", no review counts,
 *     no testimonial furniture: figcaption / time / photos)
 *   - no Review / AggregateRating structured data
 *   - layout: section in normal flow, no horizontal overflow, no page errors
 *   - booking + Call + WhatsApp + SOS controls still work
 *  Usage: bun scripts/test-experience-section.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8080";
const SHOT_DIR = "docs/preview/experience";
const results = [];
function check(name, pass, note = "") {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXPECTED_TITLES = [
  "Doorstep Service Convenience",
  "Bike and Car Service Options",
  "Clear, Written Quotes",
  "Convenient Booking",
  "Experienced Service Support",
  "Genuine Communication",
  "Repair and Maintenance Assistance",
  "Service Across Selected Bangalore Areas",
  "A Focus on Customer Convenience",
  "Transparent Service Information",
  "Support for Everyday Riders",
  "A Commitment to Quality Service",
];
const HEADING = "The Ride N Care Experience";
const SUPPORT =
  "Discover the convenience and care behind our doorstep bike and car service in Bangalore.";

const browser = await chromium.launch();

for (const [w, h, label] of [
  [1440, 900, "desktop"],
  [820, 1180, "tablet"],
  [375, 812, "mobile"],
  [320, 720, "narrow"],
]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errors = [];
  const tiRequests = [];
  p.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  p.on("request", (r) => {
    if (/trustindex/i.test(r.url())) tiRequests.push(r.url());
  });

  await p.goto(BASE + "/", { waitUntil: "load" });
  // No-scroll readiness (scroll probes during load interfere with hydration on
  // this preview box): reactProps = hydration started, [data-root-ready] =
  // root committed, [data-video-ready] = home route committed.
  let hyd = false;
  let committed = false;
  for (let i = 0; i < 160; i++) {
    const st = await p.evaluate(() => {
      const el = document.querySelector(".float-book");
      return {
        hyd: !!el && Object.keys(el).some((k) => k.startsWith("__reactProps")),
        ready:
          !!document.querySelector("[data-root-ready]") &&
          !!document.querySelector("[data-video-ready]"),
      };
    });
    if (st.hyd) hyd = true;
    if (st.ready) committed = true;
    if (hyd && committed) break;
    await sleep(500);
  }

  const g = await p.evaluate(
    ({ heading, support }) => {
      const s = document.getElementById("experience");
      const cards = s ? [...s.querySelectorAll("div.grid > div")] : [];
      const cardInfo = cards.map((c) => ({
        title: c.querySelector("h3")?.textContent?.trim() ?? "",
        desc: c.querySelector("p")?.textContent?.trim() ?? "",
      }));
      const body = document.body.innerText;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((x) => x.textContent ?? "")
        .join("\n");
      return {
        section: !!s,
        pos: s ? getComputedStyle(s).position : null,
        h2s: s ? [...s.querySelectorAll("h2")].map((x) => x.textContent.trim()) : [],
        headingOk: !!s && s.querySelector("h2")?.textContent?.trim() === heading,
        supportOk: !!s && (s.querySelector("h2")?.nextElementSibling?.textContent?.trim() === support),
        cardCount: cardInfo.length,
        titles: cardInfo.map((c) => c.title),
        emptyDesc: cardInfo.filter((c) => !c.desc).length,
        minDescLen: cardInfo.length ? Math.min(...cardInfo.map((c) => c.desc.length)) : 0,
        expiredNotice: /trial period has expired|subscription plans/i.test(body),
        tiDom: !!document.querySelector(".ti-widget, .ti-review-item, script[src*='trustindex']"),
        // rating/testimonial furniture inside the section
        stars: s ? s.querySelectorAll(".lucide-star, [class*='star']").length : -1,
        rated: s ? s.querySelectorAll("[aria-label*='Rated'], [aria-label*='out of 5']").length : -1,
        figcaptions: s ? s.querySelectorAll("figcaption").length : -1,
        times: s ? s.querySelectorAll("time").length : -1,
        imgs: s ? s.querySelectorAll("img").length : -1,
        reviewWords: s ? /\d+\s*reviews?|based on/i.test(s.innerText) : false,
        schemaBad: /AggregateRating|"@type":\s*"Review"|reviewRating/.test(ld),
        vw: window.innerWidth,
        sw: document.documentElement.scrollWidth,
      };
    },
    { heading: HEADING, support: SUPPORT },
  );

  check(`${label}: page hydrated + committed`, hyd && committed, `hyd=${hyd} committed=${committed}`);
  check(`${label}: #experience section present`, g.section);
  check(`${label}: heading exact — ${HEADING}`, g.headingOk, JSON.stringify(g.h2s));
  check(`${label}: supporting text exact`, g.supportOk);
  check(`${label}: card count 10–12`, g.cardCount >= 10 && g.cardCount <= 12, `n=${g.cardCount}`);
  const got = [...g.titles].sort();
  const want = [...EXPECTED_TITLES].sort();
  check(
    `${label}: card titles match owner brief`,
    got.length === want.length && got.every((t, i) => t === want[i]),
    got.length === want.length ? "all 12 exact" : JSON.stringify(got),
  );
  check(`${label}: every card has a description`, g.emptyDesc === 0 && g.minDescLen >= 40, `empty=${g.emptyDesc} minLen=${g.minDescLen}`);
  check(`${label}: no expired-trial / subscription notice`, !g.expiredNotice);
  check(`${label}: no Trustindex DOM or scripts`, !g.tiDom);
  check(`${label}: no Trustindex network requests`, tiRequests.length === 0, tiRequests[0] ?? "");
  check(
    `${label}: no rating UI in section (stars/rated/review counts)`,
    g.stars === 0 && g.rated === 0 && !g.reviewWords,
    `stars=${g.stars} rated=${g.rated} reviewWords=${g.reviewWords}`,
  );
  check(
    `${label}: no testimonial furniture (figcaption/time/photos)`,
    g.figcaptions === 0 && g.times === 0 && g.imgs === 0,
    `figcaption=${g.figcaptions} time=${g.times} img=${g.imgs}`,
  );
  check(`${label}: no Review/AggregateRating schema`, !g.schemaBad);
  check(`${label}: section in normal document flow`, g.pos === "static", `position=${g.pos}`);
  check(`${label}: no horizontal overflow`, g.sw <= g.vw + 1, `${g.sw} vs ${g.vw}`);
  check(`${label}: no page errors`, errors.length === 0, errors[0] ?? "");

  if (label !== "narrow") {
    await p.evaluate(() => document.getElementById("experience")?.scrollIntoView({ block: "center" }));
    await sleep(600);
    await p.screenshot({ path: `${SHOT_DIR}/after-${label}.png` });
  }
  await ctx.close();
}

/* ── Controls still work (desktop) ─────────────────────────────────────── */
console.log("\n── Controls (1440) ──");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  await p.goto(BASE + "/", { waitUntil: "load" });
  for (let i = 0; i < 160; i++) {
    const st = await p.evaluate(() => {
      const el = document.querySelector(".float-book");
      return (
        !!el &&
        Object.keys(el).some((k) => k.startsWith("__reactProps")) &&
        !!document.querySelector("[data-root-ready]")
      );
    });
    if (st) break;
    await sleep(500);
  }
  const ctrl = await p.evaluate(() => ({
    tel: document.querySelector('.float-bar a[href^="tel:"]')?.getAttribute("href") ?? null,
    wa: !!document.querySelector('.float-bar [data-ctc="whatsapp_click"]'),
    sos: document.querySelector(".rnc-sos")?.getAttribute("href") ?? null,
  }));
  check("Call control unchanged", ctrl.tel === "tel:+918069409289", ctrl.tel);
  check("WhatsApp control unchanged", ctrl.wa);
  check("SOS control unchanged", ctrl.sos === "/breakdown-assistance", ctrl.sos);

  await p.evaluate(() => document.querySelector(".float-book")?.click());
  let dlg = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    dlg = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    if (dlg) break;
  }
  check("Book Now opens booking modal", !!dlg);
  if (dlg) {
    let closed = false;
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) await p.keyboard.press("Escape");
      await sleep(400);
      closed = !(await p.evaluate(() => document.querySelector("div[role=dialog]")));
      if (closed) break;
    }
    check("booking modal closes (Escape)", closed);
  }
  check("controls: no page errors", errors.length === 0, errors[0] ?? "");
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`\n${results.length - fails}/${results.length} checks pass`);
process.exit(fails ? 1 : 0);
