import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { AREAS } from "@/lib/areas";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: "Service Areas in Bangalore | Ride N Care" },
      { name: "description", content: "Ride N Care offers doorstep bike & car service across 24+ Bangalore neighbourhoods — Whitefield, Koramangala, HSR, Indiranagar, Electronic City and more." },
      { property: "og:title", content: "Doorstep Service Areas in Bangalore" },
      { property: "og:description", content: "24+ Bangalore localities covered for at-home bike & car service." },
      { property: "og:url", content: "/areas" },
    ],
    links: [{ rel: "canonical", href: "/areas" }],
  }),
  component: AreasLayout,
});

function AreasLayout() {
  const matches = useMatches();
  const isLeaf = matches.some((m) => m.routeId === "/areas/$slug");
  if (isLeaf) return <Outlet />;
  return <AreasIndex />;
}

function AreasIndex() {
  const zones = ["Central", "North", "South", "East", "West"] as const;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Service Coverage</span>
      <h1 className="mt-2 text-5xl font-bold">Doorstep Service Areas in Bangalore</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Ride N Care covers {AREAS.length}+ Bangalore localities. Tap a neighbourhood for local pricing, response time and the most-booked services there.
      </p>

      {zones.map((z) => {
        const list = AREAS.filter((a) => a.zone === z);
        if (list.length === 0) return null;
        return (
          <section key={z} className="mt-12">
            <h2 className="text-2xl font-bold">{z} Bangalore</h2>
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {list.map((a) => (
                <Link
                  key={a.slug}
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="rounded-2xl border border-border bg-card p-4 hover:border-primary transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold group-hover:text-primary transition">📍 {a.name}</span>
                    <span className="text-xs text-muted-foreground">{a.pincode}</span>
                  </div>
                  {a.nearby && <p className="mt-1 text-xs text-muted-foreground">Near {a.nearby.slice(0, 2).join(", ")}</p>}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
