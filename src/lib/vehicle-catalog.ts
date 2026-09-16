import type { PowerType } from "@/lib/booking";

export interface BikeModel { name: string; cc: number | null }
export interface BikeBrandCatalog { name: string; mark: string; power: PowerType; models: BikeModel[] }

export const BIKE_CATALOG: BikeBrandCatalog[] = [
  { name: "Hero", mark: "H", power: "non-electric", models: [{ name: "Splendor Plus", cc: 97 }, { name: "HF Deluxe", cc: 97 }, { name: "Passion Plus", cc: 97 }, { name: "Glamour", cc: 125 }, { name: "Xtreme 160R", cc: 163 }, { name: "Xpulse 200", cc: 199 }] },
  { name: "Honda", mark: "H", power: "non-electric", models: [{ name: "Activa 6G", cc: 110 }, { name: "Dio", cc: 110 }, { name: "Shine 125", cc: 124 }, { name: "SP 125", cc: 124 }, { name: "Unicorn", cc: 162 }, { name: "Hornet 2.0", cc: 184 }, { name: "CB350", cc: 348 }] },
  { name: "TVS", mark: "TVS", power: "non-electric", models: [{ name: "Jupiter", cc: 110 }, { name: "NTorq 125", cc: 125 }, { name: "Raider 125", cc: 125 }, { name: "Apache RTR 160", cc: 160 }, { name: "Apache RTR 200", cc: 198 }, { name: "Apache RR 310", cc: 312 }] },
  { name: "Bajaj", mark: "B", power: "non-electric", models: [{ name: "Platina 100", cc: 102 }, { name: "Pulsar 125", cc: 125 }, { name: "Pulsar 150", cc: 150 }, { name: "Pulsar NS200", cc: 199 }, { name: "Dominar 250", cc: 249 }, { name: "Dominar 400", cc: 373 }] },
  { name: "Yamaha", mark: "Y", power: "non-electric", models: [{ name: "Fascino 125", cc: 125 }, { name: "RayZR 125", cc: 125 }, { name: "FZ-S", cc: 149 }, { name: "MT-15", cc: 155 }, { name: "R15", cc: 155 }, { name: "R3", cc: 321 }, { name: "MT-09", cc: 890 }] },
  { name: "Suzuki", mark: "S", power: "non-electric", models: [{ name: "Access 125", cc: 124 }, { name: "Burgman Street", cc: 124 }, { name: "Gixxer", cc: 155 }, { name: "Gixxer SF 250", cc: 249 }, { name: "V-Strom SX", cc: 249 }, { name: "Hayabusa", cc: 1340 }] },
  { name: "Royal Enfield", mark: "RE", power: "non-electric", models: [{ name: "Hunter 350", cc: 349 }, { name: "Classic 350", cc: 349 }, { name: "Bullet 350", cc: 349 }, { name: "Meteor 350", cc: 349 }, { name: "Himalayan 450", cc: 452 }, { name: "Interceptor 650", cc: 648 }, { name: "Super Meteor 650", cc: 648 }] },
  { name: "KTM", mark: "KTM", power: "non-electric", models: [{ name: "Duke 200", cc: 199 }, { name: "RC 200", cc: 199 }, { name: "Duke 250", cc: 249 }, { name: "Adventure 250", cc: 249 }, { name: "Duke 390", cc: 399 }, { name: "Adventure 390", cc: 399 }] },
  { name: "Jawa / Yezdi", mark: "JY", power: "non-electric", models: [{ name: "Jawa 42", cc: 294 }, { name: "Jawa Perak", cc: 334 }, { name: "Yezdi Roadster", cc: 334 }, { name: "Yezdi Adventure", cc: 334 }] },
  { name: "Aprilia", mark: "A", power: "non-electric", models: [{ name: "SR 125", cc: 125 }, { name: "SR 160", cc: 160 }, { name: "RS 457", cc: 457 }, { name: "RS 660", cc: 659 }] },
  { name: "Kawasaki", mark: "K", power: "non-electric", models: [{ name: "Ninja 300", cc: 296 }, { name: "Ninja 400", cc: 399 }, { name: "Ninja 500", cc: 451 }, { name: "Z650", cc: 649 }, { name: "Ninja ZX-10R", cc: 998 }] },
  { name: "Triumph", mark: "T", power: "non-electric", models: [{ name: "Speed 400", cc: 398 }, { name: "Scrambler 400 X", cc: 398 }, { name: "Trident 660", cc: 660 }, { name: "Street Triple", cc: 765 }, { name: "Tiger 900", cc: 888 }] },
  { name: "BMW Motorrad", mark: "BMW", power: "non-electric", models: [{ name: "G 310 R", cc: 313 }, { name: "G 310 GS", cc: 313 }, { name: "F 900 XR", cc: 895 }, { name: "S 1000 RR", cc: 999 }] },
  { name: "Harley-Davidson", mark: "HD", power: "non-electric", models: [{ name: "X440", cc: 440 }, { name: "Nightster", cc: 975 }, { name: "Sportster S", cc: 1252 }] },
  { name: "Other", mark: "+", power: "non-electric", models: [{ name: "Other model", cc: null }] },
  { name: "Ola Electric", mark: "OLA", power: "electric", models: [{ name: "S1 X", cc: null }, { name: "S1 Air", cc: null }, { name: "S1 Pro", cc: null }] },
  { name: "Ather", mark: "A", power: "electric", models: [{ name: "450S", cc: null }, { name: "450X", cc: null }, { name: "Rizta", cc: null }] },
  { name: "TVS", mark: "TVS", power: "electric", models: [{ name: "iQube", cc: null }, { name: "iQube S", cc: null }, { name: "X", cc: null }] },
  { name: "Bajaj", mark: "B", power: "electric", models: [{ name: "Chetak 2901", cc: null }, { name: "Chetak Urbane", cc: null }, { name: "Chetak Premium", cc: null }] },
  { name: "Vida", mark: "V", power: "electric", models: [{ name: "V1 Plus", cc: null }, { name: "V1 Pro", cc: null }, { name: "VX2", cc: null }] },
  { name: "Revolt", mark: "R", power: "electric", models: [{ name: "RV1", cc: null }, { name: "RV400", cc: null }] },
  { name: "Other", mark: "+", power: "electric", models: [{ name: "Other model", cc: null }] },
];

export function bikeCatalogBrands(power: PowerType) { return BIKE_CATALOG.filter((brand) => brand.power === power); }
export function bikeCatalogModels(power: PowerType, brand: string) { return bikeCatalogBrands(power).find((item) => item.name === brand)?.models ?? []; }
export function getBikeModel(power: PowerType, brand: string, model: string) { return bikeCatalogModels(power, brand).find((item) => item.name === model); }
