import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CONFIRMED_AREAS, type Area } from "@/lib/areas";

/**
 * Service areas in Bangalore — all 40 owner-confirmed localities (Q3) slide
 * continuously in two rows, matching the "Brands we serve" marquee treatment:
 * matched medium speed per row, pause on hover, travelling shimmer + neon
 * glow on hover, gradient fade edges, gentle reveal on scroll-in, and a full
 * prefers-reduced-motion fallback (src/styles.css).
 *
 * Row split follows the confirmed zones so the rows read like a map:
 *   Row 1: East + North (18 localities)   Row 2: South + West + Central (22)
 * SEO/a11y: chips are real links to /areas/{slug}; the duplicated marquee copy
 * is aria-hidden with tabindex -1 so keyboard users never tab the loop twice.
 */

const ZONE_DOT: Record<Area["zone"], string> = {
  East: "bg-neon",
  South: "bg-emerald-400",
  North: "bg-sky-400",
  West: "bg-amber-400",
  Central: "bg-violet-400",
};

function AreaRow({ areas, duration, label }: { areas: Area[]; duration: number; label: string }) {
  return (
    <>
      <p className="sr-only">{label}</p>
      <div className="areas-marquee relative overflow-hidden" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="areas-marquee-track flex w-max gap-3 py-1">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-3" aria-hidden={copy === 1 ? true : undefined}>
              {areas.map((a) => (
                <Link
                  key={`${copy}-${a.slug}`}
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  tabIndex={copy === 1 ? -1 : undefined}
                  aria-label={`${a.name}${a.pincode ? ` — pincode ${a.pincode}` : ""} ${label}`}
                  className="area-card group/area relative flex min-w-[150px] shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-border bg-background px-4 py-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-neon/40 hover:shadow-glow"
                >
                  <span aria-hidden="true" className="area-shine" />
                  <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${ZONE_DOT[a.zone]}`} />
                  <span className="whitespace-nowrap text-sm font-semibold leading-tight text-foreground transition-colors duration-300 group-hover/area:text-primary">
                    {a.name}
                  </span>
                  {a.pincode ? (
                    <span className="whitespace-nowrap text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.pincode}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** East + North localities, confirmed only, in the order they are served. */
const ROW_NORTH_EAST = CONFIRMED_AREAS.filter((a) => a.zone === "East" || a.zone === "North");
/** South + West + Central localities, confirmed only. */
const ROW_SOUTH_REST = CONFIRMED_AREAS.filter((a) => a.zone !== "East" && a.zone !== "North");

export function AreasSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Rows wait invisible (opacity only) until the section approaches the
  // viewport, then rise in staggered — same reveal pattern as the brands strip.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || revealed) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <section ref={sectionRef} id="areas" className="border-y border-border bg-card py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Service areas in Bangalore</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">Doorstep mechanics near you — all {CONFIRMED_AREAS.length} localities</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Looking for a bike or car mechanic near you? Every confirmed locality below is a live page with pincode-level
          details, nearby landmarks and doorstep service — open 7:00 AM to 11:30 PM, every day.
        </p>
      </div>

      <div className="relative mt-9">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent sm:w-24" />

        {/* East + North row */}
        <div className={revealed ? "brand-row-in" : "brand-row-wait"}>
          <AreaRow
            areas={ROW_NORTH_EAST}
            duration={80}
            label="— East and North Bangalore service area"
          />
        </div>

        {/* South + West + Central row — phase-offset so rows never align */}
        <div className={`mt-3.5 ${revealed ? "brand-row-in brand-row-late" : "brand-row-wait"}`}>
          <AreaRow
            areas={ROW_SOUTH_REST}
            duration={96}
            label="— South, West and Central Bangalore service area"
          />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-neon" /> East</span>
          <span className="mx-2">·</span>
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" /> South</span>
          <span className="mx-2">·</span>
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-sky-400" /> North</span>
          <span className="mx-2">·</span>
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-amber-400" /> West</span>
          <span className="mx-2">·</span>
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-violet-400" /> Central</span>
        </p>
        <Link to="/areas" className="mt-4 inline-block text-primary font-semibold hover:underline">
          See all {CONFIRMED_AREAS.length} confirmed Bangalore areas →
        </Link>
      </div>
    </section>
  );
}
