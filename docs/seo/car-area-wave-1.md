# Car × Area — Wave 1 Quality Gate (Batch 3, Parts 2–3)

**Status: 20 published of 24 shortlisted · 2026-09-27 · Wave 2 (Batch 4): 4/4 published — see bottom section**
Scorer: `scripts/score-car-area.py` (plan mode = pre-build shortlist from `src/lib/areas.ts` + `src/lib/car-services.ts`; live mode = post-build URL-level gate against the dev server or production)
Published registry: `src/lib/car-area-content.ts` — **this doc and that file are a pair; a pair publishes only by adding a fully-written entry there.**

## Why a gate

108 car-service × confirmed-locality combinations are theoretically possible
(9 car services × 12 priority areas). Publishing all of them would produce
mostly interchangeable "car service in AREA" pages — doorway content that
Google's helpful-content systems and AI engines both discount. Batch 3
therefore shortlists first, writes each page individually, and publishes only
what clears the bar. Remaining combinations stay shortlisted for later waves
with genuinely new local input (owner-verified landmarks, real demand signals
from GSC once available).

## Scoring rubric (plan mode)

Weights (deliberately conservative — everything is owner-verifiable):

| Criterion | Weight | Source of truth |
|---|---|---|
| Owner-designated priority locality (tier:"priority") | +3.0 | `src/lib/areas.ts` |
| Owner-listed landmark | +1.0 each (cap 5) | `areas.ts` landmarks arrays (queued for owner local verification in OWNER-QUESTIONS.md) |
| Nearby confirmed area link | +0.5 each (cap 8) | `areas.ts` nearby arrays |
| Preferred service | each of 4 services | breadth across services, not depth in one |

Ranking is deterministic (score desc, slug asc). Services preferred:
`car-periodic-service`, `car-ac-service`, `car-battery-service`,
`car-brake-service` — the four with the broadest, most template-resistant
content (checklists, measurement narratives, usage patterns) and confirmed
booking intent.

**Quality thresholds every published page must meet (live mode):**
- ≥ 700 useful words of pair-specific content
- ≥ 3 pair-specific FAQs (visible + matching FAQPage schema)
- local-context ratio ≥ 55% of page content unique to the pair
- 4-gram Jaccard overlap < 60% against same-service siblings
- one H1, indexable (no accidental noindex), correct canonical

## Wave 1 shortlist (24 candidates, scored)

| # | Pair | Score | Decision |
|---|---|---|---|
| 1 | car-periodic-service × electronic-city | 10.5 | **PUBLISHED** |
| 2 | car-periodic-service × indiranagar | 10.5 | **PUBLISHED** |
| 3 | car-periodic-service × koramangala | 10.5 | **PUBLISHED** |
| 4 | car-periodic-service × bellandur | 9.5 | **PUBLISHED** |
| 5 | car-periodic-service × btm-layout | 9.5 | **PUBLISHED** |
| 6 | car-ac-service × electronic-city | 10.5 | **PUBLISHED** |
| 7 | car-ac-service × indiranagar | 10.5 | **PUBLISHED** |
| 8 | car-ac-service × koramangala | 10.5 | **PUBLISHED** |
| 9 | car-ac-service × bellandur | 9.5 | **PUBLISHED** |
| 10 | car-ac-service × btm-layout | 9.5 | **PUBLISHED** |
| 11 | car-battery-service × electronic-city | 10.5 | **PUBLISHED** |
| 12 | car-battery-service × indiranagar | 10.5 | **PUBLISHED** |
| 13 | car-battery-service × koramangala | 10.5 | **PUBLISHED** |
| 14 | car-battery-service × bellandur | 9.5 | **PUBLISHED** |
| 15 | car-battery-service × btm-layout | 9.5 | **PUBLISHED** |
| 16 | car-brake-service × electronic-city | 10.5 | **PUBLISHED** |
| 17 | car-brake-service × indiranagar | 10.5 | **PUBLISHED** |
| 18 | car-brake-service × koramangala | 10.5 | **PUBLISHED** |
| 19 | car-brake-service × bellandur | 9.5 | **PUBLISHED** |
| 20 | car-brake-service × btm-layout | 9.5 | **PUBLISHED** |
| 21 | car-periodic-service × hsr-layout | 9.5 | Shortlisted — not published |
| 22 | car-ac-service × jayanagar | 9.5 | Shortlisted — not published |
| 23 | car-battery-service × jp-nagar | 9.5 | Shortlisted — not published |
| 24 | car-brake-service × marathahalli | 9.5 | Shortlisted — not published |

