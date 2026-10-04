/**
 * VideoBackdrop — cinematic <video> background layer (owner request
 * 2026-10-04: replace the homepage's animated vehicle/mechanic visuals with
 * the owner's uploaded 10-second Ride N Care video).
 *
 * Fast-start design (owner request 2026-10-04 — measured bottleneck was
 * React hydration at 5–12 s in dev, after which the old code attached the
 * source):
 *  - the primary layer SSRs the <video> WITH src/autoplay/muted/loop, so the
 *    browser starts downloading during HTML parse and can begin muted
 *    playback before hydration even finishes
 *  - `poster` paints on the layer itself (present in the SSR HTML) and on
 *    the element, so a polished still shows instantly while the MP4 buffers
 *  - prefers-reduced-motion: a CSS rule (.rnc-video-layer) hides the layer
 *    from first paint — no motion ever — and an effect unmounts the source
 *    shortly after hydration (bounded prefetch waste is the trade-off)
 *  - lazy=true (secondary sections): no src until the layer nears the
 *    viewport; the browser reuses the hero's cached download
 *  - pauses off-screen, resumes on-screen (decode/battery friendly)
 *  - error → the layer unmounts the element and the poster/gradient remains
 *  - ALWAYS muted — no unmute path; the original AAC track stays untouched
 *  - pointer-events: none — never intercepts clicks/touches
 */
import { useEffect, useRef, useState } from "react";

type VideoBackdropProps = {
  /** Public URL of the source video (verbatim — never renamed/re-encoded). */
  src: string;
  /** Poster frame URL (same footage) — instant polished visual while buffering. */
  poster?: string;
  /** Extra classes for the video layer (it is already absolute inset-0 + pointer-events-none). */
  className?: string;
  /** Defer the source until the layer approaches the viewport (secondary sections). */
  lazy?: boolean;
  /** object-position focal point for the cover crop (keep subject visible). */
  objectPosition?: string;
};

export function VideoBackdrop({
  src,
  poster,
  className = "",
  lazy = false,
  objectPosition = "50% 50%",
}: VideoBackdropProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Primary layer: source attached from the very first render (SSR included).
  // Lazy layers attach when the IntersectionObserver fires.
  const [attached, setAttached] = useState(!lazy);
  const [failed, setFailed] = useState(false); // error → show poster/gradient fallback

  /* Reduced motion: the CSS guard already hides the layer from first paint;
     here we detach the source so the prefetch stops. Lazy layers keep using
     the observer below. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Commit marker for the home-route boundary: its chunk can hydrate many
    // seconds after the root layout on a cold dev server, and navigating
    // before this layer commits races TanStack Router (matchId invariant).
    // Tests wait on [data-video-ready] as the "home tree committed" signal.
    wrapRef.current?.setAttribute("data-video-ready", "");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAttached(false);
      return;
    }
    if (!lazy) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setAttached(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAttached(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  /* Playback: enforce muted autoplay when the source is attached; pause when
     off-screen and resume when back in view. */
  useEffect(() => {
    const v = videoRef.current;
    if (!attached || !v || failed) return;
    // The src can fail BEFORE hydration (its React onError then never fires);
    // re-check here so a broken source still unmounts to the poster fallback.
    if (v.error) {
      setFailed(true);
      return;
    }
    v.muted = true; // hard guarantee: silent playback
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay blocked (e.g. data saver): retry silently on visibility
        // ticks; the poster remains the visible fallback meanwhile.
        v.play().catch(() => {});
      });
    };
    tryPlay();

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) tryPlay();
            else v.pause();
          }
        },
        { threshold: 0 },
      );
      io.observe(v);
    }
    return () => {
      io?.disconnect();
      v.pause();
    };
  }, [attached, failed]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`rnc-video-layer pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={
        poster
          ? {
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: objectPosition,
            }
          : undefined
      }
    >
      {attached && !failed && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          autoPlay
          loop
          playsInline
          muted
          preload="auto"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
