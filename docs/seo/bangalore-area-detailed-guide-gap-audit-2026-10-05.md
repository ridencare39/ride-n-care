# Bangalore Area Detailed-Guide Gap Audit — READ-ONLY SEO / AEO / GEO / IA Audit

**Site:** https://ridencare.co.in (Ride N Care — doorstep bike & car service, Bangalore)
**Date:** 2026-10-05
**Git HEAD (before & after):** `d96238573ec7a7580277b80824c119b9f0a28c23` (`d962385`)
**Verdict in one line:** The Bangalore area architecture is sound and technically clean (40/40 URLs 200, sitemap ↔ noindex agreement perfect, zero indexable-page duplication); the gap is **depth, not breadth** — 12 areas have true Detailed Guides, 28 exist only as thin noindex templates, and **10 of those 28 justify a Detailed Guide** (5 at P0), while **18 must not get one** (doorway/duplication risk).

---

## 0. Scope, method and honesty notes

**This was an audit only.** No source, route, sitemap, robots, schema, navigation, content, database (Supabase/DB) or GBP change was made. No page was created, no commit, push or deploy was performed. The only file created is this report (§18).

**Evidence sources used:**

| Source | What it gave |
|---|---|
| `src/lib/areas.ts` | The ONE Bangalore locality dataset (40 areas: slug, zone, pincode, nearby, landmarks, lat/lng, tier, confirmed) |
| `src/lib/area-content.ts` | Unique copy (intro / how / FAQs) for the 12 priority areas |
| `src/routes/areas.index.tsx`, `areas.$slug.tsx`, `$service.$area.tsx`, `index.tsx`, `map.tsx`, `contact.tsx`, `cars.tsx`, `answers.$slug.tsx`, `blog.$slug.tsx` | Rendering, H1/title/meta, internal links, FAQ/schema wiring |
| `src/routes/sitemap[.]xml.ts`, `public/robots.txt`, `src/lib/head.ts` | Sitemap generation, robots, canonical |
| `src/lib/nav.ts`, `src/components/SiteFooter.tsx`, `AreasSection.tsx`, `llms.txt` | Navigation / footer / GEO surfaces |
| Production HTTP checks (curl, read-only, 2026-10-05) | Status codes, meta robots, canonical, schema types, sitemap content on live ridencare.co.in |
| `docs/seo/05-area-uniqueness-report.md` (existing, 2026-09-20) | Measured visible word counts for all 40 pages + 4-gram duplication pairs |
| `docs/seo/OWNER-QUESTIONS.md` (Q3/Q33/Q34), `docs/seo/03-content-calendar.md` | Owner-confirmation state and landmark verification queue |

**Live keyword-volume data (Google Keyword Planner / GSC / Ahrefs / SEMrush) is NOT available in this environment.** No search-volume, keyword-difficulty, ranking or traffic figure is invented anywhere in this report. All opportunity scoring is **qualitative and internal-only** (§7).

**Coverage of checks:** all 40 area URLs were fetched from production (status + robots meta); all 108 area-bearing service URLs in the production sitemap were fetched (status); the production sitemap, robots.txt, homepage, `/areas` hub, and representative pages were parsed. Every area field below is derived from the repository, not from a screenshot or a hardcoded list.

---

## 1. Complete current Bangalore area inventory (discovered from the repo)

### 1.1 How the inventory was discovered

Bangalore coverage is generated from exactly one dataset — `src/lib/areas.ts` — which feeds (per its own header and verified in code): homepage coverage chips (`AreasSection`), the `/areas` hub, `/areas/{slug}` pages, `/$service/{slug}` local pages, `areaServed` schema, and the sitemap. Searches for `Bangalore|Bengaluru` across the repo (107 files) confirmed **no second Bangalore locality dataset** exists (the `hyd-*` files are Hyderabad, out of scope here).

**Totals discovered:**

- **40 Bangalore localities** in `AREAS` — East 16, South 17, North 2, West 3, Central 2.
- **12 with `tier: "priority"`** (unique copy in `AREA_CONTENT`) = `PRIORITY_AREA_SLUGS`.
- **28 "basic" tier** (no unique copy; data-driven template).
- **All 40 `confirmed: true`** — owner answered Q33: "ALL 40 localities confirmed" (`docs/seo/OWNER-QUESTIONS.md` line 76). Indexability now depends **only on tier**.
- **Every one of the 40 has a dedicated URL** `/areas/{slug}` (route `areas.$slug.tsx` is a single dynamic route) → **there is no "listing-only" area** in the dataset sense; the difference is guide depth (see §2).
- **280 service×area pages exist** (7 local bike services × 40 areas, route `$service.$area.tsx`), of which **108 pairs are in the sitemap** (84 bike = 7 × 12 priority areas + 24 car wave-1 pairs gated by `CAR_AREA_WAVE_1` registry) and 172 are `noindex,follow`.
- Supporting locality **mentions without pages** (landmark/nearby references only) = type D: e.g. Hulimavu, Balagere, Konanakunte, Vasanthapura, Viveknagar, Doddanekkundi, Yelahanka New Town, Goraguntepalya, Mathikere, Jalahalli, HRBR Layout, Banaswadi, Kundalahalli, AECS Layout, EPIP zone, Hosa Road, Viveknagar, BTM 2nd Stage, HAL 2nd Stage, Sector 7 HSR. No other Bangalore locality name has (or previously had) a page — the former homepage mention of **Kengeri no longer exists anywhere in `src/`** (verified: 0 matches).

### 1.2 URL, status, indexation and internal-link inventory (per area)

Verified live 2026-10-05: **all 40 URLs return HTTP 200**; unknown slug `/areas/not-a-real-area` returns **404**; canonical is **self-referencing on both tiers**; robots meta is **absent (indexable) on the 12 priority pages** and **`noindex, follow` on the 28 basic pages** — checked individually for all 40.

"Inlinks (computed)" = distinct pages that render a link to `/areas/{slug}`, derived from the templates: homepage marquee (1) + `/areas` hub (1) + `/map` (1) + 7 bike service×area footers + car wave-1 pairs (priority only) + 8 blog posts (only for the 6 areas in the hard-coded `AREAS.slice(0,6)` blog list) + contact/cars/3 coverage-answer pages (priority only) + exact `nearby`-chip inlinks from other area pages. **Zone-chip links (up to 3–6 more per page) are not included, so these are floors.** No area is orphaned or near-orphaned.

| Area | URL | HTTP | Dedicated page | Class (§2) | Robots | Canonical | In sitemap | Detailed-Guide link | Inlinks (floor) | Nearby-chip inlinks (exact) |
|---|---|---|---|---|---|---|---|---|---|---|
| Indiranagar | /areas/indiranagar | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 32+ | 5 |
| Whitefield | /areas/whitefield | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 27+ | 4 |
| Marathahalli | /areas/marathahalli | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 30+ | 6 |
| Bellandur | /areas/bellandur | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 33+ | 6 |
| Sarjapur Road | /areas/sarjapur-road | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 28+ | 5 |
| Koramangala | /areas/koramangala | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 25+ | 6 |
| HSR Layout | /areas/hsr-layout | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 24+ | 8 |
| BTM Layout | /areas/btm-layout | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 26+ | 7 |
| Jayanagar | /areas/jayanagar | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 18+ | 2 |
| JP Nagar | /areas/jp-nagar | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 21+ | 5 |
| Electronic City | /areas/electronic-city | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 22+ | 3 |
| Hebbal | /areas/hebbal | 200 | Yes | A | indexable | self | Yes | Hub badge + self | 18+ | 3 |
| Kalyan Nagar | /areas/kalyan-nagar | 200 | Yes (thin) | C | noindex, follow | self | No | — | 20+ | 2 |
| Mahadevapura | /areas/mahadevapura | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| KR Puram | /areas/kr-puram | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| HAL | /areas/hal | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Brookefield | /areas/brookefield | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Varthur | /areas/varthur | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Gunjur | /areas/gunjur | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Kasavanahalli | /areas/kasavanahalli | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Panathur Road | /areas/panathur-road | 200 | Yes (thin) | C | noindex, follow | self | No | — | 15+ | 5 |
| Kadubeesanahalli | /areas/kadubeesanahalli | 200 | Yes (thin) | C | noindex, follow | self | No | — | 15+ | 5 |
| Domlur | /areas/domlur | 200 | Yes (thin) | C | noindex, follow | self | No | — | 15+ | 5 |
| Ejipura | /areas/ejipura | 200 | Yes (thin) | C | noindex, follow | self | No | — | 16+ | 6 |
| Banashankari | /areas/banashankari | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| Bannerghatta Road | /areas/bannerghatta-road | 200 | Yes (thin) | C | noindex, follow | self | No | — | 11+ | 1 |
| Kanakapura Road | /areas/kanakapura-road | 200 | Yes (thin) | C | noindex, follow | self | No | — | 12+ | 2 |
| Bommanahalli | /areas/bommanahalli | 200 | Yes (thin) | C | noindex, follow | self | No | — | 16+ | 6 |
| Kudlu Gate | /areas/kudlu-gate | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| Madiwala | /areas/madiwala | 200 | Yes (thin) | C | noindex, follow | self | No | — | 17+ | 7 |
| Harlur | /areas/harlur | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| Singasandra | /areas/singasandra | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| Parappana Agrahara | /areas/parappana-agrahara | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Choodasandra | /areas/choodasandra | 200 | Yes (thin) | C | noindex, follow | self | No | — | 12+ | 2 |
| Yelahanka | /areas/yelahanka | 200 | Yes (thin) | C | noindex, follow | self | No | — | 11+ | 1 |
| Rajajinagar | /areas/rajajinagar | 200 | Yes (thin) | C | noindex, follow | self | No | — | 12+ | 2 |
| Malleshwaram | /areas/malleshwaram | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| MG Road | /areas/mg-road | 200 | Yes (thin) | C | noindex, follow | self | No | — | 13+ | 3 |
| Yeshwanthpur | /areas/yeshwanthpur | 200 | Yes (thin) | C | noindex, follow | self | No | — | 14+ | 4 |
| Peenya | /areas/peenya | 200 | Yes (thin) | C | noindex, follow | self | No | — | 11+ | 1 |

