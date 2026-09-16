import { createFileRoute, Link } from "@tanstack/react-router";
import { AnswerBlocks } from "@/components/AnswerBlocks";
import { AI_SEARCH_FAQS, ANSWERS, BRAND, ENTITY_SUMMARY, ENTITY_TOPICS } from "@/lib/answers";
import { AREAS } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { BookingButton } from "@/components/booking/BookingButton";

const URL = `${SITE_URL}/answers`;

export const Route = createFileRoute("/answers")({
  head: () => ({
    meta: [
      { title: "Bike Service in Bangalore — Answers | Ride N Care" },
      {
        name: "description",
        content:
          "Direct answers about Ride N Care: who we are, services, doorstep bike service, Bangalore areas covered, brands serviced, booking, response times and pricing.",
      },
      { property: "og:title", content: "Ride N Care Answers — Bike Service in Bangalore" },
      {
        property: "og:description",
        content: "Plain answers about doorstep bike service and bike repair in Bangalore from Ride N Care.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          faqPageJsonLd(
            [
              ...ANSWERS.map((a) => [a.q, a.detail ? `${a.a} ${a.detail}` : a.a] as [string, string]),
              ...AI_SEARCH_FAQS,
            ],
            `${URL}#faq`,
          ),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            ["Home", `${SITE_URL}/`],
            ["Answers", URL],
          ]),
        ),
      },
    ],
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
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Bike service &amp; repair in Bangalore, answered</h1>
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
            <a href={`tel:${BRAND.phonePrimary}`} className="hover:text-primary">{BRAND.phonePrimary}</a>
            {" / "}
            <a href={`tel:${BRAND.phoneSecondary}`} className="hover:text-primary">{BRAND.phoneSecondary}</a>
          </dd>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Hours</dt>
          <dd className="font-semibold">{BRAND.hours}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-muted-foreground">
        What we do: {ENTITY_TOPICS.join(" · ")}
      </p>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Key questions</h2>
      <AnswerBlocks items={ANSWERS} />

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Questions people ask search assistants</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {AI_SEARCH_FAQS.map(([q, a]) => (
          <div key={q} className="p-6">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Services you can book</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
        {SERVICES.map((s) => (
          <li key={s.slug}>
            <Link to="/$service" params={{ service: s.slug }} className="text-primary hover:underline">
              {s.name}
            </Link>
            {s.priceFrom ? <span className="text-muted-foreground"> — from ₹{s.priceFrom}</span> : null}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-2xl md:text-3xl font-bold">Bangalore areas we serve</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {AREAS.map((a) => a.name).join(", ")}.
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
        <h2 className="text-2xl font-bold text-primary-foreground">Book a doorstep bike service</h2>
        <p className="mt-2 text-primary-foreground/90">Written quote first. Same-day slots before 4 PM.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href={`tel:${BRAND.phonePrimary}`} className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Call {BRAND.phonePrimary}</a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">WhatsApp</a>
          <BookingButton variant="outline" className="rounded-full border-background/40 bg-transparent px-6 py-3 text-primary-foreground hover:bg-background hover:text-foreground">Book Now</BookingButton>
        </div>
      </div>
    </div>
  );
}
