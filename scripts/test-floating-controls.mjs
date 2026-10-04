/** Floating controls redesign verification — owner request 2026-10-04.
 *  Checks at 1440 / 820 / 375 / 320: bottom bar Call · circular Book Now ·
 *  WhatsApp arrangement (centre, glow, wiggle), SOS top-right below the menu
 *  button (pulse, correct destination), booking modal, call/WhatsApp
 *  destinations unchanged, panel-open hide, reduced-motion, no overflow.
 *  Usage: bun scripts/test-floating-controls.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8080";
const SHOT_DIR = "docs/preview/floating";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

/* ── Layout across four widths ─────────────────────────────────────────── */
for (const w of [1440, 820, 375, 320]) {
  const label = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "load" });
  await sleep(2500);

  const g = await p.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, right: r.right, bottom: r.bottom };
    };
    const ov = (a, b) => !!a && !!b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const bar = document.querySelector(".float-bar");
    const inner = bar?.firstElementChild;
    const kids = inner ? [...inner.children] : [];
    const find = (t) => kids.find((k) => (k.getAttribute("aria-label") || "").toLowerCase().includes(t));
    const call = find("call");
    const wa = find("whatsapp");
    const book = document.querySelector(".float-book") ?? find("book now");
    const sos = document.querySelector(".rnc-sos");
    const menu = [...document.querySelectorAll(".menu-btn")].find((x) => x.getAttribute("aria-label") === "Open menu");
    const rCall = rect(call), rBook = rect(book), rWa = rect(wa), rSos = rect(sos), rMenu = rect(menu);
    const bookCS = book ? getComputedStyle(book) : null;
    const sosCS = sos ? getComputedStyle(sos) : null;
    const barCS = bar ? getComputedStyle(bar) : null;
    return {
      barVisible: !!bar && barCS.opacity !== "0" && barCS.visibility !== "hidden",
      count: kids.length,
      order: kids.map((k) => (k.getAttribute("aria-label") || k.textContent || "").trim().slice(0, 22)),
      rCall, rBook, rWa, rSos, rMenu,
      callHref: call?.getAttribute("href"),
      waLabel: wa?.getAttribute("aria-label"),
      waCtc: wa?.getAttribute("data-ctc"),
      waTag: wa?.tagName,
      sosHref: sos?.getAttribute("href"),
      sosLabel: sos?.getAttribute("aria-label"),
      sosTag: sos?.tagName,
      bookLabel: book?.getAttribute("aria-label"),
      bookTag: book?.tagName,
      bookCls: book?.className ?? "",
      bookRadius: bookCS?.borderRadius,
      bookAnim: bookCS?.animationName,
      bookShadow: bookCS?.boxShadow,
      sosAnim: sosCS?.animationName,
      overlaps: {
        callBook: ov(rCall, rBook),
        bookWa: ov(rBook, rWa),
        callWa: ov(rCall, rWa),
        sosMenu: ov(rSos, rMenu),
      },
      vw: window.innerWidth,
      sw: document.documentElement.scrollWidth,
    };
  });

  check(`${label}: float bar visible with 3 controls`, g.barVisible && g.count === 3, `count=${g.count}`);
  check(
    `${label}: order Call — Book Now — WhatsApp`,
    g.order.length === 3 && /call/i.test(g.order[0]) && /book now/i.test(g.order[1]) && /whatsapp/i.test(g.order[2]),
    JSON.stringify(g.order),
  );
  check(
    `${label}: Book Now centred in viewport`,
    g.rBook && Math.abs(g.rBook.cx - g.vw / 2) <= 10,
    `cx=${g.rBook?.cx?.toFixed(1)} vs ${g.vw / 2}`,
  );
  check(
    `${label}: Call left · WhatsApp right of Book Now`,
    g.rCall && g.rWa && g.rCall.cx < g.rBook.cx && g.rBook.cx < g.rWa.cx,
    `${g.rCall?.cx?.toFixed(0)} < ${g.rBook?.cx?.toFixed(0)} < ${g.rWa?.cx?.toFixed(0)}`,
  );
  check(
    `${label}: no overlap between the three controls`,
    !g.overlaps.callBook && !g.overlaps.bookWa && !g.overlaps.callWa,
    JSON.stringify(g.overlaps),
  );
  check(
    `${label}: Book Now circular and tappable (>=56px)`,
    g.rBook && parseFloat(g.bookRadius ?? "0") >= g.rBook.w / 2 - 1 && g.rBook.w >= 56 && g.rBook.h >= 56,
    `r=${g.bookRadius} size=${g.rBook?.w?.toFixed(0)}x${g.rBook?.h?.toFixed(0)}`,
  );
  check(
    `${label}: Book Now glow present`,
    !!g.bookShadow && g.bookShadow !== "none" && g.bookShadow.length > 40,
    (g.bookShadow ?? "").slice(0, 70),
  );
  check(
    `${label}: Book Now red neon theme (owner redesign)`,
    /from-red-500/.test(g.bookCls) && /248, 113, 113/.test(g.bookShadow ?? "") && /239, 68, 68/.test(g.bookShadow ?? ""),
    `cls=${/from-red-500/.test(g.bookCls)} shadow=${(g.bookShadow ?? "").slice(0, 50)}`,
  );
  check(
    `${label}: Book Now gentle wiggle animation`,
    /rnc-book-wiggle/.test(g.bookAnim ?? ""),
    g.bookAnim,
  );
  check(
    `${label}: Book Now accessible label`,
    g.bookLabel === "Book Now" && g.bookTag === "BUTTON",
    `${g.bookTag} "${g.bookLabel}"`,
  );

  check(
    `${label}: SOS top-right below menu button`,
    g.rSos && g.rMenu && g.rSos.y >= g.rMenu.bottom + 4 && g.rSos.cx > g.vw * 0.55,
    `sos.y=${g.rSos?.y?.toFixed(0)} menu.bottom=${g.rMenu?.bottom?.toFixed(0)} cx=${g.rSos?.cx?.toFixed(0)}`,
  );
  check(`${label}: SOS does not overlap menu button`, !g.overlaps.sosMenu);
  check(
    `${label}: SOS fully inside viewport`,
    g.rSos && g.rSos.x >= 0 && g.rSos.right <= g.vw + 1 && g.rSos.y >= 0,
    JSON.stringify(g.rSos && { x: g.rSos.x, right: g.rSos.right }),
  );
  check(
    `${label}: SOS tappable (>=44px) + pulsing + correct label`,
    g.rSos && g.rSos.w >= 44 && /rnc-sos-pulse/.test(g.sosAnim ?? "") && g.sosLabel === "SOS — Breakdown Assistance",
    `${g.rSos?.w?.toFixed(0)}px anim=${g.sosAnim}`,
  );
  check(
    `${label}: SOS links to existing breakdown page`,
    g.sosTag === "A" && g.sosHref === "/breakdown-assistance",
    `${g.sosTag} → ${g.sosHref}`,
  );

  check(`${label}: Call destination unchanged`, g.callHref === "tel:+918069409289", g.callHref);
  check(
    `${label}: WhatsApp action unchanged (button + data-ctc)`,
    g.waTag === "BUTTON" && g.waLabel === "Book on WhatsApp" && g.waCtc === "whatsapp_click",
    `${g.waTag} ${g.waLabel} ${g.waCtc}`,
  );
  check(`${label}: no horizontal overflow`, g.sw <= g.vw + 1, `${g.sw} vs ${g.vw}`);
  check(`${label}: no page errors`, errors.length === 0, errors[0] ?? "");

  if (w === 1440) await p.screenshot({ path: `${SHOT_DIR}/desktop-home.png` });
  if (w === 375) await p.screenshot({ path: `${SHOT_DIR}/mobile-home.png` });

  await ctx.close();
}

