# Ride N Care — 90-Day Keyword, Intent & URL Map
Created: 2026-09-19 (Part 3). Source: site inventory crawl (166 URLs), existing route/service/area data, seed clusters from the Part 3 brief. No keyword tool was used — every volume/difficulty question is labelled "TO VALIDATE in Search Console / Keyword Planner". Owner answers to Q1–Q7 (claim proofs) and Q4 (brands) were NOT available at writing time, so no unverified claim is embedded anywhere in this plan and brand coverage follows the owner's confirmed brand list (18 bike brands, 15 car brands).

Rules used to build this map
1. One keyword = one target URL. Where two existing pages could serve one keyword, the winner is chosen below (see Cannibalisation) and the loser is re-angled, canonicalised, or noindexed.
2. Existing URLs are never renamed. New pages proposed here keep the same flat-slug convention (`/{service}`) and reuse the existing `$service` route renderer where possible.
3. Locality pages exist as `/{local-service}/{area}` (12 priority areas × 6 local services). Brand and locality facts come only from confirmed data (src/lib/areas.ts = 40 localities; PRIORITY_AREAS = 12).
4. P1 = money keyword, existing page, action in weeks 5–6. P2 = build/optimise weeks 7–10. P3 = backlog / opportunistic.

Full map: `docs/seo/03-keyword-map.csv` (95 rows: keyword, cluster, intent, funnel stage, target URL, page exists, priority, validation status).

## P1 summary — every high-intent keyword maps to exactly one existing URL
| Keyword cluster | Target URL | Status |
|---|---|---|
| doorstep bike service Bangalore | /doorstep-bike-service | exists |
| bike service at home / two wheeler service at home / mechanic near me | /bike-service | exists |
| bike repair at home / near me | /bike-repair | exists |
| doorstep bike repair | /doorstep-bike-repair | exists |
| scooter service at home | /scooter-service | exists |
| emergency bike repair | /emergency-bike-repair | exists |
| bike breakdown assistance | /bike-breakdown-assistance | exists |
| bike battery / engine / brake / clutch / electrical | /battery-service · /engine-repair · /brake-service · /clutch-repair · /electrical-repair | exist |
| periodic bike service | /periodic-bike-service | exists |
| bike service cost / packages | /bikes | exists |
| EV two-wheeler service (near-term) | /bikes (EV section) | exists — dedicated /ev-two-wheeler-service planned Week 9 |
| **doorstep car service Bangalore** | **/cars** | exists (single page) |
| **car AC / battery / brakes / periodic / inspection (sub-services)** | **/car-ac-service, /car-battery-service, /car-brake-service, /car-periodic-service, /car-inspection** | **DO NOT EXIST — Part 3 build (weeks 5–7)** |
| local: bike service in Whitefield / HSR / Electronic City / Koramangala | /{service}/{area} pages | exist |

## Car cluster development (closes the bike-vs-car gap)
Part 1 finding: 132 bike URLs vs 1 car page. This plan brings the car vertical to parity at the intent level:
- Week 5: `/car-periodic-service`, `/car-inspection` (P1, "pre purchase car inspection bangalore" is high-intent with no strong local competition)
- Week 6: `/car-ac-service` (covers "car ac repair at home" + "car ac gas refill cost bangalore")
- Week 7: `/car-battery-service`, `/car-brake-service`
- Week 8+: `/car-breakdown-assistance` (P2); car brand pages (P3) deferred until Q4 answered and sub-services are indexed.
- Car locality pages are added to the sitemap once the car sub-service pages exist (they reuse the same `$service.$area` renderer, so `/car-ac-service/hsr-layout` etc. become available without new templates).

## Cannibalisation check — competing pairs, winner, and fix for the loser
| Keyword | Competing URLs | Winner | Differentiate the loser |
|---|---|---|---|
| "doorstep bike service bangalore" | /doorstep-bike-service vs /bike-service | **/doorstep-bike-service** (exact match) | /bike-service re-angles to "bike service at home Bangalore" + near-me + general packages/cost (title/H1/intro wording), links to the doorstep page as the flagship for "doorstep". |
| "doorstep bike repair bangalore" | /doorstep-bike-repair vs /bike-repair | **/doorstep-bike-repair** | /bike-repair owns "bike repair near me / at home" (diagnosis-led copy), no doorstep-title overlap. |
| "bike service cost bangalore" | /bikes vs /periodic-bike-service vs /bike-service | **/bikes** (holds full price table) | /periodic-bike-service describes scope/inclusions without repeating the CC price table; /bike-service links to /bikes for pricing. |
| "electric scooter service bangalore" | /bikes vs /scooter-service | **/bikes** until Week 9, then **/ev-two-wheeler-service** | /scooter-service stays petrol-scooter-focused and links to the EV page for electric; EV keywords move off /bikes at Week 9 to avoid a third cannibaliser. |
| "scooter service at home bangalore" | /scooter-service vs /doorstep-bike-service | **/scooter-service** | /doorstep-bike-service copy says "motorcycles and scooters" once but never targets "scooter service" in title/H1/H2s. |
| "pre purchase car inspection bangalore" | (planned) /car-inspection vs /cars | **/car-inspection** | /cars mentions inspection as a bullet only, links to the dedicated page. |
| "car ac gas refill cost bangalore" | (planned) /car-ac-service vs /cars | **/car-ac-service** | /cars keeps AC as one bullet with a link; price talk lives on the sub-page. |
| "emergency bike repair near me" vs "bike breakdown assistance bangalore" | /emergency-bike-repair vs /bike-breakdown-assistance | both kept: emergency = "my bike broke down right now" (repair focus), breakdown = towing/roadside/assistance focus. Cross-link, no title overlap. |
| "ride n care bangalore" | / vs /about | **/about** | Homepage keeps brand in title suffix only. |

