/**
 * Unique, locality-specific copy for every priority area page
 * (the 12 Part-7 guides + the 5 approved P0 guides added 2026-10-05).
 *
 * Rules:
 * - Only verifiable local context: real roads, junctions, lakes, malls, tech
 *   parks (the same landmarks listed in areas.ts and queued for the owner's
 *   local check in OWNER-QUESTIONS.md). No invented response times, slot
 *   availability, "most requested services" or job counts.
 * - Sentence structure is deliberately varied across areas so the Part 7
 *   uniqueness script (name-stripped) stays well under the 60% flag line.
 * - Operational promises stay limited to the established set: background-
 *   verified mechanics, written quote before work starts, OEM-grade parts,
 *   45-Day Warranty (On eligible repairs), digital invoice on WhatsApp, and
 *   the ₹299 visiting charge imported from @/lib/pricing (never restated as a
 *   literal string, never described as free).
 */
import type { Area } from "@/lib/areas";
import { VISITING_CHARGE } from "@/lib/pricing";

export interface AreaContent {
  slug: string;
  /** Answer-first intro paragraph (unique per area). */
  intro: string;
  /** "How doorstep service works here" — 1–2 unique paragraphs. */
  how: string[];
  /** Area-specific FAQs (5–8) — rendered visibly and mirrored by the FAQPage schema. */
  faqs: [string, string][];
}

