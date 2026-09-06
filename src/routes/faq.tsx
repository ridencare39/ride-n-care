import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const SECTIONS: { id: string; title: string; faqs: [string, string][] }[] = [
  {
    id: "general",
    title: "General",
    faqs: [
      ["Do you really come to my home?", "Yes. Our mechanics arrive at your doorstep with tools, diagnostics and genuine spares — across 24+ Bangalore localities."],
      ["Which areas do you cover in Bangalore?", "Whitefield, Koramangala, HSR, Indiranagar, Electronic City, Hebbal, Jayanagar, Marathahalli, Sarjapur and many more. See our service areas page for the full list."],
      ["What are your working hours?", "We operate 8 AM to 9 PM, all 7 days a week, including most public holidays."],
      ["Is doorstep service safe?", "All mechanics are police-verified, trained and uniformed. Every visit is tracked and you receive a digital service report."],
    ],
  },
  {
    id: "bike",
    title: "Bike Service",
    faqs: [
      ["What does a bike periodic service include?", "Engine oil change, oil & air filter check, brake adjustment, chain lubrication, throttle/clutch tuning, battery health, tyre pressure, headlamp alignment and a 25-point inspection."],
      ["How long does a bike service take?", "Most bike services finish in 45–90 minutes at your home."],
      ["Do you service Royal Enfields and superbikes?", "Yes — including Royal Enfield, KTM, Kawasaki, Harley-Davidson, BMW Motorrad. Premium service tier applies."],
      ["How often should I service my bike?", "Every 2,500–3,500 km for commuter bikes, or every 3 months — whichever comes first."],
    ],
  },
  {
    id: "car",
    title: "Car Service",
    faqs: [
      ["What does a car periodic service include?", "Engine oil + filter change, brake check, coolant top-up, battery test, AC check, all fluid levels, lights, wipers and a multi-point inspection."],
      ["How long does a car service take?", "Periodic service: 90–150 minutes. AC service: 60–90 minutes. Battery swap: 20 minutes."],
      ["Do you handle denting & painting at home?", "Yes — minor dent removal and touch-up painting are done at your doorstep; full panels are picked up and returned."],
      ["Can you do pre-purchase used car inspections?", "Yes. We send a senior technician with a 200-point checklist and share a written report within 4 hours."],
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Payments",
    faqs: [
      ["Are parts genuine?", "Always. OEM-grade parts with printed invoice and standard warranty."],
      ["What payments do you accept?", "UPI, all major cards, NetBanking and cash on completion. Quotes are always shared upfront."],
      ["Will I get an invoice?", "Yes — a GST-compliant digital invoice is emailed and shared on WhatsApp after every job."],
      ["Are there any hidden charges?", "No. The pre-service quote is final — pickup, drop and inspection are included."],
    ],
  },
  {
    id: "booking",
    title: "Booking & Warranty",
    faqs: [
      ["How do I book a service?", "Tap Book Now, fill the 60-second form, or WhatsApp +91 82969 50339. You'll get a confirmation within 10 minutes."],
      ["Can I get same-day service?", "Yes for most areas — slots booked before 4 PM are completed the same day."],
      ["What if a problem appears after service?", "Every job carries a 7-day workmanship guarantee. We revisit and fix at zero cost."],
      ["Do you offer pickup & drop?", "Yes — free pickup and drop is included for full service packages within Bangalore city limits."],
    ],
  },
];

const allFaqs = SECTIONS.flatMap((s) => s.faqs);

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Doorstep Bike & Car Service in Bangalore | Ride N Care" },
      { name: "description", content: "Answers about doorstep bike & car service: timing, parts, payments, pickup & drop, warranty and more." },
      { property: "og:title", content: "FAQ — Ride N Care" },
      { property: "og:description", content: "Common questions about Ride N Care doorstep service." },
      { property: "og:url", content: `${SITE_URL}/faq` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
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
        <p className="mt-2 text-primary-foreground/90">Our team replies on WhatsApp within minutes.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="https://wa.me/918296950339" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
          <Link to="/contact" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">Contact us</Link>
        </div>
      </div>
    </div>
  );
}