**"Detailed-Guide link" clarification:** there is no separate detailed-guide URL. On the `/areas` hub each priority card carries a visible **"Detailed guide" badge** (12 badges verified in production HTML), and the guide *is* the area page itself. The 28 basic cards carry no badge.

### 1.3 Page templates (H1 / title / meta / FAQ / schema / CTA) — identical shape for all 40, per-area variables only

These were read in `areas.$slug.tsx` and **verified against production HTML** for both tiers:

- **Title:** `Bike & Car Service in {Area}, Bangalore | Ride N Care` (verified: Indiranagar, Kalyan Nagar).
- **H1:** `Bike & Car Service in {Area}, Bangalore` (single H1 per page).
- **Meta description:** `Bike & car service at your gate in {Area}, {Zone} Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` — NOTE: this is the "confirmed" branch; because all 40 are now `confirmed: true`, the alternate "unconfirmed" copy (and the amber "coverage is being confirmed" banner) is **dead code that never renders** (§11 F2).
- **Headings sequence:** eyebrow (`{Zone} Bangalore · {pincode}`) → H1 → answer-first intro → H2 "Services at your gate in {Area}" (7 bike service links + car links) → H2 "How doorstep service works in {Area}" → H2 "Getting to you in {Area}" (landmark chips) → H2 "Related answers for {Area} customers" → H2 "Nearby areas we serve" → H2 "{Area} FAQs" → CTA banner → H2 "More {Zone} Bangalore areas".
- **FAQ:** visible FAQ section mirrors the FAQPage JSON-LD exactly (code + production check: **5 Question nodes on priority pages, 4 on basic pages**). Visible-content/schema agreement: ✅.
- **Schema per area page:** `Service` (with `areaServed` Place + pincode — emitted for all 40 because all are confirmed) + `BreadcrumbList` + `FAQPage` + `ItemList` (nearby) + the sitewide `Organization` graph whose `areaServed` lists **41 Places (Bengaluru + all 40 localities)** — verified in production HTML.
- **CTA:** Call `tel:+918069409289`, WhatsApp `wa.me/918296950339` (pre-filled message names the area), `Book Now` booking button — present on **all 40** (booking button gated on `confirmed`, which is true everywhere).
- **Service intent:** doorstep bike & car service (local, transactional) — uniform.

### 1.4 Content size, uniqueness and local signals (per area)

"Visible words" = measured page text from `docs/seo/05-area-uniqueness-report.md` (all 40, local build 2026-09-20; production re-measured today on samples: 916–946 words for area pages, 1,109–1,122 for service×area pages — same range). "Unique copy words" = words from `area-content.ts` unique to that area (computed from source; basic pages = 0 by construction).

| Area | Visible words | Unique copy words | FAQ items (vis + schema) | Landmarks (chips) | Nearby refs | Uniqueness verdict (4-gram, names stripped) | Useful beyond keyword targeting? |
|---|---|---|---|---|---|---|---|
| Indiranagar | 829 | 266 | 5 | 5 | 5 | PASS (0 flagged pairs — all priority pages pass) | Yes — parking reality, metro-to-Old-Airport-Road coverage |
| Whitefield | 811 | 253 | 5 | 4 | 4 | PASS | Yes — gated-community/office-parking process |
| Marathahalli | 797 | 238 | 5 | 4 | 5 | PASS | Yes — lane/landmark navigation, AECS/Kundalahalli |
| Bellandur | 777 | 217 | 5 | 4 | 5 | PASS | Yes — office vs gated-community halves |
| Sarjapur Road | 798 | 225 | 5 | 4 | 5 | PASS | Yes — corridor apartment-cluster logistics |
| Koramangala | 830 | 263 | 5 | 5 | 5 | PASS | Yes — one-way lanes, block navigation |
| HSR Layout | 901 | 325 | 5 | 4 | 5 | PASS (strongest) | Yes — sector grid, basement/security detail |
| BTM Layout | 795 | 220 | 5 | 4 | 5 | PASS | Yes — narrow-street/parking specifics |
| Jayanagar | 806 | 241 | 5 | 4 | 5 | PASS | Yes — block grid, stilt-parking detail |
| JP Nagar | 806 | 229 | 5 | 4 | 5 | PASS | Yes — phase-based navigation |
| Electronic City | 825 | 244 | 5 | 5 | 5 | PASS | Yes — phase/tech-park logistics |
| Hebbal | 742 | **197** | 5 | 4 | 4 | PASS (but thinnest unique copy + smallest page) | Partially — good facts, lowest depth |
| Kalyan Nagar | 841 | 0 (template only) | 4 | 3 | 3 | 92%+ pairs with other basic pages | No — generic text with name swapped |
| Mahadevapura | 830 | 0 | 4 | 3 | 5 | 92–93% pairs (e.g. ↔ Varthur, Panathur) | No — template |
| KR Puram | 850 | 0 | 4 | 4 | 3 | 92–93% pairs (e.g. ↔ Kasavanahalli) | No — template |
| HAL | 832 | 0 | 4 | 4 | 4 | 92%+ pairs | No — template |
| Brookefield | 823 | 0 | 4 | 3 | 3 | **94%** ↔ Whitefield/Varthur/Kasavanahalli | No — template |
| Varthur | 827 | 0 | 4 | 3 | 4 | **94%** ↔ Whitefield | No — template |
| Gunjur | 825 | 0 | 4 | 3 | 3 | **95%** ↔ Kasavanahalli | No — template |
| Kasavanahalli | 825 | 0 | 4 | 3 | 3 | **95%** ↔ Gunjur | No — template |
| Panathur Road | 844 | 0 | 4 | 3 | 5 | **94%** ↔ Kadubeesanahalli | No — template |
| Kadubeesanahalli | 825 | 0 | 4 | 3 | 4 | **94%** ↔ Panathur Road | No — template |
| Domlur | 828 | 0 | 4 | 3 | 4 | 92%+ pairs | No — template |
| Ejipura | 829 | 0 | 4 | 3 | 4 | 92%+ pairs (↔ Madiwala, Kudlu, Singasandra, Harlur) | No — template |
| Banashankari | 829 | 0 | 4 | 3 | 3 | 93%+ pairs | No — template |
| Bannerghatta Road | 847 | 0 | 4 | 4 | 3 | **94%** ↔ Kanakapura Road | No — template |
| Kanakapura Road | 843 | 0 | 4 | 4 | 2 | **94%** ↔ Bannerghatta Road | No — template |
| Bommanahalli | 832 | 0 | 4 | 3 | 5 | **95%** ↔ Singasandra | No — template |
| Kudlu Gate | 850 | 0 | 4 | 3 | 5 | **95%** ↔ Singasandra | No — template |
| Madiwala | 836 | 0 | 4 | 4 | 5 | 93%+ pairs (↔ Kudlu, Bommanahalli, Singasandra…) | No — template |
| Harlur | 829 | 0 | 4 | 3 | 4 | **94%** ↔ Choodasandra | No — template |
| Singasandra | 829 | 0 | 4 | 3 | 4 | **95%** ↔ Kudlu/Bommanahalli | No — template |
| Parappana Agrahara | 846 | 0 | 4 | 3 | 4 | **94%** ↔ Singasandra | No — template |
| Choodasandra | 825 | 0 | 4 | 3 | 3 | **94%** ↔ Harlur | No — template |
| Yelahanka | 809 | 0 | 4 | 3 | 1 | Pairs ≤60% (template, geographically isolated) | No — template |
| Rajajinagar | 819 | 0 | 4 | 4 | 3 | Pairs ≤60% | No — template |
| Malleshwaram | 817 | 0 | 4 | 4 | 3 | Pairs ≤60% | No — template |
| MG Road | 834 | 0 | 4 | 4 | 3 | Pairs ≤60% | No — template |
| Yeshwanthpur | 820 | 0 | 4 | 4 | 4 | Pairs ≤60% | No — template |
| Peenya | 813 | 0 | 4 | 4 | 1 | Pairs ≤60% | No — template |

**Duplication-report headline (existing, measured):** 756 page pairs exceed the 60% 4-gram threshold; **ZERO of them involve any of the 12 priority (indexable) pages** — report verdict "PASS". All flagged pairs are basic↔basic and are a direct product of the shared template, which is exactly why those 28 pages are noindex today.

