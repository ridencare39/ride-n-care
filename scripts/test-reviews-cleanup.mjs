/** Post-replacement verification (owner request 2026-10-04): the expired
 *  Trustindex Google reviews widget was removed and replaced by the native
 *  "The Ride N Care Experience" section. This suite guards the invariants:
 *   - exactly ONE experience section; the old #google-reviews section is gone
 *   - no expired-trial/subscription notice and no Trustindex anywhere
 *   - 10–12 cards, exact heading + supporting text
 *   - still no invented testimonial content and no old carousel
 *   - no Review/AggregateRating structured data
 *   - hero CTAs (removed in the earlier redesign), floating Book Now + SOS,
 *     booking modal with brand/model totals, single H1, no page errors
 *  Usage: bun scripts/test-reviews-cleanup.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://ridencare.co.in";
const results = [];
function check(name, pass, note = "") { results.push(pass); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`); }

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
const tiRequests = [];
p.on("pageerror", (e) => errors.push(String(e).slice(0, 150)));
p.on("request", (r) => { if (/trustindex/i.test(r.url())) tiRequests.push(r.url()); });

await p.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
// No-scroll readiness (scroll probes during load interfere with hydration on
// this preview box): reactProps + [data-root-ready] + [data-video-ready].
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
  await p.waitForTimeout(500);
}
check("page hydrated + committed", hyd && committed, `hyd=${hyd} committed=${committed}`);

// ── section census: old section gone, new section present ────────────────
const census = await p.evaluate(() => {
  const old = document.querySelectorAll("#google-reviews").length;
  const exp = document.getElementById("experience");
  const cards = exp ? [...exp.querySelectorAll("div.grid > div")] : [];
  const body = document.body.innerText;
  return {
    old,
    exp: !!exp,
    heading: exp?.querySelector("h2")?.textContent?.trim() ?? "",
    support: exp?.querySelector("h2")?.nextElementSibling?.textContent?.trim() ?? "",
    cards: cards.length,
    emptyDesc: cards.filter((c) => !(c.querySelector("p")?.textContent?.trim())).length,
    expired: /trial period has expired|subscription plans/i.test(body),
    tiDom: !!document.querySelector(".ti-widget, .ti-review-item, script[src*='trustindex']"),
    carousel: document.querySelectorAll("#testimonials").length,
    invented: /Loved by car & bike owners|Ramesh Iyer|Priya Nair|Arjun Reddy/.test(body),
  };
});
check("old #google-reviews section removed", census.old === 0, `n=${census.old}`);
check("native #experience section present", census.exp);
check(
  "heading exact — The Ride N Care Experience",
  census.heading === "The Ride N Care Experience",
  census.heading,
);
check(
  "supporting text exact",
  census.support === "Discover the convenience and care behind our doorstep bike and car service in Bangalore.",
  census.support.slice(0, 60),
);
check("card count 10–12", census.cards >= 10 && census.cards <= 12, `n=${census.cards}`);
check("every card has a description", census.emptyDesc === 0, `empty=${census.emptyDesc}`);
check("no expired-trial / subscription notice", !census.expired);
check("no Trustindex DOM/scripts", !census.tiDom);
check("no Trustindex network requests", tiRequests.length === 0, tiRequests[0] ?? "");
check("old #testimonials carousel gone", census.carousel === 0);
check("no invented testimonial content anywhere", census.invented === false);

// ── no Review/AggregateRating schema ─────────────────────────────────────
const schema = await p.evaluate(() => ({
  ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? "").join(" "),
}));
check("no Review/AggregateRating schema", !/AggregateRating|"@type":\s*"Review"|reviewRating/.test(schema.ld));

// ── booking + page basics intact ─────────────────────────────────────────
const basics = await p.evaluate(() => ({
  h1: document.querySelectorAll("h1").length,
  heroCta: [...document.querySelectorAll("button")].some((b) => b.className.includes("hero-cta") && b.textContent?.includes("Book Now")),
  breakdown: [...document.querySelectorAll("a")].some((a) => a.className.includes("hero-cta") && a.textContent?.includes("Breakdown")),
  floatBook: !!document.querySelector(".float-book"),
  sos: document.querySelector(".rnc-sos")?.getAttribute("href") ?? null,
  tel: document.querySelector('.float-bar a[href^="tel:"]')?.getAttribute("href") ?? null,
  wa: !!document.querySelector('.float-bar [data-ctc="whatsapp_click"]'),
  sw: document.documentElement.scrollWidth,
  vw: window.innerWidth,
}));
check("homepage H1 intact", basics.h1 === 1);
check("hero duplicate CTAs removed", !basics.heroCta && !basics.breakdown, JSON.stringify(basics));
check("floating Book Now + SOS keep the actions", basics.floatBook && basics.sos === "/breakdown-assistance");
check("Call + WhatsApp unchanged", basics.tel === "tel:+918069409289" && basics.wa, basics.tel);
check("no horizontal overflow", basics.sw <= basics.vw + 1, `${basics.sw} vs ${basics.vw}`);

// booking modal still opens with totals
await p.evaluate(() => { document.querySelector(".float-book")?.click(); });
let dlgOpen = false;
for (let i = 0; i < 30; i++) { await p.waitForTimeout(300); dlgOpen = await p.evaluate(() => !!document.querySelector("div[role=dialog]")); if (dlgOpen) break; }
check("booking modal opens", dlgOpen);
let totals = 0;
for (let i = 0; i < 50; i++) {
  await p.waitForTimeout(300);
  totals = await p.evaluate(() => (document.querySelector("div[role=dialog]")?.textContent.match(/\d+ brands · \d+ models/g) ?? []).length);
  if (totals >= 2) break;
}
check("booking brand/model totals intact", totals === 2, `chips=${totals}`);

check("no page errors", errors.length === 0, errors.slice(0, 2).join(" ;; "));

await p.screenshot({ path: "/tmp/experience-final.png" }).catch(() => {});
await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`\n${results.length - fails}/${results.length} checks pass`);
process.exit(fails ? 1 : 0);
