/**
 * Ride N Care car-service catalogue (SEO program Part 6).
 * Drives /car-periodic-service, /car-ac-service, /car-battery-service,
 * /car-brake-service and the rebuilt /cars hub.
 *
 * Content rules: one intent per page, answer-first summary, honest limits,
 * no invented prices (car packages have no confirmed price in src/lib/pricing.ts
 * yet — pricing sections explain what drives the price instead), no unverified
 * claims, and brands only from the owner-confirmed CAR_BRANDS list (Q4) in
 * src/lib/booking.ts.
 */
import type { ServiceDef } from "@/lib/services";

/**
 * Car brands shown on /cars — ONLY the seven confirmed in the booking config
 * (owner Q4). The booking flow's CAR_BRANDS also lists Renault, Volkswagen,
 * Skoda, Ford, Nissan and MG as selectable options, but those were never
 * owner-confirmed for public service claims, so they stay out of copy.
 * Logged in docs/seo/OWNER-QUESTIONS.md (Q27).
 */
export const CAR_BRAND_LIST = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
] as const;

const CAR_BOOK_STEPS: [string, string][] = [
  ["1. Tell us your car", "Share the make, model and what it needs on WhatsApp or the booking form. Takes under a minute."],
  ["2. Get a written quote", "We confirm the work, parts and the slot in writing before anything is opened."],
  ["3. Mechanic reaches you", "A background-verified Ride N Care mechanic arrives at your gate with tools, consumables and OEM-grade spares."],
  ["4. Pay after the check", "Inspect the work, take the car for a short drive, then pay by UPI, card or cash. Invoice on WhatsApp."],
];

