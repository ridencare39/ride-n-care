/**
 * Shared breakdown-dispatch steps. Lives in its own module so the breakdown
 * pages (which render it) do not pull the full services.ts content into their
 * client chunks; services.ts imports it for the two dispatch service entries.
 */
export const DISPATCH_STEPS: [string, string][] = [
  ["1. Call or WhatsApp", "Share your live location and what happened. Call 080 6940 9289 or WhatsApp 82969 50339."],
  ["2. Get the charge upfront", "The callout and likely repair cost are confirmed on the call before anyone rides out."],
  ["3. Mechanic dispatched", "The nearest available mechanic rides to you with a jump pack, spares and a puncture kit."],
  ["4. Ride away or be recovered", "Fixed on the spot where possible, or transported to our workshop with the estimate shared first."],
];