---

## 2. Four-type classification

| Type | Definition | Count | Members |
|---|---|---|---|
| **A — Dedicated detailed guide** | Standalone page with genuinely useful, location-specific information | **12** | Indiranagar, Whitefield, Marathahalli, Bellandur, Sarjapur Road, Koramangala, HSR Layout, BTM Layout, Jayanagar, JP Nagar, Electronic City, Hebbal |
| **B — Area listing only** | Listed in a hub but no dedicated page | **0** | None — the architecture auto-creates a page for every locality in `AREAS`; "listing without a page" state does not exist here. The nearest analogue is type D. |
| **C — Dedicated page but weak/thin** | Page exists but lacks unique value | **28** | All basic-tier pages (live, `noindex,follow`, template copy, 4 generic FAQs) |
| **D — Supporting/locality reference** | Mentioned as nearby/landmark context only, not a service-area landing page | **~30+ place names** | Hulimavu, Balagere, Konanakunte, Vasanthapura, Viveknagar, Doddanekkundi, Goraguntepalya, Mathikere, Jalahalli, HRBR Layout, Banaswadi, Kundalahalli, AECS Layout, EPIP zone, Hosa Road, BTM 2nd Stage, HAL 2nd Stage, Sector 7 HSR, Yelahanka New Town, Varthur Kodi, etc. — correctly referenced as geographic context, no page needed or implied |

---

## 3. SEO opportunity analysis (qualitative — no live keyword data)

**Statement of limitation:** live keyword-volume data is unavailable in this environment. No volume, difficulty, CTR or ranking estimates are stated as fact. Scores in §7 are internal prioritization only.

Qualitative evaluation per commercial dimension (applies across the inventory):

- **Bike service / bike repair / doorstep variants:** strong everywhere in Bangalore — the business model is doorstep service city-wide; locality+service queries ("bike service in Whitefield") are classic long-tail local intent. The site already satisfies these with service×area pages for all 40 areas (indexable for the 12).
- **Scooter service:** equally relevant (scooter-heavy city); covered by the `scooter-service` local page × area.
- **Car service relevance:** real but secondary; the repo's car strategy is deliberately gated (`CAR_AREA_WAVE_1`, 24 quality-gated pairs) — a good pattern to preserve.
- **Local search importance:** differs sharply by locality prominence — prime corridors (Indiranagar, Whitefield, Koramangala, HSR, MG Road, E-City, KR Puram, Mahadevapura) vs quiet satellites (Gunjur, Choodasandra, Parappana Agrahara).
- **Unique content potential:** high where the locality has its own junctions/roads/markets/transport landmarks that no neighbouring page already uses; **low where a page would re-use a neighbour's landmarks** (this is the dominant fact for the 14 grouped areas).
- **Whether adequately covered elsewhere:** every basic area is already reachable and its service intent is served by its service×area pages + neighbouring priority guides' nearby chips; a new guide is only justified where it can say things no other page says.
- **Doorway risk:** high for name-swap templating (the current basic template is ~92–95% similar across pages) — see §13.

---

## 4. AEO analysis (8 sample customer questions)

Coverage assessed on the **live site** (production HTML + repo). Legend: ✅ direct, visible, factual answer · ⚠️ partial/indirect · ❌ not found live.

| # | Sample question | Priority (12) area pages | Basic (28) area pages | Where else answered | Verdict |
|---|---|---|---|---|---|
| 1 | Does Ride N Care provide bike service in [AREA]? | ✅ answer-first intro + H1 + 7 service links | ⚠️ generic intro asserts yes, but `noindex` keeps it out of answer indexes | `/bike-service`, `/answers/areas-covered` | Strong for 12; weak for 28 |
| 2 | Does Ride N Care provide doorstep bike service in [AREA]? | ✅ intro says "at your doorstep/your gate" | ⚠️ same generic assertion, noindex | `/doorstep-bike-service` + `/{svc}/{area}` pages (all 40) | Strong for 12 |
| 3 | Can I get bike repair at home in [AREA]? | ⚠️ service links "Bike Repair in {Area}" + "Doorstep Bike Repair in {Area}" present; not spelled out in FAQ prose on most | ⚠️ generic "what work can be done at doorstep" FAQ covers scope | `/bike-repair`, `/doorstep-bike-repair` + answers | Adequate; improvable with one explicit local sentence |
| 4 | Does Ride N Care service scooters in [AREA]? | ⚠️ **only 2 of 12** FAQs say "scooter" explicitly (Koramangala, Marathahalli); all pages do link "Scooter Service in {Area}" | ❌ generic 4 FAQs mention bikes and cars only (link exists) | `/scooter-service` | Gap: add visible scooter line before any FAQ schema change |
| 5 | What does a doorstep bike service include? | ⚠️ Marathahalli FAQ points to "the checklist on the service page" | ⚠️ generic scope list | ✅ `/doorstep-bike-service` (checked live), `/answers/what-included-bike-service` | Well answered site-level; area pages may reference it |
| 6 | What is the visiting charge? | ❌ **not present in production** for any area/service/answer page checked | ❌ | **In repo but NOT deployed:** `VISITING_CHARGE = 299` exists in `src/lib/pricing.ts` (owner decision 4 Oct 2026) and is used by `services.ts` / `answer-pages.ts` — both files carry uncommitted working-tree changes | **Live AEO gap** — resolves when the pending working tree is deployed; audit-only: no change made |
| 7 | How does booking work? | ✅ 3 CTAs + "How doorstep service works" + WhatsApp pre-fill | ✅ same | `/answers/how-to-book`, `/faq`, booking modal | Strong |
| 8 | What warranty applies? | ✅ 45-day service warranty stated in intro/FAQ/CTA (Hebbal FAQ uses the shared `GUARANTEE` constant) | ✅ generic FAQ states it | `/guarantee`, all service pages | Strong |
| 9 (bonus) | Which nearby locations are served? | ✅ "Nearby areas we serve" chips (4–5) | ⚠️ 1–5 chips; Yelahanka & Peenya have only 1 | `/areas` hub, `/answers/areas-covered` | Adequate |

**FAQ-schema policy finding:** every existing FAQPage JSON-LD block **mirrors visible on-page Q&A** (verified on production for both tiers and service×area pages). That is correct. **No new FAQ schema should be added anywhere unless matching visible Q&A is added first** — in particular do NOT add FAQ schema for questions 4 or 6 until the visible copy exists (question 6's copy exists in the repo pending deploy; question 4's does not).

---

## 5. GEO / AI search analysis

**Strong positives (verified):**

- `public/robots.txt` explicitly **allows** OAI-SearchBot, ChatGPT-User, PerplexityBot/Perplexity-User, Claude-SearchBot/Claude-User, Applebot, and (by owner decision Q13) training crawlers — answer engines can retrieve the site.
- `public/llms.txt` (94 lines, live) states coverage in **40 confirmed Bangalore localities**, names the 12 headline localities, and points to `/areas` and `/answers/areas-covered` — consistent with the data file (count derived, not hardcoded).
- Sitewide `Organization` schema: `addressLocality: Bengaluru`, `areaServed` = Bengaluru + **all 40 Places**, opening hours, `knowsAbout` service list — a coherent Bangalore↔Ride N Care entity relationship on every page.
- Per-area pages give AI systems: zone + pincode, 3–5 real geographic landmarks, 1–5 nearby locality relationships, service types, process facts (written quote, OEM-grade parts, 45-day warranty, invoice on WhatsApp), and links to commercial pages.
- Coverage statements are owner-confirmed (Q33: all 40).

**Fabrication check (explicit):** search found **zero** instances of "our branch in…", "our workshop at…", "our mechanic stationed at…" or any address/landmark/review/response-time fabrication in area content. Landmarks are presented strictly as navigation context ("Bookings here are pinned to the landmarks you know").

**Weaknesses / cautions:**

1. **28 of 40 locality pages are `noindex`** — mainstream answer engines that rely on indexed content will not cite them; their GEO value exists only in the org-level `areaServed` list and llms.txt.
2. Basic pages' local context is limited to landmark chips + nearby names — thin geographic narrative for AI extraction.
3. The phrase "assigned from the unit nearest to you" appears widely — it implies multiple dispatch units. It makes **no location claim** (no address, no branch), but it is an operational assertion worth adding to the owner's verification queue alongside Q34.
4. Service×area pages carry only a single generic area sentence ("In {Area}, a verified mechanic is assigned…") — minimal unique geographic context on 172 noindex + 84 indexable pages.
5. **Landmark verification (Q34) is still open** — see §14.

---

## 6. Detailed-guide decision framework (exactly one recommendation per area)

Recommendation totals (40 areas, each exactly one):

| Recommendation | Count |
|---|---|
| KEEP DETAILED GUIDE | 11 |
| IMPROVE EXISTING GUIDE | 1 (Hebbal) |
| CREATE DETAILED GUIDE | 10 |
| KEEP AS AREA LISTING | 4 |
| KEEP GROUPED WITH ANOTHER AREA | 14 |
| CONSOLIDATE / NOINDEX REVIEW | 0 (recommendation for owner review only — none needed: all thin pages are **already** noindex, which is the correct conservative state) |

One-line rationale per recommendation class (full per-area reasons in §15 master table):

