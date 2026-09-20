import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  BatteryCharging,
  Bike,
  BotMessageSquare,
  BookOpen,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Disc3,
  DoorOpen,
  Gauge,
  House,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  Phone,
  Snowflake,
  Sparkles,
  Store,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/logo-96.webp";
import { useBooking } from "@/components/booking/BookingProvider";
import { ctcProps, trackCtc } from "@/lib/analytics";
import { SERVICES } from "@/lib/services";
import { CAR_SERVICES } from "@/lib/car-services";

/** A row in one of the expandable service lists. */
type ServiceRow = { to: string; params?: Record<string, string>; label: string; icon: LucideIcon };

/** Live bike service pages (src/lib/services.ts). Re-order the two hero pages first. */
const BIKE_ORDER = [
  "bike-service",
  "doorstep-bike-service",
  "bike-repair",
  "scooter-service",
  "engine-repair",
  "battery-service",
  "emergency-bike-repair",
  "bike-breakdown-assistance",
  "periodic-bike-service",
] as const;
const BIKE_ROW_ICONS: Record<string, LucideIcon> = {
  "bike-service": Wrench,
  "doorstep-bike-service": DoorOpen,
  "bike-repair": Disc3,
  "scooter-service": Gauge,
  "engine-repair": Zap,
  "battery-service": BatteryCharging,
  "emergency-bike-repair": LifeBuoy,
  "bike-breakdown-assistance": Sparkles,
  "periodic-bike-service": Snowflake,
};
const BIKE_ROWS: ServiceRow[] = BIKE_ORDER.filter((slug) => SERVICES.some((s) => s.slug === slug)).map((slug) => ({
  to: "/$service",
  params: { service: slug },
  label: SERVICES.find((s) => s.slug === slug)!.name,
  icon: BIKE_ROW_ICONS[slug] ?? Wrench,
}));

/** Live car service pages (src/lib/car-services.ts). */
const CAR_ORDER = ["car-periodic-service", "car-ac-service", "car-battery-service", "car-brake-service"] as const;
const CAR_ROW_ICONS: Record<string, LucideIcon> = {
  "car-periodic-service": Wrench,
  "car-ac-service": Snowflake,
  "car-battery-service": BatteryCharging,
  "car-brake-service": Disc3,
};
const CAR_ROWS: ServiceRow[] = CAR_ORDER.filter((slug) => CAR_SERVICES.some((s) => s.slug === slug)).map((slug) => ({
  to: "/$service",
  params: { service: slug },
  label: CAR_SERVICES.find((s) => s.slug === slug)!.name,
  icon: CAR_ROW_ICONS[slug] ?? Wrench,
}));

/** Simple links below the service boxes — exact order from the brief. */
const SIMPLE_LINKS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/areas", label: "Areas We Serve", icon: MapPin },
  { to: "/blog", label: "Our Blog", icon: Newspaper },
  { to: "/franchise", label: "Franchise", icon: Store },
  { to: "/faq", label: "FAQ", icon: CircleHelp },
  { to: "/contact", label: "Contact", icon: Mail },
];

