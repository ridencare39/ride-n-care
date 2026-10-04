/**
 * Photo integration suite: verifies the 7 owner photos are wired correctly.
 *
 * Checks, per page:
 *   - every <img> actually loads (no broken images)
 *   - each owner photo has unique non-empty alt text
 *   - each owner photo pins width/height (no layout shift)
 *   - each owner photo is lazy-loaded + async-decoded (below the fold)
 *   - srcset present with 800w + 1600w candidates
 *   - no horizontal overflow at mobile & desktop widths
 *   - page errors / failed image requests
 * Plus a sitemap check: xmlns:image declared and exactly 7 image:loc entries.
 *
 * Usage: bun scripts/test-photo-integration.mjs [baseURL]   (default :8081)
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8081";
const SLUGS = [
  "doorstep-service-apartment",
  "mechanic-tools-tray",
  "ride-n-care-workshop-signage",
  "scooter-service-repair",
  "motorcycle-workshop-repair",
  "doorstep-royal-enfield-repair",
  "royal-enfield-service-at-home",
];
const PAGES = ["/", "/bike-service", "/bike-repair", "/doorstep-bike-service", "/scooter-service", "/about"];

const results = [];
const altRegistry = new Map(); // alt → pages where it appears
function check(name, pass, note = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
}

const browser = await chromium.launch();

for (const path of PAGES) {
  for (const width of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    const failed = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && !res.ok()) failed.push(`${res.status()} ${res.url().slice(-70)}`);
    });
    try {
      // Force lazy images to load: scroll through the page first.
      await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(500);
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      // 1) Inspect attributes FIRST (loading/decoding/alt/width/height are the
      //    source of truth — later forcing eager must not clobber them).
      const report = await page.evaluate((slugs) => {
        const imgs = [...document.images];
        const ours = imgs.filter((i) => slugs.some((s) => (i.currentSrc || i.src).includes(s)));
        const detail = ours.map((i) => ({
          src: (i.currentSrc || i.src).match(/([a-z-]+-\d+)\.webp/)?.[1] ?? i.src.slice(-60),
          alt: i.getAttribute("alt"),
          w: i.getAttribute("width"),
          h: i.getAttribute("height"),
          loading: i.getAttribute("loading"),
          decoding: i.getAttribute("decoding"),
          srcSet: i.getAttribute("srcset") ?? "",
          caption: i.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? null,
        }));
        return {
          total: imgs.length,
          ours: detail,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      }, SLUGS);

      // 2) Force any remaining lazy images to request, then wait until every img
      //    reports complete (load or error) — naturalWidth then tells real
      //    breakage from "not requested yet".
      await page.evaluate(() => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = "eager"; });
      });
      await page
        .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 8000 })
        .catch(() => {});
      await page.waitForTimeout(300);

      report.broken = await page.evaluate(() => {
        const imgs = [...document.images];
        // 1) requested but failed (404 / decode error)
        const failed = imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => `failed: ${i.currentSrc || i.src}`);
        // 2) never requested after forcing eager — only acceptable for hidden
        //    0×0 duplicate marquee-clone tracks; a visible image that never
        //    loads is still a failure.
        const neverLoaded = imgs
          .filter((i) => !i.complete)
          .filter((i) => {
            const r = i.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          })
          .map((i) => `never loaded (visible): ${i.currentSrc || i.src}`);
        return [...failed, ...neverLoaded];
      });

      const tag = `${path}@${width}`;
      check(`${tag}: no broken images (${report.total} total)`, report.broken.length === 0, report.broken[0] ?? "");
      check(`${tag}: no horizontal overflow`, !report.overflow);
      check(`${tag}: no page errors`, errors.length === 0, errors[0] ?? "");
      check(`${tag}: no failed image requests`, failed.length === 0, failed[0] ?? "");

      for (const d of report.ours) {
        const ok = d.alt && d.alt.length > 10;
        check(`${tag}: photo ${d.src} has descriptive alt`, !!ok, d.alt ?? "(empty)");
        check(`${tag}: photo ${d.src} pins width/height`, d.w === "1600" && d.h === "1200", `${d.w}x${d.h}`);
        check(`${tag}: photo ${d.src} lazy + async`, d.loading === "lazy" && d.decoding === "async");
        check(
          `${tag}: photo ${d.src} srcset has 800w+1600w`,
          /800w/.test(d.srcSet) && /1600w/.test(d.srcSet),
        );
        if (width === 375) {
          if (!altRegistry.has(d.alt)) altRegistry.set(d.alt, []);
          altRegistry.get(d.alt).push(path);
        }
      }
      if (path === "/" && width === 1280) {
        // Homepage must show its two assigned photos: apartment intro + tools.
        const srcs = report.ours.map((o) => o.src).join(" ");
        check("home: apartment photo present", srcs.includes("doorstep-service-apartment"));
        check("home: tools photo present", srcs.includes("mechanic-tools-tray"));
        check("home: exactly 2 owner photos (no gallery bloat)", report.ours.length === 2, `n=${report.ours.length}`);
        for (const d of report.ours) check("home caption present", !!d.caption, (d.caption ?? "").slice(0, 60));
      }
    } catch (e) {
      check(`${path}@${width}: load`, false, String(e).slice(0, 140));
    }
    await page.close();
  }
}

// --- Alt uniqueness across the whole site (owner photos only) -------------
// altRegistry is keyed by the alt string itself: if two different photos shipped
// the same alt, they would collapse into one key and the count would drop < 7.
check(
  `owner-photo alt texts unique (${altRegistry.size} distinct alts)`,
  altRegistry.size >= 7,
  `n=${altRegistry.size}`,
);
for (const [alt, pages] of altRegistry) console.log(`  ALT: ${alt}  [${[...new Set(pages)].join(", ")}]`);

// --- Image sitemap --------------------------------------------------------
try {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  check("sitemap: OK status", res.ok);
  check("sitemap: xmlns:image declared", xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
  const locs = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
  check("sitemap: exactly 7 image entries", locs.length === 7, `n=${locs.length}`);
  for (const s of SLUGS) check(`sitemap: entry for ${s}`, locs.some((l) => l.includes(s)));
  // Every image URL must resolve on the environment under test. The sitemap
  // writes production-absolute locs (SITE_URL), so swap the origin to the
  // preview base before fetching — on a deployed host they match anyway.
  let bad = 0;
  for (const l of locs) {
    // Bun's URL.origin is readonly — rebuild against the tested base instead.
    const parsed = new URL(l);
    const u = new URL(parsed.pathname + parsed.search, BASE);
    const r = await fetch(u);
    if (!r.ok) { bad++; console.log(`  BAD ${r.status} ${u}`); }
  }
  check("sitemap: all image URLs resolve", bad === 0, `bad=${bad}`);
} catch (e) {
  check("sitemap image entries", false, String(e).slice(0, 140));
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks pass`);
process.exit(fails.length ? 1 : 0);
