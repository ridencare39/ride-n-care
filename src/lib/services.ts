/**
 * Ride N Care bike-service catalogue.
 * Drives /bike-service, /doorstep-bike-service, /bike-repair, ... landing pages,
 * their local area pages, sitemap entries and internal linking.
 *
 * Content rules (SEO program Part 5): one intent per page, answer-first summary,
 * only confirmed prices (from src/lib/pricing.ts), honest limits, no unverified
 * claims (no same-day promises, response-time minutes, customer counts or ratings).
 */

export interface ServiceDef {
  slug: string;
  /** Nav / card label */
  name: string;
  h1: string;
  /** One-line supporting subheading under the H1. */
  subheading: string;
  title: string;
  description: string;
  /** Answer-first summary (40–60 words): what, where, how long, how it works. */
  summary: string;
  /** Short intro paragraph shown in area-page hero. */
  intro: string;
  /** Longer explanation of the service. */
  detail: string[];
  includes: string[];
  benefits: [string, string][];
  /** One-paragraph pricing explanation; the renderer appends the written-quote promise. */
  pricing: string;
  /** What genuinely cannot be done at the doorstep. */
  limits: string[];
  steps: [string, string][];
  faqs: [string, string][];
  /** Guide slugs (src/lib/guides.ts) for related-guide internal links. */
  relatedGuides: string[];
  /** ISO date of the last content review, shown on the page. */
  reviewed: string;
  /** Whether we generate /<slug>/<area> local landing pages */
  local: boolean;
  /** Lowest confirmed package price for this service (must match a visible price). */
  priceFrom?: number;
  serviceType: string;
  related: string[];
}

/** Shared trust points — one sentence each on what the promise means in practice. */
export const TRUST_POINTS: [string, string][] = [
  ["Background-verified mechanics", "Every mechanic is KYC-checked and shows an ID you can verify before handing over the bike."],
  ["OEM-grade parts", "Spares are OEM or OEM-grade, shown to you sealed before fitting, and listed with part numbers on the invoice."],
  ["Written quote before work", "You approve an itemised quote in writing before any spanner is lifted — and anything found later needs your approval too."],
  ["Digital invoice", "The invoice reaches your WhatsApp as soon as the job closes, with parts and labour listed separately."],
  ["45-day service warranty", "If an issue related to our work appears within 45 days, we inspect the vehicle and correct it in accordance with the warranty."],
];

/** Bike brands confirmed by the owner — used on every bike money page. */
export const BIKE_BRANDS = [
  "Honda", "Hero", "TVS", "Bajaj", "Yamaha", "Suzuki", "Royal Enfield", "KTM",
  "Kawasaki", "Harley-Davidson", "Jawa", "BMW Motorrad",
];

const BOOK_STEPS: [string, string][] = [
  ["1. Tell us your bike", "Share the make, model and what feels wrong on WhatsApp or the booking form. Takes under a minute."],
  ["2. Get a written quote", "We confirm parts, labour and the slot in writing before any spanner is touched."],
  ["3. Mechanic reaches you", "A background-verified Ride N Care mechanic arrives at your gate with tools, consumables and OEM spares."],
  ["4. Pay after the test ride", "Inspect the work, take a short test ride, then pay by UPI, card or cash. Invoice on WhatsApp."],
];

import { DISPATCH_STEPS } from "@/lib/dispatch-steps";
export { DISPATCH_STEPS };

