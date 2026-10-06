# Bangalore P0 Area Guide — Implementation Plan (PLANNING ONLY — NOT IMPLEMENTED)

**Site:** https://ridencare.co.in (Ride N Care — doorstep bike service & repair, Bangalore)
**Date:** 2026-10-05
**Stage:** P0 implementation planning — **no code, content, route, metadata, schema, sitemap, robots, navigation, DB, GBP, Cloudflare or GitHub Actions change was made.**
**Primary audit reference:** `docs/seo/bangalore-area-detailed-guide-gap-audit-2026-10-05.md`
**Git HEAD (before):** `d96238573ec7a7580277b80824c119b9f0a28c23` (`d962385`)

---

## 1. Executive summary

**Scope:** exactly six P0 areas — KR Puram, Mahadevapura, Madiwala, Banashankari, MG Road (CREATE DETAILED GUIDE) and Hebbal (IMPROVE EXISTING GUIDE). No P1/P2 areas, no new area pages beyond these.

**Headline finding from independent repo inspection:** the existing architecture **fully supports all six pages with zero route changes**. Every one of the six URLs already exists, returns HTTP 200, is self-canonical, and renders through the single dynamic route `src/routes/areas.$slug.tsx`. Promoting an area from "thin noindex page" to "indexable detailed guide" is a **data-only operation**:

1. Add an entry to `AREA_CONTENT` in `src/lib/area-content.ts` (unique intro + how paragraphs + FAQs).
2. Set `tier: "priority"` on the area's record in `src/lib/areas.ts`.
3. Append the slug to `PRIORITY_AREA_SLUGS` in `src/lib/areas.ts`.

Everything downstream follows automatically: robots `noindex` is removed (`areaRobots` → `isAreaIndexed`), the sitemap gains the area page (`AREAS.filter(isAreaIndexed)`) **and** its 7 bike service×area pages (`PRIORITY_AREAS` flatMap), the `/areas` hub badge appears, contact/cars/coverage-answer chips include it, and the hub counter reads 12 → 17.

**Critical implementation detail (split-brain risk):** indexability is driven by the `tier` field, but the hub badge, contact/cars chips, coverage-answer links, and the **service×area sitemap entries** are driven by the separate hard-coded `PRIORITY_AREA_SLUGS` array. **Both must be updated together** or the site lands in an inconsistent half-promoted state (area page indexable but its service pages noindex, no badge, missing from parts of the linking layer).

**Sequencing recommendation:** the requested order is endorsed — Phase P0-A = Hebbal improvement + KR Puram + Mahadevapura, validate, Phase P0-B = Madiwala + Banashankari + MG Road (§16). One hard publish-order gate: the approved-but-undeployed ₹299 visiting-charge changes should reach production **before** any P0 page goes live, because every P0 page will state the ₹299 fact (§9, §15).

**Scores (from the audit):** KR Puram 72 · Mahadevapura 67 · Madiwala 64 · Banashankari 64 · MG Road 63 · Hebbal 62.

---

## 2. Current architecture (verified, not assumed)

### 2.1 Route & rendering

- **Single dynamic route:** `src/routes/areas.$slug.tsx` (`createFileRoute("/areas/$slug")`).
  - `loader`: resolves `getArea(slug)` from `src/lib/areas.ts`; unknown slug → `notFound()` → 404 component.
  - `head`: builds title/description **from a fixed template** parameterised only by `name` and `zone` (no per-area meta override field exists — verified); `robots` from `areaRobots(a)`; canonical from `pageHead({path})` (self-referencing); JSON-LD via `pageScripts(graphForPage([...]))`.
  - `component`: renders answer-first intro → CTAs (Call / WhatsApp / Book Now) → services grid (7 bike `LOCAL_SERVICE_SUMMARY` links + car links) → "How doorstep service works" paragraphs → landmark chips → related answers → nearby chips → FAQ section → CTA banner → same-zone chips.
  - The **only free-text content slots** are: `AREA_CONTENT[slug].intro` (string), `.how` (string[]), `.faqs` ([q,a][]). Everything else is template.
- **Hub:** `src/routes/areas.index.tsx` — zone sections, search, "Detailed guide" badge driven by `PRIORITY_AREAS`, live counter "…N of them with fully detailed guides".
- **Service×area route:** `src/routes/$service.$area.tsx` — for bike services any of the 40 areas renders; robots from `areaRobots(a)`; car pairs gated by `CAR_AREA_WAVE_1`.

### 2.2 Data & indexability logic (`src/lib/areas.ts`)

```ts
export const isAreaIndexed = (a) => Boolean(a && isConfirmedArea(a) && a.tier === "priority");
export const areaRobots   = (a) => (isAreaIndexed(a) ? undefined : "noindex, follow");
export const PRIORITY_AREA_SLUGS = [ /* hard-coded 12 slugs */ ] as const;
export const PRIORITY_AREAS = PRIORITY_AREA_SLUGS.map(...);   // separate list!
```

- All 40 areas are `confirmed: true` (owner answered Q33), so **tier is the only indexability switch**.
- Current state: 12 priority (indexable) / 28 basic (`noindex, follow`).

### 2.3 Who consumes what (touchpoint matrix)

| Consumer | Driven by | Effect when an area is promoted |
|---|---|---|
| `areas.$slug.tsx` robots meta | `tier` (via `areaRobots`) | `noindex,follow` removed |
| Sitemap area entries (`AREAS.filter(isAreaIndexed)`) | `tier` | `/areas/{slug}` added |
| Sitemap service×area entries (`PRIORITY_AREAS` × 7 local services) | **`PRIORITY_AREA_SLUGS`** | 7 `/{svc}/{slug}` URLs added |
| Hub "Detailed guide" badge + hub counter (`areas.index.tsx`) | **`PRIORITY_AREA_SLUGS`** | badge appears, 12 → 17 |
| Coverage-answer links (`answers.$slug.tsx:159`) | **`PRIORITY_AREA_SLUGS`** | +1 link per promoted area on 3 pages |
| `/cars` chips (`cars.tsx`) | **`PRIORITY_AREA_SLUGS`** | chips appear |
| `/contact` chips (`contact.tsx:113`) | `tier` **but `.slice(0, 12)`** | silent 12-item cap — see §14 |
| `$service.$area.tsx` robots | `tier` | 7 service pages per area become indexable |
| Org `areaServed` schema | `CONFIRMED_AREAS` (all 40) | **no change** — already included |
| `hyd-*` files | separate Hyderabad data | untouched |

### 2.4 Schema, FAQ, pricing, warranty, booking, contact (sources of truth)

- **Schema (per page, emitted by `areas.$slug.tsx` head):** `Service` (name/desc/`areaServed` Place + pincode), `BreadcrumbList`, `FAQPage` (mirrors the visible FAQ array — `faqNode` comment: "from pairs that are visible on the page"), `ItemList` (nearby), inside a plain `@graph` wrapper (`graphForPage`). **No `WebPage` node exists today** (verified in production JSON-LD and `schema.ts`) — do not add one. Sitewide `Organization`/`LocalBusiness(AutoRepair)`/`WebSite` graph is on every page with `areaServed` = Bengaluru + all 40 Places.
- **Pricing source of truth:** `src/lib/pricing.ts` → `export const VISITING_CHARGE = 299;` (line 9) with owner-decision comment (4 Oct 2026): *"₹299 in BOTH Bangalore and Hyderabad, separate from every service/package price. Never imply it is included in a service price; always disclose it in the written quote."* Package prices (`GENERAL_SERVICE` tiers, `BikePackage[]`) also live here — **never hardcode prices in content files**.
- **Warranty source of truth:** `/guarantee` route (`src/routes/guarantee.tsx`) — "45-day service warranty", coverage = workmanship on eligible service/repair work, parts covered only where applicable subject to eligibility/manufacturer terms, exclusions listed, claim via booking/invoice details. The short phrase "45-day service warranty" is used consistently across `src/lib/*`.
- **Booking flow:** `src/components/booking/BookingButton.tsx` → `BookingProvider.openBooking()` modal (no separate booking URL). Page CTAs: `tel:+918069409289`, `wa.me/918296950339`, Book Now button.
- **Contact info:** phone 080 6940 9289 · WhatsApp 82969 50339.
- **Existing quality bar (docs/seo/03-keyword-url-map.md:95–98):** 250+ words unique per area page; required modules = breadcrumb, top services linked, 3–5 nearby areas linked, one FAQ set unique to the page, booking CTA. Uniqueness gate: `scripts/check-area-uniqueness.py` (4-gram Jaccard, flag >60%, thin <300 words).

