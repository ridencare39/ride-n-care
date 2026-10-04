import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/head";
import { CONTACT_EMAIL } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    ...pageHead({
      title: "Terms of Service | Ride N Care",
      description:
        "The simple terms that apply when you book doorstep bike or car service from Ride N Care in Bangalore.",
      path: "/terms",
      robots: "noindex, follow",
    }),
  }),
  component: TermsPage,
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we provide",
    body: [
      "Ride N Care provides doorstep bike, scooter, electric two-wheeler and car service and repair in Bangalore, Karnataka. A background-verified mechanic comes to your home or office with tools and OEM-grade parts.",
    ],
  },
  {
    heading: "Quotes and payment",
    body: [
      "You always get a written quote before work starts. Work begins only after you approve it. You pay after the job is done by UPI, card or cash. Package prices shown on the website are starting prices for the listed scope; your final quote depends on your vehicle and its condition.",
    ],
  },
  {
    heading: "Booking and cancellation",
    body: [
      "Bookings are confirmed on call or WhatsApp after you submit the form. You can reschedule or cancel free of charge before the mechanic starts the work.",
    ],
  },
  {
    heading: "45-day service warranty",
    body: [
      "If the same problem comes back within 45 days of our visit because of the work we did, we correct the work in accordance with the warranty. The warranty covers workmanship on eligible work — not new faults, accident damage or parts you supplied yourself.",
    ],
  },
  {
    heading: "What we cannot do",
    body: [
      "Some jobs need a workshop — for example full car painting or major crash repair. If your request is not suitable for doorstep service, we will tell you honestly and suggest the right option.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "Our liability for any service is limited to the value you paid for that service. We insure nothing beyond the work we perform, and we are not responsible for pre-existing faults that were outside the agreed scope. [OWNER TO REVIEW: confirm this wording with your insurer/legal advisor.]",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "[OWNER TO REVIEW: confirm the guarantee scope and liability wording, then add an effective date.]",
    ],
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-3 text-muted-foreground">
        Plain-language terms for booking Ride N Care doorstep service. Last reviewed: [OWNER TO CONFIRM date].
      </p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-2 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Questions about these terms? Call{" "}
        <a href="tel:+918069409289" className="font-semibold text-primary">080 6940 9289</a> or email{" "}
        {/* Entity-encoded at runtime — accessible text, harder for scrapers (privacy task). */}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary" dangerouslySetInnerHTML={{ __html: CONTACT_EMAIL }} />.
      </p>
    </div>
  );
}
