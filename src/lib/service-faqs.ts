export const BIKE_FAQS: [string, string][] = [
  ["What does a doorstep bike service in Bangalore include?", "Engine oil change, oil & air filter check, brake adjustment, chain lubrication, throttle/clutch tuning, battery health, tyre pressure, headlamp alignment and a 25-point inspection — done at your home."],
  ["How long does a bike service take?", "Most bike services finish in 45–90 minutes at your doorstep in Bangalore."],
  ["Do you service Royal Enfield, KTM and superbikes?", "Yes — we service Royal Enfield, KTM, Kawasaki, Harley-Davidson and BMW Motorrad under our Premium/Sports tiers."],
  ["How often should I service my bike in Bangalore?", "Every 2,500–3,500 km for commuter bikes or every 3 months — whichever comes first — is ideal for Bangalore traffic conditions."],
  ["Are the parts genuine?", "Always. We use OEM-grade parts with a printed invoice and standard warranty."],
];

export const CAR_FAQS: [string, string][] = [
  ["What is included in a doorstep car service in Bangalore?", "Engine oil + filter change, brake check, coolant top-up, battery test, AC check, all fluid levels, lights, wipers and a multi-point inspection — completed at your home or office."],
  ["How long does a doorstep car service take?", "Periodic service takes 90–150 minutes, AC service 60–90 minutes, and a battery swap around 20 minutes."],
  ["How much does a car AC gas refill cost in Bangalore?", "Car AC service is priced after inspection because the refrigerant, leak condition and required parts vary by model. Ride N Care confirms the quote before work begins."],
  ["Do you offer pickup and drop for car service?", "Yes — free pickup and drop is included with our full car service packages within Bangalore city limits."],
  ["Are your car mechanics certified?", "All our technicians are OEM-trained, police-verified and uniformed, with 8+ years average experience."],
];

export const GENERAL_FAQS: [string, string][] = [
  ["Which Bangalore areas do you serve?", "We cover 24+ localities including Whitefield, Koramangala, HSR, Indiranagar, Marathahalli, Electronic City, Hebbal, Jayanagar, JP Nagar, Bellandur, Sarjapur Road and more."],
  ["Do you offer same-day service?", "Yes — slots booked before 4 PM are typically completed the same day across Bangalore."],
  ["Is there a warranty on the work done?", "Every job carries a 7-day workmanship guarantee. If a related issue reappears, we revisit and fix it at zero cost."],
];

export function faqsForPostCategory(category: string): [string, string][] {
  if (category === "Bike Care") return BIKE_FAQS.slice(0, 3);
  if (category === "Car Care") return CAR_FAQS.slice(0, 3);
  return GENERAL_FAQS;
}