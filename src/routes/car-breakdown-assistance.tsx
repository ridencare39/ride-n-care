import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, CarFront, TriangleAlert, MapPin, Lightbulb, Wrench, ArrowRight, LifeBuoy } from "lucide-react";
import { formatDate, pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

const SLUG = "car-breakdown-assistance";
const REVIEWED = "2026-09-20";

const TITLE = "Car Breakdown Assistance in Bangalore | Ride N Care";
const DESCRIPTION =
  "Car breakdown assistance in Bangalore — a mechanic comes to your car, diagnoses the fault and confirms the price in writing before work starts."

/** 45 words — answer-first quick answer. */
const SUMMARY =
  "Car breakdown assistance sends a mechanic to wherever your car has stopped — home, office or roadside. The fault is diagnosed on arrival, what can be fixed at the location is fixed, and anything bigger moves to the workshop. The price is confirmed in writing before work starts.";

const FAQS: [string, string][] = [
  [
    "Do you repair cars at the roadside?",
    "The mechanic comes to where the car is, diagnoses the fault and carries out what can safely be done at the location. Repairs that need a workshop are moved there, with the estimate shared before any work begins.",
  ],
  [
    "How much does car breakdown assistance cost?",
    "The callout and the repair are priced on the call and confirmed in writing before work starts — you approve the itemised quote before any spanner is lifted.",
  ],
  [
    "My car will not start — can you help?",
    "Yes. A no-start is diagnosed at your location — battery, fuel or electrical — and the fix or the next step is explained before work starts.",
  ],
  [
    "Which areas do you cover?",
    "All 40 confirmed Ride N Care service localities across east, south, north, west and central Bangalore — see the areas page for the full list.",
  ],
  [
    "What happens if my car cannot be fixed on the spot?",
    "The mechanic explains what is wrong and the call confirms how the car is moved and what happens next, with the repair estimate shared before work begins.",
  ],
  [
    "Can you service the car at my home afterwards?",
    "Yes — periodic service, AC service, battery replacement and brake pad replacement are all done at your home or office. See the car services page for the full list.",
  ],
];

export const Route = createFileRoute("/car-breakdown-assistance")({
  head: () => ({
    ...pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: `/${SLUG}`,
      extraMeta: [
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
      ],
    }),
    scripts: pageScripts(
      graphForPage([
        serviceNode({
          slug: SLUG,
          name: "Car Breakdown Assistance",
          serviceType: "Car Breakdown Assistance",
          description: SUMMARY,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Bike & Car Breakdown Assistance", "/breakdown-assistance"],
          ["Car Breakdown Assistance", `/${SLUG}`],
        ]),
        faqNode(FAQS),
      ]),
    ),
  }),
  component: CarBreakdown,
});

