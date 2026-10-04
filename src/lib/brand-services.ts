/**
 * Bike brand service pages (Batch 3, Part 4).
 *
 * Drives /royal-enfield-service, /ktm-service, /honda-two-wheeler-service and
 * /tvs-two-wheeler-service — the four priority brands named in the 90-day plan
 * (Week 10, docs/seo/03-content-calendar.md) and the keyword map
 * (docs/seo/03-keyword-map.csv targets /royal-enfield-service, /ktm-service).
 *
 * Content rules:
 * - Ride N Care is an INDEPENDENT doorstep service company. Never claims
 *   "authorised", "official", "OEM service centre", or affiliation with any
 *   manufacturer. Every page states the independence plainly in an FAQ.
 * - Model lists come from src/lib/vehicle-catalog.ts (verified displacements);
 *   price points come from src/lib/pricing.ts PRICE_MATRIX only.
 * - Maintenance guidance is conservative general knowledge and defers to the
 *   owner's manual; no model-specific specs we cannot source.
 * - FAQs are brand-specific — no brand-name swap templating.
 */

export interface BrandService {
  slug: string;
  brand: string;
  /** Short label for cards/nav. */
  name: string;
  h1: string;
  subheading: string;
  title: string;
  description: string;
  /** Answer-first summary (40–60 words). */
  summary: string;
  intro: string;
  detail: string[];
  /** Maintenance needs brand owners actually watch (title, detail). */
  needs: [string, string][];
  /** What owners can check themselves between visits. */
  checks: string[];
  /** When to book rather than wait. */
  whenToService: string[];
  /** Brands the page links to (bike service types, src/lib/services.ts slugs). */
  services: string[];
  /** Models from the verified catalog (name + cc class). */
  models: [string, string][];
  /** Confirmed price context for this brand's engine classes. */
  pricing: string;
  limits: string[];
  faqs: [string, string][];
  /** Other brand pages to cross-link. */
  relatedBrands: string[];
  /** Answer pages directly useful to this brand's owners (answer-pages slugs). */
  relatedAnswers: string[];
  reviewed: string;
}

