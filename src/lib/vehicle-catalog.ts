import type { PowerType } from "@/lib/booking";

export interface BikeModel { name: string; cc: number | null }
export interface BikeBrandCatalog { name: string; mark: string; power: PowerType; models: BikeModel[] }

/**
 * Ride N Care two-wheeler catalog — Indian market.
 *
 * Conventions:
 * - `cc` stores the engine displacement rounded to the nearest common Indian
 *   cc class value (97, 110, 125, 150, 160, 199, 220, 350 ...). These are
 *   verified against BikeDekho / BikeWale listings and manufacturer pages
 *   (Hero MotoCorp, HMSI, TVS, Bajaj, RE, Suzuki, Yamaha, KTM, Triumph etc.).
 * - `cc: null` = EV model or genuinely unverified displacement. The booking
 *   flow NEVER guesses: for petrol models with null cc the customer is asked
 *   to enter the exact CC or pick a range before a price is applied.
 * - Discontinued but commonly serviced models are included (Hero Honda-era
 *   bikes, older Pulsars, CBZ, Karizma, Scooty Pep, etc.).
 * - Keep this file the single source of truth; UI reads it via the helpers
 *   below. To add a model, append to the brand's `models` array.
 */
export const BIKE_CATALOG: BikeBrandCatalog[] = [
  // ---------- PETROL ----------
  {
    name: "Hero", mark: "H", power: "non-electric",
    models: [
      // commuters
      { name: "Splendor Plus", cc: 97 }, { name: "Splendor Plus XTEC", cc: 97 }, { name: "Splendor iSmart 110", cc: 110 },
      { name: "HF Deluxe", cc: 97 }, { name: "HF 100", cc: 97 }, { name: "Passion Plus", cc: 97 }, { name: "Passion Xtec", cc: 110 },
      { name: "Super Splendor XTEC", cc: 125 }, { name: "Glamour", cc: 125 }, { name: "Glamour X 125", cc: 125 }, { name: "Glamour FI 125", cc: 125 },
      { name: "XTech 125R", cc: 125 },
      // sporty
      { name: "Xtreme 125R", cc: 125 }, { name: "Xtreme 160R", cc: 160 }, { name: "Xtreme 160R 4V", cc: 163 }, { name: "Xtreme 200S", cc: 200 },
      { name: "Karizma XMR 210", cc: 210 },
      // retro / premium
      { name: "Mavrick 440", cc: 440 },
      // off-road
      { name: "Xpulse 200", cc: 199 }, { name: "Xpulse 200 4V", cc: 199 }, { name: "Xpulse 210", cc: 210 },
      // discontinued Hero Honda / Hero classics still serviced
      { name: "Hero Honda CD 100", cc: 97 }, { name: "Hero Honda CD Dawn", cc: 110 }, { name: "Hero Honda Splendor", cc: 97 },
      { name: "Hero Honda CBZ", cc: 156 }, { name: "Hero Honda CBZ Xtreme", cc: 149 }, { name: "Hero Honda Karizma", cc: 223 },
      { name: "Hero Honda Karizma ZMR", cc: 223 }, { name: "Hero Honda Hunk", cc: 149 }, { name: "Hero Honda CBZ Extreme 150", cc: 149 },
      { name: "Achiever 150", cc: 149 }, { name: "Ignitor 125", cc: 124 }, { name: "Maestro Edge 110", cc: 110 }, { name: "Maestro Edge 125", cc: 125 },
      { name: "Destini 125", cc: 125 }, { name: "Pleasure Plus 110", cc: 110 }, { name: "Duet 110", cc: 110 },
      // unknown cc — customer will be asked
      { name: "Other Hero model", cc: null },
    ],
  },
  {
    name: "Honda", mark: "H", power: "non-electric",
    models: [
      // scooters
      { name: "Activa 6G", cc: 110 }, { name: "Activa 125", cc: 124 }, { name: "Activa 5G", cc: 110 }, { name: "Activa 4G", cc: 110 },
      { name: "Activa 3G", cc: 109 }, { name: "Activa i", cc: 109 }, { name: "Activa 110 H-Smart", cc: 110 },
      { name: "Dio", cc: 110 }, { name: "Dio 125", cc: 124 }, { name: "Aviator", cc: 109 }, { name: "NAV-i 125", cc: 124 },
      // commuters
      { name: "Shine", cc: 124 }, { name: "Shine 100", cc: 102 }, { name: "SP 125", cc: 124 }, { name: "CB125 Hornet", cc: 123 },
      { name: "Livo 110", cc: 109 }, { name: "CD 110 Deluxe", cc: 109 }, { name: "Unicorn", cc: 162 }, { name: "SP 160", cc: 162 },
      { name: "Hornet 2.0", cc: 184 }, { name: "NX200", cc: 184 },
      // sport / premium
      { name: "CB300F", cc: 293 }, { name: "CB300R", cc: 286 }, { name: "CB350", cc: 348 }, { name: "CB350 H'ness", cc: 348 },
      { name: "CB350RS", cc: 348 }, { name: "CB350 Cruiser", cc: 348 },
      // discontinued Honda (incl. Hero Honda era)
      { name: "CB Unicorn 150", cc: 149 }, { name: "CB Unicorn 160", cc: 162 }, { name: "CB Shine SP", cc: 124 },
      { name: "Stunner CBF 125", cc: 124 }, { name: "CBR 150R", cc: 149 }, { name: "CBR 250R", cc: 249 }, { name: "CB Trigger 150", cc: 149 },
      { name: "Twister 110", cc: 109 }, { name: "Aviator 110", cc: 109 }, { name: "Eterno 150", cc: 149 },
      // Hero Honda JV era (sold as Hero Honda)
      { name: "Hero Honda Passion", cc: 97 }, { name: "Hero Honda Super Splendor", cc: 125 },
      { name: "Other Honda model", cc: null },
    ],
  },
  {
    name: "TVS", mark: "TVS", power: "non-electric",
    models: [
      // scooters
      { name: "Jupiter 110", cc: 110 }, { name: "Jupiter 125", cc: 124 }, { name: "Jupiter SmartXonnect 125", cc: 124 },
      { name: "Scooty Pep+", cc: 87 }, { name: "Scooty Zest 110", cc: 110 }, { name: "iQube Electric", cc: null },
      { name: "Ntorq 125", cc: 124 }, { name: "NTorq 125 Race XP", cc: 124 },
      // motorcycles
      { name: "Sport 110", cc: 109 }, { name: "Victor 110", cc: 109 }, { name: "Star City Plus 110", cc: 109 },
      { name: "Raider 125", cc: 124 }, { name: "Phoenix 125", cc: 124 },
      { name: "Apache RTR 160", cc: 160 }, { name: "Apache RTR 160 4V", cc: 159 }, { name: "Apache RTR 180", cc: 177 },
      { name: "Apache RTR 200 4V", cc: 198 }, { name: "Apache RR 310", cc: 312 }, { name: "Ronin 225", cc: 225 },
      { name: "Cruze 220", cc: 220 },
      // discontinued
      { name: "Victor GLX 125", cc: 124 }, { name: "Flame 125", cc: 124 }, { name: "Jive 110", cc: 110 },
      { name: "Wego 110", cc: 110 }, { name: "Other TVS model", cc: null },
    ],
  },
  {
    name: "Bajaj", mark: "B", power: "non-electric",
    models: [
      // commuters
      { name: "Platina 100", cc: 102 }, { name: "Platina 110", cc: 115 }, { name: "Platina 110 H-Gear", cc: 115 },
      { name: "Discover 100", cc: 102 }, { name: "Discover 125", cc: 124 }, { name: "Discover 150", cc: 144 },
      { name: "CT 100", cc: 102 }, { name: "CT 125", cc: 124 },
      // Pulsar family
      { name: "Pulsar 125", cc: 125 }, { name: "Pulsar 150", cc: 149 }, { name: "Pulsar N160", cc: 164 }, { name: "Pulsar N250", cc: 249 },
      { name: "Pulsar NS125", cc: 125 }, { name: "Pulsar NS160", cc: 160 }, { name: "Pulsar NS200", cc: 199 }, { name: "Pulsar RS200", cc: 199 },
      { name: "Pulsar 180", cc: 178 }, { name: "Pulsar 220F", cc: 220 },
      // cruisers
      { name: "Avenger Street 160", cc: 160 }, { name: "Avenger Cruise 220", cc: 220 }, { name: "Avenger 150", cc: 149 },
      { name: "Avenger Street 220", cc: 220 },
      // sport-touring
      { name: "Dominar 250", cc: 249 }, { name: "Dominar 400", cc: 373 },
      // discontinued
      { name: "Boxer 150", cc: 149 }, { name: "Boxer BM 100", cc: 99 }, { name: "Pulsar 135LS", cc: 134 },
      { name: "Pulsar AS 150", cc: 149 }, { name: "Pulsar AS 200", cc: 199 }, { name: "Sonic 200", cc: 199 },
      { name: "Other Bajaj model", cc: null },
    ],
  },
  {
    name: "Yamaha", mark: "Y", power: "non-electric",
    models: [
      // scooters
      { name: "Fascino 125", cc: 125 }, { name: "Fascino 125 Hybrid", cc: 125 }, { name: "RayZR 125", cc: 125 },
      { name: "RayZR 125 Hybrid", cc: 125 }, { name: "Ray Z 115", cc: 113 }, { name: "Alpha 125", cc: 125 }, { name: "Cygnus Ray ZR", cc: 113 },
      // motorcycles
      { name: "FZ-S FI V3", cc: 149 }, { name: "FZ-S FI V4", cc: 149 }, { name: "FZ 25", cc: 249 }, { name: "FZ-X 150", cc: 149 },
      { name: "MT-15 V2", cc: 155 }, { name: "MT 03", cc: 321 }, { name: "R15 V4", cc: 155 }, { name: "R15S", cc: 155 },
      { name: "R3", cc: 321 }, { name: "MT-09", cc: 890 },
      // discontinued
      { name: "Saluto 125", cc: 125 }, { name: "SZ-RR 150", cc: 149 }, { name: "Fazer 150", cc: 149 }, { name: "Fazer 25", cc: 249 },
      { name: "Gladiator 125", cc: 125 }, { name: "SS 125", cc: 123 }, { name: "Crux 110", cc: 106 }, { name: "YZF R1", cc: 998 },
      { name: "Other Yamaha model", cc: null },
    ],
  },
  {
    name: "Suzuki", mark: "S", power: "non-electric",
    models: [
      // scooters
      { name: "Access 125", cc: 124 }, { name: "Access 125 Special Edition", cc: 124 }, { name: "Burgman Street 125", cc: 124 },
      { name: "Burgman Street 125 EX", cc: 124 }, { name: "Avenis 125", cc: 124 }, { name: "Swish 125", cc: 124 }, { name: "Let's 110", cc: 112 },
      // motorcycles
      { name: "Gixxer 155", cc: 155 }, { name: "Gixxer SF 155", cc: 155 }, { name: "Gixxer SF 250", cc: 249 }, { name: "Gixxer 250", cc: 249 },
      { name: "V-Strom SX 250", cc: 249 }, { name: "V-Strom 800DE", cc: 776 }, { name: "Hayabusa", cc: 1340 },
      // discontinued
      { name: "Slingshot Plus 125", cc: 124 }, { name: "Hayate EP 110", cc: 112 }, { name: "Intruder 150", cc: 154 },
      { name: "Intruder 180", cc: 178 }, { name: "GS150R", cc: 149 }, { name: "Other Suzuki model", cc: null },
    ],
  },
  {
    name: "Royal Enfield", mark: "RE", power: "non-electric",
    models: [
      { name: "Hunter 350", cc: 349 }, { name: "Classic 350", cc: 349 }, { name: "Classic 650", cc: 648 },
      { name: "Bullet 350", cc: 349 }, { name: "Bullet 500", cc: 499 }, { name: "Meteor 350", cc: 349 },
      { name: "Himalayan 411", cc: 411 }, { name: "Himalayan 450", cc: 452 }, { name: "Guerrilla 450", cc: 452 },
      { name: "Interceptor 650", cc: 648 }, { name: "Continental GT 650", cc: 648 }, { name: "Continental GT 535", cc: 535 },
      { name: "Super Meteor 650", cc: 648 }, { name: "Shotgun 650", cc: 648 },
      // UCE / AVL-era classics still serviced
      { name: "Classic 500", cc: 499 }, { name: "Thunderbird 350", cc: 346 }, { name: "Thunderbird 500", cc: 499 },
      { name: "Himalayan BS3/BS4", cc: 411 }, { name: "Electra 350", cc: 346 }, { name: "Standard 350", cc: 346 },
      { name: "Other Royal Enfield model", cc: null },
    ],
  },
  {
    name: "KTM", mark: "KTM", power: "non-electric",
    models: [
      { name: "Duke 125", cc: 125 }, { name: "Duke 200", cc: 199 }, { name: "Duke 250", cc: 249 }, { name: "Duke 390", cc: 399 },
      { name: "Duke 390 Gen3", cc: 399 }, { name: "RC 125", cc: 125 }, { name: "RC 200", cc: 199 }, { name: "RC 390", cc: 373 },
      { name: "Adventure 250", cc: 249 }, { name: "Adventure 390", cc: 399 }, { name: "Other KTM model", cc: null },
    ],
  },
  {
    name: "Kawasaki", mark: "K", power: "non-electric",
    models: [
      { name: "W175", cc: 177 }, { name: "Ninja 300", cc: 296 }, { name: "Ninja 400", cc: 399 }, { name: "Ninja 500", cc: 451 },
      { name: "Ninja 650", cc: 649 }, { name: "Z650", cc: 649 }, { name: "Z900", cc: 948 }, { name: "Vulcan S 650", cc: 649 },
      { name: "Ninja ZX-10R", cc: 998 }, { name: "Other Kawasaki model", cc: null },
    ],
  },
  {
    name: "Triumph", mark: "T", power: "non-electric",
    models: [
      { name: "Speed 400", cc: 398 }, { name: "Scrambler 400 X", cc: 398 }, { name: "Speed T4", cc: 398 },
      { name: "Trident 660", cc: 660 }, { name: "Street Triple 765", cc: 765 }, { name: "Tiger Sport 660", cc: 660 },
      { name: "Tiger 900", cc: 888 }, { name: "Other Triumph model", cc: null },
    ],
  },
  {
    name: "BMW Motorrad", mark: "BMW", power: "non-electric",
    models: [
      { name: "G 310 R", cc: 313 }, { name: "G 310 GS", cc: 313 }, { name: "F 900 R", cc: 895 }, { name: "F 900 XR", cc: 895 },
      { name: "S 1000 RR", cc: 999 }, { name: "S 1000 XR", cc: 999 }, { name: "M 1000 RR", cc: 999 },
      { name: "Other BMW model", cc: null },
    ],
  },
  {
    name: "Harley-Davidson", mark: "HD", power: "non-electric",
    models: [
      { name: "X440", cc: 440 }, { name: "Nightster", cc: 975 }, { name: "Sportster S", cc: 1252 },
      { name: "Pan America 1250", cc: 1252 }, { name: "Fat Bob 114", cc: 1868 }, { name: "Other Harley-Davidson model", cc: null },
    ],
  },
  {
    name: "Aprilia", mark: "A", power: "non-electric",
    models: [
      { name: "SR 125", cc: 125 }, { name: "SR 160", cc: 160 }, { name: "SR 160 GT", cc: 160 }, { name: "SXR 160", cc: 160 },
      { name: "Storm 125", cc: 125 }, { name: "RS 457", cc: 457 }, { name: "RS 660", cc: 659 }, { name: "Tuono 660", cc: 659 },
      { name: "Other Aprilia model", cc: null },
    ],
  },
  {
    name: "Vespa", mark: "V", power: "non-electric",
    models: [
      { name: "Vespa ZX 125", cc: 125 }, { name: "Vespa SXL 125", cc: 125 }, { name: "Vespa SXL 150", cc: 155 },
      { name: "Vespa VXL 125", cc: 125 }, { name: "Vespa VXL 150", cc: 155 }, { name: "Vespa GTS 300", cc: 278 },
      { name: "Other Vespa model", cc: null },
    ],
  },
  {
    name: "Jawa / Yezdi", mark: "JY", power: "non-electric",
    models: [
      { name: "Jawa 42", cc: 293 }, { name: "Jawa 42 FJ 350", cc: 334 }, { name: "Jawa Perak", cc: 334 },
      { name: "Jawa Standard 300", cc: 293 }, { name: "Yezdi Roadster 334", cc: 334 }, { name: "Yezdi Adventure 334", cc: 334 },
      { name: "Yezdi Scrambler 334", cc: 334 }, { name: "Yezdi Road King 250", cc: 250 },
      // ideal jawa classics
      { name: "Jawa Classic 250 (JAWA 250)", cc: 250 }, { name: "Yezdi CL II 250", cc: 250 }, { name: "Other Jawa / Yezdi model", cc: null },
    ],
  },
  {
    name: "Mahindra / Peugeot", mark: "M", power: "non-electric",
    models: [
      { name: "Peugeot Metropolis 400", cc: 400 }, { name: "Centuro 110", cc: 106 }, { name: "Pantero 110", cc: 106 },
      { name: "Gusto 110", cc: 109 }, { name: "Other Mahindra model", cc: null },
    ],
  },
  {
    name: "Benelli", mark: "BN", power: "non-electric",
    models: [
      { name: "TNT 300", cc: 300 }, { name: "TNT 600 i", cc: 600 }, { name: "Imperiale 400", cc: 374 },
      { name: "Leoncino 500", cc: 500 }, { name: "TRK 502", cc: 500 }, { name: "Other Benelli model", cc: null },
    ],
  },
  {
    name: "Hero Electric", mark: "HE", power: "electric",
    models: [
      { name: "Optima CX", cc: null }, { name: "Optima CX 2.0", cc: null }, { name: "Optima CX 5.0", cc: null },
      { name: "NYX", cc: null }, { name: "Photon", cc: null }, { name: "Ae-8 E", cc: null }, { name: "Other Hero Electric model", cc: null },
    ],
  },
  {
    name: "Ampere", mark: "AM", power: "electric",
    models: [
      { name: "Ampere Magnus EX", cc: null }, { name: "Magnus Pro", cc: null }, { name: "Ampere Nexus", cc: null },
      { name: "Ampere Zeal", cc: null }, { name: "Ampere Primus", cc: null }, { name: "Other Ampere model", cc: null },
    ],
  },
  {
    name: "Simple Energy", mark: "SE", power: "electric",
    models: [
      { name: "Simple One", cc: null }, { name: "Simple One Gen 2", cc: null }, { name: "Simple Dot", cc: null },
      { name: "Other Simple Energy model", cc: null },
    ],
  },
  {
    name: "Ultraviolette", mark: "UV", power: "electric",
    models: [
      { name: "F77", cc: null }, { name: "F77 SuperStreet", cc: null }, { name: "F99", cc: null }, { name: "Tesseract", cc: null },
      { name: "Other Ultraviolette model", cc: null },
    ],
  },
  {
    name: "Lectrix EV", mark: "LX", power: "electric",
    models: [
      { name: "Lectrix LXS 2.0", cc: null }, { name: "Lectrix LXS 3.0", cc: null }, { name: "NDX", cc: null },
      { name: "Other Lectrix model", cc: null },
    ],
  },
  {
    name: "Oben Rorr", mark: "OR", power: "electric",
    models: [
      { name: "Oben Rorr", cc: null }, { name: "Oben Rorr EZ", cc: null }, { name: "Other Oben model", cc: null },
    ],
  },
  {
    name: "Ola Electric", mark: "OLA", power: "electric",
    models: [
      { name: "S1 X", cc: null }, { name: "S1 X Gen 2", cc: null }, { name: "S1 X+ Gen 2", cc: null },
      { name: "S1 Air", cc: null }, { name: "S1 Air Gen 2", cc: null }, { name: "S1 Pro", cc: null },
      { name: "S1 Pro Gen 2", cc: null }, { name: "Other Ola Electric model", cc: null },
    ],
  },
  {
    name: "Ather", mark: "A", power: "electric",
    models: [
      { name: "450S", cc: null }, { name: "450X", cc: null }, { name: "450X Apex", cc: null },
      { name: "Rizta", cc: null }, { name: "Rizta S", cc: null }, { name: "Other Ather model", cc: null },
    ],
  },
  {
    name: "TVS iQube", mark: "TVS", power: "electric",
    models: [
      { name: "iQube", cc: null }, { name: "iQube S", cc: null }, { name: "iQube ST", cc: null }, { name: "Other TVS iQube model", cc: null },
    ],
  },
  {
    name: "Chetak (Bajaj)", mark: "CH", power: "electric",
    models: [
      { name: "Chetak 2901", cc: null }, { name: "Chetak Urbane", cc: null }, { name: "Chetak Premium", cc: null },
      { name: "Chetak Premium 3201", cc: null }, { name: "Other Chetak model", cc: null },
    ],
  },
  {
    name: "Vida (Hero)", mark: "V", power: "electric",
    models: [
      { name: "V1 Plus", cc: null }, { name: "V1 Pro", cc: null }, { name: "Vida VX2", cc: null },
      { name: "Vida V2 Plus", cc: null }, { name: "Vida V2 Pro", cc: null }, { name: "Other Vida model", cc: null },
    ],
  },
  {
    name: "Revolt", mark: "R", power: "electric",
    models: [
      { name: "RV1", cc: null }, { name: "RV1+", cc: null }, { name: "RV400", cc: null }, { name: "RV400 BRZ", cc: null },
      { name: "Other Revolt model", cc: null },
    ],
  },
  {
    name: "Bounce Infinity", mark: "BI", power: "electric",
    models: [
      { name: "Infinity E1", cc: null }, { name: "Infinity E1+", cc: null }, { name: "Other Bounce Infinity model", cc: null },
    ],
  },
  {
    name: "Other", mark: "+", power: "non-electric",
    models: [{ name: "Other model", cc: null }],
  },
  {
    name: "Other", mark: "+", power: "electric",
    models: [{ name: "Other model", cc: null }],
  },
];

export function bikeCatalogBrands(power: PowerType) { return BIKE_CATALOG.filter((brand) => brand.power === power); }
export function bikeCatalogModels(power: PowerType, brand: string) { return bikeCatalogBrands(power).find((item) => item.name === brand)?.models ?? []; }
export function getBikeModel(power: PowerType, brand: string, model: string) { return bikeCatalogModels(power, brand).find((item) => item.name === model); }

/** Count of petrol brands with at least one verified cc (for display/verification). */
export function petrolCatalogStats() {
  const petrol = BIKE_CATALOG.filter((b) => b.power === "non-electric" && b.name !== "Other");
  return { brands: petrol.length, models: petrol.reduce((sum, b) => sum + b.models.length, 0) };
}
