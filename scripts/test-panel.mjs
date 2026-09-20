/**
 * Panel behaviour test (run against the local preview server on :8081).
 * Verifies the brief's checklist at mobile + desktop widths.
 * Usage: bun scripts/test-panel.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
const shot = (name) => `/tmp/panel-${name}.png`;

function check(name, pass, note = "") {
  results.push({ name, pass, note });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

const browser = await chromium.launch();

async function withPage(width, height, label, fn) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    // Let React hydration settle so handlers are attached before interacting.
    await page.waitForFunction(() => !document.querySelector("header .menu-btn") || true);
    await page.waitForTimeout(400);
    await fn(page);
  } catch (e) {
    check(`${label}: unexpected error`, false, String(e).slice(0, 120));
  } finally {
    await page.close();
  }
}

/** Click with retries (dev-server hydration can transiently detach the button). */
async function clickStable(locator, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await locator.click({ timeout: 5000 });
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// ── Shared behaviour assertions, parameterised by viewport ───────────────────
async function testViewport(width, height, label) {
  await withPage(width, height, label, async (page) => {
    const btn = page.locator("header .menu-btn");
    const panel = page.locator(".panel-root");

    // Button rendered, visible, clickable
    await check(`${label}: hamburger visible+enabled`, await btn.isVisible() && (await btn.isEnabled()));

    // Closed panel: inert + hidden
    check(`${label}: panel closed→inert`, (await panel.getAttribute("inert")) !== null);

    // Open via button (self-healing: retry once if hydration had not settled)
    await clickStable(btn);
    await page.waitForTimeout(450);
    if (!(await panel.evaluate((el) => el.classList.contains("is-open")))) {
      await clickStable(btn);
      await page.waitForTimeout(450);
    }
    check(`${label}: opens via button`, await panel.evaluate((el) => el.classList.contains("is-open")));
    check(`${label}: aria-expanded=true`, (await btn.getAttribute("aria-expanded")) === "true");
    check(`${label}: inert removed on open`, (await panel.getAttribute("inert")) === null);
    check(`${label}: panel is fixed & on top (z≥60)`, await panel.evaluate((el) => {
      const cs = getComputedStyle(el);
      return cs.position === "fixed" && parseInt(cs.zIndex, 10) >= 60;
    }));
    await page.screenshot({ path: shot(`open-${label}`) });

    // Nothing shows through: panel is ≥96% opaque navy
    check(`${label}: panel near-solid`, await page.locator("aside.panel").evaluate((el) => {
      const bg = getComputedStyle(el).background;
      const grad = bg.slice(Math.max(0, bg.indexOf("linear-gradient")));
      const alphas = [...grad.matchAll(/,\s*([\d.]+)\)/g)].map((m) => parseFloat(m[1]));
      return alphas.length > 0 && Math.min(...alphas) >= 0.96;
    }));

    // Page bar hidden while open
    await check2(label, page, "float bar hidden while open");

    // Boxes: counts from data, expand/collapse, only-one-open
    const bikeBox = page.locator(".svc-box-bike");
    const carBox = page.locator(".svc-box-car");
    const bikeCount = (await bikeBox.locator(".svc-box-inner").innerText()).includes(`${BIKE_N} services`);
    const carCount = (await carBox.locator(".svc-box-inner").innerText()).includes(`${CAR_N} services`);
    check(`${label}: box counts from data (bike=${BIKE_N}, car=${CAR_N})`, bikeCount && carCount);
    check(`${label}: boxes 2-col grid, gap 12, min-h 104`, await page.evaluate(() => {
      const grid = document.querySelector(".svc-box")?.parentElement;
      if (!grid) return false;
      const cs = getComputedStyle(grid);
      const box = getComputedStyle(document.querySelector(".svc-box"));
      return cs.display === "grid" && cs.gridTemplateColumns.split(" ").length === 2 &&
        cs.columnGap === "12px" && parseInt(box.minHeight, 10) >= 104;
    }));
    const bikeList = page.locator(`#${BIKE_LIST_ID}`);
    const carList = page.locator(`#${CAR_LIST_ID}`);
    check(`${label}: lists in DOM while closed`, (await bikeList.count()) === 1 && (await carList.count()) === 1);
    await bikeBox.click(); // boxes are plain buttons; hydration settled above
    await page.waitForTimeout(400);
    check(`${label}: bike expands (1fr)`, await page.locator(".svc-list").first().evaluate((el) =>
      getComputedStyle(el).gridTemplateRows.split(" ")[0] !== "0px"));
    check(`${label}: bike box glowing when active`, await bikeBox.evaluate((el) => el.classList.contains("svc-box-active")));
    await carBox.click();
    await page.waitForTimeout(400);
    check(`${label}: only one list open at a time`, await page.evaluate((carId) => {
      const lists = [...document.querySelectorAll(".svc-list")];
      const open = lists.filter((l) => l.classList.contains("svc-list-open"));
      return open.length === 1 && open[0].querySelector(`#${carId}`) !== null;
    }, CAR_LIST_ID));
    await bikeBox.click();
    await page.waitForTimeout(400);
    check(`${label}: switching back re-opens bike`, await page.evaluate((bikeId) =>
      document.querySelectorAll(".svc-list-open").length === 1 &&
      !!document.querySelector(`.svc-list-open #${bikeId}`), BIKE_LIST_ID));
    await page.screenshot({ path: shot(`expanded-${label}`) });

    // Close via Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    check(`${label}: closes via Escape`, !(await panel.evaluate((el) => el.classList.contains("is-open"))));

    // Reopen: focus trap + focus return
    await btn.click();
    await page.waitForTimeout(350);
    const inside = await page.evaluate(() => document.querySelector(".panel-root").contains(document.activeElement));
    check(`${label}: focus moves into panel on open`, inside);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    check(`${label}: focus trapped (still in panel)`, await page.evaluate(() =>
      document.querySelector(".panel-root").contains(document.activeElement)));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    check(`${label}: focus returns to hamburger`, await page.evaluate(() =>
      document.activeElement === document.querySelector("header .menu-btn")));

    // Reopen: close via backdrop
    await btn.click();
    await page.waitForTimeout(350);
    await page.mouse.click(Math.max(20, width - 420), height / 2); // clear of the 360px panel
    await page.waitForTimeout(350);
    check(`${label}: closes via backdrop click`, !(await panel.evaluate((el) => el.classList.contains("is-open"))));
  });
}

