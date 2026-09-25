import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { getGoogleReviews, type GoogleReviewsResult } from "@/lib/google-reviews.functions";

/**
 * "What Our Customers Say" — REAL Google reviews from the official Ride N Care
 * Google Business Profile. Two connection modes, both real-data only:
 *
 *  1. Official Google Places API (New) — used when the server has
 *     GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID. Free monthly usage tier; needs
 *     a Google billing account.
 *  2. Trustindex free widget (no Google billing, no card) — used when
 *     VITE_TRUSTINDEX_WIDGET_ID is set. Trustindex's free-forever plan pulls
 *     the genuine reviews from the Google Business Profile.
 *
 * Guarantees: every word comes from Google. Nothing is invented or edited.
 * With no connection configured this section renders NOTHING — never
 * placeholder or sample reviews.
 */

const TRUSTINDEX_WIDGET_ID = (import.meta.env.VITE_TRUSTINDEX_WIDGET_ID as string | undefined)?.trim();

export function GoogleReviews() {
  const fetchReviews = useServerFn(getGoogleReviews);
  const { data, isLoading } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: () => fetchReviews(),
    staleTime: 1000 * 60 * 30, // Google ratings change rarely; half-hour refresh
  });

  if (isLoading) return null;
  if (data?.configured) return <PlacesReviews data={data} />;
  if (TRUSTINDEX_WIDGET_ID) return <TrustindexReviews widgetId={TRUSTINDEX_WIDGET_ID} />;
  return null;
}

/** Shared section shell — title + Google badge + official profile link. */
function SectionShell({ children, googleUrl }: { children: React.ReactNode; googleUrl: string }) {
  return (
    <section id="google-reviews" aria-label="Google reviews" className="overflow-hidden border-y border-border bg-card py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/45 bg-neon/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neon sm:text-xs">
            <GoogleMark className="h-3.5 w-3.5" /> Google Reviews
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">What Our Customers Say</h2>
        </div>
        {children}
        <div className="mt-7 text-center">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-neon/50 bg-neon/10 px-6 py-3 text-sm font-bold text-neon shadow-glow transition hover:bg-neon/20"
          >
            <GoogleMark className="h-4 w-4" />
            View all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Mode 1: official Google Places API (New) ─────────────────────────── */

function PlacesReviews({ data }: { data: GoogleReviewsResult }) {
  if (data.reviews.length === 0) return null;
  const rating = data.rating;
  const count = data.reviewCount;
  const googleUrl = data.googleUrl ?? "https://www.google.com/maps";

  return (
    <SectionShell googleUrl={googleUrl}>
      {(rating !== null || count !== null) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {rating !== null && (
            <span className="inline-flex items-center gap-1.5 text-2xl font-bold">
              <Star aria-hidden className="h-6 w-6 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          )}
          {count !== null && (
            <span className="text-sm font-semibold text-muted-foreground">
              {count} Reviews on Google
            </span>
          )}
        </div>
      )}

      {/* Review cards — native horizontal scroll with snap (mobile & desktop) */}
      <div
        className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Google reviews"
      >
        {data.reviews.map((review, i) => (
          <figure
            key={`${review.authorName}-${i}`}
            className="shadow-card relative flex min-w-[85%] snap-center flex-col overflow-hidden rounded-3xl border border-border bg-plate px-6 py-7 sm:min-w-[46%] lg:min-w-[31%] sm:px-8"
          >
            <div className="flex items-center justify-between gap-3">
              <span aria-label={`Rated ${review.rating} out of 5`} className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, s) => (
                  <Star
                    key={s}
                    aria-hidden
                    className={`h-4 w-4 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </span>
              {review.relativeTime && (
                <time className="shrink-0 text-xs text-muted-foreground">{review.relativeTime}</time>
              )}
            </div>
            {review.text && (
              <blockquote className="mt-4 line-clamp-6 flex-1 text-[15px] leading-relaxed text-foreground/85">
                {review.text.trim()}
              </blockquote>
            )}
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
              {review.photoUrl ? (
                <img
                  src={review.photoUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-full border border-neon/30 object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neon/30 bg-secondary font-display text-base font-bold text-neon"
                >
                  {review.authorName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{review.authorName}</span>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground">Google review</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── Mode 2: Trustindex free widget (real GBP reviews, no billing) ────── */

/**
 * Trustindex serves the widget from its own CDN and refreshes the reviews
 * daily on its free plan. The widget ID is public embed data (it appears in
 * the standard embed snippet), so reading it from a VITE_ env var is safe.
 */
function TrustindexReviews({ widgetId }: { widgetId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const script = document.createElement("script");
    script.src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
    script.async = true;
    host.appendChild(script);
    return () => {
      script.remove();
    };
  }, [widgetId]);

  return (
    <SectionShell googleUrl="https://www.google.com/maps/search/?api=1&query=Ride+N+Care+Bangalore">
      <div ref={hostRef} className="mt-8" />
    </SectionShell>
  );
}

/** Inline multicolour Google "G" (brand-accurate colours, aria-hidden). */
export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}
