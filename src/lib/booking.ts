/**
 * Booking data + the ONE reusable WhatsApp booking function.
 * Used by the booking flow, the mobile number popup and Book-with-AI.
 */

import { BIKE_PACKAGES, CAR_PACKAGES, formatPrice } from "@/lib/pricing";
import { bikeCatalogBrands, bikeCatalogModels } from "@/lib/vehicle-catalog";

/** Edit this to change where every booking is sent. */
export const WHATSAPP_NUMBER = "918296950339";
export const CALL_NUMBER = "+918296950339";

export type VehicleType = "bike" | "car";
export type PowerType = "non-electric" | "electric";

export interface BikeBrand {
  name: string;
  power: PowerType;
  models: string[];
}

export const BIKE_BRANDS: BikeBrand[] = [
  { name: "Hero", power: "non-electric", models: ["Splendor Plus", "HF Deluxe", "Passion Pro", "Glamour", "Xtreme 160R", "Xpulse 200"] },
  { name: "Honda", power: "non-electric", models: ["Activa 6G", "Shine 125", "SP 125", "Unicorn", "Hornet 2.0", "Dio"] },
  { name: "TVS", power: "non-electric", models: ["Jupiter", "NTorq 125", "Apache RTR 160", "Apache RTR 200", "Raider 125", "Sport"] },
  { name: "Bajaj", power: "non-electric", models: ["Pulsar 125", "Pulsar 150", "Pulsar NS200", "Platina", "CT 100", "Avenger 220"] },
  { name: "Yamaha", power: "non-electric", models: ["FZ-S", "R15", "MT-15", "Fascino 125", "Ray ZR"] },
  { name: "Suzuki", power: "non-electric", models: ["Access 125", "Burgman Street", "Gixxer", "Gixxer SF 250"] },
  { name: "Royal Enfield", power: "non-electric", models: ["Classic 350", "Bullet 350", "Hunter 350", "Meteor 350", "Himalayan 411", "Interceptor 650"] },
  { name: "KTM", power: "non-electric", models: ["Duke 200", "Duke 250", "Duke 390", "RC 200", "RC 390", "Adventure 390"] },
  { name: "Jawa / Yezdi", power: "non-electric", models: ["Jawa 42", "Jawa Perak", "Yezdi Roadster", "Yezdi Adventure"] },
  { name: "Mahindra", power: "non-electric", models: ["Mojo 300", "Centuro", "Gusto"] },
  { name: "Kawasaki", power: "non-electric", models: ["Ninja 300", "Ninja 400", "Z650", "Vulcan S"] },
  { name: "Other", power: "non-electric", models: ["Other model"] },
  { name: "Ola Electric", power: "electric", models: ["S1 Pro", "S1 Air", "S1 X"] },
  { name: "Ather", power: "electric", models: ["450X", "450S", "Rizta"] },
  { name: "TVS", power: "electric", models: ["iQube", "iQube S", "X"] },
  { name: "Bajaj", power: "electric", models: ["Chetak 2901", "Chetak Urbane"] },
  { name: "Hero Vida", power: "electric", models: ["V1 Pro", "V1 Plus", "VX2"] },
  { name: "Ampere", power: "electric", models: ["Magnus EX", "Primus", "Zeal EX"] },
  { name: "Okinawa", power: "electric", models: ["Praise Pro", "iPraise+", "Ridge+"] },
  { name: "Revolt", power: "electric", models: ["RV400", "RV1"] },
  { name: "Other", power: "electric", models: ["Other model"] },
];

export interface CarBrand {
  name: string;
  models: string[];
}

export const CAR_BRANDS: CarBrand[] = [
  { name: "Maruti Suzuki", models: ["Swift", "Baleno", "Alto K10", "WagonR", "Dzire", "Brezza", "Ertiga"] },
  { name: "Hyundai", models: ["i10 Nios", "i20", "Venue", "Creta", "Verna", "Exter"] },
  { name: "Tata", models: ["Tiago", "Altroz", "Punch", "Nexon", "Harrier", "Safari"] },
  { name: "Mahindra", models: ["XUV300", "XUV700", "Scorpio", "Thar", "Bolero"] },
  { name: "Honda", models: ["Amaze", "City", "Jazz", "WR-V", "Elevate"] },
  { name: "Toyota", models: ["Glanza", "Innova Crysta", "Urban Cruiser", "Fortuner"] },
  { name: "Kia", models: ["Sonet", "Seltos", "Carens"] },
  { name: "Renault", models: ["Kwid", "Triber", "Kiger"] },
  { name: "Volkswagen", models: ["Polo", "Virtus", "Taigun"] },
  { name: "Skoda", models: ["Rapid", "Slavia", "Kushaq"] },
  { name: "MG", models: ["Hector", "Astor", "ZS EV"] },
  { name: "Ford", models: ["Figo", "EcoSport", "Aspire"] },
  { name: "Nissan", models: ["Magnite", "Kicks"] },
  { name: "Other", models: ["Other model"] },
];

