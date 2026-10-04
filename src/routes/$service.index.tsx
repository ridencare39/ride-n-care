import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getServiceSummary, getCarServiceSummary, SERVICE_SUMMARY, CAR_SERVICE_SUMMARY, type ServiceSummary } from "@/lib/service-summary";
// Full catalogues are imported by THIS lazy component only (content render);
// the shared route definition (head/loader) uses slim summaries.
import { SERVICES as SERVICES_LIST, getService, TRUST_POINTS, BIKE_BRANDS, type ServiceDef } from "@/lib/services";
import { CAR_SERVICES, getCarService, CAR_BRAND_LIST } from "@/lib/car-services";
import { AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { SITE_URL } from "@/lib/seo";
import { formatDate, pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";
import { formatPrice, getBikePackagesForCc, getBookingServiceForSlug, getBookingServiceIdForSlug } from "@/lib/pricing";
import { GUIDE_SUMMARY } from "@/lib/guide-summary";
import { answersForService } from "@/lib/answer-page-summary";
import { carAreaLinksForService } from "@/lib/car-area-content";
import { PHOTOS, PHOTO_CAPTIONS, type Photo } from "@/lib/photos";

/**
 * Owner photos (src/assets/uploads → src/assets/photos) shown once per service
 * page, right under the above-the-fold CTAs. Each slug gets exactly one photo,
 * matched to what the image actually shows — motorcycle-only shots never land
 * on car pages, and no image is duplicated across pages.
 */
const SERVICE_PHOTOS: Partial<Record<string, { photo: Photo; caption: string }>> = {
  "bike-service": { photo: PHOTOS.reAtHome, caption: PHOTO_CAPTIONS.reAtHome },
  "bike-repair": { photo: PHOTOS.workshopRepair, caption: PHOTO_CAPTIONS.workshopRepair },
  "doorstep-bike-service": { photo: PHOTOS.doorstepRe, caption: PHOTO_CAPTIONS.doorstepRe },
  "scooter-service": { photo: PHOTOS.scooterRepair, caption: PHOTO_CAPTIONS.scooterRepair },
};

// Full bike catalogue is only needed by the lazy component below (content
// render); the shared route definition uses slim summaries.
const ALL_SERVICES = [...SERVICE_SUMMARY, ...CAR_SERVICE_SUMMARY];

/**
 * The Ride N Care Difference — comparison table (only on /doorstep-bike-service).
 * Copy states only confirmed service facts: doorstep where covered, written
 * quote process, booking channels. The two AEO Q&As below are rendered in the
 * section AND appended to this page's FAQPage schema (visible-content parity).
 */
const COMPARISON_ROWS: { feature: string; rnc: string; workshop: string }[] = [
  { feature: "Service location", rnc: "Doorstep bike service at your home or office, where available", workshop: "Service at the workshop" },
  { feature: "Convenience", rnc: "Mechanic comes to your location", workshop: "Customer takes the bike to the workshop" },
  { feature: "Service experience", rnc: "Service and repair at your location", workshop: "Service inside the workshop" },
  { feature: "Bike maintenance", rnc: "Periodic service, maintenance, inspection and repairs", workshop: "Workshop-based maintenance and repairs" },
  { feature: "Booking", rnc: "Book a service online, by phone or WhatsApp", workshop: "Visit or contact the workshop" },
  { feature: "Location", rnc: "Doorstep bike service in selected Bangalore areas", workshop: "Service available at the workshop location" },
  { feature: "Customer convenience", rnc: "Convenient service without travelling to a workshop", workshop: "Travel to and from the workshop may be required" },
];

const COMPARISON_FAQS: [string, string][] = [
  [
    "Is doorstep bike service better than visiting a workshop?",
    "Doorstep bike service can be more convenient for routine bike servicing, maintenance and suitable repairs because the mechanic comes to the customer's location. Workshop service may be more suitable for repairs that require equipment or facilities that cannot be handled at the customer's location.",
  ],
  [
    "What is the difference between doorstep bike service and workshop service?",
    "The main difference is where the work is performed. With Ride N Care doorstep bike service, an available mechanic comes to the customer's home, office or other service location in covered Bangalore areas. With a traditional workshop, the customer takes the bike to the workshop.",
  ],
];

export const Route = createFileRoute("/$service/")({
  head: ({ params }) => {
    const s = getServiceSummary(params.service) ?? getCarServiceSummary(params.service);
    if (!s) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    return {
      ...pageHead({
        title: s.title,
        description: s.description,
        path: `/${s.slug}`,
        extraMeta: [
          { property: "og:title", content: s.title },
          { property: "og:description", content: s.description },
        ],
      }),
      scripts: pageScripts(
        graphForPage([
          serviceNode({
            slug: s.slug,
            name: s.name,
            serviceType: s.serviceType,
            description: s.summary,
            priceFrom: s.priceFrom,
          }),
          breadcrumbNode([
            ["Home", "/"],
            [s.name, `/${s.slug}`],
          ]),
          // FAQPage mirrors the visible FAQ section — plus, on the doorstep
          // page, the two comparison Q&As rendered in the Ride N Care
          // Difference section.
          faqNode(s.slug === "doorstep-bike-service" ? [...s.faqs, ...COMPARISON_FAQS] : s.faqs),
        ]),
      ),
    };
  },
  loader: ({ params }) => {
    // Loader returns the slim summary; the lazy component resolves the full
    // def itself, keeping detail content out of the shared bundle.
    const service = getServiceSummary(params.service) ?? getCarServiceSummary(params.service);
    if (!service) throw notFound();
    return { service };
  },
  component: ServiceLanding,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">This service page does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">This page didn't load</h1>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
});

function ServiceLanding() {
  const { service: summary } = Route.useLoaderData() as { service: ServiceSummary };
  // Resolve the full content def inside the lazy component (detail data stays
  // out of the shared route chunk). The loader guarantees a match exists.
  const s = (getService(summary.slug) ?? getCarService(summary.slug)) as ServiceDef;
  const isCar = CAR_SERVICES.some((c) => c.slug === s.slug);
  const vehicleType = isCar ? "car" : "bike";
  const related = s.related.map((slug) => getService(slug) ?? getCarService(slug)).filter(Boolean) as ServiceDef[];
  const relatedGuides = s.relatedGuides.map((slug) => GUIDE_SUMMARY.find((g) => g.slug === slug)).filter(Boolean);
  const relatedAnswers = answersForService(s.slug);
  const bookingService = getBookingServiceForSlug(s.slug);
  const bookingServiceId = getBookingServiceIdForSlug(s.slug);
  const examplePackage = bookingServiceId ? getBikePackagesForCc(199).find((item) => item.serviceId === bookingServiceId) : undefined;
  const servicePhoto = SERVICE_PHOTOS[s.slug];
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span> <span>{s.name}</span>
      </nav>

      {/* H1 + subheading */}
      <h1 className="mt-6 text-4xl md:text-5xl font-bold">{s.h1}</h1>
      <p className="mt-3 text-lg text-foreground/80 leading-relaxed">{s.subheading}</p>

      {/* Quick answer (40–60 words) — AEO answer-first box */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Quick answer</p>
        <p className="mt-2 text-foreground leading-relaxed">{s.summary}</p>
      </div>

      {/* Above-the-fold CTAs: Call · WhatsApp · Book now, with GA4 conversion events */}
      <div className="mt-6 flex flex-wrap gap-3">
        <BookingButton vehicle={vehicleType} serviceId={bookingServiceId} className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", { vehicle_type: vehicleType, service: s.slug })}
          className="rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
        >
          Call 080 6940 9289
        </a>        <a
          href="https://wa.me/918296950339"
          target="_blank" rel="noopener"
          {...ctcProps("whatsapp_click", { vehicle_type: vehicleType, service: s.slug })}
          className="rounded-full border border-emerald-600/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          WhatsApp 82969 50339
        </a>
      </div>

      {/* Below-the-fold owner photo matched to this service — 4:3 with pinned
          width/height (no CLS), lazy + async decode, srcset for mobile/desktop. */}
      {servicePhoto && (
        <figure className="mt-8">
          <img
            src={servicePhoto.photo.src}
            srcSet={servicePhoto.photo.srcSet}
            sizes="(min-width: 928px) 864px, calc(100vw - 32px)"
            alt={servicePhoto.photo.alt}
            width={servicePhoto.photo.width}
            height={servicePhoto.photo.height}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-card ring-1 ring-primary/10"
          />
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {servicePhoto.caption}
          </figcaption>
        </figure>
      )}

      {/* Body copy */}
      <div className="mt-10 space-y-4 text-muted-foreground leading-relaxed">
        {s.detail.map((p) => <p key={p}>{p}</p>)}
      </div>

      {/* What is included */}
      <h2 className="mt-12 text-2xl font-bold">What is included</h2>
      {bookingService && examplePackage ? (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-semibold">{bookingService.name}</span>
            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm">From {formatPrice(examplePackage.price)}</span>
          </div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {bookingService.includes.map((i) => <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>)}
          </ul>
        </>
      ) : (
        <ul className="mt-4 grid sm:grid-cols-2 gap-2">
          {s.includes.map((i) => <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>)}
        </ul>
      )}

      {/* Pricing */}
      <h2 className="mt-12 text-2xl font-bold">Pricing</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">{s.pricing}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">The price is confirmed in writing before work starts.</p>

      {/* How it works */}
      <h2 className="mt-12 text-2xl font-bold">How it works</h2>
      <ol className="mt-4 space-y-3">
        {s.steps.map(([t, d]) => (
          <li key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>

      {/* Honest limits */}
      <h2 className="mt-12 text-2xl font-bold">What is not suitable for doorstep</h2>
      <ul className="mt-4 space-y-2">
        {s.limits.map((l) => (
          <li key={l} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">✕ {l}</li>
        ))}
      </ul>

      {/* Brands serviced — owner-confirmed lists only */}
      <h2 className="mt-12 text-2xl font-bold">Brands we service</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {(isCar ? CAR_BRAND_LIST : BIKE_BRANDS).join(" · ")}
      </p>

      {/* Where we serve — top 12 area pages */}
      {s.local && (
        <>
          <h2 className="mt-12 text-2xl font-bold">{s.name} across Bangalore</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRIORITY_AREAS.map((a) => (
              <Link
                key={a.slug}
                to="/$service/$area"
                params={{ service: s.slug, area: a.slug }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                📍 {s.name} in {a.name}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Not listed? We cover {AREAS.length} localities — see all <Link to="/areas" className="text-primary">service areas</Link>.
          </p>
        </>
      )}

      {/* Local coverage — registry-driven links to published car×area pages.
          Bike hubs render their own “across Bangalore” block via s.local. */}
      {isCar && (
        <>
          <h2 className="mt-12 text-2xl font-bold">Local car service areas in Bangalore</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {s.name} at your doorstep in these Bangalore localities — each page covers local parking access, what to have ready and pair-specific questions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {carAreaLinksForService(s.slug).map((a) => (
              <Link
                key={a.slug}
                to="/$service/$area"
                params={{ service: s.slug, area: a.slug }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                📍 {s.name} in {a.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* The Ride N Care Difference — comparison vs traditional workshop.
          Only on /doorstep-bike-service (its exact search intent). */}
      {s.slug === "doorstep-bike-service" && <DoorstepVsWorkshop />}

      {/* Trust section */}
      <h2 className="mt-12 text-2xl font-bold">Why {isCar ? "car owners" : "riders"} trust Ride N Care</h2>
      <div className="mt-4 space-y-2">
        {TRUST_POINTS.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      {/* FAQs — same array drives the FAQPage JSON-LD above */}
      <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {s.faqs.map(([q, a]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Full cover details: <Link to="/guarantee" className="text-primary hover:underline">45-Day Service Warranty</Link>.
      </p>

      {/* Related services + guides */}
      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Related services</h2>
            <ul className="mt-3 space-y-1.5">
              {(s.slug === "bike-breakdown-assistance" || s.slug === "car-breakdown-assistance") && (
                <li>
                  <Link to="/breakdown-assistance" className="text-primary hover:underline">
                    Bike &amp; Car Breakdown Assistance in Bangalore
                  </Link>
                </li>
              )}
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to="/$service" params={{ service: r.slug }} className="text-primary hover:underline">
                    {r.name} in Bangalore
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {relatedGuides.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Related guides</h2>
            <ul className="mt-3 space-y-1.5">
              {relatedGuides.map((g) => (
                <li key={g!.slug}>
                  <Link to="/guides/$slug" params={{ slug: g!.slug }} className="text-primary hover:underline">
                    {g!.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Related answers — AEO internal links, data-driven from answer-pages.ts */}
      {relatedAnswers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Related answers</h2>
          <ul className="mt-3 space-y-1.5">
            {relatedAnswers.map((a) => (
              <li key={a.slug}>
                <Link to="/answers/$slug" params={{ slug: a.slug }} className="text-primary hover:underline">
                  {a.question}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/answers" className="mt-3 inline-block text-sm text-muted-foreground hover:text-primary">
            All answers →
          </Link>
        </div>
      )}

      {/* Closing CTA */}
      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book {s.name.toLowerCase()} today</h2>
        <p className="mt-2 text-primary-foreground/90">The price is confirmed in writing before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">          <a
            href="https://wa.me/918296950339"
            target="_blank" rel="noopener"
            {...ctcProps("whatsapp_click", { vehicle_type: vehicleType, service: s.slug })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            WhatsApp 82969 50339
          </a>
          <BookingButton vehicle={vehicleType} serviceId={bookingServiceId} className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        </div>
      </div>

      {/* Review stamp */}
      <p className="mt-6 text-center text-xs text-muted-foreground">Last reviewed: {formatDate(s.reviewed)}</p>
    </div>
  );
}

/**
 * The Ride N Care Difference — /doorstep-bike-service only.
 * Mobile: stacked cards (feature header + two labelled values). Desktop: grid.
 * Uses the existing container (max-w-4xl px-4) so nothing can overflow horizontally.
 */
function DoorstepVsWorkshop() {
  const bookingServiceId = getBookingServiceIdForSlug("doorstep-bike-service");
  return (
    <section className="mt-12" aria-labelledby="rnc-difference">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The Ride N Care Difference</p>
      <h2 id="rnc-difference" className="mt-2 text-2xl font-bold">Ride N Care vs. Traditional Bike Workshop in Bangalore</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Ride N Care brings{" "}
        <Link to="/$service" params={{ service: "doorstep-bike-service" }} className="text-primary hover:underline">doorstep bike service</Link>{" "}
        to your home or office in covered Bangalore areas, while a traditional workshop means taking the bike to them.
      </p>

      {/* Desktop comparison grid */}
      <div className="mt-6 hidden sm:block overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Feature</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-primary">Ride N Care</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Traditional Workshop</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="border-t border-border">
                <th scope="row" className="px-4 py-3 text-left font-medium align-top">{row.feature}</th>
                <td className="px-4 py-3 align-top">{row.rnc}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.workshop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards — no horizontal scroll */}
      <div className="mt-6 space-y-3 sm:hidden">
        {COMPARISON_ROWS.map((row) => (
          <div key={row.feature} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-semibold">{row.feature}</p>
            <p className="mt-2 text-sm"><span className="font-semibold text-primary">Ride N Care: </span>{row.rnc}</p>
            <p className="mt-1 text-sm text-muted-foreground"><span className="font-semibold">Traditional workshop: </span>{row.workshop}</p>
          </div>
        ))}
      </div>

      {/* AEO answer block */}
      <div className="mt-8 grid gap-4">
        {COMPARISON_FAQS.map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Contextual links to existing pages only */}
      <p className="mt-6 text-sm text-muted-foreground">
        Prefer a specific service? See{" "}
        <Link to="/$service" params={{ service: "bike-service" }} className="text-primary hover:underline">bike service in Bangalore</Link>,{" "}
        <Link to="/$service" params={{ service: "motorcycle-service" }} className="text-primary hover:underline">motorcycle service</Link>,{" "}
        <Link to="/$service" params={{ service: "scooter-service" }} className="text-primary hover:underline">scooter service</Link> or{" "}
        <Link to="/$service" params={{ service: "bike-repair" }} className="text-primary hover:underline">bike repair in Bangalore</Link> — and our{" "}
        <Link to="/areas" className="text-primary hover:underline">bike service areas in Bangalore</Link>.
      </p>

      {/* Conversion CTA — existing booking modal, call and WhatsApp functionality */}
      <div className="mt-8 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h3 className="text-2xl font-bold text-primary-foreground">Need Bike Service or Repair in Bangalore?</h3>
        <p className="mt-2 text-primary-foreground/90">
          Book Ride N Care for convenient bike service and repair at your location, subject to service availability in your area.
        </p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <BookingButton vehicle="bike" serviceId={bookingServiceId} className="btn-book rounded-full px-6 py-3 font-semibold">Book a Service</BookingButton>
          <a
            href="tel:+918069409289"
            {...ctcProps("call_click", { vehicle_type: "bike", service: "doorstep-bike-service" })}
            className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground"
          >
            Call Now
          </a>
          <a
            href="https://wa.me/918296950339"
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", { vehicle_type: "bike", service: "doorstep-bike-service" })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
