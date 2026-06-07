import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ride N Care" },
      { name: "description", content: "Ride N Care brings expert bike and car repair to your doorstep across India. Skilled mechanics, genuine parts, fair prices." },
      { property: "og:title", content: "About — Ride N Care" },
      { property: "og:description", content: "Doorstep bike and car repair across India." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-5xl font-bold">About Ride N Care</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        We started Ride N Care with one simple belief — getting your bike or car serviced shouldn't take a day off your week. Our certified, background-verified mechanics arrive at your doorstep with genuine parts and modern tools, finishing most jobs while you finish your coffee.
      </p>
      <div className="mt-10 grid sm:grid-cols-3 gap-6">
        <Stat v="5+" l="Years" />
        <Stat v="60+" l="Mechanics" />
        <Stat v="3,200+" l="Happy Riders" />
      </div>
      <h2 className="mt-12 text-3xl font-bold">Our promise</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li>• Genuine, OEM-grade parts with warranty.</li>
        <li>• Upfront pricing — quote before any work begins.</li>
        <li>• Trained, polite, background-verified mechanics.</li>
        <li>• Cashless payments and detailed digital invoices.</li>
      </ul>
    </div>
  );
}
function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-3xl font-display font-bold text-primary">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}