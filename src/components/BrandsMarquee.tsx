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
type Brand = { name: string; logo: string; alt?: string };

/**
 * Alt text audit (SEO/accessibility task 2026-09-30): every meaningful logo
 * now carries a descriptive alt equal to the official brand name — exact per
 * the owner-supplied list ("Hero" card shows alt "Hero MotoCorp", the
 * "Jawa / Yezdi" card shows alt "Yezdi", matching the mark in the file).
 * No keyword stuffing; the visible card text already carries the label, and
 * the alt keeps the logo meaningful for crawlers and screen readers alike.
 */
const CAR_BRANDS: Brand[] = [
  { name: "Maruti Suzuki", logo: "/brands/maruti.png", alt: "Maruti Suzuki" },
  { name: "Hyundai", logo: "/brands/hyundai.svg", alt: "Hyundai" },
  { name: "Tata Motors", logo: "/brands/tata.svg", alt: "Tata Motors" },
  { name: "Mahindra", logo: "/brands/mahindra.svg", alt: "Mahindra" },
  { name: "Honda", logo: "/brands/honda-bike.svg", alt: "Honda" },
  { name: "Toyota", logo: "/brands/toyota.svg", alt: "Toyota" },
  { name: "Kia", logo: "/brands/kia.png", alt: "Kia" },
];

const BIKE_BRANDS: Brand[] = [
  { name: "Honda", logo: "/brands/honda-bike.svg", alt: "Honda" },
  { name: "Hero", logo: "/brands/hero.svg", alt: "Hero MotoCorp" },
  { name: "TVS", logo: "/brands/tvs.svg", alt: "TVS" },
  { name: "Bajaj", logo: "/brands/bajaj.svg", alt: "Bajaj" },
  { name: "Yamaha", logo: "/brands/yamaha.png", alt: "Yamaha" },
  { name: "Suzuki", logo: "/brands/suzuki.svg", alt: "Suzuki" },
  { name: "Royal Enfield", logo: "/brands/royalenfield.webp", alt: "Royal Enfield" }, // rasterized copy of royalenfield.svg (6.2 KB vs 37.7 KB; scripts/optimize-brand-logos.mjs)
  { name: "KTM", logo: "/brands/ktm.svg", alt: "KTM" },
  { name: "Kawasaki", logo: "/brands/kawasaki.webp", alt: "Kawasaki" }, // rasterized copy of kawasaki.svg (3 KB vs 93.7 KB — the SVG embedded a 2560px raster; scripts/optimize-brand-logos.mjs)
  { name: "Harley-Davidson", logo: "/brands/harley.svg", alt: "Harley-Davidson" },
  { name: "Jawa / Yezdi", logo: "/brands/yezdi.png", alt: "Yezdi" },
  { name: "BMW Motorrad", logo: "/brands/bmw-motorrad.svg", alt: "BMW Motorrad" },
];

/** ~same travel speed for both rows: loop width ÷ duration ≈ 36 px/s. */
const CAR_SPEED_S = 44; // 7 cards ≈ 1.6k px
const BIKE_SPEED_S = 104; // 12 cards ≈ 3.8k px

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
    // Not aria-hidden: the img alt names the brand for screen readers and
    // crawlers, matching the owner-supplied alt list (a11y/SEO task).
    <span className="brand-logo-plate">
      <img
        src={brand.logo}
        alt={brand.alt ?? brand.name}
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
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Brands We Serve</span>
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
        <p className="text-sm font-semibold text-primary">
          Doorstep bike service · Car service at home · Bike repair near me · Car periodic service Bangalore
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Verified mechanics service every brand above at your doorstep with OEM-grade spares, a written quote before
          work starts and a 45-day service warranty — across 40 confirmed localities in Bangalore, open daily
          7 AM to 11:30 PM.
        </p>
      </div>
    </section>
  );
}