- **KEEP DETAILED GUIDE (11):** unique copy 217–325 words, unique FAQ answers, passes the duplication gate, distinct landmarks — the guide earns its URL.
- **IMPROVE EXISTING GUIDE (Hebbal):** only indexable North guide, strategically valuable, but thinnest unique copy (197 words) and the smallest page (742 words) — uplift to the 300-word bar already used in `03-content-calendar.md`.
- **CREATE DETAILED GUIDE (10):** prominent locality with distinct corridor/junction/landmark facts available, real long-tail intent, existing internal-link footholds — and a current page that is thin/noindex. "Create" here means: write the unique guide at the existing URL, then make it indexable (owner action, not done in this audit).
- **KEEP AS AREA LISTING (4: HAL, Yelahanka, Rajajinagar, Peenya):** legitimate locality, page stays, but either the facts overlap a neighbouring guide (HAL ↔ Old Airport Road with Domlur/Indiranagar; Rajajinagar ↔ proposed Malleshwaram uplift) or demand/uniqueness is too thin (Yelahanka far-north with 1 inbound link; Peenya industrial).
- **KEEP GROUPED (14):** satellite layouts/corridors whose landmarks and character are already owned by a stronger page — a dedicated guide would be 92–95% duplicative unless the owner supplies genuinely new local facts.

---

## 7. Scoring model (0–100, internal prioritization only — NOT a Google score)

Anchors used (qualitative):

- **Commercial intent (0–20)** — density of two-wheeler/car service demand: prime residential + tech + retail corridors score high; industrial/far-flung scores low.
- **Local search importance (0–20)** — prominence/recognition of the locality as a destination (size, transport hub, commercial weight).
- **Unique content potential (0–20)** — room for genuinely non-duplicative local content. For existing guides this is *remaining headroom* (they already realized part of it), for thin pages it is *buildable* potential.
- **AEO usefulness (0–15)** — how many distinct customer questions a guide can uniquely and factually answer.
- **GEO/AI usefulness (0–15)** — distinct geographic context (corridors, junctions, landmarks, neighbour relationships) available for AI answers.
- **Internal-link opportunity (0–10)** — current linking gap/opportunity (low inlinks or high-exposure pages under-served).
- **− Duplicate/doorway risk (0–20)** — measured similarity to sibling pages / shared landmarks / template risk.
- **− Insufficient verified facts (0–15)** — how much owner-supplied verification is still needed before unique copy can be written without fabrication (Q34 landmark queue counts against this).

### Score table with visible arithmetic (Gross = C+L+U+A+G+I; Score = Gross − Dup − Facts)

| Area | C | L | U | A | G | I | Gross | −Dup | −Facts | Score | Tier | Recommendation |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|---|
| kr-puram | 17 | 16 | 16 | 13 | 13 | 8 | 83 | −5 | −6 | **72** | P0 | CREATE DETAILED GUIDE |
| indiranagar | 18 | 19 | 8 | 13 | 13 | 5 | 76 | −3 | −3 | **70** | P2 | KEEP DETAILED GUIDE |
| koramangala | 18 | 18 | 8 | 13 | 13 | 6 | 76 | −4 | −3 | **69** | P2 | KEEP DETAILED GUIDE |
| hsr-layout | 17 | 17 | 8 | 13 | 13 | 7 | 75 | −3 | −3 | **69** | P2 | KEEP DETAILED GUIDE |
| whitefield | 18 | 18 | 8 | 12 | 13 | 5 | 74 | −3 | −3 | **68** | P2 | KEEP DETAILED GUIDE |
| electronic-city | 17 | 17 | 9 | 12 | 13 | 6 | 74 | −4 | −3 | **67** | P2 | KEEP DETAILED GUIDE |
| mahadevapura | 17 | 15 | 15 | 12 | 12 | 8 | 79 | −6 | −6 | **67** | P0 | CREATE DETAILED GUIDE |
| madiwala | 16 | 15 | 15 | 12 | 12 | 7 | 77 | −7 | −6 | **64** | P0 | CREATE DETAILED GUIDE |
| banashankari | 15 | 15 | 15 | 12 | 12 | 7 | 76 | −6 | −6 | **64** | P0 | CREATE DETAILED GUIDE |
| mg-road | 14 | 17 | 14 | 11 | 13 | 7 | 76 | −7 | −6 | **63** | P0 | CREATE DETAILED GUIDE |
| hebbal | 15 | 15 | 11 | 11 | 11 | 7 | 70 | −4 | −4 | **62** | P0 | IMPROVE EXISTING GUIDE |
| btm-layout | 16 | 16 | 8 | 11 | 11 | 6 | 68 | −4 | −3 | **61** | P2 | KEEP DETAILED GUIDE |
| domlur | 14 | 14 | 14 | 11 | 13 | 7 | 73 | −7 | −6 | **60** | P1 | CREATE DETAILED GUIDE |
| malleshwaram | 14 | 15 | 14 | 11 | 12 | 7 | 73 | −7 | −6 | **60** | P1 | CREATE DETAILED GUIDE |
| marathahalli | 16 | 15 | 8 | 11 | 11 | 6 | 67 | −5 | −3 | **59** | P2 | KEEP DETAILED GUIDE |
| bellandur | 16 | 15 | 8 | 11 | 11 | 6 | 67 | −5 | −3 | **59** | P2 | KEEP DETAILED GUIDE |
| sarjapur-road | 16 | 15 | 8 | 11 | 11 | 5 | 66 | −4 | −3 | **59** | P2 | KEEP DETAILED GUIDE |
| jp-nagar | 15 | 15 | 8 | 11 | 11 | 6 | 66 | −4 | −3 | **59** | P2 | KEEP DETAILED GUIDE |
| yeshwanthpur | 14 | 14 | 14 | 11 | 12 | 7 | 72 | −7 | −6 | **59** | P1 | CREATE DETAILED GUIDE |
| jayanagar | 15 | 15 | 8 | 11 | 11 | 5 | 65 | −4 | −3 | **58** | P2 | KEEP DETAILED GUIDE |
| kalyan-nagar | 14 | 13 | 13 | 10 | 11 | 8 | 69 | −8 | −6 | **55** | P1 | CREATE DETAILED GUIDE |
| bannerghatta-road | 14 | 13 | 13 | 10 | 11 | 6 | 67 | −8 | −6 | **53** | P2 | CREATE DETAILED GUIDE |
| rajajinagar | 13 | 13 | 9 | 10 | 11 | 6 | 62 | −11 | −7 | **44** | P3 | KEEP AS AREA LISTING |
| peenya | 12 | 12 | 9 | 10 | 11 | 5 | 59 | −11 | −7 | **41** | P3 | KEEP AS AREA LISTING |
| hal | 13 | 12 | 8 | 9 | 11 | 6 | 59 | −12 | −8 | **39** | P3 | KEEP AS AREA LISTING |
| kanakapura-road | 13 | 12 | 7 | 9 | 10 | 6 | 57 | −12 | −8 | **37** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| yelahanka | 11 | 10 | 8 | 9 | 10 | 5 | 53 | −11 | −8 | **34** | P3 | KEEP AS AREA LISTING |
| ejipura | 14 | 12 | 7 | 9 | 9 | 6 | 57 | −14 | −9 | **34** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| varthur | 13 | 11 | 6 | 8 | 9 | 6 | 53 | −14 | −9 | **30** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| brookefield | 13 | 11 | 6 | 8 | 9 | 6 | 53 | −15 | −9 | **29** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| bommanahalli | 13 | 10 | 6 | 8 | 9 | 6 | 52 | −15 | −9 | **28** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| panathur-road | 12 | 9 | 5 | 7 | 9 | 6 | 48 | −15 | −10 | **23** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| kadubeesanahalli | 12 | 9 | 5 | 7 | 9 | 6 | 48 | −15 | −10 | **23** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| kudlu-gate | 12 | 9 | 5 | 7 | 8 | 6 | 47 | −15 | −10 | **22** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| harlur | 12 | 9 | 5 | 7 | 8 | 5 | 46 | −15 | −10 | **21** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| singasandra | 11 | 8 | 5 | 7 | 8 | 6 | 45 | −15 | −10 | **20** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| gunjur | 11 | 8 | 5 | 7 | 8 | 5 | 44 | −16 | −10 | **18** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| kasavanahalli | 11 | 8 | 5 | 7 | 8 | 5 | 44 | −16 | −10 | **18** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| parappana-agrahara | 11 | 8 | 5 | 7 | 8 | 5 | 44 | −16 | −10 | **18** | P3 | KEEP GROUPED WITH ANOTHER AREA |
| choodasandra | 10 | 8 | 5 | 7 | 8 | 5 | 43 | −16 | −10 | **17** | P3 | KEEP GROUPED WITH ANOTHER AREA |

Score range 17–72. Distribution: P0 = 6, P1 = 4, P2 = 12, P3 = 18.

---

## 8. Priority tiers

