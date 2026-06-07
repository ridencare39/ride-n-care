import { createFileRoute } from "@tanstack/react-router";

const faqs = [
  ["Do you really come to my home?", "Yes. Our mechanics arrive at your doorstep with tools, diagnostics and genuine spares — across Bangalore."],
  ["How long does a service take?", "Most bike services are done in 45–90 minutes. Car periodic service typically takes 90–150 minutes."],
  ["Are parts genuine?", "Always. We use OEM-grade parts and provide a printed invoice with warranty details."],
  ["What if a problem appears after service?", "We offer a 7-day post-service guarantee — we'll revisit and fix any issue free of cost."],
  ["What payments do you accept?", "UPI, all major cards, NetBanking, and cash on completion. Quotes are shared upfront."],
  ["Do you offer pickup & drop?", "Yes — free pickup and drop is included for full service packages within city limits."],
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Ride N Care" },
      { name: "description", content: "Answers about doorstep bike & car service: timing, parts, payments, pickup & drop, warranty and more." },
      { property: "og:title", content: "FAQ — Ride N Care" },
      { property: "og:description", content: "Common questions about Ride N Care doorstep service." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({
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
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-5xl font-bold">Frequently asked questions</h1>
      <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
        {faqs.map(([q, a]) => (
          <details key={q} className="group p-6">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
              <span className="font-semibold">{q}</span>
              <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}