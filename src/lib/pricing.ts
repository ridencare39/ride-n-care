/**
 * SINGLE SOURCE OF TRUTH for Ride N Care service pricing.
 * Prices are the published Ride N Care rates (ridencare.in).
 * Package cards, booking flow, checkout, summary, AI booking and the
 * WhatsApp message all read from here.
 */

export interface BikeTier { name: string; cc: string; price: number }
export interface CarTier { name: string; desc: string; price: number | null }

export interface BikePackage {
  id: string;
  /** Card title, e.g. "At-Home Regular Service" */
  name: string;
  /** Short tier label used in nav/cards */
  tier: string;
  cc: string;
  ccMin: number;
  ccMax: number;
  mrp: number;
  price: number;
  duration: string;
  includes: string[];
}

const REGULAR_INCLUDES = [
  "Basic Fork Inspection",
  "Basic Hand Cleaning",
  "Basic Engine Inspection",
  "Minor Electrical Check-up",
  "Battery General Check-up",
  "Driven Chain Basic Cleaning",
  "Carburettor Basic Check-up",
  "Brakes – Front & Rear Adjust",
  "Tightening of Screws, Bolts & Nuts",
  "Average and Performance Check-up",
  "Tyre Air Fill (only tubeless)",
  "Engine oil topup (Price Extra)",
  "Oil Filter Clean (if Replace Charges)",
  "Air Filter Clean (if Replace Charges)",
  "Spark Plug Clean (if Replace Charges)",
  "Free Pick and Drop (if needed)",
];

const CLASSIC_INCLUDES = [
  "Coolant Check-up",
  "Basic Hand Cleaning",
  "Oiling and Greasing",
  "Battery General Check-up",
  "Basic Engine Inspection",
  "Basic Fork Inspection",
  "Carburettor Basic Check-up",
  "Minor Electrical Check-up",
  "Brakes – Front & Rear Adjust",
  "Driven Chain Basic Cleaning",
  "Tightening of Screws, Bolts & Nuts",
  "Average and Performance Check-up",
  "Engine oil topup (Price Extra)",
  "Oil Filter Clean (if Replace Charges)",
  "Air Filter Clean (if Replace Charges)",
  "Spark Plug Clean (if Replace Charges)",
  "Tyre Air Fill (only tubeless)",
  "Free Pick and Drop (if needed)",
];

const PREMIUM_INCLUDES = [
  "Coolant Check-up",
  "Injector Check-up",
  "Basic Hand Cleaning",
  "Oiling and Greasing",
  "Battery General Check-up",
  "Basic Engine Inspection",
  "Fuel Pump Motor Check-up",
  "Basic Fork Inspection",
  "Brakes – Front & Rear Adjust",
  "Driven Chain Basic Cleaning",
  "Carburettor Basic Check-up",
  "Minor Electrical Check-up",
  "Tightening of Screws, Bolts & Nuts",
  "Average and Performance Check-up",
  "Tyre Air Fill (only tubeless)",
  "Engine oil topup (Price Extra)",
  "Oil Filter Clean (if Replace Charges)",
  "Air Filter Clean (if Replace Charges)",
  "Spark Plug Clean (if Replace Charges)",
  "Free Pick and Drop (if needed)",
];

const ROYAL_INCLUDES = [
  "Injector Check-up",
  "Coolant Check-up",
  "Basic Fork Inspection",
  "Basic Hand Cleaning",
  "Oiling and Greasing",
  "Minor Electrical Check-up",
  "Battery General Check-up",
  "Basic Engine Inspection",
  "Fuel Pump Motor Check-up",
  "Driven Chain Basic Cleaning",
  "Carburettor Basic Check-up",
  "Average and Performance Check-up",
  "Brakes – Front & Rear Adjust",
  "Tightening of Screws, Bolts & Nuts",
  "Tyre Air Fill (only tubeless)",
  "Engine oil topup (Price Extra)",
  "Oil Filter Clean (if Replace Charges)",
  "Air Filter Clean (if Replace Charges)",
  "Spark Plug Clean (if Replace Charges)",
  "Free Pick and Drop (if needed)",
];

const SPORTS_INCLUDES = [
  "Injector Check-up",
  "Coolant Check-up",
  "Basic Hand Cleaning",
  "Oiling and Greasing",
  "Basic Engine Inspection",
  "Fuel Pump Motor Check-up",
  "Basic Fork Inspection",
  "Minor Electrical Check-up",
  "Battery General Check-up",
  "Driven Chain Basic Cleaning",
  "Carburettor Basic Check-up",
  "Brakes – Front & Rear Adjust",
  "Tightening of Screws, Bolts & Nuts",
  "Average and Performance Check-up",
  "Tyre Air Fill (only tubeless)",
  "Engine oil topup (Price Extra)",
  "Oil Filter Clean (if Replace Charges)",
  "Air Filter Clean (if Replace Charges)",
  "Spark Plug Clean (if Replace Charges)",
  "Free Pick and Drop (if needed)",
];

