import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ClipboardCheck, FileText, Home as HomeIcon, MapPin, ShieldCheck, Star, Users, Wrench, X, type LucideIcon } from "lucide-react";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { TrustPoints } from "@/components/TrustPoints";
import { HeroVehicles } from "@/components/HeroVehicles";
import { HeroMechanic } from "@/components/HeroMechanic";
import { HeroVehicleDuo } from "@/components/HeroVehicleDuo";
import { ProcessGuide } from "@/components/ProcessGuide";
import { AreasSection } from "@/components/AreasSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { GoogleMark } from "@/components/GoogleMark";
import { AnswerBlocks } from "@/components/AnswerBlocks";
import { ANSWERS, BRAND, ENTITY_SUMMARY } from "@/lib/answers";
import { ANSWER_PAGE_SUMMARY } from "@/lib/answer-page-summary";
import { GUIDE_SUMMARY } from "@/lib/guide-summary";
import { CONFIRMED_AREAS, CONFIRMED_ZONE_PHRASE, COVERAGE_HEADLINE_NAMES, COVERAGE_NAMES_LIST } from "@/lib/areas";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { PHOTOS, PHOTO_CAPTIONS } from "@/lib/photos";

/* ── Cinematic video homepage (owner request, preview-only 2026-10-04) ─────
   VIDEO_EXPERIENCE=true swaps the animated hero (car+bike duo, mechanic
   mascot, background vehicle parade, floating glow orbs, headlight sweep)
   for the owner's uploaded 10-second video, and puts the same video behind
   the bottom blue CTA card. NOTHING is deleted: flip this flag to false and
   the original animated hero renders exactly as before. The sparkles kept
   in the DOM stop twinkling only inside .hero-video-mode (src/styles.css). */
const VIDEO_EXPERIENCE = true;
/** Owner's uploaded video — public/816741921_1791109124906185.mp4
 *  (10 s · 1080×1920 · H.264 + AAC · 6.19 MB). Used verbatim: never renamed,
 *  never transcoded — the original audio track is preserved. */
const RNC_VIDEO_SRC = "/816741921_1791109124906185.mp4";
/** Poster frame extracted from the owner's own video (frame at ~0.4 s,
 *  1080×1920 JPEG, ~168 KB) — paints immediately while the MP4 buffers.
 *  Derived asset only; the source video is untouched. */
const RNC_VIDEO_POSTER = "/ride-n-care-video-poster.jpg";

/** Emoji icon per service category for the homepage grid (box style, no photos). */
const SERVICE_ICONS: Record<string, string> = {
  "bike-service": "🏍️",
  "doorstep-bike-service": "🏠",
  "bike-repair": "🔧",
  "doorstep-bike-repair": "🛠️",
  "periodic-bike-service": "🗓️",
  "motorcycle-service": "🏁",
  "scooter-service": "🛵",
  "emergency-bike-repair": "🚨",
  "bike-breakdown-assistance": "🆘",
  "engine-repair": "⚙️",
  "brake-service": "🛑",
  "clutch-repair": "🔩",
  "battery-service": "🔋",
  "electrical-repair": "⚡",
  "general-two-wheeler-repair": "🧰",
};

const HOME_FAQS: [string, string][] = [
  ["Do you offer doorstep bike service in Bangalore?", "Yes — our background-verified mechanics arrive at your home or office anywhere in Bangalore with tools, OEM-grade spares and a written quote before work starts. Most periodic bike services finish in 60–90 minutes."],
  ["What car services do you provide at home?", "Periodic maintenance, AC service, battery replacement, brake work and pre-purchase inspections — all at your doorstep, with the price confirmed in writing before work starts."],
  ["Is doorstep car service in Bangalore cheaper than a garage?", "Doorstep work cuts the hidden costs of a garage visit — getting the vehicle there, waiting, and the trip back — and every quote is confirmed in writing before work starts."],
  ["Which Bangalore areas do you cover?", `${COVERAGE_NAMES_LIST} and ${CONFIRMED_AREAS.length - COVERAGE_HEADLINE_NAMES.length} more confirmed localities across ${CONFIRMED_ZONE_PHRASE} Bangalore — the full list with pincodes is on our service areas page.`],
  ["Do you use genuine parts?", "Always. We fit OEM-grade spares, listed with part numbers on the digital invoice you receive on WhatsApp."],
  ["What are Ride N Care's operating hours?", "Ride N Care is open 7:00 AM to 11:30 PM, 7 days a week, for bike service in Bangalore — 7 AM to 11:30 PM, every day. Call 080 6940 9289 or WhatsApp 82969 50339 within those hours; actual booking and mechanic availability may vary, and the arrival window is confirmed when you book."],
  ["Is Ride N Care open on Sundays?", "Yes — Ride N Care is open every day, Sundays included, from 7:00 AM to 11:30 PM. Weekend and holiday slots are confirmed when you book; actual mechanic availability may vary."],
];

