import { createFileRoute, Link } from "@tanstack/react-router";
import { BookingButton } from "@/components/booking/BookingButton";
import { SITE_URL } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, faqNode, pageScripts } from "@/lib/schema";
import { CONFIRMED_AREAS, CONFIRMED_ZONE_PHRASE } from "@/lib/areas";

/**
 * Contact / booking page. Facts stated here are already confirmed elsewhere on
 * the site (booking flow, service pages, /answers, llms.txt): written quote
 * before work starts, digital invoice, 45-day service warranty, OEM-grade
 * parts, "Open 7:00 AM–11:30 PM, every day", 40 confirmed localities.
 * Nothing invented: no turnaround promises, no prices, no addresses, no names.
 */

const CONTACT_FAQS: [string, string][] = [
  [
    "How do I book a doorstep bike or car service?",
    "Three ways: call 080 6940 9289, WhatsApp 82969 50339, or use the booking form on this page. The booking flow prepares your vehicle and service details, then hands them to WhatsApp for confirmation — a written quote is shared before any work starts.",
  ],
  [
    "What information should I provide when I contact you?",
    "Your vehicle (bike, scooter or car — make, model and year if you know it), the service or the problem you are seeing, your locality in Bangalore, and whether you prefer a call or WhatsApp. Photos or a short video of the issue help us quote accurately.",
  ],
  [
    "Which areas in Bangalore do you cover?",
    `${CONFIRMED_AREAS.length} confirmed localities across ${CONFIRMED_ZONE_PHRASE} Bangalore — including Whitefield, Koramangala, HSR Layout, Electronic City, Marathahalli and Jayanagar. The full list with pincodes is on the service areas page.`,
  ],
  [
    "What happens after I contact Ride N Care?",
    "Your request is confirmed on WhatsApp or by call, the price is confirmed in writing before work starts, and a background-verified mechanic arrives at your address with tools and OEM-grade parts. You pay by UPI, card or cash and receive a digital invoice; workmanship is covered by a 45-day warranty.",
  ],
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...pageHead({
      title: "Book Doorstep Bike Service in Bangalore | Ride N Care",
      description:
        "Contact Ride N Care: call 080 6940 9289, WhatsApp 82969 50339 or book online. Doorstep bike & car service across Bangalore — written quote before work starts.",
      path: "/contact",
      extraMeta: [
        { property: "og:title", content: "Book Now — Ride N Care" },
        { property: "og:description", content: "Book bike or car service. Doorstep, fast, transparent." },
      ],
    }),
    scripts: pageScripts(graphForPage([faqNode(CONTACT_FAQS)])),
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-5xl font-bold">Book doorstep bike &amp; car service in Bangalore</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Use the Ride N Care booking flow to select your exact vehicle, verified service package, price and inclusions.
        Your details will be prepared for WhatsApp, where you send the request for confirmation.
      </p>
      <BookingButton className="btn-book mt-8 h-12 rounded-full px-7 font-semibold">
        Book Now
      </BookingButton>
      <div className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
        <a href="tel:+918069409289" data-ctc="call_click">
          <Info title="Phone" value="080 6940 9289" />
        </a>
        <a href="https://wa.me/918296950339" data-ctc="whatsapp_click">
          <Info title="WhatsApp" value="+91 82969 50339" />
        </a>
        {/* Accessible name matches the visible value (axe "label-name" class of
            issues); the entity-encoded string renders as the real address. */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label="Email info at ridencare dot co dot in"
          dangerouslySetInnerHTML={{
            __html: `<span class="block rounded-2xl border border-border bg-card p-5"><span class="block text-xs uppercase tracking-wider text-muted-foreground">Email</span><span class="mt-1 block font-semibold">${CONTACT_EMAIL}</span></span>`,
          }}
        />
      </div>
      <div className="mt-4 text-sm">
        <Info title="Hours" value="7:00 AM to 11:30 PM, every day — bike service in Bangalore, 7 AM to 11:30 PM; the arrival window is confirmed when you book." />
      </div>
      <div className="mt-2 text-sm">
        <Info title="Address" value="Bangalore, Karnataka, India" />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold sm:text-3xl">How to contact Ride N Care</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Call <a href="tel:+918069409289" data-ctc="call_click" className="font-semibold text-primary hover:underline">080 6940 9289</a> for
          anything urgent — breakdowns, battery jump-starts and same-visit repairs are fastest on the phone. Use{" "}
          <a href="https://wa.me/918296950339" data-ctc="whatsapp_click" target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">WhatsApp 82969 50339</a> to
          send photos, get the written quote and receive your digital invoice. Prefer to book yourself? The{" "}
          <BookingButton className="font-semibold text-primary hover:underline">booking form</BookingButton> walks you through vehicle, service
          and payment preferences in one pass. Email{" "}
          {/* Entity-encoded at runtime — accessible text, harder for scrapers (privacy task). */}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline" dangerouslySetInnerHTML={{ __html: CONTACT_EMAIL }} /> for
          franchise and partnership questions.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Doorstep service coverage in Bangalore</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Ride N Care is a service-area business — there is no walk-in workshop; a background-verified mechanic comes to
          your home, office or parking spot. We cover {CONFIRMED_AREAS.length} confirmed localities across{" "}
          {CONFIRMED_ZONE_PHRASE} Bangalore. Your locality is not listed? Call or WhatsApp — coverage is confirmed before
          you book. See the full list with pincodes on the{" "}
          <Link to="/areas" className="font-semibold text-primary hover:underline">service areas page</Link>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CONFIRMED_AREAS.filter((a) => a.tier === "priority").slice(0, 12).map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm hover:border-primary hover:text-primary"
            >
              {a.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">What to have ready when you contact us</h2>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Your vehicle:</strong> bike, scooter or car — make, model and year if you
            know it (e.g. Honda Activa 6G, Maruti Swift). Not sure? We can help identify it from the registration.
          </li>
          <li>
            <strong className="text-foreground">The service or symptom:</strong> a named package like periodic service or
            AC gas refill, or what the vehicle is doing — noises, warning lights, leaks, starting trouble.
          </li>
          <li>
            <strong className="text-foreground">Your locality:</strong> your area in Bangalore so we confirm coverage and
            the visit window when you book.
          </li>
          <li>
            <strong className="text-foreground">Photos or a short video</strong> of the issue (WhatsApp works best) — this
            helps us quote accurately before the visit.
          </li>
          <li>
            <strong className="text-foreground">Your preference:</strong> call or WhatsApp, and a time that suits you —
            the team is open 7:00 AM to 11:30 PM, every day, and the arrival window is confirmed when you book.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">What happens after you contact us</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Your request is confirmed on WhatsApp or by call, and the price is confirmed in writing before work starts — no
          surprise bills. The mechanic arrives with tools and OEM-grade parts, you can watch the work, and you pay by UPI,
          card or cash once the job is done. You receive a digital invoice on WhatsApp or email, and workmanship is covered
          by a <Link to="/guarantee" className="font-semibold text-primary hover:underline">45-day service warranty</Link>.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            to="/$service"
            params={{ service: "bike-service" }}
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/60"
          >
            <span className="font-semibold">Bike &amp; scooter services</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Periodic service, repairs, batteries, breakdown assistance — see packages and inclusions.
            </span>
          </Link>
          <Link
            to="/cars"
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/60"
          >
            <span className="font-semibold">Car services</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Periodic maintenance, AC, battery, brakes, inspections and jump-start at your doorstep.
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Contact FAQs</h2>
        <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
          {CONTACT_FAQS.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-semibold">{q}</span>
                <span className="text-2xl text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="font-semibold text-primary hover:underline">Read all FAQs →</Link>
        </div>
      </section>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
