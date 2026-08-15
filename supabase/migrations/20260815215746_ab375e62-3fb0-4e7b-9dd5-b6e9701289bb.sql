CREATE TABLE public.gsc_daily_snapshots (
  day DATE NOT NULL PRIMARY KEY,
  site_url TEXT NOT NULL,
  submitted_pages INTEGER NOT NULL DEFAULT 0,
  indexed_pages INTEGER NOT NULL DEFAULT 0,
  sitemap_errors INTEGER NOT NULL DEFAULT 0,
  sitemap_warnings INTEGER NOT NULL DEFAULT 0,
  home_verdict TEXT,
  home_coverage_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT ALL ON public.gsc_daily_snapshots TO service_role;
ALTER TABLE public.gsc_daily_snapshots ENABLE ROW LEVEL SECURITY;