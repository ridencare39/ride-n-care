/** Video homepage verification — owner request 2026-10-04 (preview-only).
 *  Checks the cinematic video hero + blue CTA video: exact source file,
 *  muted autoplay/loop, sound toggle, removed animations, responsive
 *  desktop/tablet/mobile behaviour, reduced-motion fallback, video-failure
 *  fallback, booking/nav/reviews functionality, no horizontal overflow.
 *  Usage: bun scripts/test-video-hero.mjs [baseURL] */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8080";
const VIDEO_PATH = "/816741921_1791109124906185.mp4";
const SHOT_DIR = "docs/preview/video-hero";
const results = [];
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

async function heroVideoState(page) {
  return page.evaluate(async (videoPath) => {
    const v = document.querySelector("video");
    if (!v) return null;
    await new Promise((r) => setTimeout(r, 1500));
    const hero = document.querySelector("section.navy-sheen");
    const hr = hero?.getBoundingClientRect();
    const r = v.getBoundingClientRect();
    const cs = getComputedStyle(v);
    return {
      src: v.getAttribute("src"),
      muted: v.muted,
      loop: v.loop,
      autoplay: v.autoplay,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState,
      vw: v.videoWidth,
      vh: v.videoHeight,
      duration: v.duration,
      objectFit: cs.objectFit,
      objectPosition: cs.objectPosition,
      pointerEvents: cs.pointerEvents,
      coversHero: hr
        ? r.width >= hr.width - 2 && r.height >= hr.height - 2
        : false,
    };
  }, VIDEO_PATH);
}

async function checkRemovedAnimations(page, label) {
  const gone = await page.evaluate(() => ({
    duo: document.querySelectorAll(".hero-duo").length,
    mechanic: document.querySelectorAll(".mech-float").length,
    parade: document.querySelectorAll(".rnc-cruise, .rnc-ride").length,
    headlight: document.querySelectorAll(".hero-headlight-focus").length,
    orbs: document.querySelectorAll(".float-slow, .float-slower").length,
  }));
  check(
    `${label}: car+bike duo removed`,
    gone.duo === 0,
    `n=${gone.duo}`,
  );
  check(
    `${label}: mechanic mascot removed`,
    gone.mechanic === 0,
    `n=${gone.mechanic}`,
  );
  check(
    `${label}: background vehicle parade removed`,
    gone.parade === 0,
    `n=${gone.parade}`,
  );
  check(
    `${label}: headlight sweep removed`,
    gone.headlight === 0,
    `n=${gone.headlight}`,
  );
  check(
    `${label}: floating glow orbs removed`,
    gone.orbs === 0,
    `n=${gone.orbs}`,
  );
}

async function noOverflow(page, label) {
  const o = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));
  check(`${label}: no horizontal overflow`, o.sw <= o.iw + 1, `${o.sw} vs ${o.iw}`);
}

