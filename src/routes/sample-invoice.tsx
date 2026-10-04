import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead, pageScripts, formatDate } from "@/lib/head";
import { CONTACT_EMAIL } from "@/lib/seo";
import { graphForPage, webPageNode, breadcrumbNode } from "@/lib/schema";
import { Phone, MessageCircle, FileCheck2, Info } from "lucide-react";
import { FloatingActions } from "@/components/FloatingActions";

const INVOICE_UPDATED = "2026-09-21";

const DESCRIPTION =
  "A sample Ride N Care digital invoice with dummy data, showing exactly how parts and labour are listed after a doorstep service in Bangalore.";

const head = pageHead({
  title: "Sample Digital Invoice | Ride N Care",
  description: DESCRIPTION,
  path: "/sample-invoice",
  robots: "noindex, nofollow",
});

export const Route = createFileRoute("/sample-invoice")({
  head: () => ({
    meta: head.meta,
    links: head.links,
    scripts: pageScripts(
      graphForPage([
        webPageNode({
          url: "https://ridencare.co.in/sample-invoice",
          name: "Sample Digital Invoice",
          description: DESCRIPTION,
          dateModified: INVOICE_UPDATED,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Sample Digital Invoice", "/sample-invoice"],
        ]),
      ]),
    ),
  }),
  component: SampleInvoicePage,
});

function Row({ label, detail, amount }: { label: string; detail: string; amount: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs leading-relaxed text-white/50">{detail}</p>
      </div>
      <p className="shrink-0 text-sm font-semibold text-white/90">₹{amount}</p>
    </div>
  );
}

function SampleInvoicePage() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <Link to="/" className="hover:text-cyan-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">Sample digital invoice</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Transparency</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Sample digital invoice</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: {formatDate(INVOICE_UPDATED)}</p>

        <div className="mt-8 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
          <strong className="font-semibold">DRAFT — pending owner confirmation.</strong> Every number, name and
          vehicle below is dummy data. The real invoice your job produces follows this same layout.
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-lg font-bold">Ride N Care</p>
              <p className="text-xs uppercase tracking-[0.15em] text-white/50">Care in every mile</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Doorstep bike &amp; car service · Bangalore
                <br />
                080 6940 9289 ·
                {/* Entity-encoded at runtime — accessible text, harder for scrapers (privacy task). */}
                <span dangerouslySetInnerHTML={{ __html: ` ${CONTACT_EMAIL}` }} />
              </p>
            </div>
            <div className="text-right text-xs leading-relaxed text-white/60">
              <p className="font-semibold text-white">TAX INVOICE (SAMPLE)</p>
              <p>Invoice: RNC-2026-0142</p>
              <p>Date: 12 Sep 2026</p>
              <p>Payment: UPI — paid</p>
            </div>
          </div>

          <div className="grid gap-4 py-5 text-xs leading-relaxed text-white/60 sm:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-wider text-white/80">Billed to</p>
              <p>A. Kumar (sample)</p>
              <p>HSR Layout, Bangalore</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-white/80">Vehicle</p>
              <p>Pulsar 150 · KA 05 MJ 1234 (sample)</p>
              <p>Periodic service at doorstep</p>
            </div>
          </div>

          <div>
            <Row label="Engine oil & oil filter" detail="OEM-grade 10W-30, 1.0 L · fitted on site" amount="545" />
            <Row label="Air filter" detail="OEM-grade element · fitted on site" amount="220" />
            <Row label="Labour — periodic service" detail="25-point inspection, chain clean & lube, brake adjust" amount="349" />
            <Row label="Labour — consumables" detail="Cleaning, disposal of used oil" amount="50" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-sm font-semibold">Total (sample)</p>
            <p className="text-lg font-bold text-cyan-300">₹1,164</p>
          </div>

          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-white/50">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Parts and labour are listed separately, the exact price is confirmed in writing before work starts,
            and payment (UPI, card or cash) is taken only after you have reviewed the work and taken a short
            test ride.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FileCheck2 className="size-5 text-cyan-300" aria-hidden /> Why the invoice looks like this
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
            <li>• Parts and labour are split so you can see what you are paying for.</li>
            <li>• The written quote you approved before the job is what the invoice totals.</li>
            <li>• It reaches your WhatsApp or email as soon as the job closes — the record for your service history and any guarantee claim.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Want an invoice like this for your vehicle?</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="tel:+918069409289"
              data-ctc="call_click"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 font-semibold text-white"
            >
              <Phone className="size-4" aria-hidden /> Call 080 6940 9289
            </a>
            <a
              href="https://wa.me/918296950339?text=Hi%20Ride%20N%20Care%2C%20I%27d%20like%20to%20book%20a%20doorstep%20service."
              target="_blank"
              rel="noopener"
              data-ctc="whatsapp_click"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-5 font-semibold text-cyan-200"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp 82969 50339
            </a>
          </div>
        </section>
      </div>
      <FloatingActions />
    </div>
  );
}