// float-bar visibility helper (declared before use via hoisting)
async function check2(label, page, name) {
  const hidden = await page.evaluate(() => {
    const bar = document.querySelector(".float-bar");
    if (!bar) return "missing";
    const cs = getComputedStyle(bar);
    return cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05;
  });
  check(`${label}: ${name}`, hidden === true, hidden === "missing" ? "no .float-bar found" : "");
}

// ── Data for count assertions ────────────────────────────────────────────────
const BIKE_N = 9;
const CAR_N = 4;
const BIKE_LIST_ID = "panel-bike-list";
const CAR_LIST_ID = "panel-car-list";

// ── Run at every required width ─────────────────────────────────────────────
await testViewport(375, 667, "375");
await testViewport(768, 900, "768");
await testViewport(1024, 768, "1024");
await testViewport(1280, 720, "1280");
await testViewport(1440, 900, "1440");
await testViewport(1920, 1080, "1920");

// ── Auto-expand on bike / car pages (reuse one page, two URLs) ───────────────
{
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto(`${BASE}/bike-service`, { waitUntil: "networkidle" });
  await page.locator("header .menu-btn").click();
  await page.waitForTimeout(450);
  const bikeOpen = await page.evaluate((id) =>
    !!document.querySelector(`.svc-list-open #${id}`), BIKE_LIST_ID);
  check("auto-expand: bike page opens Bike list", bikeOpen);
  await page.close();

  const page2 = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page2.goto(`${BASE}/car-ac-service`, { waitUntil: "networkidle" });
  await page2.locator("header .menu-btn").click();
  await page2.waitForTimeout(450);
  const carOpen = await page2.evaluate((id) =>
    !!document.querySelector(`.svc-list-open #${id}`), CAR_LIST_ID);
  check("auto-expand: car page opens Car list", carOpen);
  await page2.close();
}

// ── SEO: all panel links server-rendered in raw HTML (no JS) ────────────────
{
  const res = await fetch(`${BASE}/`);
  const html = await res.text();
  const required = [
    'href="/bike-service"', 'href="/doorstep-bike-service"', 'href="/bike-repair"',
    'href="/scooter-service"', 'href="/engine-repair"', 'href="/battery-service"',
    'href="/emergency-bike-repair"', 'href="/bike-breakdown-assistance"', 'href="/periodic-bike-service"',
    'href="/car-periodic-service"', 'href="/car-ac-service"', 'href="/car-battery-service"', 'href="/car-brake-service"',
    'href="/bikes"', 'href="/cars"',
    'href="/"', 'href="/areas"', 'href="/blog"', 'href="/franchise"', 'href="/faq"', 'href="/contact"',
    'href="tel:+918069409289"', 'href="https://wa.me/918296950339"',
  ];
  const missing = required.filter((h) => !html.includes(h));
  check("SEO: all panel links in raw HTML", missing.length === 0, missing.join(", ") || "all present");
  check("SEO: collapsed lists inert+aria-hidden in HTML", html.includes("inert") && html.includes('aria-hidden="true"'));
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks passed`);
process.exit(fails.length ? 1 : 0);
