import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, CarFront, TriangleAlert, MapPin, Lightbulb, Wrench, ArrowRight } from "lucide-react";
import { DISPATCH_STEPS } from "@/lib/services";
import { pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

const SLUG = "breakdown-assistance";
const REVIEWED = "2026-09-20";

const TITLE = "Bike & Car Breakdown Assistance in Bangalore | Ride N Care";
const DESCRIPTION =
  "Breakdown assistance for bikes, scooters and cars in Bangalore — roadside diagnosis, on-spot fixes and workshop recovery. Call 080 6940 9289 or WhatsApp 82969 50339.";

/** 47 words — answer-first quick answer. */
const SUMMARY =
  "Breakdown assistance sends a mechanic to your vehicle wherever it has stopped — home, office or roadside — to diagnose the fault, fix what can be fixed on the spot and arrange recovery to the workshop when it cannot. Call 080 6940 9289 or WhatsApp 82969 50339 with your location.";

const FAQS: [string, string][] = [
  [
    "Is breakdown assistance available for both bikes and cars?",
    "Yes — the callout covers two-wheelers and cars. The mechanic assesses the vehicle on arrival, explains what is wrong, fixes what can be fixed on the spot and confirms the price before work starts.",
  ],
  [
    "What should I do while I wait for the mechanic?",
    "Move the vehicle to a safe spot away from traffic if you can, switch on the hazard lights, and do not attempt repairs on a highway or busy road. Share your live location on WhatsApp so the mechanic reaches you directly.",
  ],
  [
    "How much does breakdown assistance cost?",
    "The callout is quoted on the phone before anyone rides out. For bikes, the Running Repair package is ₹450 — fault inspection, minor repair labour and a safety check — with parts billed at MRP only after your approval. Car pricing is confirmed in writing before work starts.",
  ],
  [
    "What happens if the vehicle cannot be repaired on the spot?",
    "For bikes, recovery to the nearest Ride N Care workshop within the city is included once you approve the next step, with the repair estimate shared before work begins. For cars, the call will confirm how the vehicle is moved.",
  ],
  [
    "Is breakdown assistance available on holidays?",
    "Bike breakdown assistance runs every day between 8 AM and 9 PM, holidays included. Car callouts are arranged on request — call to confirm availability for your vehicle.",
  ],
  [
    "Which areas do you cover?",
    "All forty Ride N Care service localities across Bangalore — see the areas page for the full list.",
  ],
];

export const Route = createFileRoute("/breakdown-assistance")({
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
          name: "Bike & Car Breakdown Assistance",
          serviceType: "Breakdown Assistance",
          description: SUMMARY,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Bike & Car Breakdown Assistance", `/${SLUG}`],
        ]),
        faqNode(FAQS),
      ]),
    ),
  }),
  component: BreakdownHub,
});

