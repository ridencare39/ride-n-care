import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, faqNode, pageScripts } from "@/lib/schema";

const SECTIONS: { id: string; title: string; faqs: [string, string][] }[] = [
  {
    id: "general",
    title: "General",
    faqs: [
      ["Do you really come to my home?", "Yes. Our mechanics arrive at your doorstep with tools, diagnostics and OEM-grade spares — across confirmed Bangalore localities. See the areas page for the full list."],
      ["Which areas do you cover in Bangalore?", "Whitefield, Koramangala, HSR Layout, Indiranagar, Electronic City, Jayanagar, Marathahalli and Sarjapur Road, among 40 confirmed localities — see our service areas page for the full list."],
      ["What are your working hours?", "Doorstep visits are available 24 hours. Call 080 6940 9289 or WhatsApp 82969 50339 at any hour; the arrival window is confirmed when you book."],
      ["Is doorstep service safe?", "All mechanics are background-verified and trained. Every visit runs on a written quote first, and you receive a digital invoice listing the parts fitted."],
    ],
  },
  {
    id: "bike",
    title: "Bike Service",
    faqs: [
      ["What does a bike periodic service include?", "Engine oil change, oil & air filter check, brake adjustment, chain lubrication, throttle/clutch tuning, battery health, tyre pressure, headlamp alignment and a 25-point inspection."],
      ["How long does a bike service take?", "Most general services finish in 60–90 minutes at your home; with engine oil replacement allow 75–120 minutes."],
      ["Do you service Royal Enfields and superbikes?", "Yes — including Royal Enfield, KTM, Kawasaki, Harley-Davidson, BMW Motorrad. Premium service tier applies."],
      ["How often should I service my bike?", "Every 2,500–3,500 km for commuter bikes, or every 3 months — whichever comes first."],
    ],
  },
  {
    id: "car",
    title: "Car Service",
    faqs: [
      ["What does a car periodic service include?", "Engine oil + filter change, brake check, coolant top-up, battery test, AC check, all fluid levels, lights, wipers and a multi-point inspection."],
      ["How long does a car service take?", "We confirm the arrival window at booking, and the visit runs until the checklist is complete and you have inspected the work — we do not quote job durations we cannot guarantee."],
      ["Do you handle denting & painting at home?", "Denting and painting need a controlled workshop environment, so we do not offer them at the doorstep. Book a periodic service, AC, battery or brake service — and if bodywork is needed we can advise on next steps."],

    ],
  },
  {
    id: "pricing",
    title: "Pricing & Payments",
    faqs: [
      ["Are parts genuine?", "Always. OEM-grade parts, listed with part numbers on the digital invoice."],
      ["What payments do you accept?", "UPI, all major cards, NetBanking and cash on completion. Quotes are always shared upfront."],
      ["Will I get an invoice?", "Yes — a GST-compliant digital invoice is emailed and shared on WhatsApp after every job."],
      ["Are there any hidden charges?", "No. The written quote you approve before work starts is the final price for the agreed scope — anything found later needs your approval first."],
    ],
  },
  {
    id: "booking",
    title: "Booking & Warranty",
    faqs: [
      ["How do I book a service?", "Tap Book Now and fill the short form, or WhatsApp 82969 50339. You'll get a written quote with the slot details before anything is dispatched."],
      ["How quickly can I get a slot?", "Availability varies by day and locality — call 080 6940 9289 or WhatsApp 82969 50339 and we confirm the earliest open slot for your area."],
      ["What if a problem appears after service?", "Every job carries a 7-day workmanship guarantee. We revisit and fix at zero cost."],
      ["Do you offer pickup & drop?", "Pickup and drop is arranged when a job genuinely needs the workshop — such as an engine rebuild or wheel alignment — with the estimate approved before the vehicle moves."],
    ],
  },
];

const allFaqs = SECTIONS.flatMap((s) => s.faqs);

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...pageHead({
      title: "FAQ | Doorstep Bike Service Bangalore | Ride N Care",
      description:
        "Answers about doorstep bike & car service in Bangalore: booking, timing, parts, payments, coverage and the 7-day workmanship guarantee — all in one place.",
      path: "/faq",
      extraMeta: [
      { property: "og:title", content: "FAQ — Ride N Care" },
    ],
    }),
    scripts: pageScripts(graphForPage([faqNode(allFaqs)])),
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Help Center</span>
      <h1 className="mt-2 text-5xl font-bold">Frequently asked questions</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Everything Bangalore riders & drivers ask before booking their first doorstep service.
      </p>

      {/* Category jumps */}
      <nav className="mt-8 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold">{s.title}</h2>
          <div className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
            {s.faqs.map(([q, a]) => (
              <details key={q} className="group p-6">
                <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
                  <span className="font-semibold">{q}</span>
                  <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Didn't find your answer?</h2>
        <p className="mt-2 text-primary-foreground/90">Message us on WhatsApp — we confirm your slot and the written quote.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="https://wa.me/918296950339" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
          <Link to="/contact" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">Contact us</Link>
        </div>
      </div>
    </div>
  );
}