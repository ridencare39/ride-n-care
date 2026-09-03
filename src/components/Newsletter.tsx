import { useState } from "react";

const WHATSAPP_NUMBER = "918296950339";

function buildWhatsAppLink(email: string, source: string) {
  const text = encodeURIComponent(
    `Hi Ride N Care,\n\nI'd like to join your newsletter.\nEmail: ${email}\nSource: ${source}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 254) {
      setError("Please enter a valid email address.");
      return;
    }
    window.location.href = buildWhatsAppLink(trimmed, compact ? "footer" : "page");
  };

  if (compact) {
    return (
      <form onSubmit={submit} className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Care tips & exclusive offers in your inbox.</p>
        {done ? (
          <p className="text-sm text-accent font-medium">Thanks! You're on the list.</p>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              placeholder="you@email.com"
              className="flex-1 rounded-full bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button disabled={loading} className="rounded-full bg-grad-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
              {loading ? "…" : "Join"}
            </button>
          </div>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    );
  }

  return (
    <div className="rounded-3xl bg-grad-accent p-8 md:p-12 text-center shadow-glow">
      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground/80">Newsletter</span>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-accent-foreground">
        Smart car & bike tips, every fortnight.
      </h2>
      <p className="mt-3 text-accent-foreground/80 max-w-xl mx-auto">
        Join 5,000+ Bangalore riders and drivers getting monsoon checklists, monthly offers and DIY hacks.
      </p>
      {done ? (
        <p className="mt-6 text-lg font-semibold text-accent-foreground">🎉 You're subscribed — see you in the inbox!</p>
      ) : (
        <form onSubmit={submit} className="mt-6 mx-auto max-w-md flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            placeholder="Enter your email"
            className="flex-1 rounded-full bg-background border border-border px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button disabled={loading} className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60">
            {loading ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}