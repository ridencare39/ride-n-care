export interface BikeTier { name: string; cc: string; price: number }
export interface CarTier { name: string; desc: string; price: number }

export const bikeTiers: BikeTier[] = [
  { name: "Regular", cc: "Below 125 CC", price: 499 },
  { name: "Classic", cc: "125 – 199 CC", price: 799 },
  { name: "Premium", cc: "200 – 299 CC", price: 1199 },
  { name: "Royal", cc: "300 – 349 CC", price: 1399 },
  { name: "Sports", cc: "Above 350 CC", price: 1899 },
];

export const carTiers: CarTier[] = [
  { name: "Mini Service", desc: "Oil change + multipoint check", price: 1499 },
  { name: "Standard", desc: "Mini + AC + brake clean", price: 2999 },
  { name: "Comprehensive", desc: "Full service + diagnostics", price: 4999 },
];
