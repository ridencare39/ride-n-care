import { FileText, Home, ShieldCheck, BadgeCheck, Cog, Clock, type LucideIcon } from "lucide-react";

/**
 * The ONE trust-points block on the homepage (replaces the old duplicate
 * pill-chip row and boxed StatsRow). Six verified points only — no invented
 * claims (no same-day, no free pickup, no response times, no ratings/counts).
 *
 * Magic-UI "Magic Card + Border Beam" look recreated by hand: hairline
 * gradient border (.trust-card) with a slow travelling beam (.trust-beam, 6 s,
 * transform-only) that is disabled under prefers-reduced-motion.
 */
const POINTS: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: Home, title: "Doorstep Service", line: "at your home or office" },
  { icon: Clock, title: "Open Daily", line: "7 AM – 11:30 PM, every day" },
  { icon: FileText, title: "Written Quote First", line: "price agreed before work starts" },
  { icon: Cog, title: "OEM-Grade Parts", line: "genuine spares fitted" },
  { icon: ShieldCheck, title: "Verified Mechanics", line: "background-verified technicians" },
  { icon: BadgeCheck, title: "45-Day Warranty", line: "on eligible service and repair work" },
];

export function TrustPoints() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {POINTS.map(({ icon: Icon, title, line }) => (
        <li key={title} className="trust-card">
          <div className="trust-card-inner h-full p-4 sm:p-5">
            <span aria-hidden className="trust-beam">
              <span className="trust-beam-inner" />
            </span>
            <Icon aria-hidden className="h-5 w-5 text-neon" />
            {/* h2: this block sits directly under the page H1 (heading-hierarchy
                fix 2026-09-30 — was h3, skipping a level). */}
            <h2 className="mt-2.5 text-sm font-semibold leading-snug text-white sm:text-base">{title}</h2>
            <p className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">{line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
