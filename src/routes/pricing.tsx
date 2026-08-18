import { createFileRoute, Link } from "@tanstack/react-router";
import { bikeTiers, carTiers } from "@/lib/pricing";


export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Transparent Pricing — Ride N Care" },
      { name: "description", content: "Honest, upfront pricing for bike & car servicing. No hidden charges. Pay only after the job is done." },
      { property: "og:title", content: "Transparent Pricing — Ride N Care" },
      { property: "og:description", content: "Honest, upfront pricing for bike & car servicing." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h1 className="text-5xl font-bold">Pricing</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Flat rates. No hidden charges. Parts billed at MRP with bill copy.</p>

      <h2 className="mt-12 text-2xl font-bold">Bike Service</h2>
      <div className="mt-4 grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {bikeTiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-primary text-sm font-semibold">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.cc}</div>
            <div className="mt-3 text-2xl font-bold">₹{t.price}</div>
            <Link to="/contact" className="mt-4 inline-block w-full text-center rounded-full bg-grad-primary px-4 py-2 font-semibold text-primary-foreground">Book</Link>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">Car Service</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {carTiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-primary text-sm font-semibold">{t.name}</div>
            <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            <div className="mt-4 text-3xl font-bold">₹{t.price}</div>
            <Link to="/contact" className="mt-5 inline-block rounded-full bg-grad-primary px-5 py-2 font-semibold text-primary-foreground">Book</Link>
          </div>
        ))}
      </div>
    </div>
  );
}