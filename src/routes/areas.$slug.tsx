import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArea, AREAS, areaRobots, isConfirmedArea, type Area } from "@/lib/areas";
import { getAreaContent } from "@/lib/area-content";
import { LOCAL_SERVICE_SUMMARY, type ServiceSummary } from "@/lib/service-summary";
import { CAR_SERVICE_SUMMARY } from "@/lib/service-summary";
import { answersForArea } from "@/lib/answer-page-summary";
import { formatDate, pageHead, seoTitle, pageScripts } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, nearbyAreasNode, faqNode } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.area;
    if (!a) return { meta: [{ title: "Area not found" }] };

    const confirmed = isConfirmedArea(a);
    const content = getAreaContent(a.slug);
    const nearbyAreas = AREAS.filter((x) => a.nearby?.includes(x.name)).slice(0, 5);
    const faqs = content?.faqs ?? genericFaqs(a);
    const summary = confirmed
      ? `Doorstep bike & car service in ${a.name}${a.pincode ? ` ${a.pincode}` : ""} — a background-verified mechanic comes to your home or office parking with a written quote before work starts, OEM-grade parts and a 45-day service warranty.`
      : `Ride N Care serves 40 confirmed localities across east, south, north, west and central Bangalore. Availability in ${a.name} is confirmed on 080 6940 9289 or WhatsApp 82969 50339 before you book — written quote, OEM-grade parts, 45-day service warranty.`;
    const title = seoTitle("Bike & Car Service", a.name);
    const desc = confirmed
      ? `Bike & car service at your gate in ${a.name}, ${a.zone} Bangalore. Periodic service, repairs, AC, battery & brakes. Written quote first, 45-day warranty. Call 080 6940 9289.`
      : `Checking doorstep bike & car service availability in ${a.name}, Bangalore? Confirm your locality on 080 6940 9289 — written quote before work starts, 45-day service warranty.`;

    return {
      ...pageHead({
        title,
        description: desc,
        path: `/areas/${params.slug}`,
        robots: areaRobots(a),
      }),
      scripts: pageScripts(
        graphForPage([
          // Service node only where coverage is confirmed — no false areaServed.
          ...(confirmed
            ? [
                serviceNode({
                  slug: `areas/${params.slug}`,
                  name: `Bike & Car Service in ${a.name}`,
                  serviceType: "Doorstep Bike & Car Service",
                  description: summary,
                  areaName: a.name,
                  pincode: a.pincode,
                }),
              ]
            : []),
          breadcrumbNode([
            ["Home", "/"],
            ["Service Areas", "/areas"],
            [a.name, `/areas/${params.slug}`],
          ]),
          faqNode(faqs),
          ...(nearbyAreas.length > 0 ? [nearbyAreasNode(nearbyAreas)] : []),
        ]),
      ),
    };
  },
  component: AreaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Area not yet covered</h1>
      <p className="mt-2 text-muted-foreground">We're adding new Bangalore areas every month.</p>
      <Link to="/areas" className="mt-4 inline-block text-primary">← Back to all areas</Link>
    </div>
  ),
});

/** Generic, honest FAQs for basic-tier localities (visible + FAQPage schema). */
function genericFaqs(a: Area): [string, string][] {
  return [
    ["How do I book bike or car service in " + a.name + "?", "Call 080 6940 9289 or WhatsApp 82969 50339 with your vehicle model and the service you need. You get a written quote on WhatsApp before any work starts."],
    ["Is doorstep service available in my part of " + a.name + "?", "Share your street or a nearby landmark when you book and we confirm availability and your arrival window when you book."],
    ["What work can be done at the doorstep?", "Periodic service, brake work, battery replacement and clutch or chain work for bikes; periodic service, AC service, battery replacement and brake work for cars. Jobs that need a workshop are arranged with pickup and a written estimate."],
    ["What warranty do I get?", "A 45-day service warranty on the job, plus the manufacturer warranty on parts fitted."],
  ];
}