- **P0 — Immediate opportunity (6):** `kr-puram` (72), `mahadevapura` (67), `madiwala` (64), `banashankari` (64), `mg-road` (63) — CREATE; `hebbal` (62) — IMPROVE.
- **P1 — High-value, after P0 (4):** `domlur` (60), `malleshwaram` (60), `yeshwanthpur` (59), `kalyan-nagar` (55) — CREATE.
- **P2 — Supporting opportunity (12):** `bannerghatta-road` (53) — CREATE later; plus the **11 KEEP DETAILED GUIDE** areas (maintain, refresh, earn links — no new page needed).
- **P3 — Do not create now (18):** 14 KEEP GROUPED + 4 KEEP AS AREA LISTING.

Existing uplift roadmap note: `docs/seo/03-content-calendar.md` already schedules six "area uplift" batches (18 of the 28 basics, explicitly banning name-swap templating). This audit's P0/P1 set **re-sequences** that roadmap: batches covering KR Puram, Mahadevapura, Madiwala, Banashankari should go first; the four "satellite cluster" pages (Gunjur/Kasavanahalli/Panathur/Kadubeesanahalli, Choodasandra/Harlur, Parappana, etc.) should be dropped from uplift and kept grouped instead. (Recommendation only — no file changed.)

---

## 9. Existing detailed-guide quality audit (the 12 type-A pages)

Inspected: title, meta, H1, heading order, visible/unique content, local + service relevance, FAQs (visible ↔ schema), internal links, CTA, canonical, robots, sitemap, schema, indexability, duplication, doorway risk, factual claims.

| Guide | Grade | Reason |
|---|---|---|
| HSR Layout | **A** | 325 unique words (bar is 300), sector-by-sector coverage, basement/security operational detail, 5 unique FAQs, zero duplication |
| Indiranagar | **A** | 266 unique words, parking-vs-metro geography, bike+car single-visit FAQ, zero duplication |
| Koramangala | **A** | 263 unique words, one-way-lane navigation answer, explicit scooter FAQ, zero duplication |
| Whitefield | **B** | Strong gated-community/EPIP process copy (253w) but 4 landmarks shared direction with Brookefield/Varthur cluster (grouped — no conflict) |
| Electronic City | **B** | Good phase-based copy (244w); "office-parking jobs are among the most common bookings here" is an operational claim to keep an eye on (mildly unsupported quantifier) |
| Jayanagar | **B** | 241w, block-grid coverage; weaker external position (only 2 nearby inlinks) |
| JP Nagar | **B** | 229w, phase navigation, payment FAQ; solid not outstanding |
| Marathahalli | **B** | 238w with landmark-anchored navigation; must keep absorbing Brookefield/AECS references (already does) |
| BTM Layout | **B** | 220w, narrow-street reality; FAQ set leans on service page for inclusions |
| Sarjapur Road | **B** | 225w; corridor copy partly overlaps Bellandur's ORR framing (watch, not urgent) |
| Bellandur | **B** | 217w (above 300? no — below the calendar's 300-word uplift bar) — office-vs-gated split is good; thin end of the A-tier |
| Hebbal | **C** | Thinnest unique copy (197w) and smallest page (742w); guarantee FAQ answer reuses a sentence fragment; only indexable North guide — must be the strongest, is currently the weakest |

None is grade **D** (no strategic problem): all 12 are indexable, self-canonical, in the sitemap, duplication-clean, schema-mirrored, and CTA-complete. Shared weaknesses worth noting once (apply to all): no photography on area pages; "Last reviewed: 2026-09-20" is now stale; the related-answers block is the same 4 answers on every page (§11 F5); no link to `/pricing` or `/guarantee`.

**Factual-claims sweep:** no invented response times, no slot guarantees, no job counts, no review/rating claims on area pages. Arrival language is "confirmed when you book" (safe). Two quantifier-style claims flagged for owner review: Electronic City "office-parking jobs are among the most common bookings here" and the widespread "unit nearest to you" phrasing (§5.3).

---

## 10. Internal linking audit

**Crawl path verified:** Homepage → `AreasSection` marquee (**40 unique area links**, 80 rendered occurrences) → `/areas` hub (**40 links, 12 "Detailed guide" badges**) → `/areas/{slug}` → service links (`bike-service`, `doorstep-bike-service`, `bike-repair`, `doorstep-bike-repair`, `motorcycle-service`, `scooter-service`, `emergency-bike-repair` × the area) → answer pages (4 related + 3 coverage answers linking the 12 priority guides) → service pages.

Additional sources: menu rows (`nav.ts`: "Areas We Serve" in the services-menu footer **and** the side panel), footer ("Service Areas" → `/areas`), `/cars` (12 priority chips), `/contact` (12 priority chips), 8 blog posts (hard-coded `AREAS.slice(0,6)` chips), `/map` (all 40 — but `/map` is `noindex` and **receives no internal links itself**: 0 `href="/map"` on the homepage, none in nav/footer → effectively an orphan utility page), `llms.txt` → `/areas`.

Findings:

1. **No orphaned or near-orphaned area pages.** Floors range 11+ (Bannerghatta Road, Yelahanka, Peenya) to 33+ (Bellandur) linking pages.
2. **Weakest important pages:** Jayanagar (floor 18, only 2 nearby inlinks) and Hebbal (18) — both indexable guides; Kalyan Nagar is the reverse case (20+ links including all 8 blog posts, but noindex → equity leak).
3. **Repeated anchor pattern:** chips use "📍 {Name}" everywhere; the hub hides a crawlable descriptive anchor in `sr-only` text ("Doorstep bike and car service in {Area} — detailed area guide" for priority) — acceptable but the *visible* anchor text is just the name; an opportunity to make visible anchors descriptive.
4. **`answersForArea()` ignores its area argument** — every one of the 40 pages renders the *same* 4 "Related answers for {Area} customers" links under a localized heading. Heading promises localization the link set doesn't deliver (quality issue, not a link-flow issue).
5. **Blog area chips are static** (`AREAS.slice(0,6)`), so all 8 posts link the same 6 areas — including noindex Kalyan Nagar — and never Mahadevapura, KR Puram, Madiwala, etc.
6. Area pages do **not** link `/pricing`, `/guarantee`, `/faq` or the guides hub — missed contextual-link opportunities (recommendation only).

---

## 11. Sitemap + indexing audit

**Live production facts (2026-10-05):**

| Check | Result |
|---|---|
| `/sitemap.xml` | 230 `<loc>` URLs; includes exactly **12** `/areas/{slug}` URLs = the 12 indexable guides ✅ |
| Indexable area pages ↔ sitemap | **12 ↔ 12 — perfect agreement** ✅ |
| noindex area pages ↔ sitemap | **28 `noindex,follow` pages, all excluded from sitemap** ✅ (no "sitemap-but-noindex", no "indexable-but-absent") |
| Service×area URLs in sitemap | 108 (7 bike × 12 + 24 gated car pairs); **all 108 fetched → HTTP 200** ✅ |
| Area URLs | **40/40 HTTP 200** ✅ |
| Canonical | Self-referencing on both tiers (verified priority + basic + service×area) ✅ |
| Unknown slug | `/areas/not-a-real-area` → **404** ✅ |
| robots.txt | Allows all crawlers incl. AI; disutility paths only (`/track-booking`, `/auth`, `/admin`, `/isolate`, `/seo-monitor`, `/api/`); declares sitemap ✅ |
| `/map` | `noindex` via `PAGE_ROBOTS` (allowed by robots.txt — valid combination) but orphaned (§10.6) |

**Problems / drift found (report-only, nothing changed):**

- **F1 — Comment & doc drift in `areas.ts` / content calendar:** the `areas.ts` header comment still claims north/west/central localities are "noindexed … until the owner flips the flag", and `03-content-calendar.md` still says "7 unconfirmed … Hebbal noindexed until Q33". Actual data: **all 40 `confirmed: true`** (Q33 answered) and Hebbal is indexable + in the sitemap. The *code* is right; the *comments/docs* are stale and mislead maintainers about why anything is noindex (it is now purely `tier`).
- **F2 — Dead "unconfirmed" branch:** because every area is confirmed, the alternate meta description, summary text, amber coverage banner and WhatsApp message variant in `areas.$slug.tsx` never render.
- **F3 — Production lags the working tree:** the live site contains **no visiting-charge copy** (`₹299` / "visiting charge" absent from `/faq`, `/pricing`, `/bikes`, `/doorstep-bike-service`, cost answers) even though `VISITING_CHARGE = 299` exists in `src/lib/pricing.ts` (owner decision 4 Oct 2026) wired into `services.ts` / `answer-pages.ts` — both carry **uncommitted working-tree changes**. The production sitemap also contains no `/hyderabad` URLs. AEO question 6 is unanswerable on the live site until that pending work ships (owner/deploy action; not an audit change).
- **F4 — Static blog area slice** (§10.5).
- **F5 — Identical related-answers block** on all 40 area pages (§10.4).
- **F6 — Sitemap `lastmod` for areas is hard-coded `2026-09-20`** — must be bumped when uplifts ship (else crawlers see stale dates after content changes).
- **F7 — `/map` orphan** (§10.6).
- No robots/canonical/status inconsistencies were found anywhere in the Bangalore area inventory.

---

## 12. Cannibalization audit

1. **`/areas/{x}` vs `/bike-service/{x}`** — titles "Bike & Car Service in X" vs "Bike Service in X"; both indexable for the 12. Defensible hierarchy (locality hub vs service detail) but the overlap is real for the query "bike service in {x}". *Mitigation (future, not now): keep the area hub answer-first on coverage + local context, keep the service page answer-first on checklist + price; avoid both chasing the identical head term in intro copy.*
2. **Four bike-service variants per area** — `bike-service`, `doorstep-bike-service`, `bike-repair`, `doorstep-bike-repair` (+ `motorcycle-service`, `scooter-service`) each render `/{svc}/{area}` with a shared template: same H2s, same benefits block shape, **the service's own FAQ repeated verbatim across all 40 areas** (9 identical Question nodes on every bike service×area page — verified live). Intent overlap between "bike service" and "doorstep bike service" is near-total on a doorstep-only site. *One strong page can satisfy both variants; do NOT create further variants ("bike servicing X", "bike service near me in X", "two wheeler service X").*
3. **Service-level FAQ duplication across areas** — for a given service, its 12 indexable area pages share the entire FAQ schema. The unique delta is: title/H1 tokens, pincode/zone, one generic area sentence, and the nearby-chip list. This is the **weakest uniqueness layer on the indexable tier** (see §13).
4. **Cluster overlaps among guides:** Bellandur ↔ Sarjapur Road both claim the ORR/Sarjapur corridor framing (both flagged "watch"); Marathahalli owns Brookefield/AECS (already absorbed); BTM's landmarks (Silk Board, Madiwala Checkpost) pre-empt a future Madiwala guide — Madiwala's uplift must build on Madiwala Market/lake/junction identity instead.
5. **Car pairs:** only 24 quality-gated pairs exist (registry `isCarAreaPublished`) — the car vertical shows the *correct* anti-cannibalization pattern; the bike vertical's 280-page blanket coverage is its opposite number, held safe only by noindex on the basic tier.

---

## 13. Doorway-page safety check

**Current state is safe** — the 28 thin pages are `noindex,follow` and excluded from the sitemap, so the template duplication (756 flagged pairs, 92–95% among satellites) is invisible to the index. The risk is entirely in *future uplift done carelessly*.

**Marked DO NOT CREATE — DOORWAY / DUPLICATION RISK** (uplifting these without owner-supplied unique facts would reproduce `[area] + same template + same service content`):

> **DO NOT CREATE — DOORWAY / DUPLICATION RISK:** Gunjur, Kasavanahalli, Choodasandra, Panathur Road, Kadubeesanahalli, Harlur, Parappana Agrahara, Singasandra, Kudlu Gate, Bommanahalli, Brookefield, Varthur, Ejipura, Kanakapura Road — plus **any new service-variant pages** of the form "bike servicing {area}" / "bike repair near {area}" / "{service} near me {area}".

**What unique information would be required before any of them becomes justified:** (a) landmarks and junctions *not* already used by the anchor guide, (b) 300+ words of locality-specific process/logistics copy (parking reality, gate/security patterns, corridor traffic behaviour) written or verified by the owner, (c) at least 2–3 area-specific FAQs whose answers cannot be copy-pasted to a sibling page, (d) re-run of `scripts/check-area-uniqueness.py` showing the pair vs its anchor guide under 60%, (e) Q34 landmark verification closed for that locality.

**Indexable-tier doorway watch (no action, monitor):** the 84 bike service×area pages are structurally templateised (identical H2 sequence + identical service FAQ across 12 areas). They pass today because Google's doorway signal cares about overall scale/uniqueness and each page carries unique area tokens + distinct intents — but this is the pattern to *stop expanding* (e.g. don't widen `CAR_AREA_WAVE_1` carelessly, don't add more local services, don't index the basic 172).

