# Owner Questions — answers unblock SEO work
Add answers inline. Until answered, the related claim stays out of new content and carries `[OWNER TO CONFIRM]` in drafts.

## Proof for existing claims (BL-3)
1. [OWNER TO CONFIRM: 12,000+ customers — source? booking system count, invoice count?] — used on /about, StatsRow, Testimonials.
2. [OWNER TO CONFIRM: 4.8★ average rating — which platform + live review count? Link the public review page.] — /about stats block.
3. [OWNER TO CONFIRM: 150+ certified mechanics and 12+ years in operation — what does "certified" mean here?] — /about.
4. [OWNER TO CONFIRM: "50+ localities" — exact count from src/lib/areas.ts or marketing rounding?] — meta descriptions, About.
5. [OWNER TO CONFIRM: "same-day slots" — is a same-day slot genuinely bookable in the flow today?] — area-page meta template.
6. [OWNER TO CONFIRM: "30 minutes away" claim on the homepage long-copy section — average response time evidence?] — /intro copy.
7. [OWNER TO CONFIRM: ₹200 off first service offer — live? terms? expiry?] — referenced in offers copy.
8. [OWNER TO CONFIRM: car denting & painting — is the painting part done at a partner workshop (pickup/drop) or refused? /cars card says "Pick-up, paint, drop" — confirm this workflow is real.]
9. [OWNER TO CONFIRM: does 8296950339 accept normal voice calls?] — until answered it is never shown as a call number.
10. [OWNER TO CONFIRM: Cloudflare zone access (or preferred method) for www→apex 301 + security headers — BL-1.]
11. [OWNER TO CONFIRM: keep /track-booking indexable, or noindex it?] — BL-7.
12. [OWNER TO CONFIRM: GBP login available for service/product completion and post cadence?] — BL-10.
13. [OWNER DECISION: AI training crawlers are ALLOWED in robots.txt (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) so generative engines can cite Ride N Care. Reply to flip any of them to blocked — one line, e.g. "block CCBot".] — Part 2 robots.txt.
14. [OWNER TO CONFIRM: privacy policy + terms pages are live at /privacy and /terms with [OWNER TO REVIEW] placeholders — review wording (data practices, guarantee scope, liability) and add an effective date.] — Part 2.
15. [OWNER TO CONFIRM: GA4 events (call_click, whatsapp_click, booking_form_submit, book_with_ai_open) fire from the site — mark them as key events/conversions in the GA4 admin for reporting. No GA property access was available to verify.] — Part 2.
16. [OWNER TO CONFIRM: exact "What is included" checklist per service — the money pages currently list the items from the booking flow's package config (src/lib/pricing.ts). If your real periodic-service checklist has more/fewer points (e.g. 25-point inspection list), supply it and the pages + schema will be updated.] — Part 5.
17. [OWNER TO CONFIRM: parts markup policy on doorstep jobs — FAQ answers say consumables/parts are "billed only after your approval". Confirm this matches actual practice (parts margin, labour rate, GST invoice).] — Part 5.
18. [OWNER TO CONFIRM: cancellation/reschedule policy wording on the money pages ("free to cancel or reschedule before the mechanic leaves") matches your operations.] — Part 5.

## Operational promises on the Part 5 bike pages — Part 6 audit (2026-09-19)
These promises appear in Part 5 bike-page copy but were not found in src/lib config or the original site. They are LEFT IN PLACE for now — confirm each and I will either keep (with proof) or reword.
19. [OWNER TO CONFIRM: sealed oil — "Oil is shown to you sealed before pouring/fitting" (bike-service FAQ, motorcycle-service FAQ, TRUST_POINTS). Is every oil container shown sealed before use?]
20. [OWNER TO CONFIRM: part numbers on the invoice — "every part fitted appears with its number on the digital invoice" (TRUST_POINTS, bike-service + engine-repair FAQs). Does the invoice format actually print part numbers?]
21. [OWNER TO CONFIRM: mechanic ID and uniform — TRUST_POINTS says mechanics "arrive uniformed and show an ID you can verify"; the doorstep-bike-service FAQ adds "you get the mechanic's name and photo on WhatsApp before arrival". Are both true today?]
22. [OWNER TO CONFIRM: free pickup/drop and free recovery — "free pickup and drop when a workshop visit is unavoidable" (doorstep-bike-service), "transport the bike free" (bike-repair), "recovery within the city is free" (breakdown pages), and "no doorstep surcharge — package prices match our workshop rates". Is all transport genuinely free, and are doorstep and workshop prices identical?]
23. [OWNER TO CONFIRM: "use the company workshop first" — bike-service detail copy says if the bike is inside its free-service period "we will honestly tell you to use that first" (also periodic-bike-service). Is this an actual policy your mechanics follow?]
24. [OWNER TO CONFIRM: free doorstep diagnosis — bike-repair/doorstep-bike-repair/engine-repair/brake-service/battery-service say diagnosis or inspection is free and "you pay only if you approve the repair". Also "photo updates before and after the job" (doorstep-bike-service). Confirm both.]
25. [OWNER TO CONFIRM: dispatch window 8 AM–9 PM every day (emergency-bike-repair + breakdown pages). Is that the real operating window? Timings were removed from llms.txt earlier on your instruction, so the pages need your confirmed hours.]
26. [OWNER TO CONFIRM: after-sales details — battery page: "warranty card registered in your name" and "old battery collected for recycling"; engine-repair: "follow-up check after the first 500 km of running-in". Are these real processes?]

## Part 7 Step 0 fixes — new confirmations needed (2026-09-20)
27. [OWNER TO CONFIRM: car brand list — booking config (src/lib/booking.ts) offers 13 car brands, but the owner-confirmed set is SEVEN: Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota, Kia. /cars, the homepage brand strip and llms.txt now show ONLY the seven. Are Renault, Volkswagen, Skoda, Ford, Nissan and MG genuinely serviced? One line restores or removes them everywhere.]
28. [OWNER TO CONFIRM: job durations — "90–150 minutes", "60–90 minutes", "about 20 minutes", "within the hour" have been REMOVED from /cars, /car-periodic-service, /car-ac-service, /car-battery-service. Confirm real ranges (or approve the current "arrival window confirmed at booking" wording) and we can put honest ranges back. NOTE: bike pages still say "most general services finish in 60–90 minutes" — that one IS backed by the booking config's duration field (src/lib/pricing.ts), so it stays until you either confirm it or change the config.]
29. [OWNER TO CONFIRM: mechanic ID check — "show an ID before starting work" removed from /cars. The bike pages' TRUST_POINTS still mention ID/uniform under Q21 — confirm once for both verticals.]
30. [OWNER TO CONFIRM: old-battery recycling — "old battery collected for recycling" removed from /car-battery-service (copy now says disposal is confirmed at booking). Is a recycling/take-back process actually in place?]
31. [OWNER TO CONFIRM: "warranted" battery replacement — "warranted battery", "warranty registered in your name" removed from /car-battery-service. Confirm the warranty process and who registers it.]
32. [OWNER TO CONFIRM: post-service braking test — "post-service braking test drive" removed from /car-brake-service (now "work inspected with you before you pay"). Is a documented braking test actually performed?]
33. [OWNER TO CONFIRM: locality coverage — this is the "Q3" referenced in the Part 3/6/7 briefs. The site's own AEO answer claims east+south Bangalore; our data file marks SEVEN north/west/central localities confirmed=false with their pages noindexed until you answer: Hebbal, Yelahanka, Rajajinagar, Malleshwaram, MG Road, Yeshwanthpur, Peenya. (The brief said 9 — our list has 7; if Vijayanagar, Basaveshwaranagar or others should exist as pages, say so and we'll add them.) Also: the homepage hero mentions Kengeri, which has no page and is unconfirmed — keep or change? One line per locality ("Hebbal: yes") flips it live and indexable.]
34. [OWNER TO CONFIRM: landmarks — every landmark/road/tech park below is used as local context on /areas/{slug} pages. Please flag any that are wrong or should not be referenced (they are only navigation aids for bookings, not claims):
  - Whitefield: ITPL, Phoenix Marketcity, Whitefield Railway Station, Varthur Main Road
  - Koramangala: Forum Mall, Sony World Junction, Jyoti Nivas College, 80 Feet Road, St. John's Hospital
  - HSR Layout: 27th Main Road, Agara Lake, BDA Complex Sector 2, Sector 7
  - Indiranagar: 100 Feet Road, Indiranagar Metro Station, CMH Road, 12th Main Road, Old Airport Road
  - Marathahalli: Marathahalli Bridge, ORR junction, AECS Layout, Kundalahalli Gate
  - Bellandur: Bellandur Lake, Iblur Junction, RMZ Ecospace, Outer Ring Road
  - Sarjapur Road: Wipro Gate, Kaikondrahalli Lake, ORR junction, Harlur Road
  - BTM Layout: 16th Main Road, Silk Board Junction, Madiwala Checkpost, 2nd Stage
  - Jayanagar: 4th Block Shopping Complex, South End Circle, Jayanagar Metro Station, 11th Main Road
  - JP Nagar: Jayadeva Hospital, JP Nagar Metro Station, Puttenahalli Lake, Bannerghatta Road junction
  - Electronic City: Infosys Gate Phase 1, Wipro Gate, Electronic City Flyover, Hosur Road, Neeladri Road
  - Hebbal: Hebbal Flyover, Hebbal Lake, Manyata Tech Park, Esteem Mall
  - Banashankari: Temple, Kanakapura Road junction, Metro Station · Bannerghatta Road: Meenakshi Mall, IIM Bangalore, Hulimavu, Biological Park · Kanakapura Road: Main Road, Konanakunte, Vasanthapura, Turahalli Forest · Domlur: Old Airport Road, Embassy GolfLinks · Ejipura: Viveknagar, Main Road, 80 Feet Road · Bommanahalli/Kudlu/Singasandra/Parappana Agrahara/Choodasandra: Hosur Road, Hosa Road, Kudlu Gate, junctions · Madiwala: Checkpost, Market, Silk Board, St. John's · Harlur/Kasavanahalli/Gunjur/Varthur/Panathur/Kadubeesanahalli/Brookefield: lakes, Varthur Kodi, RMZ Ecospace, Graphite India Road, Balagere · Mahadevapura: Doddanekkundi, Varthur Road, ORR · Kalyan Nagar: Hennur Main Road, Banaswadi, HRBR Layout · KR Puram: Railway Station, Tin Factory, Old Madras Road, Bridge · HAL: Aerospace Museum, Old Airport Road, Suranjan Das Road, 2nd Stage · Rajajinagar: Orion Mall, Dr Rajkumar Road, 1st Block, Magadi Road · Malleshwaram: Mantri Square, Sankey Tank, 8th Cross, Margosa Road · MG Road: Metro Station, Trinity Junction, Brigade Road, Chinnaswamy Stadium · Yelahanka: New Town, Railway Station, Doddaballapur Road · Yeshwanthpur: Railway Station, Tumkur Road, Goraguntepalya, Mathikere · Peenya: Industrial Area, Metro Station, Tumkur Road, Jalahalli]
35. [OWNER TO CONFIRM: car breakdown jobs done on the spot — /car-breakdown-assistance currently describes on-site diagnosis plus generic "fixes that can safely be carried out where the car stands". Confirm WHICH car breakdown jobs are actually completed at the roadside (battery jump/replace, tyre, fuse, fuel?) so the "Done at your location" list can be specific like the bike page. Until answered the copy stays generic.]
36. [OWNER TO CONFIRM: car recovery — is vehicle recovery/flatbed transport offered for cars, is it free within the city like bike recovery, and is there a time window? Copy currently says only "how the car is moved is confirmed on the call".]
37. [OWNER TO CONFIRM: "seven days a week" / weekend-holiday claims — REMOVED everywhere pending your answer. The FAQ now says the bike emergency line runs 8 AM–9 PM and other windows are confirmed at booking. Confirm the real weekly schedule (and holidays policy) and we can restore the claim.]
38. [OWNER TO CONFIRM: "uniformed mechanic" — REMOVED from services, guides, answers and trust points. Do mechanics wear a uniform? Confirm and it goes back.]
39. [OWNER TO CONFIRM: "typically attended within a few hours" (emergency ETA) — REMOVED; copy now says availability is confirmed on call/WhatsApp before you commit. If you have a real response-time figure you will stand behind, tell us and it returns with the figure.]
40. [OWNER TO CONFIRM: "Free Pickup & drop" — the stat-block phrasing is gone; conditional copy now says "free workshop transport when a job genuinely needs the workshop". Confirm pickup/drop is free, conditional, and what triggers it.]
41. [OWNER TO CONFIRM: mechanic-details-before-dispatch ("name and photo on WhatsApp before dispatch") — REMOVED. If mechanics' details really are shared pre-dispatch, confirm and it returns.]
42. [OWNER TO CONFIRM: "usually costs the same or less" (car vs garage pricing claim) — REMOVED; replaced with the hidden-cost-savings framing. Confirm you want a price-comparison claim restored only with evidence.]
43. [OWNER TO CONFIRM: "printed invoice" and "standard manufacturer warranty" — REMOVED; copy now says digital invoice with part numbers, and part warranty stays with the part maker. Confirm there is no printed invoice and describe the real parts-warranty process.]
44. [OWNER TO CONFIRM: "arrival window" — kept ONLY as "confirmed when you book". If windows are given in hours ("10 AM–12 PM") or minutes, say so and copy can be more specific.]
45. [OWNER TO CONFIRM: hero "60 seconds" booking and "60–90 minutes" bike service duration — currently kept (booking-flow duration field backs the service time). Confirm the "60 seconds" phrasing or give the real form time.]
46. [OWNER TO CONFIRM: /car-oil-change — confirm engine oil & filter change is offered at the doorstep for cars (grades stocked, used-oil disposal process). Page is live with general copy.]
47. [OWNER TO CONFIRM: /car-inspection — confirm pre-purchase / health-check car inspections are offered (checklist scope, written findings). Page is live with general copy.]
48. [OWNER TO CONFIRM: /car-jump-start — confirm car jump start is offered (equipment carried, battery/alternator testing, safety limits). Page is live with general copy.]
49. [OWNER TO CONFIRM: /car-repair — confirm diagnosis-led car repair at home is offered and which repair categories are actually done on the spot. Copy lists conservative examples; confirm or correct.]
50. [OWNER TO CONFIRM: /car-electrical-repair — confirm car electrical & lights repair is offered (testing equipment, circuit-level faults done at doorstep). Page is live with general copy.]

---
**UPDATE 21 Sep 2026 — owner answers received, applied & live:**
- **Q33 (coverage): ALL 40 localities confirmed** — confirmed flags flipped in src/lib/areas.ts; zone wording auto-updates to east, south, north, west and central.
- **Q46–Q50: all five car services confirmed** offered at the doorstep; pages stay as published.
- **Q1 (12,000+ customers): CONFIRMED** — "12,000+ customers served" added as plain text on / and /about ONLY (validator enforces the page scope; never AggregateRating/Review schema).
- **HOURS: mechanic visits available at any hour** — wording family "Doorstep visits available 24 hours" applied across site + schema openingHoursSpecification (7 days, 00:00–23:59, describing service visits). Banned variants: 24x7, open 24 hours, seven days a week, any time you call, 8 AM/9 PM windows, next-morning scheduling, "not workable" for hours.
- **RATING (Q2): ON HOLD** — value/count/source left blank; NO rating text or markup added anywhere. Approved pattern (only if owner later fills it): visible text "{value} on Google ({count} reviews)" on / and /about only, linking the GBP URL, never AggregateRating/Review schema.
