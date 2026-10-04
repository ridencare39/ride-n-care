import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, type ServiceDef } from "@/lib/services";
import { getCarService } from "@/lib/car-services";
import { getServiceSummary, getCarServiceSummary, CAR_SERVICE_SUMMARY, type ServiceSummary } from "@/lib/service-summary";
import { getArea, AREAS, areaRobots, isConfirmedArea, type Area } from "@/lib/areas";
import { isCarAreaPublished, getCarAreaEntry, carAreaLinksForService } from "@/lib/car-area-content";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { pageHead, seoTitle } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, nearbyAreasNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";
import { formatPrice, getBikePackagesForCc, getBookingServiceForSlug, getBookingServiceIdForSlug } from "@/lib/pricing";
import { answersForService } from "@/lib/answer-page-summary";

export const Route = createFileRoute("/$service/$area")({
  loader: ({ params }) => {
    // Loader resolves the slim summary; the lazy component resolves the full
    // def, keeping detail content out of the shared route chunk.
    const service = getServiceSummary(params.service) ?? getCarServiceSummary(params.service);
    const area = getArea(params.area);
    if (!service || !area) throw notFound();
    // Bike: template pages only for services flagged local:true.
    // Car: template pages are DISABLED — only quality-gated wave-1 pairs render.
    if (isCarService(service.slug)) {
      if (!isCarAreaPublished(service.slug, params.area)) throw notFound();
    } else if (!service.local) {
      throw notFound();
    }
    return { service, area };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const { service, area: a } = loaderData;
    const s = service as ServiceSummary;
    const url = `${SITE_URL}/${s.slug}/${a.slug}`;
    const isCar = isCarService(s.slug);
    const title = seoTitle(s.name, a.name);
    const desc = isCar
      ? `${s.name} at your doorstep in ${a.name}, Bangalore — written quote before work starts, OEM-grade parts, 45-day service warranty. Call 080 6940 9289.`
      : `${s.name} near you in ${a.name}, Bangalore at your doorstep. Background-verified mechanics, OEM parts, written quotes, 45-day warranty. Call 080 6940 9289.`;
    // Car pair pages lead with the written pair-specific answer from the gate registry.
    const entry = isCar ? getCarAreaEntry(s.slug, a.slug) : undefined;
    const nearbyAreas = AREAS.filter((x) => a.nearby?.includes(x.name)).slice(0, 5);
    return {
      ...pageHead({ title, description: desc, path: `/${s.slug}/${a.slug}`, robots: areaRobots(a) }),
      scripts: pageScripts(
        graphForPage([
          serviceNode({
            slug: `${s.slug}/${a.slug}`,
            name: `${s.name} in ${a.name}`,
            serviceType: s.serviceType,
            description: entry ? entry.areaAnswer : desc,
            priceFrom: s.priceFrom,
            // areaServed as a Place only where coverage is owner-confirmed.
            ...(isConfirmedArea(a) ? { areaName: a.name, pincode: a.pincode } : {}),
          }),
          breadcrumbNode([
            ["Home", "/"],
            [s.name, `/${s.slug}`],
            [a.name, `/${s.slug}/${a.slug}`],
          ]),
          ...(nearbyAreas.length > 0 ? [nearbyAreasNode(nearbyAreas)] : []),
          // FAQPage mirrors the visible FAQ section (car: pair-specific entries;
          // bike: the service FAQ set rendered below).
          faqNode(entry ? entry.faqs : s.faqs), // summary faqs — mirrors the visible section
        ]),
      ),
    };
  },
  component: LocalServicePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">We may not cover this combination yet.</p>
      <Link to="/areas" className="mt-4 inline-block text-primary">← See all service areas</Link>
    </div>
  ),
});

function isCarService(slug: string) {
  return CAR_SERVICE_SUMMARY.some((c) => c.slug === slug);
}

