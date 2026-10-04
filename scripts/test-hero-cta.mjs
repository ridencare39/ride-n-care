/** Verify the owner-requested hero redesign (2026-10-04):
 *  - the duplicate hero CTA pair (yellow Book Now + red Breakdown Assistance)
 *    is REMOVED from the homepage hero
 *  - booking still opens from the floating circular Book Now (primary action)
 *  - the breakdown destination survives via the floating SOS button
 *  - header/mobile-menu CTAs, no horizontal overflow, no page errors
 *  Usage: bun scripts/test-hero-cta.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8080";
const results = [];
function check(name, pass, note = "") { results.push(pass); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`); }

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));

await p.goto(BASE + "/", { waitUntil: "load" });
// hydration wait — click a not-yet-hydrated button is a no-op
// Single bounded wait for readiness — NO scrolling (scroll probes during
// load were observed to interfere with route hydration on this preview box):
//  reactProps = hydration render started · [data-root-ready] = root layout
//  committed (the floating Book Now + booking dialog live in the root tree,
//  which is all this suite interacts with).
let hydrated = false;
let committed = false;
for (let i = 0; i < 160; i++) {
  await p.waitForTimeout(500);
  const st = await p.evaluate(() => {
    const el = document.querySelector(".float-book");
    return {
      hyd: !!el && Object.keys(el).some((k) => k.startsWith("__reactProps")),
      root: !!document.querySelector("[data-root-ready]"),
    };
  });
  if (st.hyd) hydrated = true;
  if (st.root) committed = true;
  if (hydrated && committed) break;
}
check("React hydrated", hydrated);
if (!hydrated) { await browser.close(); process.exit(1); }
check("React tree committed (effects flushed)", committed);

// hero CTA pair removed; floating controls keep the actions
const hero = await p.evaluate(() => ({
  heroBooks: document.querySelectorAll(".hero-cta-book").length,
  heroBd: document.querySelectorAll("a.hero-cta-emergency").length,
  heroCtas: document.querySelectorAll("section .hero-cta").length,
  floatBook: !!document.querySelector(".float-book"),
  sos: document.querySelector(".rnc-sos")?.getAttribute("href") ?? null,
  headerPill: [...document.querySelectorAll("header button")].some((b) => (b.textContent || "").trim() === "Book Now"),
  call: document.querySelector('.float-bar a[href^="tel:"]')?.getAttribute("href") ?? null,
  wa: document.querySelector('.float-bar [data-ctc="whatsapp_click"]') ? true : false,
}));
check("hero duplicate Book Now removed", hero.heroBooks === 0, `n=${hero.heroBooks}`);
check("hero Breakdown button removed", hero.heroBd === 0, `n=${hero.heroBd}`);
check("no hero-cta elements remain", hero.heroCtas === 0, `n=${hero.heroCtas}`);
check("floating circular Book Now present", hero.floatBook);
check("SOS keeps breakdown destination", hero.sos === "/breakdown-assistance", hero.sos);
check("header Book Now pill kept", hero.headerPill);
check("Call link unchanged", hero.call === "tel:+918069409289", hero.call);
check("WhatsApp action kept", hero.wa);

// booking modal opens from the floating Book Now
await p.evaluate(() => document.querySelector(".float-book")?.click());
let dlg = null;
for (let i = 0; i < 40; i++) {
  await p.waitForTimeout(300);
  dlg = await p.evaluate(() => document.querySelector("div[role=dialog]"));
  if (dlg) break;
}
check("booking dialog opens from floating Book Now", !!dlg);
if (dlg) {
  // Dialog mount → focus wiring can lag after a late commit; poll the close
  // (with a repeated Escape) instead of a single fixed wait.
  let closed = false;
  for (let i = 0; i < 12; i++) {
    if (i % 3 === 0) await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
    closed = !(await p.evaluate(() => document.querySelector("div[role=dialog]")));
    if (closed) break;
  }
  check("booking dialog closes (Escape)", closed);
}

// no horizontal overflow
check("no horizontal overflow", await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));

check("no page errors", errors.length === 0, errors[0] ?? "");

await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`\n${results.length - fails}/${results.length} checks pass`);
process.exit(fails ? 1 : 0);
