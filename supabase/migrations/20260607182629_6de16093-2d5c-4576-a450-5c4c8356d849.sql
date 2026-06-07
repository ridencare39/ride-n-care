DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
REVOKE INSERT ON public.newsletter_subscribers FROM anon, authenticated;
REVOKE SELECT ON public.newsletter_subscribers FROM anon;
-- Service role only (used by our server function). RLS remains enabled.
