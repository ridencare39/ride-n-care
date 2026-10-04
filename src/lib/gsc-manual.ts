/**
 * Manually recorded Search Console dashboard observations.
 *
 * These numbers were READ OFF the owner's GSC UI (message of 2026-10-02) and
 * are NOT API data — every row carries source: "manual-observation". They are
 * kept strictly separate from the live API report (source: "gsc-api") so the
 * dashboard never blurs observed facts with measured exports.
 *
 * Why some of these stay manual: the Search Console API does not expose the
 * Coverage report (indexed / not indexed counts) or Enhancement reports
 * (breadcrumbs, CWV) — only the UI does. Clicks ARE available via API and will
 * be superseded by live data once the OAuth connection is completed.
 * Never edit these from memory; only from a fresh owner-provided reading.
 */

export type ManualObservation = {
  label: string;
  value: string;
  note?: string;
  /** "dashboard": available only in the GSC UI · "api-later": API will supersede */
  availableViaApi: "dashboard" | "api-later";
};

export const MANUAL_GSC_OBSERVATIONS = {
  source: "manual-observation" as const,
  enteredAt: "2026-10-02",
  enteredBy: "Owner (Search Console UI reading)",
  rangeNote: "Values are for the date range displayed in the owner's GSC dashboard; the exact range was not specified and is not inferred here.",
  rows: [
    { label: "Total web search clicks", value: "322", note: "Displayed date range (unspecified)", availableViaApi: "api-later" },
    { label: "Indexed pages", value: "131", note: "Coverage report", availableViaApi: "dashboard" },
    { label: "Not indexed pages", value: "90", note: "Coverage report", availableViaApi: "dashboard" },
    { label: "Valid breadcrumbs", value: "17", note: "Enhancements report", availableViaApi: "dashboard" },
    { label: "Core Web Vitals", value: "No data yet", note: "Report shows no data for the property", availableViaApi: "dashboard" },
  ] satisfies ManualObservation[],
};
