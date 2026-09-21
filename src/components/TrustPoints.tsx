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
  { icon: Clock, title: "Available 24 Hours", line: "doorstep visits booked at any hour" },
  { icon: FileText, title: "Written Quote First", line: "price agreed before work starts" },
  { icon: Cog, title: "OEM-Grade Parts", line: "genuine spares fitted" },
  { icon: ShieldCheck, title: "Verified Mechanics", line: "background-verified technicians" },
  { icon: BadgeCheck, title: "7-Day Guarantee", line: "workmanship guarantee on every job" },
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
            <h3 className="mt-2.5 text-sm font-semibold leading-snug text-white sm:text-base">{title}</h3>
            <p className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">{line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
