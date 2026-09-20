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
  | "care";

export const ANSWER_CATEGORIES: { id: AnswerCategory; label: string }[] = [
  { id: "cost", label: "Cost & pricing" },
  { id: "time", label: "Time & booking" },
  { id: "process", label: "How it works" },
  { id: "trust", label: "Trust & guarantees" },
  { id: "coverage", label: "Coverage & areas" },
  { id: "emergency", label: "Emergency & breakdown" },
  { id: "comparison", label: "Comparisons" },
  { id: "care", label: "Care & vehicle-specific" },
];

export interface AnswerPage {
  slug: string;
  /** The question, used verbatim as the page H1. */
  question: string;
  category: AnswerCategory;
  /** Answer-first paragraph (40–60 words), self-contained for voice search. */
  answer: string;
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
  // ─── Cost & pricing ─────────────────────────────────────────────────────────
  {
    slug: "bike-service-cost-bangalore",
    question: "How much does bike service cost in Bangalore?",
    category: "cost",
    answer:
      "Bike service at Ride N Care starts at ₹799 for General Service on bikes up to 199cc, ₹999 for 200–249cc, ₹1,199 for 250–400cc, ₹1,399 for 401–500cc, ₹1,799 for 501–800cc and ₹2,499 for 801cc and above. With engine oil replacement, General Service starts at ₹1,249.",
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
    detail: [
      "This is deliberate: a periodic service on a hatchback with clean filters is a different job from an SUV whose brake discs are scored. Quoting a single duration would mean either padding the estimate or rushing the checklist. What we commit to instead is the arrival window at booking, a written quote before work starts, and a job that finishes when you have inspected it.",
    ],
    faqs: [
      ["Will I know when the mechanic arrives?", "Yes — the arrival window is confirmed when you book, and you get the mechanic's details on WhatsApp before dispatch."],
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
      "Yes. Ride N Care works seven days a week, and emergency bike repair dispatch runs 8 AM to 9 PM every day, including weekends and most public holidays. Evening slots fill first, so booking a day ahead gives you the widest choice of arrival windows.",
    detail: [
      "Weekend mornings are the most requested slots across Bangalore, and Sunday evenings queue into Monday's first slots when they fill. For routine service, a weekday booking is the easiest way to get an exact window.",
    ],
    faqs: [
      ["Are you open after 9 PM?", "Emergency dispatch closes at 9 PM; late-night requests are scheduled for the next morning's first slot."],
      ["Do you service on public holidays?", "Most holidays yes, with the 8 AM–9 PM emergency window running as usual."],
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
    slug: "what-included-car-service",
    question: "What is included in a car periodic service?",
    category: "process",
    answer:
      "A car periodic service at home covers engine oil and oil filter change, air filter cleaning, a brake check covering pads, discs and fluid, coolant and fluid top-ups, a battery test, lights, horn, wipers and indicators, tyre pressure and tread, and a multi-point inspection report at the end.",
    detail: [
      "Anything the inspection shows as due — brake pads, a cabin filter, a battery — is quoted for your specific model before replacement. The mechanic works in your parking bay, shows you every part that comes out, and hands over the invoice on WhatsApp before you pay.",
    ],
    faqs: [
      ["Do you do computerised diagnostics?", "Yes — a computerised diagnostics scan is part of the comprehensive car service package."],
      ["Is the car wash included?", "Interior vacuum and dry wash are part of the Standard package; the Multi Service package covers oil change and the multipoint check."],
    ],
    related: ["car-service-cost-bangalore", "how-long-car-service", "warranty-service"],
    services: ["car-periodic-service"],
    updated: UPDATED,
  },
  {
    slug: "written-quote",
    question: "Do you give a quote before starting work?",
    category: "process",
    answer:
      "Yes. Every job starts with a written quote covering parts, labour and the slot, and nothing is touched until you approve it. If the mechanic finds extra work during the visit, it is photographed, explained and quoted separately — again only with your approval.",
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
    detail: [
      "The guarantee covers the work performed — a chain adjusted, brakes bled, a battery fitted. It is separate from the manufacturer warranty on the part itself, and both are on the invoice so there is no argument later.",
    ],
    faqs: [
      ["How do I claim the guarantee?", "Call or WhatsApp 080 6940 9289 / 82969 50339 within seven days with your invoice, and the follow-up visit is scheduled."],
      ["Does the guarantee cover parts?", "Parts carry the manufacturer's warranty printed on the invoice; the 7-day guarantee covers the workmanship."],
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
      "Ride N Care covers confirmed localities across east and south Bangalore — including Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Bellandur, BTM Layout, Electronic City, Jayanagar, JP Nagar and Sarjapur Road — with pages for 33 confirmed localities. If your pincode is not listed, WhatsApp it and we confirm honestly whether a slot is workable.",
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
    detail: [
      "Apartment basements, gated-community parking and office basements make up most doorstep jobs in Bangalore. The only real constraints are space around the vehicle and gate access — mention both at booking if your building is strict about either.",
    ],
    faqs: [
      ["Will oil or water spill in my parking bay?", "A drip tray is used for all fluid work, and the wash is dry or low-water where there is no drain."],
      ["Do you need building permission?", "Only whatever your security desk requires — most gated communities wave through a uniformed mechanic with a work order on WhatsApp."],
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
    detail: [
      "Knowing the charge before dispatch is the whole deal: you can decide whether to fix on the spot, recover to the workshop, or wait until morning — before anyone has spent fuel getting to you.",
    ],
    faqs: [
      ["Is the callout charge separate from the repair?", "The callout is quoted on the phone before dispatch; the Running Repair package and any parts are the repair-side charges, approved before work."],
      ["Do you charge extra for night calls?", "Dispatch runs 8 AM to 9 PM; late-night requests are scheduled for the next morning's first slot rather than surcharged."],
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
];

export const getAnswerPage = (slug: string) => ANSWER_PAGES.find((p) => p.slug === slug);
export const ANSWER_SLUGS = ANSWER_PAGES.map((p) => p.slug);

/** Answer pages that link to a given service slug (for "Related answers" on service pages). */
export function answersForService(slug: string, limit = 4): AnswerPage[] {
  return ANSWER_PAGES.filter((p) => p.services.includes(slug)).slice(0, limit);
}