---

## 3. Six P0 area assessments (live-verified 2026-10-05)

| Area | Exact URL | HTTP | Current indexability | Canonical | In sitemap | Data object exists? | Upgradeable via existing architecture? |
|---|---|---|---|---|---|---|---|
| KR Puram | `/areas/kr-puram` | 200 | `noindex, follow` | self | No | Yes — `areas.ts` (East, 560036, 4 landmarks, nearby: Mahadevapura/Kalyan Nagar/Whitefield); **no** `AREA_CONTENT` entry | **Yes — data-only** (tier + slug list + content entry) |
| Mahadevapura | `/areas/mahadevapura` | 200 | `noindex, follow` | self | No | Yes — `areas.ts` (East, 560048, 3 landmarks, 5 nearby); no content entry | **Yes — data-only** |
| Madiwala | `/areas/madiwala` | 200 | `noindex, follow` | self | No | Yes — `areas.ts` (South, 560068, 4 landmarks, 5 nearby); no content entry | **Yes — data-only** |
| Banashankari | `/areas/banashankari` | 200 | `noindex, follow` | self | No | Yes — `areas.ts` (South, 560070, 3 landmarks, 3 nearby); no content entry | **Yes — data-only** |
| MG Road | `/areas/mg-road` | 200 | `noindex, follow` | self | No | Yes — `areas.ts` (Central, 560001, 4 landmarks, 3 nearby); no content entry | **Yes — data-only** |
| Hebbal | `/areas/hebbal` | 200 | **indexable** (no robots meta) | self | **Yes** | Yes — `areas.ts` (North, 560024) **and** `area-content.ts:217` (existing guide, 197 unique words) | **Improvement in place** — edit `AREA_CONTENT.hebbal` only; indexability unchanged |

No URL needs creating, renaming or redirecting. All six already emit self-referencing canonicals; all six are already in the org-level `areaServed` schema and in `/areas` hub + homepage marquee linking.

**Landmarks already in the data (eligible for use, all queued in OWNER-QUESTIONS Q34 — status OPEN):**
- KR Puram: KR Puram Railway Station · Tin Factory Junction · Old Madras Road · KR Puram Bridge
- Mahadevapura: Doddanekkundi · Varthur Road · Outer Ring Road (Mahadevapura stretch)
- Madiwala: Madiwala Checkpost · Madiwala Market · Silk Board Junction · St. John's Hospital
- Banashankari: Banashankari Temple · Kanakapura Road junction · Banashankari Metro Station
- MG Road: MG Road Metro Station · Trinity Junction · Brigade Road · Chinnaswamy Stadium
- Hebbal: Hebbal Flyover · Hebbal Lake · Manyata Tech Park · Esteem Mall

---

## 4. KR Puram — unique content blueprint

**Primary intent:** *bike & car doorstep service at the east gateway junction* — transport-hub navigation + residential arrival logistics. Distinct from every existing guide.

**Verified local context available (data-only):** railway station, Tin Factory Junction, Old Madras Road, KR Puram Bridge; nearby Mahadevapura, Kalyan Nagar, Whitefield; pincode 560036; East zone.

**Content slots (all inside existing `AREA_CONTENT["kr-puram"]`):**

- **`intro` (~50–60 words, answer-first):** Ride N Care brings bike and car service to KR Puram at your gate — bridge-side apartments, Old Madras Road layouts and side streets off the junction — with background-verified mechanics, written quote before work starts, OEM-grade parts, 45-day service warranty, and a ₹299 visiting charge disclosed separately in the written quote.
- **`how` (2 paragraphs, ~90–110 words total):**
  1. *Booking & arrival:* share your street, a landmark (station side / Tin Factory / bridge) and your gate; mechanic assigned from the nearest unit, arrival window confirmed when you book. Junction traffic means confirmed windows rather than minute-level promises (same honest pattern as JP Nagar/Bellandur copy).
  2. *Worksites:* bungalow driveways and apartment parking bays; one bay suffices for most jobs; jobs needing a hoist/paint booth go to the workshop with pickup arranged and a written estimate first.
- **`faqs` (6 planned — see §10):** local navigation Qs + the two business-fact Qs (visiting charge, warranty), all with visible text (FAQ schema mirrors automatically).

**Services represented (links render automatically from template):** Bike Service, Doorstep Bike Service, Bike Repair, Doorstep Bike Repair, Motorcycle Service, Scooter Service, Emergency Bike Repair — each as `/{svc}/kr-puram`; car links to top-level car hubs.

**₹299 visiting charge:** state exactly as `VISITING_CHARGE` semantics require — *"a ₹299 visiting charge applies separately from the package price and is disclosed in the written quote before work starts"* (mirror the wording already approved in `services.ts:168` and `hyd-area-content.ts:79`). Never "free visit".

**Warranty:** "45-day service warranty on eligible repairs, plus the manufacturer warranty on parts fitted" (consistent with `/guarantee`).

**Availability wording:** coverage owner-confirmed (Q33) → plain "we serve KR Puram" is permitted; arrival timing = "confirmed when you book" (no response-time promises).

**What makes it materially different from existing area pages:** it is the only guide built around a *railway-station + bridge junction arrival narrative* (landmark-anchored directions from three approaches: station side, Tin Factory, bridge), whereas Indiranagar owns the café-strip/residential framing, Whitefield the ITPL/gated framing, and Mahadevapura (§5) the ORR-stretch framing. Target: ≥250 unique words, <60% similarity to every indexable page per the uniqueness script.

---

## 5. Mahadevapura — unique content blueprint

**Primary intent:** *ORR tech-corridor + ward residential doorstep service* — the corridor between Whitefield and the KR Puram gateway.

**Verified local context:** Doddanekkundi, Varthur Road, ORR (Mahadevapura stretch); nearby KR Puram, Whitefield, Marathahalli, Brookefield, Kadubeesanahalli; pincode 560048; East zone; 4 existing inbound nearby-chip links.

**Content slots:**

- **`intro`:** answer-first statement that service reaches Mahadevapura ward homes and ORR-side offices — written quote first, OEM-grade parts, 45-day warranty, ₹299 visiting charge separate in the quote.
- **`how` (2 paras):**
  1. *Corridor reality:* ORR stretch traffic — arrival window confirmed at booking; landmark-led navigation (Doddanekkundi side, Varthur Road cross streets, ORR stretch) so the mechanic finds the gate without phone tag.
  2. *Mixed worksites:* residential parking bays at home + office-parking visits on the ORR side with the building's permission (same permission-based wording already used in Whitefield/Bellandur copy — consistent, not invented).
- **`faqs` (6):** corridor-specific Qs (office parking on ORR side? which landmarks to give? is Brookefield/Varthur covered from here?) + visiting charge + warranty.

