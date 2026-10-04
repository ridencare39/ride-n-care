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
      ["45-day service warranty", "If an issue related to our work appears within 45 days, we inspect and correct it under the warranty."],
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
      ["45-day warranty", "A 45-day service warranty on the brake work performed."],
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
      ["Is there a warranty?", "A 45-day service warranty on the brake work, plus the manufacturer warranty on the parts fitted."],
      ["What do I need to provide?", "Parking space and ideally a plug point — that is all."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-19",
    local: false,
    serviceType: "Car Brake Service",
    related: ["car-periodic-service", "car-battery-service", "car-ac-service"],
  },
  {
    slug: "car-oil-change",
    name: "Car Oil Change",
    h1: "Car Engine Oil & Filter Change at Home in Bangalore",
    subheading:
      "Engine oil and filter changed in your parking bay — grade matched to your car, oil shown sealed before pouring, old parts shown after.",
    title: "Car Engine Oil & Filter Change at Home in Bangalore | Ride N Care",
    description:
      "Doorstep car engine oil and filter change in Bangalore — grade matched to your engine, OEM-grade filters, used-oil disposal included. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care changes car engine oil and the oil filter at your home or office in Bangalore. The mechanic matches the oil grade to your car's engine, shows you the sealed pack before pouring, replaces the filter, checks for leaks and hands over a digital invoice after you inspect the work.",
    intro:
      "An oil change is the smallest service with the biggest effect on engine life. We do it at your doorstep with the correct grade, and we show you every part.",
    detail: [
      "Bangalore's stop-start traffic is harder on engine oil than highway running — short trips never let the engine fully warm up, so oil shears and collects moisture faster. We match the grade and specification to your engine (the mechanic confirms it from the model you share at booking), show you the sealed pack before opening it, and record the odometer reading on the invoice.",
      "The old oil is drained into a sealed container and taken away for disposal — nothing is left in your parking bay. If the air filter or drain plug washer is due, you see the finding and the price before anything is replaced.",
    ],
    includes: [
      "Engine oil change — grade matched to your engine",
      "Oil filter replacement",
      "Drain plug washer check",
      "Oil level check after top-up and run",
      "Leak check under the engine",
      "Used-oil removal and disposal",
      "Odometer reading recorded on the invoice",
    ],
    benefits: [
      ["Correct grade, no guesswork", "The mechanic matches the oil specification to your car's make and engine before quoting."],
      ["Sealed pack, shown to you", "Oil is shown sealed before pouring — you see exactly what goes into your engine."],
      ["No mess left behind", "Used oil and the old filter are sealed and removed for disposal."],
      ["45-day service warranty", "If a leak or a fitting issue shows up within 45 days, we inspect and correct it under the warranty."],
    ],
    pricing:
      "The price depends on the oil grade and quantity your engine needs and the filter type — synthetic grades and larger engines cost more. Share your car's model and we confirm the exact amount in writing before work starts.",
    limits: [
      "Gearbox oil, coolant flushes and brake fluid changes are part of periodic service, not a standalone oil change — book periodic service if you want the full checklist.",
      "Cars with underbody damage or a stripped drain plug need a workshop visit — we tell you at inspection and arrange pickup if needed.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["How often should engine oil be changed?", "It depends on the oil type and how you drive — the intervals in your owner's manual are the guide. City driving with short trips usually calls for the earlier end of the interval."],
      ["Which oil grade will you use?", "The grade is matched to your car's make, model and engine. The mechanic confirms the specification from the model you share and shows you the sealed pack before pouring."],
      ["How much does a car oil change cost in Bangalore?", "It depends on the oil grade and quantity your engine takes and the filter type. Share the model and we confirm the exact price in writing before work starts."],
      ["Do you take away the old oil?", "Yes — used oil is drained into a sealed container and removed for disposal. Nothing is left in your parking area."],
      ["How long does it take?", "The mechanic confirms the arrival window at booking and finishes the job before handing over — we do not quote durations we cannot guarantee."],
      ["Can you change oil in basement parking?", "Yes, as long as there is space to work safely around the car and the engine is accessible. Mention basement parking when booking so the mechanic comes prepared."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-20",
    local: false,
    serviceType: "Car Oil Change",
    related: ["car-periodic-service", "car-inspection", "car-brake-service"],
  },
  {
    slug: "car-inspection",
    name: "Car Inspection",
    h1: "Pre-Purchase & Health Check Car Inspection at Home in Bangalore",
    subheading:
      "Buying a used car, or want to know your own car's real condition? A structured inspection at your doorstep, findings in writing.",
    title: "Pre-Purchase & Health Check Car Inspection at Home in Bangalore | Ride N Care",
    description:
      "Doorstep used-car inspection and health check in Bangalore — engine, brakes, electricals, tyres and underbody checked where the car is parked. Written findings. Call 080 6940 9289.",
    summary:
      "Ride N Care inspects used cars and your own car at your doorstep in Bangalore. The mechanic checks the engine bay, fluids, brakes, tyres, lights, electricals and visible underbody, then shares the findings in writing so you can decide before you buy or repair.",
    intro:
      "An inspection is diagnosis, not repair. You get a written condition report — what is healthy, what is wearing, and what needs attention first.",
    detail: [
      "A used car can look clean and still hide a tired battery, uneven brake wear or seeping seals. Our inspection is a fixed checklist the mechanic walks through with you: engine start and idle, fluid condition, battery voltage, brake response, tyre tread and pressures, lights and wipers, suspension bounce test and a look under the car where it is safely accessible.",
      "You get the findings in writing on WhatsApp. If repairs are needed, we quote them separately — an inspection never turns into a repair bill without your approval.",
    ],
    includes: [
      "Engine start, idle and bay inspection",
      "Fluid level and condition check",
      "Battery voltage and terminal check",
      "Brake response and handbrake check",
      "Tyre tread, pressure and age check",
      "Lights, indicators, horn and wipers check",
      "Visible underbody and leak check where safely accessible",
      "Written findings shared on WhatsApp",
    ],
    benefits: [
      ["Decide before you buy", "A written condition report on a used car before money changes hands."],
      ["Fixed checklist", "The same points are checked every time — nothing depends on the mechanic's mood."],
      ["Findings in writing", "You get the report on WhatsApp, useful for negotiation or your own records."],
      ["No pressure to repair", "Repairs are quoted separately and only done after you approve."],
    ],
    pricing:
      "Inspection is priced by vehicle type and location — share the car's model and your area and we confirm the exact amount in writing before the visit.",
    limits: [
      "This is a visual and functional inspection, not a diagnostic-scanner audit — fault codes can be read, but we do not certify accident-free history or ownership papers.",
      "It does not replace RTO document verification — always check papers, insurance and service records separately.",
      "If the seller's car cannot be started or safely lifted, some checks cannot be done — the mechanic records what could not be inspected.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["Can you inspect a used car before I buy it?", "Yes — the mechanic meets the car where it is parked (the seller's place, your place or a agreed meeting point), runs the checklist and shares written findings the same visit."],
      ["What is checked in a pre-purchase inspection?", "Engine start and idle, fluids, battery, brakes, tyres, lights and wipers, suspension response and the visible underbody — with anything abnormal photographed and noted in writing."],
      ["Will you tell me if the car is worth buying?", "We report condition, not value — the written findings tell you what is healthy and what needs work, and you use that to decide or negotiate."],
      ["How long does an inspection take?", "The arrival window is confirmed at booking and the checklist runs until complete — we do not quote durations we cannot guarantee."],
      ["Do you check accident history?", "No — we inspect the car's current condition. Accident history, ownership and service records need separate verification."],
      ["Can the same visit fix what you find?", "Only with your approval and a separate written quote — many customers book the repair for a later slot after reading the report."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-20",
    local: false,
    serviceType: "Car Inspection",
    related: ["car-periodic-service", "car-repair", "car-battery-service"],
  },
  {
    slug: "car-jump-start",
    name: "Car Jump Start",
    h1: "Car Jump Start Service at Your Location in Bangalore",
    subheading:
      "Car won't start? A mechanic comes to where it is parked, tests the battery and charging system, and gets you moving safely.",
    title: "Car Jump Start Service at Your Location in Bangalore | Ride N Care",
    description:
      "Doorstep car jump start in Bangalore — a background-verified mechanic tests the battery and alternator response and jump-starts your car safely. Call 080 6940 9289.",
    summary:
      "A Ride N Care mechanic comes to your car's location in Bangalore, jump-starts the engine safely with proper equipment, and tests whether the battery is holding charge and the alternator is charging — so you know whether it was a one-off drain or a battery that needs replacement.",
    intro:
      "A jump start gets you moving; the test after it tells you why it happened. We do both at your car's location.",
    detail: [
      "A flat battery is the most common no-start in Bangalore — headlights left on, a fortnight of the car standing during travel, or an ageing battery in the cold months. Jump-starting a modern car wrong (reversed clamps, surging revs) can damage electronics, so the job is done by a mechanic with the right leads and procedure, not a friendly push-start.",
      "After the start, the mechanic checks charging voltage and whether the battery is holding charge. If the battery is at the end of its life, replacement can be quoted on the spot — your approval first, always.",
    ],
    includes: [
      "Safe jump start with proper leads and procedure",
      "Battery voltage test before and after",
      "Charging (alternator) response check",
      "Battery health reading shared with you",
      "Replacement quote on the spot if the battery is due",
    ],
    benefits: [
      ["Safe for modern electronics", "Correct clamps, order and idle procedure — no reversed-polarity gambles."],
      ["The reason, not just the start", "You learn whether the battery is dying or it was a one-off drain."],
      ["No towing needed", "The help comes to wherever the car is parked in our service areas."],
    ],
    pricing:
      "Jump start is priced by location and time — share your car model and where it is parked and we confirm the amount in writing before dispatch.",
    limits: [
      "A jump start needs the car to be reachable on the ground — basement levels with height limits or locked complexes need access arranged first.",
      "If the starter motor, fuel system or an engine fault is the cause, a jump start will not fix it — the mechanic tells you what he found and what the car needs next.",
      "Batteries that are swollen or leaking are not jump-started — replacement is the safe path, quoted separately.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["My car is dead in the basement — can you help?", "Yes, if the parking level is reachable and there is clearance to work. Share the basement level and access details when you call or WhatsApp so the mechanic comes prepared."],
      ["Will jumping harm my car's electronics?", "Done correctly, no — the mechanic uses proper leads, the right connection order and a controlled idle, which is why we do not recommend flagging down random help for modern cars."],
      ["How do I know if my battery needs replacing after a jump start?", "The mechanic reads the voltage before and after and checks the charging response — if the battery is not holding charge, replacement is quoted on the spot with your approval."],
      ["Do you carry batteries?", "The visit is for jump start and testing. If the battery is due, replacement is quoted on the spot and, if you approve, arranged per the battery service process."],
      ["Is this available at night?", "Availability depends on the slot at the time you contact us — call or WhatsApp and we confirm what is possible. We do not promise round-the-clock availability we cannot guarantee."],
      ["What if the battery is fine but the car still won't start?", "Then the cause is elsewhere — starter, fuel or an engine fault. The mechanic shares what the checks showed and the car goes to a workshop if needed."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-20",
    local: false,
    serviceType: "Car Jump Start",
    related: ["car-battery-service", "car-breakdown-assistance", "car-inspection"],
  },
  {
    slug: "car-repair",
    name: "Car Repair at Home",
    h1: "Car Repair at Home in Bangalore — Diagnosis-Led Doorstep Repairs",
    subheading:
      "Noise, leak, warning light or a car that drives wrong — the mechanic diagnoses first, then repairs at your doorstep what can be done there honestly.",
    title: "Car Repair at Home in Bangalore | Ride N Care",
    description:
      "Doorstep car repair in Bangalore — diagnosis first, then repairs done at your home or office where they can be done honestly. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care does diagnosis-led car repairs at your home or office in Bangalore. The mechanic listens to the symptom, diagnoses the cause and tells you in writing what needs doing — then repairs at your doorstep what can honestly be done there, and tells you plainly when the car needs a workshop instead.",
    intro:
      "Repair without diagnosis is guessing with your money. Every repair visit starts with finding the cause, and ends with an honest verdict on where the work should happen.",
    detail: [
      "A rattle over bumps, a coolant smell, a warning light, a pull to one side — the mechanic starts with the symptom, checks the likely causes and shows you what he found before quoting. Repairs that fit doorstep work — brake pads, wipers, lights, sensors within reach, suspension top mounts, battery and charging faults — are done in your parking bay with OEM-grade parts.",
      "Jobs that need a pit, alignment rack or engine bench — overhauls, gearbox work, crash damage, wheel alignment — are named as workshop jobs. We would rather say so than make it fit.",
    ],
    includes: [
      "Symptom-based diagnosis before any repair",
      "Findings and repair scope shared in writing",
      "Doorstep repair with OEM-grade parts where suitable",
      "Old parts shown to you after removal",
      "Post-repair check with you at handover",
      "Workshop referral with findings if the job does not fit doorstep",
    ],
    benefits: [
      ["Diagnosis before spend", "You approve the cause and the fix, not a vague 'general service'."],
      ["Honest verdicts", "If the repair needs a workshop, the finding says so — no pretending it fits a driveway."],
      ["Watch the work", "The repair happens in front of you; old parts are shown after removal."],
      ["45-day service warranty", "If a repaired item plays up within 45 days, we inspect and correct it under the warranty."],
    ],
    pricing:
      "Repairs are priced by the diagnosed fault and the parts it needs — the diagnosis is shared first, then the repair is quoted in writing and starts only after your approval.",
    limits: [
      "Engine, gearbox and clutch overhauls, and crash or structural bodywork — workshop jobs; we arrange pickup and share the estimate first.",
      "Wheel alignment and balancing need a rack — done at our partner workshop with pickup arranged.",
      "Paint, denting and Teflon-type cosmetic work are not suitable for open-air doorstep repair.",
      "Intermittent faults that will not reproduce during the visit are documented with findings and a next-step plan rather than guessed repairs.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["What car repairs can be done at home?", "Repairs whose parts are reachable without a pit or hoist — brake pads, lights, wipers, batteries, sensors within reach, suspension top mounts and similar — after diagnosis confirms the cause."],
      ["How does doorstep car repair start?", "With diagnosis: the mechanic checks the symptom, shares the cause and the repair scope in writing, and starts only after you approve the written quote."],
      ["What if my car needs a workshop?", "You get the finding in writing with the reason. We arrange pickup to our partner workshop and the estimate is shared before any work happens."],
      ["Can you repair on the roadside?", "Safety comes first — busy roads and highways are not work sites. If the car is safe to move, we repair where it is parked; if not, we advise recovery to a safer location first."],
      ["Do you give a warranty on repairs?", "Every job carries the 45-day service warranty that applies to all Ride N Care work — if something related to the work done goes wrong within 45 days, we come back and set it right."],
      ["How much will my repair cost?", "It depends entirely on the diagnosed fault and parts. The written quote after diagnosis is the number — we do not publish price ranges we cannot source."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-20",
    local: false,
    serviceType: "Car Repair at Home",
    related: ["car-inspection", "car-brake-service", "car-electrical-repair"],
  },
  {
    slug: "car-electrical-repair",
    name: "Car Electrical & Lights Repair",
    h1: "Car Electrical & Lights Repair at Home in Bangalore",
    subheading:
      "Dead battery draw, flickering lights, a window that won't move or a stubborn warning — electrical faults traced and fixed at your doorstep.",
    title: "Car Electrical & Lights Repair at Home in Bangalore | Ride N Care",
    description:
      "Doorstep car electrical and lights repair in Bangalore — battery drains, lighting faults, switches and wiring traced and fixed at your home. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care traces and repairs car electrical faults at your home or office in Bangalore — battery drains, lighting and indicator faults, switches, fuses and visible wiring issues. The mechanic tests before replacing, and you approve a written quote before any part is fitted.",
    intro:
      "Electrical problems punish guesswork — a wrong part swapped in still leaves the fault. We test first, then replace only what the tests condemn.",
    detail: [
      "Bangalore's monsoon is hard on car electrics — damp connectors cause flickering headlights, a slow indicator, a parasitic drain that kills the battery overnight. The visit starts with measurement: battery voltage and charge, alternator output, fuse checks and the specific circuit at fault. Only then is a part replaced.",
      "Lighting repairs — headlamps, brake lights, indicators, cabin lights — are done on the spot. Complex module or ECU-level faults are diagnosed, documented and, if they need specialist equipment, referred to a workshop with the findings written down.",
    ],
    includes: [
      "Battery voltage and drain test",
      "Alternator charging output check",
      "Fuse and relay check for the affected circuit",
      "Lighting repairs — headlamps, brake lights, indicators, cabin lights",
      "Switch, socket and visible wiring repair",
      "Replacement parts shown before fitting",
      "Post-repair function test with you",
    ],
    benefits: [
      ["Tested, not guessed", "The circuit is measured before any part is condemned — no trial-and-error billing."],
      ["Monsoon-ready checks", "Damp-connector and drain faults are common here and are looked for first."],
      ["Written findings", "What was faulty, what was replaced and what was tested — all on your digital invoice."],
    ],
    pricing:
      "Electrical repair is priced by the diagnosed fault and the parts it needs — testing findings are shared first, then the repair is quoted in writing before work starts.",
    limits: [
      "ECU, airbag-module and immobiliser-level faults need specialist diagnostic equipment — we diagnose and document, then refer to a partner workshop where required.",
      "Wiring loom replacements and dash-out jobs are workshop work.",
      "Cars that have been in water or have burning-smell electrical faults should go to a workshop immediately — we will say so rather than treat them at the doorstep.",
    ],
    steps: CAR_BOOK_STEPS,
    faqs: [
      ["My battery keeps draining overnight — can you find the cause?", "Yes — the mechanic tests the battery and charging system first, then checks for parasitic drain on the affected circuits, and shares the finding in writing before any repair."],
      ["Can you replace headlamps and brake lights at home?", "Yes — most bulb and lighting repairs are straightforward doorstep jobs, and the replacement bulbs or assemblies are shown before fitting."],
      ["Do you repair power windows and central locking?", "Where the cause is a switch, fuse, relay or motor reachable without removing the dashboard — yes. Deeper loom or module-level faults are diagnosed and referred with written findings."],
      ["Will you fit parts I bought myself?", "We fit OEM-grade parts we supply, shown sealed before fitting. Self-supplied parts remove our ability to guarantee the outcome, so we generally advise against it."],
      ["What electrical jobs need a workshop?", "ECU and airbag-module work, wiring loom replacement and dash-out jobs. We diagnose what we can, write down the findings and arrange the referral."],
      ["How much does car electrical repair cost?", "It depends on the diagnosed fault and the part. Testing findings come first, then a written quote — the price is confirmed before work starts."],
    ],
    relatedGuides: [],
    reviewed: "2026-09-20",
    local: false,
    serviceType: "Car Electrical Repair",
    related: ["car-battery-service", "car-repair", "car-jump-start"],
  },
];

export const getCarService = (slug: string) => CAR_SERVICES.find((s) => s.slug === slug);
export const CAR_SERVICE_SLUGS = CAR_SERVICES.map((s) => s.slug);

/** Everything the /cars hub needs, in one place. */
// CAR_HUB lives in its own module (route heads import it directly — see
// src/lib/car-hub.ts); re-exported here for existing consumers.
export { CAR_HUB } from "@/lib/car-hub";

/** Homepage icon map for the car services. */
export const CAR_SERVICE_ICONS: Record<string, string> = {
  "car-periodic-service": "🚗",
  "car-ac-service": "❄️",
  "car-battery-service": "🔋",
  "car-brake-service": "🛑",
  "car-oil-change": "🛢️",
  "car-inspection": "🔍",
  "car-jump-start": "⚡",
  "car-repair": "🔧",
  "car-electrical-repair": "💡",
};