export const BRAND_SERVICES: BrandService[] = [
  {
    slug: "royal-enfield-service",
    brand: "Royal Enfield",
    name: "Royal Enfield Service",
    h1: "Royal Enfield Service at Home in Bangalore",
    subheading: "Doorstep periodic service, repairs and battery/brake work for the 350 singles and 650 twins — measured, quoted in writing, done in your parking bay.",
    title: "Royal Enfield Service at Home in Bangalore | Ride N Care",
    description:
      "Doorstep Royal Enfield service in Bangalore — Classic, Hunter, Bullet, Himalayan and 650 twins. Oil, brakes, chain, electricals by background-verified mechanics. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care provides doorstep service for Royal Enfield motorcycles across Bangalore — periodic service, repairs, battery and brake work on Classic, Bullet, Hunter, Meteor, Himalayan and the 650 twins. A background-verified mechanic works in your parking bay, and every job starts with a written quote.",
    intro:
      "Ride N Care provides doorstep service for Royal Enfield motorcycles across Bangalore — the 350 singles, the 450 Himalayan and the 650 twins — with the same written-quote-first process as every job we do.",
    detail: [
      "RE ownership in Bangalore leans heavily on the 349cc singles (Classic, Hunter, Bullet, Meteor) and the 648cc twins (Interceptor, Continental GT, Super Meteor). Both engine classes sit in our published price tiers — General Service for the 350s falls in the 250–400cc tier at ₹1,199, and the 650 twins in the 501–800cc tier at ₹1,799 — with the oil-package option priced in the booking flow and confirmed in writing before work starts.",
      "These are heavy, air/oil-cooled machines that do real commuting duty in Bangalore traffic: chains stretch, spokes and spokes-nipples loosen on broken stretches, and older UCE-era engines (Classic 500, Thunderbird, Electra) need a mechanic who checks rather than assumes. Our mechanics carry manufacturer torque practice, measure chain slack and pad wear, and show you every part that comes out.",
      "Being independent means an honest word at booking: if your RE is inside its free-service period, the authorised centre is the right place for those visits — we will say so and take nothing for the advice.",
    ],
    needs: [
      ["Chain and sprocket wear", "Bangalore's stop-start plus dust stretches chain life fast; slack and sprocket-hook wear are checked on every service visit."],
      ["Engine oil in traffic heat", "Air/oil-cooled 350s and 650s work hard in jams — oil condition is inspected every visit and the grade follows the manual."],
      ["Brakes measured, not guessed", "Pad thickness is measured on both wheels; the numbers are shown to you before any replacement is quoted at MRP."],
      ["Electrical basics", "Battery, charging and lighting faults are diagnosed with a multimeter — no parts swapped on hope."],
    ],
    checks: [
      "Chain slack and lubrication — especially after rain or dusty runs",
      "Tyre pressures and tread (heavy bikes are sensitive to pressure)",
      "Brake lever and pedal free play",
      "Battery terminals for corrosion",
    ],
    whenToService: [
      "Clunking or clattering from the top end that changes character",
      "Chain slapping over bumps or visible rust on the links",
      "Cranks that have grown slow or dim lights at idle",
      "Any squeal, grinding or pull while braking",
    ],
    services: ["bike-service", "motorcycle-service", "bike-repair", "battery-service", "brake-service"],
    models: [
      ["Classic 350", "349cc"], ["Hunter 350", "349cc"], ["Bullet 350", "349cc"], ["Meteor 350", "349cc"],
      ["Himalayan 450", "452cc"], ["Interceptor 650", "648cc"], ["Continental GT 650", "648cc"],
      ["Super Meteor 650", "648cc"], ["Classic 500 (UCE)", "499cc"], ["Thunderbird 350 (UCE)", "346cc"],
    ],
    pricing:
      "General Service for the 350 singles is the 250–400cc tier at ₹1,199; 650 twins are the 501–800cc tier at ₹1,799; older 500s sit in the 401–500cc tier at ₹1,399. With engine oil replacement the tiers price higher — the exact package for your model is confirmed in writing before work starts.",
    limits: [
      "Top-end overhauls and crank work — workshop bench jobs with transport arranged.",
      "Paint and chrome work — not suitable for open-air doorstep work.",
      "Warranty-period free services — use the authorised service centre for those visits.",
    ],
    faqs: [
      ["Is Ride N Care an authorised Royal Enfield service centre?", "No. Ride N Care is an independent doorstep service company — we are not affiliated with, or authorised by, Royal Enfield. We use OEM-grade parts, work to the torque and oil practices your manual specifies, and show you every part we fit."],
      ["Which Royal Enfield models do you service at home?", "All the models in our catalog: Classic 350, Hunter 350, Bullet 350, Meteor 350, Himalayan 411/450, Guerrilla 450, Interceptor 650, Continental GT 650, Super Meteor 650, Shotgun 650 — plus UCE-era Classic 500, Thunderbird and Electra."],
      ["How much does Royal Enfield service cost in Bangalore?", "General Service is ₹1,199 for the 350 singles (250–400cc tier), ₹1,399 for 500s and ₹1,799 for the 650 twins; with engine oil replacement the tiers price higher. The exact amount is confirmed in writing before work starts."],
      ["Can you service my RE in my apartment's basement?", "Yes — one parking bay and a plug point is all the job needs. Share your cross street and gate when booking; the mechanic shows an ID you can verify at security."],
      ["Do you handle the 650 twins at home?", "Yes — periodic service, chain-sprocket, brakes and electricals are doorstep work for the twins. Valve-clearance and suspension rebuilds are workshop jobs; we arrange transport and share the estimate first."],
    ],
    relatedBrands: ["ktm-service", "honda-two-wheeler-service", "tvs-two-wheeler-service"],
    relatedAnswers: ["bike-service-cost-bangalore", "brake-warning-signs-bike", "which-oil", "monsoon-bike-care"],
    reviewed: "2026-09-27",
  },
  {
    slug: "ktm-service",
    brand: "KTM",
    name: "KTM Service",
    h1: "KTM Service at Home in Bangalore",
    subheading: "Duke, RC and Adventure models — liquid-cooled singles get coolant and FI-diagnostics attention, chain and brakes get measured, and the quote comes in writing.",
    title: "KTM Service at Home in Bangalore | Ride N Care",
    description:
      "Doorstep KTM service in Bangalore — Duke 125–390, RC and Adventure. FI diagnostics, coolant, chain and brakes by background-verified mechanics. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care provides doorstep service for KTM motorcycles in Bangalore — the Duke and RC range from 125 to 390 and the Adventure twins-of-250/390 class. Liquid-cooled engines get coolant and FI-diagnostics attention on every visit, and every job starts with a written quote you approve.",
    intro:
      "Ride N Care provides doorstep service for KTM motorcycles across Bangalore — Duke 125–390, RC 125–390 and the Adventure models — with mechanics assigned by engine class.",
    detail: [
      "Every current KTM sold in India is a fuel-injected, liquid-cooled single: the 125/200/250/390 Dukes, the RC pair and the Adventure 250/390. That changes the checklist compared with a commuter — coolant condition and radiator inspection are on every visit, and an FI diagnostics scan checks for stored fault codes before any part is condemned.",
      "KTMs are performance bikes that get ridden hard, which shows first in the chain and brakes: slack, sprocket-hook wear and pad thickness are measured against limits rather than guessed. General Service sits in our published tiers — ₹799 up to 199cc, ₹999 for the 200–249 and ₹1,199 for the 250–390s — confirmed in writing before work starts.",
      "As an independent company we are upfront about the boundary: warranty-period free services belong at the authorised centre, and we will tell you so rather than book a job your manufacturer covers free.",
    ],
    needs: [
      ["Coolant condition", "Liquid-cooled singles need coolant level and condition checked — a ritual on every Ride N Care visit, not an afterthought."],
      ["FI diagnostics", "An OBD/FI scan is part of the visit on fuel-injected models — stored faults get read before parts are replaced."],
      ["Chain discipline", "Performance bikes punish a dry, loose chain; slack and wear are measured and lubrication is part of the service."],
      ["Brake pads and fluid", "Hard riding heats brakes — pad thickness is measured and fluid condition checked on every visit."],
    ],
    checks: [
      "Coolant level between rides (never open a hot radiator)",
      "Chain slack after washes and rain",
      "Tyre pressures — sporty rubber is pressure-sensitive",
      "Brake pad wear indicator sounds",
    ],
    whenToService: [
      "Temp gauge or fan behaviour changes in traffic",
      "FI warning light or rough idle after a wash",
      "Chain clunk or visible sprocket hooking",
      "Any change in brake bite or pedal/lever feel",
    ],
    services: ["bike-service", "motorcycle-service", "bike-repair", "brake-service", "electrical-repair"],
    models: [
      ["Duke 125", "125cc"], ["Duke 200", "199cc"], ["Duke 250", "249cc"], ["Duke 390", "399cc"],
      ["RC 125", "125cc"], ["RC 200", "199cc"], ["RC 390", "373cc"],
      ["Adventure 250", "249cc"], ["Adventure 390", "399cc"],
    ],
    pricing:
      "General Service is ₹799 for the 125, ₹999 for Duke/RC/Adventure 200–250 and ₹1,199 for the 390s (250–400cc tier); with engine oil replacement the tiers price higher. The exact package for your model is confirmed in writing before work starts.",
    limits: [
      "Suspension rebuilds and engine internals — workshop bench jobs with transport arranged.",
      "Crash damage assessment — on site, repair at the workshop.",
      "Warranty-period free services — use the authorised service centre for those visits.",
    ],
    faqs: [
      ["Is Ride N Care an authorised KTM service centre?", "No. Ride N Care is an independent doorstep service company — we are not affiliated with, or authorised by, KTM. We use OEM-grade parts, follow the practices your manual specifies, and show you every part we fit."],
      ["Which KTM models do you service at home?", "Duke 125, 200, 250 and 390 (including Gen 3), RC 125/200/390 and the Adventure 250/390 — all listed in our service catalog with verified displacements."],
      ["How much does KTM Duke service cost in Bangalore?", "General Service is ₹799 up to 199cc, ₹999 for the 200–249 class and ₹1,199 for the 250–390s; with engine oil replacement the tiers price higher. The exact amount is confirmed in writing before work starts."],
      ["Do you scan for FI fault codes?", "Yes — an FI/OBD diagnostics scan is part of the visit on fuel-injected models, so stored faults are read before any part is replaced on a guess."],
      ["Can you service my Duke in a basement parking?", "Yes — one bay and a plug point is all it needs. The engine runs briefly for coolant and FI checks; share your access details when booking."],
    ],
    relatedBrands: ["royal-enfield-service", "honda-two-wheeler-service", "tvs-two-wheeler-service"],
    relatedAnswers: ["ktm-duke-200-service-cost", "brake-warning-signs-bike", "how-long-bike-service", "bike-wont-start"],
    reviewed: "2026-09-27",
  },
  {
    slug: "honda-two-wheeler-service",
    brand: "Honda",
    name: "Honda Two-Wheeler Service",
    h1: "Honda Two-Wheeler Service at Home in Bangalore",
    subheading: "Activa and Dio scooters, Shine and Unicorn commuters, CB350s — CVT care, brakes, chain and battery, done at your parking spot with a written quote.",
    title: "Honda Two-Wheeler Service at Home in Bangalore | Ride N Care",
    description:
      "Doorstep Honda two-wheeler service in Bangalore — Activa, Dio, Shine, SP 125, Unicorn and CB350. CVT care, brakes, battery, chain. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care provides doorstep service for Honda two-wheelers across Bangalore — Activa and Dio scooters, Shine, SP 125, Livo, Unicorn and the CB350 line. Scooters get the CVT care most quick garages skip, and every job starts with a written quote on WhatsApp.",
    intro:
      "Ride N Care provides doorstep service for Honda two-wheelers across Bangalore — the Activa and Dio scooter range, Shine and SP 125 commuters, Unicorn and the CB350 line — all routine work for us.",
    detail: [
      "Honda is both a scooter and motorcycle story in Bangalore. The Activa range (6G, 125, and the older 4G/5G still on the road) needs what a motorcycle does not: CVT belt and roller wear checks, gear oil in the final drive and a variator cleaned of dust from unpaved shortcuts. The Shine, SP 125, Livo and Unicorn are chain-and-oil commuters; the CB350 line sits in the 250–400cc tier.",
      "Price context is published, not guessed: scooters and commuters up to 199cc are ₹799 General Service (₹1,249 with engine oil replacement), while the CB350 falls in the 250–400cc tier at ₹1,199. The exact package for your model is confirmed in writing before work starts.",
      "As with every brand we service, the independence disclaimer applies: we are not Honda's authorised network — warranty-period free services belong at the company workshop, and we will honestly say so at booking.",
    ],
    needs: [
      ["CVT belt and rollers (scooters)", "Activa/Dio CVTs wear silently — belt and roller wear is checked, not skipped, on every scooter service."],
      ["Gear oil in the final drive", "Automatic scooters need the rear-drive gear oil changed on schedule — a step most quick services miss."],
      ["Chain and sprockets (motorcycles)", "Shine/Unicorn chains stretch in city use; slack and wear are measured and lubricated every visit."],
      ["Battery for the self-start", "Short trips drain scooter batteries; voltage and charging are tested before replacement is suggested."],
    ],
    checks: [
      "Scooter: brake lever bite and rear drum adjustment",
      "Motorcycle: chain slack and lubrication",
      "Tyre pressure and tread (scooter tyres age with time, not just distance)",
      "Self-start response — sluggish cranks deserve a test",
    ],
    whenToService: [
      "Scooter: rpm flare or jerky take-off (belt/roller wear signs)",
      "Motorcycle: chain clunk over bumps",
      "Self-start clicking instead of turning",
      "Any brake squeal or soft-lever feel",
    ],
    services: ["scooter-service", "bike-service", "bike-repair", "battery-service", "brake-service"],
    models: [
      ["Activa 6G", "110cc"], ["Activa 125", "124cc"], ["Dio", "110cc"], ["Dio 125", "124cc"],
      ["Shine", "124cc"], ["SP 125", "124cc"], ["Livo 110", "109cc"], ["Unicorn", "162cc"],
      ["Hornet 2.0", "184cc"], ["CB350 / H'ness", "348cc"],
    ],
    pricing:
      "Scooters and commuters up to 199cc: General Service ₹799, ₹1,249 with engine oil replacement. CB350-class bikes: ₹1,199 in the 250–400cc tier. Jump Start ₹399 and Running Repair ₹450 apply across the range; parts bill at MRP only after your approval.",
    limits: [
      "Engine overhauls and crank work — workshop bench jobs with transport arranged.",
      "Crash bodywork and paint — assessed on site, repaired at the workshop.",
      "Warranty-period free services — use the authorised service centre for those visits.",
    ],
    faqs: [
      ["Is Ride N Care an authorised Honda service centre?", "No. Ride N Care is an independent doorstep service company — we are not affiliated with, or authorised by, Honda. We use OEM-grade parts, show you each one before fitting, and invoice everything digitally."],
      ["Do you service the Activa at home?", "Yes — Activa (6G, 125 and older 4G/5G), Dio and the rest of the scooter range are routine work, including the CVT belt/roller check and final-drive gear oil most quick services skip."],
      ["How much does Activa service at home cost?", "General Service for scooters up to 199cc is ₹799, or ₹1,249 with engine oil replacement; Jump Start is ₹399 and Running Repair ₹450. The exact amount is confirmed in writing before work starts."],
      ["Which Honda motorcycles do you service?", "Shine, Shine 100, SP 125, CB125 Hornet, Livo, CD 110, Unicorn, SP 160, Hornet 2.0, NX200, CB300F/R and the CB350 line — the full catalog list, plus discontinued Hero Honda-era models."],
      ["Do you service electric Honda two-wheelers?", "Honda's EV range is handled like other electric scooters: brakes, tyres and running gear at the doorstep; battery and motor faults stay with the manufacturer's service network."],
    ],
    relatedBrands: ["royal-enfield-service", "ktm-service", "tvs-two-wheeler-service"],
    relatedAnswers: ["bike-service-cost-bangalore", "service-interval", "brake-warning-signs-bike", "which-oil"],
    reviewed: "2026-09-27",
  },
  {
    slug: "tvs-two-wheeler-service",
    brand: "TVS",
    name: "TVS Two-Wheeler Service",
    h1: "TVS Two-Wheeler Service at Home in Bangalore",
    subheading: "Jupiter and Ntorq scooters, Apache and Raider motorcycles — CVT care, FI checks, chain and brakes at your parking spot, quoted in writing first.",
    title: "TVS Two-Wheeler Service at Home in Bangalore | Ride N Care",
    description:
      "Doorstep TVS two-wheeler service in Bangalore — Jupiter, Ntorq, Raider, Apache and iQube running gear. CVT care, FI scan, brakes, battery. Written quote first. Call 080 6940 9289.",
    summary:
      "Ride N Care provides doorstep service for TVS two-wheelers across Bangalore — Jupiter and Ntorq scooters, Raider, Sport, the Apache RTR line and Ronin. Scooters get proper CVT care, fuel-injected models get an FI scan, and every job starts with a written quote on WhatsApp.",
    intro:
      "Ride N Care provides doorstep service for TVS two-wheelers across Bangalore — Jupiter and Ntorq scooters, Sport, Raider, the Apache RTR range and Ronin — all routine work for us.",
    detail: [
      "TVS ownership in Bangalore is mostly two very different machines: the automatic scooters (Jupiter, Ntorq, Scooty Pep+, Zest) and the performance motorcycles (Apache RTR 160–310, Raider, Ronin). The scooters need CVT belt and roller checks and final-drive gear oil; the Apaches need measured chain wear, brake attention and — on the FI models like Ntorq — a diagnostics scan.",
      "Price context is published: scooters and bikes up to 199cc are ₹799 General Service (₹1,249 with engine oil replacement), the RTR 200 sits at ₹999 in the 200–249 tier, and the RR 310 is the 250–400cc tier at ₹1,199. The exact package for your model is confirmed in writing before work starts.",
      "For the TVS iQube, the boundary is stated plainly: brakes, tyres and running gear are doorstep work; battery, BMS and motor faults stay with the manufacturer's service network. And as always — we are an independent company, not TVS's authorised network; free-service-period visits belong at the company workshop.",
    ],
    needs: [
      ["CVT belt and rollers (scooters)", "Jupiter/Ntorq CVTs wear quietly — belt, roller and variator dust are checked on every scooter service."],
      ["Gear oil in the final drive", "The automatic's rear-drive needs its own gear oil on schedule — a step most quick garages skip."],
      ["Chain and sprockets (motorcycles)", "Apache/Raider chains stretch under hard city use; slack and hooking are measured every visit."],
      ["FI scan on Ntorq and FI models", "Fuel-injected models get an OBD/FI scan so stored faults are read before parts are swapped."],
    ],
    checks: [
      "Scooter: tyre age as much as tread — sidewalls crack with time",
      "Motorcycle: chain slack after rain and washes",
      "Brake lever/pedal free play",
      "Battery terminals and self-start response",
    ],
    whenToService: [
      "Scooter: jerky take-off or rpm flare (CVT wear signs)",
      "Ntorq/FI: warning light or rough running after rain",
      "Chain slap or visible sprocket hooking",
      "Any change in brake feel or grinding sounds",
    ],
    services: ["scooter-service", "bike-service", "bike-repair", "brake-service", "battery-service"],
    models: [
      ["Jupiter 110 / 125", "110–124cc"], ["Ntorq 125", "124cc"], ["Scooty Pep+", "87cc"], ["Zest 110", "110cc"],
      ["Sport 110", "109cc"], ["Raider 125", "124cc"], ["Apache RTR 160 4V", "159cc"],
      ["Apache RTR 200 4V", "198cc"], ["Apache RR 310", "312cc"], ["Ronin 225", "225cc"],
    ],
    pricing:
      "Scooters and bikes up to 199cc: General Service ₹799, ₹1,249 with engine oil replacement. The RTR 200 is ₹999 (200–249 tier) and the RR 310 is ₹1,199 (250–400 tier). Jump Start ₹399, Running Repair ₹450; parts bill at MRP only after approval.",
    limits: [
      "Engine overhauls and crank work — workshop bench jobs with transport arranged.",
      "Crash bodywork and paint — assessed on site, repaired at the workshop.",
      "Warranty-period free services — use the authorised service centre for those visits.",
      "iQube battery, BMS and motor faults — these stay with the manufacturer's service network.",
    ],
    faqs: [
      ["Is Ride N Care an authorised TVS service centre?", "No. Ride N Care is an independent doorstep service company — we are not affiliated with, or authorised by, TVS. We use OEM-grade parts, show you each one before fitting, and invoice everything digitally."],
      ["Do you service the Jupiter and Ntorq at home?", "Yes — Jupiter 110/125, Ntorq (including Race XP), Scooty Pep+, Zest and the rest are routine work, including the CVT belt/roller and final-drive care most quick services skip."],
      ["How much does TVS Jupiter service at home cost?", "General Service for scooters up to 199cc is ₹799, or ₹1,249 with engine oil replacement; Jump Start ₹399, Running Repair ₹450. The exact amount is confirmed in writing before work starts."],
      ["Which TVS motorcycles do you service?", "Sport, Victor, Star City, Raider, Phoenix, the full Apache RTR line (160/180/200/RR 310), Ronin and Cruze — the catalog list, plus older models like the Victor GLX and Wego."],
      ["Do you work on the TVS iQube?", "Yes, within honest limits: brakes, tyres, suspension and general running gear at your doorstep. Battery, BMS and motor faults stay with the manufacturer's service network — we will say so rather than pretend."],
    ],
    relatedBrands: ["royal-enfield-service", "ktm-service", "honda-two-wheeler-service"],
    relatedAnswers: ["bike-service-cost-bangalore", "service-interval", "brake-warning-signs-bike", "monsoon-bike-care"],
    reviewed: "2026-09-27",
  },
];

export const getBrandService = (slug: string) => BRAND_SERVICES.find((b) => b.slug === slug);
export const BRAND_SERVICE_SLUGS = BRAND_SERVICES.map((b) => b.slug);