/* ── Interactions: booking modal, SOS navigation, panel hide ───────────── */
console.log("\n── Interactions (375px) ──");
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errors = [];
  let step = "load";
  p.on("pageerror", (e) => errors.push(`[${step}] ${String(e.stack || e.message || e)}`));
  p.on("console", (m) => {
    const t = m.text();
    if (m.type() === "error" && /error occurred in|Uncaught|TypeError|ReferenceError|Cannot read|Concurrent rendering/i.test(t)) {
      errors.push(`[console@${step}] ${t.slice(0, 600)}`);
    }
  });
  await p.goto(BASE + "/", { waitUntil: "load" });
  // Wait for React hydration before interacting (same pattern as
  // test-hero-cta.mjs) — clicking a not-yet-hydrated button is a no-op and
  // navigating mid-hydration triggers React's recoverable concurrent-render
  // error. The delay varies with dev-server transform warmth.
  // Single bounded wait for the real readiness signals — NO scrolling (scroll
  // probes during load were observed to interfere with route hydration on
  // this low-memory preview box):
  //  reactProps = hydration render started · [data-root-ready] = root layout
  //  committed · [data-video-ready] = home-route boundary committed (needed
  //  before client-side navigation — navigating earlier races TanStack
  //  Router's match registry with a matchId invariant).
  let hydrated = false;
  let committed = false;
  for (let i = 0; i < 160; i++) {
    const st = await p.evaluate(() => {
      const el = document.querySelector(".float-book");
      return {
        hyd: !!el && Object.keys(el).some((k) => k.startsWith("__reactProps")),
        root: !!document.querySelector("[data-root-ready]"),
        home: !!document.querySelector("[data-video-ready]"),
      };
    });
    if (st.hyd) hydrated = true;
    if (st.root && st.home) committed = true;
    if (hydrated && committed) break;
    await sleep(500);
  }
  check("interactions: React hydrated before clicks", hydrated);
  check("interactions: root + home committed (effects flushed)", committed);
  await sleep(400);

  // booking modal from the floating Book Now
  step = "open-booking";
  await p.evaluate(() => document.querySelector(".float-book")?.click());
  let dlg = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    dlg = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    if (dlg) break;
  }
  check("float Book Now opens existing booking modal", !!dlg);
  if (dlg) {
    step = "close-booking";
    // focus wiring can lag a late dialog mount — poll with a repeated Escape
    // instead of a single fixed wait.
    let closed = false;
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) await p.keyboard.press("Escape");
      await sleep(400);
      closed = !(await p.evaluate(() => document.querySelector("div[role=dialog]")));
      if (closed) break;
    }
    check("booking modal closes (Escape)", closed);
  }

  // touch tap on Book Now (mobile ergonomics)
  step = "tap-book";
  await p.locator(".float-book").tap();
  let dlg2 = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    dlg2 = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    if (dlg2) break;
  }
  check("float Book Now opens on mobile tap", !!dlg2);
  if (dlg2) {
    step = "close-booking-2";
    await p.keyboard.press("Escape");
  }
  await sleep(400);

  // SOS navigation → existing destination
  step = "sos-navigate";
  await p.evaluate(() => document.querySelector(".rnc-sos")?.click());
  await sleep(1200);
  const url = p.url();
  check(
    "SOS navigates to /breakdown-assistance",
    url.endsWith("/breakdown-assistance"),
    url,
  );
  const pageOk = await p.evaluate(() => !!document.querySelector("h1"));
  check("breakdown page renders (no broken link)", pageOk);

  // back home → wait for a REAL commit (root + home boundary) → open menu
  step = "goto-home";
  await p.goto(BASE + "/", { waitUntil: "load" });
  let committed2 = false;
  for (let i = 0; i < 160; i++) {
    // menu lives in the ROOT layout — its mount marker is the ready signal
    committed2 = await p.evaluate(() => !!document.querySelector("[data-root-ready]"));
    if (committed2) break;
    await sleep(500);
  }
  check("menu step: root committed", committed2);
  step = "open-menu";
  await p.evaluate(() => document.querySelector(".menu-btn")?.click());
  let panelOpen = false;
  for (let i = 0; i < 20; i++) {
    panelOpen = await p.evaluate(() => !!document.querySelector(".panel-root.is-open"));
    if (panelOpen) break;
    await sleep(300);
  }
  await sleep(400);
  const hidden = await p.evaluate(() => {
    const bar = document.querySelector(".float-bar");
    const sos = document.querySelector(".rnc-sos");
    const st = (el) => !!el && (getComputedStyle(el).visibility === "hidden" || getComputedStyle(el).opacity === "0");
    return { bar: st(bar), sos: st(sos), panelOpen: !!document.querySelector(".panel-root.is-open") };
  });
  check("menu open: float bar hidden (existing behaviour kept)", hidden.panelOpen && hidden.bar, JSON.stringify(hidden));
  check("menu open: SOS hidden too", hidden.sos);
  check("interactions: no page errors", errors.length === 0, errors[0] ?? "");
  await ctx.close();
}

/* ── Reduced motion ────────────────────────────────────────────────────── */
console.log("\n── prefers-reduced-motion: reduce ──");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "load" });
  await sleep(2500);
  const st = await p.evaluate(() => {
    const book = document.querySelector(".float-book");
    const sos = document.querySelector(".rnc-sos");
    return {
      bookAnim: book ? getComputedStyle(book).animationName : "missing",
      sosAnim: sos ? getComputedStyle(sos).animationName : "missing",
      bookVisible: !!book && book.getBoundingClientRect().width > 0,
      sosVisible: !!sos && sos.getBoundingClientRect().width > 0,
    };
  });
  check("reduced-motion: Book Now wiggle disabled", st.bookAnim === "none", st.bookAnim);
  check("reduced-motion: SOS pulse disabled", st.sosAnim === "none", st.sosAnim);
  check("reduced-motion: both controls still visible", st.bookVisible && st.sosVisible);
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