**Unique local intent (not a name-swap):** Mahadevapura's page = *ward + ORR-stretch offices*. Whitefield owns ITPL/Phoenix/Varthur Station identity; KR Puram owns station/bridge identity. Mahadevapura must **not** repeat ITPL or station copy; its landmarks (Doddanekkundi, ORR stretch) appear on no other indexable page.

**Nearby relationships (natural mentions only):** KR Puram and Whitefield as sibling guides (chip links, auto); Brookefield/Kadubeesanahalli remain grouped references (chips only — they stay noindex).

**Useful customer questions unique here:** office-parking near ORR; is Doddanekkundi covered; how to describe the location from Varthur Road side; does the same visit cover bike + car.

**Internal links:** automatic 7 service×area links + nearby chips + related answers (4, currently generic — §14).

---

## 6. Madiwala — unique content blueprint

**Primary intent:** *dense old-town market lanes + Checkpost junction doorstep service* — bike-repair-heavy, scooter-heavy locality between BTM, Koramangala and HSR.

**Verified local context:** Madiwala Checkpost, Madiwala Market, Silk Board Junction, St. John's Hospital; nearby BTM Layout, Koramangala, HSR Layout, Ejipura, Bommanahalli; pincode 560068; South zone; 7 inbound nearby-chip links (highest among P0 creates).

**Content slots:**

- **`intro`:** answer-first: doorstep bike & scooter service in Madiwala's market lanes and side streets — written quote, OEM-grade parts, 45-day warranty, ₹299 visiting charge disclosed in the quote.
- **`how` (2 paras):**
  1. *Lane navigation:* market-area lanes are narrow — share your cross street or the Checkpost/Market/St John's landmark; the mechanic walks the last stretch on foot where a van can't go (pattern already proven in Koramangala/BTM copy).
  2. *Worksites:* bikes serviced at the doorstep itself; car work needs a bay — basement/visitor slot with permission; St John's-side arrival windows confirmed at booking.