/* ── DESKTOP 1440×900 ─────────────────────────────────────────────────── */
console.log("\n── Desktop 1440×900 ──");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  const videoUrls = [];
  p.on("request", (r) => {
    if (r.url().endsWith(".mp4")) videoUrls.push(r.url());
  });

  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForSelector("video", { timeout: 40000 });

  const hv = await heroVideoState(p);
  check("desktop: hero video present", !!hv);
  check(
    "desktop: exact uploaded file used",
    hv?.src === VIDEO_PATH,
    hv?.src,
  );
  check(
    "desktop: muted + autoplay + loop",
    hv?.muted === true && hv?.autoplay === true && hv?.loop === true,
  );
  check(
    "desktop: playing and advancing",
    hv && !hv.paused && hv.currentTime > 0.2,
    `t=${hv?.currentTime?.toFixed(2)}s readyState=${hv?.readyState}`,
  );
  check(
    "desktop: original 1080×1920 decoded (no re-encode)",
    hv?.vw === 1080 && hv?.vh === 1920,
    `${hv?.vw}x${hv?.vh} dur=${hv?.duration}s`,
  );
  check("desktop: object-cover crop", hv?.objectFit === "cover", hv?.objectPosition);
  check("desktop: video never intercepts clicks", hv?.pointerEvents === "none");
  check("desktop: video covers full hero area", hv?.coversHero);

  await checkRemovedAnimations(p, "desktop");

  const sparkle = await p.evaluate(() => {
    const el = document.querySelector(".hero-brand-name");
    const spans = el ? el.querySelectorAll(".hero-sparkle") : [];
    const first = spans[0] ? getComputedStyle(spans[0]) : null;
    return {
      n: spans.length,
      animation: first?.animationName,
      opacity: first?.opacity,
    };
  });
  check(
    "desktop: hero sparkles kept in DOM but stopped",
    sparkle.n >= 3 && sparkle.n <= 4 && sparkle.animation === "none",
    `n=${sparkle.n} anim=${sparkle.animation} op=${sparkle.opacity}`,
  );

  // Owner update 2026-10-04: NO sound control anywhere — video always muted
  const soundControls = await p.locator(
    'button[aria-label*="sound" i], button[aria-label*="mute" i], [aria-label*="unmute" i], button:has-text("sound")',
  ).count();
  check("desktop: no sound control present", soundControls === 0, `n=${soundControls}`);
  await sleep(1200);
  const stillMuted = await p.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { muted: v.muted, playing: !v.paused, t: v.currentTime } : null;
  });
  check(
    "desktop: video stays muted while playing",
    stillMuted?.muted === true && stillMuted?.playing === true,
    JSON.stringify(stillMuted),
  );

  const copy = await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { w: b.width, h: b.height, vis: s.visibility !== "hidden" && s.display !== "none" };
    };
    return {
      h1: r(h1),
      h1Text: h1?.textContent?.replace(/\s+/g, " ").trim().slice(0, 60),
      // owner redesign 2026-10-04: hero duplicate CTAs removed
      heroBook: !!document.querySelector(".hero-cta-book"),
      heroBd: !!document.querySelector("a.hero-cta-emergency"),
      floatBook: !!document.querySelector(".float-book"),
      sos: !!document.querySelector(".rnc-sos"),
    };
  });
  check("desktop: H1 visible above video", copy.h1?.vis && copy.h1?.h > 0, copy.h1Text);
  check(
    "desktop: hero duplicate CTAs removed (float Book Now + SOS kept)",
    !copy.heroBook && !copy.heroBd && copy.floatBook && copy.sos,
    JSON.stringify({ heroBook: copy.heroBook, heroBd: copy.heroBd, floatBook: copy.floatBook, sos: copy.sos }),
  );

  // Fast-start requirements (owner request 2026-10-04): download begins at
  // HTML parse (SSR'd <video>) and the poster paints immediately.
  const perf = await p.evaluate(() => {
    const e = performance.getEntriesByType("resource").find((x) => x.name.endsWith(".mp4"));
    const wrap = document.querySelector("section.navy-sheen .rnc-video-layer");
    const v = document.querySelector("video");
    return {
      start: e ? Math.round(e.startTime) : null,
      posterAttr: v?.getAttribute("poster") ?? null,
      wrapperBg: wrap ? getComputedStyle(wrap).backgroundImage : "none",
      hydrated: (() => { const el = document.querySelector(".float-book"); return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps")); })(),
    };
  });
  check(
    "desktop: MP4 download starts promptly (<3s, SSR-attached)",
    perf.start !== null && perf.start < 3000,
    `start=${perf.start}ms hydrated=${perf.hydrated}`,
  );
  check(
    "desktop: poster paints on layer + element",
    perf.wrapperBg.includes("ride-n-care-video-poster") && perf.posterAttr === "/ride-n-care-video-poster.jpg",
    `poster=${perf.posterAttr}`,
  );

  await noOverflow(p, "desktop");
  await p.screenshot({ path: `${SHOT_DIR}/desktop-hero.png` });

  // blue CTA video (lazy)
  await p.evaluate(() => {
    const h2 = [...document.querySelectorAll("h2")].find((x) =>
      x.textContent?.includes("Ready for a smoother ride?"),
    );
    h2?.scrollIntoView({ block: "center" });
  });
  let videoCount = 0;
  for (let i = 0; i < 30; i++) {
    videoCount = await p.evaluate(() => document.querySelectorAll("video").length);
    if (videoCount >= 2) break;
    await sleep(400);
  }
  check("desktop: CTA video attaches when scrolled into view", videoCount >= 2, `videos=${videoCount}`);
  // Poll until the freshly-attached CTA video is actually playing (a fixed
  // 1.5s wait races the attach → first-frame → play sequence on a cold server)
  for (let i = 0; i < 40; i++) {
    const playing = await p.evaluate(() => {
      const v = [...document.querySelectorAll("video")][1];
      return !!v && !v.paused && v.currentTime > 0;
    });
    if (playing) break;
    await sleep(400);
  }
  const cta = await p.evaluate(() => {
    const vids = [...document.querySelectorAll("video")];
    const v = vids[1];
    if (!v) return null;
    const tint = v.parentElement?.nextElementSibling;
    return {
      src: v.getAttribute("src"),
      muted: v.muted,
      loop: v.loop,
      paused: v.paused,
      t: v.currentTime,
      tintPresent: !!tint && tint.getAttribute("aria-hidden") === "true",
      h2Visible: (() => {
        const h2 = [...document.querySelectorAll("h2")].find((x) =>
          x.textContent?.includes("Ready for a smoother ride?"),
        );
        if (!h2) return false;
        const b = h2.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      })(),
    };
  });
  check(
    "desktop: CTA uses same exact video file",
    cta?.src === VIDEO_PATH,
    cta?.src,
  );
  check(
    "desktop: CTA video muted autoplay loop",
    cta?.muted === true && cta?.loop === true && cta && !cta.paused && cta.t > 0,
    `t=${cta?.t?.toFixed(2)}`,
  );
  check("desktop: CTA brand-blue tint overlay present", cta?.tintPresent === true);
  check("desktop: CTA copy visible above video", cta?.h2Visible === true);
  await p.screenshot({ path: `${SHOT_DIR}/desktop-cta.png` });

  // unique file (both layers share one URL → one cached download)
  check(
    "desktop: single distinct video URL (no duplicate asset)",
    new Set(videoUrls).size <= 1,
    `${new Set(videoUrls).size} distinct / ${videoUrls.length} requests`,
  );

  // ── functionality: nav, booking modal, call/WhatsApp, reviews ──
  const nav = await p.evaluate(() => ({
    headerLinks: document.querySelectorAll("header a").length,
    tel: document.querySelectorAll('a[href^="tel:"]').length,
    wa: document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp"]').length,
    services: document.querySelectorAll("#services a").length,
    areas: !!document.querySelector("#areas, [aria-label*='areas' i]"),
  }));
  check("desktop: header navigation links", nav.headerLinks >= 4, `n=${nav.headerLinks}`);
  check("desktop: call links present", nav.tel >= 1, `n=${nav.tel}`);
  check("desktop: WhatsApp links present", nav.wa >= 1, `n=${nav.wa}`);
  check("desktop: services grid present", nav.services >= 8, `n=${nav.services}`);

  await p.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await p.evaluate(() => document.querySelector(".float-book")?.click());
  let dlg = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    dlg = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    if (dlg) break;
  }
  check("desktop: booking modal opens", !!dlg);
  if (dlg) {
    await p.keyboard.press("Escape");
    await sleep(500);
    const stillOpen = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    check("desktop: booking modal closes (Escape)", !stillOpen);
  }

  // native Experience section (replaced the expired Trustindex widget
  // 2026-10-04 — fully static, so no async mount/poll needed)
  const exp = await p.evaluate(() => {
    const s = document.getElementById("experience");
    return {
      present: !!s,
      heading: s?.querySelector("h2")?.textContent?.trim() ?? "",
      cards: s ? s.querySelectorAll("div.grid > div").length : 0,
      expired: /trial period has expired|subscription plans/i.test(document.body.innerText),
      ti: !!document.querySelector(".ti-widget, script[src*='trustindex']"),
    };
  });
  check(
    "desktop: Experience section renders (native, Trustindex removed)",
    exp.present && exp.heading === "The Ride N Care Experience" && exp.cards >= 10,
    `heading=${JSON.stringify(exp.heading)} cards=${exp.cards}`,
  );
  check("desktop: expired Trustindex notice gone", !exp.expired && !exp.ti, `expired=${exp.expired} ti=${exp.ti}`);

  check("desktop: no page errors", errors.length === 0, errors[0] ?? "");
  await ctx.close();
}

