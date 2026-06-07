const BRANDS = [
  // Bike brands
  { name: "Honda", type: "bike" },
  { name: "Hero", type: "bike" },
  { name: "TVS", type: "bike" },
  { name: "Bajaj", type: "bike" },
  { name: "Yamaha", type: "bike" },
  { name: "Suzuki", type: "bike" },
  { name: "Royal Enfield", type: "bike" },
  { name: "KTM", type: "bike" },
  { name: "Kawasaki", type: "bike" },
  { name: "Harley-Davidson", type: "bike" },
  { name: "Jawa", type: "bike" },
  { name: "BMW Motorrad", type: "bike" },
  // Car brands
  { name: "Maruti Suzuki", type: "car" },
  { name: "Hyundai", type: "car" },
  { name: "Tata", type: "car" },
  { name: "Mahindra", type: "car" },
  { name: "Toyota", type: "car" },
  { name: "Honda", type: "car" },
  { name: "Kia", type: "car" },
  { name: "Renault", type: "car" },
  { name: "Volkswagen", type: "car" },
  { name: "Skoda", type: "car" },
  { name: "Ford", type: "car" },
  { name: "Nissan", type: "car" },
  { name: "MG", type: "car" },
  { name: "BMW", type: "car" },
  { name: "Mercedes-Benz", type: "car" },
  { name: "Audi", type: "car" },
];

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function BrandsMarquee() {
  const loop = [...BRANDS, ...BRANDS];
  return (
    <section className="border-y border-border bg-background py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Brands We Service</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">25+ bike & car brands, one trusted garage</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          From Royal Enfield to Mercedes-Benz, our mechanics are trained on every popular Indian and international brand sold in Bangalore.
        </p>
      </div>
      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="marquee-track flex gap-4 w-max">
          {loop.map((b, i) => (
            <div
              key={`${b.name}-${b.type}-${i}`}
              className="shrink-0 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 min-w-[180px]"
              aria-label={`${b.name} ${b.type} service`}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-grad-primary font-display font-bold text-sm text-primary-foreground"
                aria-hidden
              >
                {initials(b.name)}
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold leading-tight">{b.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}