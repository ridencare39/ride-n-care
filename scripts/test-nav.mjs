/**
 * Task A test — desktop top navigation at 1024/1100/1280/1440/1920.
 * Usage: bun scripts/test-nav.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const results = [];
const check = (name, pass, note = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
};

const browser = await chromium.launch();

/** Wait until React has hydrated: clicking the trigger flips aria-expanded (async).
 *  If the click fires before hydration the anchor navigates to /#services —
 *  detect the navigation, go back to the clean page and retry. */
async function waitHydrated(p) {
  const original = p.url();
  for (let i = 0; i < 15; i++) {
    const ok = await p.evaluate(async () => {
      const t = document.querySelector(".nav-trigger");
      if (!t) return "missing";
      const before = location.href;
      t.click();
      await new Promise((r) => setTimeout(r, 350));
      if (location.href !== before) return "navigated";
      const opened = t.getAttribute("aria-expanded") === "true";
      if (opened) {
        t.click(); // reset to closed for the checks below
        await new Promise((r) => setTimeout(r, 250));
      }
      return opened && t.getAttribute("aria-expanded") === "false" ? "ready" : "retry";
    });
    if (ok === "ready") return true;
    if (ok === "navigated") {
      await p.goto(original, { waitUntil: "networkidle" });
    }
    await p.waitForTimeout(700);
  }
  return false;
}

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

// Raw HTML checks (server-rendered, no JS)
const raw = await (await fetch(`${BASE}/`)).text();
check("raw: 8 nav links as <a>", ["Home", "Franchise", "Blog", "FAQ", "Contact", "About Us"].every((l) => raw.includes(`>${l}</a>`) || raw.includes(`>${l}<`)) && raw.includes("Our Services") && raw.includes("Process"));
check("raw: id=services + id=process", raw.includes('id="services"') && raw.includes('id="process"'));
check("raw: services menu links in DOM (closed)", ["car-periodic-service", "car-ac-service", "car-battery-service", "car-brake-service", "bikes", "cars", "breakdown-assistance", "areas", "guides", "answers"].every((s) => raw.includes(`href="/${s}"`)));
check("raw: no old bar items", !raw.includes('aria-label="Primary"') || (!/>Doorstep</.test(raw.slice(raw.indexOf('aria-label="Primary"'), raw.indexOf('aria-label="Primary"') + 4000))));

