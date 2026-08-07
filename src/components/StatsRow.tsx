export const COMPANY_STATS: { label: string; value: string; icon: string }[] = [
  { label: "Years", value: "12+", icon: "🏆" },
  { label: "Mechanics", value: "150+", icon: "🧰" },
  { label: "Happy Riders", value: "12,000+", icon: "🏍" },
];

export function StatsRow({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {COMPANY_STATS.map((s) => (
        <div key={s.label}>
          <div className="text-2xl font-display font-bold text-primary">
            <span aria-hidden className="mr-1">{s.icon}</span>
            {s.value}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}