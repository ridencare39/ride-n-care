/**
 * The ONE process guide (combined task, Task D) — replaces the old
 * "Our promises" / "Why Ride N Care" / "How it works" homepage sections.
 *
 * Content rules: every step uses only facts already live on the site
 * (Testimonials.tsx promises, service-page "How it works" steps).
 * No "Certified pros", "Live updates", "On time", "Free pickup & drop",
 * "seven days", "uniformed" or time promises (banned-claims list).
 *
 * Magic UX, hand-built: vertical timeline on mobile, horizontal stepper on
 * desktop, scroll-filled progress line (transform only), spotlight/border-beam
 * step cards, staggered reveal via IntersectionObserver. prefers-reduced-motion
 * parks all motion.
 */
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  ClipboardCheck,
  FileCheck2,
  IndianRupee,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

interface Step {
  n: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    n: "1",
    title: "Book",
    body: "Call, WhatsApp, the booking form or Book with AI. Share your vehicle, location and the issue — we confirm the visit.",
    icon: CalendarCheck,
  },
  {
    n: "2",
    title: "Written quote",
    body: "The mechanic checks the vehicle and confirms the price in writing. Work starts only after you approve it.",
    icon: FileCheck2,
  },
  {
    n: "3",
    title: "Service at your address",
    body: "A background-verified, KYC-checked mechanic works at your home or office with OEM-grade parts.",
    icon: Wrench,
  },
  {
    n: "4",
    title: "Check and handover",
    body: "You review the work with the mechanic. For bikes, take a short test ride before handover.",
    icon: ClipboardCheck,
  },
  {
    n: "5",
    title: "Pay",
    body: "UPI, card or cash. Your digital invoice arrives on WhatsApp or email.",
    icon: IndianRupee,
  },
  {
    n: "6",
    title: "7-day workmanship guarantee",
    body: "If something related to the work done goes wrong within 7 days, we come back and set it right at no extra charge.",
    icon: ShieldCheck,
  },
];

/** Five trust pillars, no repeats — drawn from the live guarantee/quote copy. */
const PILLARS: [string, string, LucideIcon][] = [
  ["Written quote first", "Price agreed before work starts", FileCheck2],
  ["Background-verified mechanics", "KYC-checked before every visit", BadgeCheck],
  ["OEM-grade parts", "Genuine spares fitted", Wrench],
  ["Digital invoice", "On WhatsApp or email", IndianRupee],
  ["7-day guarantee", "Workmanship guarantee on every job", ShieldCheck],
];

export function ProcessGuide() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Staggered reveal (transform/opacity only, one class flip).
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setRevealed(true);
            io.disconnect();
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(section);
      return () => io.disconnect();
    }
    setRevealed(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    if (!section || !fill) return;
    if (typeof IntersectionObserver === "undefined") return;

    // Progress line: fills (scaleX/scaleY) as the section scrolls through the
    // viewport. IntersectionObserver ratio + rAF-throttled CSS var write.
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh * 0.6;
      const passed = Math.min(Math.max(vh * 0.8 - rect.top, 0), total);
      const p = total > 0 ? Math.min(1, Math.max(0.04, passed / total)) : 0.04;
      fill.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="process relative mx-auto max-w-7xl scroll-mt-[76px] px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-primary">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
          The Ride N Care process
        </div>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">How Ride N Care works: from booking to handover</h2>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground leading-relaxed">
        Every booking follows the same six steps — a written quote before any work, and a 7-day workmanship guarantee at handover. Here is exactly what happens when you book doorstep bike or car service in Bangalore.
      </p>

      {/* Stepper / timeline. The track holds the fill; steps sit on top. */}
      <div className="process-track relative mt-12">
        <div aria-hidden className="process-line" />
        <div ref={fillRef} aria-hidden className="process-fill" style={{ "--p": 0.04 } as React.CSSProperties} />
        <ol className="process-steps relative grid gap-6 md:grid-cols-3 xl:grid-cols-6 xl:gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className={`process-step ${revealed ? "process-step-in" : ""}`}
              style={{ transitionDelay: revealed ? `${i * 120}ms` : undefined }}
            >
              <div className="process-card group rounded-2xl border border-border bg-card p-4 transition-colors duration-300 hover:border-primary/40">
                <span aria-hidden className="process-beam" />
                <span aria-hidden className="process-spotlight" />
                <div className="flex items-center gap-2.5">
                  <span className="process-badge grid h-9 w-9 shrink-0 place-items-center rounded-full bg-grad-accent font-display text-sm font-bold text-white shadow-glow">
                    {step.n}
                  </span>
                  <step.icon aria-hidden className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Trust pillars — one row, no repeats */}
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PILLARS.map(([title, sub, Icon]) => (
          <li key={title} className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" />
              <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </li>
        ))}
      </ul>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <BookingButton className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
          Book Now
        </BookingButton>
        <a
          href="https://wa.me/918296950339"
          target="_blank"
          rel="noopener"
          {...ctcProps("whatsapp_click", { vehicle_type: "unknown" })}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          <MessageCircle aria-hidden className="h-5 w-5" /> WhatsApp
        </a>
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", { vehicle_type: "unknown" })}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
        >
          <Phone aria-hidden className="h-5 w-5" /> Call
        </a>
      </div>
    </section>
  );
}