/**
 * Homepage services: one merged grid with equal weight for bikes and cars.
 * Bike and car cards deep-link to the matching money pages; the EV card
 * points at the dedicated EV page (Batch 3, Week 9).
 */
const MERGED_SERVICES = [
  { icon: "🏍️", name: "Bike Service", desc: "Periodic, repair & doorstep maintenance for every CC", to: "/bike-service" },
  { icon: "🚗", name: "Car Periodic Service", desc: "Oil, filters, brakes & multi-point inspection at home", to: "/car-periodic-service" },
  { icon: "❄️", name: "Car AC Service", desc: "Cooling check, coil clean & gas refill at your doorstep", to: "/car-ac-service" },
  { icon: "🔧", name: "Bike Repair", desc: "Diagnosis-led repairs at your parking spot", to: "/bike-repair" },
  { icon: "🛠️", name: "Car Battery", desc: "Test first, replacement fitted at your gate", to: "/car-battery-service" },
  { icon: "🛑", name: "Car Brakes", desc: "Pad & disc measurement, fluid change at home", to: "/car-brake-service" },
  { icon: "🛵", name: "Scooter Service", desc: "Activa, Jupiter, Access — CVT care included", to: "/scooter-service" },
  { icon: "🔋", name: "Bike Battery", desc: "Testing, jump-start & doorstep replacement", to: "/battery-service" },
  { icon: "⚡", name: "EV Service", desc: "Electric scooter service at home — running gear & brakes", to: "/ev-two-wheeler-service" },
  { icon: "🔧", name: "Car Repair at Home", desc: "Diagnostics, fixes & part fitting at your doorstep", to: "/car-repair" },
];

/**
 * The Ride N Care Difference — comparison rows (owner-approved wording,
 * 2026-10-02), aligned with the verified table on /doorstep-bike-service
 * (COMPARISON_ROWS). Facts only: no invented guarantees, prices, response
 * times, coverage or competitor claims — the "Traditional Workshop" column
 * stays neutral ("varies / depends"), never "worse".
 */
