import { Link } from "@tanstack/react-router";
import type { BrandService } from "@/lib/brand-services";
import { getBrandService } from "@/lib/brand-services";
import { getServiceSummary } from "@/lib/service-summary";
import { getAnswerSummary } from "@/lib/answer-page-summary";
import { formatDate } from "@/lib/head";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

/**
 * Renders one bike brand service page (Batch 3 Part 4).
 * Content-only view: all copy/claims come from src/lib/brand-services.ts
 * (independent-company disclaimer, confirmed price points, verified models).
 */
export function BrandServiceView({ s }: { s: BrandService }) {
  const relatedBrands = s.relatedBrands
    .map((slug) => getBrandService(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getBrandService>>[];
  const relatedServices = s.services
    .map((slug) => getServiceSummary(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getServiceSummary>>[];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span> <Link to="/bikes" className="hover:text-primary">Bike service</Link> <span className="mx-1">/</span> <span>{s.name}</span>
      </nav>

      {/* H1 + subheading */}
      <h1 className="mt-6 text-4xl md:text-5xl font-bold">{s.h1}</h1>
      <p className="mt-3 text-lg text-foreground/80 leading-relaxed">{s.subheading}</p>

      {/* Quick answer (40–60 words) — AEO answer-first box */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Quick answer</p>
        <p className="mt-2 text-foreground leading-relaxed">{s.summary}</p>
      </div>

      {/* Above-the-fold CTAs with GA4 conversion events */}
      <div className="mt-6 flex flex-wrap gap-3">
        <BookingButton vehicle="bike" className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", { vehicle_type: "bike", service: s.slug })}
          className="rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
        >
          Call 080 6940 9289
        </a>
        <a
          href="https://wa.me/918296950339"
          target="_blank" rel="noopener"
          {...ctcProps("whatsapp_click", { vehicle_type: "bike", service: s.slug })}
          className="rounded-full border border-emerald-600/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          WhatsApp 82969 50339
        </a>
      </div>

      {/* Body copy */}
      <div className="mt-10 space-y-4 text-muted-foreground leading-relaxed">
        <p className="text-foreground">{s.intro}</p>
        {s.detail.map((p) => <p key={p}>{p}</p>)}
      </div>

      {/* Models — verified displacements from src/lib/vehicle-catalog.ts */}
      <h2 className="mt-12 text-2xl font-bold">{s.brand} models we service</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm rounded-2xl border border-border bg-card">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">Engine class</th>
            </tr>
          </thead>
          <tbody>
            {s.models.map(([m, cc]) => (
              <tr key={m} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2.5">{m}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{cc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Not on the list? Older and discontinued {s.brand} models are usually routine work — describe your model on WhatsApp and you get a straight yes-or-no before anything is scheduled.
      </p>

      {/* What the brand's owners actually watch */}
      <h2 className="mt-12 text-2xl font-bold">What {s.brand} owners in Bangalore should watch</h2>
      <div className="mt-4 space-y-2">
        {s.needs.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      {/* Self-checks between visits */}
      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">Checks between visits</h2>
          <ul className="mt-3 space-y-2">
            {s.checks.map((c) => (
              <li key={c} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold">When to book rather than wait</h2>
          <ul className="mt-3 space-y-2">
            {s.whenToService.map((w) => (
              <li key={w} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">⚠ {w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing — published tiers only, written quote promise */}
      <h2 className="mt-12 text-2xl font-bold">Pricing</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">{s.pricing}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">The price is confirmed in writing before work starts.</p>

      {/* Honest limits */}
      <h2 className="mt-12 text-2xl font-bold">What is not suitable for doorstep</h2>
      <ul className="mt-4 space-y-2">
        {s.limits.map((l) => (
          <li key={l} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">✕ {l}</li>
        ))}
      </ul>

      {/* FAQs — same array drives the FAQPage JSON-LD above */}
      <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {s.faqs.map(([q, a]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>

      {/* Cross-links: brand-specific answers, sibling brand pages + bike service types */}
      {s.relatedAnswers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Useful answers for {s.brand} owners</h2>
          <ul className="mt-3 space-y-1.5">
            {s.relatedAnswers.map((slug) => {
              const a = getAnswerSummary(slug);
              return a ? (
                <li key={slug}>
                  <Link to="/answers/$slug" params={{ slug }} className="text-primary hover:underline">
                    {a.question}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        {relatedBrands.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Other brand pages</h2>
            <ul className="mt-3 space-y-1.5">
              {relatedBrands.map((b) => (
                <li key={b.slug}>
                  <Link to="/$service" params={{ service: b.slug }} className="text-primary hover:underline">
                    {b.name} in Bangalore
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/bikes" className="text-primary hover:underline">All bike services</Link>
              </li>
            </ul>
          </div>
        )}
        {relatedServices.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Related services</h2>
            <ul className="mt-3 space-y-1.5">
              {relatedServices.map((r) => (
                <li key={r.slug}>
                  <Link to="/$service" params={{ service: r.slug }} className="text-primary hover:underline">
                    {r.name} in Bangalore
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Closing CTA */}
      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book {s.brand} service today</h2>
        <p className="mt-2 text-primary-foreground/90">The price is confirmed in writing before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a
            href="https://wa.me/918296950339"
            target="_blank" rel="noopener"
            {...ctcProps("whatsapp_click", { vehicle_type: "bike", service: s.slug })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            WhatsApp 82969 50339
          </a>
          <BookingButton vehicle="bike" className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        </div>
      </div>

      {/* Review stamp */}
      <p className="mt-6 text-center text-xs text-muted-foreground">Last reviewed: {formatDate(s.reviewed)}</p>
    </div>
  );
}
