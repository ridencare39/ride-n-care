/**
 * Combined task A–E verification (screenshots + behaviour) against local preview.
 * Usage: bun scripts/test-combined.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass, note });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

const browser = await chromium.launch();

// ── A: header at 320/375/1280 ──────────────────────────────────────────────
for (const w of [320, 375, 1280]) {
  const p = await browser.newPage({ viewport: { width: w, height: 800 } });
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.waitForTimeout(700);
    const hdr = await p.evaluate(() => {
      const mark = [...document.querySelectorAll("header a")].find((a) => a.textContent.includes("Ride N Care"));
      const tag = mark && [...mark.querySelectorAll("span")].find((s) => /every mile/i.test(s.textContent));
      const ai = [...document.querySelectorAll("header button")].find((b) => b.textContent.includes("Book with AI"));
      const visible = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && st.display !== "none" && st.visibility !== "hidden";
      };
      const inVp = (el) => el && el.getBoundingClientRect().right <= window.innerWidth + 1;
      const hOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      return {
        mark: visible(mark), tag: visible(tag), ai: visible(ai), aiIn: inVp(ai), hOverflow,
        markIn: inVp(mark),
      };
    });
    check(`${w}: wordmark visible`, hdr.mark);
    check(`${w}: tagline visible`, hdr.tag);
    check(`${w}: "Book with AI" label visible`, hdr.ai);
    check(`${w}: AI pill inside viewport`, hdr.aiIn);
    check(`${w}: no horizontal overflow`, !hdr.hOverflow);
    await p.screenshot({ path: `/tmp/combined-header-${w}.png` });
  } catch (e) {
    check(`${w}: header`, false, String(e).slice(0, 120));
  }
  await p.close();
}

// ── B: open panel with Book Now pill ──────────────────────────────────────
for (const w of [320, 375, 1280]) {
  const p = await browser.newPage({ viewport: { width: w, height: 800 } });
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelector(".menu-btn")?.click());
    await p.waitForTimeout(600);
    const st = await p.evaluate(() => {
      const panel = document.querySelector(".panel");
      const btn = [...document.querySelectorAll(".panel button")].find((b) => b.textContent.trim() === "Book Now");
      const close = panel?.querySelector('[aria-label="Close menu"]');
      const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      return {
        open: !!panel && panel.getAttribute("aria-hidden") !== "true",
        bookNow: vis(btn), close: vis(close),
        fits: panel ? panel.getBoundingClientRect().width <= Math.min(window.innerWidth * 0.88, 360) + 1 : false,
      };
    });
    check(`${w}: panel opens`, st.open);
    check(`${w}: panel Book Now visible`, st.bookNow);
    check(`${w}: close button visible`, st.close);
    check(`${w}: panel width fits min(88vw,360px)`, st.fits);
    if (w === 375) await p.screenshot({ path: "/tmp/combined-panel-375.png" });
  } catch (e) {
    check(`${w}: panel`, false, String(e).slice(0, 120));
  }
  await p.close();
}

// ── C: hero brand name one line + sparkles ────────────────────────────────
{
  const p = await browser.newPage({ viewport: { width: 375, height: 800 } });
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.waitForTimeout(900);
    const hero = await p.evaluate(() => {
      const el = document.querySelector(".hero-brand-name");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const sparkles = el.querySelectorAll(".hero-sparkle").length;
      const st = getComputedStyle(el);
      return { oneLine: r.height < 40, sparkles, nowrap: st.whiteSpace === "nowrap", text: el.textContent.trim() };
    });
    check("375: hero brand span present", !!hero);
    if (hero) {
      check("375: brand name on one line", hero.oneLine, `h=${hero.oneLine}`);
      check("375: 3-4 sparkles", hero.sparkles >= 3 && hero.sparkles <= 4, `n=${hero.sparkles}`);
      check("375: nowrap", hero.nowrap);
      check("375: wording unchanged", hero.text === "Ride N Care", hero.text);
      await p.screenshot({ path: "/tmp/combined-hero-375.png" });
    }
  } catch (e) {
    check("375: hero brand", false, String(e).slice(0, 120));
  }
  await p.close();
}

// ── D: process section at 375 + 1280 ──────────────────────────────────────
for (const w of [375, 1280]) {
  const p = await browser.newPage({ viewport: { width: w, height: 800 } });
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.waitForTimeout(700);
    const st = await p.evaluate(() => {
      const s = document.getElementById("process");
      if (!s) return null;
      const h2 = s.querySelector("h2");
      const steps = s.querySelectorAll(".process-step").length;
      const pillars = s.querySelectorAll("ul li").length;
      const h2s = [...s.querySelectorAll("h2")].length;
      return { h2: h2?.textContent.includes("How Ride N Care works"), steps, pillars, h2s };
    });
    check(`${w}: #process exists`, !!st);
    if (st) {
      check(`${w}: H2 correct`, st.h2);
      check(`${w}: six steps`, st.steps === 6, `steps=${st.steps}`);
      check(`${w}: five pillars`, st.pillars >= 5, `li=${st.pillars}`);
      check(`${w}: one H2`, st.h2s === 1);
      await p.evaluate(() => document.getElementById("process").scrollIntoView());
      await p.waitForTimeout(1400);
      await p.screenshot({ path: `/tmp/combined-process-${w}.png` });
    }
  } catch (e) {
    check(`${w}: process`, false, String(e).slice(0, 120));
  }
  await p.close();
}

// ── E: panel car list shows 10 items (9 services + View all) ──────────────
{
  const p = await browser.newPage({ viewport: { width: 375, height: 800 } });
  try {
    await p.goto(BASE + "/cars", { waitUntil: "load" });
    await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelector(".menu-btn")?.click());
    await p.waitForTimeout(500);
    await p.evaluate(() => document.getElementById("svc-box-car")?.click());
    await p.waitForTimeout(700);
    const st = await p.evaluate(() => {
      const list = document.getElementById("panel-car-list");
      const rows = list ? [...list.querySelectorAll("a")].map((a) => a.textContent.trim()) : [];
      return { n: rows.length, rows, last: rows[rows.length - 1] };
    });
    check("panel: car list 10 rows", st.n === 10, `n=${st.n}`);
    check("panel: ends with View all", /View all car services/i.test(st.last ?? ""));
    await p.screenshot({ path: "/tmp/combined-panel-car-375.png" });
  } catch (e) {
    check("panel car list", false, String(e).slice(0, 120));
  }
  await p.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
