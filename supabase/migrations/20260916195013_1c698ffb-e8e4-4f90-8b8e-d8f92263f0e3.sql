CREATE POLICY "Booking counters are server only"
ON public.booking_counters
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Bookings are server only"
ON public.bookings
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Booking history is server only"
ON public.booking_status_history
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);