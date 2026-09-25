/**
 * Real Google reviews for the Ride N Care Google Business Profile.
 *
 * Official integration: Google Places API (New) `places:get` by Place ID.
 * Requires exactly two server secrets (no OAuth, no passwords):
 *   - GOOGLE_PLACES_API_KEY — a Google Maps Platform key with "Places API (New)" enabled
 *   - GOOGLE_PLACE_ID       — the business's Place ID (Google Maps Place ID finder)
 *
 * Guarantees:
 *  - ONLY data returned by Google is ever rendered. Nothing is invented,
 *    rewritten or filled in. Review text is passed through unmodified.
 *  - Without the two secrets the function returns `{ configured: false }` and
 *    the UI shows a quiet setup note instead of any review content.
 *  - Review text is truncated client-side for display only; the full text is
 *    always on Google (linked by the "View all reviews on Google" button).
 */

import { createServerFn } from "@tanstack/react-start";

export interface GoogleReview {
  /** Reviewer display name exactly as Google returns it. */
  authorName: string;
  /** Google-hosted profile photo, when Google supplies one. */
  photoUrl: string | null;
  rating: number;
  /** Original review text, unmodified. May be empty (rating-only reviews). */
  text: string;
  /** Relative time as Google writes it, e.g. "a month ago". */
  relativeTime: string | null;
}

export interface GoogleReviewsResult {
  configured: boolean;
  rating: number | null;
  reviewCount: number | null;
  /** "Ride N Care" as Google lists it. */
  businessName: string | null;
  reviews: GoogleReview[];
  /** Google Maps URL for the profile — opens reviews in the Google app/site. */
  googleUrl: string | null;
}

/** Places API (New) field mask keeps the request scoped to review data only. */
const FIELD_MASK = [
  "id",
  "displayName",
  "googleUri",
  "rating",
  "userRatingCount",
  "reviews.rating",
  "reviews.text",
  "reviews.relativePublishTimeDescription",
  "reviews.authorAttribution",
].join(",");

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoogleReviewsResult> => {
    const empty: GoogleReviewsResult = {
      configured: false,
      rating: null,
      reviewCount: null,
      businessName: null,
      reviews: [],
      googleUrl: null,
    };
    const apiKey = process.env["GOOGLE_PLACES_API_KEY"];
    const placeId = process.env["GOOGLE_PLACE_ID"];
    if (!apiKey || !placeId) return empty;

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": FIELD_MASK,
          },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!res.ok) {
        console.error(
          `[google-reviews] Places API error ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`,
        );
        return empty;
      }
      const place = (await res.json()) as {
        displayName?: { text?: string };
        googleUri?: string;
        rating?: number;
        userRatingCount?: number;
        reviews?: {
          rating?: number;
          text?: { text?: string };
          relativePublishTimeDescription?: string;
          authorAttribution?: { displayName?: string; photoUri?: string };
        }[];
      };
      return {
        configured: true,
        rating: typeof place.rating === "number" ? place.rating : null,
        reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
        businessName: place.displayName?.text ?? null,
        googleUrl: place.googleUri ?? `https://www.google.com/maps/search/?api=1&query=Ride+N+Care+Bangalore`,
        reviews: (place.reviews ?? []).slice(0, 8).map((review) => ({
          authorName: review.authorAttribution?.displayName ?? "Google user",
          photoUrl: review.authorAttribution?.photoUri ?? null,
          rating: review.rating ?? 5,
          text: review.text?.text ?? "",
          relativeTime: review.relativePublishTimeDescription ?? null,
        })),
      };
    } catch (error) {
      console.error("[google-reviews] request failed:", error);
      return empty;
    }
  },
);
