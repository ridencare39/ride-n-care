/**
 * Ride N Care bike-service catalogue.
 * Drives /bike-service, /doorstep-bike-service, /bike-repair, ... landing pages,
 * their local area pages, sitemap entries and internal linking.
 */

export interface ServiceDef {
  slug: string;
  /** Nav / card label */
  name: string;
  h1: string;
  title: string;
  description: string;
  /** Short intro paragraph shown under the H1 */
  intro: string;
  /** Longer explanation of the service */
  detail: string[];
  includes: string[];
  benefits: [string, string][];
  steps: [string, string][];
  faqs: [string, string][];
  /** Whether we generate /<slug>/<area> local landing pages */
  local: boolean;
  priceFrom?: number;
  serviceType: string;
  related: string[];
}

const BOOK_STEPS: [string, string][] = [
  ["1. Tell us your bike", "Share the make, model and what feels wrong on WhatsApp or the booking form. Takes under a minute."],
  ["2. Get a written quote", "We confirm parts, labour and the slot in writing before any spanner is touched."],
  ["3. Mechanic reaches you", "A uniformed Ride N Care mechanic arrives at your gate with tools, consumables and OEM spares."],
  ["4. Pay after the test ride", "Inspect the work, take a short test ride, then pay by UPI, card or cash. Invoice on WhatsApp."],
];