/* ── TABLET 820×1180 ──────────────────────────────────────────────────── */
console.log("\n── Tablet 820×1180 ──");
{
  const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForSelector("video", { timeout: 40000 });
  const hv = await heroVideoState(p);
  check("tablet: video present + playing", hv && !hv.paused && hv.currentTime > 0, `t=${hv?.currentTime?.toFixed(2)}`);
  check("tablet: object-cover fills hero", hv?.objectFit === "cover" && hv?.coversHero);
  await checkRemovedAnimations(p, "tablet");
  const copy = await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    const b = h1?.getBoundingClientRect();
    return { ok: !!b && b.width > 0 && b.height > 0, sw: document.documentElement.scrollWidth, iw: window.innerWidth };
  });
  check("tablet: H1 visible", copy.ok);
  const tabletSound = await p.locator(
    'button[aria-label*="sound" i], button[aria-label*="mute" i], [aria-label*="unmute" i], button:has-text("sound")',
  ).count();
  check("tablet: no sound control present", tabletSound === 0, `n=${tabletSound}`);
  check("tablet: no horizontal overflow", copy.sw <= copy.iw + 1, `${copy.sw} vs ${copy.iw}`);
  check("tablet: no page errors", errors.length === 0, errors[0] ?? "");
  await p.screenshot({ path: `${SHOT_DIR}/tablet-hero.png` });
  await ctx.close();
}

