const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function headers() {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  const connectionApiKey = process.env["GOOGLE_SEARCH_CONSOLE_API_KEY"];
  if (!lovableApiKey || !connectionApiKey) {
    throw new Error("Search Console is not connected for this project yet.");
  }
  return {
    Authorization: `Bearer ${lovableApiKey}`,
    "X-Connection-Api-Key": connectionApiKey,
  } as Record<string, string>;
}

type SiteEntry = { siteUrl: string; permissionLevel?: string };

function coversTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = target.hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

export type SiteResolution =
  | { status: "selected"; siteUrl: string }
  | { status: "selection_required"; candidates: string[] }
  | { status: "no_property" };

export async function resolveSiteUrl(targetUrl: string, selectedSiteUrl?: string): Promise<SiteResolution> {
  const res = await fetch(`${GATEWAY}/webmasters/v3/sites`, { headers: headers() });
  if (!res.ok) throw new Error(`Could not list Search Console properties [${res.status}]: ${await res.text()}`);
  const { siteEntry = [] } = (await res.json()) as { siteEntry?: SiteEntry[] };
  const target = new URL(targetUrl);
  const matches = siteEntry.filter(
    (e) => e.permissionLevel !== "siteUnverifiedUser" && coversTarget(e.siteUrl, target),
  );
  if (selectedSiteUrl) {
    const found = matches.find((e) => e.siteUrl === selectedSiteUrl);
    if (!found) return matches.length ? { status: "selection_required", candidates: matches.map((m) => m.siteUrl) } : { status: "no_property" };
    return { status: "selected", siteUrl: found.siteUrl };
  }
  if (matches.length === 0) return { status: "no_property" };
  if (matches.length === 1) return { status: "selected", siteUrl: matches[0]!.siteUrl };
  return { status: "selection_required", candidates: matches.map((m) => m.siteUrl) };
}

async function gwJson(path: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.body ? { "Content-Type": "application/json" } : {}) },
  });
  if (res.status === 403) {
    throw new Error("The connected Google account cannot access this Search Console property.");
  }
  if (!res.ok) throw new Error(`Search Console request failed [${res.status}]: ${await res.text()}`);
  return res.json();
}

export async function searchAnalyticsByDate(siteUrl: string, startDate: string, endDate: string) {
  const data = (await gwJson(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions: ["date"], rowLimit: 500 }),
    },
  )) as { rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] };
  return (data.rows ?? []).map((r) => ({
    date: r.keys[0]!,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export async function topRows(siteUrl: string, dimension: "query" | "page", startDate: string, endDate: string) {
  const data = (await gwJson(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions: [dimension], rowLimit: 10 }),
    },
  )) as { rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] };
  return (data.rows ?? []).map((r) => ({
    key: r.keys[0]!,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export async function listSitemaps(siteUrl: string) {
  const data = (await gwJson(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`)) as {
    sitemap?: {
      path: string;
      lastSubmitted?: string;
      lastDownloaded?: string;
      isPending?: boolean;
      warnings?: string;
      errors?: string;
      contents?: { type: string; submitted: string; indexed?: string }[];
    }[];
  };
  return data.sitemap ?? [];
}

export async function inspectUrl(siteUrl: string, inspectionUrl: string) {
  const data = (await gwJson(`/v1/urlInspection/index:inspect`, {
    method: "POST",
    body: JSON.stringify({ siteUrl, inspectionUrl }),
  })) as {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        robotsTxtState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        googleCanonical?: string;
        userCanonical?: string;
        pageFetchState?: string;
      };
      mobileUsabilityResult?: { verdict?: string };
    };
  };
  return data.inspectionResult ?? {};
}