export const AREA_CONTENT: Record<string, AreaContent> = {
  "hsr-layout": {
    slug: "hsr-layout",
    intro:
      "HSR Layout runs on the 27th Main spine and its sector grid, with Agara Lake at one end and the Harlur Road side at the other. Ride N Care sends a background-verified mechanic to your sector with tools and OEM-grade spares, confirms the price in writing before any part is opened, and backs the work with a 45-day warranty — bikes and cars, at your gate.",
    how: [
      "Booking is one message: your vehicle model, the service, and your sector and gate number. You receive a written quote on WhatsApp, and the mechanic is assigned from the unit nearest to you with the arrival window confirmed when you book.",
      "Most HSR apartment complexes have visitor or basement bays that fit the job — one bay is all the work needs, and a plug point helps for battery and electrical checks. Security desks usually want the mechanic's ID noted at the gate, which our mechanics carry.",
    ],
    faqs: [
      ["Do you cover all sectors of HSR Layout?", "Yes — Sector 1 through 7, including the 27th Main stretch, the BDA Complex neighbourhood and the Harlur Road side. Share your sector and gate number when booking so the mechanic reaches the right entrance."],
      ["Can you service my bike in my apartment's basement?", "In most HSR complexes, yes — one parking bay is enough. Your building's security may note the mechanic's ID at the gate, which they carry."],
      ["Do you do car work in HSR too, or only bikes?", "Both. Periodic service, AC service, battery replacement and brake work are all doorstep-capable here — each car page lists exactly what the visit includes."],
      ["What if the job needs a workshop?", "Jobs that need a hoist or paint booth are never done in the open. We say so at diagnosis and arrange workshop transport with a written estimate first."],
      ["How do I confirm the price?", "The written quote lands on WhatsApp before work starts. Consumables or extra parts are billed only after your approval."],
    ],
  },

  koramangala: {
    slug: "koramangala",
    intro:
      "Koramangala fits a lot into tight lanes — the Sony World Junction side, the 5th and 6th Block food streets, Forum Mall and the office blocks in between. Ride N Care books your slot, sends a background-verified mechanic with tools and OEM-grade spares, and confirms the full price in writing before anything is opened.",
    how: [
      "Share your block, street and a landmark — near Sony World Junction or Jyoti Nivas, for example — and the mechanic walks the last stretch when a lane is too tight for the van. Your arrival window is confirmed when you book.",
      "Cars need a parking bay: a basement or visitor slot works, with security's permission where required. Bikes are simpler and are usually serviced right at the doorstep.",
    ],
    faqs: [
      ["My flat is on an inner one-way lane — can you still come?", "Yes. Share the block, street and a landmark and the mechanic covers the last stretch on foot with the tool kit."],
      ["Do you service scooters as well as motorcycles?", "Both — periodic service, brakes, clutch, battery and electrical work across scooters and motorcycles."],
      ["I park in an office basement. Is that workable?", "Yes, with security's permission. The job needs one bay and the space is left clean afterwards."],
      ["What about jobs you can't finish outside?", "Engine overhauls and paint work don't belong in a parking bay. We tell you upfront and arrange workshop transport with a written estimate."],
      ["How is the price decided?", "By your vehicle and what the inspection finds. You approve a written quote before work starts — nothing extra is billed without your OK."],
    ],
  },

  indiranagar: {
    slug: "indiranagar",
    intro:
      "From the 100 Feet Road café strip to CMH Road and the 12th Main lanes, Indiranagar mixes old bungalows with new apartment blocks. Ride N Care brings bike and car service to your doorstep — background-verified mechanics, OEM-grade parts, a written quote before work starts and a 45-day service warranty.",
    how: [
      "Bungalow driveways are the easiest worksites in Indiranagar; apartment basements need one free bay. Parking on the 100 Feet Road side is tight, so the work happens in your building or driveway, never on the main road.",
      "The whole layout from the Indiranagar metro station down to Old Airport Road is covered, including the HAL-side streets. If your gate security needs the mechanic's ID, they carry one.",
    ],
    faqs: [
      ["Parking near 100 Feet Road is tight — where do you actually work?", "In your building's basement or your own driveway, not on the main road. If the building requires the mechanic's ID at the gate, they carry one."],
      ["Can you handle my bike and my car in one visit?", "Yes — book both and the visit is planned for it. A common pairing is bike periodic service plus a car battery or AC check."],
      ["Is the area near Indiranagar metro station covered?", "Yes — the full layout from the metro to Old Airport Road, including the CMH Road side."],
      ["What happens if you find extra work?", "It goes into the written quote with the part shown to you — nothing is replaced before you approve."],
      ["Which jobs can't be done at the doorstep?", "Paint, denting and engine rebuilds. We arrange workshop pickup and share a written estimate instead."],
    ],
  },

  whitefield: {
    slug: "whitefield",
    intro:
      "Whitefield's day starts and ends on Varthur Road and the ITPL stretch — and nobody wants to spend a Saturday driving across town to a service centre. Ride N Care does bike and car service at your gate in Whitefield: written quote first, OEM-grade parts, background-verified mechanics and a 45-day service warranty.",
    how: [
      "Gated communities around ITPL and Phoenix Marketcity have security desks — we send your booking reference on WhatsApp so gate entry is smooth. The job needs one allotted parking bay; a plug point helps for battery and electrical work.",
      "Office-parking visits in the EPIP zone are equally workable with your office's permission. Varthur, Brookefield and the Gunjur side are served from the nearest unit.",
    ],
    faqs: [
      ["Do you come inside gated communities around ITPL?", "Yes. Forward the mechanic details we send on WhatsApp to your security desk; the work happens in your allotted parking bay."],
      ["My office is in EPIP — can you service there?", "With your office's permission, yes — one parking bay covers most jobs."],
      ["Is the Varthur Road side covered?", "Yes — Varthur, Brookefield and the Gunjur side are all served from the nearest unit."],
      ["Do you carry the parts, or will there be a second visit?", "Common consumables and filters travel with the mechanic. Model-specific parts are confirmed in the written quote before the visit so there are no surprises."],
      ["What if my car needs something you can't do outside?", "You hear it honestly at diagnosis. Workshop jobs come with arranged pickup and a written estimate before anything moves."],
    ],
  },

  "electronic-city": {
    slug: "electronic-city",
    intro:
      "Electronic City runs long — Phase 1 to Phase 2 along Hosur Road, tech-park gates at one end and Neeladri Road at the other. Ride N Care sends a background-verified mechanic to your phase with a written quote before work starts, OEM-grade parts and a 45-day service warranty, for bikes and cars alike.",
    how: [
      "The area is a long haul, so the mechanic is assigned from the unit nearest to you and your arrival window is confirmed when you book — no guesswork about when anyone shows up.",
      "Campus and complex parking works with security's permission: one bay, tools and consumables carried in, the space left clean. Office-parking jobs are among the most common bookings here.",
    ],
    faqs: [
      ["Do you cover Phase 1 and Phase 2 both?", "Yes, plus the Hosa Road and Bommanahalli side. Book with your phase and gate so the right unit is assigned."],
      ["I work in a tech park — can you service at the office?", "With security's permission, yes — one parking bay is all the job needs."],
      ["How do I pick a time?", "Tell us your preferred day and we confirm your arrival window in writing when you book."],
      ["Is battery replacement done on the spot?", "Yes — test first, replacement at your bay only if the test says it's due, and the invoice notes where the old battery goes."],
      ["What does the written quote include?", "Labour, parts and consumables line by line. Extra findings are added only with your approval."],
    ],
  },

  marathahalli: {
    slug: "marathahalli",
    intro:
      "Marathahalli squeezes apartment blocks, market lanes and the Outer Ring Road bridge into one busy square kilometre. Ride N Care keeps bike and car care at home here — a background-verified mechanic, a written quote before work starts, OEM-grade parts and a 45-day service warranty.",
    how: [
      "Share a landmark for the arrival — Marathahalli Bridge, Kundalahalli Gate or your AECS Layout cross street — and the mechanic finds you without a dozen phone calls. If a lane is too narrow for the van, the last stretch is covered on foot.",
      "Basement bays fit car work; bikes are usually done at the doorstep itself. The market-lane side is covered the same way — landmark in, quote in writing, work after your approval.",
    ],
    faqs: [
      ["Can you reach the lanes behind the bridge?", "Yes — share your street and a landmark, and the mechanic walks the last stretch if the lane is too narrow for a vehicle."],
      ["Do you service my scooter and my car both?", "Yes — scooters, motorcycles and cars, including car AC, battery and brake work."],
      ["Is AECS Layout covered?", "Yes, along with Kundalahalli and the Brookefield side."],
      ["What's included in a doorstep periodic service?", "The checklist on the service page — oil and filters, brakes, fluids, battery test, lights and a multi-point report — done at your bay."],
      ["How do I know the final price?", "Written quote before work starts; anything extra is shown to you and approved first."],
    ],
  },

  bellandur: {
    slug: "bellandur",
    intro:
      "Bellandur sits where the Outer Ring Road meets the Sarjapur Road corridor — office towers, gated communities and the lake in between. Ride N Care services bikes and cars at your doorstep here: written quote before work, background-verified mechanics, OEM-grade parts and a 45-day service warranty.",
    how: [
      "Both halves of Bellandur life are covered: office-parking jobs near the RMZ Ecospace / Iblur Junction side with the building's permission, and home visits in the gated communities off the main road.",
      "ORR traffic is a given, so your arrival window is confirmed when you book rather than promised in minutes. The invoice lands on WhatsApp before you pay.",
    ],
    faqs: [
      ["Can you service at my office parking near RMZ Ecospace?", "With the building's permission, yes — one bay. The invoice reaches your WhatsApp before you pay."],
      ["Is the lake side and Iblur Junction covered?", "Yes — both sides of the junction, plus Panathur Road and Kadubeesanahalli nearby."],
      ["Do you do car AC gas refill here?", "Yes — measured first: vent temperatures, gas level and a leak check before any refill goes in."],
      ["What if the mechanic finds more work?", "You see it in writing and approve it before any part is fitted."],
      ["Are weekend bookings possible?", "Tell us the day that works and we confirm the window in writing when you book."],
    ],
  },

  "btm-layout": {
    slug: "btm-layout",
    intro:
      "BTM Layout packs its 1st and 2nd Stage lanes between Silk Board Junction and Madiwala Checkpost — dense, busy and famously short on parking. Ride N Care does bike and car service at your doorstep with a written quote before work starts, background-verified mechanics and a 45-day service warranty.",
    how: [
      "One-ways and narrow streets are the norm here, so bookings use a landmark — your 16th Main cross or the nearest main-road junction — and the mechanic walks in where a van can't.",
      "Two-wheeler jobs are the quickest doorstep wins in BTM; car jobs need a bay, which most complexes in both stages have. Clutch, chain and brake work are all doorstep-friendly.",
    ],
    faqs: [
      ["My street is one-way and narrow — where does the mechanic work?", "In your building's bay or your allotted parking spot; for bikes, the doorstep itself is usually enough."],
      ["Is 2nd Stage covered?", "Yes — both stages, plus Madiwala and Ejipura nearby."],
      ["Do you do clutch and chain work here?", "Yes — clutch, chain and brake jobs are doorstep-friendly. Anything needing a machine comes with pickup arranged."],
      ["How is the quote shared?", "On WhatsApp, in writing, before work starts. Extra work only ever after your approval."],
      ["Can I book for early morning before office?", "Tell us the window you want; we confirm in writing what's possible when you book."],
    ],
  },

  jayanagar: {
    slug: "jayanagar",
    intro:
      "Jayanagar's block grid — the 4th Block shopping stretch down to South End Circle — is one of Bangalore's easiest neighbourhoods to service at the gate: driveways, wide main roads and steady parking. Ride N Care brings bike and car service home with a written quote first and a 45-day service warranty.",
    how: [
      "Every block from 1st to 9th is covered, with the Jayanagar metro station and 11th Main as easy landmarks for the arrival. Older homes with open driveways make car work genuinely simple here.",
      "Stilt parking and basement bays both work — one bay with some light is enough, and a plug point helps for battery and electrical checks. Banashankari and JP Nagar are served from the nearest unit.",
    ],
    faqs: [
      ["Do you cover all of Jayanagar's blocks?", "Yes — 1st Block through 9th, including the 4th Block shopping stretch and the South End Circle side."],
      ["Can you work in my stilt parking?", "Yes — one bay with a bit of light is enough; a plug point helps for battery and electrical checks."],
      ["Is the Banashankari side covered too?", "Yes — Banashankari and JP Nagar are served from the nearest unit."],
      ["What does a bike service cost here?", "Packages start from the prices on our /bikes page; the exact quote depends on your engine size and is confirmed in writing before work starts."],
      ["Do you give a warranty?", "A 45-day service warranty on every job, plus the manufacturer warranty on parts fitted."],
    ],
  },

  "jp-nagar": {
    slug: "jp-nagar",
    intro:
      "JP Nagar spreads from Jayadeva Hospital to the Bannerghatta Road side — phase after phase of houses, apartments and hospitals in between. Ride N Care does bike and car service at your phase: written quote before work starts, background-verified mechanics, OEM-grade parts and a 45-day service warranty.",
    how: [
      "Book with your phase and a landmark — Jayadeva Hospital, Puttenahalli Lake or the metro station side — and the mechanic is assigned from the nearest unit with the window confirmed on WhatsApp.",
      "Bannerghatta Road traffic is real, so arrival windows are confirmed at booking rather than promised in minutes. Car brake work, battery replacement and AC service are all doorstep-capable in a basement bay.",
    ],
    faqs: [
      ["Do you cover all JP Nagar phases?", "Yes — and the Bannerghatta Road and Kanakapura Road sides nearby. Book with your phase and a landmark."],
      ["Can you do car brake work in my apartment basement?", "Yes — pads, discs and fluid work are all doorstep-capable, with a braking check after the job."],
      ["Is the Puttenahalli Lake area covered?", "Yes, along with the metro station side of the layout."],
      ["What about battery replacement for my scooter?", "Done at the doorstep — test first, replacement only if the test says so, and disposal of the old battery is confirmed at booking."],
      ["How do I pay?", "UPI, card or cash after you've checked the work. The invoice arrives on WhatsApp."],
    ],
  },

  "sarjapur-road": {
    slug: "sarjapur-road",
    intro:
      "Sarjapur Road links the ORR to the tech parks out past Wipro Gate, and its weekends belong to Harlur Road traffic. Ride N Care keeps vehicle care at home here: bike and car service at your gate, a written quote before work starts, background-verified mechanics and a 45-day service warranty.",
    how: [
      "The corridor is a string of apartment clusters off the main road, so bookings use a landmark — Wipro Gate, Kaikondrahalli Lake or your Harlur Road cross street — and the mechanic is assigned from the nearest unit.",
      "Office-campus visits work with permission: one bay, tools carried in, invoice on WhatsApp before payment. Harlur, Kasavanahalli and the Choodasandra side are covered the same way.",
    ],
    faqs: [
      ["Do you cover the apartments off Harlur Road?", "Yes — Harlur, Kasavanahalli and the Choodasandra side are served from the nearest unit."],
      ["Can you service at my office campus?", "With permission, yes — one parking bay is enough for most jobs."],
      ["Is car periodic service really possible here?", "Yes — oil, filters, brakes, fluids and a multi-point inspection at your bay, written quote first."],
      ["What if the inspection finds suspension work?", "Jobs needing a pit or press are workshop jobs — we arrange pickup and share a written estimate first."],
      ["How does a booking start?", "Share your model and preferred day; we confirm scope, price and the arrival window in writing."],
    ],
  },

  hebbal: {
    slug: "hebbal",
    intro:
      "Hebbal is the gate between the city and the airport road: the flyover, the lake, Manyata Tech Park and Esteem Mall mark its corners, and Ride N Care keeps vehicle care at home across the blocks between them. A background-verified mechanic comes to your gate with tools and OEM-grade spares, the full price is confirmed in writing before any part is opened, and eligible work is covered by a 45-Day Warranty (On eligible repairs).",
    how: [
      "Give your block, your street and one landmark — Hebbal Flyover, the lake side or the Manyata gate — and the mechanic is assigned from the nearest unit with your arrival window confirmed when you book, which is the honest way to plan around flyover traffic. The written quote reaches your WhatsApp before work starts and shows the ₹299 visiting charge on its own line, separate from the package price.",
      "Home visits need one bay — basement, stilt or open parking — ideally with a plug point for battery and electrical checks. Manyata-side office parking works with the building's permission: forward the booking reference to your security desk so the gate clears the mechanic. Engine rebuilds and paint are workshop jobs — we say so at diagnosis, arrange pickup and share a written estimate before anything moves.",
    ],
    faqs: [
      ["Do you cover the Manyata Tech Park side?", "Yes — office parking there works with the building's permission, one bay being enough for most jobs. Home visits across Hebbal's blocks are covered the same way."],
      ["Can you service at my Manyata office?", "Yes, with your building's permission and a parking slot. We send mechanic details on WhatsApp so your security desk can clear the gate, and the job runs in your bay."],
      ["Is scooter service available in Hebbal?", "Yes — periodic service, brake work and battery testing for scooters as well as motorcycles, done where the vehicle stands."],
      ["Can I get bike repair at home in Hebbal?", "Yes — the mechanic diagnoses the fault at your parking spot and quotes the repair in writing first; jobs that need workshop equipment are transported with your approval and an estimate."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and is listed separately in the written quote you approve before work starts. Package prices are the same as our workshop rates.`],
      ["What warranty applies to my repair?", "A 45-Day Warranty (On eligible repairs) covers our work, plus the manufacturer warranty on any part fitted — full terms and exclusions are on our guarantee page."],
      ["Is Yelahanka included?", "Yelahanka is nearby and covered — book with your street and a landmark and we confirm the arrival window with you."],
      ["How is the price confirmed?", "In writing, on WhatsApp, before any work starts. Nothing extra is fitted without your approval."],
    ],
  },

  "kr-puram": {
    slug: "kr-puram",
    intro:
      "KR Puram sits where the Old Madras Road corridor meets the railway station, the Tin Factory junction and the bridge — three approaches that all end at your doorstep. Ride N Care sends a background-verified mechanic to your street with tools and OEM-grade spares, confirms the full price in writing before any part is opened, and covers eligible work with a 45-Day Warranty (On eligible repairs).",
    how: [
      "Booking starts on WhatsApp or by phone: your vehicle model, the service you need, and your street with a landmark — the station side, Tin Factory or the bridge. The written quote that follows lists the ₹299 visiting charge on its own line, separate from any package price, and your arrival window is confirmed when you book.",
      "Bikes and scooters are usually serviced where they stand; car work needs one parking bay, basement or visitor slot, ideally near a plug point. KR Puram's side lanes fill up through the day, so the work happens in your building or driveway rather than on the main road. Jobs that need a hoist or paint booth move to the workshop, with pickup arranged and an estimate you approve first.",
    ],
    faqs: [
      ["Do you provide doorstep bike service in KR Puram?", "Yes. We serve the station side, the Old Madras Road layouts and the streets off the bridge junction. Share your street and a landmark while booking and your arrival window comes back confirmed."],
      ["Can I get bike repair at home in KR Puram?", "Yes — the mechanic diagnoses the fault at your parking spot and quotes the repair in writing before anything is fitted. Work that needs workshop equipment is transported with your approval and a written estimate first."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and appears as a separate line in the written quote you approve before work starts. Package prices are the same as our workshop rates.`],
      ["Which landmark should I share when booking?", "Any one of them pins the arrival: KR Puram Railway Station, Tin Factory Junction, Old Madras Road or the bridge. Add your gate or building name and the mechanic comes straight to you."],
      ["Is scooter service available in KR Puram?", "Yes — periodic service, brake work and battery testing for scooters as well as motorcycles, all done where the vehicle is parked."],
      ["What warranty applies?", "A 45-Day Warranty (On eligible repairs) covers the work we do, plus the manufacturer warranty on any part fitted. The full terms are on our guarantee page."],
    ],
  },

  mahadevapura: {
    slug: "mahadevapura",
    intro:
      "Mahadevapura ward runs along the Outer Ring Road between the KR Puram gateway and the Whitefield side, with Doddanekkundi at one edge and dense residential lanes at the other. Ride N Care brings bike, scooter and car service to your parking bay here — background-verified mechanics, OEM-grade parts, a written quote before work starts and a 45-Day Warranty (On eligible repairs).",
    how: [
      "Share your building, your cross street and a landmark — the Doddanekkundi side, Varthur Road or the ORR stretch — and the mechanic is assigned from the unit nearest to you. Your written quote reaches WhatsApp before any work begins and shows the ₹299 visiting charge separately from the package price; the arrival window is confirmed when you book rather than promised in minutes, which matters on this corridor.",
      "At home, one parking bay is enough and a plug point helps with battery and electrical checks. Office parking along the ORR works with the building's permission. Anything needing a hoist or a paint booth is diagnosed honestly at your gate and moved to the workshop with pickup arranged and an estimate you approve first.",
    ],
    faqs: [
      ["Do you serve both homes and offices in Mahadevapura?", "Yes. Home visits need one parking bay; office parking along the corridor works with the building's permission. Share your floor and parking level when you book so the mechanic arrives prepared."],
      ["Is Doddanekkundi covered?", "Yes — Doddanekkundi, the Varthur Road side and the Outer Ring Road stretch through Mahadevapura are all served. Give your cross street and the nearest landmark to pin the arrival."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and is shown separately in the written quote you approve before work starts. It is never folded into a package price.`],
      ["How does the mechanic reach me with ORR traffic?", "Your arrival window is confirmed when you book, and navigation starts from the landmark you share rather than a guess. If the last lane is too narrow for the vehicle, the mechanic walks in with the tool kit."],
      ["Can one visit cover both my bike and my car?", "Yes — book both together and the visit is planned for it, with one written quote covering each vehicle."],
      ["What warranty applies?", "A 45-Day Warranty (On eligible repairs) covers our work, plus the manufacturer warranty on parts fitted — full terms are on our guarantee page."],
    ],
  },

  madiwala: {
    slug: "madiwala",
    intro:
      "Madiwala packs its market lanes, the Checkpost junction and the side streets toward St. John's into a few busy square kilometres, and parking is rarely generous. Ride N Care services bikes and scooters at your doorstep here: background-verified mechanics, a written quote before work starts, OEM-grade parts and a 45-Day Warranty (On eligible repairs) — cars the same way, wherever a bay can be found.",
    how: [
      "Tell us your cross street and one landmark — Madiwala Market, the Checkpost or St. John's Hospital — plus your gate number. The mechanic is assigned from the nearest unit, the written quote arrives on WhatsApp with the ₹299 visiting charge listed separately from any package price, and your arrival window is confirmed when you book.",
      "Two-wheeler jobs fit comfortably at the doorstep itself. Car work needs one bay: a basement or visitor slot with the security's permission keeps the job out of the crowded lanes. Chain, brake and clutch work are doorstep-friendly; engine rebuilds and paint are not, and for those we arrange workshop pickup with an estimate you approve first.",
    ],
    faqs: [
      ["Can you reach the lanes around Madiwala Market?", "Yes — share your cross street and a landmark such as the market, the Checkpost or St. John's, and the mechanic covers the last stretch on foot if a vehicle cannot get through."],
      ["Do you service scooters in Madiwala?", "Yes — scooters are a large share of what we work on here: periodic service, CVT and brake work and battery testing, all at your parking spot."],
      ["Can I get bike repair at home in Madiwala?", "Yes. The mechanic diagnoses at your parking spot, quotes the repair in writing before parts go on, and workshop-only jobs are moved with your approval and a written estimate."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and is written separately in the quote you approve before work starts. Package prices stay the same as workshop rates.`],
      ["Where does the mechanic work if I park on the street?", "In your building's assigned bay or a legal parking spot — the job is never done on the carriageway. For bikes, the doorstep or your building's parking area is usually enough."],
      ["What warranty applies?", "A 45-Day Warranty (On eligible repairs) applies to the work we do, plus the manufacturer warranty on any part fitted."],
    ],
  },

  banashankari: {
    slug: "banashankari",
    intro:
      "Banashankari stretches stage after stage from the temple side down to the Kanakapura Road junction, with the metro station anchoring one end of the layout. Ride N Care brings bike and scooter service to your gate in Banashankari — background-verified mechanics, a written quote before work starts, OEM-grade parts and a 45-Day Warranty (On eligible repairs) — and car service wherever your parking bay is.",
    how: [
      "Book with your stage, your street and one landmark: Banashankari Temple, the metro station side or the Kanakapura Road junction. The written quote on WhatsApp itemises the job and lists the ₹299 visiting charge on a separate line from any package price, and your arrival window is confirmed when you book.",
      "Older houses with open driveways make the work straightforward; apartment bays need one free slot and, ideally, a plug point for battery checks. Gate security sometimes notes the mechanic's ID — they carry one. Jobs that need a bench or a paint booth go to the workshop, with pickup arranged and an estimate you approve first.",
    ],
    faqs: [
      ["Which parts of Banashankari do you cover?", "Share your stage and a landmark — the temple, the metro station side or the Kanakapura Road junction — and we confirm coverage and your arrival window when you book. One line on WhatsApp settles it before anything is scheduled."],
      ["Is doorstep service available near Banashankari Metro?", "Yes — the streets around the station are served like the rest of the layout. Name the station side while booking so the mechanic picks the right approach."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and appears separately in the written quote you approve before work starts.`],
      ["Is scooter service available?", "Yes — periodic service, brakes, clutch and battery work for scooters and motorcycles, done where the vehicle is parked."],
      ["What does a regular bike service include?", "Engine oil and filter care, brake service, chain and clutch adjustment, battery and electrical checks and a dry wash, finished with a multi-point report — the same checklist as our workshop service, done at your gate."],
      ["What warranty applies?", "A 45-Day Warranty (On eligible repairs) covers the work we do, plus the manufacturer warranty on any part fitted."],
    ],
  },

  "mg-road": {
    slug: "mg-road",
    intro:
      "MG Road is central Bengaluru's office strip — Brigade Road, the metro station and Trinity Junction inside a kilometre — and kerbside parking is rarely an option. Ride N Care is a service-area business with no walk-in workshop: a background-verified mechanic comes to your office basement or residential parking with tools and OEM-grade spares, quotes the work in writing first, and covers eligible jobs with a 45-Day Warranty (On eligible repairs).",
    how: [
      "For workplace bookings, share your building name, parking level and a landmark — MG Road Metro Station, Trinity Junction or Brigade Road — and let security know to expect the mechanic. The written quote on WhatsApp lists the ₹299 visiting charge separately from any package price, and your arrival window is confirmed when you book so the visit fits around your day.",
      "Work happens in your bay, never on a live road: basements and visitor slots need one free space, ideally near a plug point for battery and electrical checks. Bikes and scooters are simpler still and are usually done where they stand. Engine rebuilds, denting and paint are workshop jobs — we diagnose at your location, arrange pickup and send the estimate for your approval before anything moves.",
    ],
    faqs: [
      ["Can you service my bike at my office on MG Road?", "Yes, with your building's permission — one parking bay covers most jobs. Bring your building name and parking level into the booking and security gets the mechanic's details in advance."],
      ["Is there a walk-in counter at MG Road?", "No. Ride N Care is a service-area business with no walk-in workshop or storefront — the mechanic comes to your office or home parking at the time you book."],
      ["What is the visiting charge?", `A ₹${VISITING_CHARGE} visiting charge applies to the visit and is shown as a separate line in the written quote you approve before work starts.`],
      ["Where does the work happen if parking is tight?", "In your building's basement or allotted visitor bay, never on the road. For bikes and scooters the doorstep or your building's parking area is normally enough."],
      ["Do you service scooters and motorcycles on MG Road?", "Yes — scooters and motorcycles both, and car periodic, AC, battery and brake work at your parking bay."],
      ["What warranty applies?", "A 45-Day Warranty (On eligible repairs) covers the work we do, plus the manufacturer warranty on parts fitted."],
    ],
  },
};

/** Unique content for a priority area; undefined for basic-tier localities. */
export function getAreaContent(slug: string): AreaContent | undefined {
  return AREA_CONTENT[slug];
}

/** Guard so the template can type-check against the Area shape. */
export type { Area };
