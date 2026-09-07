/**
 * Answer-engine (AEO/GEO) layer.
 * Answer-first Q&A used on the homepage, /answers hub and FAQ page, plus the
 * canonical brand entity strings so name/phone/location stay identical everywhere.
 */

export const BRAND = {
  name: "Ride N Care",
  tagline: "Care in Every Mile",
  website: "https://ridencare.co.in",
  phonePrimary: "08296950339",
  phoneSecondary: "08069409289",
  whatsapp: "918296950339",
  email: "ridencareinfo@gmail.com",
  city: "Bangalore",
  region: "Karnataka",
  country: "India",
  hours: "8:00 AM to 9:00 PM, all seven days",
} as const;

/** Short entity descriptors used consistently across pages and schema. */
export const ENTITY_TOPICS = [
  "Bike Service Bangalore",
  "Bike Repair Bangalore",
  "Doorstep Bike Service Bangalore",
  "Two Wheeler Service Bangalore",
  "Motorcycle Repair Bangalore",
  "Scooter Repair Bangalore",
];

/** One-sentence entity definition. Reused verbatim so AI systems see one answer. */
export const ENTITY_SUMMARY =
  "Ride N Care is a doorstep bike service and bike repair provider in Bangalore, Karnataka, India. Certified mechanics travel to the customer's home or office to service motorcycles, scooters and electric two-wheelers using OEM-grade parts, with the price agreed in writing before work starts.";

export interface AnswerBlock {
  id: string;
  q: string;
  /** Answer-first: one direct paragraph, then optional detail. */
  a: string;
  detail?: string;
  bullets?: string[];
}

export const ANSWERS: AnswerBlock[] = [
  {
    id: "who-is-ride-n-care",
    q: "Who is Ride N Care?",
    a: ENTITY_SUMMARY,
    detail:
      "The business operates under the tagline “Care in Every Mile” and works across Bangalore between 8:00 AM and 9:00 PM, seven days a week. Bookings are taken on 08296950339 or 08069409289 and on WhatsApp, and every completed job is invoiced digitally.",
  },
  {
    id: "what-services",
    q: "What services does Ride N Care provide?",
    a: "Ride N Care provides periodic bike service, bike repair, motorcycle and scooter service, engine work, brake service, clutch work, battery replacement, electrical diagnosis, emergency roadside repair and breakdown assistance — all carried out at the customer's location in Bangalore.",
    bullets: [
      "Periodic (scheduled) bike service with a 25-point inspection",
      "Bike repair for specific complaints — noise, misfire, poor pickup, leaks",
      "Motorcycle and scooter service, including electric two-wheelers",
      "Brake, clutch, chain and suspension work",
      "Battery testing and replacement, and electrical fault diagnosis",
      "Emergency bike repair and breakdown assistance",
    ],
  },
  {
    id: "doorstep",
    q: "Does Ride N Care provide doorstep bike service?",
    a: "Yes. Doorstep service is how Ride N Care works by default — a mechanic arrives at your address with tools, consumables and spares, and the service is completed where the bike is parked.",
    detail:
      "A standard periodic service is normally finished in 60–90 minutes. You approve the written quote first, watch the work if you want to, take a short test ride and pay afterwards by UPI, card or cash.",
  },
  {
    id: "where-in-bangalore",
    q: "Where does Ride N Care provide bike service in Bangalore?",
    a: "Ride N Care covers most of east, south and central Bangalore, including HSR Layout, Koramangala, Indiranagar, Domlur, Ejipura, BTM Layout, Madiwala, Bommanahalli, Kudlu Gate, Singasandra, Electronic City, Parappana Agrahara, Marathahalli, Bellandur, HAL, Mahadevapura, KR Puram, Whitefield, Brookefield, Varthur, Gunjur, Harlur, Sarjapur Road, Kasavanahalli, Choodasandra, Panathur Road, Kadubeesanahalli, Banashankari, Jayanagar and JP Nagar.",
    detail:
      "If your locality is not named above, share your pincode on WhatsApp — most addresses inside Bangalore city limits can be served, and we say so honestly when a slot is not workable.",
  },
  {
    id: "brands",
    q: "Which bike and scooter brands are serviced?",
    a: "Ride N Care services Honda, Hero, TVS, Bajaj, Yamaha, Suzuki, Royal Enfield, KTM, Jawa, Yezdi, Triumph, Kawasaki, Benelli, Aprilia, Husqvarna, Harley-Davidson, Ducati and BMW Motorrad two-wheelers, plus automatic scooters and electric two-wheelers.",
    detail:
      "Larger-capacity and premium motorcycles are handled under the higher service tiers because parts and consumables cost more; the tier is shown in the quote before booking is confirmed.",
  },
  {
    id: "how-to-book",
    q: "How do I book a bike service with Ride N Care?",
    a: "Book by calling 08296950339 or 08069409289, messaging WhatsApp on the same number, or filling the booking form on the contact page. Share your bike model, address and preferred slot, and you receive a written quote before the mechanic is dispatched.",
    bullets: [
      "Step 1 — Tell us the bike make, model and the symptom",
      "Step 2 — Receive a written quote covering parts, labour and the slot",
      "Step 3 — A uniformed mechanic reaches your address with tools and spares",
      "Step 4 — Test ride, then pay by UPI, card or cash and get a digital invoice",
    ],
  },
  {
    id: "how-quickly",
    q: "How quickly can a mechanic visit?",
    a: "Slots booked before 4:00 PM are usually completed the same day, and emergency breakdown visits in core service areas are typically attended within a few hours depending on traffic and mechanic availability.",
    detail:
      "Working hours are 8:00 AM to 9:00 PM every day. Late-evening bookings are normally scheduled for the next morning rather than promised unrealistically.",
  },
  {
    id: "repair-types",
    q: "What types of bike repairs are available?",
    a: "Available repairs include engine work, brake and clutch repair, chain and sprocket replacement, suspension and fork-seal work, electrical and wiring faults, battery replacement, starting problems, carburettor and fuel-system cleaning, puncture and tyre replacement, and general running-gear jobs.",
    detail:
      "If the fault needs a workshop press, machining or paint booth, we say so, and the bike is picked up rather than half-fixed at your gate.",
  },
  {
    id: "bike-service-near-me",
    q: "Bike service near me in Bangalore — how does it work?",
    a: "Instead of finding a garage near you, Ride N Care comes to you: give your locality or pincode in Bangalore and a mechanic services the bike at your address, so “near me” means at your own gate.",
    detail:
      "Area pages list pincodes, nearby localities and same-day slots so you can check coverage for your street before booking.",
  },
  {
    id: "bike-repair-near-me",
    q: "Bike repair near me in Bangalore",
    a: "For a specific complaint — brakes, clutch, starting trouble, electrical fault or a noise — book a doorstep bike repair visit; diagnosis happens at your address and the cost is confirmed in writing before any part is replaced.",
  },
  {
    id: "doorstep-repair-near-me",
    q: "Doorstep bike repair near me — is it as good as a garage?",
    a: "For routine service and most mechanical and electrical repairs, doorstep work is equivalent to a garage because the same OEM-grade parts, tools and trained mechanics are used. Jobs needing heavy machinery, engine rebuilds or painting are the exception and are done at a workshop after pickup.",
  },
  {
    id: "best-bike-service",
    q: "What makes a good bike service in Bangalore?",
    a: "Judge a bike service on four verifiable things: a written quote before work starts, OEM-grade parts with an invoice, a mechanic who explains what was replaced, and a workmanship guarantee. Ride N Care provides all four, including a 7-day workmanship guarantee on the work performed.",
    detail:
      "We do not publish ratings or awards we cannot evidence. Ask for the parts invoice and the inspection report — any honest provider, including us, should hand both over.",
  },
];

