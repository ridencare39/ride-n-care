# Local SEO + AEO/GEO — Bike "Near Me" Strategy

Date: 2026-10-02 · Site: https://ridencare.co.in · Worker: `ridencare39-ride-n-care`
Deploy: Worker version **3324ed77-107d-45fc-9615-7f88da9bcaa6** (baseline: 325fe949, CSP round)

## Keyword-to-URL map (audit result — NO new pages needed)

| Query intent | Owning URL (existing) | Title (unchanged) | Why it owns it |
| --- | --- | --- | --- |
| bike service near me | `/bike-service` | Bike Service at Home in Bangalore | The service-catalog money page; answers "a mechanic comes to me" directly |
| bike repair near me | `/bike-repair` | Bike Repair at Home in Bangalore | Diagnosis-led repair money page; free diagnosis + written finding |
| doorstep bike service near me | `/doorstep-bike-service` | Doorstep Bike Service in Bangalore | The doorstep-model page incl. the workshop comparison table |
| doorstep bike repair near me | `/doorstep-bike-repair` | Doorstep Bike Repair in Bangalore | Doorstep repair page (battery/self-start/brake/chain/puncture focus) |

Supporting long-tail owners (unchanged): 12 priority service×area pages per bike service (`/bike-service/hsr-layout` …), `/areas` + 12 indexed area hubs, answer pages per question (see AEO), brand pages. **No cannibalization found**: all 15 bike-cluster titles are intent- and geo-distinct; "at home" vs "doorstep" near-synonyms are deliberately split by page purpose (catalog vs model), documented in `services.ts` header. "Near me" is treated as a local modifier matched by coverage signals, never stuffed into titles.

## Changes shipped

### 1. AEO — two genuine near-me FAQs (visible content + FAQPage schema parity)
- `/bike-service`: **"Do you have a bike mechanic near me in Bangalore?"** — direct yes; 40 confirmed localities; dispatch from nearest unit; arrival window confirmed in writing on WhatsApp before dispatch.
- `/bike-repair`: **"How do I find a bike mechanic near me for a repair?"** — "you may not need to search"; free diagnosis with written finding, OEM-grade parts, 7-day guarantee; call/WhatsApp.
- Both phrased as customers actually ask; answers carry only owner-confirmed facts. The other 8 questions from the brief were already answered by existing pages: serviced-at-home (`/bike-service` itself), repaired-at-home (`/bike-repair`), inclusions (`/answers/what-included-bike-service` + page section), booking (`/answers/how-to-book` + How-it-works), no-start (`/answers/bike-wont-start` + doorstep-repair page), brands (visible "Brands we service" section), cost (`/answers/bike-service-cost-bangalore` + Pricing), written estimate (`/answers/written-quote`), warranty (`/answers/guarantee`, `/answers/warranty-service`).

### 2. Internal linking — four targeted additions
- Homepage SEO-intro section: natural in-copy links "doorstep bike service" → `/doorstep-bike-service` and "doorstep bike repair" → `/doorstep-bike-repair` (both were missing from homepage body; the FAQ text mentioned them but no links existed).
- Header services dropdown: **`/doorstep-bike-repair` added** (`nav.ts` BIKE_ORDER + Hammer icon) — the page was orphaned from global nav.
- Footer Services column: **"Doorstep Bike Repair"** added.
- Verified existing mesh intact: money pages → 12 area chips + `/areas` hub + related services/guides/answers; footer Answers column; `12,000+` trust section.

### 3. GEO / local consistency (verified, no changes needed)
- NAP: call `080 6940 9289` (+91 80 6940 9289 in schema) and WhatsApp `82969 50339` consistent across pages/schema; email single source.
- Hours: "Doorstep visits available 24 hours" wording everywhere; schema `openingHoursSpecification` 00:00–23:59 with the same description.
- Coverage: `AREAS` = 40 entries, all owner-confirmed (12 priority/indexable, 28 basic-tier noindex,follow by design) — page copy "40 confirmed localities" is factually exact.
- GBP link present in footer socials; `areaServed` schema = Bengaluru + confirmed localities only.

