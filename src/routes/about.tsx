import { createFileRoute, Link } from "@tanstack/react-router";
import { StatsRow } from "@/components/StatsRow";
import { ENTITY_SUMMARY } from "@/lib/answers";
import { CONFIRMED_AREAS, CONFIRMED_ZONE_PHRASE } from "@/lib/areas";
import { OG_IMAGE_ABOUT, SITE_URL } from "@/lib/seo";
import { pageHead, formatDate } from "@/lib/head";
import { graphForPage, pageScripts } from "@/lib/schema";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...pageHead({
      title: "About Ride N Care | Doorstep Bike Service Bangalore",
      description:
        "Who we are: a Bangalore doorstep bike & car service team with background-verified mechanics, OEM parts, written quotes and a 7-day workmanship guarantee.",
      path: "/about",
      ogImage: OG_IMAGE_ABOUT,
      extraMeta: [
      { property: "og:title", content: "About Ride N Care — Care in every mile" },
      { property: "og:description", content: "Who we are: a Bangalore doorstep bike & car service team with background-verified mechanics, OEM parts, written quotes and a 7-day workmanship guarantee." },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "About Ride N Care — Care in every mile, Bangalore doorstep bike & car service" },
      { name: "twitter:image:alt", content: "About Ride N Care — Care in every mile" },
    ],
    }),
    scripts: pageScripts(
      graphForPage([
        // Organization itself is emitted by the root graph on every page; here we
        // reference it by @id and add the AboutPage context.
        {
          "@type": "AboutPage",
          "@id": `${SITE_URL}/about#aboutpage`,
          url: `${SITE_URL}/about`,
          name: "About Ride N Care",
          description:
            "Bangalore's doorstep bike and car service team — background-verified mechanics, OEM parts, written quotes and a 7-day workmanship guarantee.",
          mainEntity: { "@id": `${SITE_URL}/#organization` },
          breadcrumb: { "@id": `${SITE_URL}/about#breadcrumb` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${SITE_URL}/about#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
          ],
        },
      ]),
    ),
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our Story</span>
      <h1 className="mt-2 text-5xl font-bold">About Ride N Care</h1>

      {/* What is Ride N Care? — the stable entity paragraph, word-for-word the
          same text as the homepage and /answers (AEO entity consistency). */}
      <section aria-label="What is Ride N Care?" className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">What is Ride N Care?</h2>
        <p className="mt-2 text-base leading-relaxed text-foreground">{ENTITY_SUMMARY}</p>
      </section>

      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        Ride N Care was founded in <strong className="text-foreground">Bangalore</strong> with one stubborn belief — getting your bike or car serviced should not eat up an entire weekend. What began as two friends fixing neighbours' scooters in a Koramangala parking lot has grown into a doorstep automotive service brand covering <strong className="text-foreground">{CONFIRMED_AREAS.length} Bangalore localities</strong>, for bikes, scooters, electric two-wheelers and cars.
      </p>

      <StatsRow className="mt-10 max-w-md" />

      <h2 className="mt-14 text-3xl font-bold">Why Bangalore loves us</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Bangalore's traffic, dust and unpredictable monsoon are uniquely brutal on vehicles. We built Ride N Care specifically for this city — every mechanic carries a diagnostics kit and OEM-grade spares, and every job starts with a written quote so there are zero surprises. From a quick oil change in Indiranagar to a full periodic service in Electronic City, the work happens in front of you, and we leave your driveway cleaner than we found it.
      </p>

      <h2 className="mt-12 text-3xl font-bold">Services we specialise in</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-muted-foreground">
        <li>🏍 Bike periodic & general service</li>
        <li>🛵 Scooter & electric two-wheeler service</li>
        <li>🧰 Bike brake, clutch & chain repairs</li>
        <li>🆘 Emergency bike repair & breakdown assistance</li>
        <li>🚗 Car periodic service</li>
        <li>❄ Car AC service & gas refill</li>
        <li>🔋 Car & bike battery testing and replacement</li>
        <li>🛑 Car brake service</li>
        <li>🛢 Car engine oil & filter change</li>
        <li>🛠 Pre-purchase & health-check car inspection</li>
        <li>⚡ Car jump start & electrical repair</li>
        <li>🔧 Diagnosis-led car repair at home</li>
      </ul>

      <h2 className="mt-12 text-3xl font-bold">Our promise</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li>✅ Genuine, OEM-grade parts.</li>
        <li>✅ Upfront pricing — a written quote before any spanner is lifted.</li>
        <li>✅ Trained, polite, background-verified (KYC-checked) mechanics.</li>
        <li>✅ A digital invoice by WhatsApp or email after every job.</li>
        <li>✅ 7-day post-service workmanship guarantee.</li>
        <li>✅ Pay by UPI, card or cash after the work is done.</li>
      </ul>

      {/* Ride N Care at a glance — retrieval-shaped facts for AI answers (Part 9.2).
          Only confirmed or live facts; founding year / hours / team size stay in OWNER-QUESTIONS. */}
      <section aria-label="Ride N Care at a glance" className="mt-14">
        <h2 className="text-3xl font-bold">Ride N Care at a glance</h2>
        <dl className="mt-5 grid gap-2.5">
          {[
            ["What we do", "Doorstep bike, scooter, EV two-wheeler and car service and repair in Bangalore."],
            ["Where we serve", `${CONFIRMED_AREAS.length} localities across ${CONFIRMED_ZONE_PHRASE} Bangalore — see the full list on the areas page.`],
            ["How to book", "Call 080 6940 9289, WhatsApp 82969 50339, the booking form on this website, or Book with AI."],
            ["Email", "info@ridencare.co.in — for quotes, invoices and anything else."],
            ["Quote", "The price is confirmed in writing before any work starts."],
            ["Mechanics", "Background-verified and KYC-checked before visiting your home or office."],
            ["Parts", "OEM-grade parts fitted."],
            ["Payment", "UPI, card or cash, paid after the work is done."],
            ["Invoice", "A digital invoice listing parts and labour separately, by WhatsApp or email."],
            ["Guarantee", "A 7-day workmanship guarantee on every job."],
          ].map(([term, def]) => (
            <div key={term} className="grid gap-1 rounded-xl border border-border bg-card p-3.5 sm:grid-cols-[160px_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-primary">{term}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{def}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">Last verified: {formatDate("2026-09-21")}</p>
      </section>

      <h2 className="mt-12 text-3xl font-bold">Bangalore coverage</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        We currently serve {CONFIRMED_AREAS.length} localities across {CONFIRMED_ZONE_PHRASE} Bangalore — including Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Bellandur, Sarjapur Road, BTM Layout, Electronic City, Jayanagar, JP Nagar and Hebbal. The full, current list lives on the{" "}
        <Link to="/areas" className="text-primary underline underline-offset-4">areas we serve</Link>{" "}
        page. New areas are added as they are confirmed — call us if you don't see yours.
      </p>

      {/* Promises / trust — no invented customer quotes; see Q2/Q19 */}
      <section className="mt-14">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our promises</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold">What every Ride N Care booking includes</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {[
            ["Written quote before work starts", "The mechanic checks the vehicle, tells you what it needs and confirms the price in writing. Work starts only after you approve it."],
            ["7-day workmanship guarantee", "If something related to the work done goes wrong within 7 days, we come back and set it right at no extra charge."],
            ["Background-verified mechanics", "Every mechanic is KYC-checked before they visit your home or office, so you always know who is working on your vehicle."],
            ["OEM-grade parts and digital invoice", "Parts meet original-equipment grade and you get a digital invoice by WhatsApp or email — useful for your service record and resale."],
          ].map(([title, body]) => (
            <figure key={title} className="rounded-xl border border-border bg-card p-4">
              <blockquote className="text-sm font-semibold text-foreground">{title}</blockquote>
              <figcaption className="mt-1.5 text-sm text-muted-foreground">{body}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["7-day", "Workmanship guarantee"],
            ["OEM", "Genuine parts only"],
            ["Free", "Pickup & drop"],
            ["UPI", "Card & cash accepted"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-background p-3">
              <h3 className="font-semibold text-sm text-primary">{t}</h3>
              <p className="text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Ready to try doorstep service?</h2>
        <p className="mt-2 text-primary-foreground/90">Get a written quote on WhatsApp before any work starts.</p>
        <a href="https://wa.me/918296950339" className="mt-4 inline-block rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
      </div>
    </div>
  );
}