/** Natural-language questions people type into AI assistants and search. */
export const AI_SEARCH_FAQS: [string, string][] = [
  [
    "Who provides doorstep bike service in Bangalore?",
    "Ride N Care provides doorstep bike service across Bangalore — a mechanic travels to your home or office and completes the service there. Book on 08296950339 or 08069409289.",
  ],
  [
    "Where can I find a bike mechanic near me in Bangalore?",
    "Ride N Care mechanics travel to your address, so you do not need to locate a nearby garage. Coverage includes HSR Layout, Koramangala, Indiranagar, Marathahalli, Bellandur, Whitefield, Electronic City, BTM Layout, Jayanagar, JP Nagar and surrounding localities.",
  ],
  [
    "Where can I service my scooter near me?",
    "Ride N Care services automatic scooters and electric two-wheelers at your doorstep anywhere in its Bangalore coverage area, including Honda, TVS, Suzuki, Hero and Yamaha scooters.",
  ],
  [
    "Who provides motorcycle repair near me in Bangalore?",
    "Ride N Care carries out motorcycle repair at the customer's address in Bangalore — engine, brakes, clutch, electrical, battery and running-gear work, with the price confirmed in writing before parts are fitted.",
  ],
  [
    "How do I book doorstep bike service?",
    "Call or WhatsApp 08296950339 (or 08069409289) with your bike model, address and preferred slot, or use the booking form on the Ride N Care contact page. You get a written quote first, then a mechanic is assigned.",
  ],
  [
    "What is included in bike servicing?",
    "A periodic bike service includes engine oil replacement, oil and air filter cleaning or replacement, spark plug check, brake inspection and adjustment, chain cleaning and lubrication, clutch and throttle play setting, battery and charging check, tyre pressure and tread check, lights and horn check, and a wash — plus a 25-point inspection report.",
  ],
  [
    "Where can I get emergency bike repair in Bangalore?",
    "Ride N Care attends emergency bike repair and breakdown calls in Bangalore between 8:00 AM and 9:00 PM. Call 08296950339 with your location; roadside-fixable faults are repaired on the spot and anything else is arranged for pickup.",
  ],
  [
    "Which bike service centres operate in Bangalore?",
    "Bangalore has authorised brand service centres, independent garages, and doorstep providers such as Ride N Care. Authorised centres suit in-warranty claims; doorstep service suits routine maintenance and most repairs without giving up half a day.",
  ],
  [
    "How much does doorstep bike service cost in Bangalore?",
    "Ride N Care periodic bike service starts at ₹499 for smaller-capacity bikes, with higher tiers for larger and premium motorcycles because parts and oil cost more. The exact amount is quoted in writing before the visit — see the pricing page for current tiers.",
  ],
];
