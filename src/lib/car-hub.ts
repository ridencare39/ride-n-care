/**
 * /cars hub copy (title, meta, H1, summary, intro detail).
 *
 * Lives in its own module because route `head()` functions are compiled into
 * the shared client bundle: importing it from car-services.ts would pull the
 * full car catalogue (~45 KB) into the bundle every page loads. car-services.ts
 * re-exports it so existing imports keep working.
 */
export const CAR_HUB = {
  h1: "Car Service at Home in Bangalore",
  title: "Doorstep Car Service in Bangalore | Ride N Care",
  description:
    "Doorstep car service in Bangalore — periodic service, AC, battery and brakes at your home or office by background-verified mechanics. Written quote first.",
  summary:
    "Ride N Care services cars at your home or office across Bangalore — periodic maintenance, AC service, battery replacement and brakes — with a written quote before work starts and a 45-day service warranty on every job.",
  detail: [
    "From hatchbacks to SUVs, our mobile workshop arrives with diagnostic tools, OEM-grade spares and zero shortcuts. You approve a written quote before work starts, watch every part come out, and pay by UPI, card or cash after checking the work.",
  ],
} as const;
