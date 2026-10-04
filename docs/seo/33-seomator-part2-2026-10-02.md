# SEOmator Audit Fix — Part 2 (Accessibility, Security Headers, AEO/GEO, Local SEO)

Date: 2026-10-02 · Site: https://ridencare.co.in · Worker: `ridencare39-ride-n-care`
Deploy: Worker version **6e50e119-c304-4769-b3da-119e7ac2283e** (intermediate during session: e250f7cc-920a-4089-88c6-392356f187de)

## Scope

Part 2 covered the remaining SEOmator findings that Part 1 (see `32-seomator-part1-2026-10-02.md`) did not touch: axe-core accessibility violations, security headers (HSTS / CSP / Permissions-Policy), AEO/GEO surface (llms.txt, robots, schema, authorship), local-SEO content quality, and a final full regression + production verification.

## Root-cause fixes shipped

### 1. Accessibility — all axe-core violations resolved (axe-core 4.13, new dev dependency)

| Violation | Root cause | Fix | Files |
| --- | --- | --- | --- |
| 5 × color contrast | `--neon` accent at oklch(0.62) failed 4.5:1 on dark navy; WhatsApp green foreground was pure white on bright green; hero badge/chips used translucent-white text | `--neon` → oklch(0.72 0.14 222); `--whatsapp-foreground` → dark green oklch(0.27 0.05 155) in **both** light and dark theme blocks; hero badge → `text-white`; GoogleReviews chip / BrandsMarquee eyebrow / homepage keyword line → `text-primary`; `.hero-cta-glass` translucent bg → solid `rgb(5 13 28)` + `text-white` on the panel WhatsApp CTA; 3 emerald CTAs → `text-emerald-700 border-emerald-600/50` | `src/styles.css`, `src/routes/index.tsx`, `src/routes/cars.tsx`, `src/components/{GoogleReviews,BrandsMarquee,SiteHeader,BrandServiceView}.tsx`, `src/routes/$service.index.tsx`, `src/routes/ev-two-wheeler-service.tsx` |
| 4 × "links in text blocks" | 46 in-text tel/WhatsApp links were underline-on-hover only (weakest affordance in a paragraph of text) | CSS rule: `p a.text-primary, li a.text-primary, td a.text-primary { text-decoration-line: underline; text-underline-offset: 2px; }` — standalone chips/cards untouched | `src/styles.css` |
| 2 × nested `<main>` landmarks | Five route files each rendered their own `<main>` inside the root shell's `<main>` | Converted to `<div>` | `src/routes/{contact,franchise,guarantee,sample-invoice,track-booking}.tsx` |
| Missing skip link | No keyboard path past the header/nav | `<a href="#main-content">` in `RootShell` (sr-only → visible on focus) + `<main id="main-content">` in `RootComponent` | `src/routes/__root.tsx` |

New audit tooling kept in the repo: `scripts/test-accessibility.mjs` (axe on key pages + targeted skip-link/reduced-motion/focus checks) and `scripts/csp-inventory.mjs`.

### 2. Security headers (src/server.ts, `withSecurityHeaders`)

- **HSTS**: `max-age=15552000; includeSubDomains` added. `includeSubDomains` is safe — all 10 tested `*.ridencare.co.in` subdomains are NXDOMAIN. **`preload` deliberately NOT added**: flagging it on the header and never submitting to hstspreload.org would hard-pincers the domain into Chrome; submission is an owner decision (see Remaining).
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` (FLoC/FedCM opt-out included).
- **CSP**: full `Content-Security-Policy-Report-Only` built from measured origins (`scripts/csp-inventory.mjs`): scripts self + googletagmanager + cdn.trustindex.io + cloudflareinsights; styles self/inline + trustindex + fonts.googleapis; fonts gstatic + trustindex; images self/data/lh3.googleusercontent (review avatars)/maps/trustindex; connect self + GTM + analytics.google.com + stats.g.doubleclick.net + trustindex + places.googleapis + `https://*.supabase.co`; `frame-src https://www.google.com`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`.
  The code comment in `src/server.ts` documents the flip to enforcing `Content-Security-Policy` once Report-Only has monitored clean.

### 3. Content quality / local SEO

- `/doorstep-bike-service` carried 33 exact-match repetitions of "doorstep bike service". Genuine duplication fixed: `src/lib/services.ts` `detail[2]` had been a near-verbatim copy of the van-cargo list from `detail[0]` — rewritten; the `$service.index.tsx` comparison intro was de-clunked. Keyword densities were **not** mass-chased (explicit rule) — the remaining phrase count is natural usage.
- Footer "Learn" column now links the real `/guarantee` page (verified 200) instead of only blog guides.
- `contact.tsx` email card: replaced misleading "info@ — use the email link" text with a proper aria-label + entity-encoded `CONTACT_EMAIL` from `src/lib/seo.ts` (anti-scrape entity form preserved).

### 4. AEO / GEO

