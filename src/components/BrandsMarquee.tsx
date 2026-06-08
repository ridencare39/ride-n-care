const BRANDS = [
  // Bike brands
  { name: "Honda", type: "bike", domain: "honda.com" },
  { name: "Hero", type: "bike", domain: "heromotocorp.com" },
  { name: "TVS", type: "bike", domain: "tvsmotor.com" },
  { name: "Bajaj", type: "bike", domain: "bajajauto.com" },
  { name: "Yamaha", type: "bike", domain: "yamaha-motor-india.com" },
  { name: "Suzuki", type: "bike", domain: "suzukimotorcycle.co.in" },
  { name: "Royal Enfield", type: "bike", domain: "royalenfield.com" },
  { name: "KTM", type: "bike", domain: "ktm.com" },
  { name: "Kawasaki", type: "bike", domain: "kawasaki.com" },
  { name: "Harley-Davidson", type: "bike", domain: "harley-davidson.com" },
  { name: "Jawa", type: "bike", domain: "jawamotorcycles.com" },
  { name: "BMW Motorrad", type: "bike", domain: "bmw-motorrad.in" },
  // Car brands
  { name: "Maruti Suzuki", type: "car", domain: "marutisuzuki.com" },
  { name: "Hyundai", type: "car", domain: "hyundai.com" },
  { name: "Tata Motors", type: "car", domain: "tatamotors.com" },
  { name: "Mahindra", type: "car", domain: "mahindra.com" },
  { name: "Toyota", type: "car", domain: "toyota.com" },
  { name: "Kia", type: "car", domain: "kia.com" },
  { name: "Renault", type: "car", domain: "renault.co.in" },
  { name: "Volkswagen", type: "car", domain: "volkswagen.co.in" },
  { name: "Skoda", type: "car", domain: "skoda-auto.co.in" },
  { name: "Ford", type: "car", domain: "ford.com" },
  { name: "Nissan", type: "car", domain: "nissan.in" },
  { name: "MG Motor", type: "car", domain: "mgmotor.co.in" },
  { name: "BMW", type: "car", domain: "bmw.in" },
  { name: "Mercedes-Benz", type: "car", domain: "mercedes-benz.co.in" },
  { name: "Audi", type: "car", domain: "audi.in" },
];

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
              className="shrink-0 flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-3 min-w-[200px]"
              aria-label={`${b.name} ${b.type} service`}
            >
              <img
                src={`https://logo.clearbit.com/${b.domain}`}
                alt={`${b.name} logo`}
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="text-left">
                <div className="text-sm font-semibold leading-tight text-slate-900">{b.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{b.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}