### 4. Schema (audited, matches visible content — no changes needed)
Organization + WebSite sitewide; LocalBusiness `[AutoRepair, MotorcycleRepair]` with areaServed + 24h hours + OfferCatalog; per money page: `Service` (provider @id → LocalBusiness, areaServed city+places, real-price Offer) + `BreadcrumbList` + `FAQPage` mirroring visible FAQs (new near-me FAQs flow in automatically — visible/schema parity kept). No reviews/ratings/addresses invented. Validator: 66 pages / 125 blocks / 0 errors / 0 warnings post-deploy.

### 5. Not done (deliberately)
- No new pages (all four intents owned; no genuine distinct intent left unowned).
- Titles/meta/H1s untouched — already optimal; changing them risks churn with zero evidence.
- No "near me" in any title/meta; no keyword-density chasing; no neighborhood mass pages.

## Search Console baseline

**No data available — stated plainly.** GSC is not connected to this deployment (documented in `docs/seo/gsc-query-review.md` Batch 5): no `GOOGLE_SEARCH_CONSOLE_API_KEY`/`LOVABLE_API_KEY` in the environment, plain API keys cannot authorize the GSC API (HTTP 401, OAuth2 required), and the built-in seo-monitor route is admin-gated. Zero impressions/clicks/CTR/position numbers exist in this repo; none were simulated. The 25-query weekly review workflow + optimization-backlog table sit ready in that doc for owner data. "Near me" results are also searcher-location-dependent — treat position as directional even once data flows.

## Verification (post-deploy, production)

| Check | Result |
| --- | --- |
| TypeScript / build / deploy | Clean · build-8 OK · version `3324ed77` |
| Regression suites | hero-cta 18/18 · book-now-yellow 16/16 · brand-totals 8/8 · trustindex-live 12/12 · reviews-cleanup 15/15 — **69/69** · data-sync PASS |
| Accessibility (axe, 5 pages) | no violations ×5 |
| Schema | 66/125/0 errors/0 warnings |
| Sitemap | 229 URLs; spot checks 200 (`/`, `/car-ac-service/koramangala`, `/emergency-bike-repair/hebbal`, blog) |
| Canonical | `/bike-service` → self ✓ |
| New content live | near-me FAQ visible+schema on both pages ✓ · homepage links ✓ · nav+footer link ✓ |
| GA4 | `G-EQ8P35TH54` present |
| Perf | `/` LCP 420 ms, CLS 0, DOM 2,715 (+20 from new links/FAQ — accepted deviation), HTML 308 KB (+2.4 KB) |

Note: during local testing the suites transiently failed (15/18, 1/8) with a hydration mismatch — root cause was the dev server serving a stale client chunk after file edits (HMR disabled). `freebuff-preview restart` cleared it; production build is unaffected.

## 30/60/90-day monitoring plan

- **Day 0–30**: owner connects GSC (API keys or weekly CSV export per `gsc-query-review.md` §1–2). Record baseline for the 4 near-me intents + Bangalore bike cluster in the weekly table. Watch indexation of the two FAQ updates (no URL changes — nothing to resubmit beyond the existing sitemap). GBP: confirm categories/hours match site wording.
- **Day 30–60**: compare near-me query impressions/CTR against baseline; apply the documented verdict codes (MATCH/MISMATCH/NEW). If a MISMATCH appears (e.g., `/doorstep-bike-service` outranking `/bike-service` for "bike service near me"), fix by internal-link redistribution per the keyword map — not by title churn. Rewrite title/meta only if CTR <1% at position <10 for two consecutive weeks.
- **Day 60–90**: evaluate whether any near-me query earns ≥30 impressions for two consecutive weeks but has no dedicated coverage (then, and only then, consider one new page with unique useful info). Review service×area page performance for promotion (noindex basic-tier pages stay noindex until owner confirms). CTR/position trends decide; no ranking promises.
