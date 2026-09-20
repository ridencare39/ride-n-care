/** Lightweight GA4 conversion tracking. Events fire on [data-ctc] clicks via
 * the delegated listener in __root.tsx; anything programmatic uses trackCtc(). */

type CtcParams = {
  service?: string;
  area?: string;
  vehicle_type?: string;
  [key: string]: string | undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire a GA4 event if gtag is loaded; no-op (with a console note) otherwise. */
export function trackCtc(event: string, params: CtcParams = {}) {
  if (typeof window === "undefined") return;
  if (!window.gtag) {
    console.debug(`[analytics] ${event} (gtag not loaded — set VITE_GA_MEASUREMENT_ID)`);
    return;
  }
  window.gtag("event", event, {
    page_path: window.location.pathname,
    ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)),
  });
}

/** Shared data-attribute props so anchors stay real <a href> links (crawlable). */
export function ctcProps(event: string, params: CtcParams = {}) {
  return {
    "data-ctc": event,
    ...(Object.keys(params).length > 0
      ? { "data-ctc-params": JSON.stringify(params) }
      : {}),
  } as const;
}