export const CAR_FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric"];

export const PREFERRED_TIME_SLOTS = [
  "08:00 – 10:00 AM",
  "10:00 – 12:00 PM",
  "12:00 – 02:00 PM",
  "02:00 – 04:00 PM",
  "04:00 – 06:00 PM",
  "06:00 – 08:00 PM",
];

export interface Booking {
  bookingId?: string;
  vehicle?: VehicleType;
  power?: PowerType;
  brand?: string;
  model?: string;
  /** CC bucket (bike) or fuel/variant (car) */
  variant?: string;
  engineCc?: number | null;
  packageId?: string;
  packageName?: string;
  mrp?: number | null;
  price?: number | null;
  includes?: string[];
  name?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  registration?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  date?: string;
  time?: string;
  issue?: string;
  paymentMethod?: "pay_now" | "pay_later";
  paymentStatus?: "pending" | "processing" | "paid" | "failed" | "refunded";
  status?: "confirmed" | "assigned" | "technician_on_the_way" | "service_started" | "service_completed" | "cancelled";
  source?: "normal" | "ai";
}

/** 10-digit Indian mobile, optionally with +91 / 0 prefix. */
export function normalizeIndianMobile(input: string): string | null {
  const digits = (input || "").replace(/\D/g, "");
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  if (ten.length !== 10) return null;
  if (!/^[6-9]\d{9}$/.test(ten)) return null;
  return ten;
}

export function isValidIndianMobile(input: string): boolean {
  return normalizeIndianMobile(input) !== null;
}

export function getBikePackage(id?: string) {
  return BIKE_PACKAGES.find((p) => p.id === id);
}

export function getCarPackage(id?: string) {
  return CAR_PACKAGES.find((p) => p.id === id);
}

export function bikeBrands(power: PowerType) {
  return bikeCatalogBrands(power).map((brand) => ({ name: brand.name, power: brand.power, models: brand.models.map((model) => model.name) }));
}

export function bikeModels(power: PowerType, brand: string) {
  return bikeCatalogModels(power, brand).map((model) => model.name);
}

export function carModels(brand: string) {
  return CAR_BRANDS.find((b) => b.name === brand)?.models ?? [];
}

/** Builds the WhatsApp message containing every available booking detail. */
export function buildBookingMessage(b: Booking): string {
  const lines: (string | false | undefined)[] = [
    "*New Booking — Ride N Care*",
    "Care in every mile",
    "",
    b.bookingId && `Booking ID: ${b.bookingId}`,
    b.vehicle && `Vehicle Type: ${b.vehicle === "bike" ? "Bike" : "Car"}`,
    b.power && `Power: ${b.power === "electric" ? "Electric" : "Non-Electric"}`,
    b.brand && `Brand: ${b.brand}`,
    b.model && `Model: ${b.model}`,
    b.vehicle === "bike" && b.engineCc ? `CC: ${b.engineCc}cc` : b.variant && `${b.vehicle === "car" ? "Variant / Fuel" : "CC Category"}: ${b.variant}`,
    b.packageName && `Package: ${b.packageName}`,
    b.mrp ? `MRP: ${formatPrice(b.mrp)}` : false,
    b.price !== undefined && `Offer Price: ${formatPrice(b.price ?? null)}`,
    "",
    b.name && `Name: ${b.name}`,
    b.mobile && `Mobile: ${b.mobile}`,
    b.whatsapp && `WhatsApp: ${b.whatsapp}`,
    b.email && `Email: ${b.email}`,
    b.registration && `Registration No: ${b.registration}`,
    b.address && `Address / Location: ${b.address}`,
    b.date && `Preferred Date: ${b.date}`,
    b.time && `Preferred Time: ${b.time}`,
    b.paymentMethod && `Payment: ${b.paymentMethod === "pay_now" ? "Pay Now" : "Pay Later"}`,
    b.paymentStatus && `Payment Status: ${b.paymentStatus.replaceAll("_", " ")}`,
    b.status && `Booking Status: ${b.status.replaceAll("_", " ")}`,
    b.issue && `Additional Issue: ${b.issue}`,
    b.includes?.length ? `\nIncludes:\n${b.includes.map((i) => `• ${i}`).join("\n")}` : false,
  ];
  return lines.filter((l): l is string => typeof l === "string").join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function whatsappBookingUrl(b: Booking): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBookingMessage(b))}`;
}

/** THE reusable send function — every booking surface calls this. */
export function sendBookingToWhatsApp(b: Booking): boolean {
  const url = whatsappBookingUrl(b);
  if (typeof window === "undefined") return false;
  const win = window.open(url, "_blank", "noopener");
  if (!win) {
    window.location.href = url;
  }
  return true;
}

export async function copyBookingDetails(b: Booking): Promise<boolean> {
  const text = buildBookingMessage(b);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
