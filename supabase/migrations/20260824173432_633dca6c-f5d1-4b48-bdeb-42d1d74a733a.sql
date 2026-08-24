CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Bike Care',
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'Ride N Care Team',
  read_mins integer NOT NULL DEFAULT 5,
  body text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are publicly readable"
ON public.blog_posts FOR SELECT TO anon
USING (published = true);

CREATE POLICY "Authenticated can read published posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (published = true);

CREATE POLICY "Admins can read all posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
ON public.blog_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.blog_posts (slug, title, excerpt, category, tags, author, read_mins, body, published, published_at) VALUES
('bike-service-checklist-bangalore',
 'Bike Service Checklist Every Bangalore Rider Should Follow',
 'From engine oil to brake pads, here''s the complete checklist that keeps your two-wheeler smooth in Bangalore''s stop-and-go traffic.',
 'Bike Care', ARRAY['Bike','Maintenance','Bangalore'], 'Ride N Care Team', 5,
 ARRAY[
  'Bangalore traffic is unforgiving on a motorcycle — frequent stops, hot air, and dusty roads. A regular service routine extends your bike''s life and keeps fuel bills predictable.',
  'Start with engine oil. Most commuter bikes need a change every 2,500–3,500 km, while higher-CC machines stretch to 5,000 km on premium semi-synthetic oils.',
  'Next, inspect the air filter. A clogged filter eats mileage fast. Tap it clean every service and replace it every 8,000–10,000 km.',
  'Brake pads, chain slack and tyre pressure are silent killers of safety. Our doorstep mechanics check all three on every visit — no extra charge.',
  'Book a Ride N Care service and we''ll come home with a printed checklist, genuine parts, and a 7-day workmanship guarantee.'
 ], true, '2026-05-22T09:00:00Z'),
