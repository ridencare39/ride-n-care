/** One source of truth for every Ride N Care package, price and inclusion. */
export interface BikeTier { name: string; cc: string; price: number }
export interface CarTier { name: string; desc: string; price: number | null }

export type BikeServiceId = "general-service" | "general-service-engine-oil" | "jump-start" | "running-repair";
export interface BikeCcTier { id: string; label: string; minCc: number; maxCc: number | null }
export interface BikePackage {
  id: string;
  serviceId: BikeServiceId;
  name: string;
  tier: string;
  cc: string;
  ccMin: number;
  ccMax: number | null;
  mrp: number | null;
  price: number;
  duration: string;
  includes: string[];
}

export const GENERAL_SERVICE_INCLUDES = [
  "Air Filter Cleaning",
  "Battery Voltage Check",
  "Brakes Service",
  "Cables & Levers Adjustment",
  "Chain Tension Check",
  "Clutch Adjustment",
  "Dry Wash",
  "Electrical Check-up",
  "Engine Oil Check",
  "Greasing & Lubrication",
  "Oil Leakage Check",
  "Spark Plug Cleaning",
];

export const GENERAL_SERVICE_OIL_INCLUDES = [
  ...GENERAL_SERVICE_INCLUDES,
  "Engine Oil Replacement",
];

export const JUMP_START_INCLUDES = [
  "Battery Condition Check",
  "Battery Voltage Check",
  "Safe Jump Start",
  "Charging System Basic Check",
];

export const RUNNING_REPAIR_INCLUDES = [
  "Initial Fault Inspection",
  "Minor Running Repair Labour",
  "Safety Check After Repair",
  "Additional parts charged only after approval",
];

export const BIKE_CC_TIERS: BikeCcTier[] = [
  { id: "upto-199", label: "Up to 199cc", minCc: 1, maxCc: 199 },
  { id: "200-249", label: "200–249cc", minCc: 200, maxCc: 249 },
  { id: "250-400", label: "250–400cc", minCc: 250, maxCc: 400 },
  { id: "401-500", label: "401–500cc", minCc: 401, maxCc: 500 },
  { id: "501-800", label: "501–800cc", minCc: 501, maxCc: 800 },
  { id: "801-plus", label: "801cc and above", minCc: 801, maxCc: null },
];

const PRICE_MATRIX: Record<string, Record<BikeServiceId, number>> = {
  "upto-199": { "general-service": 799, "general-service-engine-oil": 1249, "jump-start": 399, "running-repair": 450 },
  "200-249": { "general-service": 899, "general-service-engine-oil": 1549, "jump-start": 399, "running-repair": 450 },
  "250-400": { "general-service": 1199, "general-service-engine-oil": 2449, "jump-start": 399, "running-repair": 450 },
  "401-500": { "general-service": 1399, "general-service-engine-oil": 3849, "jump-start": 399, "running-repair": 450 },
  "501-800": { "general-service": 1899, "general-service-engine-oil": 4149, "jump-start": 399, "running-repair": 450 },
  "801-plus": { "general-service": 2499, "general-service-engine-oil": 5449, "jump-start": 399, "running-repair": 450 },
};

export const BIKE_SERVICES: Array<{ id: BikeServiceId; name: string; duration: string; includes: string[] }> = [
  { id: "general-service", name: "General Service", duration: "60–90 mins", includes: GENERAL_SERVICE_INCLUDES },
  { id: "general-service-engine-oil", name: "General Service + Engine Oil", duration: "75–120 mins", includes: GENERAL_SERVICE_OIL_INCLUDES },
  { id: "jump-start", name: "Jump Start", duration: "20–40 mins", includes: JUMP_START_INCLUDES },
  { id: "running-repair", name: "Running Repair", duration: "Depends on inspection", includes: RUNNING_REPAIR_INCLUDES },
];

export const BIKE_PACKAGES: BikePackage[] = BIKE_CC_TIERS.flatMap((tier) =>
  BIKE_SERVICES.map((service) => ({
    id: `${tier.id}-${service.id}`,
    serviceId: service.id,
    name: service.name,
    tier: tier.label,
    cc: tier.label,
    ccMin: tier.minCc,
    ccMax: tier.maxCc,
    mrp: null,
    price: PRICE_MATRIX[tier.id]?.[service.id] ?? 0,
    duration: service.duration,
    includes: service.includes,
  })),
);

export function getBikeCcTier(cc: number): BikeCcTier | undefined {
  if (!Number.isFinite(cc) || cc < 1) return undefined;
  return BIKE_CC_TIERS.find((tier) => cc >= tier.minCc && (tier.maxCc === null || cc <= tier.maxCc));
}