function AreaPage() {
  const { area: a } = Route.useLoaderData() as { area: Area };
  const confirmed = isConfirmedArea(a);
  const content = getAreaContent(a.slug);
  const faqs = content?.faqs ?? genericFaqs(a);
  const nearbyAreas = AREAS.filter((x) => a.nearby?.includes(x.name)).slice(0, 5);
  const sameZone = AREAS.filter((x) => x.zone === a.zone && x.slug !== a.slug && isConfirmedArea(x)).slice(0, 6);
  const waText = encodeURIComponent(
    confirmed
      ? `Hi Ride N Care, I need doorstep service in ${a.name}. My vehicle is: `
      : `Hi Ride N Care, do you currently cover ${a.name}? My vehicle is: `,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <Link to="/areas" className="hover:text-primary">Service Areas</Link> <span className="mx-1">/</span>
        <span>{a.name}</span>
      </nav>

      <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        {a.zone} Bangalore{a.pincode ? ` · ${a.pincode}` : ""}
      </span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">
        Bike &amp; Car Service in <span className="text-primary">{a.name}</span>, Bangalore
      </h1>

      {!confirmed && (
        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Coverage in {a.name} is being confirmed. Call <a href="tel:+918069409289" {...ctcProps("call_click", { area: a.slug })} className="font-semibold text-primary">080 6940 9289</a> to check availability before booking.
        </div>
      )}

      {/* Answer-first summary */}
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {content?.intro ??
          `Ride N Care brings bike and car service to ${a.name} at your doorstep — a background-verified mechanic works at your parking bay with OEM-grade parts, a written quote before work starts and a 45-day service warranty. Share your street when you book and we confirm your arrival window.`}
      </p>

      {/* Above-the-fold CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="tel:+918069409289" {...ctcProps("call_click", { area: a.slug })} className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Call 080 6940 9289</a>
        <a href={`https://wa.me/918296950339?text=${waText}`} target="_blank" rel="noopener" {...ctcProps("whatsapp_click", { area: a.slug })} className="rounded-full border border-border bg-card px-6 py-3 font-semibold">WhatsApp 82969 50339</a>
        {confirmed && <BookingButton className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>}
      </div>

      {/* Services — bike (service×area) and car (top-level) links */}
      <h2 className="mt-12 text-2xl font-bold">Services at your gate in {a.name}</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Bike services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LOCAL_SERVICE_SUMMARY.map((s: ServiceSummary) => (
              <li key={s.slug}>
                <Link to="/$service/$area" params={{ service: s.slug, area: a.slug }} className="text-primary hover:underline">
                  {s.name} in {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Car services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {CAR_SERVICE_SUMMARY.map((s) => (
              <li key={s.slug}>
                <Link to="/$service" params={{ service: s.slug }} className="text-primary hover:underline">
                  {s.name} in Bangalore
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How doorstep service works here */}
      <h2 className="mt-12 text-2xl font-bold">How doorstep service works in {a.name}</h2>
      {(content?.how ?? [
        `Book on WhatsApp or by phone with your vehicle model, the service and your ${a.name} street or landmark. You receive a written quote before any work starts, and the mechanic is assigned from the unit nearest to you with the arrival window confirmed when you book.`,
        `The job happens at your parking bay — one bay, tools and consumables carried in. You inspect the work before you pay, the invoice arrives on WhatsApp, and the work is covered by the 45-day service warranty. Jobs that need a workshop are arranged with pickup and a written estimate.`,
      ]).map((p, i) => (
        <p key={i} className="mt-3 text-muted-foreground leading-relaxed">{p}</p>
      ))}

      {/* Local context — landmarks from the data file */}
      {a.landmarks && a.landmarks.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-bold">Getting to you in {a.name}</h2>
          <p className="mt-3 text-muted-foreground">
            Bookings here are pinned to the landmarks you know — the mechanic reaches your gate, basement or office bay. Share the closest one below when you book.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {a.landmarks.map((l) => (
              <span key={l} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm">📍 {l}</span>
            ))}
          </div>
        </>
      )}

      {/* Related answers — AEO internal links, data-driven (indexing audit 2026-09-29) */}
      {(() => {
        const relatedAnswers = answersForArea(a.name);
        if (relatedAnswers.length === 0) return null;
        return (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Related answers for {a.name} customers</h2>
            <ul className="mt-3 space-y-1.5">
              {relatedAnswers.map((ap) => (
                <li key={ap.slug}>
                  <Link to="/answers/$slug" params={{ slug: ap.slug }} className="text-primary hover:underline">
                    {ap.question}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/answers" className="mt-3 inline-block text-sm text-muted-foreground hover:text-primary">
              All answers →
            </Link>
          </section>
        );
      })()}

      {/* Nearby areas */}
      {nearbyAreas.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-bold">Nearby areas we serve</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {nearbyAreas.map((o) => (
              <Link key={o.slug} to="/areas/$slug" params={{ slug: o.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                📍 {o.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Area-specific FAQs */}
      <h2 className="mt-12 text-2xl font-bold">{a.name} FAQs</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map(([q, ans]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{ans}</p>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book a doorstep slot in {a.name}</h2>
        <p className="mt-2 text-primary-foreground/90">WhatsApp your model and service — the written quote comes back before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href={`https://wa.me/918296950339?text=${waText}`} target="_blank" rel="noopener" {...ctcProps("whatsapp_click", { area: a.slug })} className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
          {confirmed && <BookingButton className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>}
        </div>
      </div>

      {/* More areas in the same zone */}
      {sameZone.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold">More {a.zone} Bangalore areas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {sameZone.map((o) => (
              <Link key={o.slug} to="/areas/$slug" params={{ slug: o.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                📍 {o.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-12 text-xs text-muted-foreground">Last reviewed: {formatDate("2026-09-20")}</p>
    </div>
  );
}
