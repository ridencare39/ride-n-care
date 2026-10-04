import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead, pageScripts, formatDate } from "@/lib/head";
import { graphForPage, webPageNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { ShieldCheck, Phone, MessageCircle, BadgeCheck } from "lucide-react";
import { FloatingActions } from "@/components/FloatingActions";

const WARRANTY_UPDATED = "2026-10-02";

const DESCRIPTION =
  "The Ride N Care 45-day service warranty in Bangalore: what eligible bike and car service work is covered, how parts are treated, what is excluded and how to claim after your doorstep service.";

/** FAQPage JSON-LD + on-page FAQ — wording mirrors the approved policy exactly. */
const FAQS: [string, string][] = [
  ["How long is the Ride N Care warranty?", "45 days from the date the service or repair is completed, as shown on your Ride N Care invoice."],
  ["What does the 45-day warranty cover?", "Workmanship-related issues arising from eligible service or repair work performed by Ride N Care."],
  ["Does it cover every part?", "No. Parts supplied and installed by Ride N Care are covered only where applicable, subject to their eligibility and any relevant manufacturer or supplier warranty terms shown on the invoice."],
  ["What is not covered?", "Normal wear and tear, consumables, accidental damage, misuse, unauthorized repairs or modifications, unrelated faults and damage caused by external factors are not automatically covered."],
  ["How do I raise a warranty claim?", "Contact Ride N Care with your booking or invoice details and explain the issue. The team inspects the vehicle and determines whether the issue falls within the policy."],
  ["When does the warranty start?", "On the completion date of the service or repair printed on your invoice."],
];

const head = pageHead({
  title: "45-Day Service Warranty in Bangalore | Ride N Care",
  description: DESCRIPTION,
  path: "/guarantee",
});

export const Route = createFileRoute("/guarantee")({
  head: () => ({
    meta: head.meta,
    links: head.links,
    scripts: pageScripts(
      graphForPage([
        webPageNode({
          url: "https://ridencare.co.in/guarantee",
          name: "45-Day Service Warranty",
          description: DESCRIPTION,
          dateModified: WARRANTY_UPDATED,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["45-Day Service Warranty", "/guarantee"],
        ]),
        faqNode(FAQS),
      ]),
    ),
  }),
  component: WarrantyPage,
});

const COVERED: [string, string][] = [
  [
    "Workmanship coverage",
    "Eligible repair and service work performed by Ride N Care is covered for workmanship-related issues arising from the original work — for example a fitting, adjustment or installation from our visit that does not hold. The team inspects the vehicle and determines whether the issue falls within this policy.",
  ],
  [
    "Parts coverage",
    "Parts supplied and installed by Ride N Care are covered only where applicable, subject to their eligibility and any relevant manufacturer or supplier warranty terms, noted on your invoice where applicable. The 45-day warranty does not extend manufacturer or supplier warranty periods, and not every part carries a separate parts warranty.",
  ],
];

const NOT_COVERED: [string, string][] = [
  ["Wear and consumables", "Normal wear and tear and consumables are not automatically covered."],
  ["Accidental damage and misuse", "Accidental damage, misuse, and unauthorized repairs or modifications are not automatically covered."],
  ["Unrelated or external damage", "Faults unrelated to the original work, and damage caused by external factors, are not covered by this warranty."],
];

function WarrantyPage() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <Link to="/" className="hover:text-cyan-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">45-day service warranty</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Ride N Care policy</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Our 45-Day Service Warranty</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: {formatDate(WARRANTY_UPDATED)}</p>

        <section className="mt-8 rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-5">
          <h2 className="text-xl font-semibold">The warranty in one sentence</h2>
          <p className="mt-3 leading-relaxed text-white/80">
            Eligible service and repair work performed by Ride N Care is covered by a 45-day warranty,
            starting from the date the service or repair is completed.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Warranty period</h2>
          <p className="mt-3 leading-relaxed text-white/80">
            The warranty runs for 45 days from the date the service or repair is completed, as shown on your
            Ride N Care invoice. Your booking or invoice details are your proof of purchase.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">What is covered</h2>
          <ul className="mt-4 space-y-3">
            {COVERED.map(([t, d]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-cyan-300" aria-hidden />
                <p className="text-sm leading-relaxed text-white/80">
                  <strong className="font-semibold text-white">{t}:</strong> {d}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">What is not covered</h2>
          <p className="mt-3 leading-relaxed text-white/80">
            Normal wear and tear, consumables, accidental damage, misuse, unauthorized repairs or
            modifications, unrelated faults, and damage caused by external factors are not automatically
            covered.
          </p>
          <ul className="mt-4 space-y-3">
            {NOT_COVERED.map(([t, d]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-white/40" aria-hidden />
                <p className="text-sm leading-relaxed text-white/80">
                  <strong className="font-semibold text-white">{t}:</strong> {d}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Pre-existing conditions identified during inspection are diagnosed and quoted separately rather
            than covered by this warranty.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">How to make a claim</h2>
          <ol className="mt-4 space-y-3">
            {[
              "Contact Ride N Care with your booking or invoice details and explain the issue.",
              "The team inspects the vehicle and determines whether the issue falls within this policy.",
              "If an eligible claim is approved, Ride N Care provides an appropriate correction or repair in accordance with this policy.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-bold text-cyan-300">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-white/80">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="tel:+918069409289"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              <Phone className="size-4" aria-hidden /> Call 080 6940 9289
            </a>
            <a
              href="https://wa.me/918296950339"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp 82969 50339
            </a>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Warranty questions</h2>
          <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group p-4">
                <summary className="cursor-pointer list-none font-semibold text-white">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-8 text-sm text-white/50">
          This warranty applies to eligible service and repair work completed on or after the policy date.
          Service pages: <Link to="/bikes" className="text-cyan-300 hover:underline">bike service</Link> ·{" "}
          <Link to="/cars" className="text-cyan-300 hover:underline">car service</Link> ·{" "}
          <Link to="/contact" className="text-cyan-300 hover:underline">contact & booking</Link>
        </p>
      </div>
      <FloatingActions />
    </div>
  );
}