function BreakdownHub() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground/80">Breakdown Assistance</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Bike &amp; Car Breakdown Assistance in Bangalore</h1>
      <p className="mt-2 text-muted-foreground">
        One call for any vehicle that has stopped — roadside diagnosis, on-spot fixes and workshop recovery.
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
          {...ctcProps("call_click", { service: SLUG })}
          className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow"
        >
          Call 080 6940 9289
        </a>
        <a
          href={`https://wa.me/918296950339?text=${encodeURIComponent("Hi Ride N Care, my vehicle has broken down. Location: ")}`}
          target="_blank"
          rel="noopener"
          {...ctcProps("whatsapp_click", { service: SLUG })}
          className="rounded-full border border-primary/40 px-6 py-3 font-semibold text-primary hover:bg-primary/5"
        >
          WhatsApp 82969 50339
        </a>
      </div>

      {/* Choice cards */}
      <section className="mt-12" aria-label="Choose your vehicle">
        <h2 className="text-2xl font-bold">Which vehicle needs help?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            to="/$service"
            params={{ service: "bike-breakdown-assistance" }}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
          >
            <Bike aria-hidden className="h-8 w-8 text-cyan-300" />
            <h3 className="mt-3 text-lg font-bold">Bike or Scooter Breakdown</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Roadside diagnosis, jump-start, puncture and cable fixes, and recovery to the workshop when the bike cannot be
              made rideable. Every day, 8 AM to 9 PM.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
              Bike breakdown assistance <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/car-breakdown-assistance"
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-300/40 hover:bg-white/[0.07]"
          >
            <CarFront aria-hidden className="h-8 w-8 text-violet-300" />
            <h3 className="mt-3 text-lg font-bold">Car Breakdown</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              A mechanic comes to your car, diagnoses the fault and confirms the price in writing before work starts —
              roadside where possible, workshop where not.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300">
              Car breakdown assistance <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
        <div className="mt-5">
          <BookingButton className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
            Book Now
          </BookingButton>
        </div>
      </section>

      {/* What to do first — general safety advice */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">What to do first</h2>
        <ul className="mt-4 space-y-3">
          {[
            [
              MapPin,
              "Move to a safe spot",
              "Pull as far off the road as you can — a side lane, service road or parking bay — before getting out.",
            ],
            [
              TriangleAlert,
              "Switch on hazard lights",
              "Make the vehicle visible to traffic from a distance, especially at night or in rain.",
            ],
            [
              Lightbulb,
              "Do not attempt repairs on a highway or busy road",
              "Changing a wheel or poking around an engine next to live traffic is how minor breakdowns become serious accidents.",
            ],
            [
              Wrench,
              "Leave the diagnosis to the mechanic",
              "Repeated cranking on a flooded bike or jump-starting a car wrongly can turn a small fault into an expensive one.",
            ],
            [
              MapPin,
              "Share your live location on WhatsApp",
              "A dropped pin on 82969 50339 gets the mechanic to your exact spot without a relay of confusing landmarks.",
            ],
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

      {/* On the spot vs workshop — sourced from the bike breakdown page */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">What we can fix on the spot vs what needs a workshop</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-neon">Fixed at the roadside</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Jump-start and battery service</li>
              <li>Fuel, plug and water-ingress troubleshooting</li>
              <li>Cable, fuse and clutch fixes</li>
              <li>Puncture repair</li>
              <li>Roadside fault diagnosis</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Sourced from bike breakdown assistance; the mechanic confirms what applies to your vehicle.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-neon">Needs the workshop</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Major roadside repairs — the bike is recovered to the workshop instead</li>
              <li>Requests after 9 PM — queued for the next morning's first slot</li>
              <li>Accident recovery — call first so the vehicle is secured and moved safely</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Recovery for bikes within the city is free once you approve the next step; the repair estimate is shared before
              work begins.
            </p>
          </div>
        </div>
      </section>

      {/* How assistance works — shared dispatch steps */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">How assistance works</h2>
        <ol className="mt-4 space-y-3">
          {DISPATCH_STEPS.map(([title, body]: readonly [string, string]) => (
            <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
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

      {/* Related answers & guides */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Related answers and guides</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/answers/$slug" params={{ slug: "emergency-cost" }} className="text-primary hover:underline">
              What does an emergency bike repair callout cost? →
            </Link>
          </li>
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
          <li>
            <Link to="/answers/$slug" params={{ slug: "battery-jump-start-cost" }} className="text-primary hover:underline">
              How much does a bike battery jump start cost? →
            </Link>
          </li>
          <li>
            <Link
              to="/guides/$slug"
              params={{ slug: "bike-breakdown-troubleshooting-guide" }}
              className="text-primary hover:underline"
            >
              Guide: bike breakdown troubleshooting →
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">Last reviewed: {REVIEWED}</p>

      {/* CTA band */}
      <div className="mt-8 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Broken down right now?</h2>
        <p className="mt-2 text-primary-foreground/90">Written quote first. OEM-grade parts, digital invoice, 7-day guarantee.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="tel:+918069409289"
            {...ctcProps("call_click", { service: SLUG })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            Call 080 6940 9289
          </a>
          <a
            href={`https://wa.me/918296950339?text=${encodeURIComponent("Hi Ride N Care, my vehicle has broken down. Location: ")}`}
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", { service: SLUG })}
            className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground"
          >
            WhatsApp 82969 50339
          </a>
        </div>
      </div>
    </div>
  );
}
