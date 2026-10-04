/**
 * CSP Report-Only console sweep (CSP monitoring round, Oct 2026).
 *
 * In Report-Only mode violations never block anything — they surface as
 * console error lines ("[Report Only] Refused to …") in the browser. There is
 * no report-uri in production yet, so this sweep IS the evidence: a clean
 * sweep on a stock (extension-free) Chromium proves the allowlist covers every
 * origin the real pages actually touch.
 *
 * Usage: bun scripts/test-csp-console.mjs [baseURL] [--mobile] [--quick]
 *   --mobile  390×844 viewport (default 1280×900)
 *   --quick   only the top 5 routes (fast re-check after deploys)
 *
 * Exit code 1 if any CSP violation is observed, 0 otherwise.
 */
import { chromium } from "playwright";

const argv = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const BASE = argv[0] ?? "https://ridencare.co.in";
const MOBILE = process.argv.includes("--mobile");
const QUICK = process.argv.includes("--quick");

const FULL = [
  "/",
  "/cars",
  "/bike-service",
  "/doorstep-bike-service",
  "/ev-two-wheeler-service",
  "/royal-enfield-service",
  "/car-periodic-service",
  "/car-brake-service",
  "/breakdown-assistance",
  "/contact",
  "/map",
  "/answers/car-service-cost-bangalore",
  "/areas/koramangala",
  "/blog/doorstep-vs-garage-service",
  "/guarantee",
];
const QUICK_PAGES = ["/", "/bike-service", "/doorstep-bike-service", "/contact", "/map"];
const PAGES = QUICK ? QUICK_PAGES : FULL;
const VIEWPORT = MOBILE ? { width: 390, height: 844 } : { width: 1280, height: 900 };

const browser = await chromium.launch();
let anyCspViolation = false;
const perPage = [];

async function sweep(path, { interact } = {}) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const csp = [];
  const consoleErrs = [];
  const pageErrors = [];
  const failed = [];

  const onConsole = (m) => {
    const text = m.text();
    if (/content security policy|Content Security Policy/i.test(text)) csp.push(text);
    else if (m.type() === "error" || m.type() === "warning") consoleErrs.push(text);
  };
  page.on("console", onConsole);
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText ?? "?"} ${r.url().slice(0, 100)}`));

  try {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2500); // hydration + reviews widget + GA
    if (interact === "booking") {
      // Exercise the booking modal without completing a real booking.
      const clicked = await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) => /book now/i.test(b.textContent ?? ""));
        if (btn) { btn.click(); return true; }
        return false;
      });
      if (clicked) {
        await page.waitForTimeout(3000); // modal opens, fetches, GA events
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
      } else {
        consoleErrs.push("booking interaction: no 'Book Now' button found");
      }
    }
  } catch (err) {
    pageErrors.push(`navigation: ${String(err).slice(0, 120)}`);
  }

  const entry = {
    path: path + (interact ? ` (+${interact})` : ""),
    csp: csp.length,
    consoleErrs: consoleErrs.length,
    pageErrors: pageErrors.length,
    failed: failed.length,
    detail: [
      ...csp.map((t) => `CSP: ${t.slice(0, 200)}`),
      ...consoleErrs.slice(0, 3).map((t) => `console: ${t.slice(0, 160)}`),
      ...pageErrors.slice(0, 3).map((t) => `pageerror: ${t.slice(0, 160)}`),
      ...failed.slice(0, 3).map((t) => `reqfail: ${t.slice(0, 160)}`),
    ],
  };
  if (csp.length > 0) anyCspViolation = true;
  perPage.push(entry);
  await context.close();
}

for (const p of PAGES) await sweep(p);
await sweep("/", { interact: "booking" });
if (!QUICK) await sweep("/bike-service", { interact: "booking" });

await browser.close();

console.log(`# csp-console sweep base=${BASE} viewport=${MOBILE ? "mobile 390×844" : "desktop 1280×900"} pages=${perPage.length}`);
for (const e of perPage) {
  const flag = e.csp > 0 ? "  ⚠ CSP VIOLATION" : "";
  console.log(`${e.path}  →  csp=${e.csp} consoleErr=${e.consoleErrs} pageErr=${e.pageErrors} reqFail=${e.failed}${flag}`);
  for (const d of e.detail) console.log(`    ${d}`);
}
console.log(anyCspViolation ? "# RESULT: CSP VIOLATIONS FOUND (see above)" : "# RESULT: CLEAN — no CSP violations observed");
process.exit(anyCspViolation ? 1 : 0);
