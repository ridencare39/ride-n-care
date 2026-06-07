import { createFileRoute, Link } from "@tanstack/react-router";
import car from "@/assets/car-service.jpg";

const services = [
  ["Periodic Service", "Oil change, filters, brake check"],
  ["AC Service", "Gas refill, cooling diagnostics"],
  ["Battery", "Jumpstart, testing, replacement"],
  ["Brakes & Suspension", "Pads, discs, shockers"],
  ["Denting & Painting", "Pick-up, paint, drop"],
  ["Cleaning & Detailing", "Interior, ceramic, polish"],
];

export const Route = createFileRoute("/cars")({
  head: () => ({
    meta: [
      { title: "Car Service at Home — Ride N Care" },
      { name: "description", content: "Hassle-free car service at your doorstep. Periodic maintenance, AC, brakes, battery, denting — handled by certified mechanics." },
      { property: "og:title", content: "Car Service at Home — Ride N Care" },
      { property: "og:description", content: "Hassle-free car service at your doorstep with certified mechanics." },
      { property: "og:url", content: "/cars" },
      { property: "og:image", content: "/car-service.jpg" },
    ],
    links: [{ rel: "canonical", href: "/cars" }],
  }),
  component: Cars,
});

function Cars() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img src={car} alt="Car being serviced" loading="lazy" width={1200} height={900} className="rounded-3xl border border-border" />
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Four Wheelers</span>
          <h1 className="mt-2 text-5xl font-bold">Car Service at Home</h1>
          <p className="mt-4 text-muted-foreground">From hatchbacks to SUVs, our mobile workshop arrives with diagnostic tools, genuine spares, and zero shortcuts.</p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Book a Car Service</Link>
        </div>
      </div>

      <h2 className="mt-20 text-3xl font-bold">What we cover</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <div className="h-8 w-8 rounded bg-grad-primary mb-3" />
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}