export const SERVICES: ServiceDef[] = [
  {
    slug: "bike-service",
    name: "Bike Service",
    h1: "Bike Service at Home in Bangalore",
    subheading: "A certified two-wheeler mechanic comes to your parking spot with the full workshop — oil, filters, brakes, chain and a written quote before any work starts.",
    title: "Bike Service at Home in Bangalore | Ride N Care",
    description:
      "Full bike service at your home or office anywhere in Bangalore — engine oil, filters, brakes, chain and inspection. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care sends a background-verified mechanic to your home or office anywhere in Bangalore for a full bike service at home. Book a slot, approve a written quote, and the job — engine oil, filters, brakes, chain and a multi-point inspection — is finished in 60–90 minutes while you work or rest.",
    intro:
      "Ride N Care services two-wheelers at your home or office anywhere in Bangalore. You pick the slot, we bring the workshop — engine oil, filters, brakes, chain and a full inspection, finished while you get on with your day.",
    detail: [
      "A bike service is not only an oil change. Bangalore riding is stop-start, dusty and monsoon-heavy, and a Silk Board crawl or a waterlogged ORR exit wears the air filter, chain and brake pads far faster than the manual assumes. That is why the service follows a fixed checklist: everything due gets done, and anything worn gets photographed and shown to you.",
      "You never leave the building. The mechanic works in your parking bay, shows you every part that comes out, and hands over the invoice on WhatsApp before you pay. If your bike is still inside its free-service period at the company workshop, we will honestly tell you to use that first.",
      "Every visit is built around maintenance, not sales: the periodic checklist covers the inspection items your manufacturer expects — engine oil condition, air filter, spark plug, chain and sprocket wear, brake pad thickness, cables, battery voltage and a road test — and repairs are quoted separately only when the inspection shows something is genuinely due. Between visits, a dated service record is kept against your phone number with a reminder when the next interval is due, so the bike gets what it needs when it needs it — and nothing it does not.",
    ],
    includes: [
      "Engine oil check with OEM-grade top-up or replacement",
      "Air filter cleaning and oil filter check",
      "Spark plug cleaning and gap check",
      "Front and rear brake service and adjustment",
      "Chain tension check, cleaning and lubrication",
      "Clutch and cables-and-levers adjustment",
      "Battery voltage check",
      "Electrical check-up — lights, horn, indicators",
      "Oil leakage check",
      "Greasing and lubrication of pivots",
      "Dry wash and finish",
    ],
    benefits: [
      ["No garage queue", "No riding across town and losing half a day. The workshop comes to your parking spot."],
      ["Watch every step", "You see each part go in and each part come out. Nothing is swapped out of sight."],
      ["Published package rates", "Prices by engine size are on our bikes page; parts bill at MRP with the invoice listing everything."],
      ["45-day service warranty", "If an issue related to our work appears within 45 days, we inspect and correct it under the warranty."],
    ],
    pricing:
      "General Service starts at ₹799 for bikes up to 199cc and scales with engine size — ₹999 for 200–249cc, ₹1,199 for 250–400cc, ₹1,399 for 401–500cc, ₹1,799 for 501–800cc and ₹2,499 for 801cc and above. General Service with engine oil replacement starts at ₹1,249. Jump Start is ₹399 and Running Repair is ₹450 across all engine sizes; consumables and extra parts are billed only after your approval.",
    limits: [
      "Engine rebuilds and crankcase work — these need a workshop bench, so we pick the bike up free and share the estimate first.",
      "Wheel truing and rim repair — a truing stand is workshop equipment.",
      "Paint and panel work — not suitable for open-air doorstep work.",
      "Valve-clearance jobs on some models need special shims or tools; if yours does, we tell you upfront.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["What does a bike service at home cost in Bangalore?", "General Service starts at ₹799 up to 199cc, ₹999 up to 249cc and rises with engine size to ₹2,499 for 801cc+. With engine oil replacement it starts at ₹1,249. The exact amount is confirmed in writing before work starts."],
      ["Do you have a bike mechanic near me in Bangalore?", "Yes — Ride N Care covers 40 confirmed localities across Bangalore and dispatches the mechanic from the unit nearest your address. Share your location on WhatsApp (82969 50339) or call 080 6940 9289 and we confirm the mechanic and arrival window in writing before dispatch. The service happens at your parking spot, so \"near me\" means your own building."],
      ["How long does it take?", "Most general services finish in 60–90 minutes at your address; with engine oil replacement allow up to two hours."],
      ["What do I need to provide?", "Just parking space to work in and, ideally, a plug point. You do not need to hand over documents — the mechanic records the odometer and registration number from the bike itself."],
      ["Which parts do you use?", "OEM or OEM-grade only. Oil is shown to you sealed, and every part fitted appears with its number on the digital invoice."],
      ["What if you find extra work?", "The mechanic photographs the issue, explains it and quotes it separately. Nothing is done without your approval."],
      ["Is there a warranty?", "Yes — a 45-day service warranty on the service, plus the manufacturer warranty on any part fitted."],
      ["How do I pay and can I cancel?", "UPI, card or cash after a test ride. Cancel or reschedule free by WhatsApp any time before the mechanic is dispatched."],
      ["Does a bike service include repairs?", "The service covers the full maintenance checklist — oil, filters, brakes, chain, clutch, cables, battery, electricals and a dry wash. Repairs found during inspection are photographed, quoted at MRP and done only with your approval, so maintenance stays maintenance and you decide on any repair separately."],
    ],
    relatedGuides: ["when-to-service-your-bike", "bike-service-guide-bangalore"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 799,
    serviceType: "Bike Service",
    related: ["doorstep-bike-service", "periodic-bike-service", "bike-repair", "scooter-service"],
  },
  {
    slug: "doorstep-bike-service",
    name: "Doorstep Bike Service",
    h1: "Doorstep Bike Service in Bangalore",
    subheading: "The entire service happens where your bike is parked — no drop-off, no pickup fee, no losing a Saturday to a service-centre queue.",
    title: "Doorstep Bike Service in Bangalore | Ride N Care",
    description:
      "A verified mechanic brings the workshop to your parking spot — periodic service, repairs and free workshop transport when a job needs it. Call 080 6940 9289.",
    summary:
      "Doorstep bike service in Bangalore means a Ride N Care mechanic comes to your home or office with tools, oil, filters and spares, and does the full service where the bike stands. You get a written quote first, photo updates during the job, and free workshop transport if a job genuinely needs it.",
    intro:
      "Doorstep bike service means the entire service happens where your bike is parked. No drop-off, no pickup charge, no losing a Saturday. Book a slot and a Ride N Care mechanic reaches you with everything needed.",
    detail: [
      "Our vans carry engine oil for every popular Indian and imported model, filters, brake pads, chain lube, a portable compressor and a diagnostic kit for fuel-injected bikes. That covers the vast majority of periodic services and light repairs on the spot — from an Activa in Jayanagar to a Classic 350 in Whitefield.",
      "If a job genuinely needs a workshop lift — a full engine rebuild, accident damage, frame work — we say so before starting, arrange free transport to the workshop and share the estimate for approval. You are never charged a doorstep premium: package prices match our workshop rates.",
      "Most jobs never leave your parking spot. The periodic service, the inspection and common repairs — batteries, brakes, chains, clutches, punctures, carburettor cleaning — happen right there, whether that is an apartment basement, an office bay or gated-community parking. You approve the written quote before work starts, can watch every step, and pay by UPI, card or cash after a test ride. Only bench jobs move to the workshop, with free transport and a written estimate first.",
    ],
    includes: [
      "Mechanic, tools and consumables brought to your address",
      "Full periodic service performed on site",
      "Photo updates before and after the job",
      "Free transport to the workshop when a workshop visit is unavoidable",
      "Written quote before work starts",
      "UPI, card or cash payment after a test ride",
    ],
    benefits: [
      ["Zero travel time", "Book between meetings; you never leave your building."],
      ["Slot you choose", "Pick a morning or evening window that fits your day — we confirm the mechanic and time on WhatsApp before dispatch."],
      ["Complete visibility", "The work happens in front of you instead of behind a workshop shutter."],
      ["City-wide coverage", "From HSR Layout and Koramangala to Whitefield and Electronic City — the mechanic is assigned from the unit nearest you."],
    ],
    pricing:
      "General Service starts at ₹799 for bikes up to 199cc (₹1,249 with engine oil replacement) and scales by engine size; Jump Start is ₹399 and Running Repair ₹450 across all sizes. There is no doorstep surcharge — you pay the same package price as the workshop.",
    limits: [
      "Engine rebuilds, accident repair and frame work — moved to the workshop with free transport and a written estimate.",
      "Wheel truing, rim repair and painting — workshop-only jobs.",
      "Very large superbike suspension rebuilds — some need a bench and press.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Is doorstep bike service more expensive than a garage?", "No. Package prices are the same as our workshop rates, so most riders pay less overall once travel and waiting time are counted."],
      ["What space do you need?", "About two parking bays' worth of room and, ideally, a plug point. Apartment basements, gated-community parking and roadside kerbs all work — we bring a drip tray."],
      ["Which areas of Bangalore do you cover?", "40 confirmed localities across east, south, north, west and central Bangalore — the full list with pincodes is on our areas page."],
      ["How do I know the mechanic is genuine?", "Every mechanic is background-verified and shows an ID at the gate."],
      ["How do I get a good slot?", "Evening slots fill first, so booking a day ahead gets the widest choice of windows."],
      ["What happens if the bike needs workshop work?", "We tell you before touching anything, transport the bike free and share the workshop estimate for your approval."],
      ["Can I reschedule?", "Yes — free reschedule or cancellation on WhatsApp any time before the mechanic is dispatched."],
      ["What can be done at my doorstep versus at a workshop?", "The full periodic service, inspection and most repairs — batteries, brakes, chains, clutches, punctures, carburettor cleaning — happen at your parking spot because the van carries the workshop. Only bench jobs like engine rebuilds, wheel truing and paint move to the workshop, with free transport and a written estimate first."],
    ],
    relatedGuides: ["doorstep-bike-service-guide", "when-to-service-your-bike"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 799,
    serviceType: "Doorstep Bike Service",
    related: ["bike-service", "doorstep-bike-repair", "emergency-bike-repair", "periodic-bike-service"],
  },
  {
    slug: "bike-repair",
    name: "Bike Repair",
    h1: "Bike Repair at Home in Bangalore",
    subheading: "Diagnosis first, quote second, repair third — a mechanic traces the actual fault with proper instruments instead of swapping parts by guesswork.",
    title: "Bike Repair at Home in Bangalore | Ride N Care",
    description:
      "Bike repair at your doorstep in Bangalore. Free diagnosis with a written finding, OEM parts, and a 45-day service warranty. Call 080 6940 9289.",
    summary:
      "Something specific gone wrong? Ride N Care repairs bikes at home in Bangalore — a mechanic diagnoses the fault with a compression tester, multimeter and FI scanner, explains the finding, and fixes it at your parking spot wherever possible. Diagnosis is free; you pay only for the repair you approve.",
    intro:
      "Something specific gone wrong? Ride N Care mechanics diagnose the fault first, quote the repair in writing, and fix it at your doorstep wherever possible.",
    detail: [
      "Repairs are different from a periodic service: the value is in the diagnosis. A misfire, a dead start or a brake that binds can have three different causes, and guessing means paying for parts you did not need. Our mechanics carry a compression tester, multimeter and OBD/FI scanner, so the finding is measured, not assumed.",
      "You always see the failed component and the old part stays with you if you want it. The invoice lists labour and parts separately, and most repairs — batteries, self-starts, brakes, chains, clutches, punctures, carburettor cleaning — are completed where the bike is parked.",
    ],
    includes: [
      "Free fault diagnosis with a written finding",
      "Engine, transmission and clutch repairs",
      "Brake overhaul — pads, shoes, discs, cables and fluid",
      "Electrical repairs — wiring, starter, charging, lighting",
      "Carburettor cleaning and fuel-injector service",
      "Suspension and fork-seal work",
      "Post-repair road test with you present",
    ],
    benefits: [
      ["Diagnosis before spend", "You approve a specific repair with a measured finding, not a vague estimate."],
      ["Old parts returned", "Proof that the replacement actually happened."],
      ["Doorstep first", "Most repairs are completed where the bike is parked, the same visit."],
      ["Warranty on workmanship", "A 45-day service warranty on the repaired item."],
    ],
    pricing:
      "Running Repair is ₹450 across all engine sizes, which covers the initial fault inspection, minor repair labour and a safety check afterwards. Parts are quoted at MRP before fitting, and bigger jobs get an itemised written estimate. Diagnosis itself is free — you pay only if you approve the repair.",
    limits: [
      "Engine rebuilds, crankcase and gearbox strip-downs — workshop bench jobs with free transport.",
      "Accident and frame damage — assessed on site, repaired at the workshop.",
      "Wheel truing and painting — not doorstep work.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Do you charge for diagnosis?", "No. Diagnosis at your doorstep is free and comes with a written finding; you pay only if you approve the repair."],
      ["How do I find a bike mechanic near me for a repair?", "You may not need to search — Ride N Care sends a background-verified mechanic to your address across 40 Bangalore localities. Diagnosis is free with a written finding, parts are OEM or OEM-grade, and the repair carries a 45-day service warranty. Call 080 6940 9289 or WhatsApp 82969 50339 with the symptom."],
      ["My bike will not start — can you help today?", "No-start cases get our emergency slots. Call 080 6940 9289 or WhatsApp 82969 50339 with the symptom and we confirm the earliest arrival on WhatsApp."],
      ["Can every repair be done at home?", "Most can. Engine rebuilds, accident repair and paint work move to our workshop with free transport and a written estimate."],
      ["Do repairs carry a warranty?", "Yes — a 45-day service warranty on our work, plus the manufacturer warranty on the part itself."],
      ["Are the parts genuine?", "OEM or OEM-grade only, shown to you sealed before fitting, with part numbers on the invoice."],
      ["How do I pay?", "UPI, card or cash after a test ride; the invoice reaches your WhatsApp immediately."],
      ["What if you cannot fix it on the spot?", "If a part is not in the van we source it and return; if the job needs a workshop we transport the bike free after your approval."],
    ],
    relatedGuides: ["common-bike-problems-and-solutions", "bike-breakdown-troubleshooting-guide"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 450,
    serviceType: "Bike Repair",
    related: ["doorstep-bike-repair", "engine-repair", "electrical-repair", "brake-service"],
  },
  {
    slug: "doorstep-bike-repair",
    name: "Doorstep Bike Repair",
    h1: "Doorstep Bike Repair in Bangalore",
    subheading: "A bike that will not start is hard to take to a garage — so the garage comes to the bike: free diagnosis at your address and the fix on the spot in most cases.",
    title: "Doorstep Bike Repair in Bangalore | Ride N Care",
    description:
      "Doorstep bike repair in Bangalore — a mechanic reaches your home or office, diagnoses free and repairs on the spot. Written quote first. Call 080 6940 9289.",
    summary:
      "Doorstep bike repair brings the mechanic to the bike, not the other way round. A Ride N Care technician diagnoses the fault free at your address, quotes the fix in writing, and completes most repairs — batteries, self-starts, brakes, chains, clutches, punctures — right there in your parking bay.",
    intro:
      "A bike that will not start is hard to take to a garage. Ride N Care brings the repair to you: free diagnosis at your address, a written quote, and the fix done on the spot in most cases.",
    detail: [
      "Our most common doorstep repairs are dead batteries, self-start failures, brake binding, chain and sprocket replacement, clutch cable and plate work, punctures and carburettor cleaning — all fully doable in a parking bay with the tools and spares the van carries.",
      "Where the bike must move, we load it safely and cover the transport free. You are told the workshop estimate and approve it before the bike leaves your sight.",
    ],
    includes: [
      "Doorstep diagnosis at no charge",
      "Battery jump-start, testing and replacement",
      "Self-start, wiring and fuse repair",
      "Brake, chain, sprocket and clutch replacement",
      "Puncture repair and tyre replacement",
      "Carburettor / injector cleaning",
      "Free transport if the workshop is needed",
    ],
    benefits: [
      ["No pushing your bike", "The mechanic reaches the bike, not the other way round."],
      ["Nearest mechanic dispatched", "Your mechanic is assigned from the unit closest to your address and the arrival time is confirmed on WhatsApp."],
      ["Parts in the van", "Common spares and consumables carried on board."],
      ["Written quote first", "Nothing is replaced without your approval."],
    ],
    pricing:
      "Running Repair is ₹450 across all engine sizes — initial fault inspection, minor repair labour and a safety check. Battery replacement and bigger part jobs are quoted before fitting at MRP. Diagnosis and in-city transport to our workshop are free.",
    limits: [
      "Engine rebuilds and gearbox work — workshop bench jobs with free transport.",
      "Accident, frame and paint work — assessed on site, repaired at the workshop.",
      "Wheel truing — needs a truing stand.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How quickly can a mechanic reach me?", "We dispatch the nearest available mechanic as soon as your slot is confirmed. Traffic and distance decide the exact arrival time, which we share on WhatsApp before dispatch."],
      ["Can you replace a battery at home?", "Yes — we test the charging system first so the new battery does not die the same way, then fit a fresh one with a manufacturer warranty."],
      ["Do you handle punctures?", "Yes — wheel-on tubeless repair or a tube change at your doorstep."],
      ["What does doorstep repair cost?", "Running Repair is ₹450 including inspection and minor repair labour; parts are quoted before fitting. Diagnosis is free."],
      ["What if the repair needs a workshop?", "We tell you before touching anything, transport the bike free and share the estimate for approval."],
      ["Is there a warranty?", "A 45-day service warranty on the repair, plus the manufacturer warranty on any part fitted."],
    ],
    relatedGuides: ["bike-breakdown-troubleshooting-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 450,
    serviceType: "Doorstep Bike Repair",
    related: ["bike-repair", "emergency-bike-repair", "bike-breakdown-assistance", "battery-service"],
  },
  {
    slug: "periodic-bike-service",
    name: "Periodic Bike Service",
    h1: "Periodic Bike Service in Bangalore",
    subheading: "The maintenance your manufacturer schedules by kilometres or months — done at your doorstep, with a service history you never lose track of.",
    title: "Periodic Bike Service in Bangalore | Ride N Care",
    description:
      "Scheduled periodic bike service in Bangalore at your doorstep — oil, filters, brakes, chain and a 25-point inspection with service reminders.",
    summary:
      "Periodic bike service follows the manufacturer's schedule for your model and mileage, done at your doorstep in Bangalore. We adjust the checklist for how you actually ride, keep a dated service record against your phone number, and send a WhatsApp reminder when the next interval is due.",
    intro:
      "Periodic service is the maintenance your manufacturer schedules by kilometres or months. We do it at your doorstep and keep a service history so you never lose track of the next due date.",
    detail: [
      "We follow the manufacturer interval as the baseline and adjust for how you actually ride. A 40 km daily Whitefield–Koramangala commute wears consumables faster than weekend riding, so the checklist changes accordingly.",
      "After each visit you get a digital record of what was done, the odometer reading, and a WhatsApp reminder when the next service is due.",
    ],
    includes: [
      "Engine oil and filter change",
      "Air filter and spark plug service",
      "25-point safety inspection with report",
      "Brake, chain and clutch adjustment",
      "Coolant and fluid top-ups where applicable",
      "Digital service record and next-due reminder",
    ],
    benefits: [
      ["Protects resale value", "A documented service history is worth real money at sale time."],
      ["Better mileage", "Clean filters and correct chain tension directly improve fuel economy."],
      ["Fewer breakdowns", "Wear is caught on schedule instead of on the road."],
      ["Reminder service", "We nudge you when the next interval is due."],
    ],
    pricing:
      "General Service starts at ₹799 up to 199cc and scales with engine size; with engine oil replacement it starts at ₹1,249. If your bike is still inside the manufacturer's free-service period, we recommend using those first.",
    limits: [
      "Warranty work during the free-service period — use the authorised centre for those visits.",
      "Engine overhaul and valve-shim jobs — workshop work with free transport.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["What is the difference between periodic service and general service?", "Periodic service follows the manufacturer's scheduled checklist for your model and mileage. A general service is a lighter clean-and-check."],
      ["Will doorstep service void my manufacturer warranty?", "Warranty on a specific part stays with the part maker. If your bike is still inside the free-service period, we recommend using those free services first."],
      ["Do you keep my service history?", "Yes, against your phone number, with the odometer reading from each visit."],
      ["How much does periodic service cost?", "General Service starts at ₹799 up to 199cc; with engine oil replacement it starts at ₹1,249, scaling with engine size."],
    ],
    relatedGuides: ["when-to-service-your-bike", "bike-service-guide-bangalore"],
    reviewed: "2026-09-19",
    local: false,
    priceFrom: 799,
    serviceType: "Periodic Bike Service",
    related: ["bike-service", "doorstep-bike-service", "general-two-wheeler-repair"],
  },
  {
    slug: "motorcycle-service",
    name: "Motorcycle Service",
    h1: "Motorcycle Service in Bangalore — Commuter to Superbike",
    subheading: "Mechanics assigned by engine class, not one-size-fits-all: torque specs, valve checks and the right grade of oil for bigger bikes.",
    title: "Motorcycle Service in Bangalore | Ride N Care",
    description:
      "Motorcycle service in Bangalore for Royal Enfield, KTM, Yamaha, Kawasaki, Triumph and more. Doorstep service by trained mechanics with OEM-grade parts.",
    summary:
      "From a 100cc commuter to a litre-class superbike, Ride N Care services motorcycles across Bangalore with mechanics assigned by engine class. Bigger bikes get bigger-bike attention: manufacturer torque values, full-synthetic oil where specified, FI diagnostics and chain, sprocket and brake-fluid inspection on every visit.",
    intro:
      "From a 100 CC commuter to a litre-class superbike, Ride N Care mechanics are trained by engine class. Bigger motorcycles get bigger-bike attention: torque specs, valve clearance checks and the right grade of oil.",
    detail: [
      "Larger-capacity motorcycles are less forgiving of shortcuts. We use manufacturer torque values, full-synthetic oil where specified, and inspect chain wear, sprocket profile and brake fluid condition on every visit.",
      "We service Honda, Hero, TVS, Bajaj, Yamaha, Suzuki, Royal Enfield, KTM, Kawasaki, Harley-Davidson, Jawa and BMW Motorrad.",
      "Motorcycle-specific maintenance is what separates this from a generic two-wheeler check: chain and sprocket wear is measured against the manufacturer's service limit rather than eyeballed, brake fluid is inspected for moisture on bikes that see highway speeds, liquid-cooled models get a coolant and radiator inspection, fuel-injected motorcycles get an FI diagnostics scan, and critical fasteners are torqued to specification instead of \"tight\". Commuters, 350–650cc twins and big bikes each get the checklist their engine class actually needs.",
    ],
    includes: [
      "Grade-correct engine oil and filter change",
      "Chain, sprocket and brake-wear assessment",
      "Brake fluid check and bleeding where needed",
      "Coolant level and radiator inspection for liquid-cooled bikes",
      "FI diagnostics scan on fuel-injected models",
      "Torque-spec tightening of critical fasteners",
    ],
    benefits: [
      ["Engine-class expertise", "Mechanics assigned by CC band, not one-size-fits-all."],
      ["Correct oil grades", "Full-synthetic and semi-synthetic options stocked."],
      ["Diagnostics on board", "FI scanning for modern EFI motorcycles."],
      ["Doorstep or workshop", "Your choice for larger jobs."],
    ],
    pricing:
      "General Service starts at ₹799 up to 199cc, ₹1,199 for 250–400cc and ₹1,799 for 501–800cc; with engine oil replacement from ₹1,249 to ₹4,499 depending on engine size and oil grade. The exact package for your bike is confirmed in writing before work starts.",
    limits: [
      "Valve-clearance and suspension rebuilds on large bikes — workshop bench jobs.",
      "Tyre changing for very large rear widths — some need workshop machines.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Do you service Royal Enfield and KTM?", "Yes — both are among our most-serviced brands in Bangalore, including 350/650 twins and KTM Duke/RC models."],
      ["Can you service superbikes at home?", "Periodic service and consumables, yes. Valve-clearance and suspension rebuilds are done in the workshop."],
      ["Which oil do you use?", "The grade your manual specifies, from OEM-approved brands, shown to you sealed before pouring."],
      ["What does motorcycle service cost?", "From ₹799 up to 199cc; bigger engines price higher — e.g. ₹1,799 for 501–800cc. The exact figure is confirmed in writing first."],
      ["What makes motorcycle service different from a regular bike service?", "Engine-class care: measured chain and sprocket wear, brake-fluid inspection, coolant and radiator checks on liquid-cooled models, FI diagnostics scans and torque-spec tightening — the checks bigger motorcycles actually need, from mechanics assigned by engine capacity."],
    ],
    relatedGuides: ["complete-bike-maintenance-guide", "when-to-service-your-bike"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 799,
    serviceType: "Motorcycle Service",
    related: ["bike-service", "engine-repair", "brake-service", "doorstep-bike-service"],
  },
  {
    slug: "scooter-service",
    name: "Scooter Service",
    h1: "Scooter Service at Home in Bangalore",
    subheading: "Activa, Jupiter, Access and every automatic scooter — including the CVT and gear-oil care that most quick garages skip.",
    title: "Scooter Service at Home in Bangalore | Ride N Care",
    description:
      "Scooter service at home in Bangalore — Activa, Jupiter, Access and more. CVT care, brakes and battery tested. Written quote. Call 080 6940 9289.",
    summary:
      "Scooters take the worst of Bangalore's potholes and short trips, and they need care a motorcycle does not. A Ride N Care mechanic services your automatic scooter at home — engine oil, gear oil, CVT inspection, brakes and battery — in a single visit, with a written quote before work starts.",
    intro:
      "Scooters take the worst of Bangalore's potholes and short trips. Ride N Care services every automatic scooter at your doorstep — including the CVT and rear-drive care that most quick garages skip.",
    detail: [
      "Automatic scooters need attention a motorcycle does not: CVT belt and roller wear, gear oil in the final drive, and a variator that collects dust from unpaved shortcuts. Short city trips also mean the engine rarely gets fully warm, so oil degrades faster than the calendar suggests.",
      "We service Honda Activa and Dio, TVS Jupiter and Ntorq, Suzuki Access and Burgman, Yamaha Fascino and RayZR, Hero Pleasure and Destini, and Aprilia SR. Electric scooters get brake, tyre and running-gear service at home; battery and motor issues stay with the manufacturer's service network.",
    ],
    includes: [
      "Engine oil and gear oil change",
      "CVT / variator inspection and cleaning",
      "Drive belt and roller wear check",
      "Front disc / rear drum brake service",
      "Battery and charging-system test",
      "Tyre pressure and tread check",
      "Body panel and lock lubrication",
    ],
    benefits: [
      ["CVT done properly", "Belt and roller wear checked, not ignored."],
      ["Short-trip oil advice", "Interval tuned to real city usage."],
      ["Family-safe brakes", "Full brake inspection on every visit."],
      ["At your gate", "Done in your apartment parking bay — no riding to a centre."],
    ],
    pricing:
      "General Service for scooters up to 199cc is ₹799, or ₹1,249 with engine oil replacement. Jump Start is ₹399 and Running Repair ₹450. Extra parts — a drive belt, brake shoes, a battery — are quoted at MRP before fitting.",
    limits: [
      "Battery and motor faults on electric scooters — these stay with the manufacturer's service network.",
      "CVT belt replacement needs the correct belt for your model — if it is not in the van we source it and return.",
      "Body-panel replacement for crash damage — assessed on site, quoted separately.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How often should a scooter be serviced?", "Every 2,500–3,000 km or three months. If your daily ride is under 5 km, keep to the time-based interval — oil ages even when kilometres are low."],
      ["What does scooter service at home cost?", "General Service is ₹799 for scooters up to 199cc; with engine oil replacement ₹1,249. Jump Start is ₹399 and Running Repair ₹450."],
      ["Do you service Honda Activa and TVS Jupiter?", "Yes — Activa, Dio, Jupiter, Ntorq, Access, Burgman, Fascino, RayZR, Pleasure, Destini and Aprilia SR are all routine work for us."],
      ["Do you service electric scooters?", "We handle brakes, tyres, suspension and general running gear at home. Battery and motor issues stay with the manufacturer's service network."],
      ["What do I need to provide?", "Parking space and ideally a plug point — that is all."],
      ["How do I pay?", "UPI, card or cash after a test ride; the digital invoice reaches your WhatsApp right away."],
    ],
    relatedGuides: ["motorcycle-vs-scooter-maintenance", "complete-bike-maintenance-guide"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 799,
    serviceType: "Scooter Service",
    related: ["bike-service", "doorstep-bike-service", "battery-service", "brake-service"],
  },
  {
    slug: "emergency-bike-repair",
    name: "Emergency Bike Repair",
    h1: "Emergency Bike Repair in Bangalore",
    subheading: "Stuck on the road? Call 080 6940 9289 and the nearest available mechanic is dispatched with a jump pack, puncture kit and basic spares.",
    title: "Emergency Bike Repair in Bangalore | Ride N Care",
    description:
      "Emergency bike repair in Bangalore, 7 AM to 11:30 PM daily. Dead battery, puncture or no-start — call 080 6940 9289 and we dispatch the nearest mechanic.",
    summary:
      "Emergency bike repair in Bangalore for the moments a ride cannot wait: a battery that will not crank, a puncture, a snapped clutch cable or a stall after riding through waterlogging. Call 080 6940 9289 within operating hours — 7:00 AM to 11:30 PM, every day. The charge is confirmed upfront, the nearest mechanic rides to your location, and actual booking availability is confirmed when you book.",
    intro:
      "Stuck on the road? Call 080 6940 9289 or WhatsApp 82969 50339 and a mechanic is dispatched to your location with a battery pack, puncture kit and basic spares.",
    detail: [
      "Roadside jobs we solve most often: a battery that will not crank, a snapped clutch cable, a tubeless puncture, brake binding after a wet ride, and fuel-line or plug trouble after riding through waterlogging on ORR or NICE Road.",
      "If your bike cannot be made rideable safely, we recover it to the nearest Ride N Care workshop rather than leaving you to arrange transport. The callout and likely repair cost are told before dispatch, so there is no surprise at the roadside.",
    ],
    includes: [
      "Dispatch of the nearest available mechanic to your location",
      "Jump-start and battery replacement",
      "On-the-spot puncture repair",
      "Cable, fuse and plug replacement",
      "Brake release and safety check",
      "Recovery to workshop if unrideable",
    ],
    benefits: [
      ["Nearest mechanic dispatched", "We route whoever is closest to your pin — arrival time confirmed on WhatsApp before dispatch."],
      ["Rideable or recovered", "You are never left stranded with the bike."],
      ["Upfront charges", "Callout and repair charges told before dispatch."],
      ["Open 7:00 AM to 11:30 PM, every day", "Book within operating hours; the day's schedule is confirmed when you book."],
    ],
    pricing:
      "A callout charge applies to emergency dispatch and is quoted on the phone before anyone rides out. The Running Repair package is ₹450 — fault inspection, minor repair labour and a safety check — with parts billed at MRP after your approval.",
    limits: [
      "Open 7:00 AM to 11:30 PM, every day — requests within operating hours are booked the same way; the mechanic's arrival window is confirmed on the call.",
      "Accident damage and recovery from accidents — call first; we assess and recover safely.",
      "Major repairs at the roadside — the bike is recovered to the workshop instead.",
    ],
    steps: DISPATCH_STEPS,
    faqs: [
      ["How fast can you reach me?", "We dispatch the nearest available mechanic immediately after your call. Traffic and distance decide arrival, and we share the expected time on WhatsApp before dispatch."],
      ["Are you available at night?", "Doorstep visits run 7:00 AM to 11:30 PM, every day. Book by call or WhatsApp before 11:30 PM; the arrival window is confirmed when you book, and actual mechanic availability may vary."],
      ["What does an emergency callout cost?", "A callout charge applies and is quoted on the phone before dispatch; the Running Repair package is ₹450 and parts are billed after your approval."],
      ["My bike stalled in a waterlogged stretch — what should I do?", "Do not keep cranking it. Call us; water in the airbox needs to be cleared before starting, which we do on site."],
      ["Can you replace the battery on the road?", "Yes — common battery sizes are carried, and we test the charging system so the new battery is not killed by the same fault."],
      ["How do I pay?", "UPI, card or cash at the roadside or after recovery; the invoice reaches your WhatsApp immediately."],
      ["What if the bike cannot be fixed on the spot?", "We recover it to the nearest Ride N Care workshop free within the city, with the repair estimate shared before work begins."],
    ],
    relatedGuides: ["bike-breakdown-troubleshooting-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: true,
    priceFrom: 450,
    serviceType: "Emergency Bike Repair",
    related: ["bike-breakdown-assistance", "doorstep-bike-repair", "battery-service", "bike-repair"],
  },
  {
    slug: "bike-breakdown-assistance",
    name: "Bike Breakdown Assistance",
    h1: "Bike Breakdown Assistance in Bangalore",
    subheading: "Roadside assessment, honest diagnosis and recovery — for the bike that stops mid-ride or refuses to move after a flood-hit street.",
    title: "Bike Breakdown Assistance in Bangalore | Ride N Care",
    description:
      "Bike breakdown assistance across Bangalore — roadside diagnosis, on-spot repair and bike recovery to our workshop. Call 080 6940 9289 or WhatsApp 82969 50339.",
    summary:
      "Bike breakdown assistance in Bangalore covers everything from a stall mid-commute to a bike left immobile by monsoon waterlogging. We diagnose the fault roadside, fix what can be fixed on the spot, and recover the bike to our workshop free within the city when it cannot be made rideable.",
    intro:
      "Breakdown assistance covers everything from a bike that stops mid-ride to one that will not move after a flood-hit street. We assess, fix what can be fixed roadside, and recover the rest.",
    detail: [
      "Bangalore's monsoon leaves water in air boxes and silencers, and summer heat leaves batteries flat. Both leave a bike immobile in a way that looks alarming and is often quick to solve once diagnosed properly — that diagnosis is the service.",
      "Our assistance mechanics carry a jump pack, tool roll, spare cables, fuses, plugs and a puncture kit — the parts behind most roadside failures. Charges are confirmed before we ride out.",
    ],
    includes: [
      "Roadside fault diagnosis",
      "Jump-start and battery service",
      "Fuel, plug and water-ingress troubleshooting",
      "Cable, fuse and clutch fixes",
      "Puncture repair",
      "Recovery and transport to workshop",
    ],
    benefits: [
      ["City-wide cover", "Assistance across all Ride N Care service areas in Bangalore."],
      ["Real diagnosis", "The cause is found, not guessed at."],
      ["No abandoned bikes", "Recovery included where needed."],
      ["Clear pricing", "Charges confirmed before we ride out."],
    ],
    pricing:
      "A callout charge is quoted on the phone before dispatch. The Running Repair package is ₹450 — fault inspection, minor repair labour and a safety check — and parts are billed at MRP only after your approval. Recovery to our workshop within the city is free once you approve the next step.",
    limits: [
      "Major roadside repairs — the bike is recovered to the workshop instead.",
      "7:00 AM to 11:30 PM, every day — the arrival window is confirmed on the call.",
      "Accident recovery — call us first so the bike is secured and moved safely.",
    ],
    steps: DISPATCH_STEPS,
    faqs: [
      ["Do you recover the bike if it cannot be repaired?", "Yes, to the nearest Ride N Care workshop, with the repair estimate shared before work begins."],
      ["My bike stalled in waterlogging — can you help?", "Do not keep cranking it. Call us; water ingress needs the airbox and cylinder cleared before starting, which we do on site."],
      ["Is breakdown assistance available on holidays?", "Yes — breakdown assistance runs 7:00 AM to 11:30 PM, every day, holidays included."],
      ["What does breakdown assistance cost?", "The callout is quoted on the phone before dispatch; Running Repair is ₹450 with parts billed only after approval."],
      ["Which areas do you cover?", "All 40 confirmed Ride N Care service localities across east, south, north, west and central Bangalore — see the areas page for the full list."],
      ["How do I pay?", "UPI, card or cash; the digital invoice reaches your WhatsApp immediately."],
    ],
    relatedGuides: ["bike-breakdown-troubleshooting-guide", "when-to-service-your-bike"],
    reviewed: "2026-09-19",
    local: false,
    priceFrom: 450,
    serviceType: "Bike Breakdown Assistance",
    related: ["emergency-bike-repair", "doorstep-bike-repair", "battery-service"],
  },
  {
    slug: "engine-repair",
    name: "Bike Engine Repair",
    h1: "Bike Engine Repair in Bangalore",
    subheading: "Compression, plug and oil checked before anyone says the word overhaul — many engine complaints turn out to be far cheaper than they sound.",
    title: "Bike Engine Repair in Bangalore | Ride N Care",
    description:
      "Bike engine repair in Bangalore that starts with a real diagnosis — compression test, plug and oil check — before any top-end work is quoted.",
    summary:
      "Engine work deserves a proper diagnosis first. A Ride N Care mechanic measures compression, inspects the plug and oil, and only then recommends a top-end job, a full overhaul or something far simpler. White or blue smoke, knocks, overheating and power loss all start with this free assessment in Bangalore.",
    intro:
      "Engine work deserves a proper diagnosis first. We measure compression, inspect the plug and oil, and only then recommend a top-end job, a full overhaul or something far simpler.",
    detail: [
      "Symptoms that bring riders here: white or blue smoke, a metallic knock, sudden loss of pull, overheating in traffic, oil consumption, or a bike that starts only on the third or fourth kick.",
      "Many of these turn out to be a clogged air filter, a worn plug or the wrong oil grade. Where genuine internal wear exists — rings, piston, valves, bearings — you get a photographed finding and an itemised estimate before we open the engine.",
    ],
    includes: [
      "Compression and leak-down testing",
      "Piston, ring and cylinder assessment",
      "Valve clearance and head service",
      "Top-end overhaul or full rebuild",
      "Oil-seal and gasket replacement",
      "Post-repair running-in guidance",
    ],
    benefits: [
      ["Diagnosis-led", "No engine is opened on a hunch."],
      ["Itemised estimate", "Parts and labour listed before approval."],
      ["OEM internals", "Genuine pistons, rings, gaskets and seals."],
      ["Run-in support", "Follow-up check after the first 500 km."],
    ],
    pricing:
      "Engine diagnosis is free. Minor running repairs fall under the ₹450 Running Repair package; overhauls are quoted itemised — parts and labour separately — based on your model, and the estimate is approved in writing before the engine is opened.",
    limits: [
      "All engine strip-downs happen in our workshop, not at the doorstep — the engine needs a bench and specialist tools. Pickup and drop are free.",
      "Performance modifications and boring work are not offered.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Can engine repair be done at home?", "Diagnosis and light work, yes. An overhaul goes to our workshop with free transport, since the engine needs a bench and specialist tools."],
      ["How long does an overhaul take?", "Typically 2–4 working days depending on parts availability for your model."],
      ["Is my engine noise serious?", "Not always — chain and valve noise are often mistaken for internal damage. A free diagnosis will tell you before you spend anything."],
      ["How much does engine repair cost?", "Minor repairs fall under the ₹450 Running Repair package. Overhauls are quoted itemised per model and approved in writing first."],
      ["What does a free diagnosis include?", "Compression test, plug and oil inspection, and a written finding with the recommended next step."],
      ["Do you use genuine engine parts?", "Yes — OEM pistons, rings, gaskets and seals, with part numbers on the invoice."],
      ["Is there a warranty?", "A 45-day service warranty on the repair, plus a follow-up check after the first 500 km of running-in."],
    ],
    relatedGuides: ["common-bike-problems-and-solutions", "complete-bike-maintenance-guide"],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Bike Engine Repair",
    related: ["bike-repair", "motorcycle-service", "general-two-wheeler-repair"],
  },
  {
    slug: "brake-service",
    name: "Bike Brake Service",
    h1: "Bike Brake Service & Repair in Bangalore",
    subheading: "Pads and shoes measured, not guessed — and the old parts handed back to you with the wear numbers.",
    title: "Bike Brake Service in Bangalore | Ride N Care",
    description:
      "Bike brake service in Bangalore at your doorstep — pad and shoe replacement, disc check, brake bleeding and squeal fixes with OEM parts.",
    summary:
      "Brakes are the one system worth servicing early. A Ride N Care mechanic measures pad and shoe thickness at your doorstep, checks the disc and drum, bleeds the line if the lever feels spongy, and sets free play correctly — with the measured wear shown to you before anything is replaced.",
    intro:
      "Brakes are the one system worth servicing early. We measure pad and shoe thickness, check the disc and drum, bleed the line if the lever feels spongy, and set free play correctly.",
    detail: [
      "In Bangalore stop-start traffic, brake pads wear roughly twice as fast as highway use. A soft lever, a squeal, a vibration under braking or a bike pulling to one side are all signals to book a brake check.",
      "We fit OEM-grade pads and shoes and show you the removed parts, along with the measured wear that justified replacement.",
    ],
    includes: [
      "Pad and shoe thickness measurement",
      "Front and rear pad / shoe replacement",
      "Disc runout and drum condition check",
      "Brake fluid change and line bleeding",
      "Cable lubrication and free-play setting",
      "Post-service test ride with you present",
    ],
    benefits: [
      ["Measured, not guessed", "Wear numbers shown before replacement."],
      ["Squeal fixes", "Glazing and dust cleaned, not just masked."],
      ["Doorstep service", "Full brake work possible at your parking bay."],
      ["45-day warranty", "On the brake work performed."],
    ],
    pricing:
      "Brake inspection is free and minor adjustments fall under the ₹450 Running Repair package. Pads, shoes, discs and fluid are quoted at MRP before fitting — the total is approved in writing before work starts.",
    limits: [
      "Disc skimming and caliper rebuilds on some models — workshop jobs.",
      "ABS module faults — diagnosed on site, repaired with the manufacturer network where needed.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How often should brake pads be replaced?", "Typically every 8,000–15,000 km, much sooner in heavy city traffic. We measure rather than assume."],
      ["Why do my brakes squeal?", "Usually glazed pads or brake dust build-up; sometimes a worn disc. Cleaning and correct bedding-in solves most cases."],
      ["Do you change brake fluid?", "Yes — recommended every two years, or sooner if the lever feels spongy."],
      ["What does brake service cost?", "Inspection is free; minor work falls under the ₹450 Running Repair package. Pads and shoes are quoted at MRP before fitting."],
      ["Can brake work be done at my parking spot?", "Yes — pad, shoe, cable and fluid work is fully doorstep-capable."],
      ["Is there a warranty?", "A 45-day service warranty on the brake work, plus the manufacturer warranty on parts."],
    ],
    relatedGuides: ["complete-bike-maintenance-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Bike Brake Service",
    related: ["bike-service", "bike-repair", "clutch-repair"],
  },
  {
    slug: "clutch-repair",
    name: "Bike Clutch Repair",
    h1: "Bike Clutch Repair in Bangalore",
    subheading: "Slipping, grabbing or a stiff lever — free-play adjustment fixes more clutches than parts do, and we check that first.",
    title: "Bike Clutch Repair in Bangalore | Ride N Care",
    description:
      "Bike clutch repair in Bangalore — slipping clutch, hard lever and plate replacement done at your doorstep with OEM parts and a written quote.",
    summary:
      "A slipping or grabbing clutch makes city riding exhausting and burns fuel. Ride N Care checks clutch free play and the cable first — which fixes a surprising number of complaints — and replaces plates or the cable only when the inspection genuinely calls for it, at your doorstep in Bangalore.",
    intro:
      "A slipping or grabbing clutch makes city riding exhausting and burns fuel. We adjust, replace the cable or fit new plates depending on what the inspection actually shows.",
    detail: [
      "Clutch symptoms in Bangalore traffic are common because of constant lever use: engine revs rise without matching acceleration, gear shifts turn clunky, or the lever gets stiff and vague.",
      "Free play adjustment and cable lubrication fix a surprising number of complaints. Where plates are glazed or thin, we replace them as a set with the correct oil.",
    ],
    includes: [
      "Clutch free-play adjustment",
      "Cable replacement and lubrication",
      "Clutch plate and spring replacement",
      "Pressure-plate and basket inspection",
      "Correct-spec oil refill after plate work",
      "Gear-shift quality test ride",
    ],
    benefits: [
      ["Lighter lever", "Less fatigue in stop-start traffic."],
      ["Better mileage", "A slipping clutch wastes fuel every kilometre."],
      ["Set replacement", "Plates changed as a matched set, not mixed."],
      ["Doorstep possible", "Most clutch jobs done at your address."],
    ],
    pricing:
      "Inspection is free; free-play and cable work falls under the ₹450 Running Repair package. A plate set depends on the model and is quoted at MRP — the exact figure is approved in writing before work starts.",
    limits: [
      "Pressure-plate or basket machining — workshop jobs.",
      "Wet-multiplate work on some large bikes needs special tools; we tell you upfront.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How do I know the clutch is slipping?", "Revs climb but speed does not, especially uphill or in third gear. A test ride confirms it quickly."],
      ["Can clutch plates be changed at home?", "On most commuter bikes and many motorcycles, yes — at your parking spot."],
      ["What does clutch repair cost?", "Cable and adjustment work falls under the ₹450 Running Repair package; a plate set depends on the model and is quoted before approval."],
      ["Why is my clutch lever so hard?", "Usually a dry or fraying cable, sometimes the push lever. Lubrication or cable replacement solves it."],
      ["Is there a warranty?", "A 45-day service warranty on the work, plus the manufacturer warranty on parts."],
      ["How long does it take?", "Adjustment minutes; a plate set typically under two hours at your address."],
    ],
    relatedGuides: ["complete-bike-maintenance-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Bike Clutch Repair",
    related: ["bike-repair", "brake-service", "general-two-wheeler-repair"],
  },
  {
    slug: "battery-service",
    name: "Bike Battery Service",
    h1: "Bike Battery Replacement at Home in Bangalore",
    subheading: "A slow crank usually needs a test before a battery — we check the charging system first so the new one does not die the same way.",
    title: "Bike Battery Replacement at Home | Ride N Care",
    description:
      "Bike battery replacement at your home in Bangalore. Free load test first, battery fitted at your gate, terms stated on the quote. Call 080 6940 9289.",
    summary:
      "A bike that cranks slowly or clicks and dies usually needs a battery test, not immediately a new battery. Ride N Care tests the battery and the charging system free at your home in Bangalore, then fits a replacement at your gate only if the test says the battery is genuinely finished.",
    intro:
      "A bike that cranks slowly or clicks and dies usually needs a battery test, not immediately a new battery. We test first, then fit a replacement at your doorstep if it is genuinely finished.",
    detail: [
      "Batteries fail early when the charging system is at fault, so we check regulator-rectifier output and standing drain before recommending a replacement. Otherwise the new battery dies the same way.",
      "Replacements are fitted at your address: terminals cleaned and protected, the new battery fitted, and the invoice on WhatsApp before you pay. What happens to the old battery is confirmed with you at booking."
    ],
    includes: [
      "Free battery load and voltage test",
      "Charging-system and drain check",
      "Jump-start service",
      "Doorstep battery replacement",
      "Terminal cleaning and protection",
    ],
    benefits: [
      ["Test before you buy", "No unnecessary replacement."],
      ["Fast fitting", "Common battery sizes carried in the van — most replacements are a single visit."],
      ["Manufacturer warranty", "Battery warranty terms are stated on the quote and invoice."],
      ["Root cause checked", "Charging faults found before they kill the new battery."],
    ],
    pricing:
      "The battery health and charging-system test is free. Jump Start is ₹399. Replacement batteries are priced by model and capacity and quoted at MRP before fitting — the total, including fitting, is confirmed in writing before work starts.",
    limits: [
      "Battery and motor faults on electric scooters — these stay with the manufacturer's service network.",
      "Batteries for rare imported models may need a day to source; we confirm the arrival date before booking.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How long does a bike battery last?", "Around 2.5–4 years in Bangalore. Heat and long parked spells shorten it."],
      ["Can you replace the battery at my home?", "Yes — testing and replacement are done in your parking bay, in one visit for common battery sizes."],
      ["Do the batteries carry a warranty?", "Warranty terms for the battery fitted are stated on the written quote and the invoice before you pay — no surprises after the job."],
      ["What if the battery is actually fine?", "Then we say so — the test is free and you have paid nothing. If the charging system is the real fault, we diagnose that instead."],
      ["What does it cost?", "The test is free and Jump Start is ₹399. Replacement batteries are quoted by model before fitting."],
      ["What happens to the old battery?", "Disposal of the old battery is confirmed with you at booking."],
      ["How do I pay?", "UPI, card or cash after the job; the invoice reaches your WhatsApp immediately."],
    ],
    relatedGuides: ["bike-breakdown-troubleshooting-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: false,
    priceFrom: 399,
    serviceType: "Bike Battery Service",
    related: ["electrical-repair", "doorstep-bike-repair", "emergency-bike-repair"],
  },
  {
    slug: "electrical-repair",
    name: "Bike Electrical Repair",
    h1: "Bike Electrical Repair in Bangalore",
    subheading: "Self-starts, dim lights, blown fuses and overnight drain — traced with a multimeter instead of swapping parts hopefully.",
    title: "Bike Electrical Repair in Bangalore | Ride N Care",
    description:
      "Bike electrical repair in Bangalore — self-start failure, wiring faults, charging problems, lights and indicators fixed at your doorstep.",
    summary:
      "Electrical faults are the hardest to guess and the easiest to fix once measured. A Ride N Care mechanic traces self-start failures, charging problems, dim lights and battery drain with a multimeter at your doorstep in Bangalore, then repairs or replaces only the part that actually failed.",
    intro:
      "Electrical faults are the hardest to guess and the easiest to fix once measured. Our mechanics trace them with a multimeter instead of swapping parts hopefully.",
    detail: [
      "Typical complaints: the self-start clicks but does not turn, headlights dim at idle, indicators stop blinking, a fuse blows repeatedly, or the battery drains overnight.",
      "We test the stator, regulator-rectifier, starter relay, switchgear and wiring loom to find the actual break, then repair or replace only what failed.",
    ],
    includes: [
      "Multimeter-based fault tracing",
      "Self-start motor and relay repair",
      "Stator and regulator-rectifier testing",
      "Wiring loom repair and re-insulation",
      "Headlight, indicator and horn repair",
      "Parasitic drain diagnosis",
    ],
    benefits: [
      ["Measured diagnosis", "The fault is located, not guessed."],
      ["Repair over replace", "Loom repair where a new part is not needed."],
      ["Doorstep capable", "Most electrical work done at your address."],
      ["Safety focus", "Correct fuse ratings and proper insulation."],
    ],
    pricing:
      "Diagnosis is free and minor electrical fixes fall under the ₹450 Running Repair package. Regulators, relays and loom work are quoted at MRP plus labour before fitting — approved in writing first.",
    limits: [
      "ECU and fuel-injection control faults on some models — diagnosed on site, repaired via the manufacturer network if proprietary.",
      "Full loom replacement on older bikes — quoted as a workshop job with free transport.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["My self-start is not working — is it the battery?", "Often, but not always. It can also be the starter relay, motor or switch. Testing takes minutes and tells us for sure."],
      ["Why does my battery drain overnight?", "A parasitic drain, usually from accessory wiring or a failing regulator. We measure standing current to find it."],
      ["Do you fix aftermarket accessory wiring?", "Yes, and we re-do unsafe installations with proper fusing."],
      ["What does electrical repair cost?", "Diagnosis is free; minor fixes fall under the ₹450 Running Repair package and bigger parts are quoted before fitting."],
      ["Can this be done at my home?", "Yes — most electrical work is completed at your parking spot."],
      ["Is there a warranty?", "A 45-day service warranty on the repair, plus the manufacturer warranty on parts."],
    ],
    relatedGuides: ["common-bike-problems-and-solutions", "bike-breakdown-troubleshooting-guide"],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Bike Electrical Repair",
    related: ["battery-service", "bike-repair", "general-two-wheeler-repair"],
  },
  {
    slug: "general-two-wheeler-repair",
    name: "General Two-Wheeler Repair",
    h1: "General Two-Wheeler Repair in Bangalore",
    subheading: "Cables, punctures, suspension, locks and a proper wash — the everyday jobs that keep a two-wheeler pleasant to ride.",
    title: "Two Wheeler Repair in Bangalore | Ride N Care",
    description:
      "General two-wheeler repair in Bangalore — bikes, scooters and EVs. Suspension, tyres, cables, punctures and washing at your doorstep. Call 080 6940 9289.",
    summary:
      "Not sure what your two-wheeler needs? Book a general inspection and a Ride N Care mechanic comes to your Bangalore address, checks the bike over and gives you a prioritised list — then handles cables, punctures, suspension, tyres, locks and the wash in the same visit.",
    intro:
      "The everyday jobs that keep a two-wheeler pleasant to ride: cables, punctures, suspension, mirrors, locks, tyres and a proper wash — all handled at your doorstep.",
    detail: [
      "This is our catch-all service for anything outside a scheduled package. If you are unsure what your bike needs, book a general inspection and we will tell you what is genuinely due and what can wait.",
      "We work on motorcycles, automatic scooters and electric two-wheelers for all running-gear and body items.",
    ],
    includes: [
      "General inspection with priority list",
      "Cable, lever and switch replacement",
      "Suspension and fork-seal work",
      "Tyre replacement and puncture repair",
      "Wheel bearing and sprocket service",
      "Lock, mirror and body-part fitting",
      "Foam wash and polish",
    ],
    benefits: [
      ["Honest priorities", "Told what to fix now and what can wait."],
      ["One visit, many jobs", "Small tasks bundled into a single slot."],
      ["All two-wheelers", "Bikes, scooters and EVs."],
      ["Doorstep convenience", "Nothing needs to leave your building."],
    ],
    pricing:
      "The doorstep inspection is free. Minor fixes fall under the ₹450 Running Repair package; parts such as tyres and cables are quoted at MRP before fitting — approved in writing first.",
    limits: [
      "Engine strip-downs, wheel truing and paint — workshop jobs with free transport.",
      "EV battery and motor faults — manufacturer service network.",
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["I do not know what is wrong — can you just check?", "Yes. Book a general inspection; the doorstep diagnosis is free and you get a prioritised list."],
      ["Do you replace tyres at home?", "Yes, with tyres sourced to your specified brand and size."],
      ["Do you also wash the bike?", "A foam wash and dry finish is included with most service packages and available on its own."],
      ["What does it cost?", "Inspection is free; minor work falls under the ₹450 Running Repair package with parts quoted before fitting."],
      ["Do you handle electric two-wheelers?", "Yes — running gear, brakes, tyres and body items. Battery and motor faults go to the manufacturer network."],
      ["How do I pay?", "UPI, card or cash after the work; the invoice reaches your WhatsApp immediately."],
    ],
    relatedGuides: ["complete-bike-maintenance-guide", "common-bike-problems-and-solutions"],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Two Wheeler Repair",
    related: ["bike-service", "bike-repair", "scooter-service", "brake-service"],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
/** Services that get /<service>/<area> local landing pages. */
export const LOCAL_SERVICES = SERVICES.filter((s) => s.local);
export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
