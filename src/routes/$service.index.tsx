import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, type ServiceDef, TRUST_POINTS, BIKE_BRANDS } from "@/lib/services";
import { CAR_SERVICES, getCarService, CAR_BRAND_LIST } from "@/lib/car-services";
import { AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { SITE_URL } from "@/lib/seo";
import { formatDate, pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";
import { formatPrice, getBikePackagesForCc, getBookingServiceForSlug, getBookingServiceIdForSlug } from "@/lib/pricing";
import { GUIDES } from "@/lib/guides";
import { answersForService } from "@/lib/answer-pages";

const ALL_SERVICES: ServiceDef[] = [...SERVICES_LIST, ...CAR_SERVICES];
// bike catalogue import kept separate to avoid a circular import at module init
import { SERVICES as SERVICES_LIST } from "@/lib/services";

export const Route = createFileRoute("/$service/")({
  head: ({ params }) => {
    const s = getService(params.service) ?? getCarService(params.service);
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
          faqNode(s.faqs),
        ]),
      ),
    };
  },
  loader: ({ params }) => {
    const service = getService(params.service) ?? getCarService(params.service);
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
  const { service: s } = Route.useLoaderData() as { service: ServiceDef };
  const isCar = CAR_SERVICES.some((c) => c.slug === s.slug);
  const vehicleType = isCar ? "car" : "bike";
  const related = s.related.map((slug) => getService(slug) ?? getCarService(slug)).filter(Boolean) as ServiceDef[];
  const relatedGuides = s.relatedGuides.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(Boolean);
  const relatedAnswers = answersForService(s.slug);
  const bookingService = getBookingServiceForSlug(s.slug);
  const bookingServiceId = getBookingServiceIdForSlug(s.slug);
  const examplePackage = bookingServiceId ? getBikePackagesForCc(199).find((item) => item.serviceId === bookingServiceId) : undefined;
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
        <BookingButton vehicle={vehicleType} serviceId={bookingServiceId} className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Book Now</BookingButton>
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
          className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          WhatsApp 82969 50339
        </a>
      </div>

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
          <BookingButton vehicle={vehicleType} serviceId={bookingServiceId} variant="outline" className="rounded-full border-background/40 bg-transparent px-6 py-3 text-primary-foreground hover:bg-background hover:text-foreground">Book Now</BookingButton>
        </div>
      </div>

      {/* Review stamp */}
      <p className="mt-6 text-center text-xs text-muted-foreground">Last reviewed: {formatDate(s.reviewed)}</p>
    </div>
  );
}
