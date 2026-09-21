import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead, pageScripts, formatDate } from "@/lib/head";
import { graphForPage, webPageNode, breadcrumbNode } from "@/lib/schema";
import { ShieldCheck, Phone, MessageCircle, FileText, BadgeCheck, Wrench } from "lucide-react";
import { FloatingActions } from "@/components/FloatingActions";

const GUARANTEE_UPDATED = "2026-09-21";

const DESCRIPTION =
  "The Ride N Care 7-day workmanship guarantee in full: what it covers, what it excludes and how to claim it if something goes wrong after your doorstep service.";

const head = pageHead({
  title: "Our 7-Day Workmanship Guarantee | Ride N Care",
  description: DESCRIPTION,
  path: "/guarantee",
  robots: "noindex, nofollow",
});

export const Route = createFileRoute("/guarantee")({
  head: () => ({
    meta: head.meta,
    links: head.links,
    scripts: pageScripts(
      graphForPage([
        webPageNode({
          url: "https://ridencare.co.in/guarantee",
          name: "Our 7-Day Workmanship Guarantee",
          description: DESCRIPTION,
          dateModified: GUARANTEE_UPDATED,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Our 7-Day Workmanship Guarantee", "/guarantee"],
        ]),
      ]),
    ),
  }),
  component: GuaranteePage,
});

const COVERED: [string, string][] = [
  [
    "Workmanship faults",
    "If a fitting, adjustment or repair carried out by our mechanic does not hold — a part we fitted comes loose, a fastener was not torqued correctly, a cable was routed badly — we come back and set it right at no charge.",
  ],
  [
    "Repeat of the same fault",
    "If the exact symptom the job was meant to fix comes back within seven days of the visit, the return visit to diagnose and correct our work is free.",
  ],
  [
    "Parts fitted by us",
    "Parts and consumables supplied and fitted by Ride N Care are covered against fitting-related problems for the same seven days.",
  ],
];

const NOT_COVERED: [string, string][] = [
  [
    "Pre-existing conditions",
    "Wear or damage that existed before the service — worn clutch plates, glazed brake pads, an aged battery — is diagnosed and quoted but not covered by this guarantee.",
  ],
  ["New damage from riding", "Accidents, water ingress, overheating or new impacts that happen after we hand the vehicle back."],
  ["Owner work in between", "Repairs, adjustments or spare-part changes made by anyone else between our visit and a claim."],
  [
    "Consumables by design",
    "Engine oil burn-off on older engines, tyre wear, brake pad wear from use, and fuel are not covered.",
  ],
];

function GuaranteePage() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <Link to="/" className="hover:text-cyan-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">7-day workmanship guarantee</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Ride N Care policy</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Our 7-day workmanship guarantee</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: {formatDate(GUARANTEE_UPDATED)}</p>

        <div className="mt-8 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
          <strong className="font-semibold">DRAFT — pending owner confirmation.</strong> The wording below
          expands the guarantee sentence already published on our service pages. Nothing here is binding until
          the owner reviews it.
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">The guarantee in one sentence</h2>
          <p className="mt-3 leading-relaxed text-white/80">
            If anything we serviced or repaired plays up within seven days, we come back and put it right at no
            charge — the same promise printed on every Ride N Care job.
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
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">How to claim</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
            <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <strong className="text-white">1. Contact us.</strong> Call 080 6940 9289 or WhatsApp 82969 50339
              within seven days of the visit. Have your digital invoice ready — it lists the work done and the
              date.
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <strong className="text-white">2. Describe the symptom.</strong> A short note or video on WhatsApp
              is enough. We confirm whether the fault relates to the work we performed.
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <strong className="text-white">3. Free return visit.</strong> If it is our workmanship, a mechanic
              returns and corrects it at no charge. Parts replaced under the guarantee are supplied free.
            </li>
          </ol>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="size-5 text-cyan-300" aria-hidden /> Your digital invoice is the record
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Every job closes with a digital invoice sent by WhatsApp or email, listing parts and labour
            separately. It is the reference for any guarantee claim — keep it until at least seven days after
            the visit.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Questions about a job?</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="tel:+918069409289"
              data-ctc="call"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 font-semibold text-white"
            >
              <Phone className="size-4" aria-hidden /> Call 080 6940 9289
            </a>
            <a
              href="https://wa.me/918296950339?text=Hi%20Ride%20N%20Care%2C%20I%20have%20a%20question%20about%20a%20recent%20service."
              target="_blank"
              rel="noopener"
              data-ctc="whatsapp"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-5 font-semibold text-cyan-200"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp 82969 50339
            </a>
          </div>
        </section>

        <p className="mt-10 flex items-center gap-2 text-xs text-white/40">
          <Wrench className="size-4" aria-hidden /> Ride N Care — Care in every mile. Doorstep bike, scooter
          and car service across Bangalore.
        </p>
      </main>
      <FloatingActions />
    </div>
  );
}
