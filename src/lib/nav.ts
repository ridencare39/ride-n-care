/**
 * One shared navigation data file — drives the desktop top bar, the
 * "Our Services" dropdown menu and the slide-in side panel.
 *
 * Rules:
 * - Only routes that exist. Services come from src/lib/services.ts and
 *   src/lib/car-services.ts (never hard-coded lists).
 * - The side panel keeps: two service boxes, then Home, Process,
 *   Areas We Serve, Blog, Franchise, FAQ, Contact, About Us.
 */

import {
  BatteryCharging,
  CircleHelp,
  Disc3,
  DoorOpen,
  Droplets,
  Gauge,
  Hammer,
  House,
  Info,
  LifeBuoy,
  Lightbulb,
  Mail,
  MapPin,
  Newspaper,
  Route as RouteIcon,
  SearchCheck,
  Snowflake,
  Sparkles,
  Store,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
// Slim summaries only — the full service content must stay out of the global
// chrome bundle (see scripts/gen-data-summaries.mjs).
import { CAR_SERVICE_SUMMARY, SERVICE_SUMMARY } from "@/lib/service-summary";

export interface NavRow {
  to: string;
  params?: Record<string, string>;
  label: string;
  icon: LucideIcon;
}

/* ── Desktop top bar — exact order from the brief ──────────────────────────── */
export const TOP_NAV: { to: string; label: string; anchor?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/#services", label: "Our Services" },
  { to: "/#process", label: "Process" },
  { to: "/franchise", label: "Franchise" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About Us" },
];

/* ── Services dropdown — built from the data files, only live routes ───────── */

const BIKE_ORDER = [
  "bike-service",
  "doorstep-bike-service",
  "bike-repair",
  "doorstep-bike-repair",
  "scooter-service",
  "engine-repair",
  "battery-service",
  "emergency-bike-repair",
  "bike-breakdown-assistance",
  "periodic-bike-service",
] as const;
const BIKE_ICONS: Record<string, LucideIcon> = {
  "bike-service": Wrench,
  "doorstep-bike-service": DoorOpen,
  "bike-repair": Disc3,
  "doorstep-bike-repair": Hammer,
  "scooter-service": Gauge,
  "engine-repair": Zap,
  "battery-service": BatteryCharging,
  "emergency-bike-repair": LifeBuoy,
  "bike-breakdown-assistance": Sparkles,
  "periodic-bike-service": Snowflake,
};

const CAR_ORDER = [
  "car-periodic-service",
  "car-ac-service",
  "car-battery-service",
  "car-brake-service",
  "car-oil-change",
  "car-inspection",
  "car-jump-start",
  "car-repair",
  "car-electrical-repair",
] as const;
const CAR_ICONS: Record<string, LucideIcon> = {
  "car-periodic-service": Wrench,
  "car-ac-service": Snowflake,
  "car-battery-service": BatteryCharging,
  "car-brake-service": Disc3,
  "car-oil-change": Droplets,
  "car-inspection": SearchCheck,
  "car-jump-start": Zap,
  "car-repair": Hammer,
  "car-electrical-repair": Lightbulb,
};

export const MENU_BIKE_ROWS: NavRow[] = BIKE_ORDER.filter((s) => SERVICE_SUMMARY.some((x) => x.slug === s)).map((slug) => ({
  to: "/$service",
  params: { service: slug },
  label: SERVICE_SUMMARY.find((x) => x.slug === slug)!.name,
  icon: BIKE_ICONS[slug] ?? Wrench,
}));

export const MENU_CAR_ROWS: NavRow[] = CAR_ORDER.filter((s) => CAR_SERVICE_SUMMARY.some((x) => x.slug === s)).map((slug) => ({
  to: "/$service",
  params: { service: slug },
  label: CAR_SERVICE_SUMMARY.find((x) => x.slug === slug)!.name,
  icon: CAR_ICONS[slug] ?? Wrench,
}));

/** Breakdown strip + footer row inside the services menu. */
export const MENU_BREAKDOWN: NavRow = { to: "/breakdown-assistance", label: "Vehicle broken down? Breakdown Assistance", icon: LifeBuoy };

export const MENU_FOOTER_ROWS: NavRow[] = [
  { to: "/areas", label: "Areas We Serve", icon: MapPin },
  { to: "/guides", label: "Guides", icon: Newspaper },
  { to: "/answers", label: "Answers", icon: CircleHelp },
];

/* ── Side panel — current rows plus Process and About Us, in order ─────────── */

export const PANEL_SIMPLE_LINKS: NavRow[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/#process", label: "Process", icon: RouteIcon },
  { to: "/areas", label: "Areas We Serve", icon: MapPin },
  { to: "/blog", label: "Blog", icon: Newspaper },
  { to: "/franchise", label: "Franchise", icon: Store },
  { to: "/faq", label: "FAQ", icon: CircleHelp },
  { to: "/contact", label: "Contact", icon: Mail },
  { to: "/about", label: "About Us", icon: Info },
];
