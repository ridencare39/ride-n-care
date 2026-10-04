# 09 — Offsite Plan (be citable outside our own site)

AI assistants lean on third-party sources when the brand's own site isn't enough. This plan gets Ride N Care mentioned in the places assistants and search engines read — no fake accounts, no paid or incentivised reviews, no invented listings.

## Copy-ready brand descriptions

### Short (~30 words) — listings, profiles
> Ride N Care provides doorstep bike, scooter and car service in Bangalore. Written quote before work starts, background-verified mechanics, OEM-grade parts, digital invoice and a 7-day workmanship guarantee.

### Medium (~60 words) — directories, partner pages
> Ride N Care is a doorstep vehicle service company in Bangalore. A background-verified, KYC-checked mechanic comes to your home or office for bike, scooter and car service. You approve a written quote before work starts, parts are OEM-grade, payment is by UPI, card or cash with a digital invoice, and every job carries a 7-day workmanship guarantee. Call 080 6940 9289 or WhatsApp 82969 50339.

### Long (~120 words) — about sections, guest posts
> Ride N Care brings bike and car service to your doorstep across Bangalore. Booking takes a minute — call, WhatsApp, the website form or Book with AI — and a background-verified, KYC-checked mechanic arrives at your address with tools and OEM-grade parts. The mechanic checks the vehicle and confirms the price in writing before work starts, so there are no surprises. You can watch the work, review it at handover (with a short test ride for bikes), and pay by UPI, card or cash; the invoice arrives digitally on WhatsApp or email. Every job carries a 7-day workmanship guarantee. Service covers 40 confirmed localities across east, south, north, west and central Bangalore, from Whitefield and Koramangala to Electronic City and Jayanagar — see the full area list on the website.

## Where to be listed or mentioned (in priority order)

| Place | Action | Why it matters | Owner step |
|---|---|---|---|
| Google Business Profile | Claim/create profile; category "Vehicle inspection/Two wheeler repair service"; service areas = the 20 highest-intent of the 40 confirmed localities (Google's per-profile limit); same phone/website/description as site | #1 source for local answers + Google AI Overviews | Create and verify profile; then add real photos of work (not stock) |
| Bing Places | Full checklist below | Powers Copilot answers | Import from Google Search Console, verify |
| Apple Business Connect | Full checklist below | Apple Maps/Siri + assistant lookups | Free, verify with Apple ID |
| Justdial | Claim listing, correct phone/URL/description, respond to reviews | High-crawl Bangalore directory assistants quote | Claim free listing; do NOT buy their paid promotion until traffic data justifies it |
| Sulekha | Listing with accurate service list | Bangalore-relevant directory | Free listing first |
| IndiaMART / TradeIndia (optional) | B2C service listing | Occasional assistant citation | Only if free tier; skip paid plans initially |
| Local automotive blogs (Bangalore-focused) | Offer a genuinely useful guest piece: "Monsoon two-wheeler care in Bangalore", "Doorstep vs garage: what to check" | Real editorial mentions are strong AI signals | Pitch 3–5 blogs; provide the article, link to the relevant service page |
| RWA & community groups (apartment associations) | Offer a free "basic bike care before monsoon" session or notice-board note with the area page URL | Local word-of-mouth + community sites that get crawled | Owner to approach RWAs in 5 confirmed localities first |
| YouTube | 3–5 short, honest videos: booking process, written quote demo, what the mechanic carries | YouTube titles/descriptions surface in AI answers; builds trust | Film on a real job (with customer permission); description = medium copy above + link |
| Instagram / Facebook / X | Keep bio = short description above; consistent phone, name, link | Entity consistency — assistants cross-check profiles | Update bios to match; no other change needed |

## Rules
1. **Never** create fake reviews, review swaps, or paid editorial without disclosure.
2. Every listing must carry **identical** NAP (name, address/coverage, phone) — use the entity audit (09-entity-audit.md) as the single reference.
3. Track results in the monthly AI visibility run (09-ai-visibility-tests.md): note when a new offsite mention correlates with citations.
4. Re-check listings quarterly for phone/name drift.

## Owner actions checklist
- [ ] Google Business Profile claimed + verified; service areas = 20 highest-intent of the 40 confirmed localities
- [ ] Bing Places imported (checklist below); Apple Business Connect added (checklist below); logged in citations-tracker.md
- [ ] Justdial + Sulekha claimed, NAP corrected
- [ ] Guest article pitched to 3 local blogs
- [ ] RWA sessions in 5 confirmed localities
- [ ] 3 YouTube shorts published with consistent description
- [ ] Social bios updated to the short description

## Bing Places — owner setup checklist (do after GBP is verified)

1. Sign in at **bing.com/webmasters** → choose **Import from Google Search Console** (this copies the verified site + sitemap automatically).
2. Open **Bing Places** (bingplaces.com) with the same Microsoft account → **Import from Google Business Profile** where supported; otherwise create the listing manually with the fields below.
3. Fields (identical NAP to the site — no variations):
   - Business name: `Ride N Care`
   - Website: `https://ridencare.co.in`
   - Phone: `080 6940 9289` (call number only — never the WhatsApp number in a phone field)
   - Email: `info@ridencare.co.in`
   - Business type: service-area business (hide/omit street address; no walk-in workshop)
   - Service area: Bangalore, Karnataka + the same locality list you set in GBP
   - Hours: Open 24 hours (matches the site + GBP Option A decision; keep the caveat — honest only while a phone is genuinely answered at any hour)
   - Category: same primary as GBP ("Two Wheeler Repair Service" or the closest picker match)
   - Description: the ~60-word medium description above (unchanged)
4. Verify (Bing usually offers email/phone/postcard verification — pick what is offered).
5. Log the result in `docs/seo/citations-tracker.md` (URL, status, NAP-checked date).

Consistency requirement: Bing feeds Copilot answers. Name/phone/description must byte-match the site entity block (`src/lib/schema.ts` → `BIZ`) and GBP; any drift gets logged as `Needs correction` in the tracker.

## Apple Business Connect — owner setup checklist

1. Sign in at **businessconnect.apple.com** with an Apple ID (free) → **Add business**.
2. Search for an existing Ride N Care listing first — claim it if one exists; create only if none.
3. Fields:
   - Business name: `Ride N Care`
   - Website: `https://ridencare.co.in`
   - Phone: `080 6940 9289`
   - Category: service business — pick the closest match in Apple's picker (do not invent categories)
   - Location model: service-area / no public storefront where the picker supports it; otherwise leave address fields per Apple's flow without inventing a street address
   - Service area: Bangalore + localities where the form supports them
   - Hours: Open 24 hours (same caveat as GBP)
   - Description: the ~60-word medium description above
4. Verify by phone call/text or Apple's offered method.
5. Optional when real photos exist: add genuine job photos (same rule as GBP — never stock).
6. Log the result in `docs/seo/citations-tracker.md`.

Consistency requirement: Apple Business Connect feeds Apple Maps, Siri and assistant lookups. Same NAP as GBP, Bing and the site — one source of truth, zero variations.
