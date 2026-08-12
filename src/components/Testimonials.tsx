const REVIEWS: [string, string, string][] = [
  ["Priya S.", "HSR Layout", "Booked a car service at 9am, mechanic showed up at 10 sharp. Watched the whole job from my balcony — zero upselling."],
  ["Arjun M.", "Whitefield", "My Duke's chain and brakes were done in my parking lot in 75 minutes. Printed bill, genuine parts, fair price."],
  ["Rakesh N.", "Jayanagar", "Battery died on a Sunday. They reached in 30 minutes and replaced it on the spot. Now my default garage."],
];

const BADGES: [string, string][] = [
  ["4.8★", "Average rating"],
  ["7-day", "Workmanship guarantee"],
  ["OEM", "Genuine parts only"],
  ["50+", "Areas covered"],
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Trusted by riders</div>
      <h2 className="mt-1 text-2xl md:text-3xl font-bold">What Bangalore says about us</h2>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {REVIEWS.map(([name, area, quote]) => (
          <figure key={name} className="rounded-xl border border-border bg-card p-4">
            <div className="text-primary text-sm">★★★★★</div>
            <blockquote className="mt-2 text-sm text-muted-foreground">“{quote}”</blockquote>
            <figcaption className="mt-3 text-xs font-semibold">
              {name} <span className="text-muted-foreground font-normal">· {area}</span>
            </figcaption>
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

export const REVIEW_JSONLD = REVIEWS.map(([name, area, quote]) => ({
  "@type": "Review",
  author: { "@type": "Person", name },
  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
  reviewBody: `${quote} (${area}, Bangalore)`,
}));
