/**
 * Original, factual long-form guides. Written to be genuinely useful reference
 * material that answer engines can quote, and to feed /guides and /guides/$slug.
 */

export interface GuideSection {
  h: string;
  p?: string[];
  bullets?: string[];
  /** Optional simple table: header row + data rows. */
  table?: { head: string[]; rows: string[][] };
}

export interface Guide {
  slug: string;
  title: string;
  h1: string;
  description: string;
  /** Answer-first summary paragraph, also used for the article abstract. */
  summary: string;
  published: string;
  readMinutes: number;
  sections: GuideSection[];
  faqs: [string, string][];
  related: string[];
  /** Related service slugs for contextual internal links. */
  services: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "bike-service-guide-bangalore",
    title: "Bike Service Guide for Bangalore (2026) | Ride N Care",
    h1: "Bike Service Guide for Bangalore",
    description:
      "Bike service guide for Bangalore riders: service intervals for city traffic, what a service includes, realistic costs and how doorstep service works.",
    summary:
      "In Bangalore's stop-start traffic, most commuter bikes need a service every 2,500–3,500 km or every three months, whichever comes first. A correct service covers engine oil, both filters, brakes, chain, clutch and throttle play, battery and tyres, and ends with a written inspection report.",
    published: "2026-02-14",
    readMinutes: 8,
    sections: [
      {
        h: "Why Bangalore is harder on a bike than the manual assumes",
        p: [
          "Service intervals printed in an owner's manual assume steady running. Bangalore riding is the opposite: long idling at signals, constant clutch use, dust from roadworks, and three months of monsoon water. The result is that oil degrades faster, the air filter clogs sooner, chains dry out and brake pads glaze.",
          "Practically, this means a rider covering 25–30 km a day in the city should not wait for the manual's 5,000 km mark. Oil that has spent hours idling in traffic loses viscosity well before that.",
        ],
      },
      {
        h: "How often should you service your bike in Bangalore?",
        table: {
          head: ["Use pattern", "Service interval", "Notes"],
          rows: [
            ["City commute under 30 km/day", "Every 3,000 km or 3 months", "Air filter cleaning is the item most often skipped"],
            ["City commute over 30 km/day", "Every 2,500 km or 2 months", "Chain lubrication every 500 km in monsoon"],
            ["Weekend-only riding", "Every 6 months", "Battery and tyre pressure matter more than oil kilometres"],
            ["Highway touring bike", "Per manual, plus pre-ride check", "Chain, tyres and brake fluid before every long ride"],
          ],
        },
      },
      {
        h: "What a complete bike service must include",
        bullets: [
          "Engine oil replacement with the grade the manufacturer specifies",
          "Oil filter clean or replacement, and air filter clean or replacement",
          "Spark plug inspection, cleaning and gap setting",
          "Front and rear brake inspection, pad wear check and free-play adjustment",
          "Chain cleaning, lubrication and slack setting to specification",
          "Clutch and throttle play adjustment",
          "Battery voltage and charging-system check",
          "Tyre pressure, tread depth and uneven-wear check",
          "Lights, indicators, horn and mirror check",
          "Wash, plus a written inspection report of what is due next",
        ],
        p: [
          "If a service bill shows only oil and labour, ask what was inspected. The inspection is the part that saves money later.",
        ],
      },
      {
        h: "What bike service costs in Bangalore",
        p: [
          "Cost is driven by engine capacity. Ride N Care General Service starts at ₹799 for bikes up to 199cc, with exact categories for 200–249cc, 250–400cc, 401–500cc, 501–800cc, and 801cc and above. Parts are billed separately after approval.",
          "Beware of quotes that exclude consumables. A genuine quote names the oil brand and grade, the filter, and the labour, so the final invoice matches what you agreed.",
        ],
      },
      {
        h: "Doorstep service versus a garage visit",
        p: [
          "Doorstep service suits periodic maintenance and most mechanical and electrical repairs: the same parts, tools and trained mechanics, without losing half a day. A workshop is genuinely better for engine rebuilds, wheel truing, frame work and painting, which need presses, alignment jigs or a paint booth.",
          "An honest provider tells you which category your job falls in. Ride N Care completes doorstep-suitable work at your address and arranges pickup for the rest.",
        ],
      },
      {
        h: "Questions worth asking before you book",
        bullets: [
          "Will I get a written quote before work starts?",
          "Which oil grade and which parts will be used?",
          "Will I receive an invoice listing the parts fitted?",
          "Is there a workmanship guarantee, and for how long?",
          "What happens if a new fault is found mid-service?",
        ],
      },
    ],
    faqs: [
      ["Can I service my bike later than the recommended interval?", "You can, but oil that is past its life stops protecting the engine's moving parts and clogged air filters raise fuel consumption. Delaying a service usually costs more than the service."],
      ["Is doorstep bike service reliable for a new bike?", "Yes for paid services. If your bike is inside a free-service or warranty period tied to authorised centres, use the authorised centre for those specific claims."],
      ["How long does a doorstep bike service take?", "A standard periodic service takes 60–90 minutes at your address."],
    ],
    related: ["complete-bike-maintenance-guide", "when-to-service-your-bike", "doorstep-bike-service-guide"],
    services: ["bike-service", "doorstep-bike-service", "periodic-bike-service"],
  },
  {
    slug: "complete-bike-maintenance-guide",
    title: "Complete Bike Maintenance Guide | Ride N Care Bangalore",
    h1: "Complete Bike Maintenance Guide",
    description:
      "Two-wheeler maintenance guide: weekly, monthly and yearly checks for chain, brakes, tyres, battery, oil and electricals for Indian city riding.",
    summary:
      "Most two-wheeler breakdowns come from five neglected items: chain lubrication, tyre pressure, brake wear, battery terminals and engine oil. A five-minute weekly check and a monthly 15-minute check prevent the majority of roadside failures.",
    published: "2026-02-20",
    readMinutes: 9,
    sections: [
      {
        h: "The weekly five-minute check",
        bullets: [
          "Tyre pressure — check cold, set to the sticker value on the swingarm or chain guard",
          "Chain slack and lubrication — a dry chain is audible before it is visible",
          "Brake lever and pedal feel — spongy or long travel needs attention",
          "Lights, indicators and horn",
          "Oil level through the sight glass or dipstick, bike upright",
        ],
      },
      {
        h: "The monthly fifteen-minute check",
        bullets: [
          "Air filter — remove and inspect; city dust clogs it faster than mileage suggests",
          "Brake pad thickness front and rear, and disc surface for scoring",
          "Battery terminals for white powder, and the wiring for chafing",
          "Tyre tread depth and any uneven wear pattern",
          "Bolt check on mirrors, number plate, foot pegs and luggage racks",
          "Coolant level on liquid-cooled bikes",
        ],
      },
      {
        h: "Chain care, done properly",
        p: [
          "Clean first, then lubricate. Applying lube over grit turns the chain into a grinding paste, which is why chains wear out in 12,000 km instead of 25,000 km.",
          "Use a chain cleaner or kerosene with a soft brush, wipe dry, then apply chain lube to the inner run of the chain while rotating the wheel. Set slack to the manufacturer's figure — over-tight chains destroy output-shaft bearings.",
        ],
      },
      {
        h: "Brakes: what wear feels like",
        p: [
          "Brake pads warn you before they fail. Lever travel increases, braking becomes noisy, and stopping distance grows. A metallic scraping sound means the pad's friction material is gone and the disc is now being damaged — that turns a pad replacement into a disc replacement.",
          "Brake fluid absorbs moisture and should be replaced roughly every two years on hydraulic systems, even if the bike is barely used.",
        ],
      },
      {
        h: "Battery life in Indian conditions",
        p: [
          "Two-wheeler batteries typically last 2.5–4 years. Heat shortens that, and so does a bike left standing for weeks — a battery discharges slowly and sulphates when flat.",
          "Signs of a dying battery: slow crank, dimming headlight at idle, self-start working only after a few tries. A load test tells you definitively; guessing usually means being stranded.",
        ],
      },
      {
        h: "Seasonal maintenance calendar",
        table: {
          head: ["Season", "Priority items"],
          rows: [
            ["Monsoon (Jun–Sep)", "Chain lubrication every 500 km, brake drying, tyre tread, electrical connector sealing"],
            ["Summer (Mar–May)", "Coolant, tyre pressure (heat raises it), battery water level on serviceable batteries"],
            ["Post-monsoon (Oct–Nov)", "Full wash and underbody check, rust spots, cable lubrication"],
            ["Any month", "Engine oil per interval, air filter, brake pads"],
          ],
        },
      },
    ],
    faqs: [
      ["How often should I lubricate my chain?", "Every 500–1,000 km in dry weather and roughly every 500 km during monsoon, always after cleaning the chain."],
      ["Does washing a bike damage anything?", "Only high-pressure jets aimed at bearings, chain, electricals and the exhaust outlet. Low pressure and a soft brush are safe."],
      ["Can I use any engine oil grade?", "No. Use the grade in your manual, since viscosity affects clutch behaviour and engine protection on wet-clutch motorcycles."],
    ],
    related: ["common-bike-problems-and-solutions", "when-to-service-your-bike", "motorcycle-vs-scooter-maintenance"],
    services: ["bike-service", "periodic-bike-service", "general-two-wheeler-repair"],
  },
  {
    slug: "common-bike-problems-and-solutions",
    title: "Common Bike Problems and Solutions | Ride N Care Bangalore",
    h1: "Common Bike Problems and Solutions",
    description:
      "Common two-wheeler problems by symptom: bike not starting, poor pickup, high fuel use, noises, smoke and electrical faults, with causes and fixes.",
    summary:
      "Most two-wheeler complaints trace back to a small number of causes: a weak battery, a clogged air filter, an out-of-adjustment chain or clutch, worn brake pads, or dirty fuel delivery. Matching the symptom to the likely cause first avoids paying for parts you did not need.",
    published: "2026-02-26",
    readMinutes: 10,
    sections: [
      {
        h: "Bike will not start",
        table: {
          head: ["What you notice", "Likely cause", "Fix"],
          rows: [
            ["Slow crank, dim lights", "Discharged or aged battery", "Load-test; charge or replace the battery"],
            ["Cranks fine, no fire", "No fuel delivery or fouled spark plug", "Check fuel, clean or replace plug, check injector/carburettor"],
            ["Nothing at all on the starter", "Starter relay, side-stand switch, kill switch or fuse", "Check side-stand switch and fuse before replacing parts"],
            ["Starts and dies immediately", "Idle mixture, clogged filter, stale fuel", "Clean filter, drain stale fuel, reset idle"],
          ],
        },
      },
      {
        h: "Poor pickup or loss of power",
        p: [
          "Start with the air filter and spark plug — they explain a large share of power complaints and cost very little. Next look at the chain and sprockets, since a worn set eats acceleration, and then at clutch free play, because a slipping clutch feels exactly like a tired engine.",
          "Only after those should anyone talk about valve clearance or fuel-system cleaning. A shop that jumps straight to expensive work is guessing.",
        ],
      },
      {
        h: "Fuel consumption suddenly worse",
        bullets: [
          "Under-inflated tyres — the cheapest mileage loss to fix",
          "Clogged air filter making the mixture rich",
          "Dragging brakes from a seized caliper piston or over-adjusted drum",
          "Dry or over-tight chain adding drag",
          "Ignition or fuel-mapping faults, which need diagnostics",
        ],
      },
      {
        h: "Noises and what they usually mean",
        table: {
          head: ["Noise", "Usual source"],
          rows: [
            ["Rhythmic tick that rises with revs", "Valve clearance or tappet adjustment"],
            ["Metallic scrape when braking", "Brake pads worn to the backing plate"],
            ["Clatter that follows road bumps", "Loose chain, worn suspension bush or wheel bearing"],
            ["Whine that changes with speed, not revs", "Wheel bearing or final drive"],
            ["Rattle from the exhaust area", "Cracked bracket or loose heat shield"],
          ],
        },
      },
      {
        h: "Smoke from the exhaust",
        p: [
          "White vapour on a cold morning is condensation and normal. Persistent blue-grey smoke suggests oil entering the combustion chamber through worn rings or valve seals. Black smoke means an over-rich mixture, often a choked air filter or a fuelling fault.",
          "Two-stroke bikes smoke by design; the concern there is the volume changing suddenly.",
        ],
      },
      {
        h: "Electrical faults",
        p: [
          "Intermittent electrical problems are usually connections, not components. Corroded battery terminals, a chafed loom near the headstock and water in a switch housing account for most of them.",
          "If a fuse blows repeatedly, do not fit a higher-rated fuse. The fuse is reporting a short circuit, and a bigger fuse turns a fault into a fire risk.",
        ],
      },
      {
        h: "When to stop riding and call for help",
        bullets: [
          "Brakes that reach the lever end or make metal-on-metal contact",
          "Fuel smell or visible fuel leak",
          "Sudden loss of oil pressure warning or oil visible under the engine",
          "Steering that feels loose or wanders",
          "Repeated stalling in traffic",
        ],
        p: [
          "In Bangalore, Ride N Care attends emergency bike repair and breakdown calls between 8:00 AM and 9:00 PM on 08296950339.",
        ],
      },
    ],
    faqs: [
      ["My bike starts with kick but not the self-start. Why?", "Almost always a weak battery or a failing starter relay — the kick start does not depend on battery power the way the starter motor does."],
      ["Is a rich or lean mixture worse?", "Lean running is more damaging because it raises combustion temperature; rich running mainly costs fuel and fouls plugs. Both should be corrected."],
      ["Can a clogged air filter really cause poor pickup?", "Yes, and it is one of the most common causes we find in Bangalore because of road dust."],
    ],
    related: ["bike-breakdown-troubleshooting-guide", "complete-bike-maintenance-guide", "when-to-service-your-bike"],
    services: ["bike-repair", "engine-repair", "electrical-repair"],
  },
  {
    slug: "when-to-service-your-bike",
    title: "When Should You Service Your Bike? | Ride N Care Bangalore",
    h1: "When Should You Service Your Bike?",
    description:
      "When your bike needs a service: kilometre and time intervals, warning symptoms, and how city riding and monsoon change the schedule.",
    summary:
      "Service your bike at whichever comes first — the kilometre interval or the time interval. For Bangalore city riding, that is roughly every 2,500–3,500 km or every three months. Certain symptoms override the schedule and mean a service now, regardless of the odometer.",
    published: "2026-03-04",
    readMinutes: 7,
    sections: [
      {
        h: "The two intervals that both matter",
        p: [
          "Engine oil degrades from heat, moisture and combustion by-products as well as from distance. That is why manufacturers give both a kilometre figure and a months figure: a bike doing 200 km a month still needs its oil changed on time.",
          "Take whichever arrives first. Riders who only track kilometres often run oil that is a year old.",
        ],
      },
      {
        h: "Symptoms that mean service now",
        bullets: [
          "Braking distance has grown, or the lever travels further than usual",
          "Chain is noisy, dry or has visibly uneven slack",
          "Idling is rough or the bike stalls at signals",
          "Fuel consumption has dropped noticeably in a few weeks",
          "Starting takes several attempts",
          "Any new noise, vibration or smell",
        ],
      },
      {
        h: "After a long standing period",
        p: [
          "A bike parked for more than a month needs its own checklist before normal riding: battery charge, tyre pressure and flat-spotting, fuel condition, brake seizing, and rodent damage to wiring in some buildings.",
          "Fuel that has stood for months varnishes and can block small passages, which is a common cause of poor running after a break.",
        ],
      },
      {
        h: "Service timing by rider type",
        table: {
          head: ["Rider", "Trigger", "Extra attention"],
          rows: [
            ["Daily commuter", "3,000 km or 3 months", "Air filter, brake pads, chain"],
            ["Delivery/high-mileage rider", "2,000–2,500 km", "Oil, chain, tyres, brake pads"],
            ["Weekend rider", "6 months", "Battery, fuel condition, tyre age"],
            ["Touring rider", "Before and after each tour", "Tyres, chain, brake fluid, coolant"],
          ],
        },
      },
      {
        h: "What happens if you delay",
        p: [
          "Delaying a service rarely produces a dramatic failure. It produces a chain of small ones: filters restrict, mixture drifts, plugs foul, pads wear into discs, and finally something expensive fails. The cost curve is steep and avoidable.",
          "The cheapest maintenance decision on any two-wheeler is a service done on time with the correct oil and a clean air filter.",
        ],
      },
    ],
    faqs: [
      ["Should I service before or after a long ride?", "Both — a pre-ride check for tyres, chain, brakes and fluids, and a service afterwards if the ride added significant kilometres."],
      ["Is the first free service important?", "Yes. Early oil changes remove metal particles from initial engine break-in, so do not skip or delay it."],
      ["My bike feels fine. Do I still need a service?", "Yes. Wear items like oil, filters and brake pads reach their limit long before the bike feels wrong to ride."],
    ],
    related: ["bike-service-guide-bangalore", "complete-bike-maintenance-guide", "common-bike-problems-and-solutions"],
    services: ["periodic-bike-service", "bike-service", "doorstep-bike-service"],
  },
  {
    slug: "doorstep-bike-service-guide",
    title: "Doorstep Bike Service Guide | How It Works | Ride N Care",
    h1: "Doorstep Bike Service Guide",
    description:
      "How doorstep bike service works, what can and cannot be done at your address, how long it takes, what to prepare and how pricing and guarantees should work.",
    summary:
      "Doorstep bike service means a mechanic brings tools, consumables and spares to your address and completes the service where the bike is parked, usually in 60–90 minutes. Routine service and most mechanical and electrical repairs are suitable; engine rebuilds, wheel truing and painting are not.",
    published: "2026-03-10",
    readMinutes: 7,
    sections: [
      {
        h: "How a doorstep visit actually runs",
        bullets: [
          "You share the bike model, the symptom and your address with a preferred slot",
          "You receive a written quote covering parts, labour and timing",
          "A uniformed mechanic arrives with tools, oil, filters and common spares",
          "Work is done in front of you, with anything extra photographed and approved first",
          "You take a short test ride, then pay by UPI, card or cash and receive a digital invoice",
        ],
      },
      {
        h: "What can be done at your doorstep",
        bullets: [
          "Periodic service: oil, filters, plug, brakes, chain, clutch, battery check, wash",
          "Brake pad and shoe replacement, and brake bleeding",
          "Clutch plate and cable work on most models",
          "Battery testing and replacement",
          "Electrical fault diagnosis, wiring repair, lights and switches",
          "Chain and sprocket replacement, punctures and tyre changes",
          "Carburettor cleaning and fuel-system attention",
        ],
      },
      {
        h: "What genuinely needs a workshop",
        bullets: [
          "Engine and gearbox internals requiring a press or special jigs",
          "Wheel truing and rim straightening",
          "Denting, painting and full body work",
          "Frame or fork straightening after an accident",
        ],
        p: [
          "Ride N Care states which category your job is in before booking, and arranges pickup when a workshop is the right answer.",
        ],
      },
      {
        h: "What to prepare",
        bullets: [
          "A parking spot with a little space around the bike — a basement bay or driveway is fine",
          "Access permission at the gate if you live in a gated community",
          "Your service book or last invoice, if you have it",
          "A note of anything you have noticed, however small — it shortens diagnosis",
        ],
      },
      {
        h: "Cost, guarantees and paperwork",
        p: [
          "Doorstep pricing should not hide a visiting charge. Ride N Care Jump Start is ₹399, Running Repair is ₹450, and General Service starts at ₹799 for bikes up to 199cc, with parts shown separately before approval.",
          "Ask for three things every time: the quote in writing, the invoice listing parts fitted, and the workmanship guarantee period. Ride N Care provides a 7-day workmanship guarantee on work performed.",
        ],
      },
      {
        h: "Where doorstep service is available in Bangalore",
        p: [
          "Ride N Care covers HSR Layout, Koramangala, Indiranagar, Domlur, Ejipura, BTM Layout, Madiwala, Bommanahalli, Kudlu Gate, Singasandra, Parappana Agrahara, Electronic City, Marathahalli, Bellandur, HAL, Mahadevapura, KR Puram, Whitefield, Brookefield, Varthur, Gunjur, Harlur, Sarjapur Road, Kasavanahalli, Choodasandra, Panathur Road, Kadubeesanahalli, Banashankari, Jayanagar, JP Nagar and nearby localities.",
        ],
      },
    ],
    faqs: [
      ["Do I need to be present during the service?", "Someone should be available at the start to approve the quote and at the end to check the work, but you do not have to stand and watch."],
      ["Is water needed for the wash?", "A dry or low-water wash is used where a tap is not available, so apartment basements are not a problem."],
      ["Can doorstep service be done in an apartment basement?", "Yes, provided security allows entry and there is space to work around the bike."],
    ],
    related: ["bike-service-guide-bangalore", "when-to-service-your-bike", "bike-breakdown-troubleshooting-guide"],
    services: ["doorstep-bike-service", "doorstep-bike-repair", "bike-service"],
  },
  {
    slug: "motorcycle-vs-scooter-maintenance",
    title: "Motorcycle vs Scooter Maintenance Guide | Ride N Care",
    h1: "Motorcycle vs Scooter Maintenance Guide",
    description:
      "How maintenance differs for motorcycles and automatic scooters: transmission, brakes, tyres, oil intervals and cost, so you service each correctly.",
    summary:
      "Motorcycles and automatic scooters wear differently. Motorcycles need chain, sprocket and clutch attention; scooters need CVT belt, roller and gear-oil attention instead. Scooters usually need shorter oil intervals and wear front brakes and small tyres faster.",
    published: "2026-03-16",
    readMinutes: 8,
    sections: [
      {
        h: "The core difference: transmission",
        p: [
          "A motorcycle transmits power through a chain and sprockets with a manual clutch. Those parts need cleaning, lubrication, adjustment and eventual replacement as a set.",
          "An automatic scooter uses a CVT: a rubber belt, variator rollers and a centrifugal clutch, plus a separate final gear oil. There is no chain to lube, but the belt and rollers are consumables that quietly degrade performance before they fail.",
        ],
      },
      {
        h: "Side-by-side maintenance comparison",
        table: {
          head: ["Item", "Motorcycle", "Automatic scooter"],
          rows: [
            ["Drive", "Chain and sprockets — clean and lube regularly", "CVT belt and rollers — inspect, replace as a kit"],
            ["Gear oil", "Shared with engine oil in most bikes", "Separate final-drive gear oil, changed periodically"],
            ["Engine oil interval", "Typically 3,000–5,000 km", "Often shorter, 2,500–3,500 km, smaller oil quantity"],
            ["Brakes", "Often disc front, drum or disc rear", "Front brake does most work; pads wear faster"],
            ["Tyres", "Larger, longer-lasting", "Small diameter, more revolutions, faster wear"],
            ["Suspension", "Telescopic front, twin/mono rear", "Often single-sided rear, stiffer ride"],
          ],
        },
      },
      {
        h: "Scooter-specific items riders forget",
        bullets: [
          "CVT belt inspection — a worn belt shows as weak pickup and higher fuel use",
          "Variator rollers, which flat-spot and cause vibration at low speed",
          "Final-drive gear oil, easy to overlook because it is separate from engine oil",
          "Air filter, which on many scooters sits inside the CVT housing",
          "Rear drum brake adjustment and cable lubrication",
        ],
      },
      {
        h: "Motorcycle-specific items",
        bullets: [
          "Chain slack and lubrication, plus sprocket tooth wear",
          "Clutch cable free play, or hydraulic clutch fluid where fitted",
          "Valve clearance on engines that specify periodic adjustment",
          "Fork oil and seals, especially after monsoon",
          "Tyre pressures front and rear, which differ more than on scooters",
        ],
      },
      {
        h: "Which is cheaper to maintain?",
        p: [
          "Scooters are usually cheaper per service because oil volume and part prices are lower, but they need service slightly more often, and CVT kits are a periodic lump cost. Motorcycles cost more per service and per chain-sprocket set, yet those parts last longer if maintained.",
          "Over three years of city use, total costs land closer together than most riders expect. Neglect, not vehicle type, is the biggest cost driver.",
        ],
      },
      {
        h: "Electric two-wheelers, briefly",
        p: [
          "Electric two-wheelers remove oil, filters and the CVT belt from the schedule but keep brakes, tyres, suspension, bearings and electricals — and add battery care. Avoid deep discharge, avoid charging a very hot battery, and have connectors checked periodically.",
        ],
      },
    ],
    faqs: [
      ["How often should a scooter's CVT belt be replaced?", "Inspect at every second service and replace per the manufacturer's interval, commonly in the 18,000–24,000 km range depending on model and riding."],
      ["Does a scooter need gear oil changes?", "Yes. The final-drive gear oil is separate from engine oil and has its own replacement interval."],
      ["Are scooters worse in monsoon?", "Small wheels and lower ground clearance make standing water more of a problem, so brake and electrical checks matter more after heavy rain."],
    ],
    related: ["complete-bike-maintenance-guide", "bike-service-guide-bangalore", "common-bike-problems-and-solutions"],
    services: ["scooter-service", "motorcycle-service", "bike-service"],
  },
  {
    slug: "bike-breakdown-troubleshooting-guide",
    title: "Bike Breakdown Troubleshooting Guide | Ride N Care Bangalore",
    h1: "Bike Breakdown Troubleshooting Guide",
    description:
      "Roadside troubleshooting for bike breakdowns: what to check safely, which faults you can fix yourself, and when to call for emergency bike repair.",
    summary:
      "When a two-wheeler stops on the road, work through four checks in order — fuel, battery and switches, spark, and obvious mechanical damage. Most roadside failures are a flat battery, a fuse, a fuel-supply problem or a puncture, and only some are safe to fix yourself.",
    published: "2026-03-22",
    readMinutes: 8,
    sections: [
      {
        h: "First: get safe",
        bullets: [
          "Push the bike off the carriageway, onto the left and away from a blind bend",
          "Switch on the hazard lights if fitted, or park where you are visible",
          "Do not attempt repairs on a flyover, in a tunnel or in fast-moving traffic",
          "Note a landmark so a mechanic can find you quickly",
        ],
      },
      {
        h: "The four-step roadside check",
        table: {
          head: ["Step", "Check", "What it means"],
          rows: [
            ["1. Fuel", "Reserve position, fuel level, fuel smell", "Empty tank or a blocked supply; smell means a leak — stop"],
            ["2. Electrics", "Kill switch, side-stand, fuse, battery terminals", "Dead dashboard usually means fuse or terminal, not engine"],
            ["3. Spark", "Plug wet or dry, plug cap seated", "Wet plug means fuel but no ignition; dry means no fuel"],
            ["4. Mechanical", "Chain, wheels, brake drag, oil under engine", "Broken chain, seized brake or oil loss means do not ride"],
          ],
        },
      },
      {
        h: "Faults you can reasonably fix on the road",
        bullets: [
          "Switching to reserve fuel or refuelling from a can",
          "Reseating a loose spark-plug cap or battery terminal",
          "Replacing a blown fuse with a correctly rated spare",
          "Freeing a stuck side-stand or kill switch",
          "Using a tubeless puncture kit if you carry one and know how",
        ],
      },
      {
        h: "Faults where riding on causes damage",
        bullets: [
          "Oil visible under the engine, or a low-oil warning",
          "Brake failure or a caliper that has seized",
          "A chain that has jumped the sprocket or has a damaged link",
          "Overheating on a liquid-cooled bike with no coolant",
          "Steering or suspension damage after an impact",
        ],
        p: [
          "In these cases the correct action is transport, not a temporary fix. Riding a bike with no oil pressure for two kilometres can end an engine.",
        ],
      },
      {
        h: "What to tell the mechanic when you call",
        bullets: [
          "Bike make, model and approximate year",
          "Exactly where you are, with a landmark or shared location",
          "What happened just before it stopped — sudden cut, gradual loss, noise",
          "Whether the dashboard lights up and whether the engine cranks",
          "Whether you smell fuel or see fluid on the road",
        ],
        p: [
          "Ride N Care attends emergency bike repair and breakdown assistance calls in Bangalore from 8:00 AM to 9:00 PM on 08296950339 or 08069409289.",
        ],
      },
      {
        h: "How to reduce breakdown risk",
        bullets: [
          "Service on time and keep the air filter clean",
          "Replace a battery that has started cranking slowly, before it fails completely",
          "Check tyre pressure and tread weekly; carry a puncture kit for tubeless tyres",
          "Keep the chain clean, lubricated and correctly slacked",
          "Do not ignore new noises — they are cheaper to fix while they are still noises",
        ],
      },
    ],
    faqs: [
      ["My bike cut out suddenly at speed. What is most likely?", "A sudden cut with a dead dashboard points to electrical supply — a fuse, terminal or kill switch. If the dash stays alive, look at fuel supply and ignition."],
      ["Can I push-start a modern bike?", "Some carburetted motorcycles can be bump-started, but it is unsafe in traffic and not effective on many fuel-injected or automatic scooters. Calling for help is the better option."],
      ["Is it safe to ride a bike with a slipping clutch?", "Only gently, and only to reach a safe stopping place. Continued slipping overheats and glazes the plates and increases the repair cost."],
    ],
    related: ["common-bike-problems-and-solutions", "complete-bike-maintenance-guide", "doorstep-bike-service-guide"],
    services: ["emergency-bike-repair", "bike-breakdown-assistance", "bike-repair"],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
