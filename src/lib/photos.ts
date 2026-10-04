/**
 * Owner-uploaded Ride N Care photos (source files in src/assets/uploads/,
 * optimized by scripts/optimize-uploads.mjs into src/assets/photos/).
 *
 * Each photo ships as an 800w + 1600w WebP pair (4:3 centre crop), so every
 * <img> can use srcset/sizes. width/height are the 1600w intrinsic size; both
 * variants share the 4:3 ratio, so no layout shift when the browser picks a
 * different candidate. Alt text is unique per photo, describes what is
 * actually visible, and carries a natural Bangalore/doorstep cue only where
 * the photo is genuinely a Ride N Care doorstep scene — never keyword-stuffed.
 */
import doorstepApartment1600 from "@/assets/photos/doorstep-service-apartment-1600.webp";
import doorstepApartment800 from "@/assets/photos/doorstep-service-apartment-800.webp";
import toolsTray1600 from "@/assets/photos/mechanic-tools-tray-1600.webp";
import toolsTray800 from "@/assets/photos/mechanic-tools-tray-800.webp";
import workshopSignage1600 from "@/assets/photos/ride-n-care-workshop-signage-1600.webp";
import workshopSignage800 from "@/assets/photos/ride-n-care-workshop-signage-800.webp";
import scooterRepair1600 from "@/assets/photos/scooter-service-repair-1600.webp";
import scooterRepair800 from "@/assets/photos/scooter-service-repair-800.webp";
import workshopRepair1600 from "@/assets/photos/motorcycle-workshop-repair-1600.webp";
import workshopRepair800 from "@/assets/photos/motorcycle-workshop-repair-800.webp";
import doorstepRe1600 from "@/assets/photos/doorstep-royal-enfield-repair-1600.webp";
import doorstepRe800 from "@/assets/photos/doorstep-royal-enfield-repair-800.webp";
import reAtHome1600 from "@/assets/photos/royal-enfield-service-at-home-1600.webp";
import reAtHome800 from "@/assets/photos/royal-enfield-service-at-home-800.webp";

export type Photo = {
  /** Default (largest) candidate — used as the <img src> fallback. */
  src: string;
  /** Full srcset: 800w + 1600w candidates. */
  srcSet: string;
  /** Unique, human-readable alt text describing the visible scene. */
  alt: string;
  width: number;
  height: number;
};

const pair = (large: string, small: string, alt: string): Photo => ({
  src: large,
  srcSet: `${small} 800w, ${large} 1600w`,
  alt,
  width: 1600,
  height: 1200,
});

export const PHOTOS = {
  /** Homepage intro — two mechanics servicing a car + bike outside an apartment. */
  doorstepApartment: pair(
    doorstepApartment1600,
    doorstepApartment800,
    "Ride N Care mechanics servicing a car and a motorcycle outside a Bangalore apartment",
  ),
  /** Homepage process section — organised hand-tools tray. */
  toolsTray: pair(
    toolsTray1600,
    toolsTray800,
    "Professional hand tools arranged in a service tray before a repair job",
  ),
  /** /about — RNC workshop signage with a motorcycle on the lift. */
  workshopSignage: pair(
    workshopSignage1600,
    workshopSignage800,
    "Ride N Care motorcycle service centre workshop with a Yamaha on the service lift",
  ),
  /** /scooter-service — mechanic repairing a scooter. */
  scooterRepair: pair(
    scooterRepair1600,
    scooterRepair800,
    "Ride N Care mechanic repairing a scooter during a service visit",
  ),
  /** /bike-repair — motorcycle raised inside a repair workshop. */
  workshopRepair: pair(
    workshopRepair1600,
    workshopRepair800,
    "Motorcycle raised on a service stand inside a repair workshop with a tool wall",
  ),
  /** /doorstep-bike-service — maroon RE + Ride N Care pickup outside a home. */
  doorstepRe: pair(
    doorstepRe1600,
    doorstepRe800,
    "Ride N Care mechanic repairing a Royal Enfield motorcycle at a customer's home in Bangalore",
  ),
  /** /bike-service — RE serviced at a residential property. */
  reAtHome: pair(
    reAtHome1600,
    reAtHome800,
    "Ride N Care mechanic servicing a Royal Enfield motorcycle outside a residential property",
  ),
} as const;

/** Captions (AEO context) kept with the photo they belong to. */
export const PHOTO_CAPTIONS = {
  doorstepApartment:
    "Doorstep bike and car service at a customer's apartment — Ride N Care brings the workshop to you.",
  toolsTray: "The right tools for the job — carried to every doorstep booking.",
  workshopSignage:
    "Inside a Ride N Care motorcycle service centre — genuine parts and expert service.",
  scooterRepair:
    "Scooter engine access and routine checks during a Ride N Care service visit.",
  workshopRepair:
    "Diagnosis-led repair work with proper service equipment for jobs that need a workshop.",
  doorstepRe:
    "A Royal Enfield serviced at the customer's doorstep, with the Ride N Care pickup on site.",
  reAtHome:
    "Periodic bike service carried out at the customer's parking spot in Bangalore.",
} as const;

export type PhotoKey = keyof typeof PHOTOS;
