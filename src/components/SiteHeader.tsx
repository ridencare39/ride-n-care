import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bike,
  BotMessageSquare,
  CarFront,
  ChevronDown,
  ChevronRight,
  House,
  LifeBuoy,
  MessageCircle,
  Phone,
  Route as RouteIcon,
  X,
} from "lucide-react";
import logo from "@/assets/logo-96.webp";
import { useBooking } from "@/components/booking/BookingProvider";
import { ctcProps, trackCtc } from "@/lib/analytics";
import {
  MENU_BIKE_ROWS,
  MENU_CAR_ROWS,
  MENU_BREAKDOWN,
  MENU_FOOTER_ROWS,
  PANEL_SIMPLE_LINKS,
  TOP_NAV,
  type NavRow,
} from "@/lib/nav";

const PANEL_ID = "site-menu-panel";
const SERVICES_MENU_ID = "services-menu";
const BIKE_LIST_ID = "panel-bike-list";
const CAR_LIST_ID = "panel-car-list";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [processInView, setProcessInView] = useState(false);
  const [expanded, setExpanded] = useState<"bike" | "car" | null>(null);
  const { openBooking, openAiBooking } = useBooking();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  /** Set when we close AND return focus to the trigger, so the focus event does not re-open the menu. */
  const suppressFocusOpen = useRef(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Auto-expand Bike on a bike page, Car on a car page.
  useEffect(() => {
    if (MENU_CAR_ROWS.some((r) => r.params && pathname.startsWith(`/${r.params.service}`)) || pathname === "/cars") {
      setExpanded("car");
    } else if (MENU_BIKE_ROWS.some((r) => r.params && pathname.startsWith(`/${r.params.service}`))) {
      setExpanded("bike");
    }
  }, [pathname]);

  const topnavRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Sliding pill highlight: follows hover and rests on the active item.
  useEffect(() => {
    const nav = topnavRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const move = (el: Element | null) => {
      if (!el) return;
      const nr = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      pill.style.width = `${r.width}px`;
      pill.style.transform = `translate(${r.left - nr.left}px, -50%)`;
      pill.style.opacity = "1";
    };
    const hide = () => {
      const active = nav.querySelector<HTMLElement>(".nav-item-active");
      if (active) move(active);
      else pill.style.opacity = "0";
    };
    move(nav.querySelector<HTMLElement>(".nav-item-active"));
    const onOver = (e: MouseEvent) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(".nav-item");
      if (item) move(item);
    };
    nav.addEventListener("mouseover", onOver);
    nav.addEventListener("mouseleave", hide);
    return () => {
      nav.removeEventListener("mouseover", onOver);
      nav.removeEventListener("mouseleave", hide);
    };
  }, [pathname, menuOpen]);

  const closeMenu = () => {
    setOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  // Shrinking header + "Process" section highlight (homepage only).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setProcessInView(false);
      return;
    }
    const target = document.getElementById("process");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setProcessInView(entry.isIntersecting),
      { rootMargin: "-80px 0px -55% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  // Panel open/close side effects: scroll lock, initial focus, Escape + trap.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
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

  /* ── Services dropdown behaviour ─────────────────────────────────────────── */
  const openServices = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    setMenuOpen(true);
  }, []);
  const closeServices = useCallback((returnFocus = false) => {
    window.clearTimeout(hoverTimer.current);
    setMenuOpen(false);
    if (returnFocus) {
      suppressFocusOpen.current = true;
      servicesTriggerRef.current?.focus();
    }
  }, []);
  const hoverOpenServices = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMenuOpen(true), 120); // hover-intent
  }, []);
  const hoverCloseServices = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMenuOpen(false), 120);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeServices(true);
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
      if (items.length === 0) return;
      event.preventDefault();
      const idx = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "ArrowDown" ? (idx + 1 + items.length) % items.length : (idx - 1 + items.length) % items.length;
      items[next === items.length ? 0 : next]?.focus();
    };
    const onClick = (event: MouseEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !servicesTriggerRef.current?.contains(event.target as Node)
      ) {
        closeServices();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [menuOpen, closeServices]);

  const servicesActive = menuOpen;
  const isActive = (to: string) => (to === "/" ? pathname === "/" : to !== "/#" && pathname.startsWith(to));

  let stagger = 0;

  return (
    <>
      <header
        className={`site-header sticky top-0 z-40 border-b border-white/10 bg-hero backdrop-blur transition-all duration-200 ${scrolled ? "is-scrolled shadow-glow" : ""}`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent" />
        <div className="header-inner mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2 group" aria-label="Ride N Care — home">
            <span className="relative inline-flex rounded-full ring-1 ring-neon/40 ring-offset-2 ring-offset-transparent transition group-hover:ring-neon/80">
              <img src={logo} alt="" width={40} height={40} fetchPriority="high" decoding="async" className="rounded-full bg-plate p-0.5" />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-neon/10 opacity-0 transition group-hover:opacity-100" />
            </span>
            {/* Wordmark + tagline visible at every width (320px up) — responsive font, never hidden. */}
            <span className="flex min-w-0 flex-col leading-none">
              <span className="text-glow-neon whitespace-nowrap font-display text-sm font-bold tracking-tight text-neon min-[380px]:text-base sm:text-lg">Ride N Care</span>
              <span className="mt-0.5 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.14em] text-white/60 min-[380px]:text-[9px] sm:text-[10px] sm:tracking-[0.15em]">Care in every mile</span>
            </span>
          </Link>

          {/* Desktop top bar */}
          <nav ref={topnavRef} className="topnav relative hidden min-w-0 flex-1 items-center lg:flex" aria-label="Primary">
            <span ref={pillRef} aria-hidden className="nav-pill absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-neon/12 opacity-0 transition-[transform,width,opacity] duration-200 will-change-transform" data-navpill />
            <ul className="flex min-w-0 items-center gap-0.5">
              {TOP_NAV.map((item) => {
                if (item.label === "Our Services") {
                  return (
                    <li key={item.label} className="relative">
                      <a
                        ref={servicesTriggerRef}
                        href="/#services"
                        className={`nav-item nav-trigger relative z-[1] cursor-pointer ${servicesActive ? "nav-item-active" : ""}`}
                        aria-expanded={menuOpen}
                        aria-controls={SERVICES_MENU_ID}
                        aria-haspopup="true"
                        onMouseEnter={hoverOpenServices}
                        onMouseLeave={hoverCloseServices}
                        onFocus={(e) => {
                          // Return-focus after Escape must not re-open the menu,
                          // and mouse clicks that move focus must not open it.
                          if (suppressFocusOpen.current) {
                            suppressFocusOpen.current = false;
                            return;
                          }
                          if ((e.target as HTMLElement).matches(":focus-visible")) openServices();
                        }}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let the browser navigate
                          e.preventDefault();
                          if (menuOpen) closeServices(true);
                          else openServices();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " ") {
                            e.preventDefault();
                            if (menuOpen) closeServices(true);
                            else openServices();
                          }
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            openServices();
                            requestAnimationFrame(() =>
                              menuRef.current?.querySelector<HTMLElement>("a[href], button")?.focus(),
                            );
                          }
                        }}
                      >
                        {item.label}
                        <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
                      </a>
                    </li>
                  );
                }
                const active = item.to === "/#process" ? processInView && pathname === "/" : isActive(item.to);
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to.includes("#") ? "/" : (item.to as never)}
                      hash={item.to.includes("#") ? (item.to.split("#")[1] as never) : undefined}
                      className={`nav-item relative z-[1] whitespace-nowrap ${active ? "nav-item-active" : ""}`}
                      activeOptions={{ exact: item.to === "/" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn-shine hidden rounded-full bg-grad-accent px-5 py-2 text-[15px] font-semibold text-white shadow-glow-strong transition hover:brightness-110 active:scale-[0.98] md:inline-flex"
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={() => {
                trackCtc("book_with_ai_open");
                openAiBooking();
              }}
              aria-label="Book with AI assistant"
              className="ai-btn inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/8 px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap text-white backdrop-blur transition hover:bg-white/15 active:scale-[0.97] min-[380px]:px-3 min-[380px]:text-[15px]"
            >
              <BotMessageSquare className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span>Book with AI</span>
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="menu-btn text-white hover:text-neon max-[1099px]:flex lg:hidden"
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

        {/*
          "Our Services" dropdown — links stay in the DOM when closed
          (inert + aria-hidden, visibility delayed) so nav stays crawlable.
        */}
        <div
          id={SERVICES_MENU_ID}
          ref={menuRef}
          className={`services-menu ${menuOpen ? "services-menu-open" : ""}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          onMouseEnter={hoverOpenServices}
          onMouseLeave={hoverCloseServices}
        >
          <div className="mx-auto max-w-[760px] rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgb(10_26_47/0.98),rgb(6_15_30/0.99))] p-5 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-5 sm:grid-cols-2">
              <MenuColumn title="Bike Services" rows={MENU_BIKE_ROWS} tone="bike" panelOpen={menuOpen} />
              <MenuColumn title="Car Services" rows={MENU_CAR_ROWS} tone="car" panelOpen={menuOpen} />
            </div>
            <Link
              to={MENU_BREAKDOWN.to as never}
              onClick={() => closeServices()}
              className="mt-4 flex min-h-[48px] items-center gap-3 rounded-2xl border border-neon/40 bg-neon/10 px-4 text-sm font-semibold text-neon transition hover:bg-neon/20"
            >
              <LifeBuoy aria-hidden className="h-5 w-5 shrink-0" />
              {MENU_BREAKDOWN.label}
              <ChevronRight aria-hidden className="ml-auto h-4 w-4 shrink-0" />
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 px-1 pt-3 text-sm">
              {MENU_FOOTER_ROWS.map((r) => (
                <Link
                  key={r.label}
                  to={r.to as never}
                  onClick={() => closeServices()}
                  className="text-white/65 transition hover:text-neon"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/*
        Slide-in panel — sibling of the header so position:fixed is
        viewport-relative. Links are ALWAYS server-rendered; the closed state is
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
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2">
              <img src={logo} alt="" width={36} height={36} className="rounded-full bg-plate p-0.5" />
              <span className="font-display text-base font-bold text-glow-neon whitespace-nowrap text-neon">Ride N Care</span>
            </span>
            {/* Compact Book Now — same booking flow + tracking as the hero BookingButton. */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openBooking();
              }}
              className="btn-shine shrink-0 rounded-full bg-grad-accent px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-glow-strong transition hover:brightness-110 active:scale-[0.98]"
            >
              Book Now
            </button>
            <button type="button" onClick={() => closeMenu()} aria-label="Close menu" className="menu-btn text-white hover:text-neon">
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <div className="panel-body flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <div className="grid grid-cols-2 gap-3">
              <ServiceBox id="bike" open={expanded === "bike"} listId={BIKE_LIST_ID} count={MENU_BIKE_ROWS.length} onToggle={() => setExpanded(expanded === "bike" ? null : "bike")} />
              <ServiceBox id="car" open={expanded === "car"} listId={CAR_LIST_ID} count={MENU_CAR_ROWS.length} onToggle={() => setExpanded(expanded === "car" ? null : "car")} />
            </div>

            <PanelServiceList id={BIKE_LIST_ID} shown={expanded === "bike"} rows={MENU_BIKE_ROWS} hub={{ to: "/bikes", label: "View all bike services" }} panelOpen={open} onNavigate={closeMenu} baseDelay={0} />
            <PanelServiceList id={CAR_LIST_ID} shown={expanded === "car"} rows={MENU_CAR_ROWS} hub={{ to: "/cars", label: "View all car services" }} panelOpen={open} onNavigate={closeMenu} baseDelay={MENU_BIKE_ROWS.length} />

            <nav aria-label="Site" className="mt-4 border-t border-white/10 pt-2">
              <ul>
                {PANEL_SIMPLE_LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.label}>
                      <Link
                        to={l.to.includes("#") ? "/" : (l.to as never)}
                        hash={l.to.includes("#") ? (l.to.split("#")[1] as never) : undefined}
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

          <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[#050d1c]/95 p-3 backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:+918069409289" {...ctcProps("call_click", { vehicle_type: "unknown" })} className="hero-cta bg-grad-primary text-primary-foreground shadow-glow">
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

/* ── Desktop services menu column ──────────────────────────────────────────── */
function MenuColumn({ title, rows, tone, panelOpen }: { title: string; rows: NavRow[]; tone: "bike" | "car"; panelOpen: boolean }) {
  const hub = tone === "bike" ? { to: "/bikes", label: "View all bike services" } : { to: "/cars", label: "View all car services" };
  return (
    <div className={`menu-col menu-col-${tone}`}>
      <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">{title}</div>
      <ul>
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.label}>
              <Link
                to={r.to as never}
                params={r.params as never}
                onClick={() => undefined}
                className="menu-row flex min-h-[40px] items-center gap-2.5 rounded-xl px-2.5 text-[15px] text-white/80 transition-colors hover:bg-white/5 hover:text-neon"
              >
                <Icon aria-hidden className="h-4 w-4 shrink-0" />
                <span className="truncate">{r.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link to={hub.to as never} className="menu-row menu-row-hub flex min-h-[40px] items-center gap-2.5 rounded-xl px-2.5 text-[15px] font-semibold">
            <House aria-hidden className="h-4 w-4 shrink-0" />
            {hub.label}
            <ChevronRight aria-hidden className="ml-auto h-3.5 w-3.5 shrink-0" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

/* ── Panel: magic-style service box ────────────────────────────────────────── */
function ServiceBox({
  id,
  open,
  listId,
  count,
  onToggle,
}: {
  id: "bike" | "car";
  open: boolean;
  listId: string;
  count: number;
  onToggle: () => void;
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
      className={`svc-box ${bike ? "svc-box-bike" : "svc-box-car"} ${open ? "svc-box-active" : ""} cursor-pointer text-left`}
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

/* ── Panel: expandable service list (links never leave the DOM) ────────────── */
function PanelServiceList({
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
  rows: NavRow[];
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
