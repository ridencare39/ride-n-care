import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display font-bold text-lg">RideCare<span className="text-primary">Plus</span></h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Doorstep bike & car service. Genuine parts. Transparent pricing.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/bikes">Bike Service</Link></li>
            <li><Link to="/cars">Car Service</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Cities</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Hyderabad</li>
            <li>Chennai</li>
            <li>Pune</li>
            <li>Visakhapatnam</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RideCare Plus. All rights reserved.
      </div>
    </footer>
  );
}