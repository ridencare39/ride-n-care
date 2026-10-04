import { createFileRoute, Link } from "@tanstack/react-router";
import bike from "@/assets/services/doorstep-bike-service.webp";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BIKE_FAQS } from "@/lib/service-faqs";
import { BIKE_PACKAGES, ELECTRIC_BIKE_PACKAGES } from "@/lib/pricing";
import { BookingButton } from "@/components/booking/BookingButton";

const brands = ["TVS","Bajaj","Royal Enfield","Yamaha","Honda","Hero","Suzuki","KTM","Jawa","Harley Davidson","Ducati","Kawasaki","Benelli","Triumph","BMW","Aprilia","Yezdi","Husqvarna"];
export const Route = createFileRoute("/bikes")({
  head: () => ({
    ...pageHead({
      title: "Doorstep Bike Service in Bangalore — All CCs | Ride N Care",
      description:
        "At-home bike service in Bangalore for every CC — TVS, Bajaj, Royal Enfield, KTM, Harley. OEM parts, certified mechanics, 60–90 min service.",
      path: "/bikes",
      ogImage: bike,
      // Above-the-fold hero image — preload it with the document.
      preloadImage: bike,
      extraMeta: [
      { property: "og:title", content: "Doorstep Bike Service in Bangalore | Ride N Care" },
      { property: "og:description", content: "At-home bike service in Bangalore for all CCs with genuine parts, transparent pricing and certified mechanics." },
    ],
    }),
    scripts: [
      ...pageScripts(
        graphForPage([
          serviceNode({
            slug: "bikes",
            name: "Doorstep Bike Service",
            serviceType: "Doorstep Bike Service",
            description:
              "At-home bike service in Bangalore for every CC — TVS, Bajaj, Royal Enfield, KTM, Harley. OEM parts, certified mechanics, 60–90 min service.",
            priceFrom: 799,
          }),
          breadcrumbNode([
            ["Home", "/"],
            ["Bike Service", "/bikes"],
          ]),
          faqNode(BIKE_FAQS),
        ]),
      ),
    ],
  }),
  component: Bikes,
});

function Bikes() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Two Wheelers</span>
          <h1 className="mt-2 text-5xl font-bold">Bike Service at Home</h1>
          <p className="mt-4 text-muted-foreground">From scooters to litre-class superbikes — our mechanics show up with genuine parts and finish most jobs in under 90 minutes.</p>
          <BookingButton vehicle="bike" className="mt-6 h-12 rounded-full bg-grad-primary px-6 font-semibold text-primary-foreground shadow-glow">Book a Bike Service</BookingButton>
          <p className="mt-3 text-sm text-muted-foreground">Bike mechanic available in Bangalore during operating hours — 7 AM to 11:30 PM, every day. Book by call or WhatsApp.</p>
        </div>
        <img
          src={bike}
          alt="Ride N Care mechanic performing a doorstep bike service on a customer's motorcycle"
          width={1600}
          height={1200}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/3] w-full rounded-3xl border border-neon/25 object-cover shadow-glow ring-1 ring-white/10 sm:aspect-[16/10]"
        />
      </div>

      <h2 className="mt-20 text-3xl font-bold">Service Packages</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BIKE_PACKAGES.filter((item) => item.serviceId === "general-service").map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition">
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">At-Home {t.tier}</div>
            <div className="mt-1 text-muted-foreground text-sm">{t.cc}</div>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹{t.price.toLocaleString("en-IN")}</span>
            </div>
            <ul className="mt-4 text-sm space-y-1 text-muted-foreground">
              {t.includes.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <BookingButton vehicle="bike" packageId={t.id} className="btn-book mt-5 h-11 w-full rounded-full px-4 font-semibold">Book Now</BookingButton>
          </div>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Electric Vehicle Service</h2>
      <p className="mt-2 text-muted-foreground">Same three flat-price packages for every electric scooter and bike — Ola, Ather, TVS iQube, Bajaj Chetak, Vida, Revolt and more. No engine CC needed.</p>
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {ELECTRIC_BIKE_PACKAGES.map((item) => (
          <div key={item.id} className="rounded-2xl border border-neon/30 bg-card p-6 hover:border-primary transition">
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">⚡ {item.name}</div>
            <div className="mt-1 text-muted-foreground text-sm">All electric models</div>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹{item.price?.toLocaleString("en-IN")}</span>
            </div>
            <ul className="mt-4 text-sm space-y-1 text-muted-foreground">
              {item.includes.slice(0, 4).map((inc) => <li key={inc}>• {inc}</li>)}
            </ul>
            <BookingButton vehicle="bike" packageId={item.id} className="btn-book mt-5 h-11 w-full rounded-full px-4 font-semibold">Book Now</BookingButton>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Need a repair outside these packages? We inspect first and quote before any additional work — nothing is done without your approval. Full scope and honest limits: <Link to="/ev-two-wheeler-service" className="text-primary hover:underline">EV &amp; electric scooter service</Link>.</p>

      <h2 className="mt-20 text-3xl font-bold">Brands We Service</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <span key={b} className="rounded-full border border-border px-4 py-2 text-sm bg-card">{b}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground self-center">Brand pages:</span>
        <Link to="/$service" params={{ service: "royal-enfield-service" }} className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10">Royal Enfield service</Link>
        <Link to="/$service" params={{ service: "ktm-service" }} className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10">KTM service</Link>
        <Link to="/$service" params={{ service: "honda-two-wheeler-service" }} className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10">Honda two-wheeler service</Link>
        <Link to="/$service" params={{ service: "tvs-two-wheeler-service" }} className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10">TVS two-wheeler service</Link>
      </div>

      <h2 className="mt-20 text-3xl font-bold">Bike service FAQs</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {BIKE_FAQS.map(([q, a]) => (
          <details key={q} className="group p-6">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
              <span className="font-semibold">{q}</span>
              <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}