- **`faqs` (6):** lane-access Q, scooter emphasis (Madiwala is scooter-dense — fills the audit's "scooter" AEO gap with visible text), bike-repair-at-home Q, visiting charge, warranty, how to describe the address.

**Doorstep use cases to state:** chain/brake/clutch work and battery replacement at the doorstep; workshop jobs (engine rebuild, paint) with pickup + written estimate.

**Critical anti-duplication note (shared-landmark conflict):** BTM Layout's *existing indexable* guide already uses "Madiwala Checkpost" and "Silk Board Junction" as its landmark chips. The Madiwala guide must therefore lead with **Madiwala Market, the Checkpost as junction context, St. John's and the Madiwala lake side**, and treat Silk Board only as a boundary reference — the uniqueness script must show <60% similarity against BTM, Koramangala and HSR before promotion. If it can't, flag for owner review rather than shipping (§13).

---

## 7. Banashankari — unique content blueprint

**Primary intent:** *metro-connected family residential belt* — doorstep service around the temple/metro/junction triangle, south of JP Nagar.

**Verified local context:** Banashankari Temple, Kanakapura Road junction, Banashankari Metro Station; nearby JP Nagar, Jayanagar, Kanakapura Road; pincode 560070; South zone; 4 inbound nearby links.

**Content slots:**

- **`intro`:** answer-first coverage of Banashankari's stages — service at your gate with written quote first, 45-day warranty, ₹299 visiting charge separate in the quote.
- **`how` (2 paras):**
  1. *Navigation:* stage + temple/metro/junction landmark gives the mechanic an unambiguous pin; lane arrivals confirmed with a window at booking.
  2. *Worksites:* driveways and apartment parking bays; one bay + ideally a plug point; workshop-only jobs arranged with pickup and written estimate.
- **`faqs` (6):** which stages covered (answer must stay honest: "share your stage and a landmark; coverage confirmed at booking" — no blanket stage-by-stage claims not in the data); temple/metro-side arrival; Kanakapura Road junction traffic; scooter service; visiting charge; warranty.

**Genuine usefulness (not keyword substitution):** Banashankari is the anchor that lets Kanakapura Road stay grouped (P3) — its guide must absorb "Kanakapura Road corridor" questions naturally (the junction is already its landmark), while JP Nagar keeps phase-based copy and Jayanagar keeps block-based copy. Distinct framing: **stage/temple/metro triangle**, vs JP Nagar's Jayadeva-to-Bannerghatta phase framing.

**Service types to name (all verified existing):** periodic bike service, doorstepping repair, scooter service, motorcycle service, emergency repair, car periodic/AC/battery/brake (top-level car links).

**Booking:** Call 080 6940 9289 · WhatsApp 82969 50339 (pre-filled message auto-includes the area) · Book Now modal.

---

## 8. MG Road — unique content blueprint

**Primary intent:** *central commercial district — office-parking and workplace doorstep service* (distinct from every residential guide).

**Verified local context:** MG Road Metro Station, Trinity Junction, Brigade Road, Chinnaswamy Stadium; nearby Malleshwaram, Domlur, Indiranagar; pincode 560001; Central zone; 3 inbound nearby links.

**Explicit constraint honored:** **no branch, workshop, storefront, office, stationed mechanic or physical location on MG Road** may be implied. Only accurate service-area wording: *"Ride N Care serves MG Road — the mechanic comes to your location"* / *"we are a service-area business; there is no walk-in workshop"* (this exact framing already exists on `/contact`). Landmarks are navigation references only.

**Content slots:**

- **`intro`:** answer-first: doorstep bike (and car) service for MG Road offices and residences — mechanic comes to your parking bay; written quote first; OEM-grade parts; 45-day warranty on eligible repairs; ₹299 visiting charge disclosed separately in the written quote.
- **`how` (2 paras):**
  1. *Workplace coordination:* book with your building name, parking level and permission from building security (permission-based wording mirrors Whitefield/Bellandur/E-City office copy); arrival window confirmed when you book; metro-side landmarks (Metro Station, Trinity, Brigade Road) used only to describe location.
  2. *Worksites:* office basements/visitor bays need one free bay; residential driveways around the central area; busy-road parking means work happens in your bay, never on the road (pattern already in Indiranagar copy).
- **`faqs` (6):** Can you service at my office on MG Road? (yes with permission — one bay); Is there a walk-in counter? (**no — service-area business, doorstep only** — this actively prevents a branch misimpression); parking coordination; scooter service; visiting charge; warranty.

**Commercial vs local intent balance:** H1/title stay template ("Bike & Car Service in MG Road, Bangalore"); the *body* carries the office/weekday intent (the audit's §8 concern) so the page targets "bike service MG Road / office doorstep service" without cannibalising Indiranagar's residential café-strip intent (§12).

---

## 9. Hebbal — existing guide improvement plan (NO new URL, NO indexability change)

**Current state (verified):** `/areas/hebbal` → 200, **indexable** (no robots meta), self-canonical, in sitemap, hub badge present. Existing content at `src/lib/area-content.ts:217` — unique copy **197 words** (thinnest of the 12; the bar is 250–300), page total 742 words (smallest), grade **C** in the audit.

**Content gaps (specific):**
1. **Thin `how` block** — 2 short paragraphs; lacks the worksite detail its peers have (Manyata office-parking permission flow is mentioned only in a FAQ, not in the process narrative).
2. **FAQ gaps (AEO):** no scooter-service answer (audit Q4 gap); no visiting-charge answer; no explicit "bike repair at home" answer; the warranty FAQ answer is a sentence fragment from the shared `GUARANTEE` constant ("a 45-day service warranty on the job, plus the manufacturer warranty on parts." — starts lowercase, reads truncated).
3. **Weak local context:** Hebbal Flyover / Hebbal Lake / Manyata Tech Park / Esteem Mall exist as chips only; the guide doesn't explain *arrival geography* (north-side unit assignment, flyover-traffic windows) as concretely as JP Nagar's phase copy.
4. **Missing customer answers:** "Is Yelahanka covered?" currently answers generically — acceptable, keep; but "Which jobs can't be done at the doorstep?" (present on Indiranagar/E-City) is absent; "parking at Manyata" deserves its own visible Q.
5. **Internal links:** only template links (7 service×area + nearby chips + 4 related answers). No contextual link differentiation from peers (template-wide limitation — see §14 deferred items).
6. **Title/meta/H1:** all correct and unique (`Bike & Car Service in Hebbal, Bangalore | Ride N Care`; zone renders "North Bangalore") — **no title/meta issue**.
7. **Schema:** correct — Service + Breadcrumb + FAQPage mirroring visible FAQs; **no schema issue**; FAQPage simply grows with the new visible FAQs.
8. **CTA:** complete (Call/WhatsApp/Book Now) — **no CTA issue**.
9. **AEO weakness:** Hebbal is the *only* indexable North guide — it must carry the North coverage answer set (visiting charge, scooter, repair-at-home, warranty) because no sibling North guide exists.
10. **GEO weakness:** north-corridor relationship text is generic; should tie Manyata ↔ flyover ↔ Yelahanka/Kalyan Nagar (chip) references into one coherent "north Bangalore" narrative.
11. **Duplication risk:** improving Hebbal moves it *away* from the template (safer). Must not absorb Yeshwanthpur (west) or Kalyan Nagar (P1) content — keep those as chip references only.

**Improvement = rewrite `AREA_CONTENT.hebbal` to ~300+ unique words** across intro/how/faqs with the additions above. **Not padding**: every added sentence must carry a fact (Manyata permission flow, north-unit arrival, landmark-based navigation, scooter/repair/visiting-charge answers). Re-run the uniqueness script; Hebbal must remain in the zero-flagged-pairs set.

---

## 10. SEO metadata plan (titles / metas / H1 / H2)

**Constraint honored:** there is **no per-area meta override field** in the existing architecture, and this plan does **not** propose route changes. Titles/descriptions/H1 below are the **exact strings the existing template will emit** for each area — they are unique per page (locality name differs), compliant with the constraints (no "best", "No. 1", "fastest", "guaranteed", no fabricated superiority, no "near me" stuffing), and each page's *distinct intent* is delivered by its intro/H2 bodies and FAQ sets (§4–§9), not by keyword-varied titles.

| Area | Title tag (template-generated) | Meta description (template-generated) | H1 | Distinct primary intent |
|---|---|---|---|---|
| KR Puram | `Bike & Car Service in KR Puram, Bangalore \| Ride N Care` | `Bike & car service at your gate in KR Puram, East Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in KR Puram, Bangalore` | Junction/station gateway navigation |
| Mahadevapura | `Bike & Car Service in Mahadevapura, Bangalore \| Ride N Care` | `Bike & car service at your gate in Mahadevapura, East Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in Mahadevapura, Bangalore` | ORR tech corridor + ward homes |
| Madiwala | `Bike & Car Service in Madiwala, Bangalore \| Ride N Care` | `Bike & car service at your gate in Madiwala, South Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in Madiwala, Bangalore` | Market-lane + Checkpost dense-lane service |
| Banashankari | `Bike & Car Service in Banashankari, Bangalore \| Ride N Care` | `Bike & car service at your gate in Banashankari, South Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in Banashankari, Bangalore` | Metro/temple residential belt |
| MG Road | `Bike & Car Service in MG Road, Bangalore \| Ride N Care` | `Bike & car service at your gate in MG Road, Central Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in MG Road, Bangalore` | Central office/commercial doorstep |
| Hebbal | `Bike & Car Service in Hebbal, Bangalore \| Ride N Care` | `Bike & car service at your gate in Hebbal, North Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.` | `Bike & Car Service in Hebbal, Bangalore` | North gateway + Manyata (existing) |

*(Known template trait, unchanged by this plan: descriptions run ~190 chars and may truncate in SERPs. Improving description length would require a route/data change → deferred, out of P0 scope.)*

**Proposed H2 structure = the existing template structure (unchanged, zero route change):**

1. `Services at your gate in {Area}` (H2) — 7 bike service links + car links
2. `How doorstep service works in {Area}` (H2) — the unique `how` paragraphs
3. `Getting to you in {Area}` (H2) — landmark chips (geographic context only)
4. `Related answers for {Area} customers` (H2)
5. `Nearby areas we serve` (H2) — chips
6. `{Area} FAQs` (H2) — unique FAQ set
7. CTA banner: `Book a doorstep slot in {Area}` (H2)
8. `More {Zone} Bangalore areas` (H2)

One H1 per page (template) — verified pattern on all live area pages.

---

## 11. AEO plan (5–8 questions per area)

Policy: business-fact answers are **consistent** across areas (same wording from the same source of truth); local Q&As make each set distinct. Each planned question below should appear **visibly** on its page; **FAQ schema is appropriate for every entry listed "visible = yes"** because the template's `faqNode` mirrors the visible array — schema must never include anything not rendered. Recommend **6 rendered FAQs per P0 page** (array supports any length; current priority pages render 5).

### KR Puram
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Do you provide doorstep bike service in KR Puram? | Yes — station side, Old Madras Road layouts and bridge-side streets; share street + landmark; window confirmed at booking | Yes | Yes |
| 2 | Can I get bike repair at home in KR Puram? | Yes — free diagnosis, most repairs at the parking spot; engine/paint jobs to workshop with pickup + written estimate | Yes | Yes |
| 3 | What is the visiting charge? | A ₹299 visiting charge applies separately from the package price and is disclosed in your written quote before work starts (consistent wording) | Yes | Yes |
| 4 | Which landmark should I give when booking? | Station side / Tin Factory Junction / KR Puram Bridge — any one pins the arrival | Yes | Yes |
| 5 | Is scooter service available in KR Puram? | Yes — periodic service, brakes, battery for scooters and motorcycles | Yes | Yes |
| 6 | What warranty applies? | 45-day service warranty on eligible repairs + manufacturer warranty on parts fitted (per /guarantee) | Yes | Yes |

### Mahadevapura
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Do you serve homes and offices in Mahadevapura? | Yes — ward homes and ORR-side offices (office parking with building permission) | Yes | Yes |
| 2 | Is Doddanekkundi covered? | Yes — Doddanekkundi, Varthur Road side and the ORR stretch are served; share a cross-street landmark | Yes | Yes |
| 3 | What is the visiting charge? | ₹299, separate from package price, in the written quote | Yes | Yes |
| 4 | How do you find my gate in the corridor traffic? | Arrival window confirmed when you book; landmark-led navigation; last stretch on foot if needed | Yes | Yes |
| 5 | Can one visit cover my bike and car? | Yes — book both; visit planned for it (consistent with Indiranagar FAQ fact) | Yes | Yes |
| 6 | What warranty applies to repairs? | 45-day service warranty on eligible repairs + parts warranty | Yes | Yes |

### Madiwala
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Can you reach the lanes around Madiwala Market? | Yes — share your cross street or Checkpost/Market/St John's landmark; mechanic walks in where a van can't | Yes | Yes |
| 2 | Do you service scooters in Madiwala? | Yes — scooter-heavy area; CVT/brakes/battery handled at the doorstep | Yes | Yes |
| 3 | Can I get bike repair at home here? | Yes — free diagnosis at your spot; workshop-only jobs arranged with pickup + estimate | Yes | Yes |
| 4 | What is the visiting charge? | ₹299, separate, disclosed in the written quote | Yes | Yes |
| 5 | Where does the mechanic work if I park on the street? | In your building's bay/assigned spot — not on the carriageway (consistent with BTM/Indiranagar wording) | Yes | Yes |
| 6 | What warranty applies? | 45-day service warranty on eligible repairs + parts warranty | Yes | Yes |

### Banashankari
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Which parts of Banashankari do you cover? | Share your stage + a landmark (temple / metro / Kanakapura Road junction); coverage and window confirmed at booking — no unverified stage-by-stage claims | Yes | Yes |
| 2 | Is doorstep bike service available near Banashankari Metro? | Yes — metro-side lanes included; give the station side as your landmark | Yes | Yes |
| 3 | What is the visiting charge? | ₹299, separate from package price, in the written quote | Yes | Yes |
| 4 | Is scooter service available? | Yes — periodic service, brakes, battery for scooters and motorcycles | Yes | Yes |
| 5 | What does a regular bike service include? | Oil/filters, brakes, chain, clutch/cables, battery/electrical checks, dry wash + multi-point report (consistent with service page) | Yes | Yes |
| 6 | What warranty applies? | 45-day service warranty on eligible repairs + parts warranty | Yes | Yes |

### MG Road
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Can you service my bike at my office on MG Road? | Yes, with building permission — one parking bay; give building name + level | Yes | Yes |
| 2 | Is there a walk-in counter on MG Road? | **No** — Ride N Care is a service-area business with no walk-in workshop; the mechanic comes to your location | Yes | Yes |
| 3 | What is the visiting charge? | ₹299, separate, disclosed in the written quote | Yes | Yes |
| 4 | Where does the work happen if parking is tight? | In your building's basement/visitor bay, never on the road (consistent with Indiranagar wording) | Yes | Yes |
| 5 | Do you service scooters and motorcycles on MG Road? | Yes — both, plus car periodic/AC/battery/brake work at your bay | Yes | Yes |
| 6 | What warranty applies? | 45-day service warranty on eligible repairs + parts warranty | Yes | Yes |

### Hebbal (improvement — revised set)
| # | Question | Answer intent | Visible | FAQ schema |
|---|---|---|---|---|
| 1 | Do you cover Manyata Tech Park side? | Yes — office parking with permission, one bay; home visits across Hebbal's blocks (keep, existing) | Yes | Yes |
| 2 | **NEW** Can you park and work at my Manyata office? | Permission-based; booking reference forwarded to security (align with Whitefield office wording) | Yes | Yes |
| 3 | **NEW** Is scooter service available in Hebbal? | Yes — scooters and motorcycles both | Yes | Yes |
| 4 | **NEW** Can I get bike repair at home in Hebbal? | Yes — free diagnosis at your doorstep; workshop jobs with pickup + estimate | Yes | Yes |
| 5 | **NEW** What is the visiting charge? | ₹299, separate from package price, in the written quote | Yes | Yes |
| 6 | What's your guarantee? | **Rewrite:** "A 45-day service warranty on eligible repairs, plus the manufacturer warranty on parts fitted." (fixes the sentence-fragment defect) | Yes | Yes |
| 7 | Is Yelahanka included? | Keep existing honest answer (nearby + covered; book with street and landmark) | Yes | Yes |
| 8 | How is the price confirmed? | Keep existing (in writing on WhatsApp before work starts) | Yes | Yes |

*(Hebbal renders 8 FAQs — allowed by the array-based template; FAQPage mirrors visible.)*

---

## 12. GEO / AI search plan (per area)

Signals present on every P0 page (all verified/safe): zone + pincode · self-describing locality relationship in intro · landmark chips (navigation context only) · nearby-area chips (from `nearby` data — verified resolvable) · service-type list · process facts (written quote, OEM-grade parts, 45-day warranty, ₹299 visiting charge, arrival window confirmed at booking) · links to commercial pages · org-level `areaServed` already includes all 40 Places · `llms.txt` already states 40-locality coverage · AI crawlers allowed in robots.txt.

| Area | Verified geographic signals to feature | Candidate references NOT in repo data |
|---|---|---|
| KR Puram | Station · Tin Factory Junction · Old Madras Road · Bridge; siblings Mahadevapura/Kalyan Nagar/Whitefield | Vignana Nagar, Devasandra, Bendre Halli — **OWNER VERIFICATION REQUIRED** (do not add) |
| Mahadevapura | Doddanekkundi · Varthur Road · ORR stretch; siblings KR Puram/Whitefield/Marathahalli | Arvind Castle area, Hanumanthnagar — **OWNER VERIFICATION REQUIRED** |
| Madiwala | Market · Checkpost · St John's · Silk Board (boundary context); siblings BTM/Koramangala/HSR/Ejipura/Bommanahalli | Madiwala Lake status wording, Hongasandra — **OWNER VERIFICATION REQUIRED** |
| Banashankari | Temple · Metro Station · Kanakapura Road junction; siblings JP Nagar/Jayanagar/Kanakapura Road | BDA layout stage names beyond generic "stages", ISKCON (near but not its landmark) — **OWNER VERIFICATION REQUIRED** |
| MG Road | Metro Station · Trinity Junction · Brigade Road · Chinnaswamy Stadium; siblings Malleshwaram/Domlur/Indiranagar | Any "Ride N Care at/near MG Road" physical-presence phrasing — **PROHIBITED** (service-area wording only) |
| Hebbal | Flyover · Lake · Manyata Tech Park · Esteem Mall; siblings Yelahanka/Kalyan Nagar/KR Puram/Yeshwanthpur | Airport-corridor drive-time claims — **OWNER VERIFICATION REQUIRED** (no response/drive-time promises) |

**Rules:** no new landmarks beyond `areas.ts` without owner sign-off; no branches/workshops/mechanics stationed anywhere; landmarks never phrased as partnerships; no response-time or drive-time claims; "nearest unit" dispatch phrasing already flagged in the audit for owner verification — P0 copy may reuse it only in its existing neutral form.

---

## 13. Pricing & warranty consistency

- **Visiting charge = ₹299.** Source of truth: `src/lib/pricing.ts` → `VISITING_CHARGE` (owner decision 4 Oct 2026). **P0 content should interpolate `VISITING_CHARGE`** (e.g. `` `A ₹${VISITING_CHARGE} visiting charge...` ``) exactly as `src/lib/hyd-area-content.ts:79` and `src/lib/services.ts:168` already do — **never hardcode the number** in content strings, and never write a second conflicting figure.
- **Prohibited phrasings (all six pages):** "free visit", "free doorstep visit", "no visiting charge", "no inspection fee", "no doorstep charge". The one verified exception: *free diagnosis at your doorstep* is an established fact on `/bike-repair` ("Diagnosis at your doorstep is free") — if used, it must be explicitly distinguished: "diagnosis is free; the ₹299 visiting charge applies separately to the visit."
- **Warranty = "45-day service warranty on eligible repairs"** with `/guarantee` semantics (workmanship on eligible work; parts per eligibility/manufacturer terms; exclusions apply). Do not upgrade to "warranty on everything".
- **Package prices:** if any P0 text shows a price (not required — Jayanagar's existing FAQ pattern defers to `/bikes`), reference the `/bikes` page or import from `pricing.ts`. **No new prices invented.**
- **Deploy-order gate:** these facts (₹299 wording) exist in the approved working tree (`pricing.ts`, `services.ts`, `answer-pages.ts` are modified; `hyd-*` untracked) but **are not live** (verified today: no "visiting charge"/"₹299" on production `/faq`, `/pricing`, `/bikes`, `/doorstep-bike-service`, cost answers). **Deploy the approved pending changes before publishing P0 pages**, so the site's own answer pages corroborate what the new guides claim. (Deployment is an owner/stage action — nothing deployed here.)

---

## 14. Internal linking plan

**Automatic (no code change) once promoted:**
- **Outbound from each P0 page:** 7 bike service×area links (`/bike-service/{slug}`, `/doorstep-bike-service/{slug}`, `/bike-repair/{slug}`, `/doorstep-bike-repair/{slug}`, `/motorcycle-service/{slug}`, `/scooter-service/{slug}`, `/emergency-bike-repair/{slug}`) + car hub links + 5 nearby chips + same-zone chips + 4 related answers + breadcrumb links.
- **Inbound to each P0 page:** `/areas` hub card (+ new badge) · homepage marquee · all 7 of its service×area footers ("every service available in {Area}") · `/cars` chips · `/contact` chips (⚠️ see cap below) · 3 coverage-answer pages · neighbour `nearby` chips (already in data: KR Puram ← Mahadevapura/Kalyan Nagar/Hebbal; Mahadevapura ← KR Puram/Whitefield/Kadubeesanahalli; Madiwala ← 7 neighbours; Banashankari ← JP Nagar/Jayanagar/Bannerghatta Rd; MG Road ← Rajajinagar/Malleshwaram/Domlur).

**Anchor-text policy:** keep the existing natural patterns ("📍 {Name}", "Doorstep bike & car service in {Area} — detailed area guide" on hub). **No** sitewide exact-match anchors, no repeated "bike service in {area}" anchor across pages, no "near me" anchors.

**⚠️ `/contact` cap:** `contact.tsx:113` filters `tier === "priority"` then **`.slice(0, 12)`** — with 17 priority areas the list would show only the first 12 in data order, silently dropping Electronic City, Hebbal, Madiwala, Banashankari and MG Road. **File must change (low risk):** raise/remove the cap (recommend: show all priority, or a curated fixed list).

**Related answers (template-wide):** each P0 page renders the same 4 answers today (`answersForArea` ignores its area argument — §15). Acceptable for P0 ship; localization is the separate task.

**Deferred (requires route change — explicitly NOT in P0):** contextual links from area pages to `/pricing`, `/guarantee`, `/faq`, and top-level service hubs inside FAQ/CTA copy. Note: `03-keyword-url-map.md` required module "3 top services (linked)" is already satisfied by the services grid.

**Blog chips:** `blog.$slug.tsx` uses static `AREAS.slice(0,6)` — P0 areas won't appear on posts until that separate task runs; not a P0 blocker (the six already get every other inbound source).

---

## 15. Related Answers issue (report only — DO NOT FIX in this stage)

- **Responsible file/component:** `src/lib/answer-page-summary.ts` → `answersForArea(areaName, limit = 4)` (**lines 112–128**). Consumed by `src/routes/areas.$slug.tsx` (import line 6, call line 189: `answersForArea(a.name)`).
- **Why the argument is ignored:** the function body never references `areaName`. It flattens fixed categories `["coverage","cost","time","trust","care"]`, takes the first 4 unseen entries in that order, then unshifts `areas-covered`. Result: **identical 4 links on all 40 pages** under a localized heading ("Related answers for {Area} customers").
- **Duplicate implementation:** `src/lib/answer-pages.ts` lines 1101–1121 contains a second `answersForArea(areaName, limit)` with identical logic over `ANSWER_PAGES`. A fix must update **both copies** (or consolidate to one) — the route uses the summary copy.
- **Recommended behavior:** use the argument — e.g. boost coverage-category answers whose text mentions the area/zone, or rank by intersection with the area's linked service slugs, or rotate a locally relevant cost/time answer per zone; keep 4 items; keep heading honest.
- **Should it be a separate technical task?** **Yes** — it changes rendered output on all 46 area pages and deserves its own regression pass.
- **Before or after P0?** **After** Phase P0-B validation. P0 content does not depend on it; coupling a cross-site logic change with content promotion raises regression surface. (If the owner wants localized links on the new pages at launch, it can be pulled into P0-A as its own commit — but standalone.)

---

## 16. ₹299 production visibility issue (report only — DO NOT DEPLOY)

- **Where it exists:** `src/lib/pricing.ts:9` `export const VISITING_CHARGE = 299;` (+ owner-decision comment lines 3–8). Consumers: `src/lib/services.ts` (line 69 import, line 168 bike-service text), `src/lib/answer-pages.ts` (line 17 import, line 1062 car-cost answer), and the Hyderabad files (`hyd-services.ts`, `hyd-area-content.ts:79`, `hyderabad.index.tsx`).
- **Source of truth:** `pricing.ts` — one constant for both cities; content must interpolate it, never restate it.
- **Affected Bangalore content:** bike-service page copy, car-service-cost answer, (future) all six P0 guides.
- **Should P0 pages reference the same source?** **Yes** — import `VISITING_CHARGE` in `area-content.ts` (pattern proven in `hyd-area-content.ts`).
- **Should the pending deploy happen before P0 implementation?** **Publish-order: yes.** Writing the content can proceed, but P0 pages must not go live while production lacks the ₹299 fact — otherwise the new guides assert a charge the site never mentions (AEO inconsistency). Recommended sequence: (1) owner commits + deploys the approved working tree (Stage 1 workflow + Stage 2B deploy path already prepared), (2) then ship P0 phases. **Nothing was deployed in this stage.**

---

## 17. Schema plan (reuse only — no new schema types)

| Structure | Reuse? | Notes |
|---|---|---|
| `Service` node (`serviceNode`) | ✅ reuse as emitted | `areaServed` Place + pincode auto-filled (all 40 confirmed); description = page summary |
| `BreadcrumbList` | ✅ reuse | Home → Service Areas → {Area} |
| `FAQPage` | ✅ **only because visible FAQs exist** | `faqNode(faqs)` mirrors the rendered array exactly — 6 FAQs visible ⇒ 6 Questions; Hebbal 8 ⇒ 8. Never schema for unrendered Q&A |
| `ItemList` (nearby) | ✍️ reuse | auto from `nearby` |
| Sitewide `Organization` / `LocalBusiness(AutoRepair)` / `WebSite` | ✅ reuse untouched | already lists all 40 in `areaServed` — no change needed for promotion |
| `WebPage` | ❌ **do not add** | not implemented anywhere today; adding it = new schema type, out of scope and not required |

No schema changes are needed in any file — promotion changes only which pages *render* existing nodes. FAQ schema eligibility is satisfied automatically because the template both renders and schemas the same array.

---

## 18. Sitemap / indexing plan

**For the five CREATE pages — the promotion sequence (all data-driven, one commit):**

1. Content complete in `AREA_CONTENT` (≥250 unique words, uniqueness script <60% vs all indexable pages) — **content first**.
2. `tier: "priority"` on the area record → `isAreaIndexed` flips → **robots meta removed** (`areaRobots` returns `undefined` → no noindex tag) and area URL **enters the sitemap**.
3. Slug appended to `PRIORITY_AREA_SLUGS` → 7 service×area URLs enter the sitemap, hub badge appears, chips/coverage links update.
4. **Canonical:** already self-referencing for every area URL (verified live for all six) — no action.
5. **robots.txt:** already `Allow: /` — no action; crawling permitted.
6. `noindex` must **not** remain — verified post-condition: absence of `<meta name="robots" content="noindex…">` on all five.
7. Bump `LASTMOD.areas` in `sitemap[.]xml.ts` (currently `2026-09-20`) so lastmod reflects the content change.
8. Expected sitemap deltas: total **230 → 270** (+5 area URLs + 5×7 = 35 bike service×area URLs); `/areas/*` **12 → 17**; service×area **108 → 143**; car wave unchanged (registry-gated); noindex area pages **28 → 23**.

**For Hebbal:** currently indexable, in sitemap, self-canonical, no noindex — **expected to remain exactly unchanged** (content-only edit; no indexability transition, no robots/canonical/sitemap delta).

**Explicitly not done now:** no sitemap file, robots file or indexability change occurs in this stage.

---

## 19. Cannibalization analysis (six P0 vs the existing 12 indexable guides)

| P0 area | Nearest indexable neighbours | Overlap risk | Distinct primary intent assigned |
|---|---|---|---|
| **KR Puram** | Mahadevapura (P0-same-phase), Whitefield, Hebbal | Med — shares `nearby` lists with Mahadevapura & Kalyan Nagar(noindex) | *Gateway junction + station/bridge navigation* — owns station, Tin Factory, Old Madras Road, Bridge landmarks (on no other indexable page) |
| **Mahadevapura** | Whitefield, Marathahalli, Bellandur, Sarjapur Rd | Med — corridor language could drift into Whitefield's ITPL framing | *ORR-stretch ward + corridor offices* — owns Doddanekkundi, Varthur Road, ORR-stretch; explicitly excludes ITPL/Phoenix (Whitefield's) |
| **Madiwala** | HSR (69), Koramangala (69), BTM (61), JP Nagar, Electronic City | **High** — BTM's guide already chips "Madiwala Checkpost" + "Silk Board Junction"; 93% template pairs exist in the noindex tier | *Market-lane old-town identity* — leads with Market/lake/St John's; Silk Board only as boundary; must pass <60% vs BTM/Koramangala/HSR or flag for review |
| **Banashankari** | JP Nagar (59), Jayanagar (58) | Med — south cluster; Kanakapura Road stays noindex (P3) so no indexable twin | *Temple/metro triangle + stage navigation* — absorbs Kanakapura-junction questions (its own landmark) while JP Nagar keeps phases, Jayanagar keeps blocks |
| **MG Road** | Indiranagar (70), Domlur (noindex/P1), Malleshwaram (noindex/P1) | Med — "central" copy could echo Indiranagar's | *Central commercial/office intent* — metro/Trinity/Brigade + workplace parking; explicitly residential-vs-commercial split from Indiranagar |
| **Hebbal** | (only other North: none indexable) | Low — but must not absorb Kalyan Nagar (P1) or Yeshwanthpur (P1) content | *Sole North anchor: flyover ↔ Manyata ↔ north corridor* — siblings stay chip references only |

**Rule enforced:** one page per geographic intent; no new page targets a locality already covered by an indexable guide; grouped satellites (Kalyan Nagar, Brookefield, Varthur, Ejipura, Kanakapura Road, etc.) remain `noindex` — **P1/P2 untouched**.

---

## 20. Doorway-page safety (unique value per CREATE page)

| Page | "What unique value does this page provide that no other Bangalore area page does?" | Verdict |
|---|---|---|
| KR Puram | Only guide organized around railway-station + bridge + Old Madras Road three-approach navigation; east-gateway residential context; transport-hub arrival workflow | **PASS — create** |
| Mahadevapura | Only guide owning Doddanekkundi + ORR-stretch office/ward mix between Whitefield and KR Puram; corridor-traffic arrival honesty | **PASS — create** |
| Madiwala | Only guide built around market-lane walk-in navigation + scooter-dense old-town profile; distinct from BTM only if uniqueness gate passes | **PASS — create, conditional on uniqueness check** (flag for review if ≥60% vs BTM/Koramangala/HSR) |
| Banashankari | Only guide owning temple/metro/junction triangle and stage-based addressing; carries the Kanakapura-corridor questions while that page stays grouped | **PASS — create** |
| MG Road | Only guide with commercial/office-parking intent + explicit "no walk-in counter" clarification; central-metro geography | **PASS — create** |
| Hebbal | (improve, not create) — adds Manyata office workflow, north-corridor narrative, missing AEO answers; moves *away* from the template | **PASS — improve** |

Objective honored: **fewer, stronger pages** — five promotions, zero new URLs, eighteen P3 areas explicitly not created. Each page ships only if ≥250 unique words and <60% similarity to every indexable page; otherwise the page stays `noindex` and the case returns to the owner.

---

## 21. Exact files likely to change (future implementation — NONE modified now)

| # | File | Why it would change | Type of change | P0 areas affected | Risk |
|---|---|---|---|---|---|
| 1 | `src/lib/areas.ts` | Add `tier: "priority"` to 5 records; append 5 slugs to `PRIORITY_AREA_SLUGS`; (optional) fix stale header comment about unconfirmed localities | Data edit | KR Puram, Mahadevapura, Madiwala, Banashankari, MG Road | **MEDIUM** — drives indexability, sitemap, badges; split-brain risk if slug list and tier disagree |
| 2 | `src/lib/area-content.ts` | 5 new `AREA_CONTENT` entries (intro/how/faqs) + rewrite `hebbal`; add `import { VISITING_CHARGE } from "@/lib/pricing"` | Content addition/edit | all six | LOW — content only; guarded by uniqueness script |
| 3 | `src/routes/sitemap[.]xml.ts` | Bump `LASTMOD.areas` (content date) — URL lists themselves are data-driven | Constant update | all six | LOW |
| 4 | `src/routes/contact.tsx` | `.slice(0, 12)` cap at line 113 would drop 5 of 17 promoted areas from the contact chips | Small logic edit | all five CREATE | LOW |
| 5 | `docs/seo/05-area-uniqueness-report.md` | Regenerated by `scripts/check-area-uniqueness.py` during validation | Script artifact | all six | NONE |
| 6 | *(separate task, after P0)* `src/lib/answer-page-summary.ts` + `src/lib/answer-pages.ts` | Fix `answersForArea` in **both** copies (§15) | Logic change | all 46 area pages | MEDIUM — cross-site |
| 7 | *(optional/deferred, NOT P0)* `src/routes/areas.$slug.tsx` | Per-area meta enrichment / links to `/pricing`·`/guarantee` inside FAQ copy | Route change | all 46 pages | **HIGH — out of P0 scope** |

**Explicitly unchanged:** `areas.$slug.tsx` (P0 needs zero route edits), `schema.ts`, `head.ts`, `public/robots.txt`, nav/footer, booking components, `hyd-*` files, Supabase/DB, GitHub workflows, `.github/**`.

---

## 22. Test plan for future implementation (validation checklist)

### Build
- [ ] `bun tsc -b --noEmit` → exit 0.
- [ ] `bun scripts/test-data-sync.mjs` → PASS (summary/detail sync intact).
- [ ] Production build: **do not run `bun run build:prod` locally** (sandbox OOM, exit 137 — established); verify via GitHub Actions `prod-build.yml` (workflow_dispatch) → artifact `nitro-worker-output` success.

### SEO
- [ ] Titles unique across all `/areas/*` (name-parameterized) — script-compare sitemap URLs' `<title>`.
- [ ] Meta descriptions present on all six; still unique by locality name.
- [ ] Exactly one `<h1>` per page.
- [ ] Canonical self-referencing on all six (`https://ridencare.co.in/areas/{slug}`).
- [ ] Robots: five CREATE pages have **no** `noindex` meta; Hebbal unchanged (no noindex); 23 remaining basics still `noindex, follow`.
- [ ] Sitemap: total **270** (was 230); `/areas/*` = **17**; service×area = **143**; car wave still 24; no basic slug present.

### HTTP
- [ ] All six URLs → 200, `num_redirects=0`.
- [ ] 7 service×area URLs per promoted area → 200 × 35.
- [ ] `/areas/not-a-real-area` → 404.
- [ ] Hub `/areas` shows **17** "Detailed guide" badges.

### AEO
- [ ] Each P0 page answers, visibly: coverage-in-area, doorstep repair, visiting charge (₹299), booking, what service includes, scooter availability, warranty.
- [ ] `FAQPage` Question count === visible FAQ count (6/6; Hebbal 8/8).
- [ ] No FAQ schema node without matching visible text.

### GEO
- [ ] All six state Bangalore + zone + pincode + verified landmarks/nearby only.
- [ ] Grep gate (must return 0 hits in new copy): `our branch|workshop at|mechanic stationed|storefront|office at` + `free visit|no visiting charge|no inspection fee|no doorstep charge` + `No\. 1|No\.1|fastest|guaranteed|best bike service` + uncontrolled `near me`.
- [ ] MG Road page explicitly contains the "no walk-in workshop" clarification and no physical-presence wording.

### Accessibility
- [ ] `scripts/test-accessibility.mjs` against the preview → PASS.
- [ ] Heading order h1 → h2 → h3 no skips; landmark chips are text; all chips are real `<a>` links; keyboard-reachable CTAs; contrast unchanged (existing tokens).

### Performance
- [ ] LCP/CLS unchanged within noise (existing measurement scripts, e.g. `scripts/measure-gap.mjs`, before/after).
- [ ] Page HTML growth ≈ +300–600 words only; no new components/DOM bloat; no new client bundles (data files are already in the route chunk).

### Regression
- [ ] Existing 12 indexable guides: 200, indexable, in sitemap, content byte-identical except Hebbal (intended edit).
- [ ] 23 remaining noindex pages still `noindex, follow`.
- [ ] Sitemap delta exactly +40 URLs (§18) — no unintended entries.
- [ ] Bangalore service pages (`/bike-service` etc.) intact; `/cars`, `/bikes`, `/contact` chips render (contact cap fixed).
- [ ] Hyderabad untouched: `hyd-*` files byte-identical, `/hyderabad*` routes behavior unchanged, sitemap hyd section unchanged.
- [ ] Booking flow untouched: `scripts/test-floating-controls.mjs` PASS (Book Now modal, Call/WhatsApp destinations).
- [ ] Supabase/DB untouched: no `src/convex`, no migration, no `.env` change; `freebuff-env list` keys unchanged.
- [ ] GA4 intact: GTM/GA snippet in `__root.tsx` unchanged; `VITE_GA_MEASUREMENT_ID` untouched.

---

## 23. Rollout strategy (recommended sequence)

**Phase P0-A — Hebbal improvement + KR Puram + Mahadevapura** (endorsed, with reasoning):
1. **Hebbal first (commit 1):** pure content edit, **no indexability transition** — the cheapest possible rehearsal of the content pipeline (authoring → uniqueness script → preview QA) with zero sitemap/robots blast radius.
2. **KR Puram + Mahadevapura (commit 2):** the two highest scores (72, 67), adjacent East corridors whose cross-linking is already in data. As the **first indexability flip**, they exercise the full mechanics (tier + `PRIORITY_AREA_SLUGS` + sitemap + badge + contact-cap fix) on just two areas — sitemap delta +16 URLs (2 areas + 14 service×area), small enough to monitor crawl/index response in GSC.
3. **Gate to validate P0-A:** tsc ✓ · data-sync ✓ · uniqueness report: zero flagged pairs among the 17 indexable · six-new/HTTP checks · sitemap 230 → 246 · GSC sitemap resubmission (owner) · watch for a week before P0-B.

**Phase P0-B — Madiwala + Banashankari + MG Road (commit 3):**
- Madiwala is deliberately last-of-A/first-of-B-risk: it carries the **highest duplication exposure** (BTM/Koramangala/HSR shared landmarks) and may need 1–2 rewrite iterations against the uniqueness script — doing it after the pipeline is proven avoids blocking the wave.
- Banashankari and MG Road are lower-risk (distinct intents, no indexable twins).
- **Gate:** same checklist; final sitemap 230 → 270; badges 17; noindex 23.

**Why not a different order:** promoting all five at once gives one big unmonitored indexability jump; starting with Madiwala risks iteration churn blocking higher-score pages; doing Hebbal alone first cannot validate promotion mechanics (it has no flip). The requested order is both safe and evidence-supported.

**Pre-launch dependency (blocking):** commit + deploy of the already-approved working tree (₹299 etc.) **before** P0 pages publish (§13/§16). Post-launch owner actions: sitemap resubmission in GSC, `scripts/purge-cache.mjs` runs with deploy, spot-check Search Console for "Excluded by noindex" disappearing for the five URLs.

---

## 24. Risks and blockers

| # | Risk / blocker | Severity | Mitigation |
|---|---|---|---|
| R1 | **Split-brain promotion** (`tier` set but `PRIORITY_AREA_SLUGS` forgotten → indexable area page with noindex service pages, no badge) | HIGH | Single commit touching both; test §18/§22 asserts badge count (17) and service×area sitemap count (119 bike) |
| R2 | **₹299 not live yet** — P0 pages would assert an uncorroborated fact | HIGH (publish gate) | Deploy approved working tree first (§16); nothing deployed in this stage |
| R3 | **Q34 landmark verification still open** for every landmark | MED | Use only `areas.ts` landmarks (already queued); new references marked OWNER VERIFICATION REQUIRED; content ships only from verified set |
| R4 | **Madiwala uniqueness vs BTM/Koramangala/HSR** may hit the 60% gate | MED | Uniqueness script before promotion; iterate copy; if still ≥60%, page stays noindex and returns to owner review |
| R5 | **`contact.tsx` slice(0,12) cap** silently drops promoted areas | MED | Include the low-risk cap fix in the same commit |
| R6 | **Local production build OOMs** (sandbox ~2 GB, exit 137) | MED | Validate build via GitHub Actions `prod-build.yml` (artifact retention 5 days — rerun if expired) |
| R7 | **Duplicate `answersForArea`** — fixing one copy leaves the other stale | MED | Separate task must edit/consolidate both (§15) |
| R8 | **Stale SEO docs** (`03-content-calendar.md` still schedules 18 uplifts incl. grouped satellites) will contradict this plan | LOW | Post-P0 doc update (separate, non-code task) |
| R9 | **Indexation lag / crawl budget noise** after flips | LOW | Phased rollout, GSC monitoring, cache purge with deploy |
| R10 | Description length (~190 chars) truncates in SERPs | LOW | Accepted template trait; global fix deferred (route change) |

---

## 25. Change control (recorded)

| Metric | Before | After |
|---|---|---|
| git HEAD | `d96238573ec7a7580277b80824c119b9f0a28c23` | `d96238573ec7a7580277b80824c119b9f0a28c23` (unchanged) |
| Working-tree entries | 25 (24 pre-existing + audit report from prior stage) | 26 — the 25 prior entries untouched; **+1 is only this plan file** |
| Files modified | — | **0** |
| Files created | — | **1** — `docs/seo/bangalore-p0-area-guide-implementation-plan-2026-10-05.md` (this document) |

**Confirmed: no application files changed · no route files changed · no SEO implementation occurred · no sitemap changes · no robots changes · no schema changes · no metadata changes · no indexability/canonical changes · no navigation changes · no database/Supabase changes · no GBP changes · no Cloudflare changes · no GitHub workflow changes · no commits · no pushes · no deployment.**

---

## 19′. Explicit "NOT IMPLEMENTED" statement

**NOT IMPLEMENTED — this document is a plan only.** Specifically, in this stage we did **not**: create, edit or delete any page · promote any area to `priority` · touch `PRIORITY_AREA_SLUGS` · write KR Puram / Mahadevapura / Madiwala / Banashankari / MG Road content · improve the Hebbal guide · fix the Related Answers bug · deploy the pending ₹299 changes · modify titles, meta, H1/H2, schema, sitemap, robots or canonicals · touch P1/P2 areas · modify Hyderabad code · commit · push · deploy.

*End of planning report.*