('car-ac-not-cooling-bangalore',
 'Why Your Car AC Stops Cooling in Bangalore (and How to Fix It)',
 'Weak airflow, warm air, foul smell — three classic AC complaints, and the doorstep diagnostics that solve them in under an hour.',
 'Car Care', ARRAY['Car','AC','Diagnostics'], 'Ride N Care Team', 6,
 ARRAY[
  'Bangalore''s mild climate hides a brutal truth: most car ACs are under-serviced because we ''don''''t really need them''. Then summer hits and the compressor gives up.',
  'Symptom 1 — warm air. Usually low refrigerant. A 30-minute gas top-up restores cooling, but if the gas is leaking we''ll find the source before refilling.',
  'Symptom 2 — weak airflow. Almost always a clogged cabin filter. Replacing it costs little but improves cooling and your lungs.',
  'Symptom 3 — foul smell. Bacterial buildup in the evaporator. A professional anti-bacterial flush eliminates it.',
  'Our mobile workshop carries the gauge set, refrigerant, filters, and cleaning chemicals — diagnostics happen at your doorstep.'
 ], true, '2026-05-10T09:00:00Z'),
('doorstep-vs-garage-service',
 'Doorstep Service vs Traditional Garage: Which Is Better in 2026?',
 'We break down the cost, time and quality trade-offs between visiting a garage and having a mechanic show up at your gate.',
 'Doorstep Tips', ARRAY['Guide','Doorstep'], 'Ride N Care Team', 4,
 ARRAY[
  'Traditional garages are reliable but eat half your weekend. Doorstep services trade a small premium for convenience — but only if quality matches.',
  'Our mechanics arrive with diagnostic tools, OEM parts, and a printed price list. You watch the work, sign off, and pay digitally.',
  'For complex jobs (engine rebuilds, gearbox overhauls) a garage still wins. For 90% of routine service — periodic, AC, brakes, battery — doorstep is faster and cheaper end-to-end.',
  'Try us once. If it''s not better, the service is on us.'
 ], true, '2026-04-28T09:00:00Z'),
('monsoon-bike-care-bangalore',
 'Monsoon Bike Care: 9 Things Every Bangalore Rider Must Do',
 'Bangalore monsoons are brutal on chains, brakes and electricals. Here''s how to monsoon-proof your bike in one weekend.',
 'Bike Care', ARRAY['Bike','Monsoon','Maintenance'], 'Ride N Care Team', 6,
 ARRAY[
  'Bangalore receives 900+ mm of rain between June and September. For a daily commuter that means a chain that rusts overnight, brake pads that squeal, and a battery terminal corroded within a month.',
  'Tip 1 — Lubricate the chain every 200 km in the monsoon, not 500. Use a wet-lube, not dry.',
  'Tip 2 — Switch to ceramic or sintered brake pads. Organic pads turn to slush after a heavy ride from Whitefield to MG Road.',
  'Tip 3 — Apply dielectric grease to battery terminals and fuse box. Corrosion is the #1 cause of monsoon breakdowns we attend in Indiranagar.',
  'Tip 4 — Inspect tyre tread depth. Below 2 mm, replace. Bangalore''s flyovers turn into ice rinks during a Whitefield downpour.',
  'Tip 5 — Cover the air-filter intake during deep puddles; hydro-lock is real for low-set scooters.',
  'Tip 6 — Polish and wax the tank and panels. Bangalore rain is acidic and pits paint within weeks.',
  'Tip 7 — Replace worn seals on the engine and fork. Water ingress destroys gearbox oil quickly.',
  'Tip 8 — Always carry a basic rain cover and an LED tail strip. Visibility saves lives more than horsepower.',
  'Tip 9 — Book a 30-minute monsoon-readiness check with Ride N Care. We come to you, water-test everything and leave a printed report.'
 ], true, '2026-06-02T09:00:00Z'),
('car-battery-life-bangalore',
 'How Long Should a Car Battery Last in Bangalore?',
 'Heat, short trips and idle months kill car batteries faster than you''d think. Here''s how to add 18 months to its life.',
 'Car Care', ARRAY['Car','Battery','Tips'], 'Ride N Care Team', 5,
 ARRAY[
  'A typical car battery in Bangalore lasts 3–4 years. WFH-era cars often die at 18 months because short trips never let the alternator fully recharge them.',
  'Sign 1 — Engine cranks slower than usual on a cold morning in Hebbal. Voltage is dropping.',
  'Sign 2 — Dashboard dims when you start. Internal cells are failing.',
  'Sign 3 — You can hear a clicking sound but the engine doesn''t turn over. Almost always a dead battery, not the starter.',
  'Fix: drive the car for at least 30 minutes weekly, keep terminals greased, and get a free voltage test at every service.',
  'If you need a jump-start anywhere in Bangalore, our breakdown team reaches you within 45 minutes with a fresh battery, tools, and a buy-back on your old one.'
 ], true, '2026-05-30T09:00:00Z'),
('top-bangalore-areas-doorstep-service',
 'Top 10 Bangalore Areas Where Doorstep Service Saves You the Most Time',
 'Traffic-heavy localities where skipping the garage run gives back 3+ hours of your weekend.',
 'Bangalore Guides', ARRAY['Bangalore','Doorstep','Guide'], 'Ride N Care Team', 4,
 ARRAY[
  'Bangalore traffic is no joke — a 5 km garage run can take 90 minutes round-trip. Here are 10 areas where Ride N Care saves the most weekend hours.',
  '1. Whitefield — ITPL traffic is a graveyard for weekend plans.',
  '2. Koramangala — Sarjapur Road jams kill any quick errand.',
  '3. HSR Layout — Outer Ring Road bottlenecks daily.',
  '4. Indiranagar — 100 Ft Road is one-way chaos.',
  '5. Marathahalli — bridge bottleneck even on Sundays.',
  '6. Electronic City — 30 minutes just to exit the elevated.',
  '7. Hebbal — flyover traffic merging from BIAL and ORR.',
  '8. Jayanagar — narrow inner roads add 20 minutes either way.',
  '9. Sarjapur — fewer trusted garages, longer drives.',
  '10. Bellandur — perennial gridlock from tech parks.',
  'We come to you in any of these areas within 60 minutes — book on WhatsApp at +91 82969 50339.'
 ], true, '2026-05-25T09:00:00Z'),
('engine-oil-guide-bangalore',
 'Mineral vs Semi-Synthetic vs Fully Synthetic: Picking the Right Engine Oil',
 'The oil you pour into your bike or car decides 60% of its long-term health. Here''s the simple buying guide.',
 'Bike Care', ARRAY['Engine Oil','Maintenance','Guide'], 'Ride N Care Team', 7,
 ARRAY[
  'Walk into any spare parts shop in Bangalore and you''ll see 30+ engine oil brands. Most riders pick whatever the shopkeeper recommends. That''s a costly mistake.',
  'Mineral oil — cheapest, derived directly from crude. Good for older 100–125cc commuters with carburettors. Change every 2,500 km.',
  'Semi-synthetic — blended for better heat resistance and longer life. Ideal for 125–200cc bikes and entry-level cars. Change every 4,000–5,000 km.',
  'Fully synthetic — engineered molecules, the best protection. Required for high-CC bikes (KTM, Royal Enfield Himalayan, sport tourers) and most modern cars. Change every 7,500–10,000 km.',
  'Match the viscosity grade printed in your owner''s manual (10W-30, 5W-40, etc.). Wrong grade = poor cold starts in Hebbal winters or oil thinning during Whitefield summers.',
  'Our doorstep service stocks Motul, Shell, Castrol and Liqui Moly in all popular grades — we''ll match your manual exactly.'
 ], true, '2026-05-18T09:00:00Z'),
('car-service-cost-bangalore-2026',
 'Car Service Cost in Bangalore (2026): Real Numbers, No Hidden Fees',
 'Hatchback, sedan, SUV — here''s what a periodic service really costs in Bangalore in 2026, and where garages quietly upsell.',
 'Bangalore Guides', ARRAY['Car','Pricing','Bangalore'], 'Ride N Care Team', 6,
 ARRAY[
  'We get asked one question more than any other: ''How much should a car service really cost?'' Here''s the honest 2026 Bangalore answer.',
  'Hatchback (Swift, i20, Baleno) periodic: ₹2,800 – ₹3,800 including oil, filter, labour and basic inspection.',
  'Sedan (City, Verna, Slavia) periodic: ₹3,800 – ₹5,200 with synthetic oil and full multi-point check.',
  'SUV (Creta, Seltos, XUV700) periodic: ₹4,800 – ₹7,500 depending on engine and oil grade.',
  'Luxury (BMW, Audi, Mercedes) major: ₹14,000 – ₹28,000 with OEM-equivalent parts; authorised service centres charge 1.6–2× this.',
  'Common upsells to refuse unless needed: ''engine flush'' on cars under 50,000 km, ''fuel injector cleaning'' every service, and ''underbody coating'' more than once a year.',
  'Ride N Care quotes you a fixed price before any spanner touches the car. If we don''t replace a part, we don''t bill it.'
 ], true, '2026-05-08T09:00:00Z');
