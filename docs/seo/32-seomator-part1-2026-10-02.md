# SEOmator Audit Fix — Part 1 (Technical SEO, Core Web Vitals, Speed)

Date: 2026-10-02 · Site: https://ridencare.co.in · Worker: `ridencare39-ride-n-care`
Deploy: Worker version **d6520d31-b293-4be2-88db-8d50a286fd75** (intermediate during session: c230d294-337d-41e7-bd09-da1fe33578b0)

## Verified findings vs SEOmator claims

| SEOmator finding | Reality on production | Action |
| --- | --- | --- |
| "Text compression not detected / Brotli not detected" | `content-encoding: zstd` on all HTML/JS/CSS (Cloudflare compresses; curl `--compressed` receives zstd). SEOmator likely tested without `Accept-Encoding: br/gzip`. | **False positive — no change.** Nothing to fix; adding our own compression would double-compress. |
| "No alt-svc header found" | `alt-svc: h3=":443"; ma=86400` present (HTTP/3 advertised by Cloudflare). | **False positive — no change.** |
| "First image has lazy loading" | First `<img>` in every page is the header logo (a 1.6 KB inlined base64 WebP, eager). The first *network* images are the brand-marquee logos, which are far below the fold and intentionally lazy + IntersectionObserver-gated. | **No change needed**; confirmed correct. |
| "LCP candidate image is not preloaded" | On `/cars` and `/bikes` the hero image IS the mobile LCP element and had no preload. | **Fixed**: `preloadImage` support in `pageHead()` + `<link rel="preload" as="image" fetchPriority="high">` on both routes. |
| "base64 WebP LCP candidate" | The only base64 images are the header logo (40×40) and side-panel logo (36×36) — Vite inlines `logo-96.webp` (< 4 KB). No network cost, instant paint. | **No change needed** (inlining is optimal here). |
| "Unused JavaScript ~208 KiB" | Real problem: the shared bundle carried every route's `head()`/`loader()` + all service/answer/guide content. | **Fixed (partial)**: main bundle 1,068,733 → **915,226 bytes raw**, 317,200 → **274,749 bytes compressed (−42.5 KB, −13.4%)**. See below. |
| "Forced reflow detected" | SiteHeader read `getBoundingClientRect()` synchronously during hydration and called `setScrolled()` on every scroll event. | **Fixed**: initial pill measurement deferred to `requestAnimationFrame`; scroll state now updates only when the boolean flips. |
| "No responsive images using srcset" | The only large images are two 63–95 KB WebPs used at a single fixed aspect ratio; brands logos are ≤44 px. srcset variants would need generated assets. | **Documented**; the two 1600×1200 hero images are already WebP at 63 KB / 95 KB. Brand logos optimized (below). |
| "Missing preconnect to www.googletagmanager.com" | GA4 (`G-EQ8P35TH54`) loads gtag.js on every page. | **Fixed**: `<link rel="preconnect" href="https://www.googletagmanager.com">` emitted when GA/GTM env is set (no `crossorigin` — the script is fetched no-CORS). |

## Root-cause fixes shipped

### 1. Homepage LCP 3.44 s → 0.74 s (mobile) — hero entrance animations
Root cause: the hero's `.rise-in` / `.rise-in-late` / `.rise-in-later` entrance animations started at `opacity: 0`. Chrome does not record an opacity-animating element as an LCP candidate, so the hero text only became LCP when the 6 s rotor word swap repainted it at ~3.1 s (verified with per-candidate LCP tracing: entries at 0.5 s wordmark → 0.9 s SVG → **3.14 s H1**; reduced-motion baseline = 0.42 s).

Fix: `rnc-rise-in` keyframes are now **transform-only** (the rise motion is preserved; only the fade was removed). Measured after: homepage LCP **736 ms**, LCP element = hero paragraph, CLS 0.

### 2. JS bundle split (route heads/loaders vs page content)
Root cause: TanStack Start compiles every route's `head()`/`loader()` into the shared bundle, and those functions imported the full content modules (`services.ts` 67 KB, `car-services.ts` 45 KB, `answer-pages.ts` 85 KB, `guides.ts` 34 KB).

