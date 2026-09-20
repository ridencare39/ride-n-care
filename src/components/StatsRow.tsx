/**
 * Compact trust pill shown in the homepage hero and About page.
 * One small box: guarantee · parts · quote · mechanics.
 * Navy glass surface matches the site's deep-navy theme (--primary).
 * Only owner-confirmed promises appear here — no counts, ratings or
 * response-time figures until the owner confirms them (Q1–Q7).
 */
const STATS: [string, string, string][] = [
  ["✓", "Written quote first", "text-neon"],
  ["✓", "OEM-grade parts", "text-emerald-400"],
  ["✓", "7-day guarantee", "text-sky-400"],
  ["✓", "Verified mechanics", "text-amber-400"],
];

export function StatsRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-3xl border border-white/15 bg-primary/85 px-4 py-3 shadow-glow backdrop-blur-md sm:px-5 sm:py-3.5 ${className}`}
    >
      {STATS.map(([value, label, color], i) => (
        <span key={label} className="inline-flex items-center gap-2.5">
          {i > 0 && (
            <span aria-hidden className="text-white/25">
              ·
            </span>
          )}
          <span className="whitespace-nowrap text-xs sm:text-sm">
            <strong className={`font-display font-bold ${color}`}>{value}</strong>{" "}
            <span className="text-white/75">{label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