// At each width: no wrapping, no overflow, items visible+clickable, menu opens/closes
for (const w of [1024, 1100, 1280, 1440, 1920]) {
  const p = await browser.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await waitHydrated(p);

  const bar = p.locator('nav[aria-label="Primary"]');
  const visible = await bar.isVisible();
  check(`${w}: top bar visible`, visible);

  const links = bar.locator("a.nav-item");
  const n = await links.count();
  check(`${w}: 8 anchor items (7 links + services trigger)`, n === 8, `got ${n}`);
  let allOk = true;
  for (let i = 0; i < n; i++) {
    const el = links.nth(i);
    const ok = (await el.isVisible()) && (await el.getAttribute("href")) !== null;
    if (!ok) allOk = false;
  }
  check(`${w}: every item visible with href`, allOk);

  const noWrap = await p.evaluate(() => {
    const ul = document.querySelector('nav[aria-label="Primary"] ul');
    if (!ul) return false;
    const r = ul.getBoundingClientRect();
    return r.right <= window.innerWidth + 1 && [...ul.querySelectorAll(":scope > li")].every((li) => li.getBoundingClientRect().height < 60);
  });
  check(`${w}: no wrapping/overflow`, noWrap);

  const noShift = await p.evaluate(() => {
    const h = document.querySelector("header");
    return h && Math.round(h.getBoundingClientRect().height) >= 70;
  });
  check(`${w}: header ~72px before scroll`, noShift === true);

  // Scroll shrink check happens below (needs hydration for the scroll listener)

  // Services menu open via click, links clickable, close via Escape
  await p.mouse.move(w / 2, 600); // neutral spot, off the header
  await p.waitForTimeout(250);
  await p.locator(".nav-trigger").click();
  await p.waitForTimeout(350);
  const open = await p.evaluate(() => {
    const m = document.getElementById("services-menu");
    return m && getComputedStyle(m).visibility === "visible" && !m.hasAttribute("inert");
  });
  check(`${w}: services menu opens (click)`, open === true);
  const bgNearSolid = await p.evaluate(() => {
    const panel = document.querySelector(".services-menu > div");
    if (!panel) return false;
    const bg = getComputedStyle(panel).background;
    const grad = bg.slice(Math.max(0, bg.indexOf("linear-gradient")));
    const alphas = [...grad.matchAll(/,\s*([\d.]+)\)/g)].map((m) => parseFloat(m[1]));
    return alphas.length > 0 && Math.min(...alphas) >= 0.96;
  });
  check(`${w}: menu near-solid navy`, bgNearSolid);
  await p.screenshot({ path: `/tmp/nav-menu-${w}.png` });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  let closed = await p.evaluate(() => {
    const m = document.getElementById("services-menu");
    return m && getComputedStyle(m).visibility === "hidden" && m.hasAttribute("inert");
  });
  if (!closed) {
    // dev-server main-thread stall can swallow the first press — one retry
    await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
    closed = await p.evaluate(() => {
      const m = document.getElementById("services-menu");
      return m && getComputedStyle(m).visibility === "hidden" && m.hasAttribute("inert");
    });
  }
  check(`${w}: closes via Escape + inert restored`, closed === true);
  const focusBack = await p.evaluate(() => document.activeElement?.classList.contains("nav-trigger"));
  check(`${w}: focus returns to trigger`, focusBack === true);

  // Hover opens with 120ms intent (mouse must start AWAY from the trigger,
  // otherwise no fresh mouseenter fires and the check is meaningless)
  await p.mouse.move(w / 2, 600);
  await p.waitForTimeout(250);
  await p.locator(".nav-trigger").hover();
  await p.waitForTimeout(40);
  const notYet = await p.evaluate(() => getComputedStyle(document.getElementById("services-menu")).visibility === "hidden");
  await p.waitForTimeout(260);
  const nowOpen = await p.evaluate(() => getComputedStyle(document.getElementById("services-menu")).visibility === "visible");
  check(`${w}: hover-intent (~120ms) works`, notYet && nowOpen);

  // Outside click closes: open again, then click the (non-interactive) H1
  await p.mouse.move(w / 2, 600);
  await p.waitForTimeout(300); // hover-close from moving away
  await p.locator(".nav-trigger").click();
  await p.waitForTimeout(350);
  await p.locator("h1").first().click();
  await p.waitForTimeout(300);
  const closedByOutside = await p.evaluate(() => getComputedStyle(document.getElementById("services-menu")).visibility === "hidden");
  check(`${w}: outside click closes`, closedByOutside);

  await p.close();
}

// Scroll shrink check (1280)
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await waitHydrated(p);
  await p.evaluate(() => window.scrollTo(0, 600));
  await p.waitForTimeout(400);
  const h = await p.evaluate(() => Math.round(document.querySelector("header").getBoundingClientRect().height));
  check("1280: header shrinks to ~60px on scroll", h <= 64, `h=${h}`);
  await p.close();
}

// /#process from another page + Process in-view highlight
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  const href = await p.locator('nav[aria-label="Primary"] a', { hasText: "Process" }).getAttribute("href");
  check("other page: Process links to /#process", href === "/#process" || href === "/%23process" || (href ?? "").includes("process"), href ?? "none");
  await p.close();
  const p2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p2.goto(`${BASE}/#process`, { waitUntil: "networkidle" });
  await waitHydrated(p2);
  await p2.waitForTimeout(800);
  const scrolled = await p2.evaluate(() => window.scrollY > 100);
  check("homepage /#process scrolls to section", scrolled);
  await p2.close();
}

await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`\n${results.length - fails}/${results.length} checks passed`);
process.exit(fails ? 1 : 0);