## Target site structure (all existing URLs preserved)
```
/  (home — brand + both verticals)
├── Bike
│   ├── /bikes                        hub: packages, CC price table, EV section, brands
│   ├── /bike-service                 "bike service at home / near me"
│   ├── /doorstep-bike-service        flagship doorstep page
│   ├── /bike-repair                  repair hub ("near me")
│   ├── /doorstep-bike-repair
│   ├── /periodic-bike-service
│   ├── /motorcycle-service
│   ├── /scooter-service              (petrol scooters; links to EV page)
│   ├── /emergency-bike-repair
│   ├── /bike-breakdown-assistance
│   ├── /engine-repair  /brake-service  /clutch-repair  /battery-service
│   ├── /electrical-repair  /general-two-wheeler-repair
│   ├── /{service}/{area}  (6 local services × 12 priority areas = 72 pages)
│   ├── /ev-two-wheeler-service       (NEW, Week 9)
│   └── /royal-enfield-service  /ktm-service  /jawa-yezdi-service       (NEW, Week 10, P2)
│       /honda-two-wheeler-service (Activa, Week 10, P2)               (NEW, Week 10)
│       /ather-service  /ola-electric-service                          (NEW, Week 11, P2)
├── Car
│   ├── /cars                          hub (single page today)
│   ├── /car-periodic-service          (NEW, Week 5, P1)
│   ├── /car-inspection                (NEW, Week 5, P1 — pre-purchase)
│   ├── /car-ac-service                (NEW, Week 6, P1)
│   ├── /car-battery-service           (NEW, Week 7, P1)
│   ├── /car-brake-service             (NEW, Week 7, P1)
│   ├── /car-breakdown-assistance      (NEW, Week 8, P2)
│   ├── /car-denting-painting          (BLOCKED on owner Q8 — do not build until answered)
│   ├── /{car-service}/{area}          (unlocks automatically once sub-services exist; add to sitemap then)
│   └── /maruti-service /hyundai-service /tata-service … (P3, only after Q4 confirmed + sub-services indexed)
├── Areas
│   ├── /areas                         index (40 localities, zone-grouped)
│   └── /areas/{slug}                  40 pages
├── Guides  /guides + /guides/{slug}   (7 exist; car guides via /blog)
├── Blog     /blog + /blog/{slug}      (comparison + informational cluster)
├── Answers  /answers                  (AEO/GEO)
├── FAQ /faq  Map /map  About /about  Contact /contact  Franchise /franchise
├── /privacy /terms                    (Part 2)
└── noindex: /track-booking /auth      robots-disallowed: /track-booking /auth /api/
```

## Area page quality bar (applies to /areas/{slug} and /{service}/{area})
Minimum unique content per page (no templated filler):
- 250+ words unique to that area: landmark references, parking/gating realities, typical vehicle mix, one locally true observation.
- Data points: area name + zone, pincode (from areas.ts), 3–5 nearby localities (from areas.ts `nearby`), response expectation phrased honestly ("mechanic assigned from the nearest unit"; NO "30 minutes" claim until Q6 answered).
- Required modules: breadcrumb, 3 top services (linked), 3–5 nearby areas (linked), one FAQ set unique to the page, booking CTA (Book Now + call 080 6940 9289 + WhatsApp 82969 50339).
- Banned: duplicated intro sentences across pages with only the area name swapped; unverified counts ("12,000+ customers", "4.8★"); same-day/30-minute claims (Q5/Q6); invented reviews; doorway patterns (page exists only to redirect link equity).

## Brand page quality bar (applies to future /royal-enfield-service, /ktm-service etc.)
- 300+ words unique to the brand: models commonly serviced in Bangalore (from the verified catalog in the booking flow only — never guess), CC-based package applicability, brand-specific wear patterns written generically and honestly.
- Required data points: brand name + models list (verified), package prices from the central pricing config (CC tiers), call + WhatsApp CTAs, link up to /bikes and across to 2 sibling brand pages, one brand-specific FAQ set.
- Banned: copied manufacturer marketing text; unverified "authorised" or "specialist" claims; inventing service intervals; prices outside the central config.
- Gate: only build a brand page for brands on the owner's confirmed list; EV brand pages (Ather, Ola Electric) additionally require Q4 confirmation of EV brand coverage.

## Validation plan
- Every row in 03-keyword-map.csv carries "TO VALIDATE in Search Console / Keyword Planner".
- From Week 5: check GSC every Monday — promote keywords with impressions but rank >20 to P1; demote P1s with zero impressions after 4 weeks.
- Add Keyword Planner volume checks only when the owner supplies an account (owner question to add at next review).
