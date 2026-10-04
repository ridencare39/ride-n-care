# Ride N Care — Google Indexing & SEO Architecture Audit (2026-09-29)

> **DEPLOYED 2026-09-29** — commit `415f226`, Worker version `f55ec87f-cbc3-4816-b9c7-8ce06605a992`.
> Post-deploy live verification: sitemap 257→**229** URLs, noindex∩sitemap = **0**, all 229 URLs
> 200/self-canonical/no-redirect, homepage links all 52 /answers/*, footer "Popular answers" live,
> related-answers sections live on /areas/* and service×area pages. Purge-cache 401 (token scope,
> known) — CDN staleness bounded by s-maxage=60.
>
> **COMPLETION PASS 2026-09-29** — commit `6b69394`, Worker version `6b1f1ab2-6158-4a8e-99dc-a61f124447b9`.
> Added: registry-driven "Local car service areas" links on the 4 car hubs; bike/motorcycle/doorstep
> intent-differentiation copy + FAQ; coverage answers now link the 12 priority area guides.
> Verified live: sitemap still exactly 229, schema 66 pages/125 blocks/0 errors, blog sitemap = live
> posts (DB-driven), all technical checks green. Image work deferred to next month per owner.

GSC baseline: 18 × "Crawled — currently not indexed", 70 × "Discovered — currently not indexed".
Goal: make the correct, valuable pages technically eligible and clearly differentiated. Not every URL gets indexed; some SHOULD stay out.

## 1. Executive summary

The site's indexing problem is mostly **mis-signalled, not thin**:

1. **Sitemap/noindex conflict (self-inflicted, highest impact).** 11 of 40 `/areas/*` pages are deliberately `noindex,follow` (basic-tier content gate) but ALL 40 are in the production sitemap. Google fetches a sitemap URL, gets `noindex`, and logs the page as "Excluded by 'noindex'" (gunjur) or re-crawls confused pages into "Crawled — not indexed" (panathur-road, kudlu-gate). Fix: sitemap lists only indexable areas (24 → sitemap currently 40).
2. **Deadweight in the sitemap.** The sitemap also contains the 301-redirected answer URL — Google re-crawls it every cycle and stores it as a redirect, wasting crawl budget on a URL we have already retired.
3. **Orphaned and under-linked value pages.** /answers/* (52 pages) receive zero internal links from service and service×area pages; /areas/* pages receive zero links from the answer pages that discuss locality coverage. Google discovers these groups but sees no internal signal that they matter → "Discovered — not indexed" is the classic signature. Fix: data-driven related-answers module on local pages, service links + coverage answer links on area pages, homepage links to all 52 answers, footer answers column.
4. **Genuine architecture conflicts exist and are REPORTED, not fixed** (constraint): bike-service vs motorcycle-service vs doorstep-bike-service × area templates share one renderer; local pages ship service-level FAQs with no locality-specific Q&A. Decisions belong to the owner.

## 2. How indexing eligibility is decided today (verified in code + live)

| Signal | Source | Live behaviour (verified 2026-09-29) |
| --- | --- | --- |
| Area page robots | `src/lib/areas.ts` → `areaRobots()` = `noindex,follow` unless `confirmed && tier === "priority"` | gunjur, panathur-road, kudlu-gate, madiwala, domlur… return `noindex,follow` (intentional content gate) |
| Sitemap | `src/routes/sitemap[.]xml.ts` | 257 URLs; includes **all** `CONFIRMED_AREAS` (40), including the 11 noindexed ones, and the retired 301'd answer slug |
| Canonicals | `src/lib/head.ts` `pageHead()` | Every checked page self-canonical on https, non-www, no trailing slash. www→https 301, http→https 301, `/bikes/`→`/bikes` 307 |
| 404s | loaders throw `notFound()` for unknown service/area/pair | `/bike-service/nonexistent-area` → 404 ✓; removed answer 301s via `src/server.ts` |
| robots.txt | `public/robots.txt` | Allows everything except /track-booking /auth /admin /isolate /seo-monitor /api/; /map blocked by meta robots, not robots.txt (correct — "map-only" utility page) |
| Schema | `src/lib/schema.ts` one @graph per page | Service node only with owner-confirmed areaServed; FAQPage mirrors visible Q&A; no ratings |

## 3. Pre-change audit table

CATEGORY: A = should be indexable · B = needs improvement before indexing · C = duplicate/overlapping intent — architecture decision · D = should remain excluded · E = redirect/technical.
STATUS: CNI = Crawled–not indexed, DNI = Discovered–not indexed, OK = healthy/indexable now.

### 3a. The 18 "Crawled — currently not indexed" URLs

| URL | Cat | Status | Indexable? | Problem | Recommended action | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| /answers/what-included-car-service | A | CNI | YES | None technical; sits in a weakly-linked cluster | Link from /answers hub (already), add answer→service cross-links (exists), service→answers module; recrawl signal via content freshness | Unique intent (car periodic-service contents), SSR, unique title/desc/H1, in sitemap |
| /answers/are-mechanics-verified | A | CNI | YES | Thin internal-link support only | Same cluster-linking fix | Unique trust intent, correct signals |
| /answers/need-to-be-home | A | CNI | YES | Same | Same | Unique logistics intent |
| /answers/how-long-car-service | A | CNI | YES | Same | Same | Unique; deliberately no duration quote (policy copy) |
| /answers/how-long-bike-service | A | CNI | YES | Same | Same | Unique; 60–90 min answer present |
| /answers/bike-repair-cost | A | CNI | YES | Same | Same | Price table present, unique |
| /answers/is-doorstep-service-safe | A | CNI | YES | Same | Same | Unique trust intent |
| /answers/bike-stalled-in-water | A | CNI | YES | Same | Same | Monsoon-specific intent |
| /answers/bike-wont-start | A | CNI | YES | Same | Same | Emergency intent, links to dispatch pages |
| /answers/scooter-service-cost | A | CNI | YES | Same | Same | Unique pricing intent |
| /answers/what-included-bike-service | A | CNI | YES | Same | Same | Checklist intent |
| /answers/periodic-vs-breakdown | A | CNI | YES | Same | Same | Comparison intent |
| /answers/battery-jump-start-cost | A | CNI | YES | Same | Same | Pricing intent |
| /areas/panathur-road | D | CNI+sitemap | NO | **noindex,follow by design** (basic tier) BUT listed in sitemap | Keep noindex; REMOVE from sitemap | Content gate is correct; sitemap inclusion contradicts it and confuses recrawl status |
| /areas/kudlu-gate | D | CNI+sitemap | NO | Same | Keep noindex; REMOVE from sitemap | Same |
| /areas/gunjur | D | CNI+sitemap | NO | Same — "Excluded by noindex" is the gate working | Keep noindex; REMOVE from sitemap | Same. Owner can flip `tier:"priority"` + write unique copy later |
| /doorstep-bike-service/jayanagar | C | CNI | YES (qualified) | Template renderer: identical body across all `doorstep-bike-service/*` pages, service-level FAQs, no locality Q&A — near-duplicate with /bike-service/jayanagar and /motorcycle-service/jayanagar | REPORT (do not restructure): add locality FAQ block + cross-links so each pair differentiates; canonical stays self | Doorstep intent ≠ bike-service intent at hub level; at area level the rendered body does not yet prove it. Titles/descs/schema ARE unique |

### 3b. "Discovered — currently not indexed" (~70 URLs, grouped)

| URL group | Cat | Indexable? | Problem | Recommended action | Reason |
| --- | --- | --- | --- | --- | --- |
| /answers/* (52 in sitemap; several CNI already) | A | YES | Cluster is crawl-deep but receives 0 internal links from service pages and none from home | Add related-answers block to service + service×area pages; link all 52 from home; footer column | Discovery without internal links = classic DNI signature |
| /areas/* basic tier — varthur, gunjur, kasavanahalli, panathur-road, kadubeesanahalli, domlur, banashankari, bannerghatta-road, kanakapura-road, ejipura, bommanahalli, kudlu-gate, madiwala, harlur, singasandra, parappana-agrahara, choodasandra, kalyan-nagar, mahadevapura, kr-puram, hal, brookefield (22 pages) | D (until content uplift) | NO (currently noindex,follow) | Data-driven basic pages; gate is intentional | Keep noindex; remove from sitemap; keep links flowing (follow) so Google still learns the graph; owner uplift path documented | Area-index rule: `tier:"priority"` + unique copy. Un-gating now would multiply doorway-pattern pages |
| /bike-service/*, /motorcycle-service/*, /doorstep-bike-service/* (12 priority-area pairs each) | C (bike vs motorcycle overlap), A for doorstep×priority | YES | Template body identical across services; motorcycle-service intent overlaps bike-service for commuters | REPORT conflicts; add related-answers + area cross-links to differentiate; no canonical changes without owner decision | Each has unique title/desc/H1/canonical/schema; intent overlap is content-level |
| /car-*-service top-level (9) | A | YES | Healthy; wave-1 pair pages gated | None | Unique content, gating prevents template spam |
| /car-*-service/<area> wave-1 (20 in sitemap; 24 pairs in code) | A | YES | New pages, low internal-link mass | Linked from service hubs + parent areas automatically | Quality-gated registry — correct architecture |
| /doorstep-bike-repair | A | YES | Healthy | None | Unique repair-at-door intent vs bike-repair; distinct content |
| /emergency-bike-repair/btm-layout, /scooter-service/koramangala (+ siblings) | A | YES | Healthy; new-ish | None beyond cluster links | Unique title/desc/canonical verified live |
| /blog/* (8 legacy DB posts listed in sitemap but 2 new posts not yet migrated) | A | YES | New batch-3 posts 404 until owner runs Supabase migration | Owner action (documented); nothing to change in code | Sitemap queries DB live; posts 404 only because migration not executed |
| /guides/* (7) | A | YES | Healthy; all linked from home + footer | None | Unique long-form content |
| /scooter-service | A | YES | Healthy | None | — |
| /bikes, /cars | A | YES | Healthy | None | Brand/pricing hubs |
| /map | D | NO | Utility page, noindex,follow + robots Disallow… actually not in robots.txt Disallow list; excluded via meta robots only | Keep as-is; already absent from sitemap | Map-only utility; noindex intentional |
| /franchise | D (marginal) | YES technically | Lead-gen utility page, sitemap priority 0.7 | Leave as-is (no constraint allows demotion) | Keep signal simple; owner decides later |

### 3c. Location-page architecture verdict (report only)

- `/areas/<area>` = broad coverage intent — correct design, noindex gate on basic tier is the right anti-doorway mechanism.
- `/bike-service/<area>` vs `/motorcycle-service/<area>` vs `/doorstep-bike-service/<area>`: **CONFIRMED CONFLICT** — one template (`src/routes/$service.$area.tsx`) renders `s.intro + generic booking paragraphs + service-level FAQs` for every service×area pair. At the area level the pages are substantially the same content with the service/area name swapped. Titles, meta descriptions, H1s and Service schema ARE unique and intent-labelled, which is why they remain indexable — but Google's "Crawled — not indexed" for jayanagar is the expected consequence of body-level duplication.
- Recommended (owner decision, NOT implemented): differentiate at area level — 2–3 locality FAQs per pair (car×area pages already do exactly this via `src/lib/car-area-content.ts`), unique local access notes; then bike-service vs motorcycle-service pair-level intent becomes defensible. The car×area gated registry is the model to copy.
- No redirects, no canonical changes, no deletions performed — per constraints.

## 4. Implemented safe changes (this PR)

1. **Sitemap hygiene** (`src/routes/sitemap[.]xml.ts`): areas entries now filtered to indexable pages only (`isAreaIndexed`); the retired `/answers/how-often-car-service` 301 target can never re-enter (slug no longer exists in ANSWER_PAGES — verified). Result: sitemap ≈ 246 canonical, indexable, 200-OK URLs.
2. **Internal-linking upgrades**:
   - `src/lib/answer-pages.ts`: `answersForArea(areaName)` helper — categories map to areas (coverage/care/emergency answer sets).
   - `src/routes/areas.$slug.tsx`: "Related answers" section (data-driven) + "All services in <area>" full local-service list.
   - `src/routes/$service.$area.tsx`: "Related answers" section (data-driven).
   - `src/routes/areas.index.tsx`: priority-area area cards become descriptive links.
   - `src/routes/index.tsx`: "All answers" section linking every /answers/* page.
   - `src/components/SiteFooter.tsx`: new "Popular answers" column.
3. No pages deleted, no redirects created, no DB changes, no content removed, no noindex added, no canonical changed.

## 5. What was intentionally NOT changed (and why)

- 11 basic-tier area pages stay noindex,follow — anti-doorstep-spam content gate working as designed; owner uplift path documented in docs/seo/05-area-uniqueness-report.md.
- /map stays noindex (utility).
- bike vs motorcycle vs doorstep ×area template architecture: reported, not restructured (owner decision).
- http→https and www→https 301s: correct, untouched.
- /franchise, /contact, /privacy, /terms: unchanged.
- No claim is made that Google will index anything immediately; changes make pages technically eligible with clearer distinct-value signals.

## 6. Verification checklist for after deploy

- `curl -s https://ridencare.co.in/sitemap.xml | grep -c "<loc>"` → expect ~246
- Sitemap ∩ noindex = 0 (all 40 areas listed are `tier:"priority"`)
- No /answers/how-often-car-service in sitemap
- `/areas/gunjur` still noindex,follow (unchanged)
- Related-answers sections visible in SSR HTML on /areas/hsr-layout, /bike-service/indiranagar, home
- GSC: request re-validation of sitemap after next deploy; expect "Discovered/Crawled-not-indexed" counts to fall as crawl budget concentrates on the 246 eligible URLs