export const BIKE_PACKAGES: BikePackage[] = [
  {
    id: "regular",
    name: "At-Home Regular Service",
    tier: "Regular",
    cc: "Below 125 CC",
    ccMin: 0,
    ccMax: 124,
    mrp: 899,
    price: 499,
    duration: "60–90 mins",
    includes: REGULAR_INCLUDES,
  },
  {
    id: "classic",
    name: "At-Home Classic Service",
    tier: "Classic",
    cc: "125 – 199 CC",
    ccMin: 125,
    ccMax: 199,
    mrp: 999,
    price: 799,
    duration: "60–90 mins",
    includes: CLASSIC_INCLUDES,
  },
  {
    id: "premium",
    name: "At-Home Premium Service",
    tier: "Premium",
    cc: "200 – 299 CC",
    ccMin: 200,
    ccMax: 299,
    mrp: 1899,
    price: 1199,
    duration: "90–120 mins",
    includes: PREMIUM_INCLUDES,
  },
  {
    id: "royal",
    name: "At-Home Royal Service",
    tier: "Royal",
    cc: "300 – 349 CC",
    ccMin: 300,
    ccMax: 349,
    mrp: 1699,
    price: 1399,
    duration: "90–120 mins",
    includes: ROYAL_INCLUDES,
  },
  {
    id: "sports",
    name: "At-Home Sports Service",
    tier: "Sports",
    cc: "Above 350 CC",
    ccMin: 350,
    ccMax: 2000,
    mrp: 2199,
    price: 1899,
    duration: "2 hrs",
    includes: SPORTS_INCLUDES,
  },
];

/** CC buckets shown in the booking flow — mapped 1:1 to a package. */
export const BIKE_CC_OPTIONS = BIKE_PACKAGES.map((p) => ({ label: p.cc, packageId: p.id }));

export const bikeTiers: BikeTier[] = BIKE_PACKAGES.map((p) => ({
  name: p.tier,
  cc: p.cc,
  price: p.price,
}));

export const carTiers: CarTier[] = [
  { name: "Mini Service", desc: "Oil change + multipoint check", price: null },
  { name: "Standard", desc: "Mini + AC + brake clean", price: null },
  { name: "Comprehensive", desc: "Full service + diagnostics", price: null },
];

export interface CarPackage {
  id: string;
  name: string;
  desc: string;
  /** null => "Price on Request" (no verified published price) */
  price: number | null;
  mrp?: number | null;
  duration: string;
  includes: string[];
}

export const CAR_PACKAGES: CarPackage[] = [
  {
    id: "mini",
    name: "Mini Service",
    desc: "Oil change + multipoint check",
    price: null,
    mrp: null,
    duration: "3–4 hrs",
    includes: [
      "Engine Oil Change",
      "Oil Filter Clean (if Replace Charges)",
      "Air Filter Clean (if Replace Charges)",
      "Battery General Check-up",
      "Brakes – Front & Rear Check",
      "Coolant Check-up",
      "Multipoint Inspection",
      "Free Pick and Drop (if needed)",
    ],
  },
  {
    id: "standard",
    name: "Standard Service",
    desc: "Mini + AC + brake clean",
    price: null,
    mrp: null,
    duration: "4–5 hrs",
    includes: [
      "Everything in Mini Service",
      "AC Cooling Check-up",
      "Brake Cleaning – Front & Rear",
      "Wheel Nut Torque Check",
      "Suspension Basic Inspection",
      "Interior Vacuum & Dry Wash",
      "Free Pick and Drop (if needed)",
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Service",
    desc: "Full service + diagnostics",
    price: null,
    mrp: null,
    duration: "5–6 hrs",
    includes: [
      "Everything in Standard Service",
      "Computerised Diagnostics Scan",
      "Spark Plug Clean (if Replace Charges)",
      "Fuel System Check-up",
      "Throttle Body Cleaning",
      "Under-body Inspection",
      "Free Pick and Drop (if needed)",
    ],
  },
  {
    id: "ac-service",
    name: "AC Service",
    desc: "Gas refill & cooling diagnostics",
    price: null,
    duration: "2–3 hrs",
    includes: ["AC Gas Level Check", "Cooling Coil Cleaning", "Cabin Filter Check", "Compressor Check-up"],
  },
  {
    id: "denting-painting",
    name: "Denting & Painting",
    desc: "Panel-wise, pick-up and drop",
    price: null,
    duration: "Depends on panels",
    includes: ["Panel Inspection", "Dent Removal", "Paint Match & Finish", "Free Pick and Drop (if needed)"],
  },
];

export function formatPrice(value: number | null): string {
  return value === null ? "Price on Request" : `₹${value.toLocaleString("en-IN")}`;
}
