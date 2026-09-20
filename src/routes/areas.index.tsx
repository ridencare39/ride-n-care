import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AREAS, CONFIRMED_AREAS, PRIORITY_AREAS, CONFIRMED_ZONE_PHRASE } from "@/lib/areas";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    ...pageHead({
      title: "Service Areas in Bangalore | Ride N Care",
      description:
        "Doorstep bike & car service across 33 confirmed Bangalore localities — Whitefield, Koramangala, HSR Layout and more, grouped by zone with pincodes.",
      path: "/areas",
    }),
  }),
  component: AreasIndex,
});

const ZONES = ["East", "South", "North", "West", "Central"] as const;
type Zone = (typeof ZONES)[number];

function AreasIndex() {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<Zone | "All">("All");

  const q = query.trim().toLowerCase();
  const match = (name: string, pin?: string) =>
    !q || name.toLowerCase().includes(q) || (pin ?? "").includes(q);
  const listFor = (z: Zone) =>
    CONFIRMED_AREAS.filter((a) => a.zone === z && match(a.name, a.pincode));

  const shownZones = ZONES.filter((z) => listFor(z).length > 0);
  const totalShown = shownZones.reduce((n, z) => n + listFor(z).length, 0);
  const priorityNames = new Set(PRIORITY_AREAS.map((a) => a.name));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Service Coverage</span>
      <h1 className="mt-2 text-5xl font-bold">Doorstep Service Areas in Bangalore</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Ride N Care serves {CONFIRMED_AREAS.length} Bangalore localities across {CONFIRMED_ZONE_PHRASE} Bangalore — {PRIORITY_AREAS.filter((a) => a.confirmed !== false).length} of them with fully detailed guides. Pick your neighbourhood for local details, nearby landmarks and doorstep service.
      </p>

      {/* Simple filter: zone chips + name/pincode search */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setZone("All")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${zone === "All" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary hover:text-primary"}`}
          >
            All zones
          </button>
          {ZONES.map((z) => {
            const count = CONFIRMED_AREAS.filter((a) => a.zone === z).length;
            if (count === 0) return null;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setZone(z)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${zone === z ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary hover:text-primary"}`}
              >
                {z} <span className="text-xs text-muted-foreground">({count})</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search area or pincode…"
          aria-label="Search areas by name or pincode"
          className="w-full max-w-xs rounded-full border border-border bg-card px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {zone === "All" ? (
        shownZones.map((z) => <ZoneSection key={z} zone={z} list={listFor(z)} priorityNames={priorityNames} />)
      ) : (
        <ZoneSection zone={zone} list={listFor(zone)} priorityNames={priorityNames} />
      )}

      {totalShown === 0 && (
        <p className="mt-10 text-muted-foreground">
          No area matches “{query}”. Try a pincode, or{" "}
          <Link to="/contact" className="text-primary hover:underline">ask us</Link> if we cover your street.
        </p>
      )}
    </div>
  );
}

function ZoneSection({
  zone,
  list,
  priorityNames,
}: {
  zone: Zone;
  list: typeof AREAS;
  priorityNames: Set<string>;
}) {
  if (list.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">
        {zone} Bangalore <span className="text-sm font-normal text-muted-foreground">({list.length})</span>
      </h2>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((a) => (
          <Link
            key={a.slug}
            to="/areas/$slug"
            params={{ slug: a.slug }}
            className="rounded-2xl border border-border bg-card p-4 hover:border-primary transition group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold group-hover:text-primary transition">📍 {a.name}</span>
              <span className="text-xs text-muted-foreground">{a.pincode}</span>
            </div>
            {a.nearby && a.nearby.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">Near {a.nearby.slice(0, 2).join(", ")}</p>
            )}
            {priorityNames.has(a.name) && (
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Detailed guide
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