function CarBreakdown() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link to="/breakdown-assistance" className="hover:text-primary">
          Breakdown Assistance
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground/80">Car</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Car Breakdown Assistance in Bangalore</h1>
      <p className="mt-2 text-muted-foreground">
        A mechanic comes to your car, diagnoses the fault and confirms the price in writing before work starts.
      </p>

      {/* Answer-first summary (AEO) */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Quick answer</p>
        <p className="mt-2 leading-relaxed text-foreground">{SUMMARY}</p>
      </div>

      {/* First-row CTAs with tracking */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", { vehicle_type: "car", service: SLUG })}
          className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow"
        >
          Call 080 6940 9289
        </a>
        <a
          href={`https://wa.me/918296950339?text=${encodeURIComponent("Hi Ride N Care, my vehicle has broken down. Location: ")}`}
          target="_blank"
          rel="noopener"
          {...ctcProps("whatsapp_click", { vehicle_type: "car", service: SLUG })}
          className="rounded-full border border-primary/40 px-6 py-3 font-semibold text-primary hover:bg-primary/5"
        >
          WhatsApp 82969 50339
        </a>
      </div>

      {/* Choice cards */}
      <section className="mt-12" aria-label="Choose your vehicle">
        <h2 className="text-2xl font-bold">Not a car, or not sure?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            to="/breakdown-assistance"
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-neon/40 hover:bg-white/[0.07]"
          >
            <LifeBuoy aria-hidden className="h-8 w-8 text-neon" />
            <h3 className="mt-3 text-lg font-bold">Any Vehicle Breakdown</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              One call for bikes, scooters and cars — the breakdown assistance hub explains how the callout works end to end.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neon">
              Breakdown assistance hub <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/$service"
            params={{ service: "bike-breakdown-assistance" }}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
          >
            <Bike aria-hidden className="h-8 w-8 text-cyan-300" />
            <h3 className="mt-3 text-lg font-bold">Bike or Scooter Breakdown</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Roadside diagnosis, jump-start, puncture and cable fixes, and recovery to the workshop when the bike cannot be
              made rideable. Doorstep visits available 24 hours.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
              Bike breakdown assistance <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
        <div className="mt-5">
          <BookingButton vehicle="car" className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
            Book Now
          </BookingButton>
        </div>
      </section>

      {/* What to do first — general safety advice */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">What to do first</h2>
        <ul className="mt-4 space-y-3">
          {[
            [MapPin, "Move to a safe spot", "Pull as far off the road as you can — a side lane, service road or parking bay — before getting out."],
            [TriangleAlert, "Switch on hazard lights", "Make the car visible to traffic from a distance, especially at night or in rain."],
            [Lightbulb, "Do not attempt repairs on a highway or busy road", "Changing a wheel or opening the bonnet next to live traffic is how minor breakdowns become serious accidents."],
            [Wrench, "Leave the diagnosis to the mechanic", "Repeated cranking or a wrongly connected jump start can turn a small fault into an expensive one."],
            [MapPin, "Share your live location on WhatsApp", "A dropped pin on 82969 50339 gets the mechanic to your exact spot without a relay of confusing landmarks."],
          ].map(([Icon, title, body]) => (
            <li key={title as string} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
              <div>
                <h3 className="font-semibold">{title as string}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{body as string}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* On the spot vs workshop — generic until the owner confirms car specifics */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">What we can fix on the spot vs what needs a workshop</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-neon">Done at your location</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>On-site fault diagnosis</li>
              <li>Fixes that can safely be carried out where the car stands</li>
              <li>Parts shown to you before fitting, with part numbers on the invoice</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">The mechanic confirms on arrival what applies to your car.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-neon">Needs the workshop</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Repairs that need a lift, workshop tools or more time than the roadside allows</li>
              <li>Accident recovery — call first so the car is secured and moved safely</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">How the car is moved, and what happens next, is confirmed on the call.</p>
          </div>
        </div>
      </section>

      {/* Car services that follow a breakdown */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">After the breakdown: car services at your door</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Car Periodic Service", "/car-periodic-service"],
            ["Car AC Service & Gas Refill", "/car-ac-service"],
            ["Car Battery Replacement", "/car-battery-service"],
            ["Car Brake Pad Replacement", "/car-brake-service"],
          ].map(([label, to]) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold transition hover:border-violet-300/40"
              >
                {label}
                <ArrowRight aria-hidden className="h-4 w-4 text-violet-300" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQs */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-4">
          {FAQS.map(([q, a]) => (
            <div key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-semibold">{q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related answers */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Related answers</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/answers/$slug" params={{ slug: "recovery-after-breakdown" }} className="text-primary hover:underline">
              What happens if my bike cannot be repaired on the spot? →
            </Link>
          </li>
          <li>
            <Link to="/answers/$slug" params={{ slug: "periodic-vs-breakdown" }} className="text-primary hover:underline">
              What is the difference between periodic service and breakdown service? →
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">Last reviewed: {formatDate(REVIEWED)}</p>

      {/* CTA band */}
      <div className="mt-8 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Car broken down right now?</h2>
        <p className="mt-2 text-primary-foreground/90">Written quote first. OEM-grade parts, digital invoice, 7-day guarantee.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="tel:+918069409289"
            {...ctcProps("call_click", { vehicle_type: "car", service: SLUG })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            Call 080 6940 9289
          </a>
          <a
            href={`https://wa.me/918296950339?text=${encodeURIComponent("Hi Ride N Care, my vehicle has broken down. Location: ")}`}
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", { vehicle_type: "car", service: SLUG })}
            className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground"
          >
            WhatsApp 82969 50339
          </a>
        </div>
      </div>
    </div>
  );
}