/** Desktop nav pills (unchanged routes) — shown alongside the hamburger at lg+. */
const DESKTOP_NAV: { to: string; params?: Record<string, string>; label: string }[] = [
  { to: "/$service", params: { service: "bike-service" }, label: "Bike Service" },
  { to: "/$service", params: { service: "doorstep-bike-service" }, label: "Doorstep" },
  { to: "/$service", params: { service: "bike-repair" }, label: "Bike Repair" },
  { to: "/cars", label: "Cars" },
  { to: "/", label: "Home" },
  { to: "/areas", label: "Areas" },
  { to: "/guides", label: "Guides" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/franchise", label: "Franchise" },
];

const PANEL_ID = "site-menu-panel";
const BIKE_LIST_ID = "panel-bike-list";
const CAR_LIST_ID = "panel-car-list";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<"bike" | "car" | null>(null);
  const { openBooking, openAiBooking } = useBooking();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-expand Bike on a bike page, Car on a car page (panel starts collapsed elsewhere).
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (CAR_SERVICES.some((s) => pathname.startsWith(`/${s.slug}`)) || pathname === "/cars") {
      setExpanded("car");
    } else if (SERVICES.some((s) => pathname.startsWith(`/${s.slug}`))) {
      setExpanded("bike");
    }
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    // Return focus to the hamburger button on close.
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  // Deepen the bar shadow once the page scrolls for a premium layered feel.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Open/close side effects: scroll lock, initial focus, Escape + focus trap.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }, [open]);

  let stagger = 0;

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-white/10 bg-hero backdrop-blur transition-shadow duration-300 ${scrolled ? "shadow-glow" : ""}`}
      >
        {/* Neon accent hairline under the navy bar */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Ride N Care — home">
            <span className="relative inline-flex rounded-full ring-1 ring-neon/40 ring-offset-2 ring-offset-transparent transition group-hover:ring-neon/80">
              <img src={logo} alt="" width={40} height={40} fetchPriority="high" decoding="async" className="rounded-full bg-plate p-0.5" />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-neon/10 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight leading-none flex flex-col">
              <span className="text-glow-neon text-neon">Ride N Care</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/60 font-medium">Care in every mile</span>
            </span>
          </Link>
          {/* Full nav fits from xl up; 1024–1279 uses the hamburger (which now
              works at every width) so the row never pushes the button off-screen. */}
          <nav className="hidden xl:flex items-center gap-1 text-sm" aria-label="Primary">
            {DESKTOP_NAV.map((l) => (
              <Link
                key={l.label}
                to={l.to as never}
                params={l.params as never}
                className="rounded-full px-3 py-1.5 text-white/70 hover:text-neon hover:bg-white/5 transition"
                activeProps={{ className: "text-neon font-semibold bg-neon/10" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                trackCtc("book_with_ai_open");
                openAiBooking();
              }}
              aria-label="Book with AI assistant"
              title="Book with AI"
              className="ai-btn inline-flex shrink-0 items-center gap-1.5 rounded-full bg-grad-accent px-3 py-2 text-xs font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.97]"
            >
              <BotMessageSquare className="h-4.5 w-4.5 shrink-0" aria-hidden />
              Book with AI
            </button>
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn-shine hidden md:inline-flex items-center rounded-full bg-grad-accent px-5 py-2 text-sm font-semibold text-white shadow-glow-strong transition hover:brightness-110 active:scale-[0.98]"
            >
              Book Now
            </button>
            {/* Hamburger — rendered at EVERY width so the panel opens on desktop too */}
            <button
              ref={toggleRef}
              type="button"
              className="menu-btn text-white hover:text-neon"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={PANEL_ID}
              onClick={() => (open ? closeMenu() : setOpen(true))}
            >
              <span className="menu-burger" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/*
        Slide-in menu. Rendered as a SIBLING of the header (a transform/filter
        ancestor would make position:fixed relative to the header and trap the
        panel in the header's stacking context). The panel and its links are
        ALWAYS server-rendered so nav stays crawlable; the closed state is
        transform + aria-hidden/inert.
      */}
      <div
        id={PANEL_ID}
        ref={panelRef}
        className={`panel-root ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="panel-backdrop" aria-hidden onClick={() => closeMenu()} />
        <aside role="dialog" aria-modal="true" aria-label="Site menu" className="panel">
          {/* Panel header: logo + close */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex items-center gap-2">
              <img src={logo} alt="" width={36} height={36} className="rounded-full bg-plate p-0.5" />
              <span className="font-display text-base font-bold text-glow-neon text-neon">Ride N Care</span>
            </span>
            <button type="button" onClick={() => closeMenu()} aria-label="Close menu" className="menu-btn text-white hover:text-neon">
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable body: service boxes + simple links. Footer stays pinned. */}
          <div className="panel-body flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            {/* A. Magic-style Bike / Car boxes — expand their list below */}
            <div className="grid grid-cols-2 gap-3">
              <ServiceBox
                id="bike"
                open={expanded === "bike"}
                listId={BIKE_LIST_ID}
                count={BIKE_ROWS.length}
                onToggle={() => setExpanded(expanded === "bike" ? null : "bike")}
                panelOpen={open}
              />
              <ServiceBox
                id="car"
                open={expanded === "car"}
                listId={CAR_LIST_ID}
                count={CAR_ROWS.length}
                onToggle={() => setExpanded(expanded === "car" ? null : "car")}
                panelOpen={open}
              />
            </div>

            {/* Expandable category lists (one open at a time, links stay in the DOM) */}
            <ServiceList id={BIKE_LIST_ID} shown={expanded === "bike"} rows={BIKE_ROWS} hub={{ to: "/bikes", label: "View all bike services" }} panelOpen={open} onNavigate={closeMenu} baseDelay={0} />
            <ServiceList id={CAR_LIST_ID} shown={expanded === "car"} rows={CAR_ROWS} hub={{ to: "/cars", label: "View all car services" }} panelOpen={open} onNavigate={closeMenu} baseDelay={BIKE_ROWS.length} />

            {/* B. Simple links */}
            <nav aria-label="Site" className="mt-4 border-t border-white/10 pt-2">
              <ul>
                {SIMPLE_LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.label}>
                      <Link
                        to={l.to as never}
                        params={undefined}
                        onClick={() => closeMenu()}
                        activeProps={{ className: "text-neon font-semibold bg-neon/10" }}
                        activeOptions={{ exact: l.to === "/" }}
                        style={{ animationDelay: `${120 + stagger++ * 35}ms` }}
                        className={`panel-row ${open ? "panel-row-in" : ""} flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-sm text-white/85 hover:bg-white/5 hover:text-neon transition-colors`}
                      >
                        <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" />
                        {l.label}
                        <ChevronRight aria-hidden className="ml-auto h-4 w-4 shrink-0 text-white/35" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* C. Sticky contact footer — styled like the hero buttons, same events */}
          <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[#050d1c]/95 p-3 backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+918069409289"
                {...ctcProps("call_click", { vehicle_type: "unknown" })}
                className="hero-cta bg-grad-primary text-primary-foreground shadow-glow"
              >
                <Phone aria-hidden className="h-5 w-5 shrink-0" />
                080 6940 9289
              </a>
              <a
                href="https://wa.me/918296950339"
                target="_blank"
                rel="noopener"
                {...ctcProps("whatsapp_click", { vehicle_type: "unknown" })}
                className="hero-cta hero-cta-glass"
              >
                <MessageCircle aria-hidden className="h-5 w-5 shrink-0 text-neon" />
                82969 50339
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/** Magic-style Bike/Car box: glass, gradient hairline border, slow beam, glow when active. */
function ServiceBox({
  id,
  open,
  listId,
  count,
  onToggle,
  panelOpen,
}: {
  id: "bike" | "car";
  open: boolean;
  listId: string;
  count: number;
  onToggle: () => void;
  panelOpen: boolean;
}) {
  const bike = id === "bike";
  const Icon = bike ? Bike : CarFront;
  const title = bike ? "Bike Service" : "Car Service";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={listId}
      className={`svc-box ${bike ? "svc-box-bike" : "svc-box-car"} ${open ? "svc-box-active" : ""} group cursor-pointer text-left`}
    >
      <span className="svc-box-beam" aria-hidden />
      <span className="svc-box-inner">
        <span className="flex items-center justify-between">
          <Icon aria-hidden className="h-6 w-6 shrink-0" />
          <ChevronDown aria-hidden className={`svc-box-chevron h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="mt-2 block font-display text-sm font-bold leading-tight text-white">{title}</span>
        <span className="mt-0.5 block text-[11px] text-white/60">{count} services</span>
      </span>
    </button>
  );
}

/**
 * Expandable list under the two boxes. Collapsed = grid-template-rows 0fr
 * (smooth height animation) with the links kept IN THE DOM, hidden from AT via
 * aria-hidden + inert — never display:none, so SEO keeps every <a href>.
 */
function ServiceList({
  id,
  shown,
  rows,
  hub,
  panelOpen,
  onNavigate,
  baseDelay,
}: {
  id: string;
  shown: boolean;
  rows: ServiceRow[];
  hub: { to: string; label: string };
  panelOpen: boolean;
  onNavigate: () => void;
  baseDelay: number;
}) {
  return (
    <div className={`svc-list ${shown ? "svc-list-open" : ""}`} aria-hidden={!shown} inert={!shown ? true : undefined}>
      <div className="svc-list-clip">
        <ul id={id} className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={r.label}>
                <Link
                  to={r.to as never}
                  params={r.params as never}
                  onClick={() => onNavigate()}
                  activeProps={{ className: "text-neon font-semibold bg-neon/10" }}
                  style={{ animationDelay: `${120 + (baseDelay + i) * 35}ms` }}
                  className={`panel-row ${panelOpen && shown ? "panel-row-in" : ""} flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-[13px] text-white/80 hover:bg-white/5 hover:text-neon transition-colors`}
                >
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-white/50" />
                  {r.label}
                  <ChevronRight aria-hidden className="ml-auto h-3.5 w-3.5 shrink-0 text-white/30" />
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to={hub.to as never}
              params={undefined}
              onClick={() => onNavigate()}
              style={{ animationDelay: `${120 + (baseDelay + rows.length) * 35}ms` }}
              className={`panel-row ${panelOpen && shown ? "panel-row-in" : ""} flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-neon hover:bg-neon/10 transition-colors`}
            >
              <House aria-hidden className="h-4 w-4 shrink-0" />
              {hub.label}
              <ChevronRight aria-hidden className="ml-auto h-3.5 w-3.5 shrink-0 text-neon/50" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
