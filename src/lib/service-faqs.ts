export const BIKE_FAQS: [string, string][] = [
  ["What does a doorstep bike service in Bangalore include?", "Engine oil change, oil & air filter check, brake adjustment, chain lubrication, throttle/clutch tuning, battery health, tyre pressure, headlamp alignment and a 25-point inspection — done at your home."],
  ["How long does a bike service take?", "Most bike services finish in 60–90 minutes at your doorstep in Bangalore."],
  ["Do you service Royal Enfield, KTM and superbikes?", "Yes — Royal Enfield, KTM, Kawasaki, Harley-Davidson and BMW Motorrad are all routine work, with mechanics assigned by engine class."],
  ["How often should I service my bike in Bangalore?", "Every 2,500–3,500 km for commuter bikes or every 3 months — whichever comes first — is ideal for Bangalore traffic conditions."],
  ["Are the parts genuine?", "Always. We use OEM-grade parts, listed with part numbers on the digital invoice."],
];

export const CAR_FAQS: [string, string][] = [
  ["What is included in a doorstep car service in Bangalore?", "Engine oil + filter change, brake check, coolant top-up, battery test, AC check, all fluid levels, lights, wipers and a multi-point inspection — completed at your home or office."],
  ["How long does a doorstep car service take?", "The arrival window is confirmed at booking, and the visit runs until the checklist is complete and you have inspected the work."],
  ["How much does a car AC gas refill cost in Bangalore?", "Car AC service is priced after inspection because the refrigerant, leak condition and required parts vary by model. Ride N Care confirms the quote before work begins."],
  ["Do you offer pickup and drop for car service?", "Pickup and drop is arranged when a job genuinely needs the workshop — such as an engine overhaul or wheel alignment — with the estimate approved before the car moves."],
  ["Are your car mechanics certified?", "All our technicians are background-verified, and every job runs on a written quote approved before work starts."],
];

export const GENERAL_FAQS: [string, string][] = [
  ["Which Bangalore areas do you serve?", "We cover confirmed localities across Bangalore including Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Electronic City, Jayanagar, JP Nagar, Bellandur and Sarjapur Road — the full list is on our service areas page."],
  ["How quickly can I get a slot?", "Availability varies by day and locality. Call 080 6940 9289 or WhatsApp 82969 50339 and we confirm the earliest open slot for your area before you commit."],
  ["Is there a warranty on the work done?", "Every job carries a 7-day workmanship guarantee. If a related issue reappears, we revisit and fix it at zero cost."],
];

export function faqsForPostCategory(category: string): [string, string][] {
  if (category === "Bike Care") return BIKE_FAQS.slice(0, 3);
  if (category === "Car Care") return CAR_FAQS.slice(0, 3);
  return GENERAL_FAQS;
}