export const CAR_SERVICES: ServiceDef[] = [
  {
    slug: "car-periodic-service",
    name: "Car Periodic Service",
    h1: "Car Periodic Service at Home in Bangalore",
    subheading: "The maintenance your manufacturer schedules by kilometres or months — oil, filters, brakes and a multi-point inspection done where your car is parked.",
    title: "Car Periodic Service at Home in Bangalore | Ride N Care",
    description:
      "Doorstep car periodic service in Bangalore — engine oil, filters, brakes, fluids and multi-point inspection at your home or office. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care does car periodic service at your home or office in Bangalore — engine oil and filter, air filter, brake check, coolant and other fluids, battery test, lights and wipers, and a multi-point inspection. You approve a written quote first, and the job runs until the checklist is done and you have inspected the work.",
    intro:
      "Periodic service is the maintenance your car's manufacturer schedules by kilometres or months. We do it at your doorstep, on the day you choose, with a written quote before work starts.",
    detail: [
      "Bangalore is hard on cars: stop-start traffic from Silk Board to Hebbal, dusty construction stretches, and monsoon waterlogging that finds every tired fluid. A periodic service that only changes oil misses what actually breaks down here — which is why ours is a checklist, not an oil change: brakes measured, coolant and brake fluid condition checked, battery tested, lights and wipers verified, and anything worn shown to you before it is replaced.",
      "The mechanic works in your parking bay, shows you every part that comes out, and hands over the invoice on WhatsApp. If your car is still inside its free-service period at the company workshop, we will honestly tell you to use that first.",
    ],
    includes: [
      "Engine oil and oil filter change",
      "Air filter cleaning (replacement quoted if due)",
      "Brake check — pads, discs and fluid condition",
      "Coolant, brake fluid and washer fluid top-up",
      "Battery test and terminal check",
      "Lights, horn, wipers and indicators check",
      "Tyre pressure and tread check",
      "Multi-point inspection report",
    ],
    benefits: [
      ["No service-centre Saturday", "No driving across town or leaving the car for the day — the workshop comes to your parking spot."],
      ["Watch every step", "Each part is shown before it goes in and after it comes out. Nothing is swapped out of sight."],
      ["Service record kept", "A dated digital record of what was done, with a reminder when the next interval is due."],
      ["7-day workmanship guarantee", "If a serviced item plays up within a week, we return and set it right free."],
    ],
    pricing:
      "Car periodic service is priced by your car's make, model and engine — the oil grade and capacity, filter type and brake condition all change the quote, so we confirm the exact amount in writing after you share the model. Consumables and any extra parts are billed only after your approval.",
    limits: [
      "Engine, gearbox and clutch overhauls — workshop bench jobs; we arrange pickup and share the estimate first.",
      "Paint, denting and accident bodywork — not suitable for open-air doorstep work.",
      "Wheel alignment needs a hoist and alignment rack — done at our partner workshop with pickup arranged.",
      "Warranty-period free services — use the authorised service centre for those visits.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["What does a doorstep car service in Bangalore include?", "Engine oil and filter change, air filter cleaning, brake check, coolant and fluid top-ups, battery test, lights and wipers check, tyre check and a multi-point inspection — completed at your home or office."],
      ["How long will the mechanic be at my place?", "The arrival window is confirmed at booking, and the visit runs until the checklist is complete and you have inspected the work — we do not quote job durations we cannot guarantee."],
      ["How much does car service at home cost in Bangalore?", "It is priced by your car's make, model and engine — oil grade and capacity, filter type and brake condition change the quote. Share the model and we confirm the exact amount in writing before work starts. Call 080 6940 9289 or WhatsApp 82969 50339."],
      ["Will doorstep service affect my car warranty?", "Warranty on a specific part stays with the part maker. If your car is still inside the manufacturer's free-service period, we recommend using those free services first."],
      ["What do I need to provide?", "Parking space to work in and, ideally, a plug point. The mechanic records the odometer and registration number from the car itself."],
      ["Do you use genuine parts?", "OEM or OEM-grade only. Oil is shown to you sealed before pouring, and every part fitted appears on the digital invoice."],
      ["Can I cancel or reschedule?", "Yes — free cancellation or reschedule on WhatsApp any time before the mechanic is dispatched."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Car Periodic Service",
    related: ["car-ac-service", "car-battery-service", "car-brake-service"],
  },
  {
    slug: "car-ac-service",
    name: "Car AC Service",
    h1: "Car AC Service & Gas Refill at Home in Bangalore",
    subheading: "Cooling checked properly before anyone says \"gas leak\" — vents, compressor, cabin filter and gas level measured at your doorstep.",
    title: "Car AC Service & Gas Refill at Home in Bangalore | Ride N Care",
    description:
      "Car AC service at your home in Bangalore — cooling check, cabin filter, cooling coil cleaning and gas refill with leak diagnosis. Written quote first. Call 080 6940 9289.",
    summary:
      "Car AC service at home in Bangalore: a Ride N Care mechanic measures vent temperature, checks the compressor and cooling coil, inspects the cabin filter and tests the gas level before recommending a refill. If the cooling loss is a leak or a failed part, you see the finding in writing before any refill is done.",
    intro:
      "A car AC that has gone weak needs a diagnosis, not a blind gas top-up. We measure, clean and refill at your doorstep — and tell you honestly if the problem is a leak instead.",
    detail: [
      "In Bangalore's summer and pre-monsoon humidity, a weak AC is usually one of four things: low refrigerant, a clogged cabin filter, a dirty cooling coil, or a compressor not cutting in. Topping up gas without checking the first three wastes money — and if the system has a leak, the new gas is gone in weeks. So the visit starts with measurement: vent temperature at idle and revving, gas level, compressor engagement, and filter condition.",
      "A standard AC service covers gas level check and refill, cooling coil cleaning and cabin filter inspection. Compressor or leak repairs are quoted separately — the part is shown to you and the finding written down before you approve anything.",
    ],
    includes: [
      "AC gas level check",
      "Cooling coil cleaning",
      "Cabin filter check (replacement quoted if due)",
      "Compressor check-up",
      "Vent temperature reading before and after",
      "Blower and airflow check",
    ],
    benefits: [
      ["Measured first", "Vent temperatures and gas level are read before anything is refilled."],
      ["No blind top-ups", "If a leak is found, you are told before any gas goes in."],
      ["Doorstep convenience", "Done in your parking bay — no leaving the car at a centre for the day."],
      ["Cleaner cabin air", "Cabin filter and coil care that shows up immediately in airflow and smell."],
    ],
    pricing:
      "AC service is priced by your car's model — refrigerant type and quantity, cabin filter cost and the condition of the system all change the quote. Share the model and we confirm the exact amount in writing before work starts; any leak or compressor repair is quoted separately after diagnosis.",
    limits: [
      "Leak repair and compressor replacement — diagnosed on site; the repair itself is quoted and scheduled before parts are ordered.",
      "Full dashboard-off evaporator work — a workshop job; we arrange pickup and share the estimate first.",
      "Refrigerant top-up without a passed leak check is not offered — it wastes your money.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["How much does a car AC gas refill cost in Bangalore?", "It depends on the refrigerant type and quantity your model needs, and whether the system holds the gas. Share your car model and we confirm the exact quote in writing before work starts — Call 080 6940 9289 or WhatsApp 82969 50339."],
      ["Why is my car AC not cooling?", "Usually one of four causes: low refrigerant, a clogged cabin filter, a dirty cooling coil, or a compressor not engaging. We measure each of these at your doorstep before recommending a fix."],
      ["How long does car AC service take?", "The arrival window is confirmed at booking, and the visit runs until the gas check, coil cleaning, cabin filter check and compressor test are complete and you have inspected the work."],
      ["Do you check for gas leaks?", "Yes. If the system is not holding gas, we tell you before refilling — a top-up on a leaking system is money wasted, and we would rather quote the real repair."],
      ["Do you replace cabin filters?", "Yes — the filter's condition is shown to you and a replacement is quoted at MRP before fitting."],
      ["Can AC service be done in my basement parking?", "Yes — the work needs one parking bay and no lift. We bring drip trays and containment for the coil cleaning."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Car AC Service",
    related: ["car-periodic-service", "car-battery-service", "car-brake-service"],
  },
  {
    slug: "car-battery-service",
    name: "Car Battery Service",
    h1: "Car Battery Replacement at Home in Bangalore",
    subheading: "A slow crank gets a test before a battery — charging system and drain checked first, so the new one does not die the same way.",
    title: "Car Battery Replacement at Home in Bangalore | Ride N Care",
    description:
      "Car battery replacement at your home in Bangalore. Free test first, battery fitted at your gate, terms stated on the quote. Call 080 6940 9289 or WhatsApp 82969 50339.",
    summary:
      "A car that cranks slowly or needs jump-starts usually needs a battery test, not automatically a new battery. Ride N Care tests the battery and charging system at your home in Bangalore, then fits a replacement at your gate only if the test says the battery is genuinely finished.",
    intro:
      "A car that cranks slowly or clicks and dies usually needs a battery test, not immediately a new battery. We test first, then fit a replacement at your doorstep only if the test says so.",
    detail: [
      "Car batteries in Bangalore last around three to five years, and heat plus short trips shorten that. But the same symptoms — slow crank, dim lights at idle, a car that starts after a jump — can come from a failing alternator or a parasitic drain, and a new battery dies the same way if those are not caught. So the visit starts with a load test and a charging-system check, and only then a replacement recommendation.",
      "Replacements are fitted at your address: terminals cleaned and protected, the new battery fitted, and the invoice on WhatsApp before you pay. What happens to the old battery is confirmed with you at booking."
    ],
    includes: [
      "Free battery load and voltage test",
      "Charging-system (alternator) and drain check",
      "Jump-start service",
      "Doorstep battery replacement",
      "Terminal cleaning and protection",
    ],
    benefits: [
      ["Test before you buy", "No unnecessary replacement — the test is free."],
      ["Root cause checked", "Alternator and drain faults found before they kill the new battery."],
      ["Digital invoice", "The invoice reaches your WhatsApp before you pay."],
      ["Fitted at your gate", "Common battery sizes travel with the van, so most replacements are a single visit."],
    ],
    pricing:
      "The battery and charging-system test is free. Replacement batteries are priced by your car's model and battery capacity and quoted at MRP before fitting — the total, including fitting, is confirmed in writing before work starts. Call 080 6940 9289 or WhatsApp 82969 50339 with your model.",
    limits: [
      "Batteries for rare imported models may need a day to source — the arrival date is confirmed before booking.",
      "Alternator and starter-motor repairs — diagnosed on site, repaired as a quoted job.",
      "EV high-voltage battery faults — these stay with the manufacturer's service network.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["How long does a car battery last in Bangalore?", "Around three to five years. Heat, short trips and long parked spells shorten it — a test tells you where yours stands."],
      ["Can you replace the car battery at my home?", "Yes — testing and replacement are done in your parking bay, in one visit for common battery sizes."],
      ["How much does car battery replacement cost?", "Batteries are priced by your car's model and capacity and quoted at MRP before fitting; the test is free. The total is confirmed in writing before work starts."],
      ["What if the battery is actually fine?", "Then we say so — you have paid nothing. If the alternator or a drain is the real fault, we diagnose that instead of selling you a battery."],
      ["Do the batteries carry a warranty?", "Warranty terms for the battery fitted are stated on the written quote and the invoice before you pay — no surprises after the job."],
      ["My car is completely dead — can you help?", "Yes. Call 080 6940 9289 or WhatsApp 82969 50339 — we jump-start, test the battery and charging system, and replace only if the test says so."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Car Battery Service",
    related: ["car-periodic-service", "car-ac-service", "car-brake-service"],
  },
  {
    slug: "car-brake-service",
    name: "Car Brake Service",
    h1: "Car Brake Pad Replacement at Home in Bangalore",
    subheading: "Pad thickness measured, not guessed — and the old parts handed back to you with the wear numbers before anything is replaced.",
    title: "Car Brake Pad Replacement at Home in Bangalore | Ride N Care",
    description:
      "Car brake service at your doorstep in Bangalore — pad measurement, pad and disc replacement, brake fluid change. Written quote first. Call 080 6940 9289.",
    summary:
      "Brake pads are the one part worth replacing early. A Ride N Care mechanic measures pad thickness and disc condition at your doorstep in Bangalore, shows you the wear, and replaces pads, discs or fluid only with your written approval.",
    intro:
      "Brakes are the one system worth servicing early. We measure pad and disc wear, check the fluid, and replace only what the measurement justifies — at your doorstep.",
    detail: [
      "Bangalore's stop-start traffic wears brake pads far faster than highway use — often half the manufacturer interval. Squeal, a soft pedal, vibration under braking or the car pulling to one side are all signs to book a check. The visit starts with measurement: pad thickness on all four wheels, disc scoring and runout, fluid condition.",
      "Pads, discs and fluid are quoted at MRP before fitting, and the old parts stay with you if you want them. Front and rear pad replacement, disc replacement and fluid change are all fully doorstep-capable — the job is done in your parking bay and inspected with you before you pay.",
    ],
    includes: [
      "Pad thickness measurement on all wheels",
      "Front and rear brake pad replacement",
      "Brake disc condition check (replacement quoted if due)",
      "Brake fluid check and change",
      "Caliper and slider cleaning",
    ],
    benefits: [
      ["Measured, not guessed", "Wear numbers shown before replacement."],
      ["Old parts returned", "Proof the replacement actually happened."],
      ["Doorstep service", "Full brake work done at your parking bay."],
      ["7-day guarantee", "A 7-day workmanship guarantee on the brake work performed."],
    ],
    pricing:
      "Brake inspection is free. Pads, discs and fluid are priced by your car's model and quoted at MRP before fitting — the total, including labour, is confirmed in writing before work starts. Call 080 6940 9289 or WhatsApp 82969 50339 with your model.",
    limits: [
      "Disc skimming and caliper rebuilds on some models — workshop jobs; we arrange transport and share the estimate first.",
      "ABS module faults — diagnosed on site, repaired with the manufacturer network where needed.",
      "Drum-brake shoe work on older models — done at the workshop with free transport.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["How often should car brake pads be replaced?", "Often every 20,000–40,000 km, but heavy city traffic can halve that. We measure the actual thickness instead of assuming."],
      ["How much does car brake pad replacement cost in Bangalore?", "Pads are priced by your car's model and quoted at MRP before fitting; the inspection is free. The total is confirmed in writing before work starts — Call 080 6940 9289 or WhatsApp 82969 50339."],
      ["Why do my brakes squeal?", "Usually glazed pads or dust build-up; sometimes a wear indicator telling you the pads are due. Cleaning and correct bedding-in solves most cases; a worn pad is replaced."],
      ["Do you change brake fluid?", "Yes — typically every two years, or sooner if the pedal feels spongy. Fluid condition is checked during the inspection."],
      ["Can brake work be done in my parking spot?", "Yes — pad, disc and fluid work is fully doorstep-capable, and the finished work is inspected with you before you pay."],
      ["Is there a warranty?", "A 7-day workmanship guarantee on the brake work, plus the manufacturer warranty on the parts fitted."],
      ["What do I need to provide?", "Parking space and ideally a plug point — that is all."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Car Brake Service",
    related: ["car-periodic-service", "car-battery-service", "car-ac-service"],
  },
];

export const getCarService = (slug: string) => CAR_SERVICES.find((s) => s.slug === slug);
export const CAR_SERVICE_SLUGS = CAR_SERVICES.map((s) => s.slug);

/** Everything the /cars hub needs, in one place. */
export const CAR_HUB = {
  h1: "Car Service at Home in Bangalore",
  title: "Doorstep Car Service in Bangalore | Ride N Care",
  description:
    "Doorstep car service in Bangalore — periodic service, AC, battery and brakes at your home or office by background-verified mechanics. Written quote first.",
  summary:
    "Ride N Care services cars at your home or office across Bangalore — periodic maintenance, AC service, battery replacement and brakes — with a written quote before work starts and a 7-day workmanship guarantee on every job.",
  detail: [
    "From hatchbacks to SUVs, our mobile workshop arrives with diagnostic tools, OEM-grade spares and zero shortcuts. You approve a written quote before work starts, watch every part come out, and pay by UPI, card or cash after checking the work.",
  ],
} as const;

/** Homepage icon map for the car services. */
export const CAR_SERVICE_ICONS: Record<string, string> = {
  "car-periodic-service": "🚗",
  "car-ac-service": "❄️",
  "car-battery-service": "🔋",
  "car-brake-service": "🛑",
};