export function getBikePackagesForCc(cc: number): BikePackage[] {
  const tier = getBikeCcTier(cc);
  return tier ? BIKE_PACKAGES.filter((item) => item.tier === tier.label) : [];
}

export function getBikePackage(packageId?: string): BikePackage | undefined {
  return BIKE_PACKAGES.find((item) => item.id === packageId);
}

export function getBikePackageForServiceCc(serviceId: BikeServiceId, cc: number): BikePackage | undefined {
  return getBikePackagesForCc(cc).find((item) => item.serviceId === serviceId);
}

export function getBikeServiceStartingPrice(serviceId: BikeServiceId): number {
  return Math.min(...BIKE_PACKAGES.filter((item) => item.serviceId === serviceId).map((item) => item.price));
}

export const BIKE_CC_OPTIONS = BIKE_CC_TIERS.map((tier) => ({ label: tier.label, packageId: tier.id }));
export const bikeTiers: BikeTier[] = BIKE_CC_TIERS.map((tier) => ({
  name: tier.label,
  cc: tier.label,
  price: PRICE_MATRIX[tier.id]?.["general-service"] ?? 0,
}));

export const carTiers: CarTier[] = [
  { name: "Mini Service", desc: "Oil change + multipoint check", price: null },
  { name: "Standard", desc: "Mini + AC + brake clean", price: null },
  { name: "Comprehensive", desc: "Full service + diagnostics", price: null },
];

export interface CarPackage {
  id: string; name: string; desc: string; price: number | null; mrp?: number | null; duration: string; includes: string[];
}

export const CAR_PACKAGES: CarPackage[] = [
  { id: "mini", name: "Mini Service", desc: "Oil change + multipoint check", price: null, mrp: null, duration: "3–4 hrs", includes: ["Engine Oil Change", "Oil Filter Clean (if replacement is needed, charges apply)", "Air Filter Clean (if replacement is needed, charges apply)", "Battery General Check-up", "Brakes – Front & Rear Check", "Coolant Check-up", "Multipoint Inspection", "Free Pick and Drop (if needed)"] },
  { id: "standard", name: "Standard Service", desc: "Mini + AC + brake clean", price: null, mrp: null, duration: "4–5 hrs", includes: ["Everything in Mini Service", "AC Cooling Check-up", "Brake Cleaning – Front & Rear", "Wheel Nut Torque Check", "Suspension Basic Inspection", "Interior Vacuum & Dry Wash", "Free Pick and Drop (if needed)"] },
  { id: "comprehensive", name: "Comprehensive Service", desc: "Full service + diagnostics", price: null, mrp: null, duration: "5–6 hrs", includes: ["Everything in Standard Service", "Computerised Diagnostics Scan", "Spark Plug Clean (if replacement is needed, charges apply)", "Fuel System Check-up", "Throttle Body Cleaning", "Under-body Inspection", "Free Pick and Drop (if needed)"] },
  { id: "ac-service", name: "AC Service", desc: "Gas refill & cooling diagnostics", price: null, duration: "2–3 hrs", includes: ["AC Gas Level Check", "Cooling Coil Cleaning", "Cabin Filter Check", "Compressor Check-up"] },
  { id: "denting-painting", name: "Denting & Painting", desc: "Panel-wise, pick-up and drop", price: null, duration: "Depends on panels", includes: ["Panel Inspection", "Dent Removal", "Paint Match & Finish", "Free Pick and Drop (if needed)"] },
];

export const ELECTRIC_BIKE_PACKAGES: CarPackage[] = [
  { id: "electric-general-service", name: "Electric Bike General Service", desc: "Inspection and preventive maintenance", price: null, duration: "60–90 mins", includes: ["Battery Health Check", "Charging Port Inspection", "Brake Inspection & Adjustment", "Tyre & Wheel Check", "Electrical Check-up", "Controls & Lights Check", "Dry Wash", "Diagnostic Review"] },
  { id: "electric-running-repair", name: "Electric Bike Running Repair", desc: "Diagnosis and minor repair", price: null, duration: "Depends on inspection", includes: ["Initial Fault Inspection", "Electrical Diagnostic Check", "Minor Running Repair Labour", "Safety Check After Repair", "Additional parts charged only after approval"] },
];

export function getServicePackage(packageId?: string): BikePackage | CarPackage | undefined {
  return getBikePackage(packageId) ?? ELECTRIC_BIKE_PACKAGES.find((item) => item.id === packageId) ?? CAR_PACKAGES.find((item) => item.id === packageId);
}

export function formatPrice(value: number | null): string {
  return value === null ? "Price on Request" : `₹${value.toLocaleString("en-IN")}`;
}
