# Real-Evidence Pipeline — Ride N Care (Batch 4)

**Purpose:** one checklist for turning real-world assets (photos, reviews, team,
service stories) into site trust signals — without ever fabricating any of it.
Companion to `10-gbp-pack.md` (photo list, review process) and the review rules in
`src/components/GoogleReviews.tsx`. Nothing here invents customers, quotes, numbers
or images; every asset enters only after the owner supplies it.

**Status 2026-09-27: pipeline defined. Assets received: none yet. Every item below
is NOT VERIFIED — OWNER ACTION REQUIRED until the owner supplies the real asset.**

## Why a pipeline

Trust is the program's biggest measured gap (Batches 1–3: technical + AEO + GEO
foundations done; reputation, reviews and citations are the open flank). The site
can only display evidence it genuinely has. This document is the intake process:
what to collect, how it gets verified, where each asset type may appear, and what
is banned.

## Asset types and where they may appear

| Asset | Owner action to supply | Verification before publishing | Where it may appear | Banned uses |
|---|---|---|---|---|
| Service photographs (real jobs, real vehicles) | Share original photos (WhatsApp/Drive), with date + rough locality | Owner confirms each photo is from a real Ride N Care job | Homepage/area-page galleries, GBP photos, blog posts | Stock photos presented as own jobs; AI-generated images as evidence |
| Genuine customer feedback (WhatsApp messages, verbal) | Forward the real message or dictate what was said, with consent | Owner confirms text verbatim + customer consent to display | Only as clearly-labelled quotes (first name + area at most) | Inventing names; presenting site-written copy as customer words; labelling non-Google quotes as "Google reviews" |
| Google reviews | Claim/verify GBP, then connect Trustindex widget ID or Places API keys (see Batch 2) | Rendered only by the existing GoogleReviews component from real data | GoogleReviews section; (later, only if data qualifies) review schema | Fabricated ratings/counts; AggregateRating schema before verifiable data |
| Team/mechanic photos | Owner supplies real photos + names/roles they consent to publish | Owner confirms identity + consent | About page, trust sections | Named mechanics without consent; invented team members |
| Service-area photos | Real locality shots the owner takes | Owner confirms location | Area pages, GBP | Landmark photos implying a physical workshop |
| Before/after service evidence | Real pairs from actual jobs with owner note on what was done | Owner confirms both images + the work performed | Blog/guide illustrations, GBP | Staged or borrowed before/after pairs |
| Invoices / work examples | Redacted real invoices (owner redacts personal data) | Owner confirms redaction is complete | /sample-invoice style labelled examples only | Publishing any customer's personal data |

## Intake rules

1. **No asset, no section.** Components stay hidden (like GoogleReviews with no
   widget ID) until real data exists — never placeholder-filled.
2. **Consent recorded** for any person-identifying content (name, photo, quote)
   before it ships.
3. **Privacy redaction** on documents: phone numbers, addresses, vehicle
   registration numbers removed by the owner before sharing.
4. **Dates are real.** Every published photo/story carries its true date; no
   re-dating to look fresh.
5. **Claims stay inside the validator.** Any new copy built on a real asset must
   still pass `scripts/validate-schema.py` banned-claims scanning.
6. **Label honestly.** Site-written explainers never wear customer clothing;
   Google-sourced content comes only through the Google integration.

## When assets arrive (implementation order)

1. Photos → GBP first (it feeds Maps/local pack), site galleries second.
2. Google reviews → connect Trustindex ID or Places keys; GoogleReviews renders
   automatically; review schema only after data is verifiable (Batch 2 rule).
3. Quotes/testimonials → homepage Testimonials component swap, one per batch,
   each traceable to a real message.
4. Team/about content → About page "Last verified" fact table update.

## Honesty rules

- Anything not yet supplied appears nowhere on the site — the absence is the
  honest state.
- This file records receipt dates; the tracker for external listings is
  `citations-tracker.md`; the GBP photo checklist lives in `10-gbp-pack.md`.
- Never claim ratings, review counts, awards, authorizations or a workshop
  address. When evidence is unavailable, mark it:
  **NOT VERIFIED — OWNER ACTION REQUIRED.**

## Batch 5 asset → website mapping (target: ~20–25 genuine images)

Concrete placement plan for when the owner's real photos arrive. File rules: descriptive
hyphenated filenames (`doorstep-bike-oil-service-hsr-layout.jpg`), accurate alt text
describing what the image actually shows (no keyword stuffing), ≤ 200 KB WebP/JPEG at
reasonable dimensions (≥ 1200 px wide for section images), `loading="lazy"` below the
fold. **A photo is only used where it genuinely depicts the service shown; an image that
cannot be tied to a real Ride N Care job is never published.** Not a deploy blocker —
other Batch 5+ work proceeds without images.

| Evidence category | Primary website location(s) | Notes |
|---|---|---|
| Doorstep bike servicing (mechanic at vehicle) | Homepage trust/process section; `/bike-service` hub; `/doorstep-bike-service` | 2–3 images; show real work, real vehicles |
| Doorstep car servicing | `/cars` or `/car-repair`; homepage gallery | 2–3 images |
| Engine/oil service close-up | `/engine-repair`, `/periodic-bike-service`; relevant car×area pages later | 2 images |
| Brake work (pads/disc) | `/brake-service`, `/car-brake-service` + marathahalli pair | 2 images |
| Battery replacement | `/battery-service`, `/car-battery-service` + jp-nagar pair | 2 images |
| Car AC service | `/car-ac-service` + jayanagar pair | 1–2 images (if genuinely AC work) |
| Technician/service activity (general) | `/about`, homepage | 2–3 images |
| Tools/equipment | `/about` or trust section | 1–2 images |
| Genuine service environment | `/about`, `/contact` | 1–2 images |
| Branded vehicle/team (if owner provides) | `/about`, brand pages | Only real Ride N Care vehicles/team |

Each image ships with: verified origin (owner confirms real job), descriptive filename,
accurate alt text, correct placement from this table, and no claim beyond what the image
shows. GBP gets the same originals (see `10-gbp-pack.md` photo checklist).

## Change log

| Date | Assets received | Change |
|---|---|---|
| 2026-09-27 | none | Pipeline created (Batch 4). No assets yet. |
| 2026-09-27 | none | Batch 5: added concrete asset→website mapping table (20–25 image target). Owner collection confirmed in progress; 0 assets in repo. |