Fix:
- New generated summary modules — `service-summary.ts`, `answer-page-summary.ts`, `guide-summary.ts` — built by `scripts/gen-data-summaries.mjs` from the full modules (single source of truth; `scripts/test-data-sync.mjs` fails on drift).
- `nav.ts`, `schema.ts` (root-imported), homepage, index pages, area pages and cross-link modules import summaries only.
- Dynamic service routes (`/$service`, `/$service/`, `/$service/$area`) resolve the slim summary in `head`/`loader`; the lazy page component resolves the full def. `answers/$slug` and `guides/$slug` loaders use dynamic `import()` for the full content.
- `CAR_HUB` moved to `src/lib/car-hub.ts` (route head import); `DISPATCH_STEPS` moved to `src/lib/dispatch-steps.ts` (breakdown page import).

Result: parsed JS on the homepage 1,144,851 → 1,009,075 bytes (−136 KB); shared bundle −153 KB raw / −42.5 KB compressed.

### 3. Brand logo payload
`kawasaki.svg` was 93.7 KB (an Inkscape SVG embedding a 2560×404 raster); `royalenfield.svg` was 37.7 KB, both displayed at ≤36 px. Rasterized to 4× WebP (3.0 KB / 6.2 KB) with a pixel-diff check (mean ≤ 4.1/255). `scripts/optimize-brand-logos.mjs`.

### 4. Dead code removed
- `src/components/HeroBackground.tsx` (unreferenced; hero is SVG-animated).
- `src/components/Testimonials.tsx` (unreferenced).

### 5. Accepted / not changed (documented)
- **DOM 2,691 elements (target <1,500)**: breakdown — hero animated scene 545, global chrome 898 (header 227 + side panel 295 + services dropdown 180 + footer 187), areas 436, brands 284. Every one of these is content or navigation deliberately rendered (the closed panel/dropdown are server-rendered for crawlability). Reducing to <1,500 would require removing real content or crawlable links — declined per the preservation rules.
- **HTML ~305 KB (target <300 KB)**: already minified; JSON-LD is 10.8 KB and valid; inline SVG 88 KB is the animated hero + icons. No safe bulk reduction without cutting content.
- **Text-to-HTML ratio 5.6%**: not chased (explicit user list).
- **Source maps**: kept off (hidden maps would still be publicly fetchable from the CDN; no private upload target configured).
- **Compression / alt-svc**: verified present, nothing to add.

## Before / after (production, mobile 390×844 emulation)

| Metric | Before | After |
| --- | --- | --- |
| Homepage LCP | 3440 ms | **736 ms** |
| /cars LCP | 524 ms | 612 ms* |
| /bike-service LCP | 900 ms | 820 ms* |
| CLS (all pages) | 0 | 0 |
| Main bundle (compressed) | 317,200 B | **274,749 B** |
| Homepage parsed JS | 1,144,851 B | 1,009,075 B |
| kawasaki logo | 93,726 B | **3,048 B** |
| royalenfield logo | 37,667 B | **6,196 B** |

\* single-run CDN/TTFB variance (TTFB 199→346 ms and 575→512 ms respectively); both pages keep `fetchPriority=high` + new preload.

## Verification (all on production, cache-busted)

- `bun tsc -b --noEmit` clean; production build clean.
- Regression suites **69/69**: hero-cta 18/18 · reviews-cleanup 15/15 · brand-totals 8/8 · book-now-yellow 16/16 · trustindex-live 12/12 · data-sync PASS.
- Schema: 66 pages, 125 JSON-LD blocks, 0 errors, 0 warnings.
- Sitemap: 229 URLs (unchanged), spot checks 200, canonicals intact, no new noindex.
- GA4 `G-EQ8P35TH54` preserved; preconnect added.
- Headers: `content-encoding: zstd`, `alt-svc: h3=":443"`, cache-control unchanged.
- Image preloads confirmed in `/cars` and `/bikes` HTML (framework renders the tag twice — hoisted + in-order, identical href; browsers dedupe, transfer size unchanged at ~154 KB on /cars).

## Remaining issues (for Part 2)

- **DOM size / HTML size**: only reducible by cutting real content — needs an owner decision if pursued.
- **Framework bundle floor**: React 19 + TanStack Router/Start + react-query ≈ 550 KB raw of the remaining 915 KB; further cuts need route-head data slimming (FAQ/schema content still in shared bundle by design) or framework-level route splitting options.
- **srcset**: would require generating responsive variants of the two hero WebPs.
- **Blog migration**: `supabase/migrations/20260927090000_batch3-blog-posts.sql` still awaiting owner run in the Supabase SQL editor (unchanged from before).
