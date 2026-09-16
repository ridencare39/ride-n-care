ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('awaiting_confirmation', 'confirmed', 'assigned', 'technician_on_the_way', 'service_started', 'service_completed', 'cancelled'));
ALTER TABLE public.booking_status_history DROP CONSTRAINT IF EXISTS booking_status_history_status_check;
ALTER TABLE public.booking_status_history ADD CONSTRAINT booking_status_history_status_check CHECK (status IN ('awaiting_confirmation', 'confirmed', 'assigned', 'technician_on_the_way', 'service_started', 'service_completed', 'cancelled'));
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'awaiting_confirmation';