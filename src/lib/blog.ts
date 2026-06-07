export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readMins: number;
  tags: string[];
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "bike-service-checklist-bangalore",
    title: "Bike Service Checklist Every Bangalore Rider Should Follow",
    excerpt: "From engine oil to brake pads, here's the complete checklist that keeps your two-wheeler smooth in Bangalore's stop-and-go traffic.",
    date: "2026-05-22",
    author: "Ride N Care Team",
    readMins: 5,
    tags: ["Bike", "Maintenance", "Bangalore"],
    body: [
      "Bangalore traffic is unforgiving on a motorcycle — frequent stops, hot air, and dusty roads. A regular service routine extends your bike's life and keeps fuel bills predictable.",
      "Start with engine oil. Most commuter bikes need a change every 2,500–3,500 km, while higher-CC machines stretch to 5,000 km on premium semi-synthetic oils.",
      "Next, inspect the air filter. A clogged filter eats mileage fast. Tap it clean every service and replace it every 8,000–10,000 km.",
      "Brake pads, chain slack and tyre pressure are silent killers of safety. Our doorstep mechanics check all three on every visit — no extra charge.",
      "Book a Ride N Care service and we'll come home with a printed checklist, genuine parts, and a 7-day workmanship guarantee.",
    ],
  },
  {
    slug: "car-ac-not-cooling-bangalore",
    title: "Why Your Car AC Stops Cooling in Bangalore (and How to Fix It)",
    excerpt: "Weak airflow, warm air, foul smell — three classic AC complaints, and the doorstep diagnostics that solve them in under an hour.",
    date: "2026-05-10",
    author: "Ride N Care Team",
    readMins: 6,
    tags: ["Car", "AC", "Diagnostics"],
    body: [
      "Bangalore's mild climate hides a brutal truth: most car ACs are under-serviced because we 'don't really need them'. Then summer hits and the compressor gives up.",
      "Symptom 1 — warm air. Usually low refrigerant. A 30-minute gas top-up restores cooling, but if the gas is leaking we'll find the source before refilling.",
      "Symptom 2 — weak airflow. Almost always a clogged cabin filter. Replacing it costs little but improves cooling and your lungs.",
      "Symptom 3 — foul smell. Bacterial buildup in the evaporator. A professional anti-bacterial flush eliminates it.",
      "Our mobile workshop carries the gauge set, refrigerant, filters, and cleaning chemicals — diagnostics happen at your doorstep.",
    ],
  },
  {
    slug: "doorstep-vs-garage-service",
    title: "Doorstep Service vs Traditional Garage: Which Is Better in 2026?",
    excerpt: "We break down the cost, time and quality trade-offs between visiting a garage and having a mechanic show up at your gate.",
    date: "2026-04-28",
    author: "Ride N Care Team",
    readMins: 4,
    tags: ["Guide", "Doorstep"],
    body: [
      "Traditional garages are reliable but eat half your weekend. Doorstep services trade a small premium for convenience — but only if quality matches.",
      "Our mechanics arrive with diagnostic tools, OEM parts, and a printed price list. You watch the work, sign off, and pay digitally.",
      "For complex jobs (engine rebuilds, gearbox overhauls) a garage still wins. For 90% of routine service — periodic, AC, brakes, battery — doorstep is faster and cheaper end-to-end.",
      "Try us once. If it's not better, the service is on us.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);