const RNC_DIFFERENCE: { Icon: LucideIcon; feature: string; rnc: React.ReactNode; workshop: string }[] = [
  {
    Icon: HomeIcon,
    feature: "Doorstep service",
    rnc: "Available at home or office in selected service areas",
    workshop: "Usually requires visiting the workshop",
  },
  {
    Icon: FileText,
    feature: "Service transparency",
    rnc: "Written findings or quotes where provided",
    workshop: "Processes vary by workshop",
  },
  {
    Icon: Wrench,
    feature: "Bike and car service",
    rnc: "Bike and car service options",
    workshop: "Depends on the workshop",
  },
  {
    Icon: ClipboardCheck,
    feature: "Work approval",
    rnc: "Customer approval before applicable work",
    workshop: "Processes vary",
  },
  {
    Icon: ShieldCheck,
    feature: "Warranty",
    rnc: (
      <>
        <Link to="/guarantee" className="underline underline-offset-2 decoration-emerald-400/70 hover:decoration-emerald-200">45-day warranty</Link>{" "}
        on eligible repairs, subject to policy
      </>
    ),
    workshop: "Warranty terms vary",
  },
  {
    Icon: MapPin,
    feature: "Service coverage",
    rnc: <Link to="/areas" className="underline underline-offset-2 decoration-emerald-400/70 hover:decoration-emerald-200">Selected Bangalore areas</Link>,
    workshop: "Depends on location",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "Doorstep Bike & Car Service in Bangalore | Ride N Care",
      description:
        "Doorstep bike & car service in Bangalore. Book a verified mechanic in 60 seconds — OEM parts, written quote, 45-day warranty. Care in every mile.",
      path: "/",
      preloadImage: RNC_VIDEO_POSTER,
    }),
    scripts: [
      // JSON-LD. The hero MP4 is SSR'd with its source (VideoBackdrop) so
      // download + muted autoplay begin at HTML parse — faster than any
      // link-rel preload (Chromium rejects as="video").
      ...pageScripts(graphForPage([faqNode(HOME_FAQS)])),
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden navy-sheen${VIDEO_EXPERIENCE ? " hero-video-mode" : ""}`}>
        {/* Cinematic video layer (z-0, pointer-events-none): sits under the
            text-protection scrim (z-[1]) and the copy (z-10). Always-muted
            autoplay + loop — no sound control (owner update 2026-10-04).
            Poster paints pre-hydration for an instant polished visual. */}
        {VIDEO_EXPERIENCE && (
          <VideoBackdrop
            src={RNC_VIDEO_SRC}
            poster={RNC_VIDEO_POSTER}
            className="z-0"
            objectPosition="50% 42%"
          />
        )}
        {/* soft neon glow orbs — the hero visual is the animated vehicle road scene below */}
        {!VIDEO_EXPERIENCE && (
          <>
            <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl float-slow" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl float-slower" />
          </>
        )}
        {/* Spacing pass 2026-10-02 (reversible — restore old values to revert):
            hero pb-16→pb-10, md:pb-24→md:pb-16 (was measured 64/96px below strip) */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-10 md:pt-10 md:pb-16">
          <div className="mx-auto max-w-6xl text-center">
            {/* 3-part hero at every width — car+bike left · headline centre ·
                mechanic right — so mobile mirrors the desktop composition. */}
            <div
              className={`rise-in mt-2 grid ${VIDEO_EXPERIENCE ? "grid-cols-1" : "grid-cols-[auto_minmax(0,1fr)_auto]"} items-center gap-2 sm:mt-6 sm:gap-4 md:gap-6`}
            >
              {!VIDEO_EXPERIENCE && (
                <div className="justify-self-center">
                  <HeroVehicleDuo />
                </div>
              )}
              <div className="min-w-0">
                <span className="inline-flex max-w-full items-center justify-center gap-1 rounded-full border border-neon/45 bg-neon/10 px-3 py-1.5 text-[10px] font-semibold leading-tight uppercase tracking-wider shadow-glow sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm sm:leading-normal text-white">
                  ⭐ Bangalore's Trusted Doorstep Garage
                </span>
                {/* Bare-text spaces (not &nbsp;/wrappers) so text extraction reads one
                    natural line — block/rotor spans otherwise concatenate into a garbled
                    H1 for crawlers and answer engines. Whitespace-only text nodes create
                    no grid track inside the inline-grid rotor and add no visual gap. */}
                <h1 className="neon-line mt-3 text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(2,10,26,0.95),0_0_3px_rgba(2,10,26,0.8)]">
                  <span className="block">Trusted Bike &amp; Car Service</span>{" "}
                  <span className="block text-neon">
                    Doorstep{" "}
                    <span className="rotor">
                      <span className="rotor-word rotor-bike">Bike</span>{" "}
                      <span className="rotor-word rotor-car">Car</span>
                    </span>{" "}
                    Repair in Bangalore
                  </span>
                </h1>
              </div>
              {!VIDEO_EXPERIENCE && (
                <div className="order-3 justify-self-center">
                  <HeroMechanic />
                </div>
              )}
            </div>
            <p className="rise-in-late mt-6 text-lg text-white/80 max-w-lg mx-auto [text-shadow:0_1px_12px_rgba(2,10,26,0.9)]">
              Book a verified mechanic in 60 seconds.{" "}
              <span className="hero-brand-name">
                <span aria-hidden className="hero-sparkle hero-sparkle-1" />
                <span aria-hidden className="hero-sparkle hero-sparkle-2" />
                <span aria-hidden className="hero-sparkle hero-sparkle-3" />
                <span aria-hidden className="hero-sparkle hero-sparkle-4" />
                Ride N Care
              </span>{" "}
              brings bike service, car service and repair to your home or office across Bangalore, from Whitefield and HSR Layout to Electronic City and Sarjapur Road. OEM parts, written quote, 45-day warranty.
            </p>
            {/* Hero CTA pair (yellow Book Now + red Breakdown Assistance)
                REMOVED per owner request 2026-10-04 — the floating circular
                Book Now (bottom centre) is the primary booking action and the
                top-right SOS covers breakdown assistance. Restore this block
                from git history to revert. */}

            {/* ── Trust strip (design preview — delete this <ul> block to revert) ──
                Compact 2×2 on mobile / one row from sm up, aligned to the CTA grid.
                Figures all confirmed against existing content:
                  4.8/5 ............. Google rating from the owner's GBP
                                      "Doorstep Bike Service (Ride N Care)"
                                      (4.8★ / 16 reviews), owner-confirmed with a
                                      GBP screenshot on 2026-10-02
                                      (share.google/5RuspaGkwXcWS3wYe). Display
                                      text only — no review count shown, no
                                      AggregateRating schema (scripts/validate-schema.py
                                      lifts "4.8" for / only)
                  40+ Areas ......... CONFIRMED_AREAS = 40 (areas.ts COVERAGE_LINE)
                  12K+ Customers .... owner-approved on / ("12,000+ customers served")
                  45-Day Warranty ..... approved 45-day service warranty policy (/guarantee)
                Static markup only — no JS, no animation → no layout shift. */}
            <ul
              aria-label="Ride N Care trust highlights"
              className="mx-auto mt-5 grid w-full max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
            >
              {[
                { Icon: Star, tone: "text-amber-400", glow: "", value: "4.8/5", sub: "Google Customer Rating", stars: true, google: true },
                { Icon: MapPin, tone: "text-neon", glow: "drop-shadow-[0_0_5px_rgba(0,183,227,0.5)]", value: "40+ Areas", sub: "Across Bangalore", stars: false, google: false },
                { Icon: Users, tone: "text-neon", glow: "drop-shadow-[0_0_5px_rgba(0,183,227,0.5)]", value: "12K+ Customers", sub: "Served with care", stars: false, google: false },
                { Icon: ShieldCheck, tone: "text-emerald-400", glow: "", value: "45-Day Warranty", sub: "On eligible repairs", stars: false, google: false },
              ].map(({ Icon, tone, glow, value, sub, stars, google }) => (
                <li
                  key={value}
                  className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.07] px-2 py-3 text-center"
                >
                  {stars ? (
                    /* five gold stars as the icon slot; one accessible label for the pair */
                    <span
                      role="img"
                      aria-label="Rated 4.8 out of 5 on Google"
                      className="flex h-4 shrink-0 items-center gap-0.5"
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Icon key={i} aria-hidden className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.35)]" />
                      ))}
                    </span>
                  ) : (
                    <Icon aria-hidden className={`h-4 w-4 shrink-0 ${tone} ${glow}`} />
                  )}
                  <span className="text-sm font-bold leading-tight text-white sm:text-[15px]">{value}</span>
                  <span className="text-[11px] leading-tight text-white/70">
                    {google && <GoogleMark className="mr-1 inline-block h-3 w-3 align-middle" />}
                    {sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {!VIDEO_EXPERIENCE && <HeroVehicles />}
        {/* text-protection scrim: soft grade over the video so copy stays
            readable while the subject stays visible (softened 2026-10-04 per
            owner request — video should read as the main visual) */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_55%_at_50%_40%,rgba(2,10,26,0.58),rgba(2,10,26,0.26)_55%,transparent_80%)]" />
        {/* headlight focus on the written content: a warm lamp wash that sweeps
            across the hero copy like passing headlights, screen-blended so the
            text stays readable and only brightens. (Animated — disabled in video mode.) */}
        {!VIDEO_EXPERIENCE && (
          <div aria-hidden="true" className="hero-headlight-focus pointer-events-none absolute inset-0 z-[20]" />
        )}
      </section>

      {/* Trust points — the single six-point block (replaces the old duplicate rows).
          Spacing pass 2026-10-02 (reversible): pt-10→pt-6, pb-24→pb-16,
          sm:pb-28→sm:pb-20 — the fixed .float-bar overlays content while
          scrolling regardless of this padding, so the extra air was dead space. */}
      <section aria-label="Why riders trust Ride N Care" className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
        <TrustPoints />
        {/* Customer-count claim removed 2026-10-02 (owner request): the 12K figure
            now lives only in the hero trust strip. Never schema AggregateRating. */}
      </section>

      {/* SEO-rich intro */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Bangalore's friendliest doorstep mechanics</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Stuck in traffic, juggling a hectic week, or simply tired of waiting at a service centre? Ride N Care brings the entire workshop to your driveway. Whether it's a routine bike oil change in <strong className="text-foreground">Koramangala</strong>, a car AC top-up in <strong className="text-foreground">HSR Layout</strong>, or a Sunday breakdown rescue in <strong className="text-foreground">Whitefield</strong> — book a slot, approve a written quote, and the mechanic comes to you with the right tools and the right price.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Every service is performed by a background-verified, trained mechanic, uses genuine OEM-grade spares and ends with a digital invoice plus a 45-day service warranty. No upselling. No surprise bills. Just honest, doorstep care for your ride — see how our{" "}
          <Link to="/$service" params={{ service: "doorstep-bike-service" }} className="text-primary">doorstep bike service</Link>{" "}
          works, or book a{" "}
          <Link to="/$service" params={{ service: "doorstep-bike-repair" }} className="text-primary">doorstep bike repair</Link>{" "}
          when something specific has gone wrong.
        </p>

        {/* Real owner photo (src/assets/uploads → src/assets/photos): two Ride N Care
            mechanics servicing a car and a bike outside an apartment — the visual
            proof of the doorstep promise above. Below the fold → lazy, decoded
            async; width/height pinned to the 4:3 file so nothing shifts. */}
        <figure className="mx-auto mt-8 max-w-2xl">
          <img
            src={PHOTOS.doorstepApartment.src}
            srcSet={PHOTOS.doorstepApartment.srcSet}
            sizes="(min-width: 768px) 672px, calc(100vw - 32px)"
            alt={PHOTOS.doorstepApartment.alt}
            width={PHOTOS.doorstepApartment.width}
            height={PHOTOS.doorstepApartment.height}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-card ring-1 ring-primary/10"
          />
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {PHOTO_CAPTIONS.doorstepApartment}
          </figcaption>
        </figure>
      </section>

      {/* Services — single merged grid, bikes and cars at parity.
          #services anchor target for the top-nav "Our Services" link. */}
      <section id="services" className="mx-auto max-w-7xl scroll-mt-[76px] px-4 sm:px-6 pb-6">
        <SectionHeading eyebrow="Our Services" title="Pick your service" />
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MERGED_SERVICES.map((s, i) => (
            <div
              key={s.name}
              className="svc-tile group relative rounded-3xl"
              style={{ "--tile-i": i } as React.CSSProperties}
            >
              {/* magic UX: gradient hairline rim + conic hover beam + rim light */}
              <span aria-hidden className="svc-tile-beam" />
              <span aria-hidden className="svc-tile-rim" />
              <Link
                to={s.to}
                className="shadow-card magic-card relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-border bg-card p-5 text-center transition-colors duration-300 group-hover:border-primary/55 sm:p-6"
              >
                {/* travelling shine + twinkling corner stars + icon glow */}
                <span aria-hidden className="magic-shine" />
                <span
                  aria-hidden
                  className="hero-sparkle pointer-events-none absolute right-3 top-3"
                  style={{ animationDelay: `${(i % 5) * 0.65}s` }}
                />
                <span
                  aria-hidden
                  className="hero-sparkle hero-sparkle-5px pointer-events-none absolute bottom-4 left-4"
                  style={{ animationDelay: `${(i % 5) * 0.65 + 1.1}s` }}
                />
                <span aria-hidden className="svc-tile-spotlight" />
                <span aria-hidden className="svc-tile-float">
                  <span className="svc-tile-icon">
                    <span className="magic-icon text-3xl transition duration-300 group-hover:scale-110">{s.icon}</span>
                  </span>
                </span>
                <h3 className="mt-3 font-semibold text-foreground transition-colors group-hover:text-neon">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                  Learn More
                  <span aria-hidden className="text-neon transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* The Ride N Care Difference — premium comparison block, placed after the
          service intro and before the lower-page conversion content. Facts reuse
          the verified /doorstep-bike-service comparison (RNC_DIFFERENCE above);
          mid-funnel CTA into the existing booking modal. Static markup only. */}
      <section aria-labelledby="rnc-difference-h2" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-[oklch(0.19_0.04_260)] p-5 shadow-card sm:p-8 lg:p-10">
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
              Why Ride N Care
            </div>
            <h2 id="rnc-difference-h2" className="mt-2 text-3xl font-bold text-white md:text-4xl">The Ride N Care Difference</h2>
            <p className="mt-3 leading-relaxed text-white/70">
              Bike and car service designed around your convenience, transparency and peace of mind.
            </p>
          </div>

          {/* Desktop (sm+): premium three-column tick table on the brand's dark
              navy surface — Feature · Ride N Care (emerald tint + green values)
              · Traditional Workshop (muted ✕). Banded header, clear separators. */}
          <div className="relative mt-8 hidden overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.23_0.045_260)] shadow-card sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-primary/10">
                  <th scope="col" className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">Feature</th>
                  <th scope="col" className="bg-emerald-400/10 px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    <span className="flex items-center gap-1.5">
                      <Check aria-hidden className="h-3.5 w-3.5 text-emerald-400" />
                      Ride N Care
                    </span>
                  </th>
                  <th scope="col" className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                    <span className="flex items-center gap-1.5">
                      <X aria-hidden className="h-3.5 w-3.5 text-white/40" />
                      Traditional Workshop
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {RNC_DIFFERENCE.map(({ Icon, feature, rnc, workshop }) => (
                  <tr key={feature} className="border-t border-white/10 transition-colors hover:bg-white/[0.04]">
                    <th scope="row" className="px-5 py-4 text-left align-top text-[15px] font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </span>
                    </th>
                    <td className="bg-emerald-400/[0.07] px-5 py-4 align-top">
                      <span className="flex items-start gap-2">
                        <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">{rnc}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="flex items-start gap-2">
                        <X aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
                        <span className="text-white/60">{workshop}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile (<sm): the same table as stacked bands — feature header band,
              then the green Ride N Care value and the muted workshop comparison as
              two separated rows. No horizontal scrolling, no clipped text. */}
          <div className="relative mt-6 space-y-3 sm:hidden">
            {RNC_DIFFERENCE.map(({ Icon, feature, rnc, workshop }) => (
              <div key={feature} className="overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.23_0.045_260)] shadow-card">
                <p className="flex items-center gap-2 border-b border-white/10 bg-primary/10 px-4 py-3 text-[15px] font-semibold text-white">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </p>
                <p className="flex items-start gap-2 px-4 py-3 text-sm font-semibold leading-relaxed text-emerald-300">
                  <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span><span className="sr-only">Ride N Care: </span>{rnc}</span>
                </p>
                <p className="flex items-start gap-2 border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/60">
                  <X aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
                  <span><span className="sr-only">Traditional workshop: </span>{workshop}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Conversion CTA — existing booking modal, no duplicate booking flow */}
          <div className="mt-8 rounded-3xl bg-grad-primary p-8 text-center shadow-glow sm:p-10">
            <h3 className="text-2xl font-bold text-primary-foreground">Experience the Ride N Care Difference</h3>
            <p className="mt-2 text-primary-foreground/90">Book convenient doorstep bike or car service in Bangalore.</p>
            <BookingButton className="btn-book mt-6 rounded-full px-6 py-3 font-semibold">Book Your Service</BookingButton>
          </div>
        </div>
      </section>

      {/* Answer-first entity summary for search & AI assistants */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="About the business" title="Who is Ride N Care?" />
        <p className="mt-6 text-muted-foreground leading-relaxed">{ENTITY_SUMMARY}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Call <a href="tel:+918069409289" className="text-primary underline underline-offset-2">080 6940 9289</a> or WhatsApp{" "}
          <a href="https://wa.me/918296950339" target="_blank" rel="noopener" className="text-primary underline underline-offset-2">82969 50339</a> in {BRAND.city}, {BRAND.region} — open 7:00 AM to 11:30 PM, every day.
        </p>
        <AnswerBlocks items={ANSWERS.filter((a) => a.id !== "who-is-ride-n-care").slice(0, 6)} headingLevel={3} />
        <div className="mt-6">
          <Link to="/answers" className="text-primary font-semibold hover:underline">See all answers about Ride N Care →</Link>
        </div>
      </section>

      {/* Areas We Serve */}
      <AreasSection />

      {/* Brands We Service */}
      <BrandsMarquee />    {/* ONE process guide — replaces the old "Our promises" / "Why Ride N Care" /
        "How it works" sections (combined task, Task D). #process anchor target. */}
      <ProcessGuide />

      {/* The Ride N Care Experience — native service-value cards (owner request
          2026-10-04, preview-only). Replaces the Trustindex Google reviews
          widget whose free trial expired; fully static — no third-party
          scripts, no ratings, no testimonials. SEO/schema/canonicals
          untouched. */}
      <ExperienceSection />

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20">
        <SectionHeading eyebrow="FAQ" title="Quick answers for first-time customers" />
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
          {HOME_FAQS.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
                <span className="font-semibold">{q}</span>
                <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="text-primary font-semibold hover:underline">Read all FAQs →</Link>
        </div>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="Guides" title="Bike maintenance knowledge, free to read" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIDE_SUMMARY.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
            >
              <h3 className="font-semibold">{g.h1}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{g.summary}</p>
              <span className="mt-3 inline-block text-sm text-primary font-semibold">Read · {g.readMinutes} min →</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/guides" className="text-primary font-semibold hover:underline">All bike guides →</Link>
        </div>
      </section>

      {/* Answers cluster — every /answers/* page reachable from home
          (indexing audit 2026-09-29: the answers group was discovery-only). */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="Answers" title="Straight answers to common questions" />
        <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {ANSWER_PAGE_SUMMARY.map((ap) => (
            <li key={ap.slug}>
              <Link
                to="/answers/$slug"
                params={{ slug: ap.slug }}
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                {ap.question}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link to="/answers" className="text-primary font-semibold hover:underline">Browse all answers →</Link>
        </div>
      </section>

      {/* CTA — in video mode the blue gradient card doubles as the fallback
          behind the same video (lazily attached → reuses the hero's cached
          download), tinted brand-blue so the white copy stays readable. */}
      <section className="mx-auto max-w-5xl px-4 pb-32 pt-20 sm:px-6 sm:pb-36">
        <div className="relative overflow-hidden rounded-3xl bg-grad-primary p-10 text-center shadow-glow">
          {VIDEO_EXPERIENCE && (
            <>
              <VideoBackdrop src={RNC_VIDEO_SRC} poster={RNC_VIDEO_POSTER} className="z-0" lazy objectPosition="50% 45%" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-grad-primary opacity-[0.62]" />
            </>
          )}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready for a smoother ride?
            </h2>
            <p className="mt-3 text-primary-foreground/90">Written quote before work starts. OEM-grade parts, digital invoice, 45-day service warranty.</p>
            <BookingButton className="btn-book mt-6 rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
        {eyebrow}
      </div>
      <h2 className="mt-2 text-4xl md:text-5xl font-bold">{title}</h2>
    </div>
  );
}
