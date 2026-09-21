# 09 — Entity Audit (GEO consistency check)

**Date:** 21 Sep 2026 · **Scope:** name, tagline, phone roles, service list, coverage, brands, descriptions across site, schema, llms.txt, footer, profiles.

## 1. Canonical entity facts (single reference)

| Field | Canonical value | Source of truth |
|---|---|---|
| Name | Ride N Care | — |
| Tagline | CARE IN EVERY MILE | header wordmark |
| What it does | Doorstep bike, scooter & car service in Bangalore | homepage, schema description |
| Booking phone | 080 6940 9289 (tel:+918069409289) — calls, booking, support | src/lib config |
| WhatsApp | +91 82969 50339 (wa.me/918296950339) — chat, quotes, invoices | src/lib config |
| Booking methods | Call, WhatsApp, website booking form, Book with AI | homepage process |
| Coverage | 33 confirmed localities, east and south Bangalore | src/lib/areas.ts (confirmed=true) |
| Bike brands (12) | Honda, Hero, TVS, Bajaj, Yamaha, Suzuki, Royal Enfield, KTM, Kawasaki, Harley-Davidson, Jawa, BMW Motorrad | src/lib/services.ts BIKE_BRANDS |
| Car brands (7) | Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota, Kia | src/lib/car-services.ts |
| Quote | Written quote, approved before work starts | process guide |
| Invoice | Digital invoice (WhatsApp or email) | process guide |
| Guarantee | 7-day workmanship guarantee | process guide, /guarantee (noindex until confirmed) |
| Mechanics | Background-verified, KYC-checked | process guide |
| Parts | OEM-grade | process guide |
| Payment | UPI, card, cash | process guide |

## 2. Cross-check results (site surfaces)

| Surface | Name | Tagline | Phones | Coverage | Brands | Verdict |
|---|---|---|---|---|---|---|
| Header wordmark (all widths) | ✅ | ✅ | — | — | — | MATCH |
| Homepage hero + process | ✅ | — | ✅ | ✅ (via areas component) | ✅ (strip) | MATCH |
| Footer | ✅ | — | ✅ | ✅ 33 confirmed, east/south | — | MATCH |
| /about at-a-glance | ✅ | — | ✅ | ✅ 33 | ✅ 12+7 | MATCH |
| Schema (LocalBusiness via schema.ts) | ✅ | — | ✅ | ✅ areaServed = confirmed only | — | MATCH |
| llms.txt | ✅ | — | ✅ | ✅ 33 + pending note | ✅ 12 + 7 | MATCH |
| /areas index | ✅ | — | — | ✅ confirmed only listed | — | MATCH |
| Answers "areas covered" | ✅ | — | — | ✅ 33 | — | MATCH |

No mismatches found on the site itself as of this audit.

## 3. OWNER ACTIONS — offsite profiles to reconcile

The site cannot fix these; each needs the owner to log in and align the profile to the canonical facts above.

1. **[OWNER ACTION] Google Business Profile** — verify name is exactly "Ride N Care" (no extra words), phone ends 9289, website `https://ridencare.co.in`, categories = two-wheeler/car repair service, service areas = the 33 confirmed localities, description = short copy from 09-offsite-plan.md.
2. **[OWNER ACTION] Instagram** — bio should contain: doorstep bike & car service Bangalore · written quote first · 7-day guarantee · WhatsApp 82969 50339 · link to `/`.
3. **[OWNER ACTION] Facebook** — page name, phone and "About" must match canonical facts; remove any hours/holiday claims (Q38 pending).
4. **[OWNER ACTION] YouTube** — channel "About" = medium description; links to `/`, `/areas`.
5. **[OWNER ACTION] X (Twitter)** — bio = short description; pin a booking tweet.
6. **[OWNER ACTION] Justdial / Sulekha** — claim listings; correct any third-party-written description that claims timings, pickup or ratings we don't publish.

Any profile carrying claims the site removed (seven days a week, free pickup, uniformed, response times) must be edited down to canonical wording — assistants cross-check profiles against the site and inconsistencies cost citations.

## 4. Open entity gaps (OWNER-QUESTIONS)

- Founding year — not published anywhere; keep unpublished until owner supplies it.
- Opening hours / holiday working — pending Q38.
- Team size — not published; leave unpublished.
- Registered business address — needed for GBP; owner to confirm what may be shown.
