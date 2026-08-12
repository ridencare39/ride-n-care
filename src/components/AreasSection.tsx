import { Link } from "@tanstack/react-router";
import { AREAS } from "@/lib/areas";

export function AreasSection() {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Service areas in Bangalore</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold">Doorstep mechanics near you</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Looking for a bike or car mechanic near you? Pick your locality for pincode-level slots, nearby landmarks and same-day doorstep service.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
            >
              {a.name}
              {a.pincode ? <span className="text-muted-foreground"> · {a.pincode}</span> : null}
            </Link>
          ))}
        </div>
        <Link to="/areas" className="mt-5 inline-block text-primary font-semibold hover:underline">
          See all Bangalore areas →
        </Link>
      </div>
    </section>
  );
}
