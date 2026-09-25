-- Simplified booking flow (Sep 2026): customer location and payment are no
-- longer collected. Nothing here touches existing rows — old bookings keep
-- every stored value; only future inserts are relaxed.

-- 1. Address becomes optional (was NOT NULL). The server writes a neutral
--    placeholder for legacy compatibility when customers skip it.
ALTER TABLE public.bookings ALTER COLUMN address DROP NOT NULL;

-- 2. payment_method: allow 'none' alongside the legacy values so a booking can
--    be created without any payment choice. payment_status stays 'pending' for
--    old rows; new rows are written as 'not_required' by the server.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_method_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_method_check
  CHECK (payment_method IN ('pay_now', 'pay_later', 'none'));

-- 3. payment_status: allow 'not_required' so new bookings never show a pending
--    payment that no longer exists in the flow.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded', 'not_required'));
