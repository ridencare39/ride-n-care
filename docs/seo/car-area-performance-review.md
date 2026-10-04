# Car×Area Performance Review — Ride N Care (Batch 5)

**Created:** 2026-09-27 (Batch 5) · **Next scheduled review:** 2026-10-25 (~4 weeks of post-Batch-4 observation)
**Rule for this file:** every GSC-derived cell stays blank until the owner supplies real
Search Console data. A blank cell means **NOT MEASURED**, never "failed". No page is
deleted, rewritten or judged on insufficient observation time (see "Decision rules" below).

## Observation window

- Wave-1 pages (20): published Batch 3, live since 2026-09-27 deploy (`9b6d7b9c`).
- Wave-2 pages (4): published Batch 4, live since 2026-09-27 deploy (`eb7327da`).
- GSC has **never been connected** for data pulls (see `gsc-query-review.md`), so no page
  has a measured impressions/CTR/position record yet.

## Page status table (24 pages)

GSC status column: `NOT MEASURED — OWNER ACTION REQUIRED (GSC not connected)`.
Technical column verified live on 2026-09-27 (Batch 5 production audit).

| # | URL | Batch | Technical (live 2026-09-27) | GSC status | Group | Action | Next review |
|---|---|---|---|---|---|---|---|
| 1 | /car-periodic-service/electronic-city | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 2 | /car-periodic-service/indiranagar | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 3 | /car-periodic-service/koramangala | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 4 | /car-periodic-service/bellandur | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 5 | /car-periodic-service/btm-layout | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 6 | /car-ac-service/electronic-city | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 7 | /car-ac-service/indiranagar | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 8 | /car-ac-service/koramangala | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 9 | /car-ac-service/bellandur | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 10 | /car-ac-service/btm-layout | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 11 | /car-battery-service/electronic-city | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 12 | /car-battery-service/indiranagar | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 13 | /car-battery-service/koramangala | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 14 | /car-battery-service/bellandur | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 15 | /car-battery-service/btm-layout | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 16 | /car-brake-service/electronic-city | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 17 | /car-brake-service/indiranagar | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 18 | /car-brake-service/koramangala | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 19 | /car-brake-service/bellandur | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 20 | /car-brake-service/btm-layout | 3 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 21 | /car-periodic-service/hsr-layout | 4 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 22 | /car-ac-service/jayanagar | 4 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 23 | /car-battery-service/jp-nagar | 4 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |
| 24 | /car-brake-service/marathahalli | 4 | 200 · 1 H1 · self-canonical · in sitemap | NOT MEASURED | no data yet | observe | 2026-10-25 |

**Groups as of 2026-09-27:** all 24 pages → "no meaningful impressions yet" is itself
NOT MEASURED; the honest group for every page is **"observation pending — GSC data
required."** No page is in the technical-issue group (all pass the live audit). No
cannibalization exists by construction (same-service pair overlap < 60% enforced by
`scripts/score-car-area.py`; live max ≈ 48%). No page enters "needs content improvement"
without GSC evidence.

## Indexation status wording (strict)

- **LIVE:** verified 2026-09-27 — all 24 URLs return 200 with 1 H1, self-canonical, no
  accidental noindex, present in sitemap.xml (257 URLs).
- **INDEXABLE:** yes — all 24 (indexable meta, canonical, robots allow, sitemap inclusion).
- **INDEXED IN GOOGLE:** **NOT VERIFIED — OWNER ACTION REQUIRED.** A 200 response is not
  proof of indexing. Verification requires GSC URL Inspection or the Sitemaps report
  (`submitted` vs `indexed`) once the owner connects GSC access.

## Decision rules (locked for Batch 5 and the observation window)

1. Do **not** create more car×area pages until real GSC data demonstrates a justified
   opportunity (impressions without adequate coverage, not assumption).
2. Do **not** delete or noindex any of the 24 pages for having little/no data — none has
   had a fair observation window yet.
3. Do **not** rewrite titles/copy based on assumed queries. Changes enter the
   `gsc-query-review.md` backlog only with real query evidence.
4. After the owner connects GSC: classify each page into useful impressions / some
   impressions / no meaningful impressions / technical issue / cannibalization / needs
   content improvement, using ≥ 4 weeks of data from the Batch 4 deploy date.
5. Sitemap stays at 257 unless evidence justifies a change.

## What the owner should check on 2026-10-25 (or after connecting GSC)

- Sitemaps report: `submitted` vs `indexed` count for the 257-URL sitemap.
- URL Inspection on a sample: homepage, /car-ac-service/koramangala (strongest
  wave-1 cluster), /car-periodic-service/hsr-layout (wave-2).
- Queries report filtered to `/car-` landing pages: any impressions at all, and for
  which service×area terms.
- Record results in this file's table (replace NOT MEASURED cells with real numbers).
