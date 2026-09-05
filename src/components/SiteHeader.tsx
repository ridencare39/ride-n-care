import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/logo.jpg.asset.json";

type NavLink = { to: "/$service"; params: { service: string }; label: string } | { to: string; params?: undefined; label: string };

const links: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/$service", params: { service: "bike-service" }, label: "Bike Service" },
  { to: "/$service", params: { service: "doorstep-bike-service" }, label: "Doorstep" },
  { to: "/$service", params: { service: "bike-repair" }, label: "Bike Repair" },
  { to: "/cars", label: "Cars" },
  { to: "/pricing", label: "Pricing" },
  { to: "/areas", label: "Areas" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="Ride N Care logo" width={40} height={40} className="rounded bg-white p-0.5" />
          <span className="font-display font-bold text-lg tracking-tight leading-none flex flex-col">
            <span>Ride N <span className="text-primary">Care</span></span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Care in every mile</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to as never}
              params={l.params as never}
              className="text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="hidden md:inline-flex items-center rounded-full bg-grad-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
        >
          Book Now
        </Link>
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded border border-border"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.label} to={l.to as never} params={l.params as never} onClick={() => setOpen(false)} className="text-sm">
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setOpen(false)} className="rounded-full bg-grad-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}