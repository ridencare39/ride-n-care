/**
 * Hero vehicle duo — the LEFT column of the hero grid:
 *   top    = Honda City–style sedan (silver), parked & idling
 *   bottom = Royal Enfield–style classic (olive), parked & idling
 *
 * Magic UX: gentle suspension bob (staggered phase), breathing headlamps, a
 * soft neon ground beam and twinkling four-point sparkles around each vehicle.
 * Both vehicles face right, toward the headline/mechanic. All motion is
 * transform/opacity-only and fully disabled under prefers-reduced-motion
 * (src/styles.css).
 *
 * Reuses the exact SedanSvg / ClassicBikeSvg artwork + shared headlamp defs
 * from the background parade, so the pair reads as the same "fleet".
 */
import { ClassicBikeSvg, HeadlampDefs, SedanSvg } from "@/components/HeroVehicles";

/** Twinkling four-point star — reuses .hero-sparkle (shape, twinkle, reduced-motion). */
function DuoSpark({ className = "", delay = "0s", size = 7 }: { className?: string; delay?: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`hero-sparkle pointer-events-none absolute ${className}`}
      style={{ width: size, height: size, animationDelay: delay }}
    />
  );
}

export function HeroVehicleDuo() {
  return (
    <div className="hero-duo relative flex flex-col items-center justify-center gap-1 sm:gap-2">
      <HeadlampDefs />

      {/* ——— Honda City–style sedan (top) ——— */}
      <div className="hero-duo-vehicle relative w-24 sm:w-64 lg:w-72">
        <div className="rnc-bob relative">
          <SedanSvg body="#cfd8e3" />
        </div>
        <DuoSpark className="-top-2 right-3" delay="0s" />
        <DuoSpark className="top-6 -left-2" delay="0.9s" size={6} />
        <DuoSpark className="-bottom-1.5 right-14" delay="1.7s" size={5} />
        <DuoSpark className="top-1 right-8 sm:right-24" delay="2.4s" size={5} />
      </div>

      {/* ——— Royal Enfield–style classic (bottom) ——— */}
      <div className="hero-duo-vehicle relative ml-3 w-18 sm:ml-6 sm:w-48 lg:w-54">
        <div className="rnc-bob rnc-bob-late relative">
          <ClassicBikeSvg body="#77804a" />
        </div>
        <DuoSpark className="-top-2.5 right-6" delay="0.5s" size={7} />
        <DuoSpark className="top-4 -left-2.5" delay="1.3s" size={5} />
        <DuoSpark className="-bottom-1 left-12" delay="2.1s" size={6} />
      </div>
    </div>
  );
}