- **llms.txt**: all 43 links verified 200. No change needed — file is correct and complete.
- **AI crawlers**: robots.txt already has `Allow: /` for GPTBot, ChatGPT-User, Google-Extended, CCBot, PerplexityBot (owner decision, Q13). No change.
- **Authorship/dates**: blog posts already carry `Person` schema ("Ride N Care Team") + `article:published_time`; guides carry `Article` + organization author + dates. Nothing fabricated (no author/expertise data exists to cite — see Remaining).
- **Schema**: validator reports 66 pages / 125 JSON-LD blocks / 125 parsed OK / 0 errors, 0 warnings. SEOmator's "missing @type" hits are the `@context` wrapper and an `@id` reference node — both valid JSON-LD (false positive).

## Verified false positives (no action, evidence recorded)

| SEOmator finding | Reality |
| --- | --- |
| Compression not detected | zstd active on all HTML/JS/CSS via Cloudflare (Part 1 finding, re-verified). |
| alt-svc missing | `alt-svc: h3=":443"; ma=86400` present. |
| base64 WebP LCP | Only the 1.6 KB header logo is inlined — optimal. |
| "AI crawlers blocked" | robots.txt explicitly allows the five AI crawlers listed above. |
| Schema "missing @type" (2 hits) | `@context` wrapper + `@id` ref node — correct JSON-LD, not schema defects. |
| Reviews section missing in local tests | Dev server lacks `GOOGLE_PLACES_API_KEY` / `VITE_TRUSTINDEX_WIDGET_ID`, so the section never mounts locally. Production mounts and passes 15/15. |

## Production verification (after final deploy, cache-busted)

| Check | Result |
| --- | --- |
| Security headers | `content-security-policy-report-only` (full allowlist), `strict-transport-security: max-age=15552000; includeSubDomains`, `permissions-policy`, `referrer-policy: strict-origin-when-cross-origin`, `x-content-type-options: nosniff` — all present. |
| axe (5 pages: /, /cars, /bike-service, /contact, /answers/car-service-cost-bangalore) | **0 violations**. Skip link present; rotor + rise-in animations fully disabled under reduced motion; focus outline solid 2px after 2×Tab. |
| Perf (mobile emulation) | `/` LCP **552 ms** (hero paragraph), `/cars` 320 ms, `/bike-service` 408 ms; CLS 0 on all; TTFB 88–167 ms. Part 1's 736 ms homepage LCP held and improved. |
| Console | 0 errors, 0 warnings, 0 CSP violation messages on /, /contact, /bike-service → CSP allowlist correct. |
| GA4 | `G-EQ8P35TH54` present in HTML. |
| Sitemap | 229 URLs; 4/4 spot checks 200 (/, /doorstep-bike-service/koramangala, /areas/jp-nagar, /blog/doorstep-vs-garage-service). |
| Schema | 66 pages, 125 blocks, 125 parsed OK, 0 errors / 0 warnings. |
| Regression suites | hero-cta 18/18, book-now-yellow 16/16, brand-totals 8/8, trustindex-live 12/12, reviews-cleanup 15/15 — **69/69**; data-sync PASS. |
| llms.txt / robots.txt | Serving unchanged; robots.txt 47 lines intact. |
| Deployed asset check | Prod HTML references the final build's hashed bundle (`styles-DYB_AMQm.css` contains the Part 2 in-text underline rule). |

## Deploy notes

- Final build attempt #5 was OOM-killed (exit 137) because two dev servers were still resident during the build; recovered with the standard recipe (preview stop → kill vite dev → clean `.output` → `NODE_OPTIONS=--max-old-space-size=1300 bun run build` → `bun run deploy`). Build-6 → deploy-4 → version `6e50e119`. Purge-cache 401 expected; production HTML was confirmed cache-fresh by hashed-asset comparison.
- Part 1 changes and Part 2 changes both remain uncommitted — the user/Changes panel owns commits.

## Remaining (owner decisions / accepted deviations)

- **CSP enforcement flip**: change `Content-Security-Policy-Report-Only` → `Content-Security-Policy` in `src/server.ts` (comment in code marks the spot) after a monitoring period; console is already clean, so risk is low.
- **HSTS preload**: add `preload` and submit to hstspreload.org only if the owner confirms the domain will keep HTTPS everywhere long-term.
- **Author bios**: SEOmator wants real author/expertise info; none exists and none was fabricated. If the owner supplies mechanic/team profiles, add `Person` schema + bios.
- **Blog migration**: still pending on the owner (unchanged from Part 1).
- **Accepted deviations**: DOM 2,695 elements (target <1,500; +4 vs Part 1's 2,691 from the skip link + footer link) and HTML 306 KB (target <300 KB) — both documented in Part 1; every element is real content or crawlable navigation. Text-to-HTML ratio and srcset remain documented-not-chased.
- **Dev-env gap**: `scripts/test-reviews-cleanup.mjs` scores 14/15 locally because the reviews section cannot mount without the two review env keys; production is the source of truth (15/15).
