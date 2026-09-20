# Ride N Care — Prioritised Backlog (mapped to Parts 2–10)
Ordered by impact ÷ effort. Severity tags carry over from 01-audit-findings.md.

## Now (unblocks everything)
- [ ] **BL-1** (C3, C4 · Part 2) Add security headers (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, HSTS) + 301 www→apex and http→https. Implementation: Cloudflare zone rules or Nitro route rules. Needs Cloudflare access — OWNER ACTION first.
- [ ] **BL-2** (H4 · Part 8) GA4 conversion events: `phone_call_click` (all tel: links), `whatsapp_click` (all wa.me links), `booking_submit` (WhatsApp-handoff confirm), `book_with_ai_open`, `track_booking_view`. One `track()` helper in `src/lib`, wire in FloatingActions/BookingFlow/AiBooking/track-booking.

## Weeks 1–2 (content correctness)
- [ ] **BL-3** (H1 · Parts 3–4) Owner confirms or removes: 12,000+ customers, 4.8★, 150+ mechanics, 12+ years, "50+ localities", "same-day slots", "30 minutes away", ₹200-off offer. Then update `about.tsx`, `StatsRow`, `Testimonials`, area meta template, AEO answers.
- [ ] **BL-4** (H2 · Part 3) Fix area-coverage phrasing in `answers.ts` ("east, south and central" → matches actual catalog incl. north/west).
- [ ] **BL-5** (M1 · Part 4) Trim 15 area titles >60 chars (drop city suffix; locality pages are city-implied) + 3 long descriptions + /franchise title.
- [ ] **BL-6** (M2 · Part 4) Deepen /contact: booking steps, response expectations, contact FAQ block (target 400+ words useful copy).

## Weeks 3–6 (authority build)
- [ ] **BL-7** (M5 · Part 4) Decide /track-booking: keep indexable utility or `noindex` + remove from sitemap (owner preference).
- [ ] **BL-8** (M4 · Part 2) Descriptive filenames/alt for OG images (non-blocking).
- [ ] **BL-9** (H3 · Part 5) Car vertical build-out: dedicated pages for car periodic, AC service, battery, brakes, pre-purchase inspection (real content each, no thin templates); then repoint homepage Car AC card.
- [ ] **BL-10** (Part 6) GBP completeness: services, products, Q&A seeding, weekly post cadence, UTM'd website link.
- [ ] **BL-11** (Part 7) Digital PR/citations: Justdial, Sulekha, Bangalore local directories — NAP must show CALL number only.

## Weeks 7–12 (AEO/GEO depth)
- [ ] **BL-12** (Part 9) Expand `llms.txt` with service catalogue + pricing ranges; add AnswerBlocks to service pages; monthly AI-visibility prompt tests logged.
- [ ] **BL-13** (Part 10) Car/electric FAQ expansion + schema tuning per page type.

## Standing rules for every PR
- No unverified claims in schema/meta/AI summaries. Phone roles: CALL=08069409289 (display 080 6940 9289), WHATSAPP=8296950339 (display 82969 50339). Validate JSON-LD + links before deploy.