## Why #21–24 were not published in this wave

- **Honest capacity accounting:** wave 1 publishes 20 pages, inside the
  16–24 target — the marginal 4 pages would have been written under time
  pressure against the same scorer rank, increasing name-swap risk.
- **Uniqueness discipline:** each remaining pair needs its own usage-pattern
  and access narrative (e.g. HSR sector grid, JP Nagar metro corridor,
  Marathahalli Bridge approach) that has not yet been written; publishing
  them without it would breach the no-location-swapped rule.
- **Measurement-first sequencing:** once GSC data lands (owner workflow,
  `docs/seo/gsc-query-review.md`), wave 2 should follow *demand* — any of
  these four with impressions but no matching page publishes first.
- Nothing was rejected for being low-value permanently; they are deferred to
  wave 2 with the reason recorded here.

## Combinations NOT shortlisted (and why)

- **The other 5 priority areas** (whitefield, marathahalli, sarjapur-road,
  btm-adjacent jayanagar, jp-nagar beyond the one listed above): ranked just
  below the cut; wave-2 candidates behind the four above.
- **car-oil-change, car-inspection, car-jump-start, car-repair,
  car-electrical-repair × any area:** intent for these narrower services is
  already served by the citywide pages + the periodic/AC/battery/brake area
  pages; area-level duplication risk outweighs thin local value this wave.
- **Any basic-tier (noindex) locality:** noindex pages cannot earn
  indexable area-level traffic; they are uplift candidates in the content
  calendar first.
- **Any unconfirmed locality:** excluded outright — no page, no schema
  areaServed, until owner confirmation (Q3/Q33 gating).

## Operating the gate in later waves

1. `python3 scripts/score-car-area.py plan --pairs N` → fresh shortlist.
2. Write each passing pair as a complete entry in `src/lib/car-area-content.ts`
   (answer-first para, access notes, prepare list, 3 FAQs — no templating).
3. `bun tsc -b --noEmit` → build → `live` mode scorer → schema validator.
4. Add the pair to this doc's table with its decision and reason.

## Wave 2 (Batch 4, 2026-09-27) — the four deferred pairs, re-scored and published

All four wave-1 deferrals (#21–24) were re-run through the same gate before
publishing. Each needed its own usage-pattern and access narrative written
individually (the wave-1 deferral reason), and each now has one:

| # | Pair | Re-score | Decision | Unique narrative written for wave 2 |
|---|---|---|---|---|
| 21 | car-periodic-service × hsr-layout | 9.5 | **PUBLISHED** | Sector-grid + 27th Main/Agara/Harlur access; ORR-commute usage pattern |
| 22 | car-ac-service × jayanagar | 9.5 | **PUBLISHED** | 4th Block/South End Circle idling-in-shade usage; block-level access notes |
| 23 | car-battery-service × jp-nagar | 9.5 | **PUBLISHED** | Bannerghatta Road partial-charge battery narrative; Jayadeva/Metro/Lake access |
| 24 | car-brake-service × marathahalli | 9.5 | **PUBLISHED** | Bridge/ORR-junction crawl pad-wear narrative; tech-park basement access |

No pair failed the re-score, so none was replaced with an arbitrary new
locality. Landmarks in every entry come from the owner-confirmed lists in
`src/lib/areas.ts`; no response times, job counts, prices or customer stories
were introduced. `src/lib/car-area-content.ts` now carries 24 published pairs
(20 wave 1 + 4 wave 2); the remaining 84 car×area combinations stay
unpublished behind the gate for future waves with genuine demand signals
(GSC data once owner access exists) or new owner-verified local input.
