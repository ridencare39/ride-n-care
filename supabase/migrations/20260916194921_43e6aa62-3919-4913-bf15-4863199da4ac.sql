CREATE TABLE public.booking_counters (
  booking_date date PRIMARY KEY,
  last_number integer NOT NULL DEFAULT 0 CHECK (last_number >= 0)
);
GRANT ALL ON public.booking_counters TO service_role;
ALTER TABLE public.booking_counters ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text NOT NULL UNIQUE,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('bike', 'car')),
  power_type text CHECK (power_type IN ('electric', 'non-electric')),
  brand text NOT NULL,
  model text NOT NULL,
  engine_cc integer CHECK (engine_cc IS NULL OR engine_cc > 0),
  variant text,
  package_id text NOT NULL,
  package_name text NOT NULL,
  includes text[] NOT NULL DEFAULT '{}',
  mrp integer CHECK (mrp IS NULL OR mrp >= 0),
  price integer CHECK (price IS NULL OR price >= 0),
  customer_name text NOT NULL,
  customer_mobile text NOT NULL CHECK (customer_mobile ~ '^[6-9][0-9]{9}$'),
  whatsapp_mobile text NOT NULL CHECK (whatsapp_mobile ~ '^[6-9][0-9]{9}$'),
  email text,
  registration text,
  address text NOT NULL,
  latitude double precision,
  longitude double precision,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  issue text,
  source text NOT NULL DEFAULT 'normal' CHECK (source IN ('normal', 'ai')),
  payment_method text NOT NULL CHECK (payment_method IN ('pay_now', 'pay_later')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_reference text,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'assigned', 'technician_on_the_way', 'service_started', 'service_completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX bookings_customer_mobile_idx ON public.bookings (customer_mobile);
CREATE INDEX bookings_status_created_idx ON public.bookings (status, created_at DESC);

CREATE TABLE public.booking_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('confirmed', 'assigned', 'technician_on_the_way', 'service_started', 'service_completed', 'cancelled')),
  note text,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.booking_status_history TO service_role;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

CREATE INDEX booking_status_history_booking_idx ON public.booking_status_history (booking_id, created_at ASC);

CREATE OR REPLACE FUNCTION public.next_ride_n_care_booking_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_date_ist date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  next_number integer;
BEGIN
  INSERT INTO public.booking_counters (booking_date, last_number)
  VALUES (current_date_ist, 1)
  ON CONFLICT (booking_date)
  DO UPDATE SET last_number = public.booking_counters.last_number + 1
  RETURNING last_number INTO next_number;

  RETURN 'RNC-' || to_char(current_date_ist, 'YYYYMMDD') || '-' || lpad(next_number::text, 4, '0');
END;
$$;
REVOKE ALL ON FUNCTION public.next_ride_n_care_booking_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_ride_n_care_booking_id() TO service_role;

CREATE OR REPLACE FUNCTION public.set_ride_n_care_booking_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.booking_id IS NULL OR btrim(NEW.booking_id) = '' THEN
    NEW.booking_id := public.next_ride_n_care_booking_id();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.set_ride_n_care_booking_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_ride_n_care_booking_id() TO service_role;

CREATE TRIGGER set_booking_id_before_insert
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_ride_n_care_booking_id();

CREATE OR REPLACE FUNCTION public.record_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.booking_status_history (booking_id, status, note)
    VALUES (NEW.id, NEW.status, 'Booking created');
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.updated_at := now();
    INSERT INTO public.booking_status_history (booking_id, status, note)
    VALUES (NEW.id, NEW.status, 'Status updated');
  ELSE
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.record_booking_status_change() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_booking_status_change() TO service_role;

CREATE TRIGGER record_booking_status_after_insert
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.record_booking_status_change();

CREATE TRIGGER record_booking_status_before_update
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.record_booking_status_change();