/* ── MOBILE 375×812 (Android Chrome emulation) ────────────────────────── */
console.log("\n── Mobile 375×812 (Android Chrome emulation) ──");
{
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForSelector("video", { timeout: 40000 });
  const hv = await heroVideoState(p);
  check("mobile: video present + playing", hv && !hv.paused && hv.currentTime > 0, `t=${hv?.currentTime?.toFixed(2)}`);
  check("mobile: object-cover portrait crop", hv?.objectFit === "cover", hv?.objectPosition);
  await checkRemovedAnimations(p, "mobile");

  const layout = await p.evaluate(() => {
    const soundBtns = [...document.querySelectorAll("button")].filter((b) =>
      /sound|mute/i.test((b.getAttribute("aria-label") || "") + (b.textContent || "")),
    );
    return {
      soundButtons: soundBtns.length,
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    };
  });
  check("mobile: no sound control present", layout.soundButtons === 0, `n=${layout.soundButtons}`);
  check("mobile: no horizontal overflow", layout.sw <= layout.iw + 1, `${layout.sw} vs ${layout.iw}`);

  await p.screenshot({ path: `${SHOT_DIR}/mobile-hero.png` });

  // Owner update 2026-10-04: video remains muted after touch interaction
  const m = await p.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { muted: v.muted, playing: !v.paused } : null;
  });
  check("mobile: video stays muted", m?.muted === true, JSON.stringify(m));

  // scroll + booking interaction (floating circular Book Now)
  await p.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  await p.evaluate(() => document.querySelector(".float-book")?.click());
  let dlg = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    dlg = await p.evaluate(() => document.querySelector("div[role=dialog]"));
    if (dlg) break;
  }
  check("mobile: booking modal opens on tap", !!dlg);
  if (dlg) await p.keyboard.press("Escape");

  // CTA crop on portrait mobile
  await p.evaluate(() => {
    const h2 = [...document.querySelectorAll("h2")].find((x) =>
      x.textContent?.includes("Ready for a smoother ride?"),
    );
    h2?.scrollIntoView({ block: "center" });
  });
  await sleep(2500);
  await p.screenshot({ path: `${SHOT_DIR}/mobile-cta.png` });

  check("mobile: no page errors", errors.length === 0, errors[0] ?? "");
  await ctx.close();
}

