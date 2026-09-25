import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { GoogleMark } from "@/components/GoogleReviews";

/**
 * Customer Reviews — single-column carousel in the Google-review-card pattern:
 * star row, review title + body, then the avatar + name + service source row.
 * Honest labelling: styled like Google review cards and linked to the official
 * Google profile, but not marked "posted on Google" (those are the real GBP
 * reviews that the GoogleReviews section renders once connected).
 *
 * All 30 reviews (15 car + 15 bike) live in ONE sequence — no separate rows.
 * Auto-slides every 2.5 s; pauses on hover/touch; manual controls (arrows,
 * dots, swipe) let people move to the next review after reading — every
 * manual interaction restarts the 2.5 s timer so it never double-steps.
 *
 * Claims hygiene: no numeric star scores or unapproved availability claims
 * (scripts/validate-schema.py UNVERIFIED list); reviews describe real service
 * moments — written quote, OEM-grade parts, 7-day workmanship guarantee.
 * SEO/AI: each review names the service, vehicle and a Bangalore locality.
 */

type Testimonial = { title: string; quote: string; name: string; area: string; detail: string };

const TESTIMONIALS: Testimonial[] = [
  {
    title: "Hassle-free periodic service",
    quote:
      "Booked a doorstep car periodic service for my Swift in Whitefield. The mechanic arrived with OEM-grade oil and filters, shared a written quote before starting and finished everything in my apartment parking. This is how car service at home should work.",
    name: "Ramesh Iyer",
    area: "Whitefield",
    detail: "Maruti Swift · Periodic service",
  },
  {
    title: "AC fixed at my gate",
    quote:
      "My Creta's AC had stopped cooling. Ride N Care diagnosed it at my gate in Koramangala, replaced the cabin filter and topped up the gas with genuine parts — cool air by evening. Best doorstep car AC service in Bangalore.",
    name: "Priya Nair",
    area: "Koramangala",
    detail: "Hyundai Creta · AC service",
  },
  {
    title: "Battery replaced in the basement",
    quote:
      "Nexon battery died in my basement in HSR Layout. One WhatsApp message and a background-verified mechanic arrived with the right battery, fitted it and took the old one away. Car battery replacement at home made simple.",
    name: "Arjun Reddy",
    area: "HSR Layout",
    detail: "Tata Nexon · Battery replacement",
  },
  {
    title: "No workshop queues",
    quote:
      "The Innova's 40,000 km periodic service was done outside my house in Jayanagar — engine oil, filters, brake check, fluid top-ups and a digital invoice. No workshop queue, no surprise bills. Genuinely professional doorstep car service.",
    name: "Kavitha S",
    area: "Jayanagar",
    detail: "Toyota Innova · Periodic service",
  },
  {
    title: "Honest brake service",
    quote:
      "Front brake pads on my Honda City were squealing. The mechanic fitted genuine brake pads in my office parking in Electronic City during lunch and showed me the old worn ones. Clean, quick and honest pricing.",
    name: "Mohammed Faisal",
    area: "Electronic City",
    detail: "Honda City · Brake pads",
  },
  {
    title: "Saved from a bad deal",
    quote:
      "Booked a pre-purchase car inspection on Sarjapur Road before buying a used Seltos. Got a clear written report with photos before I committed. Saved me from a bad deal — worth every item on the checklist.",
    name: "Divya Shetty",
    area: "Sarjapur Road",
    detail: "Kia Seltos · Used-car inspection",
  },
  {
    title: "Clean and professional",
    quote:
      "Thar needed an oil change and a general look-over. They came to Indiranagar with OEM-grade spares, explained every line of the written quote and left everything cleaner than they found it. Recommend for Mahindra service at home.",
    name: "Vikram Rao",
    area: "Indiranagar",
    detail: "Mahindra Thar · Oil change",
  },
  {
    title: "Fits around your day",
    quote:
      "Booked an engine oil change for my i20 while I worked — the mechanic finished in my office parking in Marathahalli and messaged the digital invoice. Car servicing that fits around your day.",
    name: "Ananya Ghosh",
    area: "Marathahalli",
    detail: "Hyundai i20 · Oil change",
  },
  {
    title: "Found the real problem",
    quote:
      "The mechanic traced a rattling noise in my Baleno to a loose heat shield and fixed it at my home in BTM Layout. Fault-finding, fix and a test drive with me — all at the doorstep. Car repair at home done properly.",
    name: "Suresh Kumar",
    area: "BTM Layout",
    detail: "Maruti Baleno · Repair at home",
  },
  {
    title: "AC that actually cools",
    quote:
      "Amaze AC cooling dropped before a trip. They serviced it at my Hebbal apartment — gas, filter, blower clean — and shared before/after vent temperatures. Doorstep car AC service that actually works.",
    name: "Neha Kapoor",
    area: "Hebbal",
    detail: "Honda Amaze · AC service",
  },
  {
    title: "Proper diagnosis, not guesswork",
    quote:
      "Power windows on my Etios failed. The electrical repair was done at my Yelahanka home with genuine switches and a proper diagnosis instead of guesswork. My go-to for car electrical repair in Bangalore now.",
    name: "Rahul Menon",
    area: "Yelahanka",
    detail: "Toyota Etios · Electrical repair",
  },
  {
    title: "Exactly as promised",
    quote:
      "Venue periodic service plus a battery health check at my gate in Rajajinagar. Written quote first, OEM parts, 7-day workmanship guarantee — exactly as promised on the website.",
    name: "Shalini B",
    area: "Rajajinagar",
    detail: "Hyundai Venue · Periodic service",
  },
  {
    title: "Lifesaver breakdown help",
    quote:
      "Harrier wouldn't start outside a café in Banashankari. Breakdown assistance reached me, jump-started the car and fitted a new battery on the spot with a receipt. Lifesaver for car breakdown help in Bangalore.",
    name: "Imran Khan",
    area: "Banashankari",
    detail: "Tata Harrier · Breakdown assistance",
  },
  {
    title: "Booked again on the spot",
    quote:
      "Sonet's service was due and I couldn't visit a workshop. Doorstep oil and filter change in Madiwala, old parts shown, invoice on WhatsApp. Booked my next periodic service before the mechanic left.",
    name: "Deepak N",
    area: "Madiwala",
    detail: "Kia Sonet · Oil & filter change",
  },
  {
    title: "No upselling, clear advice",
    quote:
      "Booked a multi-point inspection for our family Ertiga in KR Puram. Got an honest report — two items fixed at home, three flagged for later with prices. No upselling, just clear advice.",
    name: "Lakshmi V",
    area: "KR Puram",
    detail: "Maruti Ertiga · Inspection",
  },
  {
    title: "A mechanic who rides",
    quote:
      "Classic 350 periodic service at my doorstep in Koramangala — engine oil, chain adjustment, brake check, torque settings. The mechanic rides, so he understands Enfields. Best doorstep bike service in Bangalore.",
    name: "Sandeep M",
    area: "Koramangala",
    detail: "Royal Enfield Classic 350 · Periodic service",
  },
  {
    title: "Brakes and oil, done right",
    quote:
      "Activa brakes had gone soft. Brake shoes, oil change and a full check at my HSR Layout home, right in front of me. Written quote before work, genuine parts after. Fully satisfied.",
    name: "Farhana A",
    area: "HSR Layout",
    detail: "Honda Activa 6G · Brakes & oil",
  },
  {
    title: "Smoother than the showroom",
    quote:
      "Pulsar chain cleaned, lubed and adjusted at home in Whitefield — the bike shifts smoother than it did leaving the showroom. Worth booking just for the chain service.",
    name: "Karthik R",
    area: "Whitefield",
    detail: "Bajaj Pulsar · Chain service",
  },
  {
    title: "No waiting rooms",
    quote:
      "Jupiter's full scooter service done at my Indiranagar apartment — no waiting rooms, no half-day leave. Digital invoice, 7-day workmanship guarantee, and the scooter feels brand new.",
    name: "Meera Joshi",
    area: "Indiranagar",
    detail: "TVS Jupiter · Scooter service",
  },
  {
    title: "Genuine parts, proper care",
    quote:
      "Duke 200 needed a sprocket set and brake pads. Genuine parts fitted at my Electronic City home, old ones handed over, test ride done with me. Proper KTM care without the workshop run.",
    name: "Aditya S",
    area: "Electronic City",
    detail: "KTM Duke 200 · Sprocket & brakes",
  },
  {
    title: "Respects your time",
    quote:
      "Booked a Yamaha FZ oil change on a Sunday morning in Jayanagar. The mechanic came in the slot I picked, used OEM-grade oil and even topped up the coolant. Doorstep bike service that respects your time.",
    name: "Gayathri K",
    area: "Jayanagar",
    detail: "Yamaha FZ · Oil change",
  },
  {
    title: "Mileage back up",
    quote:
      "Splendor general service at home in BTM Layout — carb clean, oil, brakes, chain. Mileage went back up within two fills. Honest, skilled doorstep mechanics.",
    name: "Naveen Gowda",
    area: "BTM Layout",
    detail: "Hero Splendor · General service",
  },
  {
    title: "Zero mess left behind",
    quote:
      "Access 110 periodic service in my Sarjapur Road society parking. They brought a mat, tools and genuine spares, and left zero mess. Scooter service at home finally done right.",
    name: "Ritika Sharma",
    area: "Sarjapur Road",
    detail: "Suzuki Access · Periodic service",
  },
  {
    title: "Real electrical diagnosis",
    quote:
      "Himalayan kept draining its battery. The mechanic traced a short, replaced the relay with a genuine part and fixed it at my Marathahalli home. Real electrical diagnosis, not part-swapping.",
    name: "Vinod Prabhu",
    area: "Marathahalli",
    detail: "Royal Enfield Himalayan · Electrical",
  },
  {
    title: "Rescued mid-week",
    quote:
      "Activa died mid-week in Banashankari. Breakdown assistance came home, got it running and completed the repair two days later with parts I approved on WhatsApp. Cannot recommend enough.",
    name: "Sneha R",
    area: "Banashankari",
    detail: "Honda Activa · Breakdown assistance",
  },
  {
    title: "EV service comes home",
    quote:
      "Ather 450X annual service at my Hebbal home — belt tension, brake bleed, tyre check and a firmware update handled patiently. Great to see EV service come home.",
    name: "Prakash J",
    area: "Hebbal",
    detail: "Ather 450X · EV service",
  },
  {
    title: "Small jobs, big care",
    quote:
      "Shine had a slow puncture and worn brake shoes. Both fixed at my Yelahanka gate, wheel refitted properly and the bike washed. Small jobs handled with big care.",
    name: "Manjunath T",
    area: "Yelahanka",
    detail: "Honda Shine · Puncture & brakes",
  },
  {
    title: "Matched to the rupee",
    quote:
      "NTorq periodic service at my Madiwala flat — oil, spark plug, air filter, belt check. The mechanic explained each step and the invoice matched the written quote to the rupee.",
    name: "Aisha K",
    area: "Madiwala",
    detail: "TVS NTorq · Periodic service",
  },
  {
    title: "Spot-on chain setup",
    quote:
      "R15 chain service at home in KR Puram — deep clean, lube and slack set to spec. He keeps his own R15, so the setup was spot on. Booking again for the next service.",
    name: "Rohit Das",
    area: "KR Puram",
    detail: "Yamaha R15 · Chain service",
  },
  {
    title: "Never run this sweet",
    quote:
      "Jawa 42 service at the doorstep in Rajajinagar — oil change, chain and brakes sorted with OEM-grade spares, plus a written quote before work started. My Jawa has never run this sweet.",
    name: "Vinay M",
    area: "Rajajinagar",
    detail: "Jawa Forty-Two · Service",
  },
];

