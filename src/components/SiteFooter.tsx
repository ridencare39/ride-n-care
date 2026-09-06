import { Link } from "@tanstack/react-router";
import logo from "@/assets/ride-n-care-logo.jpg.asset.json";
import { Newsletter } from "@/components/Newsletter";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-6">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo.url} alt="Ride N Care" width={36} height={36} className="rounded bg-plate p-0.5" />
            <h3 className="font-display font-bold text-lg">Ride N <span className="text-primary">Care</span></h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Care in every mile. Doorstep bike & car service with genuine parts and transparent pricing.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/$service" params={{ service: "bike-service" }}>Bike Service</Link></li>
            <li><Link to="/$service" params={{ service: "doorstep-bike-service" }}>Doorstep Bike Service</Link></li>
            <li><Link to="/$service" params={{ service: "bike-repair" }}>Bike Repair</Link></li>
            <li><Link to="/$service" params={{ service: "scooter-service" }}>Scooter Service</Link></li>
            <li><Link to="/$service" params={{ service: "emergency-bike-repair" }}>Emergency Repair</Link></li>
            <li><Link to="/cars">Car Service</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="tel:08069409289" className="hover:text-primary">📞 080 6940 9289</a></li>
            <li><a href="https://wa.me/918296950339" className="hover:text-primary">💬 +91 82969 50339</a></li>
            <li><a href="mailto:ridencareinfo@gmail.com" className="hover:text-primary">✉ ridencareinfo@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Address</h4>
          <p className="text-sm text-muted-foreground">Bangalore, Karnataka<br />India</p>
        </div>
        <div className="md:col-span-1">
          <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
          <Newsletter compact />
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ride N Care. All rights reserved.
      </div>
    </footer>
  );
}