---

## 14. Landmark verification (existing landmarks only — none added, none changed)

Every area page renders 3–5 landmark chips from `areas.ts` under "Getting to you in {Area}" with the framing *"Bookings here are pinned to the landmarks you know — the mechanic reaches your gate…"* — geographic context only.

Classification of **existing** landmarks (Q34 in `OWNER-QUESTIONS.md` already queues **all** of them for owner verification — status: **open**):

| Class | Examples (from repo) | Assessment |
|---|---|---|
| **Clearly safe as geographic context** | Public roads (100 Feet Road, Hosur Road, ORR, Old Airport Road, Tumkur Rd NH 48, Magadi Road, Margosa Road, Harlur Road), metro/railway stations (Indiranagar, Jayanagar, JP Nagar, Banashankari, Peenya, MG Road, KR Puram, Whitefield, Yelahanka, Yeshwanthpur), lakes (Bellandur, Varthur, Agara, Sankey, Puttenahalli, Hebbal), junctions/flyovers (Silk Board, Sony World, Iblur, Trinity, Tin Factory, Hebbal Flyover, E-City Flyover), malls (Forum, Phoenix, Orion, Mantri, Meenakshi, Esteem), institutions (IIM Bangalore, Jyoti Nivas College, HAL Aerospace Museum, St. John's Hospital, Jayadeva Hospital), natural/geo (Turahalli Forest, Varthur Kodi, Balagere) | Real, well-known, used as navigation aids; no operational claim |
| **Needs owner verification (already queued Q34 — still open)** | The full landmark list for all 40 areas; especially private-premises gates used as waypoints: **Wipro Gate (Sarjapur Road), Wipro Gate (Electronic City), Infosys Gate (Phase 1), RMZ Ecospace, Embassy GolfLinks (EGL), Manyata Tech Park, ITPL** | Safe *if* kept as navigation references; owner should confirm accuracy + that referencing company premises is acceptable |
| **Potentially misleading (none found)** | — | No landmark misattribution detected (e.g. no area claims another area's landmark as its own beyond the deliberate shared-corridor chips like Silk Board on both BTM and Madiwala, which is factually correct) |
| **Implies a business location/branch (none found)** | — | No "our branch/workshop/mechanic at …" phrasing anywhere; no addresses attached to areas; no response-time or guarantee claims tied to landmarks |

Extra items for the owner's queue (not landmarks): the "unit nearest to you" dispatch phrasing (§5.3) and the Electronic City "most common bookings" quantifier (§9).

---

## 15. Final master table (all 40 Bangalore areas)

| Area | Existing URL | Dedicated Guide? | Indexable? | In Sitemap? | Detailed Guide Link? | Content Quality | SEO Opp | AEO Opp | GEO Opp | Dup Risk | Score | Priority | Recommendation | Reason |
|---|---|---|---|---|---|---|---|---|---|---|--:|---|---|---|
| Kr Puram | /areas/kr-puram | No (C: thin) | No (noindex,follow) | No | — | Thin-template | High | Med-High | Med-High | Med | 72 | P0 | CREATE DETAILED GUIDE | East gateway junction, 5 transport landmarks, noindex-thin page — build guide |
| Indiranagar | /areas/indiranagar | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 70 | P2 | KEEP DETAILED GUIDE | Unique 266w guide, passes uniqueness gate — prime East anchor, keep |
| Koramangala | /areas/koramangala | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 69 | P2 | KEEP DETAILED GUIDE | Unique 263w guide with lane/scooter FAQs — keep |
| Hsr Layout | /areas/hsr-layout | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 69 | P2 | KEEP DETAILED GUIDE | Strongest guide (325w unique) — keep |
| Whitefield | /areas/whitefield | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 68 | P2 | KEEP DETAILED GUIDE | Unique 253w guide; IT/tech-park anchor — keep |
| Electronic City | /areas/electronic-city | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 67 | P2 | KEEP DETAILED GUIDE | Phase-based unique copy (244w) — keep |
| Mahadevapura | /areas/mahadevapura | No (C: thin) | No (noindex,follow) | No | — | Thin-template | High | Med-High | Med-High | Med | 67 | P0 | CREATE DETAILED GUIDE | ORR tech corridor, 4 nearby inlinks exist — build guide |
| Madiwala | /areas/madiwala | No (C: thin) | No (noindex,follow) | No | — | Thin-template | High | Med-High | Med-High | Med | 64 | P0 | CREATE DETAILED GUIDE | Silk Board corridor, 7 nearby inlinks — build guide (differentiate vs BTM) |
| Banashankari | /areas/banashankari | No (C: thin) | No (noindex,follow) | No | — | Thin-template | High | Med-High | Med-High | Med | 64 | P0 | CREATE DETAILED GUIDE | Large south locality + metro/temple landmarks — build guide |
| Mg Road | /areas/mg-road | No (C: thin) | No (noindex,follow) | No | — | Thin-template | High | Med-High | Med-High | Med | 63 | P0 | CREATE DETAILED GUIDE | Central prime commercial address, metro — build guide |
| Hebbal | /areas/hebbal | Yes (A) | Yes | Yes | Hub badge + self | Good-thin | Med | Med | Med | Low | 62 | P0 | IMPROVE EXISTING GUIDE | Only North indexable guide but thinnest unique copy (197w) — uplift to 300w bar |
| Btm Layout | /areas/btm-layout | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 61 | P2 | KEEP DETAILED GUIDE | Parking-specific unique copy (220w) — keep |
| Domlur | /areas/domlur | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Med-High | Med-High | Med-High | Med | 60 | P1 | CREATE DETAILED GUIDE | Central-east EGL/Old Airport Rd — build guide (dedupe vs Indiranagar/HAL) |
| Malleshwaram | /areas/malleshwaram | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Med-High | Med-High | Med-High | Med | 60 | P1 | CREATE DETAILED GUIDE | Established central locality, distinct markets/tanks — build guide |
| Marathahalli | /areas/marathahalli | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 59 | P2 | KEEP DETAILED GUIDE | Unique 238w; absorbs Brookefield/AECS references — keep |
| Bellandur | /areas/bellandur | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 59 | P2 | KEEP DETAILED GUIDE | Unique 217w ORR/Sarjapur anchor — keep (watch vs Sarjapur Road) |
| Sarjapur Road | /areas/sarjapur-road | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 59 | P2 | KEEP DETAILED GUIDE | Unique 225w corridor copy — keep (watch vs Bellandur) |
| Jp Nagar | /areas/jp-nagar | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 59 | P2 | KEEP DETAILED GUIDE | Unique 229w phase copy — keep |
| Yeshwanthpur | /areas/yeshwanthpur | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Med-High | Med-High | Med-High | Med | 59 | P1 | CREATE DETAILED GUIDE | West hub: station, NH48, Mathikere — build guide |
| Jayanagar | /areas/jayanagar | Yes (A) | Yes | Yes | Hub badge + self | Strong | Med | Med | Med | Low | 58 | P2 | KEEP DETAILED GUIDE | Unique 241w; only 2 nearby inlinks — keep + link earn |
| Kalyan Nagar | /areas/kalyan-nagar | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Med-High | Med-High | Med-High | Med | 55 | P1 | CREATE DETAILED GUIDE | Linked from all 8 blog posts but noindex — build guide |
| Bannerghatta Road | /areas/bannerghatta-road | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Med-High | Med-High | Med-High | Med | 53 | P2 | CREATE DETAILED GUIDE | Corridor landmarks (IIM/Mall/biological park) — build later (P2) |
| Rajajinagar | /areas/rajajinagar | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | Med | 44 | P3 | KEEP AS AREA LISTING | West residential; overlaps proposed Malleshwaram uplift — listing only |
| Peenya | /areas/peenya | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | Med | 41 | P3 | KEEP AS AREA LISTING | Industrial profile, 1 nearby inlink, low consumer demand — listing only |
| Hal | /areas/hal | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | Med | 39 | P3 | KEEP AS AREA LISTING | Landmarks shared with Domlur/Indiranagar (Old Airport Rd) — listing only |
| Kanakapura Road | /areas/kanakapura-road | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 37 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Bannerghatta Rd context; corridor satellite — grouped with Banashankari |
| Yelahanka | /areas/yelahanka | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | Med | 34 | P3 | KEEP AS AREA LISTING | Far-north satellite, 1 nearby inlink, thin facts — listing only |
| Ejipura | /areas/ejipura | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 34 | P3 | KEEP GROUPED WITH ANOTHER AREA | Shares 80 Feet Rd/Koramangala context; uplift would duplicate Koramangala guide — grouped |
| Varthur | /areas/varthur | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 30 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Whitefield corridor — grouped with Whitefield |
| Brookefield | /areas/brookefield | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 29 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Whitefield/Varthur in template check — grouped with Whitefield |
| Bommanahalli | /areas/bommanahalli | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 28 | P3 | KEEP GROUPED WITH ANOTHER AREA | 95% dup vs Singasandra; Hosur Rd satellite — grouped with Electronic City |
| Panathur Road | /areas/panathur-road | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 23 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Kadubeesanahalli — grouped with Bellandur |
| Kadubeesanahalli | /areas/kadubeesanahalli | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 23 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Panathur Road — grouped with Marathahalli/Bellandur |
| Kudlu Gate | /areas/kudlu-gate | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 22 | P3 | KEEP GROUPED WITH ANOTHER AREA | 95% dup vs Singasandra; Hosur Rd satellite — grouped with Electronic City |
| Harlur | /areas/harlur | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 21 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Choodasandra; HSR/Sarjapur satellite — grouped with HSR Layout |
| Singasandra | /areas/singasandra | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 20 | P3 | KEEP GROUPED WITH ANOTHER AREA | 95% dup vs Kudlu/Bommanahalli; Hosur Rd satellite — grouped with Electronic City |
| Gunjur | /areas/gunjur | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 18 | P3 | KEEP GROUPED WITH ANOTHER AREA | 95% dup vs Kasavanahalli — grouped with Varthur/Whitefield cluster |
| Kasavanahalli | /areas/kasavanahalli | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 18 | P3 | KEEP GROUPED WITH ANOTHER AREA | 95% dup vs Gunjur; Sarjapur corridor satellite — grouped with Sarjapur Road |
| Parappana Agrahara | /areas/parappana-agrahara | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 18 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Singasandra; E-City satellite — grouped with Electronic City |
| Choodasandra | /areas/choodasandra | No (C: thin) | No (noindex,follow) | No | — | Thin-template | Low | Low | Low | High | 17 | P3 | KEEP GROUPED WITH ANOTHER AREA | 94% dup vs Harlur; Sarjapur satellite — grouped with Sarjapur Road |

---

## 16. Top recommendations

### A. Top 10 Bangalore areas that most need a Detailed Guide

| # | Area | Score | Why it matters | Existing coverage | Unique content that should be added | Create or improve |
|---|---|--:|---|---|---|---|
| 1 | **KR Puram** | 72 | East gateway: railway station, Tin Factory junction, Old Madras Road, bridge — a genuine transport + residential hub with 5 distinct landmarks nothing else owns | Thin noindex page (850w template), 13+ inlinks, 3 nearby inlinks | Old Madras Road corridor logistics, station/bridge navigation, market-side parking reality, 4–5 area FAQs | **Create** (build at existing URL, then index) |
| 2 | **Mahadevapura** | 67 | ORR tech corridor, ward-scale size, sits between Whitefield and KR Puram clusters | Thin noindex (830w), 14+ inlinks | Doddanekkundi/Varthur Rd/ORR-stretch identity, office + residential mix, distinct from Whitefield | **Create** |
| 3 | **Madiwala** | 64 | Silk Board corridor, market, checkpost; highest nearby-inlink count among basics (7) | Thin noindex (836w), 17+ inlinks | Madiwala Market/lake/junction identity — deliberately NOT reusing BTM's Silk Board/Checkpost framing | **Create** |
| 4 | **Banashankari** | 64 | Large south Bangalore residential belt with metro + temple anchors | Thin noindex (829w), 14+ inlinks | Metro-station-to-temple geography, Kanakapura Rd junction handling, block/phase navigation | **Create** |
| 5 | **MG Road** | 63 | Central prime commercial address: metro, Trinity, Brigade Road, stadium — office/car intent | Thin noindex (834w), 13+ inlinks | Office-parking + central-business-district logistics; must differ from Indiranagar's residential framing | **Create** |
| 6 | **Hebbal** | 62 (improve) | Only indexable North guide; Manyata + airport-road gateway | Existing guide, grade C (197w unique, 742w page) | Bring unique copy to ≥300 words: Manyata office-parking detail, flyover/lake geography, richer FAQs | **Improve** |
| 7 | **Domlur** | 60 | Central-east pivot between Indiranagar, HAL and E-City traffic; EGL/old airport corridor | Thin noindex (828w), 15+ inlinks | EGL/office-side identity distinct from Indiranagar's 100 Feet Road framing | **Create** |
| 8 | **Malleshwaram** | 60 | Established central-north locality with its own markets, 8th Cross, Sankey Tank | Thin noindex (817w), 13+ inlinks | Heritage-market + tank geography; anchor for all west-zone growth | **Create** |
| 9 | **Yeshwanthpur** | 59 | West hub: railway station, NH 48 (Tumkur Rd), Mathikere, Goraguntepalya | Thin noindex (820w), 14+ inlinks | Station/NH logistics + Mathikere reference; pairs with Peenya as listing | **Create** |
| 10 | **Kalyan Nagar** | 55 | East-north residential; **linked from all 8 blog posts yet noindex** — indexation leak | Thin noindex (841w), 20+ inlinks | Hennur Main Rd / Banaswadi / HRBR identity distinct from KR Puram & Hebbal | **Create** |

(Honourable mention, P2: **Bannerghatta Road** 53 — build only after the P0/P1 wave.)

### B. Areas that should NOT receive a new page

- **DO NOT CREATE — DOORWAY / DUPLICATION RISK (14):** Gunjur (18), Kasavanahalli (18), Parappana Agrahara (18), Choodasandra (17), Singasandra (20), Kudlu Gate (22), Harlur (21), Panathur Road (23), Kadubeesanahalli (23), Bommanahalli (28), Brookefield (29), Varthur (30), Ejipura (34), Kanakapura Road (37) — reason: 92–95% measured duplication with anchor clusters / landmarks already owned by an anchor guide (§13).
- **KEEP AS AREA LISTING (4):** HAL (39), Rajajinagar (44), Peenya (41), Yelahanka (34) — legitimate pages, insufficient distinct verified facts or demand to clear the doorway bar.
- Also: **no new locality pages beyond the current 40** should be added from landmark mentions (Hulimavu, Balagere, Konanakunte, etc. stay type D).

### C. Existing guides that need improvement (exact weaknesses)

1. **Hebbal (grade C):** unique copy 197 words (below the project's own 300-word bar); smallest page (742 words); guarantee FAQ answer begins mid-sentence via the `GUARANTEE` constant ("a 45-day service warranty…"); only 3 nearby inlinks.
2. **Bellandur (B, 217w) & Sarjapur Road (B, 225w):** both frame the same ORR/Sarjapur corridor — sharpen each page's distinguishing half (Bellandur = Iblur/RMZ office side; Sarjapur = Wipro Gate apartment corridor).
3. **All 12:** "Last reviewed: 2026-09-20" is stale; related-answers block is the same 4 links on every page (localize or rotate); no photography; no link to `/pricing`, `/guarantee`, `/faq`; visible chip anchors are bare place names (make anchors descriptive like the hub's `sr-only` text, visibly).
4. **Electronic City:** soften or substantiate "office-parking jobs are among the most common bookings here".
5. **Jayanagar:** lowest inbound neighbourhood links among guides (2) — earn/insert contextual links from Banashankari/JP Nagar once those are uplifted.

### D. Areas that should remain grouped (grouping logic)

Cluster anchors — satellite pages stay noindex and are referenced as "nearby" from the anchor guide:

| Anchor guide | Grouped satellites | Logic |
|---|---|---|
| Whitefield | Varthur, Brookefield, Gunjur | Same IT-corridor geography; satellites' landmarks (Varthur Lake, Graphite India Rd) already chip-linked from Whitefield's nearby set |
| Sarjapur Road | Kasavanahalli, Choodasandra | Corridor apartments off the main road; anchor owns Wipro Gate/Harlur Rd identity |
| Bellandur | Panathur Road, Kadubeesanahalli | ORR junction satellites; 94% mutual duplication |
| Marathahalli | (absorbs Brookefield references) | AECS/Kundalahalli already covered |
| HSR Layout | Harlur, Ejipura | Sector-grid extension; Ejipura's landmarks literally share 80 Feet Road with Koramangala |
| Electronic City | Bommanahalli, Kudlu Gate, Singasandra, Parappana Agrahara | One Hosur Road chain; 94–95% mutual duplication; anchor owns phases + Hosur Rd |
| Banashankari | Kanakapura Road | Corridor satellite; 94% dup vs Bannerghatta context |
| Malleshwaram (if uplifted) | Rajajinagar (listing) | West pair share Dr Rajkumar Rd framing |
| Yeshwanthpur (if uplifted) | Peenya (listing) | NH 48 chain; Peenya = industrial, listing suffices |
| Hebbal | Yelahanka (listing) | North pair; Yelahanka has 1 inbound link and thin facts |

### E. Internal-link opportunities (highest impact first)

1. **Fix the equity leak:** Kalyan Nagar receives links from all 8 blog posts but is noindex — either uplift it (recommended, P1) or stop linking it from blogs.
2. **Localize the related-answers block** per area (currently the same 4 answers on all 40 pages; `answersForArea()` ignores its argument) — coverage/cost/trust answers chosen per zone.
3. **Make blog area chips topic-driven** instead of `AREAS.slice(0,6)`.
4. **Add area→hub context links:** priority guides should link `/pricing`, `/guarantee` and `/faq` (currently zero).
5. **Post-uplift fan-out:** when a basic area becomes a guide, add it to contact chips, cars chips and the 3 coverage answers (today priority-only).
6. **Link or un-orphan `/map`:** the page holds all 40 area links but receives none; either surface it (e.g. from the hub) or accept it as a noindex utility.
7. **Descriptive visible anchor text** on hub cards (the descriptive copy exists only in `sr-only`).
8. **Jayanagar/Hebbal** cross-links from their new neighbours (Banashankari, Domlur uplifts).

### F. Technical / indexing problems

1. **No sitemap/noindex/canonical/status inconsistencies** — the core indexing machinery is clean (§11 table).
2. **Stale comments/docs** (F1): `areas.ts` header + `03-content-calendar.md` describe an old confirmed/noindex regime; code is correct, docs mislead.
3. **Dead unconfirmed-copy branch** (F2) in `areas.$slug.tsx`.
4. **Production behind working tree** (F3): visiting charge (₹299) copy and Hyderabad work not live; AEO gap for "What is the visiting charge?" persists in production.
5. **Static sitemap `lastmod`** (F6) for areas.
6. **`/map` orphan** (F7).
7. Hard-coded "40+" homepage stat & "40" in `areas.index` meta description are currently correct (40 confirmed) but are magic numbers beside the data-derived counters — future drift risk if localities are added.

### G. Doorway / cannibalization risks (significant ones)

1. **28 thin basic pages** — safe only because noindex; uplift without unique copy would create a doorway cluster (the 756-pair duplication evidence).
2. **84 indexable service×area pages sharing verbatim service FAQs** — the weakest uniqueness layer on the indexable tier; stop expanding it (don't add local services, keep the car registry gated, keep basics noindex).
3. **`bike-service` vs `doorstep-bike-service` (and `bike-repair` vs `doorstep-bike-repair`) intent overlap × 40 areas** — one strong page can satisfy both; no new variants.
4. **`/areas/{x}` vs `/bike-service/{x}` title overlap** — keep intents distinct (locality coverage vs service detail).
5. **Bellandur ↔ Sarjapur Road corridor framing** overlap inside the A-tier.
6. **Satellite clusters listed in §13** — explicitly DO NOT CREATE.

---

## 17. Recommended future Bangalore area architecture (proposal only — nothing created)

```text
Homepage  (/)
   │  AreasSection marquee: all confirmed localities (link equity entry point)
   ▼
Bangalore Service Areas hub  (/areas)
   │  zone sections (East · South · North · West · Central), pincodes,
   │  search filter, "Detailed guide" badges ONLY on guides
   ▼
Zone anchors (priority detailed guides)
   ├─ East:   Indiranagar · Whitefield · Marathahalli · Bellandur · Sarjapur Road
   │          + P0/P1: KR Puram · Mahadevapura · Kalyan Nagar · Domlur
   ├─ South:  Koramangala · HSR Layout · BTM Layout · Jayanagar · JP Nagar · Electronic City
   │          + P0: Madiwala · Banashankari      (+ Bannerghatta Road at P2)
   ├─ North:  Hebbal (improve) 
   ├─ West:   + P1: Yeshwanthpur
   └─ Central:+ P0/P1: MG Road · Malleshwaram
   │          satellites stay LISTED (noindex) and appear as "nearby" chips
   ▼
Commercial service pages
   ├─ Top-level: /bike-service · /doorstep-bike-service · /bike-repair ·
   │             /doorstep-bike-repair · /motorcycle-service · /scooter-service · …
   └─ Gated local pairs: /{service}/{area}  (indexable for guides only;
              car pairs stay behind the CAR_AREA_WAVE_1 quality registry)
   ▼
Answer & guide content
   ├─ /answers/* (coverage answers link every guide)
   ├─ /guides/* (topical depth)
   └─ /faq · /pricing · /guarantee  ← linked FROM guides (currently missing)
```

**Why each layer exists:**

1. **Homepage marquee** — proves city-wide coverage in one crawl step and distributes equity to all 40 pages without a directory dump.
2. **Hub `/areas`** — the only page that lists everything; zone grouping gives crawlable IA and hosts the "Detailed guide" badge as the single source of that label.
3. **Zone-anchor guides** — one (later two) strong page per zone cluster owns the indexable locality intent; satellites hang off them as nearby chips instead of competing thin URLs. This is what kills doorway risk while keeping 100% locality coverage.
4. **Service pages** — commercial intent lives here; pairing them only with guides (not with noindex satellites) keeps the indexable surface proportional to unique content.
5. **Gated local pairs** — retain for the guides (they already pass), keep the car registry pattern as the template for any future expansion; anything un-gated stays noindex.
6. **Answers/guides/utility** — AEO layer; coverage answers and llms.txt feed answer engines the verified coverage facts (including, once deployed, the ₹299 visiting charge).

---

## 18. Change control confirmation

**No changes were made. Confirmed explicitly:**

- ✅ No source files modified
- ✅ No database changes
- ✅ No Supabase changes
- ✅ No SEO metadata changes
- ✅ No routes created
- ✅ No routes deleted
- ✅ No sitemap changes
- ✅ No robots changes
- ✅ No schema changes
- ✅ No navigation changes
- ✅ No content changes
- ✅ No commits
- ✅ No pushes
- ✅ No deployment
- ✅ GBP (Google Business Profile) untouched
- Only file written: **this report**, `docs/seo/bangalore-area-detailed-guide-gap-audit-2026-10-05.md` (the one modification permitted by the request)

**Git state:**

| Metric | BEFORE audit | AFTER audit |
|---|---|---|
| HEAD | `d96238573ec7a7580277b80824c119b9f0a28c23` (`d962385`) | `d96238573ec7a7580277b80824c119b9f0a28c23` (`d962385`) — unchanged |
| Working-tree entries (`git status --porcelain \| wc -l`) | **24** (10 PNG, 7 modified src, 7 untracked hyd-* files) | **25** — the 24 pre-existing entries are byte-for-byte untouched; the +1 is **only this report file itself**, the single modification the request explicitly allows |
| Pre-existing entries changed | — | **0** |

---

*End of audit. No Detailed Guide pages were created; no existing Bangalore area page was changed; nothing was deployed.*