export const SERVICES: ServiceDef[] = [
  {
    slug: "bike-service",
    name: "Bike Service",
    h1: "Bike Service in Bangalore — At Your Doorstep",
    title: "Bike Service Near Me in Bangalore | Ride N Care",
    description:
      "Book bike service in Bangalore at your doorstep. Certified mechanics, OEM-grade parts, upfront pricing and a 7-day workmanship guarantee. Call 08296950339.",
    intro:
      "Ride N Care services two-wheelers at your home or office anywhere in Bangalore. You pick the slot, we bring the workshop — engine oil, filters, brakes, chain and a full inspection, finished while you get on with your day.",
    detail: [
      "A bike service is not only an oil change. Bangalore riding is stop-start, dusty and monsoon-heavy, which wears down the air filter, chain and brake pads far faster than the manual assumes. Our periodic bike service works through a 25-point checklist so small problems are caught while they are still cheap to fix.",
      "Every job starts with a written quote. If we find something beyond the package — a worn sprocket, a leaking fork seal, a battery that will not hold charge — we photograph it, explain it and only proceed once you approve.",
    ],
    includes: [
      "Engine oil replacement with OEM-grade oil",
      "Oil filter and air filter clean or replacement",
      "Spark plug clean and gap check",
      "Front and rear brake inspection and adjustment",
      "Chain cleaning, lubrication and slack setting",
      "Clutch and throttle play adjustment",
      "Battery terminal and charging-system check",
      "Tyre pressure, tread and wheel-alignment check",
      "Headlight, indicator and horn check",
      "Exterior wash and dry finish",
    ],
    benefits: [
      ["No garage queue", "No riding to a service centre and waiting half a day. The mechanic comes to your parking spot."],
      ["Watch the work", "You can see every part that goes in and every part that comes out. Nothing is swapped out of sight."],
      ["Transparent pricing", "Package rates published on the site, parts billed at MRP, no surprise labour charge at the end."],
      ["7-day guarantee", "If a serviced item plays up within a week, we come back and fix it free."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How often should I get my bike serviced in Bangalore?", "Every 2,500–3,500 km or roughly every three months for a commuter bike. Bangalore traffic means more idling and clutch use than highway riding, so err on the shorter interval."],
      ["How long does a doorstep bike service take?", "Most periodic services finish in 45–90 minutes depending on engine size and how much cleaning the chain and filters need."],
      ["What does bike service cost?", "Packages start at ₹499 for bikes under 125 CC and go up by engine capacity. Consumables and any extra parts are billed separately at MRP after your approval."],
      ["Do you use genuine spare parts?", "Yes — OEM or OEM-grade parts only, listed on the invoice so you can check part numbers."],
      ["Can you service my bike at an apartment basement?", "Yes. We work in apartment parking bays across Bangalore and carry a drip tray so nothing stains the floor."],
    ],
    local: true,
    priceFrom: 499,
    serviceType: "Bike Service",
    related: ["doorstep-bike-service", "periodic-bike-service", "bike-repair", "scooter-service"],
  },
  {
    slug: "doorstep-bike-service",
    name: "Doorstep Bike Service",
    h1: "Doorstep Bike Service in Bangalore",
    title: "Doorstep Bike Service Near Me, Bangalore | Ride N Care",
    description:
      "Doorstep bike service in Bangalore — mechanic at your home or office, OEM parts, live updates and cashless payment. Same-day slots. Call 08296950339.",
    intro:
      "Doorstep bike service means the entire service happens where your bike is parked. No drop-off, no pickup charge, no losing a Saturday. Book a slot and a Ride N Care mechanic reaches you with everything needed.",
    detail: [
      "Our doorstep vans carry engine oil for every popular Indian and imported model, filters, brake pads, chain lube, a portable compressor and a diagnostic kit for fuel-injected bikes. That covers the vast majority of periodic services and light repairs on the spot.",
      "If a job genuinely needs a workshop lift — a full engine rebuild, accident damage, frame work — we tell you upfront, arrange free pickup and share the workshop estimate before starting.",
    ],
    includes: [
      "Mechanic, tools and consumables brought to your address",
      "Full periodic service performed on site",
      "Photo updates before and after the job",
      "Free pickup and drop when a workshop visit is unavoidable",
      "Written quote before work starts",
      "UPI, card or cash payment after a test ride",
    ],
    benefits: [
      ["Zero travel time", "Book between meetings; you never leave your building."],
      ["Same-day slots", "Slots confirmed before 4 PM are usually completed the same day."],
      ["Complete visibility", "The work happens in front of you instead of behind a workshop shutter."],
      ["City-wide coverage", "From HSR Layout and Koramangala to Whitefield and Electronic City."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Is doorstep bike service more expensive than a garage?", "No. Package prices are the same as our workshop rates and there is no pickup-and-drop fee, so most riders pay less overall."],
      ["What space do you need?", "About two parking bays' worth of room and, ideally, a plug point. Apartment basements, gated-community parking and roadside kerbs all work."],
      ["Do you work on weekends?", "Yes, seven days a week between 8 AM and 9 PM."],
      ["Which areas of Bangalore do you cover for doorstep service?", "All major localities across South and East Bangalore plus central, north and west neighbourhoods — see the area list on this page."],
    ],
    local: true,
    priceFrom: 499,
    serviceType: "Doorstep Bike Service",
    related: ["bike-service", "doorstep-bike-repair", "emergency-bike-repair", "periodic-bike-service"],
  },
  {
    slug: "bike-repair",
    name: "Bike Repair",
    h1: "Bike Repair in Bangalore — Diagnose, Quote, Fix",
    title: "Bike Repair Near Me in Bangalore | Ride N Care",
    description:
      "Bike repair in Bangalore for engine, brake, clutch, electrical and starting problems. Free diagnosis, written quote, OEM parts. Call 08296950339.",
    intro:
      "Something specific gone wrong? Ride N Care mechanics diagnose the fault first, quote the repair in writing, and fix it at your doorstep wherever possible.",
    detail: [
      "Repairs are different from a periodic service: the value is in the diagnosis. Our mechanics carry a compression tester, multimeter and OBD/FI scanner so a misfire or a dead start is traced to the actual cause instead of replacing parts by guesswork.",
      "You always see the failed component. Old parts stay with you if you want them, and the invoice lists labour and parts separately.",
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
      ["Diagnosis before spend", "You approve a specific repair, not a vague estimate."],
      ["Old parts returned", "Proof that the replacement actually happened."],
      ["Guaranteed workmanship", "7-day guarantee on the repaired item."],
      ["Doorstep first", "Most repairs are completed where the bike is parked."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["Do you charge for diagnosis?", "No. Diagnosis at your doorstep is free; you pay only if you approve the repair."],
      ["My bike will not start. Can you come today?", "Usually yes — same-day and emergency slots are available across Bangalore between 8 AM and 9 PM."],
      ["Can every repair be done at home?", "Most can. Engine rebuilds, accident repair and paint work move to our workshop with free pickup."],
      ["Do repairs carry a warranty?", "Yes, a 7-day workmanship guarantee, plus the manufacturer warranty on the part itself."],
    ],
    local: true,
    serviceType: "Bike Repair",
    related: ["doorstep-bike-repair", "engine-repair", "electrical-repair", "brake-service"],
  },
  {
    slug: "doorstep-bike-repair",
    name: "Doorstep Bike Repair",
    h1: "Doorstep Bike Repair in Bangalore",
    title: "Doorstep Bike Repair Near Me, Bangalore | Ride N Care",
    description:
      "Doorstep bike repair in Bangalore — a mechanic reaches your home or office, diagnoses free and repairs on the spot. Same-day slots. Call 08296950339.",
    intro:
      "A bike that will not start is hard to take to a garage. Ride N Care brings the repair to you: free diagnosis at your address, a written quote, and the fix done on the spot in most cases.",
    detail: [
      "Our most common doorstep repairs are dead batteries, self-start failures, brake binding, chain and sprocket replacement, clutch cable and plate work, punctures and carburettor cleaning — all fully doable in a parking bay.",
      "Where the bike must move, we load it safely and cover the transport. You are told the workshop estimate before it leaves.",
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
      ["Fast response", "Most Bangalore addresses reached within about 30–45 minutes in a same-day slot."],
      ["Parts in the van", "Common spares and consumables carried on board."],
      ["Written quote first", "Nothing is replaced without your approval."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How quickly can a mechanic reach me?", "Within about 30–45 minutes for most Bangalore addresses during working hours, depending on traffic."],
      ["Can you replace a battery at home?", "Yes — we test the charging system first, then fit a fresh battery with a manufacturer warranty."],
      ["Do you handle punctures?", "Yes, wheel-on tubeless repair or a tube change at your doorstep."],
      ["What if the repair needs a workshop?", "We tell you before touching anything, transport the bike free and share the estimate for approval."],
    ],
    local: true,
    serviceType: "Doorstep Bike Repair",
    related: ["bike-repair", "emergency-bike-repair", "bike-breakdown-assistance", "battery-service"],
  },
  {
    slug: "periodic-bike-service",
    name: "Periodic Bike Service",
    h1: "Periodic Bike Service in Bangalore",
    title: "Periodic Bike Service in Bangalore | Ride N Care",
    description:
      "Scheduled periodic bike service in Bangalore at your doorstep — oil, filters, brakes, chain and a 25-point inspection with service reminders.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["What is the difference between periodic service and general service?", "Periodic service follows the manufacturer's scheduled checklist for your model and mileage. A general service is a lighter clean-and-check."],
      ["Will doorstep service void my manufacturer warranty?", "Warranty on a specific part stays with the part maker. If your bike is still inside the free-service period, we recommend using those free services first."],
      ["Do you keep my service history?", "Yes, against your phone number, with the odometer reading from each visit."],
    ],
    local: false,
    priceFrom: 499,
    serviceType: "Periodic Bike Service",
    related: ["bike-service", "doorstep-bike-service", "general-two-wheeler-repair"],
  },
  {
    slug: "motorcycle-service",
    name: "Motorcycle Service",
    h1: "Motorcycle Service in Bangalore — Commuter to Superbike",
    title: "Motorcycle Service in Bangalore | Ride N Care",
    description:
      "Motorcycle service in Bangalore for Royal Enfield, KTM, Yamaha, Kawasaki, Triumph and more. Doorstep service by trained mechanics with OEM-grade parts.",
    intro:
      "From a 100 CC commuter to a litre-class superbike, Ride N Care mechanics are trained by engine class. Bigger motorcycles get bigger-bike attention: torque specs, valve clearance checks and the right grade of oil.",
    detail: [
      "Larger-capacity motorcycles are less forgiving of shortcuts. We use manufacturer torque values, full-synthetic oil where specified, and inspect chain wear, sprocket profile and brake fluid condition on every visit.",
      "We service Royal Enfield, KTM, Yamaha, Bajaj, Honda, Hero, TVS, Suzuki, Jawa, Yezdi, Benelli, Kawasaki, Triumph, Ducati, BMW, Aprilia, Husqvarna and Harley-Davidson.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["Do you service Royal Enfield and KTM?", "Yes — both are among our most-serviced brands in Bangalore, including 350/650 twins and KTM Duke/RC models."],
      ["Can you service superbikes at home?", "Periodic service and consumables, yes. Valve-clearance and suspension rebuilds are done in the workshop."],
      ["Which oil do you use?", "The grade your manual specifies, from OEM-approved brands, shown to you sealed before pouring."],
    ],
    local: true,
    priceFrom: 1199,
    serviceType: "Motorcycle Service",
    related: ["bike-service", "engine-repair", "brake-service", "doorstep-bike-service"],
  },
  {
    slug: "scooter-service",
    name: "Scooter Service",
    h1: "Scooter Service in Bangalore at Your Doorstep",
    title: "Scooter Service in Bangalore | Ride N Care",
    description:
      "Doorstep scooter service in Bangalore for Honda Activa, TVS Jupiter, Suzuki Access, Ather and Ola. CVT care, brakes and battery. Call 08296950339.",
    intro:
      "Scooters take the worst of Bangalore's potholes and short trips. Ride N Care services every automatic scooter at your doorstep — including the CVT and rear-drive care that most quick garages skip.",
    detail: [
      "Automatic scooters need attention a motorcycle does not: CVT belt and roller wear, gear oil in the final drive, and a variator that collects dust from unpaved shortcuts. Short city trips also mean the engine rarely gets fully warm, so oil degrades faster.",
      "We service Honda Activa and Dio, TVS Jupiter and Ntorq, Suzuki Access and Burgman, Yamaha Fascino and RayZR, Hero Pleasure and Destini, Aprilia SR, plus electric scooters for brake, tyre and running-gear work.",
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
      ["EV-friendly", "Running-gear service for Ather, Ola and TVS iQube."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How often should a scooter be serviced?", "Every 2,500–3,000 km or three months. If your daily ride is under 5 km, keep to the time-based interval — oil ages even when kilometres are low."],
      ["Do you service electric scooters?", "We handle brakes, tyres, suspension and general running gear. Battery and motor issues stay with the manufacturer's service network."],
      ["What does scooter service cost?", "Most automatic scooters fall in our ₹499 package band, plus consumables at MRP."],
    ],
    local: true,
    priceFrom: 499,
    serviceType: "Scooter Service",
    related: ["bike-service", "doorstep-bike-service", "battery-service", "brake-service"],
  },
  {
    slug: "emergency-bike-repair",
    name: "Emergency Bike Repair",
    h1: "Emergency Bike Repair in Bangalore",
    title: "Emergency Bike Repair in Bangalore | Ride N Care",
    description:
      "Emergency bike repair in Bangalore — roadside mechanic for dead batteries, punctures and no-start problems. Fast response, 8 AM to 9 PM. Call 08296950339.",
    intro:
      "Stuck on the road? Call 08296950339 or WhatsApp us and a mechanic is dispatched to your location with a battery pack, puncture kit and basic spares.",
    detail: [
      "Roadside jobs we solve most often: a battery that will not crank, a snapped clutch cable, a tubeless puncture, brake binding after a wet ride, and fuel-line or plug trouble after riding through waterlogging.",
      "If your bike cannot be made rideable safely, we recover it to the nearest Ride N Care workshop rather than leaving you to arrange transport.",
    ],
    includes: [
      "Rapid dispatch to your location",
      "Jump-start and battery replacement",
      "On-the-spot puncture repair",
      "Cable, fuse and plug replacement",
      "Brake release and safety check",
      "Recovery to workshop if unrideable",
    ],
    benefits: [
      ["Fast response", "Typically 30–45 minutes inside Bangalore city limits."],
      ["Rideable or recovered", "You are never left stranded with the bike."],
      ["Upfront charges", "Callout and repair charges told before dispatch."],
      ["Every day, 8 AM–9 PM", "Weekends and holidays included."],
    ],
    steps: [
      ["1. Call or WhatsApp", "Share your live location and what happened."],
      ["2. Get the charge upfront", "Callout plus likely repair cost confirmed on the call."],
      ["3. Mechanic dispatched", "Nearest available mechanic rides to you with spares."],
      ["4. Ride away or be recovered", "Fixed on the spot, or transported to the workshop."],
    ],
    faqs: [
      ["How fast can you reach me?", "Usually 30–45 minutes within Bangalore city limits during service hours, depending on traffic and distance."],
      ["Are you available at night?", "Our dispatch window is 8 AM to 9 PM every day. Late-night requests are scheduled for the next morning's first slot."],
      ["What does an emergency callout cost?", "A callout charge applies and is quoted on the phone before dispatch; repairs and parts are billed on top after your approval."],
    ],
    local: true,
    serviceType: "Emergency Bike Repair",
    related: ["bike-breakdown-assistance", "doorstep-bike-repair", "battery-service", "bike-repair"],
  },
  {
    slug: "bike-breakdown-assistance",
    name: "Bike Breakdown Assistance",
    h1: "Bike Breakdown Assistance in Bangalore",
    title: "Bike Breakdown Assistance in Bangalore | Ride N Care",
    description:
      "Bike breakdown assistance across Bangalore — roadside diagnosis, on-spot repair and bike recovery to our workshop. Call 08296950339 or WhatsApp us.",
    intro:
      "Breakdown assistance covers everything from a bike that stops mid-ride to one that will not move after a flood-hit street. We assess, fix what can be fixed roadside, and recover the rest.",
    detail: [
      "Bangalore's monsoon leaves water in air boxes and silencers, and heat leaves batteries flat. Both leave a bike immobile in a way that looks alarming and is often quick to solve once diagnosed properly.",
      "Our assistance mechanics carry a jump pack, tool roll, spare cables, fuses, plugs and a puncture kit — the parts behind most roadside failures.",
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
      ["City-wide cover", "Assistance across all Ride N Care service areas."],
      ["Real diagnosis", "The cause is found, not guessed at."],
      ["No abandoned bikes", "Recovery included where needed."],
      ["Clear pricing", "Charges confirmed before we ride out."],
    ],
    steps: [
      ["1. Share your location", "WhatsApp a live location pin so we route the nearest mechanic."],
      ["2. Describe the symptom", "Sound, smell, warning lights — it narrows the diagnosis before arrival."],
      ["3. Roadside assessment", "Fault identified and options explained on the spot."],
      ["4. Fixed or recovered", "Repaired roadside where possible; otherwise transported."],
    ],
    faqs: [
      ["Do you recover the bike if it cannot be repaired?", "Yes, to the nearest Ride N Care workshop, with the repair estimate shared before work begins."],
      ["My bike stalled in waterlogging — can you help?", "Do not keep cranking it. Call us; water ingress needs the airbox and cylinder cleared before starting, which we do on site."],
      ["Is breakdown assistance available on holidays?", "Yes, every day between 8 AM and 9 PM."],
    ],
    local: false,
    serviceType: "Bike Breakdown Assistance",
    related: ["emergency-bike-repair", "doorstep-bike-repair", "battery-service"],
  },
  {
    slug: "engine-repair",
    name: "Bike Engine Repair",
    h1: "Bike Engine Repair in Bangalore",
    title: "Bike Engine Repair in Bangalore | Ride N Care",
    description:
      "Bike engine repair in Bangalore — noise, smoke, overheating and power-loss diagnosis, top-end and full overhaul with OEM parts and written estimates.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["Can engine repair be done at home?", "Diagnosis and light work, yes. An overhaul goes to our workshop with free pickup, since the engine needs a bench and specialist tools."],
      ["How long does an overhaul take?", "Typically 2–4 working days depending on parts availability for your model."],
      ["Is my engine noise serious?", "Not always — chain and valve noise are often mistaken for internal damage. A free diagnosis will tell you before you spend anything."],
    ],
    local: false,
    serviceType: "Bike Engine Repair",
    related: ["bike-repair", "motorcycle-service", "general-two-wheeler-repair"],
  },
  {
    slug: "brake-service",
    name: "Bike Brake Service",
    h1: "Bike Brake Service & Repair in Bangalore",
    title: "Bike Brake Service in Bangalore | Ride N Care",
    description:
      "Bike brake service in Bangalore at your doorstep — pad and shoe replacement, disc check, brake bleeding and squeal fixes with OEM parts.",
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
      "Post-service braking test ride",
    ],
    benefits: [
      ["Measured, not guessed", "Wear numbers shown before replacement."],
      ["Squeal fixes", "Glazing and dust cleaned, not just masked."],
      ["Doorstep service", "Full brake work possible at your parking bay."],
      ["7-day guarantee", "On the brake work performed."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How often should brake pads be replaced?", "Typically every 8,000–15,000 km, much sooner in heavy city traffic. We measure rather than assume."],
      ["Why do my brakes squeal?", "Usually glazed pads or brake dust build-up; sometimes a worn disc. Cleaning and correct bedding-in solves most cases."],
      ["Do you change brake fluid?", "Yes — recommended every two years, or sooner if the lever feels spongy."],
    ],
    local: false,
    serviceType: "Bike Brake Service",
    related: ["bike-service", "bike-repair", "clutch-repair"],
  },
  {
    slug: "clutch-repair",
    name: "Bike Clutch Repair",
    h1: "Bike Clutch Repair in Bangalore",
    title: "Bike Clutch Repair in Bangalore | Ride N Care",
    description:
      "Bike clutch repair in Bangalore — slipping clutch, hard lever and plate replacement done at your doorstep with OEM parts and a written quote.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["How do I know the clutch is slipping?", "Revs climb but speed does not, especially uphill or in third gear. A test ride confirms it quickly."],
      ["Can clutch plates be changed at home?", "On most commuter bikes and many motorcycles, yes — at your parking spot."],
      ["What does clutch repair cost?", "Cable and adjustment work is inexpensive; a plate set depends on the model. You get the exact quote before approval."],
    ],
    local: false,
    serviceType: "Bike Clutch Repair",
    related: ["bike-repair", "brake-service", "general-two-wheeler-repair"],
  },
  {
    slug: "battery-service",
    name: "Bike Battery Service",
    h1: "Bike Battery Service & Replacement in Bangalore",
    title: "Bike Battery Replacement in Bangalore | Ride N Care",
    description:
      "Bike battery service in Bangalore — free health test, jump-start and doorstep battery replacement with warranty. Same-day fitting. Call 08296950339.",
    intro:
      "A bike that cranks slowly or clicks and dies usually needs a battery test, not immediately a new battery. We test first, then fit a warranted replacement at your doorstep if it is genuinely finished.",
    detail: [
      "Batteries fail early when the charging system is at fault, so we check regulator-rectifier output and standing drain before recommending a replacement. Otherwise the new battery dies the same way.",
      "Replacements are fitted at your address with the old battery taken away for recycling, and the warranty card registered in your name.",
    ],
    includes: [
      "Free battery load and voltage test",
      "Charging-system and drain check",
      "Jump-start service",
      "Doorstep battery replacement with warranty",
      "Terminal cleaning and protection",
      "Old battery collected for recycling",
    ],
    benefits: [
      ["Test before you buy", "No unnecessary replacement."],
      ["Same-day fitting", "Common sizes carried in the van."],
      ["Warranty registered", "Card in your name, invoice on WhatsApp."],
      ["Root cause checked", "Charging faults found before they kill the new battery."],
    ],
    steps: BOOK_STEPS,
    faqs: [
      ["How long does a bike battery last?", "Around 2.5–4 years in Bangalore. Heat and long parked spells shorten it."],
      ["Can you replace the battery at my home?", "Yes, in about 20 minutes including testing."],
      ["Do the batteries carry a warranty?", "Yes — standard manufacturer warranty on every battery we fit."],
    ],
    local: false,
    serviceType: "Bike Battery Service",
    related: ["electrical-repair", "doorstep-bike-repair", "emergency-bike-repair"],
  },
  {
    slug: "electrical-repair",
    name: "Bike Electrical Repair",
    h1: "Bike Electrical Repair in Bangalore",
    title: "Bike Electrical Repair in Bangalore | Ride N Care",
    description:
      "Bike electrical repair in Bangalore — self-start failure, wiring faults, charging problems, lights and indicators fixed at your doorstep.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["My self-start is not working — is it the battery?", "Often, but not always. It can also be the starter relay, motor or switch. Testing takes minutes and tells us for sure."],
      ["Why does my battery drain overnight?", "A parasitic drain, usually from accessory wiring or a failing regulator. We measure standing current to find it."],
      ["Do you fix aftermarket accessory wiring?", "Yes, and we re-do unsafe installations with proper fusing."],
    ],
    local: false,
    serviceType: "Bike Electrical Repair",
    related: ["battery-service", "bike-repair", "general-two-wheeler-repair"],
  },
  {
    slug: "general-two-wheeler-repair",
    name: "General Two-Wheeler Repair",
    h1: "General Two-Wheeler Repair in Bangalore",
    title: "Two Wheeler Repair in Bangalore | Ride N Care",
    description:
      "General two-wheeler repair in Bangalore — bikes, scooters and EVs. Suspension, tyres, cables, punctures and washing at your doorstep. Call 08296950339.",
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
    steps: BOOK_STEPS,
    faqs: [
      ["I do not know what is wrong — can you just check?", "Yes. Book a general inspection; the doorstep diagnosis is free and you get a prioritised list."],
      ["Do you replace tyres at home?", "Yes, with tyres sourced to your specified brand and size."],
      ["Do you also wash the bike?", "A foam wash and dry finish is included with most service packages and available on its own."],
    ],
    local: false,
    serviceType: "Two Wheeler Repair",
    related: ["bike-service", "bike-repair", "scooter-service", "brake-service"],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
/** Services that get /<service>/<area> local landing pages. */
export const LOCAL_SERVICES = SERVICES.filter((s) => s.local);
export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
