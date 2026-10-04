import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/head";
import { CONTACT_EMAIL } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageHead({
      title: "Privacy Policy | Ride N Care",
      description:
        "How Ride N Care collects, uses and protects your details when you book doorstep bike or car service in Bangalore.",
      path: "/privacy",
      robots: "noindex, follow",
    }),
  }),
  component: PrivacyPage,
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "When you book a service, we collect the details you give us: your name, mobile number, WhatsApp number, email address (if you share it), vehicle details, service address and preferred date and time.",
      "If you share your location to help our mechanic find you, we use that location only for your booking.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use your booking details to schedule the service, assign a mechanic, send you a written quote and invoice, and contact you about your booking on call or WhatsApp.",
      "We do not sell your personal details to anyone.",
    ],
  },
  {
    heading: "Who can see your details",
    body: [
      "Your booking details are shared with the Ride N Care team member or mechanic assigned to your service. Our booking system stores them securely so we can honour the 45-day service warranty and support you after the visit.",
    ],
  },
  {
    heading: "Messages on WhatsApp",
    body: [
      "When you book on WhatsApp, the conversation happens on WhatsApp under their own privacy terms. We only see and keep the messages you send us about your booking.",
    ],
  },
  {
    heading: "Website analytics",
    body: [
      "The website uses Google Analytics to count page visits and button clicks (such as calls and WhatsApp taps). This data is aggregated and does not include your name or booking details.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us to correct or delete your booking details at any time. Call 080 6940 9289 or write to us and we will act on your request.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "[OWNER TO REVIEW: confirm data practices above, name the booking-system processor if you want it disclosed, and add a policy effective date.]",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-muted-foreground">
        Plain-language summary of what Ride N Care does with your details. Last reviewed: [OWNER TO CONFIRM date].
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
        Questions? Call <a href="tel:+918069409289" className="font-semibold text-primary">080 6940 9289</a>, WhatsApp{" "}
        <a href="https://wa.me/918296950339" target="_blank" rel="noopener" className="font-semibold text-primary">82969 50339</a> or email{" "}
        {/* Entity-encoded at runtime — accessible text, harder for scrapers (privacy task). */}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary" dangerouslySetInnerHTML={{ __html: CONTACT_EMAIL }} />.
      </p>
    </div>
  );
}