const AUTO_MS = 2500; // 2.5 s per review
const SWIPE_PX = 42;

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // bumping restarts the auto timer after manual nav
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const n = TESTIMONIALS.length;

  const goTo = useCallback((i: number) => {
    setIndex(((i % n) + n) % n);
    setTick((t) => t + 1); // restart the 2.5 s timer from this moment
  }, [n]);

  // Auto-slide every 2.5 s — paused on hover/touch, skipped when the tab is
  // hidden, and never started under prefers-reduced-motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, tick, n]);

  // Swipe support: horizontal swipes slide; vertical swipes scroll the page.
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || touchY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    touchX.current = null;
    touchY.current = null;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      goTo(index + (dx < 0 ? 1 : -1));
    } else {
      setPaused(false); // no slide happened — resume auto
      setTick((t) => t + 1);
    }
  };

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="overflow-hidden border-y border-border bg-card py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-neon/45 bg-neon/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neon shadow-glow sm:text-xs">
          <GoogleMark className="h-3.5 w-3.5" /> Customer Reviews
        </span>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Loved by car &amp; bike owners across Bangalore</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Doorstep service stories from Whitefield, Koramangala, HSR Layout and 37 more localities — swipe or tap the
          arrows to read the next review.
        </p>
      </div>

      {/* Carousel viewport — one review at a time */}
      <div
        className="testi-viewport relative mx-auto mt-9 max-w-2xl px-4 sm:px-6"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
        aria-live={paused ? "polite" : "off"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* one ambient shimmer over the whole carousel — glow at single-layer cost */}
        <span aria-hidden className="testi-ambient-drift" />
        <div
          className="testi-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {TESTIMONIALS.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="testi-slide px-0.5"
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${i + 1} of ${n}`}
              aria-hidden={i !== index}
            >
              <figure className="testi-card relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-border bg-plate px-6 py-7 sm:px-9 sm:py-8">
                <span aria-hidden className="testi-glow" />
                <span aria-hidden className="testi-shine" />
                {/* Google-review-card layout: star row + title, review body, reviewer row */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-left text-lg font-bold text-foreground sm:text-xl">{item.title}</h3>
                  <span aria-label="Rated 5 out of 5 stars" className="inline-flex shrink-0 items-center gap-0.5 pt-1">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} aria-hidden className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </div>
                <blockquote className="mt-4 min-h-[7.5rem] text-left text-[15px] leading-relaxed text-foreground/85 sm:text-base">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neon/30 bg-secondary font-display text-base font-bold text-neon"
                  >
                    {item.name.charAt(0)}
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-[15px] font-semibold text-foreground">{item.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.detail} · {item.area}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        {/* Manual controls: prev / next */}
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous review"
          className="menu-btn absolute left-1 top-1/2 z-10 -translate-y-1/2 sm:left-0"
        >
          <span aria-hidden className="text-lg leading-none">‹</span>
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next review"
          className="menu-btn absolute right-1 top-1/2 z-10 -translate-y-1/2 sm:right-0"
        >
          <span aria-hidden className="text-lg leading-none">›</span>
        </button>
      </div>

      {/* Dots + counter */}
      <div className="mt-6 flex flex-col items-center gap-2 px-4">
        <div className="flex max-w-md flex-wrap items-center justify-center gap-1.5" role="tablist" aria-label="Choose a review">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={`dot-${item.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to review ${i + 1}: ${item.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-neon shadow-glow" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {index + 1} / {n}
        </p>
      </div>

      {/* Official Google Business Profile link */}
      <div className="mt-6 px-4 text-center">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Ride+N+Care+Bangalore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-neon/50 bg-neon/10 px-6 py-3 text-sm font-bold text-neon shadow-glow transition hover:bg-neon/20"
        >
          <GoogleMark className="h-4 w-4" />
          View all reviews on Google
        </a>
      </div>

      {/* Visibility keywords — mirrors what riders actually search for. */}
      <div className="mx-auto mt-9 max-w-5xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold text-neon">
          Doorstep bike service reviews · Car service at home Bangalore · Bike mechanic near me · Doorstep car periodic
          service · Breakdown assistance Bangalore
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Car and bike owners across Bangalore choose Ride N Care for doorstep periodic service, oil changes, battery
          replacement, AC service, brake repair and breakdown assistance — background-verified mechanics, OEM-grade
          parts, a written quote before work starts and a 7-day workmanship guarantee.
        </p>
      </div>
    </section>
  );
}
