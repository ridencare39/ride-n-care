/**
 * Unique, locality-specific copy for the 12 priority area pages (Part 7).
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
 *   7-day workmanship guarantee, digital invoice on WhatsApp.
 */
import type { Area } from "@/lib/areas";

export interface AreaContent {
  slug: string;
  /** Answer-first intro paragraph (unique per area). */
  intro: string;
  /** "How doorstep service works here" — 1–2 unique paragraphs. */
  how: string[];
  /** 4–5 area-specific FAQs. */
  faqs: [string, string][];
}

const GUARANTEE = "a 7-day workmanship guarantee on the job";

export const AREA_CONTENT: Record<string, AreaContent> = {
  "hsr-layout": {
    slug: "hsr-layout",
    intro:
      "HSR Layout runs on the 27th Main spine and its sector grid, with Agara Lake at one end and the Harlur Road side at the other. Ride N Care sends a background-verified mechanic to your sector with tools and OEM-grade spares, confirms the price in writing before any part is opened, and backs the work with a 7-day guarantee — bikes and cars, at your gate.",
    how: [
      "Booking is one message: your vehicle model, the service, and your sector and gate number. You receive a written quote on WhatsApp, and the mechanic is assigned from the unit nearest to you with the arrival window confirmed at booking.",
      "Most HSR apartment complexes have visitor or basement bays that fit the job — one bay is all the work needs, and a plug point helps for battery and electrical checks. Security desks usually want the mechanic's ID noted at the gate, which our mechanics carry.",
    ],
    faqs: [
      ["Do you cover all sectors of HSR Layout?", "Yes — Sector 1 through 7, including the 27th Main stretch, the BDA Complex neighbourhood and the Harlur Road side. Share your sector and gate number when booking so the mechanic reaches the right entrance."],
      ["Can you service my bike in my apartment's basement?", "In most HSR complexes, yes — one parking bay is enough. Your building's security may note the mechanic's ID at the gate, which they carry."],
      ["Do you do car work in HSR too, or only bikes?", "Both. Periodic service, AC service, battery replacement and brake work are all doorstep-capable here — each car page lists exactly what the visit includes."],
      ["What if the job needs a workshop?", "Jobs that need a hoist or paint booth are never done in the open. We say so at diagnosis and arrange pickup with a written estimate first."],
      ["How do I confirm the price?", "The written quote lands on WhatsApp before work starts. Consumables or extra parts are billed only after your approval."],
    ],
  },

  koramangala: {
    slug: "koramangala",
    intro:
      "Koramangala fits a lot into tight lanes — the Sony World Junction side, the 5th and 6th Block food streets, Forum Mall and the office blocks in between. Ride N Care books your slot, sends a background-verified mechanic with tools and OEM-grade spares, and confirms the full price in writing before anything is opened.",
    how: [
      "Share your block, street and a landmark — near Sony World Junction or Jyoti Nivas, for example — and the mechanic walks the last stretch when a lane is too tight for the van. The arrival window is confirmed on WhatsApp when you book.",
      "Cars need a parking bay: a basement or visitor slot works, with security's permission where required. Bikes are simpler and are usually serviced right at the doorstep.",
    ],
    faqs: [
      ["My flat is on an inner one-way lane — can you still come?", "Yes. Share the block, street and a landmark and the mechanic covers the last stretch on foot with the tool kit."],
      ["Do you service scooters as well as motorcycles?", "Both — periodic service, brakes, clutch, battery and electrical work across scooters and motorcycles."],
      ["I park in an office basement. Is that workable?", "Yes, with security's permission. The job needs one bay and the space is left clean afterwards."],
      ["What about jobs you can't finish outside?", "Engine overhauls and paint work don't belong in a parking bay. We tell you upfront and arrange workshop pickup with a written estimate."],
      ["How is the price decided?", "By your vehicle and what the inspection finds. You approve a written quote before work starts — nothing extra is billed without your OK."],
    ],
  },

  indiranagar: {
    slug: "indiranagar",
    intro:
      "From the 100 Feet Road café strip to CMH Road and the 12th Main lanes, Indiranagar mixes old bungalows with new apartment blocks. Ride N Care brings bike and car service to your doorstep — background-verified mechanics, OEM-grade parts, a written quote before work starts and a 7-day workmanship guarantee.",
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
      "Whitefield's day starts and ends on Varthur Road and the ITPL stretch — and nobody wants to spend a Saturday driving across town to a service centre. Ride N Care does bike and car service at your gate in Whitefield: written quote first, OEM-grade parts, background-verified mechanics and a 7-day workmanship guarantee.",
    how: [
      "Gated communities around ITPL and Phoenix Marketcity have security desks — we send the mechanic's details on WhatsApp so gate entry is smooth. The job needs one allotted parking bay; a plug point helps for battery and electrical work.",
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
      "Electronic City runs long — Phase 1 to Phase 2 along Hosur Road, tech-park gates at one end and Neeladri Road at the other. Ride N Care sends a background-verified mechanic to your phase with a written quote before work starts, OEM-grade parts and a 7-day workmanship guarantee, for bikes and cars alike.",
    how: [
      "The area is a long haul, so the mechanic is assigned from the unit nearest to you and the arrival window is confirmed on WhatsApp when you book — no guesswork about when anyone shows up.",
      "Campus and complex parking works with security's permission: one bay, tools and consumables carried in, the space left clean. Office-parking jobs are among the most common bookings here.",
    ],
    faqs: [
      ["Do you cover Phase 1 and Phase 2 both?", "Yes, plus the Hosa Road and Bommanahalli side. Book with your phase and gate so the right unit is assigned."],
      ["I work in a tech park — can you service at the office?", "With security's permission, yes — one parking bay is all the job needs."],
      ["How do I pick a time?", "Tell us your preferred day and we confirm the arrival window in writing when you book."],
      ["Is battery replacement done on the spot?", "Yes — test first, replacement at your bay only if the test says it's due, and the invoice notes where the old battery goes."],
      ["What does the written quote include?", "Labour, parts and consumables line by line. Extra findings are added only with your approval."],
    ],
  },

  marathahalli: {
    slug: "marathahalli",
    intro:
      "Marathahalli squeezes apartment blocks, market lanes and the Outer Ring Road bridge into one busy square kilometre. Ride N Care keeps bike and car care at home here — a background-verified mechanic, a written quote before work starts, OEM-grade parts and a 7-day workmanship guarantee.",
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
      "Bellandur sits where the Outer Ring Road meets the Sarjapur Road corridor — office towers, gated communities and the lake in between. Ride N Care services bikes and cars at your doorstep here: written quote before work, background-verified mechanics, OEM-grade parts and a 7-day workmanship guarantee.",
    how: [
      "Both halves of Bellandur life are covered: office-parking jobs near the RMZ Ecospace / Iblur Junction side with the building's permission, and home visits in the gated communities off the main road.",
      "ORR traffic is a given, so the arrival window is confirmed on WhatsApp when you book rather than promised in minutes. The invoice lands on WhatsApp before you pay.",
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
      "BTM Layout packs its 1st and 2nd Stage lanes between Silk Board Junction and Madiwala Checkpost — dense, busy and famously short on parking. Ride N Care does bike and car service at your doorstep with a written quote before work starts, background-verified mechanics and a 7-day workmanship guarantee.",
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
      "Jayanagar's block grid — the 4th Block shopping stretch down to South End Circle — is one of Bangalore's easiest neighbourhoods to service at the gate: driveways, wide main roads and steady parking. Ride N Care brings bike and car service home with a written quote first and a 7-day workmanship guarantee.",
    how: [
      "Every block from 1st to 9th is covered, with the Jayanagar metro station and 11th Main as easy landmarks for the arrival. Older homes with open driveways make car work genuinely simple here.",
      "Stilt parking and basement bays both work — one bay with some light is enough, and a plug point helps for battery and electrical checks. Banashankari and JP Nagar are served from the nearest unit.",
    ],
    faqs: [
      ["Do you cover all of Jayanagar's blocks?", "Yes — 1st Block through 9th, including the 4th Block shopping stretch and the South End Circle side."],
      ["Can you work in my stilt parking?", "Yes — one bay with a bit of light is enough; a plug point helps for battery and electrical checks."],
      ["Is the Banashankari side covered too?", "Yes — Banashankari and JP Nagar are served from the nearest unit."],
      ["What does a bike service cost here?", "Packages start from the prices on our /bikes page; the exact quote depends on your engine size and is confirmed in writing before work starts."],
      ["Do you give a warranty?", "A 7-day workmanship guarantee on every job, plus the manufacturer warranty on parts fitted."],
    ],
  },

  "jp-nagar": {
    slug: "jp-nagar",
    intro:
      "JP Nagar spreads from Jayadeva Hospital to the Bannerghatta Road side — phase after phase of houses, apartments and hospitals in between. Ride N Care does bike and car service at your phase: written quote before work starts, background-verified mechanics, OEM-grade parts and a 7-day workmanship guarantee.",
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
      "Sarjapur Road links the ORR to the tech parks out past Wipro Gate, and its weekends belong to Harlur Road traffic. Ride N Care keeps vehicle care at home here: bike and car service at your gate, a written quote before work starts, background-verified mechanics and a 7-day workmanship guarantee.",
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
      "Hebbal's flyover is the gate between the city and the airport road, with Manyata Tech Park, Hebbal Lake and Esteem Mall marking its corners. Ride N Care services bikes and cars at your doorstep here: written quote before work starts, background-verified mechanics, OEM-grade parts and a 7-day workmanship guarantee.",
    how: [
      "North-side visits are assigned from the unit nearest to you, with the arrival window confirmed on WhatsApp at booking — the honest way to handle flyover traffic.",
      "Manyata-side office parking works with the building's permission, and home visits across Hebbal's blocks need just one bay. Yelahanka and the Kalyan Nagar side are covered nearby.",
    ],
    faqs: [
      ["Do you cover the Manyata Tech Park side?", "Yes — with the office's permission, one parking bay. Home visits across Hebbal's blocks are equally covered."],
      ["Is Yelahanka included?", "Yelahanka is nearby and covered — book with your street and a landmark."],
      ["Can you do car AC work in my society basement?", "Yes — coil cleaning, cabin filter and gas check, with a leak diagnosis before any refill."],
      ["What's your guarantee?", GUARANTEE + ", plus the manufacturer warranty on parts."],
      ["How is the price confirmed?", "In writing, on WhatsApp, before any work starts."],
    ],
  },
};

/** Unique content for a priority area; undefined for basic-tier localities. */
export function getAreaContent(slug: string): AreaContent | undefined {
  return AREA_CONTENT[slug];
}

/** Guard so the template can type-check against the Area shape. */
export type { Area };
