import { useEffect, useRef, useState } from "react";

/**
 * Brands We Serve. Bike brands = the confirmed two-wheeler list (booking config).
 * Car brands = ONLY the seven owner-confirmed car brands (Q4; see
 * docs/seo/OWNER-QUESTIONS.md Q27) — Renault/VW/Skoda/Ford/Nissan/MG appear
 * in the booking config but are NOT confirmed for public service claims.
 *
 * Logos: every brand has an exact, self-hosted mark in /public/brands/
 * (Jawa's card uses the Yezdi mark — same maker, Classic Legends, and the
 * booking catalog lists the brand as "Jawa / Yezdi"). No third-party logo CDN:
 * Clearbit's logo endpoint is retired and Brandfetch requires a paid key, so
 * remote fallbacks only produced broken images. Each logo sits on a small
 * white plate so mixed dark/light official marks keep contrast on the card.
 *
 * Design: two independent logo marquees (cars row, bikes row) that slide at a
 * medium, matched speed (px/s) with a "magic UX" treatment — glass cards,
 * travelling shimmer + neon glow on hover, paused on hover, gentle reveal when
 * the section enters the viewport, all transform/opacity-only and disabled
 * under prefers-reduced-motion.
 */
const CAR_BRANDS: Brand[] = [
  { name: "Maruti Suzuki", logo: "/brands/maruti.png" },
  { name: "Hyundai", logo: "/brands/hyundai.svg" },
  { name: "Tata Motors", logo: "/brands/tata.svg" },
  { name: "Mahindra", logo: "/brands/mahindra.svg" },
  { name: "Honda", logo: "/brands/honda-bike.svg" },
  { name: "Toyota", logo: "/brands/toyota.svg" },
  { name: "Kia", logo: "/brands/kia.png" },
];

const BIKE_BRANDS: Brand[] = [
  { name: "Honda", logo: "/brands/honda-bike.svg" },
  { name: "Hero", logo: "/brands/hero.svg" },
  { name: "TVS", logo: "/brands/tvs.svg" },
  { name: "Bajaj", logo: "/brands/bajaj.svg" },
  { name: "Yamaha", logo: "/brands/yamaha.png" },
  { name: "Suzuki", logo: "/brands/suzuki.svg" },
  { name: "Royal Enfield", logo: "/brands/royalenfield.svg" },
  { name: "KTM", logo: "/brands/ktm.svg" },
  { name: "Kawasaki", logo: "/brands/kawasaki.svg" },
  { name: "Harley-Davidson", logo: "/brands/harley.svg" },
  { name: "Jawa / Yezdi", logo: "/brands/yezdi.png" },
  { name: "BMW Motorrad", logo: "/brands/bmw-motorrad.svg" },
];

/** ~same travel speed for both rows: loop width ÷ duration ≈ 36 px/s. */
const CAR_SPEED_S = 44; // 7 cards ≈ 1.6k px
const BIKE_SPEED_S = 104; // 12 cards ≈ 3.8k px

type Brand = { name: string; logo: string };

function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  // Last-resort tile: brand initial on a glass plate (no invented artwork).
  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon/25 bg-secondary font-display text-lg font-bold text-neon"
      >
        {brand.name.charAt(0)}
      </span>
    );
  }
  return (
    <span className="brand-logo-plate" aria-hidden="true">
      <img
        src={brand.logo}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function BrandRow({ brands, duration, label }: { brands: Brand[]; duration: number; label: string }) {
  const loop = [...brands, ...brands];
  return (
    <>
      <p className="sr-only">{label}</p>
      <div className="brands-marquee relative overflow-hidden" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="brands-marquee-track flex w-max gap-3.5 py-1">
          {loop.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              aria-label={`${b.name} ${label}`}
              className="brand-card group/brand relative flex min-w-[196px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-border bg-plate px-5 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-neon/40 hover:shadow-glow sm:min-w-[212px]"
            >
              <span aria-hidden="true" className="brand-shine" />
              <BrandLogo brand={b} />
              <div className="text-left">
                <div className="whitespace-nowrap text-sm font-semibold leading-tight text-foreground transition-colors duration-300 group-hover/brand:text-primary">
                  {b.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function BrandsMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showLogos, setShowLogos] = useState(false);

  // Only start fetching the brand logos once this strip is close to the viewport,
  // so they never compete with the hero for bandwidth on first paint. The same
  // flag drives the gentle rise-in of each row.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || showLogos) return;
    if (!("IntersectionObserver" in window)) {
      setShowLogos(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowLogos(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showLogos]);

  return (
    <section
      ref={sectionRef}
      id="brands"
      className={`brands-reveal border-y border-border bg-background py-14 overflow-hidden ${showLogos ? "is-visible" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Brands We Serve</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">Car brands &amp; bike brands we service</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          From Royal Enfield and KTM to Maruti Suzuki and Toyota — the bike and car brands confirmed for doorstep
          service in Bangalore, with every part shown before it is fitted.
        </p>
      </div>

      {/* Car brands row */}
      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
        <div className={showLogos ? "brand-row-in" : "brand-row-wait"}>
          <BrandRow brands={CAR_BRANDS} duration={CAR_SPEED_S} label="Car service" />
        </div>
        {/* Bike brands row — offset phase so the two rows never align */}
        <div className={`mt-3.5 ${showLogos ? "brand-row-in brand-row-late" : "brand-row-wait"}`}>
          <BrandRow brands={BIKE_BRANDS} duration={BIKE_SPEED_S} label="Bike service" />
        </div>
      </div>

      {/* Visibility keywords — mirrors what riders actually search for. */}
      <div className="mx-auto mt-9 max-w-5xl px-4 sm:px-6 text-center">
        <p className="text-sm font-semibold text-neon">
          Doorstep bike service · Car service at home · Bike repair near me · Car periodic service Bangalore
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Verified mechanics service every brand above at your doorstep with OEM-grade spares, a written quote before
          work starts and a 7-day workmanship guarantee — across 40 confirmed localities in Bangalore, doorstep visits
          available 24 hours.
        </p>
      </div>
    </section>
  );
}