/* ── REDUCED MOTION ───────────────────────────────────────────────────── */
console.log("\n── prefers-reduced-motion: reduce ──");
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  const videoHits = [];
  p.on("request", (r) => {
    if (r.url().endsWith(".mp4")) videoHits.push(r.url());
  });
  await p.goto(BASE + "/", { waitUntil: "load" });
  // Pre-hydration: the SSR'd <video> must already be CSS-hidden so a
  // reduced-motion visitor never sees movement from first paint.
  const early = await p.evaluate(() => {
    const v = document.querySelector("video");
    return { present: !!v, hidden: v ? getComputedStyle(v).display === "none" : null };
  });
  check(
    "reduced-motion: SSR'd video hidden from first paint (CSS guard)",
    early.present ? early.hidden === true : true,
    JSON.stringify(early),
  );
  // After hydration the source unmounts entirely — but dev-cold commit+effects
  // can lag the reactProps signal by several seconds, so poll (bounded).
  let hyd = false;
  for (let i = 0; i < 80; i++) {
    hyd = await p.evaluate(() => {
      const el = document.querySelector(".float-book");
      return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
    });
    if (hyd) break;
    await sleep(250);
  }
  let unmounted = false;
  for (let i = 0; i < 60; i++) {
    const n = await p.evaluate(() => document.querySelectorAll("video").length);
    if (n === 0) { unmounted = true; break; }
    await sleep(500);
  }
  const st = await p.evaluate(() => {
    const wrap = document.querySelector("section.navy-sheen .rnc-video-layer");
    return {
      videos: document.querySelectorAll("video").length,
      poster: wrap ? getComputedStyle(wrap).backgroundImage.includes("poster") : false,
      h1: !!document.querySelector("h1"),
      bg: getComputedStyle(document.querySelector("section.navy-sheen")).backgroundImage,
      playing: [...document.querySelectorAll("video")].some((v) => !v.paused),
    };
  });
  check("reduced-motion: hydrated", hyd);
  check("reduced-motion: source unmounted (no motion ever plays)", unmounted, `unmounted=${unmounted}`);
  check("reduced-motion: poster fallback visible", st.poster);
  check("reduced-motion: hero copy still visible", st.h1);
  check("reduced-motion: gradient fallback visible", st.bg !== "none");
  check("reduced-motion: no page errors", errors.length === 0, errors[0] ?? "");
  await p.screenshot({ path: `${SHOT_DIR}/reduced-motion-fallback.png` });
  await ctx.close();
}

/* ── VIDEO FAILURE FALLBACK (blocked source) ──────────────────────────── */
console.log("\n── Video load failure → graceful fallback ──");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.route(`**/*.mp4`, (route) => route.abort());
  await p.goto(BASE + "/", { waitUntil: "load" });
  // The failure can occur pre-hydration (its React onError never fires then);
  // the effect re-checks v.error at hydration and unmounts — dev-cold commit
  // can lag the reactProps signal, so poll (bounded) for the unmount.
  let hyd = false;
  for (let i = 0; i < 80; i++) {
    hyd = await p.evaluate(() => {
      const el = document.querySelector(".float-book");
      return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
    });
    if (hyd) break;
    await sleep(250);
  }
  let unmounted = false;
  for (let i = 0; i < 60; i++) {
    const n = await p.evaluate(() => document.querySelectorAll("video").length);
    if (n === 0) { unmounted = true; break; }
    await sleep(500);
  }
  const st = await p.evaluate(() => ({
    videos: document.querySelectorAll("video").length,
    h1: !!document.querySelector("h1"),
    book: [...document.querySelectorAll("button")].some((b) =>
      b.textContent?.includes("Book Now"),
    ),
    bg: getComputedStyle(document.querySelector("section.navy-sheen")).backgroundImage,
  }));
  check("failure: broken <video> unmounted (no black box)", unmounted && st.videos === 0, `videos=${st.videos}`);
  check("failure: hero copy + CTA still usable", st.h1 && st.book);
  check("failure: gradient fallback visible", st.bg !== "none");
  check("failure: no uncaught page errors", errors.length === 0, errors[0] ?? "");
  await p.screenshot({ path: `${SHOT_DIR}/video-failure-fallback.png` });
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
