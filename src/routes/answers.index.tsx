import { createFileRoute, Link } from "@tanstack/react-router";
import { AnswerBlocks } from "@/components/AnswerBlocks";
import { AI_SEARCH_FAQS, ANSWERS, BRAND, ENTITY_SUMMARY, ENTITY_TOPICS } from "@/lib/answers";
import { ANSWER_CATEGORIES, ANSWER_PAGES, type AnswerCategory } from "@/lib/answer-pages";
import { CONFIRMED_AREAS, COVERAGE_LINE } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, faqNode, breadcrumbNode, pageScripts } from "@/lib/schema";
import { GUIDES } from "@/lib/guides";
import { BookingButton } from "@/components/booking/BookingButton";

/** Group answer pages by category, preserving the category order. */
const BY_CATEGORY = ANSWER_CATEGORIES.map((c) => ({
  ...c,
  pages: ANSWER_PAGES.filter((p) => p.category === (c.id as AnswerCategory)),
})).filter((c) => c.pages.length > 0);

export const Route = createFileRoute("/answers/")({
  head: () => ({
    ...pageHead({
      title: "Bike & Car Service Answers — Bangalore | Ride N Care",
      description:
        "Direct answers to Bangalore's most-asked bike and car service questions: costs, booking, parts, guarantees, coverage and breakdowns. Written quote first.",
      path: "/answers",
    }),
    scripts: pageScripts(
      graphForPage([
        // FAQPage covers exactly the Q&A visible on this page: the key
        // questions block and the assistant FAQ list below.
        faqNode([
          ...ANSWERS.map((a) => [a.q, a.detail ? `${a.a} ${a.detail}` : a.a] as [string, string]),
          ...AI_SEARCH_FAQS,
        ]),
        breadcrumbNode([
          ["Home", "/"],
          ["Answers", "/answers"],
        ]),
      ]),
    ),
  }),
  component: Answers,
});

function Answers() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span>/</span> <span className="text-foreground">Answers</span>
      </nav>

      <span className="mt-6 block text-xs uppercase tracking-[0.2em] text-primary font-semibold">Ride N Care · {BRAND.tagline}</span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Bike &amp; car service in Bangalore, answered</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">{ENTITY_SUMMARY}</p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Business</dt>
          <dd className="font-semibold">{BRAND.name} — {BRAND.tagline}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Location</dt>
          <dd className="font-semibold">{BRAND.city}, {BRAND.region}, {BRAND.country}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-semibold">
            <a href="tel:+918069409289" className="hover:text-primary">080 6940 9289</a>
            {" / "}
            <a href="https://wa.me/918296950339" target="_blank" rel="noopener" className="hover:text-primary">WhatsApp 82969 50339</a>
          </dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Service area</dt>
          <dd className="font-semibold">Bangalore · {CONFIRMED_AREAS.length} confirmed localities</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-muted-foreground">
        What we do: {ENTITY_TOPICS.join(" · ")}
      </p>

      {/* Answer hub — every question gets its own page */}
      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Answers by topic</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {ANSWER_PAGES.length} questions, each with a direct answer, the detail behind it and the service page to book.
      </p>
      <div className="mt-6 space-y-8">
        {BY_CATEGORY.map((cat) => (
          <section key={cat.id}>
            <h3 className="text-lg font-bold text-foreground">{cat.label}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {cat.pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/answers/$slug"
                    params={{ slug: p.slug }}
                    className="block rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    {p.question}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Key questions</h2>
      <AnswerBlocks items={ANSWERS.filter((a) => a.id !== "who-is-ride-n-care")} />

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Questions people ask search assistants</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {AI_SEARCH_FAQS.map(([q, a]) => (
          <div key={q} className="p-6">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Bike services you can book</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
        {SERVICES.map((s) => (
          <li key={s.slug}>
            <Link to="/$service" params={{ service: s.slug }} className="text-primary hover:underline">
              {s.name} →
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Car services you can book</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
        <li><Link to="/cars" className="text-primary hover:underline">All car services →</Link></li>
        <li><Link to="/$service" params={{ service: "car-ac-service" }} className="text-primary hover:underline">AC Service →</Link></li>
        <li><Link to="/$service" params={{ service: "car-battery-service" }} className="text-primary hover:underline">Battery →</Link></li>
        <li><Link to="/$service" params={{ service: "car-brake-service" }} className="text-primary hover:underline">Car Brake Service →</Link></li>
      </ul>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Bangalore areas we serve</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {COVERAGE_LINE} — {CONFIRMED_AREAS.map((a) => a.name).join(", ")}.
      </p>
      <Link to="/areas" className="mt-3 inline-block text-primary font-semibold hover:underline">
        See area details and pincodes →
      </Link>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Maintenance guides</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link to="/guides/$slug" params={{ slug: g.slug }} className="text-primary hover:underline">
              {g.h1}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book a doorstep bike or car service</h2>
        <p className="mt-2 text-primary-foreground/90">Written quote first. OEM-grade parts, digital invoice, 7-day guarantee.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="tel:+918069409289" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Call {BRAND.phonePrimaryDisplay}</a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">WhatsApp</a>
          <BookingButton variant="outline" className="rounded-full border-background/40 bg-transparent px-6 py-3 text-primary-foreground hover:bg-background hover:text-foreground">Book Now</BookingButton>
        </div>
      </div>
    </div>
  );
}
