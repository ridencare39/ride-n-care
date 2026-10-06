# Bangalore P0 Area Guide — Implementation Report

**Stage:** P0 IMPLEMENTATION (NOT deployment)
**Date:** 2026-10-05
**Plan:** `docs/seo/bangalore-p0-area-guide-implementation-plan-2026-10-05.md`
**Audit:** `docs/seo/bangalore-area-detailed-guide-gap-audit-2026-10-05.md`
**HEAD (before = after):** `d96238573ec7a7580277b80824c119b9f0a28c23`
**Deployment status: NOT DEPLOYED. No commit. No push.**

---

## 1. Areas implemented

| # | Area | Action | Slug |
|---|------|--------|------|
| 1 | KR Puram | CREATE (promoted basic → priority, unique content added) | `kr-puram` |
| 2 | Mahadevapura | CREATE (promoted basic → priority, unique content added) | `mahadevapura` |
| 3 | Madiwala | CREATE (promoted basic → priority, unique content added) | `madiwala` |
| 4 | Banashankari | CREATE (promoted basic → priority, unique content added) | `banashankari` |
| 5 | MG Road | CREATE (promoted basic → priority, unique content added) | `mg-road` |
| 6 | Hebbal | IMPROVE existing guide (content + FAQ expansion, URL/meta/canonical unchanged) | `hebbal` |

No P1 or P2 areas were implemented. No other locality was touched.

## 2. URLs

All six expected URLs verified live on the local preview (see §12):

- `/areas/kr-puram` → 200
- `/areas/mahadevapura` → 200
- `/areas/madiwala` → 200
- `/areas/banashankari` → 200
- `/areas/mg-road` → 200
- `/areas/hebbal` → 200 (same URL as before — no second Hebbal URL was created)

All six are self-canonical: `<link rel="canonical" href="https://ridencare.co.in/areas/{slug}">`.

## 3. Files changed

Exactly **4 source files** changed by this stage (plus this report):

| File | Change |
|------|--------|
| `src/lib/areas.ts` | Added `tier: "priority"` to the 5 CREATE records; extended `PRIORITY_AREA_SLUGS` from 12 → 17 slugs; header comment updated for the Q33 tier regime. |
| `src/lib/area-content.ts` | Added `import { VISITING_CHARGE } from "@/lib/pricing"`; removed now-unused `GUARANTEE` constant; rewrote the `hebbal` entry (improvement); added 5 new entries `kr-puram`, `mahadevapura`, `madiwala`, `banashankari`, `mg-road` (unique intro + 2 `how` paragraphs + 6 FAQs each; Hebbal now has 8 FAQs). `AREA_CONTENT` now has 17 entries. |
| `src/routes/contact.tsx` | Removed the `.slice(0, 12)` cap on the priority-area chip list (line 113) so the 5 newly promoted areas are not silently dropped. Chips are `flex-wrap`; the list now renders all 17 priority areas. |
| `src/routes/sitemap[.]xml.ts` | **One line only:** `LASTMOD.areas` `"2026-09-20"` → `"2026-10-05"`. The user's pre-existing uncommitted changes in this file (Hyderabad imports, `LASTMOD.hyderabad`, `hydAreaEntries` bucket) were left untouched. |

Pre-existing working-tree changes (10 preview PNGs, `SiteFooter.tsx`, `answer-pages.ts`, `pricing.ts`, `services.ts`, `routeTree.gen.ts`, `tsconfig.tsbuildinfo`, 7 untracked `hyd-*`/`hyderabad.*` files, and the audit/plan reports) were **preserved unmodified**.

**Not touched:** Hyderabad implementation, booking (`BookingFlow.tsx`, booking routes), Supabase/database, Cloudflare/wrangler config, GitHub Actions (`.github/workflows/prod-build.yml`), the Related-Answers component, the planning report, the audit report.

## 4. Content changes

Promotion is **data-only** through the existing architecture — no new route, component, or page template was created. `src/routes/areas.$slug.tsx` renders all six pages exactly as it rendered the original 12.

Each of the 5 new entries contains a genuinely unique, locality-specific introduction, two `how doorstep service works here` paragraphs, and 6 FAQs covering: doorstep bike service, bike repair at home, visiting charge, booking landmarks, scooter service, and warranty. Content constraints honored:

