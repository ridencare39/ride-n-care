/**
 * AEO answer pages (Part 8) — the question bank that drives /answers/{slug}.
 *
 * Content rules (Part 8 brief):
 * - One question per page, used verbatim as the H1.
 * - `answer` is the answer-first paragraph: 40–60 words, self-contained so it
 *   makes sense lifted alone (voice search / AI citation).
 * - Only facts already live on service pages or in src/lib config
 *   (src/lib/pricing.ts, src/lib/services.ts, src/lib/car-services.ts, src/lib/areas.ts).
 * - Nothing logged as [OWNER TO CONFIRM] in docs/seo/OWNER-QUESTIONS.md
 *   (car job durations, mechanic ID check, battery recycling, free cancellation,
 *   free pickup claims, ratings, customer counts, same-day) appears here.
 * - General maintenance guidance is conservative and defers to the owner's manual.
 * - updated = real last-reviewed date.
 */

export type AnswerCategory =
  | "cost"
  | "time"
  | "process"
  | "trust"
  | "coverage"
  | "emergency"
  | "comparison"
  | "care"
  | "car";

export const ANSWER_CATEGORIES: { id: AnswerCategory; label: string }[] = [
  { id: "cost", label: "Cost & pricing" },
  { id: "time", label: "Time & booking" },
  { id: "process", label: "How it works" },
  { id: "trust", label: "Trust & guarantees" },
  { id: "coverage", label: "Coverage & areas" },
  { id: "emergency", label: "Emergency & breakdown" },
  { id: "comparison", label: "Comparisons" },
  { id: "care", label: "Care & vehicle-specific" },
  { id: "car", label: "Car service" },
];

export interface AnswerPage {
  slug: string;
  /** The question, used verbatim as the page H1. */
  question: string;
  category: AnswerCategory;
  /** Answer-first paragraph (40–60 words), self-contained for voice search. */
  answer: string;
  /** 120–155 char meta description (a complete sentence, no truncation). Used for meta, og and twitter. */
  meta?: string;
  /** Supporting paragraphs. */
  detail?: string[];
  bullets?: string[];
  /** Simple comparison/price table (head + rows). */
  table?: { head: string[]; rows: string[][] };
  /** Extra visible Q&As — rendered on the page AND emitted as FAQPage JSON-LD. */
  faqs: [string, string][];
  /** Other answer slugs for "Related questions". */
  related: string[];
  /** Service slugs (src/lib/services.ts / car-services.ts) to link. */
  services: string[];
  /** Real last-updated date (ISO). */
  updated: string;
}

const UPDATED = "2026-09-20";

