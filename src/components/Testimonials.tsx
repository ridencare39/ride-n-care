/**
 * Homepage trust section. Shows only owner-confirmed service promises — no
 * customer quotes, names or ratings until the owner supplies real, reviewable
 * testimonials (Q2/Q19 in docs/seo/OWNER-QUESTIONS.md). No counts are displayed.
 */
const PROMISES: [string, string][] = [
  [
    "Written quote before work starts",
    "The mechanic checks the vehicle, tells you what it needs and confirms the price in writing. Work starts only after you approve it.",
  ],
  [
    "7-day workmanship guarantee",
    "If something related to the work done goes wrong within 7 days, we come back and set it right at no extra charge.",
  ],
  [
    "Background-verified mechanics",
    "Every mechanic is KYC-checked before they visit your home or office, so you always know who is working on your vehicle.",
  ],
  [
    "OEM-grade parts and digital invoice",
    "Parts meet original-equipment grade and you get a digital invoice by WhatsApp or email — useful for your service record and resale.",
  ],
];

const BADGES: [string, string][] = [
  ["7-day", "Workmanship guarantee"],
  ["OEM", "Genuine parts only"],
  ["Free", "Pickup & drop"],
  ["UPI", "Card & cash accepted"],
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our promises</div>
      <h2 className="mt-1 text-2xl md:text-3xl font-bold">What every Ride N Care booking includes</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {PROMISES.map(([title, body]) => (
          <figure key={title} className="rounded-xl border border-border bg-card p-4">
            <blockquote className="text-sm font-semibold text-foreground">{title}</blockquote>
            <figcaption className="mt-1.5 text-sm text-muted-foreground">{body}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGES.map(([t, d]) => (
          <div key={t} className="rounded-xl border border-border bg-background p-3">
            <h3 className="font-semibold text-sm text-primary">{t}</h3>
            <p className="text-xs text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
