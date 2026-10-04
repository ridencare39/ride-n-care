/**
 * Site-wide Book Now verification: every "Book Now" CTA on key pages must
 * render with the shared .btn-book amber-yellow treatment (gradient + dark
 * amber text + glow) and still open the booking modal.
 * Usage: bun scripts/test-book-now-yellow.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

async function nonYellowBookNow(page, url) {
  await page.goto(BASE + url, { waitUntil: "load" });
  await page.waitForTimeout(900);
  return page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("button, a")) {
      const t = (el.textContent || "").trim();
      if (!/book\s*now/i.test(t) || t.length > 60) continue;
      // The floating circular FAB is intentionally RED NEON (owner design
      // 2026-10-04, bottom-centre between Call and WhatsApp) — exempt from
      // the shared amber-yellow .btn-book treatment this file guards.
      if (el.classList.contains("float-book")) continue;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      const visible = r.width > 0 && r.height > 0 && st.display !== "none" && st.visibility !== "hidden";
      if (!visible) continue;
      const bg = st.backgroundImage || "";
      // computed style serializes hex stops as rgb(), so match both forms
      const isYellow =
        el.classList.contains("btn-book") ||
        el.classList.contains("hero-cta-book") ||
        (bg.includes("#ffd54a") && bg.includes("#f5b81e")) ||
        (bg.includes("rgb(255, 213, 74)") && bg.includes("rgb(245, 184, 30)"));
      if (!isYellow) bad.push({ text: t, cls: String(el.className).slice(0, 80), bg: bg.slice(0, 60) });
    }
    return bad;
  });
}

const browser = await chromium.launch();

// 1) Header pill (desktop viewport)
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await p.goto(BASE + "/bikes", { waitUntil: "load" });
    await p.waitForTimeout(900);
    const hdr = await p.evaluate(() => {
      const btn = [...document.querySelectorAll("header button")].find(
        (b) => (b.textContent || "").trim() === "Book Now"
      );
      if (!btn) return { found: false };
      const st = getComputedStyle(btn);
      return {
        found: true,
        yellow:
          btn.classList.contains("btn-book") &&
          ((st.backgroundImage || "").includes("#ffd54a") ||
            (st.backgroundImage || "").includes("rgb(255, 213, 74)")),
      };
    });
    check(
      "header: desktop Book Now pill yellow",
      hdr.found === true && hdr.yellow === true,
      hdr.found ? JSON.stringify(hdr) : "pill not found"
    );
  } catch (e) {
    check("header: desktop Book Now pill yellow", false, String(e).slice(0, 120));
  }
  await p.close();
}

// 2) Page-by-page sweep
const routes = [
  ["/", "home"],
  ["/bikes", "bikes packages"],
  ["/cars", "cars"],
  ["/bike-service", "service.index (bike)"],
  ["/car-periodic-service", "service.index (car)"],
  ["/bike-service/hsr-layout", "service.area"],
  ["/areas/koramangala", "area page"],
  ["/answers/bike-service-cost-bangalore", "answer"],
  ["/answers", "answers hub"],
  ["/breakdown-assistance", "breakdown"],
  ["/car-breakdown-assistance", "car breakdown"],
  ["/contact", "contact"],
  ["/ev-two-wheeler-service", "EV"],
  ["/blog/bike-service-checklist-bangalore", "blog post"],
];

for (const [path, label] of routes) {
  const p = await browser.newPage();
  try {
    const bad = await nonYellowBookNow(p, path);
    check(`${label}: Book Now yellow`, bad.length === 0, bad.length ? JSON.stringify(bad).slice(0, 160) : "");
  } catch (e) {
    check(`${label}: Book Now yellow`, false, String(e).slice(0, 110));
  }
  await p.close();
}

// 3) Booking flow still opens from a yellow CTA
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    // hydration wait — clicking a not-yet-hydrated CTA is a no-op
    for (let i = 0; i < 40; i++) {
      const ok = await p.evaluate(() => {
        const el = document.querySelector(".float-book");
        return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
      });
      if (ok) break;
      await p.waitForTimeout(500);
    }
    // reactProps ≠ committed: wait for the root layout's [data-root-ready]
    // mount marker (no scroll probes — scrolling during load interfered with
    // route hydration on this preview box).
    for (let i = 0; i < 160; i++) {
      const ok = await p.evaluate(() => !!document.querySelector("[data-root-ready]"));
      if (ok) break;
      await p.waitForTimeout(500);
    }
    const clicked = await p.evaluate(() => {
      const btn = [...document.querySelectorAll("button, a")].find(
        (el) =>
          /^book now$/i.test((el.textContent || "").trim()) &&
          el.getBoundingClientRect().width > 0
      );
      if (!btn) return false;
      btn.click();
      return true;
    });
    await p.waitForTimeout(1200);
    const modal = await p.evaluate(() => {
      const dlg =
        document.querySelector('[role="dialog"]') ||
        document.querySelector("#booking-modal") ||
        document.querySelector(".booking-modal");
      return {
        present: !!dlg && getComputedStyle(dlg).display !== "none",
        meaningful: /bike|car/i.test(dlg?.textContent || ""),
      };
    });
    check("booking modal opens from yellow CTA", clicked && modal.present && modal.meaningful, clicked ? (modal.present ? "" : "modal not visible") : "no CTA clicked");
    await p.screenshot({ path: "/tmp/booknow-modal.png" });
  } catch (e) {
    check("booking modal opens from yellow CTA", false, String(e).slice(0, 120));
  }
  await p.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