- **Landmarks** used only from the already-verified `areas.ts` lists (KR Puram Station/Tin Factory/Old Madras Road/Bridge; Mahadevapura Doddanekkundi/Varthur Rd/ORR; Madiwala Market/Checkpost/St. John's/Silk Board boundary; Banashankari Temple/Metro/Kanakapura junction; MG Road Metro/Trinity/Brigade/Chinnaswamy Stadium). No fabricated landmarks, addresses, branches, workshops, storefronts, offices, mechanics-in-area, customer counts, reviews, ratings, partnerships, or response-time promises.
- MG Road explicitly states Ride N Care is a **service-area business with no walk-in workshop or storefront**.
- Madiwala is differentiated from BTM Layout (Market/St John's-led identity; Silk Board only as boundary).
- No "free visit", no "No.1/best/fastest/guaranteed", no response-time promises ("arrival window confirmed when you book" only).
- Rendered word counts (name-stripped): KR Puram 1095 · Mahadevapura 1056 · Madiwala 1054 · MG Road 1053 · Banashankari 1027 · Hebbal 1111 (up from ~900-class baseline). Zero thin pages.

## 5. Metadata changes

- **5 new pages:** unique titles (`Bike & Car Service in {Area}, Bangalore | Ride N Care`) and unique meta descriptions with distinct geographic qualifiers (East/South/Central Bangalore per zone). Exactly one H1 each. No keyword stuffing, no "No. 1", no "best in Bangalore", no ranking claims, minimal "near me".
- **Hebbal:** title/meta **unchanged** — the approved plan identified no metadata weakness (unique title, unique description, geographic intent already present).
- Canonical mechanism, robots derivation (`areaRobots`/`isAreaIndexed`), and schema all reused unchanged from the existing route.

## 6. AEO changes

- FAQ plan implemented per area: **6 FAQs each** for the 5 new pages, **8 FAQs** for the improved Hebbal (up from 5).
- FAQ sets are NOT copies of each other — each area's questions target its own local intent (e.g. KR Puram landmark guidance, Mahadevapura ORR/office corridor, Madiwala market-lane parking, Banashankari stage/metro coverage, MG Road office-basement + "is there a walk-in counter" honesty FAQ, Hebbal Manyata Tech Park).
- Business facts kept consistent across all: **₹299 visiting charge** (rendered from `VISITING_CHARGE`, never the literal "299" in source, never described as free) and **45-Day Warranty (On eligible repairs)**.
- Answers lead with the direct answer, then context.
- **FAQPage schema ↔ visible FAQ: exact match verified programmatically on all 6 pages (PASS).**

## 7. GEO changes

- Each page leads with its own geography: KR Puram = Old Madras Road corridor + railway station + Tin Factory + bridge; Mahadevapura = ORR ward between KR Puram gateway and Whitefield side; Madiwala = market lanes + Checkpost + St. John's; Banashankari = stage-by-stage from temple to Kanakapura junction with metro anchoring one end; MG Road = central office strip (Brigade Road, metro, Trinity).
- Bangalore context and verified nearby localities used naturally via the existing `nearby` data (which resolves to real pages).
- No neighborhood keyword lists, no doorway pattern: each page answers "what does this page teach that another Bangalore page does not?" with its own parking/access realities, landmarks, and coverage wording.

## 8. Schema changes

None architecturally. The existing area-page schema implementation was reused. Verified on all 6 rendered pages:

`Organization, AutoRepair, MotorcycleRepair, WebSite, Service, BreadcrumbList, FAQPage, ItemList`

- Correct URL (per-page URL present in structured data), correct page name, consistent business info.
- **No `AggregateRating`** added (verified absent on all 6).
- FAQPage `mainEntity` exactly mirrors the visible FAQs (§6).

## 9. Internal-link changes

- New pages automatically join the existing internal-linking architecture (areas hub badge, `nearby` reciprocal links, `/cars` + coverage-answer chips via `PRIORITY_AREA_SLUGS`, service×area pages).
- `contact.tsx`: priority chip list no longer capped at 12 — now shows all 17.
- **124 unique internal links** extracted from the 6 pages → all return 200 (no broken links).
- No sitewide keyword-stuffed links added; no link modules modified.
- **Related Answers bug NOT fixed** (see §14).

## 10. Indexability/sitemap changes

Verified live (see §17/§18 for exact counts):

- The 5 new pages + Hebbal: **indexable** (no robots meta = index,follow), **self-canonical**, **in the sitemap**, crawlable.
- Sitemap membership and meta-robots agree perfectly: **17 sitemap `/areas/*` URLs = 17 indexable area pages, exactly** (checked all 40 URLs).
- Supporting noindex pages remain `noindex,follow` and out of the sitemap.
- Sitemap `LASTMOD.areas` bumped to 2026-10-05; no unrelated sitemap entries changed (only the 1-line LASTMOD edit by this stage; other pending edits in the file are the user's own).
- No duplicate sitemap URLs (292 `<loc>` entries, 292 unique).

## 11. Hebbal improvements

Same URL, same canonical, same indexable status, same title/meta (no weakness identified by the plan). Content upgraded:

- New intro (~65 words) framing Hebbal as the city–airport-road gate (flyover, lake, Manyata Tech Park, Esteem Mall) with answer-first service promise and the approved warranty wording.
- Two expanded `how` paragraphs: booking/landmark flow with **₹299 visiting charge on its own quote line, separate from package price**; Manyata-side office-parking permission flow (booking reference forwarded to security) and honest workshop-jobs handling.
- FAQs 5 → **8**: Manyata Tech Park coverage, Manyata office visits, scooter service, repair-at-home, visiting charge (rendered from `VISITING_CHARGE`), warranty wording, Yelahanka inclusion, price-confirmation process.
- Removed the legacy `GUARANTEE` constant that fed the old "7-day guarantee"-era FAQ text (wording was already migrated to the 45-Day Warranty; the constant became dead code).

## 12. Validation results

### Routes (local preview `http://localhost:8081`)
| URL | Result |
|---|---|
| `/areas/kr-puram` | **200** |
| `/areas/mahadevapura` | **200** |
| `/areas/madiwala` | **200** |
| `/areas/banashankari` | **200** |
| `/areas/mg-road` | **200** |
| `/areas/hebbal` | **200** |
| `/areas/this-area-does-not-exist` (unknown slug) | **404** ✅ |

### SEO
- Titles: 6 unique, geographic, compliant — ✅
- Meta descriptions: 6 unique with zone qualifiers — ✅
- H1: exactly 1 per page (all 6) — ✅
- Canonical: self-canonical on all 6 — ✅
- Robots: no `noindex` anywhere on the 6; 23 basic pages still `noindex,follow` — ✅
- Sitemap: 5 new pages + Hebbal present, no duplicates — ✅

### Indexing
- Intended indexable area guides: **17 = 17** (sitemap ↔ robots agreement across all 40) — ✅
- Supporting noindex: **23** (expected actual; see §18 — user's "28 → 28" expectation conflicts with arithmetic) — ✅ verified actual
- Canonical/indexability agreement: perfect — ✅

### AEO / GEO / Schema
- FAQ schema ↔ visible content: **PASS on all 6** (6/6/6/6/6/8 entries verified item-by-item) — ✅
- Forbidden phrasings (source + rendered): `free visit`, `free doorstep`, `no visiting charge`, `no inspection fee`, `no doorstep charge`, `7-day guarantee`, `No.1`, `best in Bangalore`, `guaranteed`, `fastest`, response-time promises — **zero hits** — ✅
- Hard-coded package prices: none (only `₹${VISITING_CHARGE}` interpolation) — ✅
- Fabricated-claim grep: no branches/workshops/offices/customer counts/ratings/reviews/partnerships claims in new content — ✅

### Internal links
- 124 unique internal links from the 6 pages → all 200 — ✅
- New service×area pages: 15 spot-checked (3 services × 5 areas) → all 200 — ✅

### Accessibility
- `bun scripts/test-accessibility.mjs http://localhost:8081` → **exit 0**, no violations on tested pages, skip-link/focus/reduced-motion checks pass — ✅
- Heading structure on the 6 pages: single H1, no level skips (24 headings/page vs 23 baseline; Hebbal 26 for its 8 FAQs) — ✅

### Performance / DOM
- Rendered HTML size: 139–141 KB for new pages vs 140 KB baseline (Indiranagar/HSR) — **no DOM/size regression** — ✅

### Uniqueness / cannibalization / doorway safety
- `python3 scripts/check-area-uniqueness.py http://localhost:8081 /tmp/...` (report redirected to /tmp to avoid overwriting docs) → **Verdict: PASS**
  - **Zero flagged pairs among indexable (priority) pages.**
  - All flagged >60% pairs involve only noindex basic pages (pre-existing, scheduled in the content calendar).
  - New P0 pages vs watched competitors: Hebbal↔KR Puram 43%, KR Puram↔Mahadevapura 42%, Banashankari↔Madiwala 45%, Banashankari↔MG Road 42%, MG Road↔Madiwala 40%, Mahadevapura↔Whitefield 41% — all far below the 60% line.
  - Thin pages: **None** (all ≥1027 words).
- Each new page's unique value: distinct parking/access realities, landmarks, coverage wording, and area-specific FAQs (see §4/§7).

### Regression
- Existing 12 indexable guides intact (all render, remain indexable, zero uniqueness flags) — ✅
- 23 remaining noindex pages unchanged (same `noindex,follow`, same content tier) — ✅
- Hyderabad: files untouched (still untracked/pre-existing only); `/hyderabad` 200, `/hyderabad/areas` 200, `/hyderabad/areas/gachibowli` 200 — ✅
- Service pages intact (`/bikes` `/cars` `/bike-service` all 200; included in the 124-link check) — ✅
- Booking flow intact: booking files untouched by this stage; booking UI present on home — ✅
- GA4 intact: `G-EQ8P35TH54` present on new pages — ✅
- Supabase/CI/Cloudflare: untouched (`git status` clean for `.github/`, `wrangler.toml`, `supabase/`, `src/convex/`) — ✅

### Scripts
- `bun scripts/test-data-sync.mjs` → **PASS** (exit 0)
- `bun tsc -b --noEmit` → **exit 0** (run twice: after content edits, and after contact/sitemap edits)

## 13. Build/typecheck results

| Check | Command | Result |
|---|---|---|
| TypeScript | `bun tsc -b --noEmit` | **PASS (exit 0)** — run after all edits |
| Production build | `bun run build` (`vite build && node scripts/make-dist.mjs`) | **FAILED: exit 137 — `vite build` Killed (out of memory)** |

Exact failure output tail:

```
/usr/bin/bash: line 1: 323328 Killed                  vite build
error: script "build" exited with code 137
```

This is the known local memory limitation (sandbox has ~2 GB RAM; `free -m` shows ~948 MB available). Per stage rules: **no build configuration was changed, build quality was not reduced, no partial `.output` was deployed, and all source changes are preserved.** The previously verified GitHub Actions production build (`prod-build.yml`) remains the appropriate high-memory build path — running it requires a push, which is **forbidden in this stage**. `build:prod` was not attempted (documented OOM path). Note: `dist/` is gitignored; the partial build artifacts do not affect the working tree.

## 14. Related Answers bug — documented but NOT fixed

**Bug:** the same four Related-Answers links appear on all 40 Bangalore area pages because the area argument is ignored:

- `answersForArea(areaName)` in `src/lib/answer-page-summary.ts:112-128` ignores `areaName`.
- Duplicate logic in `src/lib/answer-pages.ts:1101-1121`.
- Route wiring: `src/routes/areas.$slug.tsx` imports the summary copy (line 6) and calls it (line 189).

**Status: NOT fixed in this stage**, per explicit instruction. The component was not modified; the six P0 pages function correctly with the existing behavior. Recommend a dedicated fix stage.

## 15. ₹299 production-status note

- The repository source uses the authoritative `VISITING_CHARGE = 299` (`src/lib/pricing.ts:9`) interpolated as `` `₹${VISITING_CHARGE}` `` — the literal "299" never appears in `area-content.ts`.
- **Production does not yet serve this stage's ₹299 visiting-charge copy for the six pages** — nothing has been deployed. Additionally, `src/lib/pricing.ts` carries pre-existing uncommitted changes from before this stage; the deployed production bundle reflects whatever was last shipped via GitHub Actions.
- All six rendered preview pages show the ₹299 visiting-charge FAQ answer (verified).

## 16. Risks/issues

1. **Sitemap/indexable count expectations in the request don't match measured reality** (see §17/§18 for exact numbers): the request expected "230 → ~235" sitemap URLs and "noindex 28 → 28"; measured: +40 URLs from this stage and noindex 28 → 23 (the 5 promoted areas legitimately moved out of the noindex set). Both divergences are arithmetic consequences of the promotion itself, verified against live output.
2. **Local production build OOM (exit 137)** — verification of the production bundle must happen in GitHub Actions after a future approved push.
3. **Contact page chip list** now renders 17 chips (was 12) — visually verified layout uses `flex-wrap`; worth a glance in the deployment review.
4. **Related Answers bug** still surfaces identical 4 links on all 40 pages (documented, §14).
5. **Sitemap `lastmod` for areas** is now 2026-10-05 — future area-content edits should bump `LASTMOD.areas` again.
6. Hebbal FAQ count (8) vs `AreaContent` doc range "5–8" — at the top of the documented range, within spec.

## 17. Exact before/after sitemap counts

Measured on the local preview (the only environment this stage can serve):

| Metric | Before this stage | After this stage | Δ |
|---|---|---|---|
| Total `<loc>` URLs | **252** | **292** | **+40** |
| `/areas/*` URLs | 12 | 17 | +5 |
| Bike service×area URLs (7 services × priority areas) | 84 | 119 | +35 |
| Duplicates | 0 | 0 | 0 |

Reconciliation with the request's figures:

- The **audit baseline was 230** (production state at audit time). The local pre-stage tree already contained **+22 URLs from the user's pre-existing uncommitted changes** (principally the Hyderabad sitemap section: 22 URLs) → 230 + 22 = 252 before, 292 after.
- This stage's own delta is **exactly +40** (5 area pages + 35 service×area pairs), so a production deploy of *only this stage's logic* on top of the audited 230 would yield **270** — matching the plan document's "230 → 270" projection.
- The request's "230 → approximately 235" estimate was **not** met; actual delta is +40, verified by direct measurement.

## 18. Exact before/after indexable/noindex counts

All 40 Bangalore area URLs fetched and robots-checked:

| Metric | Before this stage | After this stage |
|---|---|---|
| Indexable Bangalore area guides | **12** | **17** ✅ (matches expectation 12 → 17) |
| noindex Bangalore area pages | **28** | **23** |
| Sitemap ↔ robots agreement | perfect | perfect (17 = 17) |

- The request expected "28 → 28". That is arithmetically impossible when 5 pages are promoted out of the noindex set: the 5 CREATE areas (KR Puram, Mahadevapura, Madiwala, Banashankari, MG Road) **were 5 of the 28 noindex pages** (audit: 12 priority + 28 basic = 40). After promotion: 17 priority + 23 basic = 40. Verified actual: **23 noindex**, each still `noindex,follow`, unchanged content, unchanged sitemap exclusion. No supporting page was edited.

## 19. Git status

**HEAD before = HEAD after:** `d96238573ec7a7580277b80824c119b9f0a28c23` — **unchanged; zero commits; zero pushes.**

Working-tree entries:

- **Before this stage:** 26 (24 pre-existing user changes + audit + plan reports)
- **After this stage:** 29 (26 + 3 newly-modified: `areas.ts`, `area-content.ts`, `contact.tsx`) — plus this report = **30 final entries** (`sitemap[.]xml.ts` was already among the 24 pre-existing modified files; this stage changed one line inside it).

Composition of the 29 (before writing this report): 10 preview PNGs (pre-existing), 10 modified src/config files (7 pre-existing: SiteFooter, answer-pages, pricing, services, routeTree.gen, sitemap, tsconfig.tsbuildinfo; 3 from this stage: areas.ts, area-content.ts, contact.tsx), 9 untracked (7 Hyderabad files pre-existing, audit report, plan report).

Scope audit: every pre-existing entry remains present and unmodified by this stage except the single approved `LASTMOD.areas` line in the already-modified sitemap file. No files outside the approved implementation scope were modified. The planning report and audit report are untouched.

## 20. Explicit deployment status

# 🚫 NOT DEPLOYED

- `bun run deploy` — **not run**
- Wrangler — **not run**
- Cloudflare cache purge — **not run**
- Freebuff/production deploy — **not run**
- `git commit` — **not run**
- `git push` — **not run**
- GitHub Actions — **not triggered**

This stage ends at implementation + validation. The next deployment decision is made separately after review of this report.

---

*Generated 2026-10-05 · Stage P0 implementation · Buffy (Codebuff) · Freebuff Cloud workspace*