function LocalServicePage() {
  const { service, area: a } = Route.useLoaderData() as { service: ServiceSummary; area: Area };
  // Full content def resolved inside the lazy component.
  const s = (getService(service.slug) ?? getCarService(service.slug)) as ServiceDef;
  const isCar = isCarService(s.slug);
  const entry = isCar ? getCarAreaEntry(s.slug, a.slug) : undefined;
  const sameZone = AREAS.filter((x) => x.zone === a.zone && x.slug !== a.slug).slice(0, 6);
  const nearbyAreas = AREAS.filter((x) => a.nearby?.includes(x.name)).slice(0, 5);
  // The zone-chip set exactly as rendered below — shared so the sibling-chip
  // exclusion below can never duplicate a link already shown (cross-link task).
  // Car pages keep the original published-pair gate; bikes are all local.
  const zoneChips = sameZone
    .filter((o) => !nearbyAreas.some((n) => n.slug === o.slug) && (!isCar || isCarAreaPublished(s.slug, o.slug)))
    .slice(0, 3);
  const relatedAnswers = answersForService(s.slug);
  const bookingService = getBookingServiceForSlug(s.slug);
  const bookingServiceId = getBookingServiceIdForSlug(s.slug);
  const examplePackage = bookingServiceId ? getBikePackagesForCc(199).find((item) => item.serviceId === bookingServiceId) : undefined;
  const ctc = { service: s.slug, area: a.slug, vehicle_type: isCar ? "car" : "bike" } as const;
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <Link to="/$service" params={{ service: s.slug }} className="hover:text-primary">{s.name}</Link>
        <span className="mx-1">/</span> <span>{a.name}</span>
      </nav>

      <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        {a.zone} Bangalore · {a.pincode ?? ""}
      </span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">
        {s.name} in <span className="text-primary">{a.name}</span>, Bangalore
      </h1>

      {/* Answer-first box: car pairs use their own gated copy; bikes use s.intro */}
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {isCar && entry ? (
          <>
            {entry.areaAnswer} In {a.name}, a background-verified mechanic is assigned from the unit nearest you and the arrival window is confirmed when you book. We also cover{" "}
            {(a.nearby ?? []).join(", ") || "nearby streets"} from the same unit.
          </>
        ) : (
          <>
            {s.intro} In {a.name}, a verified mechanic is assigned from the unit nearest to you and your arrival window is confirmed when you book. We also cover{" "}
            {(a.nearby ?? []).join(", ") || "nearby streets"} from the same unit.
          </>
        )}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {isCar ? (
          <a
            href={`https://wa.me/918296950339?text=${encodeURIComponent(`Hi Ride N Care, I need ${s.name} in ${a.name}. My car is: `)}`}
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", ctc)}
            className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            WhatsApp for a written quote
          </a>
        ) : (
          <BookingButton vehicle="bike" serviceId={bookingServiceId} className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        )}
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", ctc)}
          className="rounded-full border border-border px-6 py-3 font-semibold"
        >
          Call 080 6940 9289
        </a>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat v="Written quote" l="Before any work starts" />
        <Stat v="OEM-grade" l="Parts shown before fitting" />
        <Stat v="45-day" l="Service warranty" />
      </div>

      {isCar && entry ? (
        <>
          <h2 className="mt-12 text-2xl font-bold">Local notes — {s.name.toLowerCase()} in {a.name}</h2>
          {entry.areaNotes.map((para) => (
            <p key={para} className="mt-4 text-muted-foreground leading-relaxed">{para}</p>
          ))}

          <h2 className="mt-12 text-2xl font-bold">What the visit includes</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {s.includes.map((i) => (
              <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold">What to have ready</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {entry.prepare.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold">Pricing</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">{s.pricing}</p>

          <h2 className="mt-12 text-2xl font-bold">Honest limits</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {s.limits.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold">{s.name} FAQs — {a.name}</h2>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {entry.faqs.map(([q, ans]) => (
              <div key={q} className="p-4">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ans}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-12 text-2xl font-bold">Booking package details</h2>
          {bookingService && examplePackage ? <><div className="mt-3 flex flex-wrap items-center gap-3"><span className="font-semibold">{bookingService.name}</span><span className="rounded-full border border-border bg-card px-4 py-2 text-sm">From {formatPrice(examplePackage.price)}</span></div><ul className="mt-4 grid sm:grid-cols-2 gap-2">{bookingService.includes.map((i) => <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>)}</ul></> : <p className="mt-3 text-muted-foreground">Select your vehicle and service in Book Now to see the exact verified package, price and inclusions available for your booking.</p>}

          <h2 className="mt-12 text-2xl font-bold">Why {a.name} riders book us</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {s.benefits.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-4">
                <div className="font-semibold">{t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-bold">{s.name} FAQs — {a.name}</h2>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {s.faqs.map(([q, ans]) => (
              <div key={q} className="p-4">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ans}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Related answers — AEO internal links, data-driven (indexing audit 2026-09-29) */}
      {relatedAnswers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Related answers</h2>
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
        </div>
      )}

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">More services in {a.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.related.map(getService).filter((r): r is ServiceDef => Boolean(r?.local)).map((r) => (
              <Link key={r.slug} to="/$service/$area" params={{ service: r.slug, area: a.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                {r.name} in {a.name}
              </Link>
            ))}
            {CAR_SERVICE_SUMMARY.filter((c) => isCarAreaPublished(c.slug, a.slug)).map((c) => (
              <Link key={c.slug} to="/$service/$area" params={{ service: c.slug, area: a.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                {c.name} in {a.name}
              </Link>
            ))}
          </div>
          {/* Sibling coverage for the same service (car×area cross-linking task,
              2026-09-30): registry-driven chips to the other published localities
              for this service — mirrors the bike-cluster pattern. Areas already
              linked above (nearby/zone chips) are excluded to avoid duplicates. */}
          {isCar && carAreaLinksForService(s.slug).filter((sib) => sib.slug !== a.slug).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-muted-foreground">{s.name} in other localities</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {carAreaLinksForService(s.slug)
                  .filter((sib) => sib.slug !== a.slug && !nearbyAreas.some((n) => n.slug === sib.slug) && !zoneChips.some((z) => z.slug === sib.slug))
                  .map((sib) => (
                    <Link key={`sib-${sib.slug}`} to="/$service/$area" params={{ service: s.slug, area: sib.slug }} className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-primary hover:text-primary">
                      {sib.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{s.name} in nearby areas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearbyAreas.filter((o) => !isCar || isCarAreaPublished(s.slug, o.slug)).map((o) => (
              <Link key={`near-${o.slug}`} to="/$service/$area" params={{ service: s.slug, area: o.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                📍 {o.name}
              </Link>
            ))}
            {zoneChips.map((o) => (
              <Link key={`zone-${o.slug}`} to="/$service/$area" params={{ service: s.slug, area: o.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                {o.name}
              </Link>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Also serving {(a.nearby ?? []).join(", ") || "surrounding streets"}.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book {s.name.toLowerCase()} in {a.name}</h2>
        <p className="mt-2 text-primary-foreground/90">Send your vehicle model and preferred time — the written quote comes before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a
            href={`https://wa.me/918296950339?text=${encodeURIComponent(`Hi Ride N Care, I need ${s.name} in ${a.name}. My ${isCar ? "car" : "vehicle"} is: `)}`}
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", ctc)}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            Chat on WhatsApp
          </a>
          {isCar ? (
            <a
              href="tel:+918069409289"
              {...ctcProps("call_click", ctc)}
              className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground"
            >
              Call 080 6940 9289
            </a>
          ) : (
            <BookingButton vehicle="bike" serviceId={bookingServiceId} className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
          )}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        See the full <Link to="/$service" params={{ service: s.slug }} className="text-primary">{s.name}</Link> page, our{" "}
        <Link to={isCar ? "/cars" : "/bikes"} className="text-primary">packages &amp; pricing</Link>, every service available in{" "}
        <Link to="/areas/$slug" params={{ slug: a.slug }} className="text-primary">{a.name}</Link>, or nearby{" "}
        <Link to="/areas" className="text-primary">service areas</Link>.
      </p>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-2xl font-display font-bold text-primary">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}