export const ANSWER_PAGES: AnswerPage[] = [
  // ─── Batch 3 additions (2026-09-27) — question-bank gaps, unique answers ───
  {
    slug: "car-service-interval",
    question: "How often should I get my car serviced?",
    category: "car",
    answer:
      "Follow the service interval in your car's owner's manual — it is stated in months and kilometres, whichever comes first, and modern cars commonly fall between 6 and 12 months or 5,000 and 10,000 km. Bangalore's stop-start traffic, short trips and dust are severe-use conditions, so service at or slightly ahead of the manual schedule.",
    meta:
      "Service your car on the owner's-manual interval — months and kilometres, whichever comes first — and lean towards the earlier end in Bangalore traffic.",
    detail: [
      "The manual interval is the baseline, not a suggestion to stretch: the schedule assumes average conditions, and dense city driving with constant braking, short trips that never fully warm the engine, and dusty air all push wear faster. Severe-condition schedules in most manuals describe exactly this kind of use.",
      "What actually happens at each visit scales with the interval: periodic service is inspection-led — fluids, filters, brakes, tyres, suspension, electrics — with replacements quoted separately after measurement. Between visits, dashboard warning lights and any change in brake feel or unusual noise are worth an early check rather than waiting for the next due date.",
      "Do not wait for the odometer if the calendar wins first. Oil ages with heat cycles and moisture even when the car is parked, which is why a lightly driven car still needs its time-based service — and why the invoice records the date and odometer so the next due point is calculated from real data.",
    ],
    faqs: [
      ["Do I need a service even if the car feels fine?", "Yes — most wear in a periodic service is found by inspection, not felt from the driver's seat. The manual interval exists because several items age with time, not just distance."],
      ["My car shows a service-due reminder — can I wait?", "The reminder follows the manufacturer's schedule; book within a reasonable margin of it rather than postponing repeatedly, especially with city use."],
      ["Does a periodic service reset the service clock?", "Yes — each visit records the date and odometer reading, and the next due point is calculated from there, so book from the invoice, not from memory."],
    ],
    related: ["what-included-car-service", "car-service-cost-bangalore", "how-to-prepare-car-doorstep"],
    services: ["car-periodic-service", "cars"],
    updated: "2026-09-27",
  },
  {
    slug: "ev-what-can-be-serviced",
    question: "What can be serviced on an electric two-wheeler at home?",
    category: "care",
    answer:
      "The mechanical side: brakes, tyres, suspension and running gear, plus a general inspection package with battery health check, charging-port inspection and controls check. Battery packs, BMS and motor faults stay with the manufacturer's service network.",
    meta:
      "EV doorstep service covers brakes, tyres, suspension and running gear with inspection checks — battery packs, BMS and motor faults stay with the manufacturer.",
    detail: [
      "Electric scooters remove engine oil and fuel systems from the checklist and sharpen the mechanical one. The doorstep work is brakes, tyres, wheels, suspension and controls — plus a general service package that includes a battery health check and charging-port inspection so early warning signs get caught and referred.",
      "The boundary matters as much as the list: high-voltage systems are manufacturer-network work. A doorstep mechanic who claims battery or motor repair on an EV is the wrong call — the honest answer is the referral, and Ride N Care states it at booking rather than after.",
    ],
    faqs: [
      ["Do you replace EV batteries?", "No — battery packs and BMS faults stay with the manufacturer's service network. We flag what the battery health check shows and refer you."],
      ["Is there a fixed-price EV service package?", "Yes — EV General Service is ₹999, EV Running Repair is ₹450 and EV Jump Start is ₹399, each confirmed in writing before work starts."],
    ],
    related: ["ev-service-different", "ev-service-cost", "scooter-service-cost"],
    services: ["scooter-service", "bike-service"],
    updated: "2026-09-27",
  },
  {
    slug: "ktm-duke-200-service-cost",
    question: "How much does a KTM Duke 200 service cost in Bangalore?",
    category: "cost",
    answer:
      "Ride N Care's General Service for the KTM Duke 200 is ₹999 (the 200–249cc tier), or ₹1,449 with engine oil replacement. Jump Start is ₹399 and Running Repair ₹450; parts such as brake pads are quoted at MRP and shown to you before fitting.",
    meta:
      "KTM Duke 200 doorstep service in Bangalore: ₹999 General Service, ₹1,449 with engine oil — written quote before work starts, parts at MRP after approval.",
    detail: [
      "The Duke 200's 199cc engine places it in the 200–249cc price tier. Like every current KTM sold in India it is fuel-injected and liquid-cooled, so the visit includes a coolant condition check and an FI diagnostics scan alongside the standard oil, chain, brake and electrical work.",
      "The package price covers the labour and checklist; the bill changes only when parts are needed. Those are quoted at MRP and shown before fitting, and the total is confirmed in writing before work starts — no parking-bay surcharge on top.",
    ],
    faqs: [
      ["Is the Duke 200 serviced differently from the Duke 390?", "The checklist is the same; the price tier differs — ₹999 for the 200 against ₹1,199 for the 390 in the 250–400cc tier."],
      ["Do you work on Dukes in apartment basements?", "Yes — one parking bay and a plug point is all it needs; the engine runs briefly for coolant and FI checks."],
    ],
    related: ["bike-service-cost-bangalore", "how-long-bike-service"],
    services: ["bike-service", "motorcycle-service"],
    updated: "2026-09-27",
  },
  {
    slug: "brake-warning-signs-bike",
    question: "What are the warning signs my bike brakes need service?",
    category: "care",
    answer:
      "Squealing or grinding sounds, a lever or pedal that travels further than before, longer stopping distances, pulsation when braking, or a grind of metal on metal all mean the brakes need inspection. In Bangalore's rain, a temporary squeal can just be wet pads — persistent noise is not.",
    meta:
      "Squeal, longer lever travel, longer stopping distances or pulsation mean your bike brakes need inspection — grinding means pads are done, don't ride it out.",
    detail: [
      "Brakes wear quietly and then announce themselves. Pad thickness is a measurement, not a feeling — on a doorstep visit the mechanic measures both wheels, shows you the numbers, and quotes replacement at MRP only if the pads are near or past the limit. Discs are measured too, so a reusable disc is not replaced on a hunch.",
      "Rain complicates the read: water on the rotor can cause a short-lived squeal that disappears once things dry out. The rule of thumb — sound that persists across rides, or any change in lever feel or stopping distance, gets inspected rather than waited out.",
    ],
    faqs: [
      ["Can brake pads be replaced at my home?", "Yes — pad replacement is a doorstep job, with discs measured to confirm whether they are reusable."],
      ["My brakes squeal only in the monsoon — normal?", "Wet-pad squeal usually stops when things dry; if it persists across dry rides, book an inspection."],
    ],
    related: ["monsoon-bike-care", "bike-service-cost-bangalore", "car-brake-noise-causes"],
    services: ["brake-service", "bike-service"],
    updated: "2026-09-27",
  },

  // ─── Cost & pricing ─────────────────────────────────────────────────────────
  {
    slug: "bike-service-cost-bangalore",
    question: "How much does bike service cost in Bangalore?",
    category: "cost",
    answer:
      "Bike service at Ride N Care starts at ₹799 for General Service on bikes up to 199cc, ₹999 for 200–249cc, ₹1,199 for 250–400cc, ₹1,399 for 401–500cc, ₹1,799 for 501–800cc and ₹2,499 for 801cc and above. With engine oil replacement, General Service starts at ₹1,249.",
    meta: "Bike service in Bangalore starts at ₹799 General Service up to 199cc, scaling by engine size — the full price list, and what changes the final bill.",
    detail: [
      "Prices are published by engine size because bigger engines take more oil, bigger filters and more labour. The table below is the full, current price list — the same figures shown in the booking flow.",
      "What changes the final bill: engine capacity (the package price), whether the engine-oil package is added, and any extra parts such as brake pads, a battery or a chain-sprocket set. Parts are quoted at MRP and shown to you before fitting, and consumables or extra parts are billed only after your approval. The exact amount is confirmed in writing before work starts.",
    ],
    table: {
      head: ["Service", "Up to 199cc", "200–249cc", "250–400cc", "401–500cc", "501–800cc", "801cc+"],
      rows: [
        ["General Service", "₹799", "₹999", "₹1,199", "₹1,399", "₹1,799", "₹2,499"],
        ["General Service + Engine Oil", "₹1,249", "₹1,449", "₹2,449", "₹3,949", "₹4,499", "₹5,999"],
        ["Jump Start", "₹399", "₹399", "₹399", "₹399", "₹399", "₹399"],
        ["Running Repair", "₹450", "₹450", "₹450", "₹450", "₹450", "₹450"],
      ],
    },
    faqs: [
      ["Does the bike service price include engine oil?", "Only the General Service + Engine Oil package includes oil replacement — it starts at ₹1,249 for bikes up to 199cc. Plain General Service checks the oil and starts at ₹799."],
      ["Are parts extra on top of the package price?", "Yes — parts such as brake pads or a battery are quoted at MRP separately and shown to you before fitting. Nothing is fitted without your approval."],
      ["Is there a doorstep charge on top?", "No. Package prices are the same at your doorstep as in the workshop — the written quote you approve is the full scope of the visit."],
    ],
    related: ["bike-repair-cost", "scooter-service-cost", "how-long-bike-service"],
    services: ["bike-service", "doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "car-service-cost-bangalore",
    question: "How much does car service cost in Bangalore?",
    category: "cost",
    answer:
      "Ride N Care does not publish fixed car service prices, because the quote depends on your car's make, model and engine. The oil grade and capacity, filter type, brake condition and refrigerant type all change the cost. Share your model and the exact price is confirmed in writing before work starts.",
    meta: "Car service pricing in Bangalore depends on model, oil grade and parts condition — what drives the quote, confirmed in writing before work starts.",
    detail: [
      "What drives the price of a doorstep car service:",
      "Quoting a generic range would be guessing, so none is published — share your car's model on WhatsApp or the booking form and the exact amount, parts and labour, is confirmed in writing before any work starts.",
    ],
    bullets: [
      "Engine oil grade and capacity — a large SUV takes several litres more than a hatchback, and full-synthetic oil costs more than semi-synthetic",
      "Filter type — oil, air and cabin filters differ by model, and replacement is quoted only when the inspection shows it is due",
      "Brake condition — pad and disc sizes vary widely between models, and wear is measured before anything is quoted",
      "AC refrigerant type and quantity, for AC service",
      "Battery capacity, for battery replacement",
    ],
    faqs: [
      ["Why don't you publish car service prices like bike prices?", "Bike packages are priced by engine size, which is one variable. Car quotes depend on model-specific oil capacity, filter types and brake parts, so we confirm the exact figure in writing after you share the model."],
      ["Do you charge for the car inspection?", "Brake, battery and charging-system inspections are free. The periodic-service checklist is part of the booked package."],
      ["Are consumables billed separately?", "Consumables and any extra parts are billed only after your approval, and everything fitted appears on the digital invoice."],
    ],
    related: ["bike-service-cost-bangalore", "how-long-car-service", "doorstep-vs-garage-car"],
    services: ["car-periodic-service", "car-ac-service", "car-battery-service", "car-brake-service"],
    updated: UPDATED,
  },
  {
    slug: "bike-repair-cost",
    question: "How much does bike repair cost in Bangalore?",
    category: "cost",
    answer:
      "Running Repair costs ₹450 across every engine size, which covers the initial fault inspection, minor repair labour and a safety check afterwards. Diagnosis is free. Any parts are quoted at MRP and shown to you before fitting, and bigger jobs get an itemised written estimate approved before work starts.",
    meta: "Bike repair in Bangalore starts with free diagnosis; Running Repair is ₹450 with parts quoted at MRP and approved before anything is fitted.",
    detail: [
      "This is why repair pricing works differently from a service package: the value is in the diagnosis. A bike that will not start, a noise or a soft brake can have several causes, and guessing means paying for parts you did not need. The ₹450 package covers finding the fault and fixing minor issues; anything larger is estimated itemised, approved by you, then repaired.",
    ],
    faqs: [
      ["Do you charge for diagnosis?", "No. Diagnosis at your doorstep is free and comes with a written finding — you pay only if you approve the repair."],
      ["What if the repair turns out to be major?", "You get an itemised estimate — parts and labour listed separately — and nothing is opened until you approve it in writing."],
      ["Is the ₹450 the total cost?", "It covers inspection, minor repair labour and the safety check. Parts are extra and quoted at MRP before fitting."],
    ],
    related: ["bike-service-cost-bangalore", "bike-wont-start", "roadside-or-garage"],
    services: ["bike-repair", "doorstep-bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "scooter-service-cost",
    question: "How much does scooter service cost in Bangalore?",
    category: "cost",
    answer:
      "A General Service for an automatic scooter up to 199cc costs ₹799, or ₹1,249 with engine oil replacement. Jump Start is ₹399 and Running Repair is ₹450. Extra parts such as a drive belt, brake shoes or a battery are quoted at MRP and approved by you before fitting.",
    meta: "Scooter service in Bangalore is ₹799 General Service up to 199cc, or ₹1,249 with engine oil — the same package prices as bikes of the same size.",
    detail: [
      "Scooters up to 199cc — which covers Activa, Jupiter, Access, Fascino, Pleasure and most automatic scooters on Bangalore roads — fall in the base package. The service includes engine and gear oil attention, CVT inspection, brakes, battery and tyre checks.",
    ],
    faqs: [
      ["Is scooter service cheaper than bike service?", "At the same engine size the package price is the same — ₹799 General Service up to 199cc. Scooters usually need service slightly more often because of short-trip usage."],
      ["What if my scooter needs a CVT belt?", "The belt is quoted for your specific model at MRP before fitting — if it is not in the van, we source it and return."],
    ],
    related: ["bike-service-cost-bangalore", "bike-vs-scooter-maintenance", "ev-service-cost"],
    services: ["scooter-service"],
    updated: UPDATED,
  },
  {
    slug: "battery-jump-start-cost",
    question: "How much does a bike battery jump start cost?",
    category: "cost",
    answer:
      "A Jump Start visit costs ₹399 for any bike, scooter or electric two-wheeler, and it includes a battery condition check, a voltage check, a safe jump start and a basic charging-system check. If the battery itself needs replacement, the new battery is quoted at MRP before it is fitted.",
    meta: "A bike jump start in Bangalore costs ₹399 and includes a battery and charging-system check, so the real cause is found before it strands you again.",
    detail: [
      "The charging-system check matters: a battery that keeps dying usually has a reason — a weak alternator on a car, or a failing regulator/rectifier or drained cell on a two-wheeler. Jump-starting without checking the system is how riders end up stranded twice.",
    ],
    faqs: [
      ["Do you carry replacement batteries?", "Common battery sizes travel with the van, so most replacements are done in the same visit after the test confirms the battery is finished."],
      ["Will you test the battery before replacing it?", "Yes — the load and voltage test comes first, and replacement is recommended only if the test says the battery is genuinely finished."],
    ],
    related: ["bike-repair-cost", "bike-wont-start", "ev-service-cost"],
    services: ["battery-service", "doorstep-bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "ev-service-cost",
    question: "How much does electric scooter or bike service cost?",
    category: "cost",
    answer:
      "Electric two-wheelers have their own fixed-price packages at Ride N Care: EV General Service is ₹999, EV Running Repair is ₹450 and EV Jump Start is ₹399. Each package covers an EV-specific checklist — battery health, charging port, brakes, tyres and electricals — and any extra work needs your approval first.",
    meta: "Electric scooter service at Ride N Care is flat-priced: ₹999 EV General Service, ₹450 Running Repair, ₹399 Jump Start — battery faults stay with the maker.",
    detail: [
      "EV packages are flat-priced — there is no engine-size logic, because there is no engine. The checklist focuses on what an EV actually wears: brakes, tyres, suspension, bearings, connectors and the charging system.",
    ],
    faqs: [
      ["Do you repair EV batteries or motors?", "No — battery-pack and motor faults stay with the manufacturer's service network. We handle everything mechanical and electrical around them."],
      ["Is EV service cheaper than petrol service?", "The EV General Service package is ₹999 versus ₹799 for a petrol bike up to 199cc, but EVs skip engine oil entirely, which removes a recurring cost."],
    ],
    related: ["ev-service-different", "scooter-service-cost", "battery-jump-start-cost"],
    services: ["scooter-service"],
    updated: UPDATED,
  },

  // ─── Time & booking ─────────────────────────────────────────────────────────
  {
    slug: "how-long-bike-service",
    question: "How long does a bike service take at home?",
    category: "time",
    answer:
      "A General Service on a bike or scooter takes 60–90 minutes at your address, and General Service with engine oil replacement takes 75–120 minutes. A Jump Start takes 20–40 minutes. Running Repair time depends on the inspection. Your arrival window is confirmed when you book.",
    meta: "A bike General Service takes 60–90 minutes at your home, and 75–120 minutes with engine oil replacement — the arrival window is confirmed when you book.",
    detail: [
      "Doorstep service does not mean slower service — the mechanic arrives with the tools, oil and filters already on the van, so there is no queue and no handover desk. You can watch the whole job or get on with your day; you are pinged on WhatsApp when it is done.",
    ],
    faqs: [
      ["Does the time include the wash?", "Yes — the dry wash and finish are part of the 60–90 minute General Service window."],
      ["What if extra work is found mid-service?", "The mechanic photographs the issue, explains it and quotes it separately. Approving extra work naturally extends the visit."],
      ["How long does car service take?", "We do not quote fixed car durations — the arrival window is confirmed at booking and the visit runs until the checklist is complete and inspected."],
    ],
    related: ["bike-service-cost-bangalore", "how-long-car-service", "how-to-book"],
    services: ["bike-service", "doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "how-long-car-service",
    question: "How long does a car service take at home?",
    category: "time",
    answer:
      "Ride N Care does not quote fixed durations for car jobs, because the time depends on your car's model and what the inspection finds. When you book, we confirm the mechanic's arrival window, and the visit runs until the checklist is complete and you have inspected the work yourself.",
    meta: "Car job durations are not pre-quoted; your arrival window is confirmed at booking and the visit ends when the checklist is complete and inspected.",
    detail: [
      "This is deliberate: a periodic service on a hatchback with clean filters is a different job from an SUV whose brake discs are scored. Quoting a single duration would mean either padding the estimate or rushing the checklist. What we commit to instead is the arrival window at booking, a written quote before work starts, and a job that finishes when you have inspected it.",
    ],
    faqs: [
      ["Will I know when the mechanic arrives?", "Yes — the arrival window is confirmed when you book, and your arrival window is confirmed when you book."],
      ["Can I book a car service for a specific day?", "Yes — share your preferred day and slot when you book, and the confirmation names the window."],
    ],
    related: ["car-service-cost-bangalore", "what-included-car-service", "doorstep-vs-garage-car"],
    services: ["car-periodic-service"],
    updated: UPDATED,
  },
  {
    slug: "how-to-book",
    question: "How do I book a doorstep bike service in Bangalore?",
    category: "time",
    answer:
      "Call 080 6940 9289 or WhatsApp 82969 50339 with your bike model, your address and a preferred slot, or fill the booking form on the website. You receive a written quote first, and the mechanic is dispatched only after you approve it.",
    meta: "Book doorstep bike service in Bangalore by phone or WhatsApp with your model, address and slot — a written quote arrives before the mechanic is dispatched.",
    detail: [
      "What to have ready: the make and model of your vehicle, what it needs (a routine service, a specific complaint, or a breakdown), your locality or pincode, and a preferred day and time window. That is enough for the written quote.",
    ],
    bullets: [
      "Step 1 — Share the vehicle make, model and the symptom or service",
      "Step 2 — Receive a written quote covering parts, labour and the slot",
      "Step 3 — A Ride N Care mechanic reaches your address with tools and spares",
      "Step 4 — Test ride, pay by UPI, card or cash, and get the digital invoice",
    ],
    faqs: [
      ["Can I book for someone else, like my parents' bike?", "Yes — share their address and the vehicle details, and the quote and updates go to the WhatsApp number you give us."],
      ["How far in advance should I book?", "Same-week slots are usually available; evenings fill first, so booking a day ahead gets the widest choice of windows."],
    ],
    related: ["what-to-prepare", "payment-options", "do-you-work-weekends"],
    services: ["bike-service", "doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "do-you-work-weekends",
    question: "Do you provide bike service on weekends and holidays?",
    category: "time",
    answer:
      "Yes. Doorstep visits are available 24 hours, weekends and holidays included. Share your preferred day on 080 6940 9289 or WhatsApp 82969 50339 and the arrival window is confirmed when you book.",
    meta: "Doorstep bike service in Bangalore is available 24 hours, weekends and holidays included — book by call or WhatsApp and the arrival window is confirmed when you book.",
    detail: [
      "Popular slots fill first, so sharing a second-choice window at booking makes confirmation faster. For routine service, a mid-week booking is usually the easiest way to get the exact window you want.",
    ],
    faqs: [
      ["Are you available late at night?", "Yes — doorstep visits are available 24 hours. Book by call or WhatsApp at any hour; the arrival window is confirmed when you book."],
      ["Do you service on public holidays?", "Yes — doorstep visits are available 24 hours, including holidays. Availability is confirmed when you book."],
    ],
    related: ["how-to-book", "bike-wont-start", "emergency-cost"],
    services: ["emergency-bike-repair", "doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "what-to-prepare",
    question: "What should I prepare before a doorstep service?",
    category: "time",
    answer:
      "Very little: a parking spot with space to work around the vehicle and, ideally, a plug point. If you live in a gated community, allow gate access for the mechanic. Having your last service invoice or noting the symptoms you have noticed also shortens the diagnosis.",
    meta: "For a doorstep service you only need parking space, gate access and ideally a plug point — the mechanic brings tools, oil, filters, spares and a drip tray.",
    detail: [
      "The mechanic brings everything else — tools, oil, filters, common spares, a drip tray and a compressor. If a tap is not available, a dry or low-water wash is used, which is normal in apartment basements.",
    ],
    faqs: [
      ["Do you need my vehicle documents?", "No — the mechanic records the odometer and registration number from the vehicle itself."],
      ["What if my basement has no power socket?", "The job can still run; a plug point simply makes oil top-ups and some tools faster. Mention it at booking so the mechanic comes prepared."],
    ],
    related: ["apartment-basement", "need-to-be-home", "how-to-book"],
    services: ["doorstep-bike-service", "bike-service"],
    updated: UPDATED,
  },

  // ─── How it works ───────────────────────────────────────────────────────────
  {
    slug: "what-included-bike-service",
    question: "What is included in a bike general service?",
    category: "process",
    answer:
      "A Ride N Care General Service covers air filter cleaning, battery voltage check, brake service, cables and levers adjustment, chain tension check, clutch adjustment, dry wash, electrical check-up, engine oil check, greasing and lubrication, oil leakage check and spark plug cleaning — with engine oil replacement added in the oil package.",
    meta: "A bike General Service covers filters, brakes, chain, clutch, cables, battery, electricals and a dry wash — with every item ticked off in front of you.",
    detail: [
      "Every job ends with the checklist items ticked in front of you and anything worn photographed and quoted separately. The invoice lists parts and labour separately, and the work carries a 7-day workmanship guarantee.",
    ],
    faqs: [
      ["Is engine oil included in General Service?", "General Service checks the oil level and condition; replacement is the separate General Service + Engine Oil package, starting at ₹1,249 up to 199cc."],
      ["Is a wash included?", "Yes — a dry wash and finish are part of every General Service."],
      ["How many points are inspected on periodic service?", "The periodic checklist covers 25 points, from brakes and chain to battery, tyres and lights."],
    ],
    related: ["bike-service-cost-bangalore", "how-long-bike-service", "which-oil"],
    services: ["bike-service", "periodic-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "written-quote",
    question: "Do you give a quote before starting work?",
    category: "process",
    answer:
      "Yes. Every job starts with a written quote covering parts, labour and the slot, and nothing is touched until you approve it. If the mechanic finds extra work during the visit, it is photographed, explained and quoted separately — again only with your approval.",
    meta: "Every job starts with a written quote covering parts, labour and the slot — nothing is touched until you approve it, and extra work is quoted separately.",
    detail: [
      "This is the promise to judge any service provider on, including us: the price you approve in writing is the price on the invoice, and anything discovered later waits for your yes. If a provider will not quote in writing before touching the vehicle, that tells you enough.",
    ],
    faqs: [
      ["Is the quote the final price?", "Yes — the written quote is the final price for the agreed scope. Only new work you approve in writing can change it."],
      ["Do I get the quote before the mechanic arrives?", "Yes — the quote reaches you on WhatsApp before dispatch, so you can approve without standing over the bike."],
    ],
    related: ["payment-options", "guarantee", "genuine-parts"],
    services: ["doorstep-bike-service", "bike-service"],
    updated: UPDATED,
  },
  {
    slug: "payment-options",
    question: "How do I pay for the service?",
    category: "process",
    answer:
      "You pay after the work is done and you have taken a short test ride — by UPI, card or cash. A digital invoice listing parts and labour separately reaches your WhatsApp as soon as the job closes. You never pay before the job is done.",
    meta: "Pay by UPI, card or cash after a test ride — the digital invoice listing parts and labour separately reaches your WhatsApp as soon as the job closes.",
    detail: [
      "The invoice matters beyond the payment: it lists each part fitted, which is what you compare against the approved quote, and it is your record for the workmanship guarantee and any manufacturer warranty on the parts.",
    ],
    faqs: [
      ["Do you accept card payments at the doorstep?", "Yes — UPI, cards and cash all work at the end of the visit."],
      ["Will I get a GST invoice?", "Yes — a digital invoice is shared on WhatsApp as soon as the job closes."],
    ],
    related: ["written-quote", "guarantee", "bike-service-cost-bangalore"],
    services: ["bike-service"],
    updated: UPDATED,
  },

  // ─── Trust & guarantees ─────────────────────────────────────────────────────
  {
    slug: "are-mechanics-verified",
    question: "Are Ride N Care mechanics verified?",
    category: "trust",
    answer:
      "Yes. Every Ride N Care mechanic is background-verified before joining, arrives at your address, and carries out the job in front of you — with a written quote first, a digital invoice afterwards, and your approval on the full price and scope before any work starts.",
    meta: "Ride N Care mechanics are background-verified, work in the open where you can watch, and hand over old parts — transparency is the practical safeguard.",
    detail: [
      "Transparency is the practical safeguard: the work happens at your gate where you can see it, every part that comes off is shown to you, and the invoice lists everything fitted. If anything about a visit feels off, call 080 6940 9289 while the mechanic is still there.",
    ],
    faqs: [
      ["Will the same mechanic return for the guarantee visit?", "The follow-up is dispatched from the same unit, with your service record attached so whoever arrives knows exactly what was done."],
      ["Can I watch the work?", "Yes — you are encouraged to. The job runs in the open, and you are shown the old parts as they come off."],
    ],
    related: ["is-doorstep-service-safe", "written-quote", "guarantee"],
    services: ["doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "is-doorstep-service-safe",
    question: "Is doorstep bike service safe?",
    category: "trust",
    answer:
      "Yes — because the work happens in the open, in front of you. You see every part that comes off and every part that goes on, you approve the written quote first, and the digital invoice lists everything fitted. Most customers find that more transparent than leaving a bike at a workshop.",
    meta: "Doorstep service is safe because it happens in front of you — written quote first, parts shown, digital invoice, 7-day workmanship guarantee.",
    detail: [
      "Where a job does need the workshop — an engine rebuild, wheel truing, paint work — the bike is assessed on site first, moved only with your approval, and the workshop estimate is shared before work begins. You always know where your vehicle is and what is being done to it.",
    ],
    faqs: [
      ["What if something is damaged during the service?", "The work carries a 7-day workmanship guarantee — raise it on 080 6940 9289 and a mechanic comes back to put it right."],
      ["Is it safe to let a stranger work in my building?", "The mechanic works in the open parking area, not inside your home, and the whole visit is quotable: written quote, visible work, digital invoice."],
    ],
    related: ["are-mechanics-verified", "what-to-prepare", "apartment-basement"],
    services: ["doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "guarantee",
    question: "Is there a guarantee on the work?",
    category: "trust",
    answer:
      "Yes. Every job carries a 7-day workmanship guarantee: if anything Ride N Care serviced or repaired plays up within seven days, a mechanic comes back and puts it right at no charge. Parts fitted also carry the manufacturer's own warranty, which is shown on the invoice.",
    meta: "Every job carries a 7-day workmanship guarantee: if serviced work plays up within seven days, a mechanic returns and puts it right at no charge.",
    detail: [
      "The guarantee covers the work performed — a chain adjusted, brakes bled, a battery fitted. It is separate from the manufacturer warranty on the part itself, and both are on the invoice so there is no argument later.",
    ],
    faqs: [
      ["How do I claim the guarantee?", "Call or WhatsApp 080 6940 9289 / 82969 50339 within seven days with your invoice, and the follow-up visit is scheduled."],
      ["Does the guarantee cover parts?", "Parts carry the manufacturer's own warranty, noted on the invoice; the 7-day guarantee covers the workmanship."],
    ],
    related: ["written-quote", "payment-options", "genuine-parts"],
    services: ["bike-service", "bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "genuine-parts",
    question: "Do you use genuine spare parts?",
    category: "trust",
    answer:
      "Ride N Care fits OEM or OEM-grade parts only. The oil and every spare are shown to you before fitting, old parts are handed back if you want them, and the digital invoice lists each part fitted. Anything found mid-job is quoted and approved before it is replaced.",
    meta: "Only OEM or OEM-grade parts are fitted — oil and spares are shown to you before fitting, and the digital invoice lists every part with part numbers.",
    detail: [
      "\"OEM-grade\" means made to the original equipment specification — for some models the identical part comes in a different box. Either way you see what goes on your vehicle before it goes on, and the invoice is your record of it.",
    ],
    faqs: [
      ["Can I supply my own parts?", "Yes — tell us at booking. Labour is quoted as usual and the workmanship guarantee still applies to the fitting."],
      ["Do you use genuine oil filters?", "Yes — filters are OEM or OEM-grade like every other spare, shown before fitting."],
    ],
    related: ["which-oil", "written-quote", "guarantee"],
    services: ["bike-service", "bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "which-oil",
    question: "Which engine oil do you use for my bike?",
    category: "trust",
    answer:
      "The grade your owner's manual specifies — different engines need different viscosities, and wet-clutch motorcycles are particularly sensitive to the wrong grade. Oil from OEM-approved brands is used and the grade is recorded on the invoice. If you are unsure, check your owner's manual or ask us with your model.",
    meta: "The oil grade your owner's manual specifies is used — wet-clutch motorcycles are grade-sensitive, and the exact grade is recorded on your invoice.",
    detail: [
      "This is one area where guessing has real consequences: a too-thin oil in a hot, idling-in-traffic engine loses protection early, and the wrong specification can make a wet clutch slip. The manual's grade is the baseline; riding pattern decides the change interval, not the other way round.",
    ],
    faqs: [
      ["Do you use full synthetic oil?", "Where the manual specifies it, yes — full-synthetic and semi-synthetic options are stocked, and the exact grade is on the quote and invoice."],
      ["How often should the oil be changed in Bangalore traffic?", "For stop-start city riding, roughly every 2,500–3,500 km or three months — check your owner's manual for your model's baseline."],
    ],
    related: ["what-included-bike-service", "service-interval", "genuine-parts"],
    services: ["motorcycle-service", "bike-service"],
    updated: UPDATED,
  },

  // ─── Coverage & areas ───────────────────────────────────────────────────────
  {
    slug: "areas-covered",
    question: "Which areas of Bangalore do you cover?",
    category: "coverage",
    answer:
      "Ride N Care covers 40 confirmed localities across east, south, north, west and central Bangalore — including Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Bellandur, BTM Layout, Electronic City, Jayanagar, JP Nagar and Sarjapur Road. If your pincode is not listed, WhatsApp it and we confirm honestly whether a slot is workable.",
    meta: "Ride N Care serves 40 confirmed localities across Bangalore — share your pincode on WhatsApp and get a straight yes or no on coverage.",
    detail: [
      "Every confirmed locality has its own page on /areas with the pincode, nearby areas and how doorstep service works there. If your area is not on the list, it does not automatically mean no — share the pincode on WhatsApp and you get a straight yes or no, not a vague promise.",
    ],
    faqs: [
      ["Do you cover Hebbal and north Bangalore?", "Pages exist for some north and west localities, but coverage there is pending confirmation — check the area page for its current status or ask on WhatsApp."],
      ["Where can I see the full list?", "The /areas page lists every locality by zone with pincodes and links to each area guide."],
    ],
    related: ["how-to-book", "apartment-basement", "do-you-work-weekends"],
    services: ["doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "need-to-be-home",
    question: "Do I need to be home during the service?",
    category: "coverage",
    answer:
      "Someone should be there at the start to approve the written quote and at the end to check the work and take the test ride, but you do not have to stand over the mechanic. Many customers work from home or their desk while the job runs in the parking bay.",
    meta: "Be there at the start to approve the quote and at the end to inspect the work; the middle of the job needs no supervision from you.",
    detail: [
      "What actually needs you: the yes on the quote, and the walk-around at the end. Everything in between is the mechanic's job, and you get photo updates on WhatsApp for anything found along the way.",
    ],
    faqs: [
      ["Can the mechanic collect the key and work alone?", "The start and end check-ins are with you; the middle of the job does not need supervision."],
      ["Can you service at my office parking?", "Yes — office basements work the same way, with the same space and access needs."],
    ],
    related: ["what-to-prepare", "is-doorstep-service-safe", "how-to-book"],
    services: ["doorstep-bike-service"],
    updated: UPDATED,
  },
  {
    slug: "apartment-basement",
    question: "Can you service my bike in an apartment basement?",
    category: "coverage",
    answer:
      "Yes. Basement and covered parking bays are routine work — the mechanic brings a drip tray and needs roughly two parking bays' worth of room and, ideally, a plug point. Gated communities just need security to allow entry; a dry or low-water wash is used where no tap is available.",
    meta: "Apartment basements are routine doorstep work — a drip tray, two bays of room and gate permission are all that is needed for a clean, contained job.",
    detail: [
      "Apartment basements, gated-community parking and office basements make up most doorstep jobs in Bangalore. The only real constraints are space around the vehicle and gate access — mention both at booking if your building is strict about either.",
    ],
    faqs: [
      ["Will oil or water spill in my parking bay?", "A drip tray is used for all fluid work, and the wash is dry or low-water where there is no drain."],
      ["Do you need building permission?", "Only whatever your security desk requires — most gated communities wave through a mechanic with a work order on WhatsApp."],
    ],
    related: ["what-to-prepare", "need-to-be-home", "areas-covered"],
    services: ["doorstep-bike-service", "scooter-service"],
    updated: UPDATED,
  },

  // ─── Emergency & breakdown ──────────────────────────────────────────────────
  {
    slug: "bike-wont-start",
    question: "My bike will not start — what should I do?",
    category: "emergency",
    answer:
      "Work through the basics first: check there is fuel, the kill switch is off and the side-stand is up. If the dash is dead or the crank is slow, it is usually the battery. Call 080 6940 9289 and a mechanic is dispatched with a jump pack and spares.",
    meta: "Bike not starting? Check fuel, the kill switch and side-stand first — then call 080 6940 9289 and a mechanic comes with a jump pack and spares.",
    detail: [
      "A slow crank with dim lights points to the battery; a healthy crank with no fire points to fuel delivery or the spark plug; nothing at all points to the starter relay, a fuse or a switch. Knowing which of the three you have makes the phone call faster — and the fix, once the mechanic arrives, is usually one of those same causes.",
    ],
    faqs: [
      ["Can you come to where the bike is parked?", "Yes — that is the point of emergency repair: the mechanic rides to your location with a jump pack, spares and a puncture kit."],
      ["What if it is the fuel pump?", "Fuel-delivery faults are diagnosed on site; if the pump needs replacement the part is quoted and fitted, or the bike is recovered for the repair."],
    ],
    related: ["battery-jump-start-cost", "bike-stalled-in-water", "emergency-cost"],
    services: ["emergency-bike-repair", "bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "bike-stalled-in-water",
    question: "My bike stalled in a waterlogged street — what now?",
    category: "emergency",
    answer:
      "Do not keep cranking it. Water in the airbox needs to be cleared before the engine is run again, otherwise more damage is possible. Call 080 6940 9289 or WhatsApp 82969 50339 with your location; the fault is cleared on site where possible and the bike is recovered if it is not.",
    meta: "If your bike stalled in a waterlogged street, do not keep cranking — water in the airbox must be cleared first. Call 080 6940 9289 with your location.",
    detail: [
      "Bangalore's monsoon leaves water in airboxes and silencers every year, and the instinct to keep cranking is what turns a 20-minute fix into hydrolock. The safe sequence: push the bike out of the water, kill the engine, call, and let the airbox be cleared before the next start.",
    ],
    faqs: [
      ["Is it safe to ride home slowly if it restarts?", "If it restarted cleanly after a shallow splash it is usually fine — but after any deep wading, have the airbox checked before riding on."],
      ["Will insurance cover water damage?", "That depends on your policy, not on us — but the digital inspection report from the visit documents what was found."],
    ],
    related: ["bike-wont-start", "monsoon-bike-care", "recovery-after-breakdown"],
    services: ["emergency-bike-repair", "bike-breakdown-assistance"],
    updated: UPDATED,
  },
  {
    slug: "emergency-cost",
    question: "What does an emergency bike repair callout cost?",
    category: "emergency",
    answer:
      "The callout charge is quoted on the phone before anyone rides out, so there is no surprise at the roadside. The Running Repair package — fault inspection, minor repair labour and a safety check — is ₹450, and parts are billed at MRP only after your approval.",
    meta: "Emergency bike repair callouts are quoted on the phone before dispatch; Running Repair is ₹450 and parts are billed at MRP only after your approval.",
    detail: [
      "Knowing the charge before dispatch is the whole deal: you can decide whether to fix on the spot, recover to the workshop, or wait until morning — before anyone has spent fuel getting to you.",
    ],
    faqs: [
      ["Is the callout charge separate from the repair?", "The callout is quoted on the phone before dispatch; the Running Repair package and any parts are the repair-side charges, approved before work."],
      ["Do you charge extra for night calls?", "Doorstep visits are available 24 hours. Any night charge would be stated in the written quote before work starts — there are no surprise surcharges."],
    ],
    related: ["bike-wont-start", "bike-service-cost-bangalore", "recovery-after-breakdown"],
    services: ["emergency-bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "recovery-after-breakdown",
    question: "What happens if my bike cannot be repaired on the spot?",
    category: "emergency",
    answer:
      "If the bike cannot be made rideable safely, it is recovered to the nearest Ride N Care workshop within the city once you approve the move. The repair estimate is shared and approved before any work begins, and the mechanic stays until you are not stranded with the bike.",
    meta: "If a bike cannot be made rideable safely it is recovered to the nearest workshop once you approve — the repair estimate is shared before work begins.",
    detail: [
      "Not every roadside failure should be fixed roadside — a chain that has jumped the sprocket, seized brakes or visible oil loss are transport-first situations. Riding on in those cases turns a repair into a rebuild.",
    ],
    faqs: [
      ["Who transports the bike?", "Ride N Care arranges the recovery to the workshop as part of the approved next step."],
      ["How long does a workshop repair take?", "It depends on the job and parts availability — you get the estimate and timeline before approving anything."],
    ],
    related: ["emergency-cost", "bike-stalled-in-water", "roadside-or-garage"],
    services: ["bike-breakdown-assistance", "emergency-bike-repair"],
    updated: UPDATED,
  },

  // ─── Comparisons ────────────────────────────────────────────────────────────
  {
    slug: "doorstep-vs-garage-bike",
    question: "Is doorstep bike service better than a garage?",
    category: "comparison",
    answer:
      "For periodic service and most mechanical or electrical repairs, doorstep service matches a garage on parts and tools while saving you the trip and the wait. A workshop is genuinely better for engine rebuilds, wheel truing and painting. Choose whichever fits the job — an honest provider will tell you which.",
    meta: "Doorstep bike service matches a garage on parts and tools while saving the trip; rebuilds and paint stay at the workshop. Honest limits, compared.",
    detail: [
      "The honest three-way comparison for Bangalore:",
    ],
    table: {
      head: ["", "Doorstep service", "Local garage", "Authorised service centre"],
      rows: [
        ["Best for", "Periodic service, most repairs at your address", "Quick fixes, familiar mechanic, walk-in", "Warranty-period free services, recalls, insurance jobs"],
        ["Time cost", "Zero travel; job runs while you work", "Drop-off and pick-up trips", "Usually half a day or more"],
        ["Visibility", "Work happens in front of you", "Varies by garage", "Limited — you see the bike at handover"],
        ["Not suitable for", "Engine rebuilds, wheel truing, painting", "Warranty jobs, specialist diagnostics", "Nobody's favourite queue"],
      ],
    },
    faqs: [
      ["Is doorstep service more expensive?", "No — package prices are the same as the workshop's, and you save the travel and waiting time on top."],
      ["When should I still use the authorised centre?", "During the free-service period and for warranty claims — Ride N Care tells you this upfront rather than taking the job."],
      ["What can a garage do that doorstep cannot?", "Jobs needing a bench, press, truing stand or paint booth — engine internals, wheel truing, accident and paint work."],
    ],
    related: ["doorstep-vs-garage-car", "roadside-or-garage", "periodic-vs-breakdown"],
    services: ["doorstep-bike-service", "bike-service"],
    updated: UPDATED,
  },
  {
    slug: "doorstep-vs-garage-car",
    question: "Is doorstep car service better than a service centre?",
    category: "comparison",
    answer:
      "For periodic maintenance, AC service, batteries and brakes, doorstep car service uses the same OEM-grade parts as a workshop and saves you the half-day drop-off. Engine and gearbox overhauls, wheel alignment and bodywork still need a workshop. Warranty-period free services should stay with the authorised service centre.",
    meta: "Doorstep car service covers periodic, AC, battery and brake work with OEM-grade parts; overhauls, alignment and bodywork stay at the workshop.",
    detail: [
      "Where the boundary sits for cars: a hoist and alignment rack are workshop equipment, so wheel alignment happens at the partner workshop with pickup arranged. Dashboard-off evaporator work, engine and gearbox overhauls and accident bodywork are workshop jobs too. Everything in the periodic checklist — oil, filters, brakes, battery, AC — is fully doorstep-capable.",
    ],
    faqs: [
      ["Can you do wheel alignment at home?", "No — it needs a hoist and alignment rack. It is done at the partner workshop with pickup arranged."],
      ["Is doorstep car service safe for my warranty?", "Warranty on a specific part stays with the part maker. Free-service-period visits should go to the authorised centre."],
    ],
    related: ["doorstep-vs-garage-bike", "car-service-cost-bangalore", "what-included-car-service"],
    services: ["car-periodic-service", "car-ac-service"],
    updated: UPDATED,
  },
  {
    slug: "periodic-vs-breakdown",
    question: "What is the difference between periodic service and breakdown service?",
    category: "comparison",
    answer:
      "Periodic service is scheduled maintenance done on a calendar or kilometre interval — oil, filters, brakes, chain and inspection — before anything fails. Breakdown service is reactive: the bike has stopped, stalled or will not start, and the mechanic diagnoses and fixes that specific fault, often at the roadside.",
    meta: "Periodic service is scheduled maintenance before anything fails; breakdown service fixes the fault that stopped the bike. The cost logic differs too.",
    detail: [
      "The cost logic differs too. Periodic service is a fixed package price because the scope is known in advance. Breakdown work starts with diagnosis — free — because the scope is not knowable until the fault is found, then the fix is quoted and approved.",
    ],
    faqs: [
      ["Which one do I need?", "If the bike is running fine and it is just due, book periodic service. If something has gone wrong — noise, no-start, leak — book a repair or breakdown visit."],
      ["Can a breakdown visit replace a service?", "No — they fix different problems. A bike can be repaired and still be overdue for its oil, filters and chain."],
    ],
    related: ["doorstep-vs-garage-bike", "service-interval", "bike-wont-start"],
    services: ["periodic-bike-service", "emergency-bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "bike-vs-scooter-maintenance",
    question: "How does bike maintenance differ from scooter maintenance?",
    category: "comparison",
    answer:
      "Motorcycles need chain and sprocket care, clutch adjustment and, on some engines, periodic valve-clearance checks. Automatic scooters instead need CVT belt and roller inspection, final-drive gear oil, and front-brake attention. Scooter oil intervals are usually shorter, and their small tyres wear faster than a motorcycle's.",
    meta: "Motorcycles need chain and clutch care; scooters need CVT belt, rollers and final-drive gear oil — the maintenance lists differ more than owners expect.",
    detail: [
      "The transmission is the core difference: a motorcycle drives through a chain you can clean and lube; a scooter drives through a rubber belt and rollers hidden in the CVT housing that quietly degrade pickup and fuel economy until they fail. Riders who skip CVT and gear-oil care usually discover it as a sudden loss of pickup rather than a gradual one.",
    ],
    table: {
      head: ["Item", "Motorcycle", "Automatic scooter"],
      rows: [
        ["Drive", "Chain and sprockets — clean, lube, adjust", "CVT belt and rollers — inspect, replace as a kit"],
        ["Gear oil", "Shared with engine oil on most bikes", "Separate final-drive gear oil"],
        ["Oil interval", "Typically 3,000–5,000 km", "Often shorter — smaller oil quantity, short trips"],
        ["Brakes", "Disc front, drum or disc rear", "Front brake does most of the work"],
        ["Tyres", "Larger, longer-lasting", "Small diameter, faster wear"],
      ],
    },
    faqs: [
      ["Which is cheaper to maintain?", "Per service the scooter is usually cheaper, but it needs service slightly more often and CVT kits are a periodic lump cost. Neglect, not vehicle type, is the biggest cost driver."],
      ["Do scooters really need gear oil?", "Yes — the final-drive gear oil is separate from engine oil and has its own interval, and it is the most overlooked scooter item."],
    ],
    related: ["scooter-service-cost", "service-interval", "ev-service-different"],
    services: ["scooter-service", "motorcycle-service"],
    updated: UPDATED,
  },

  // ─── Care & vehicle-specific ────────────────────────────────────────────────
  {
    slug: "monsoon-bike-care",
    question: "How should I care for my bike in monsoon?",
    category: "care",
    answer:
      "Lubricate the chain after every wet ride, keep tyres at the sticker pressure with good tread, and get brakes checked if the lever feels spongy. Avoid riding through standing water where you can, and after any deep wading have the airbox checked before the next start.",
    meta: "Monsoon bike care in Bangalore means chain lube after wet rides, tyre and brake checks, and an airbox inspection after any deep wading.",
    detail: [
      "Bangalore monsoon is hard on three things: the chain (water strips lubrication), the brakes (wet grit glazes pads), and electricals (water finds tired connectors). A five-minute after-rain routine — wipe the chain dry and re-lube, check the tyre tread, listen for brake scrape — prevents most of it.",
      "For exact intervals and pressures for your model, check your owner's manual — the sticker figures on the swingarm or chain guard are the baseline, not the traffic-parked exceptions.",
    ],
    faqs: [
      ["How often should I lube the chain in monsoon?", "Roughly every 500 km in the wet season — always after cleaning, and ideally after every soaked ride."],
      ["My brakes squeal after rain. Normal?", "Usually — wet grit glazes the pads. If the squeal persists after a dry day or stopping distance grows, book a brake check."],
      ["Is it safe to ride through a flooded stretch?", "If you cannot see the road surface under the water, do not risk it — water in the airbox can stop the engine mid-stretch."],
    ],
    related: ["bike-stalled-in-water", "service-interval", "bike-vs-scooter-maintenance"],
    services: ["bike-service", "brake-service"],
    updated: UPDATED,
  },
  {
    slug: "service-interval",
    question: "How often should I service my bike in Bangalore?",
    category: "care",
    answer:
      "For Bangalore city riding, service roughly every 2,500–3,500 km or every three months, whichever comes first — stop-start traffic and dust wear oil and filters faster than the manual assumes. Riders doing long commutes or delivery duty should tighten the interval further. Check your owner's manual for your model's baseline.",
    meta: "Service a bike in Bangalore roughly every 2,500–3,500 km or three months — traffic and dust wear oil faster than the manual assumes. Check your manual.",
    detail: [
      "The two clocks that matter: kilometres and time. Oil degrades from heat and moisture even when the bike is parked, which is why a weekend bike still needs its three-month service. Symptoms that override the schedule: longer braking distance, a dry or noisy chain, rough idling, or noticeably worse fuel economy.",
    ],
    faqs: [
      ["Is the first free service important?", "Yes — it removes the metal particles from initial break-in, so do not skip or delay it."],
      ["My bike feels fine. Service anyway?", "Yes — oil, filters and brake pads reach their limits long before the bike feels wrong to ride."],
      ["I ride only on weekends. How often?", "Every six months by time, with battery and tyre pressure mattering more than kilometres."],
    ],
    related: ["what-included-bike-service", "which-oil", "monsoon-bike-care"],
    services: ["periodic-bike-service", "bike-service"],
    updated: UPDATED,
  },
  {
    slug: "roadside-or-garage",
    question: "Can every repair be done at my doorstep?",
    category: "care",
    answer:
      "Most can — batteries, brakes, clutches, chains, punctures, electrical faults and carburettor or injector cleaning are routine doorstep work. Engine and gearbox strip-downs, wheel truing, accident damage and painting need workshop equipment, so the bike is assessed on site first and moved only with your approval.",
    meta: "Most bike repairs happen at your doorstep; engine strip-downs, wheel truing and paint need workshop equipment — the assessment on site decides honestly.",
    detail: [
      "The honest test is equipment: if the job needs a bench, a press, a truing stand or a paint booth, it is workshop work. Everything else that fits in a mechanic's van — which is most of what goes wrong in daily riding — is done where the bike is parked.",
    ],
    faqs: [
      ["What if the needed part is not in the van?", "Common spares travel on board; anything unusual is sourced and the return visit scheduled, with the quote approved first."],
      ["Do you do accident repair at the doorstep?", "Accident damage is assessed on site, then repaired at the workshop — frame and panel work needs proper equipment."],
    ],
    related: ["doorstep-vs-garage-bike", "bike-repair-cost", "recovery-after-breakdown"],
    services: ["doorstep-bike-repair", "bike-repair"],
    updated: UPDATED,
  },
  {
    slug: "ev-service-different",
    question: "How is electric two-wheeler service different?",
    category: "care",
    answer:
      "Electric scooters and bikes have no engine oil, filters or clutch to service, so maintenance focuses on battery health, the charging port, brakes, tyres, suspension and electrical checks. Ride N Care's EV packages cover exactly that, while battery-pack and motor faults stay with the manufacturer's service network.",
    meta: "EV service skips oil and plugs — the checklist becomes brakes, tyres, bearings, connectors and charging, with battery faults left to the maker.",
    detail: [
      "What wears on an EV is what every vehicle shares with every other: brakes, tyres, wheel bearings and suspension — plus the charging connector, which loosens and corrodes like any electrical contact. The EV General Service checklist covers all of it, and there is no engine oil to buy, ever.",
    ],
    faqs: [
      ["Do you fix EV batteries?", "No — high-voltage battery and motor faults stay with the manufacturer's network. Everything around them, we handle."],
      ["How often does an EV need service?", "Less often than a petrol vehicle on fluids, but brakes, tyres and connectors still need periodic checks — the EV package is built for that."],
    ],
    related: ["ev-service-cost", "bike-vs-scooter-maintenance", "battery-jump-start-cost"],
    services: ["scooter-service"],
    updated: UPDATED,
  },
  {
    slug: "warranty-service",
    question: "Will doorstep service void my bike's warranty?",
    category: "care",
    answer:
      "Warranty on an individual part stays with that part's maker regardless of who fits it. If your bike is still inside the manufacturer's free-service period, the honest advice is to use the authorised centre's free services first — Ride N Care tells you this upfront and schedules paid doorstep work after.",
    meta: "During the free-service period use the authorised centre for those visits; after that, doorstep periodic service follows the same manufacturer schedule.",
    detail: [
      "The practical split: free-service-period visits and warranty claims belong to the authorised centre — that is where the claim paperwork lives. Paid periodic service afterwards is where doorstep wins, with the same OEM-grade parts, a written quote and a service record kept against your phone number.",
    ],
    faqs: [
      ["Does using an independent service void warranty?", "Warranty on a specific part stays with the part maker. The free-service period itself is best used at the authorised centre — we say so rather than taking the job."],
      ["Do you keep my service history?", "Yes — a dated digital record of each visit, with the odometer reading and a WhatsApp reminder when the next interval is due."],
    ],
    related: ["what-included-bike-service", "doorstep-vs-garage-bike", "guarantee"],
    services: ["periodic-bike-service", "car-periodic-service"],
    updated: UPDATED,
  },

  // ─── Car service (Part 8B) ────────────────────────────────────────────────
  {
    slug: "car-ac-not-cooling",
    question: "Why is my car AC not cooling?",
    category: "car",
    answer:
      "The usual suspects are low refrigerant, a clogged cabin filter, a dirty cooling coil or a compressor that is not engaging. A proper check measures each of these before recommending a fix — refilling gas on a leaking system only postpones the real repair.",
    meta: "Weak car AC usually traces to low refrigerant, a clogged cabin filter, a dirty coil or a compressor that is not engaging — each is measured before a fix.",
    detail: [
      "Weak airflow points to the cabin filter or blower; cool-but-not-cold points to refrigerant or the coil; nothing at all with the compressor silent points to an electrical or pressure-switch fault. Bangalore dust clogs cabin filters faster than most owners expect, so that is the first thing worth checking.",
    ],
    faqs: [
      ["Can it be checked at my home?", "Yes — the AC check is part of doorstep car service, and the fix is quoted in writing before work starts."],
      ["Does the AC service include a leak check?", "Yes — if the system is not holding gas, you are told before any refill is done."],
    ],
    related: ["car-ac-service-includes", "car-ac-gas-refill", "car-service-cost-bangalore"],
    services: ["car-ac-service"],
    updated: UPDATED,
  },
  {
    slug: "car-ac-service-includes",
    question: "What does a car AC service include?",
    category: "car",
    answer:
      "A doorstep car AC service covers a gas-level check and top-up where needed, cooling-coil and condenser cleaning, cabin filter inspection, and a compressor and vent-temperature test. Anything beyond that — parts, leak repair — is quoted separately before work starts.",
    meta: "A car AC service includes a gas check and top-up, coil and condenser cleaning, cabin filter inspection and a vent-temperature test at your doorstep.",
    detail: [
      "The vent temperature before and after service tells the story: a system that holds gas and moves air should blow noticeably colder. If it does not, the leak or the compressor becomes the diagnosis — and you approve that repair separately, in writing.",
    ],
    faqs: [
      ["Is the cabin filter replaced automatically?", "No — its condition is shown to you and a replacement is quoted at MRP before fitting."],
      ["How often should AC be serviced?", "Cooling performance is the best guide: when vent temperature rises or airflow drops, get it checked. Your owner's manual lists the manufacturer's schedule."],
    ],
    related: ["car-ac-not-cooling", "car-ac-gas-refill", "what-included-car-service"],
    services: ["car-ac-service"],
    updated: UPDATED,
  },
  {
    slug: "car-ac-gas-refill",
    question: "How does a car AC gas refill work?",
    category: "car",
    answer:
      "The system's refrigerant type and charge level are checked first, because topping up a leaking system wastes money. If the system holds gas, the correct refrigerant is added to the specified weight, and vent temperature is measured to confirm the result.",
    meta: "A car AC gas refill starts with a leak check — refilling a leaking system wastes money — then the correct refrigerant goes in by specified weight.",
    detail: [
      "The refill price depends on the refrigerant your car uses (R134a or R1234yf), the charge weight and whether a leak repair is needed first — which is why it is quoted per model after inspection rather than as a flat rate. You approve the quote in writing before any work starts.",
    ],
    faqs: [
      ["How much does a refill cost?", "It depends on refrigerant type, charge weight and the system's condition — you get the exact quote in writing before work starts."],
      ["Can the refill happen at my home?", "Yes — the equipment comes to your parking spot, and the job ends with a vent-temperature check."],
    ],
    related: ["car-ac-not-cooling", "car-ac-service-includes"],
    services: ["car-ac-service"],
    updated: UPDATED,
  },
  {
    slug: "what-included-car-service",
    question: "What does a periodic car service include?",
    category: "car",
    answer:
      "A doorstep periodic car service covers engine oil and filter replacement, air filter cleaning, brake inspection, coolant and fluid top-ups, battery test, AC check, lights, wipers and tyre check — finished with a multi-point inspection you can walk through before paying.",
    meta: "A car periodic service at home covers oil and filters, brakes, fluids, battery, AC, lights, wipers, tyres and a multi-point inspection report.",
    detail: [
      "The inspection is the quiet value: anything outside the checklist — a weeping shock absorber, a cracked belt — is photographed and quoted separately rather than silently done. Parts are shown before fitting and listed with part numbers on the digital invoice.",
    ],
    faqs: [
      ["Is engine oil included in the price?", "The quote separates parts and labour, and oil is priced by the grade and quantity your model needs — confirmed in writing before work starts."],
      ["Can it be done in my apartment basement?", "Yes, with your building's permission — one parking bay is enough. Share any gate rules when you book."],
    ],
    related: ["car-service-interval", "car-service-cost-bangalore", "how-to-prepare-car-doorstep"],
    services: ["car-periodic-service"],
    updated: UPDATED,
  },
  {
    slug: "car-battery-warning-signs",
    question: "What are the warning signs of a failing car battery?",
    category: "car",
    answer:
      "Slow cranking at start, dimming lights at idle, dashboard battery warnings and a battery older than three years are the classic signals. A swollen casing or a rotten-egg smell is more serious — stop using the car and get it checked before it fails completely.",
    meta: "Slow cranking, dim lights at idle and dash warnings are the classic signs of a failing car battery — Bangalore heat makes three years a common limit.",
    detail: [
      "Bangalore heat shortens battery life more than mileage does — a battery that survives elsewhere often fails here at three to four years. A voltage test at your doorstep tells you whether the battery, the alternator or a parasitic drain is the real culprit before you buy anything.",
    ],
    faqs: [
      ["Can a battery be tested at home?", "Yes — the doorstep check covers battery voltage and the charging system, so you know which part is at fault."],
      ["My car starts fine. Should I still worry?", "A slow start is the usual first warning — batteries rarely recover, they decline. Testing before a failure beats a no-start on a Monday morning."],
    ],
    related: ["car-battery-replacement-when", "car-breakdown-rain"],
    services: ["car-battery-service"],
    updated: UPDATED,
  },
  {
    slug: "car-battery-replacement-when",
    question: "When does a car battery need replacement?",
    category: "car",
    answer:
      "When testing shows the battery can no longer hold charge or crank reliably — commonly after three or four years in Bangalore's heat. Age plus symptoms beats the calendar alone: a three-year-old battery that cranks slowly is telling you it is nearly done.",
    meta: "A car battery needs replacement when testing shows it no longer holds charge or cranks reliably — commonly after three or four years in Bangalore heat.",
    detail: [
      "Replacement is a fitting job: the correct capacity and terminal layout for your model, terminals cleaned and greased, and the old battery taken away. The charging system is checked too — a new battery on a failing alternator will not last either.",
    ],
    faqs: [
      ["Is the replacement done at my home?", "Yes — batteries are stocked for common models and the swap is done in your parking bay."],
      ["What happens to the old battery?", "Disposal is confirmed at booking. Ask on WhatsApp when you book and it is arranged."],
    ],
    related: ["car-battery-warning-signs", "what-included-car-service"],
    services: ["car-battery-service"],
    updated: UPDATED,
  },
  {
    slug: "car-brake-noise-causes",
    question: "Why do my car brakes squeal or grind?",
    category: "car",
    answer:
      "Squeal usually means worn pads or glazed surfaces; grinding means metal is meeting metal and the pads are done — stop driving hard and get it inspected. Rain or dust can cause temporary noise, but persistent noise means an inspection is due.",
    meta: "Brake squeal usually means worn or glazed pads; grinding means metal on metal — the car should be inspected before stopping power is compromised.",
    detail: [
      "Pads wear quietly; the noise arrives near the end of their life. Grinding that starts after a squeal phase suggests the wear indicator has passed and discs may be scoring — which turns a pad replacement into a disc job. Brake inspection is part of every periodic service, and pad replacement is a doorstep job.",
    ],
    faqs: [
      ["Is it safe to drive with noisy brakes?", "Reduce driving and get it inspected — grinding in particular means stopping power is compromised."],
      ["Can pads be replaced at home?", "Yes — pad replacement is a doorstep job, with discs measured to confirm whether they are reusable."],
    ],
    related: ["car-brake-pads-when", "what-included-car-service"],
    services: ["car-brake-service"],
    updated: UPDATED,
  },
  {
    slug: "car-brake-pads-when",
    question: "When do car brake pads need changing?",
    category: "car",
    answer:
      "There is no single mileage — pad life depends on the car, the pad material and how you drive, so check your owner's manual for guidance and watch for the signals: squealing, longer stopping distances, or a pad-wear warning light on the dash.",
    meta: "There is no single mileage for brake pads — check your owner's manual and watch for squeal, longer stopping distances or a pad-wear warning light.",
    detail: [
      "City driving with constant braking wears pads faster than highway running, and Bangalore traffic is the demanding kind. A pad's friction surface is visible on inspection; the mechanic measures it and shows you, so the decision to replace is based on measurement, not guesswork.",
    ],
    faqs: [
      ["How are pads measured?", "During the brake inspection the pad thickness is measured and shown to you before any replacement is quoted."],
      ["Do the discs always need changing too?", "No — discs are measured as well. If they are within spec, pads alone are replaced."],
    ],
    related: ["car-brake-noise-causes", "what-included-car-service"],
    services: ["car-brake-service"],
    updated: UPDATED,
  },
  {
    slug: "monsoon-car-care",
    question: "What monsoon car care actually matters in Bangalore?",
    category: "car",
    answer:
      "Check tyres for tread and pressure, wipers for streaking, brakes for response, and drains for blockage before the heavy rain arrives. Keep the tank above half on flood-prone routes, and never drive through water of unknown depth — an underpass can hide an open manhole.",
    meta: "Monsoon car care: tyres, wipers, brakes and drains checked before the rain, a fuller tank on flood-prone routes, and no driving through deep water.",
    detail: [
      "Bangalore's monsoon floods underpasses and low stretches every year, and water damage to an engine is not covered by a service visit — prevention is all of it. If the car wades deep water, have it inspected before restarting; a hydrolocked engine is the expensive outcome of a hopeful restart.",
    ],
    faqs: [
      ["Should I park differently in monsoon?", "Avoid low-lying and tree-covered spots — waterlogging and falling branches are the two monsoon parking risks."],
      ["Does AC use change in the rain?", "Run the AC with fresh-air mode off to keep windows demisted — it doubles as a drying system for a damp cabin."],
    ],
    related: ["car-breakdown-rain", "what-included-car-service"],
    services: ["car-periodic-service"],
    updated: UPDATED,
  },
  {
    slug: "car-breakdown-rain",
    question: "My car broke down in the rain — what should I do?",
    category: "car",
    answer:
      "Move to a safe spot if you can, switch on hazard lights, and stay belted inside if visibility is poor. Do not open the bonnet in heavy rain or attempt repairs by a flooded road — call 080 6940 9289 or WhatsApp 82969 50339 with your location.",
    meta: "Car breaks down in the rain: safe spot, hazard lights on, stay belted if visibility is poor, and call with your location rather than attempting repairs.",
    detail: [
      "Water changes the risk picture: a flooded stretch can hide an open manhole, and electrical faults get worse when components get wet. Share a live location pin on WhatsApp so the mechanic reaches you directly, and let the diagnosis happen before anything is restarted or dismantled.",
    ],
    faqs: [
      ["Can the car be started after wading?", "Not until it has been checked — restarting a water-ingressed engine risks serious damage."],
      ["What if the car is stuck in a flooded underpass?", "Call first so the situation is assessed and the vehicle is moved safely — do not force it."],
    ],
    related: ["monsoon-car-care", "car-battery-warning-signs"],
    services: ["car-breakdown-assistance"],
    updated: UPDATED,
  },
  {
    slug: "doorstep-vs-workshop-car",
    question: "Doorstep or workshop — which suits my car job?",
    category: "car",
    answer:
      "Periodic service, AC work, battery replacement, brake pads, diagnostics and pre-purchase inspections are all doorstep jobs. Jobs needing a hoist, paint booth or heavy machining — overhauls, accident repair, wheel alignment — belong at a workshop, and we say so before starting.",
    meta: "Periodic, AC, battery and brake work are doorstep jobs; hoist, alignment and bodywork are workshop work — the honest dividing line is equipment.",
    detail: [
      "The honest dividing line is equipment: if the job needs a lift, a press or a paint booth, no one can do it properly in a parking bay. For everything else, the doorstep version is the same checklist with the same OEM-grade parts — with the written quote and inspection happening at your gate.",
    ],
    faqs: [
      ["What if you find a workshop-only job mid-service?", "You are told before anything is done, the visit is charged only for what was completed, and the workshop path is quoted separately."],
      ["Is doorstep work safe for my warranty?", "Warranty on a specific part stays with the part maker; if the car is inside its free-service period, we recommend using those visits first."],
    ],
    related: ["doorstep-vs-garage-car", "can-every-car-job-home", "what-included-car-service"],
    services: ["car-periodic-service", "cars"],
    updated: UPDATED,
  },
  {
    slug: "can-every-car-job-home",
    question: "Can every car job be done at home?",
    category: "car",
    answer:
      "No — and honesty about that is the point. Periodic service, AC, battery and brake-pad work happen at your doorstep. Engine overhauls, accident and bodywork, wheel alignment and jobs needing a hoist are workshop work, arranged with an estimate shared before the car moves.",
    meta: "No — periodic, AC, battery and brake jobs happen at home; overhauls, bodywork and alignment need the workshop. The answer comes before you book.",
    detail: [
      "The checklist is the guide: if the job fits a parking bay, the tools come to you. If it needs a lift, a paint booth or alignment rig, the workshop is the right answer — and the written quote for that path is approved before the car goes anywhere.",
    ],
    faqs: [
      ["How do I know which category my job is in?", "Describe the symptom when you book — the answer, and the honest category, come back before any visit is scheduled."],
      ["Is doorstep car work more expensive?", "No doorstep surcharge is added — the quote you approve in writing is the price you pay."],
    ],
    related: ["doorstep-vs-workshop-car", "what-included-car-service"],
    services: ["cars", "car-periodic-service"],
    updated: UPDATED,
  },
  {
    slug: "how-to-prepare-car-doorstep",
    question: "How do I prepare my car for a doorstep service?",
    category: "car",
    answer:
      "One allotted parking bay with a bit of working room around the car, gate access sorted with your security desk, and the car unlocked with the key ready. That is nearly all of it — the mechanic brings the tools, oil, filters and consumables.",
    meta: "One parking bay with working room, gate access sorted and the car unlocked — the mechanic brings tools, oil, filters and consumables to your door.",
    detail: [
      "Worth mentioning at booking: any known symptoms, your building's entry rules, and whether a plug point is nearby for battery or electrical work. Payment runs by UPI, card or cash after you have inspected the work, and the digital invoice arrives on WhatsApp.",
    ],
    faqs: [
      ["Do I need to be present the whole time?", "Be there at the start to approve the written quote and at the end to inspect — the middle is the mechanic's job."],
      ["What if my society needs a work order?", "The booking confirmation on WhatsApp is usually enough for security desks — mention it when you book if your building is strict."],
    ],
    related: ["what-included-car-service", "need-to-be-home", "doorstep-vs-workshop-car"],
    services: ["car-periodic-service", "cars"],
    updated: UPDATED,
  },
];

export const getAnswerPage = (slug: string) => ANSWER_PAGES.find((p) => p.slug === slug);
export const ANSWER_SLUGS = ANSWER_PAGES.map((p) => p.slug);

/** Answer pages that link to a given service slug (for "Related answers" on service pages). */
export function answersForService(slug: string, limit = 4): AnswerPage[] {
  return ANSWER_PAGES.filter((p) => p.services.includes(slug)).slice(0, limit);
}

/**
 * Answers relevant to a locality: vehicle + booking questions apply everywhere;
 * coverage answers mention the area network. Drives the "Related answers"
 * module on /areas/* pages so every area page links into the answers cluster.
 */
export function answersForArea(areaName: string, limit = 4): AnswerPage[] {
  const byCategory = ["coverage", "cost", "time", "trust", "care"]
    .map((cat) => ANSWER_PAGES.filter((p) => p.category === cat))
    .flat();
  const seen = new Set<string>();
  const picked: AnswerPage[] = [];
  for (const p of byCategory) {
    if (picked.length >= limit) break;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    picked.push(p);
  }
  // One locality-aware entry keeps the block from being purely generic.
  const coverage = ANSWER_PAGES.find((p) => p.slug === "areas-covered");
  if (coverage && !seen.has(coverage.slug)) picked.unshift(coverage);
  return picked.slice(0, limit);
}
