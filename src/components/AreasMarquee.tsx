const AREAS = [
  "Indiranagar","Koramangala","HSR Layout","Whitefield","Marathahalli","BTM Layout",
  "Jayanagar","JP Nagar","Bellandur","Sarjapur Road","Electronic City","Bommanahalli",
  "Banashankari","Basavanagudi","Rajajinagar","Malleshwaram","Yelahanka","Hebbal",
  "RT Nagar","Vijayanagar","Kengeri","Hennur","Banaswadi","Kalyan Nagar",
  "CV Raman Nagar","Domlur","MG Road","Brigade Road","Ulsoor","Frazer Town",
  "Cox Town","Richmond Town","Shivaji Nagar","Mahadevapura","KR Puram","ITPL",
  "Kadugodi","Varthur","Hoskote","Bannerghatta Road","Kanakapura Road","Mysore Road",
  "Tumkur Road","Old Airport Road","Outer Ring Road","Nagarbhavi","Kumaraswamy Layout",
  "Padmanabhanagar","Wilson Garden","Sadashivanagar","Yeshwanthpur","Peenya",
];

export function AreasMarquee() {
  // Duplicate the list so the loop is seamless.
  const loop = [...AREAS, ...AREAS];
  return (
    <section className="border-y border-border bg-card py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Service Coverage</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">Areas We Serve in Bangalore</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Doorstep bike & car service across 50+ neighbourhoods — from Whitefield to Kengeri, Hebbal to Electronic City.
        </p>
      </div>
      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card to-transparent z-10" />
        <div className="marquee-track flex gap-3 w-max">
          {loop.map((a, i) => (
            <span
              key={`${a}-${i}`}
              className="shrink-0 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              📍 {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}