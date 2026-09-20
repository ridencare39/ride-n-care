import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import logo from "@/assets/logo-96.webp";
import { SOCIAL } from "@/lib/seo";

type FooterLink = { label: string; to: string; params?: Record<string, string>; note?: string };

const SERVICES: FooterLink[] = [
  { label: "Bike Service", to: "/$service", params: { service: "bike-service" } },
  { label: "Doorstep Bike Service", to: "/$service", params: { service: "doorstep-bike-service" } },
  { label: "Bike Repair", to: "/$service", params: { service: "bike-repair" } },
  { label: "Scooter Service", to: "/$service", params: { service: "scooter-service" } },
  { label: "Engine Repair", to: "/$service", params: { service: "engine-repair" } },
  { label: "Emergency Repair", to: "/$service", params: { service: "emergency-bike-repair" } },
  { label: "Breakdown Assistance", to: "/$service", params: { service: "bike-breakdown-assistance" } },
  { label: "Car Service", to: "/cars" },
  { label: "Car Periodic Service", to: "/car-periodic-service" },
  { label: "Car AC Service", to: "/car-ac-service" },
  { label: "Car Battery", to: "/car-battery-service" },
  { label: "Car Brakes", to: "/car-brake-service" },
];

const COMPANY: FooterLink[] = [
  { label: "About Us", to: "/about" },
  { label: "Franchise", to: "/franchise", note: "New" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const LEARN: FooterLink[] = [
  { label: "FAQ", to: "/faq" },
  { label: "Answers", to: "/answers" },
  { label: "All Guides", to: "/guides" },
  { label: "Bike Service Guide", to: "/guides/$slug", params: { slug: "bike-service-guide-bangalore" } },
  { label: "Maintenance Guide", to: "/guides/$slug", params: { slug: "complete-bike-maintenance-guide" } },
  { label: "Breakdown Help", to: "/guides/$slug", params: { slug: "bike-breakdown-troubleshooting-guide" } },
  { label: "Service Areas", to: "/areas" },
];

const SOCIALS: { label: string; href: string; Icon: typeof Instagram }[] = [
  { label: "Instagram", href: SOCIAL.instagram, Icon: Instagram },
  { label: "Facebook", href: SOCIAL.facebook, Icon: Facebook },
  { label: "YouTube", href: SOCIAL.youtube, Icon: Youtube },
  { label: "Google Business Profile", href: SOCIAL.googleBusiness, Icon: MapPin },
];

function FooterColumn({ heading, items }: { heading: string; items: FooterLink[] }) {
  return (
    <nav aria-label={heading}>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon/90">{heading}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-white/65">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to as never}
              params={item.params as never}
              className="group inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <span aria-hidden className="h-px w-0 bg-neon transition-all duration-300 group-hover:w-2.5" />
              {item.label}
              {item.note && (
                <span className="rounded-full bg-neon/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neon">
                  {item.note}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 navy-sheen text-white border-t border-neon/30">
      {/* Neon top hairline */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-neon to-transparent opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Ride N Care" width={40} height={40} loading="lazy" decoding="async" className="rounded-full bg-white p-0.5" />
              <div>
                <h3 className="font-display font-bold text-lg leading-none text-glow-neon text-neon">Ride N Care</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/60 font-medium">Care in every mile</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Doorstep bike &amp; car service in Bangalore with OEM parts, transparent pricing and a 7-day workmanship guarantee.
            </p>

            <h4 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon/90">Follow us</h4>
            <div className="mt-3 flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  title={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-neon/60 hover:text-neon"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>

          </div>

          {/* Links */}
          <FooterColumn heading="Services" items={SERVICES} />
          <FooterColumn heading="Company" items={COMPANY} />
          <FooterColumn heading="Learn" items={LEARN} />

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon/90">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a href="tel:+918069409289" className="inline-flex items-start gap-2 transition hover:text-neon">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-neon/70" aria-hidden />
                  <span>
                    080 6940 9289
                    <span className="block text-xs text-white/45">Doorstep bike &amp; car service desk</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/918296950339" target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition hover:text-neon">
                  <MessageCircle className="h-4 w-4 shrink-0 text-neon/70" aria-hidden />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href="mailto:ridencareinfo@gmail.com" className="inline-flex items-center gap-2 break-all transition hover:text-neon">
                  <Mail className="h-4 w-4 shrink-0 text-neon/70" aria-hidden />
                  ridencareinfo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon/70" aria-hidden />
                <span>
                  Bangalore, Karnataka
                  <span className="block text-xs text-white/45">Doorstep across 40 localities</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/50 sm:flex-row sm:px-6 sm:text-left">
          <p>© {new Date().getFullYear()} Ride N Care. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Doorstep bike &amp; car service across Bangalore
            <ArrowUpRight className="h-3.5 w-3.5 text-neon/60" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
