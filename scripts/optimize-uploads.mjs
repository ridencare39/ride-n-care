/**
 * Optimize the owner-uploaded Ride N Care photos in src/assets/uploads.
 *
 * Pipeline (as documented in src/assets/uploads/README.md):
 *   centre-crop to 4:3 → resize to 1600px wide → optimized WebP.
 * We additionally emit an 800px variant so <img srcset> can serve small
 * screens a lighter file. Originals in src/assets/uploads are never modified.
 *
 * Usage: node scripts/optimize-uploads.mjs
 * Output: src/assets/photos/<slug>-{800,1600}.webp
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const SRC = "src/assets/uploads";
const OUT = "src/assets/photos";

/** Source filename prefix → output slug (descriptive, URL-safe filenames). */
const MAP = [
  ["Mechanic_servicing_motorcycle_ou", "doorstep-service-apartment"],
  ["anton-savinov", "mechanic-tools-tray"],
  ["Mechanic_repairing_Yamaha_motorc", "ride-n-care-workshop-signage"],
  ["Mechanic_repairing_scooter_at_home", "scooter-service-repair"],
  ["skica911", "motorcycle-workshop-repair"],
  // Two "repairing motorcycle at…" files, distinguished by content:
  //  …141438 has the blue Ride N Care pickup canopy top-left (no red cars) → maroon RE + brand truck.
  //  …141413 has red cars top-left and no blue → black RE outside a residence.
  ["Mechanic_repairing_motorcycle_at…_2K_20260929141438", "doorstep-royal-enfield-repair"],
  ["Mechanic_repairing_motorcycle_at…_2K_20260929141413", "royal-enfield-service-at-home"],
];

const WIDTHS = [
  { w: 1600, q: 82 },
  { w: 800, q: 80 },
];

mkdirSync(OUT, { recursive: true });

const sources = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const rows = [];

for (const file of sources) {
  const hit = MAP.find(([prefix]) => file.startsWith(prefix));
  if (!hit) {
    console.warn(`SKIP (no slug mapping): ${file}`);
    continue;
  }
  const slug = hit[1];
  const srcPath = path.join(SRC, file);
  const before = statSync(srcPath).size;
  const meta = await sharp(srcPath).metadata();

  for (const { w, q } of WIDTHS) {
    const outPath = path.join(OUT, `${slug}-${w}.webp`);
    // 4:3 centre crop (position "centre" keeps the subject in frame), then width.
    await sharp(srcPath)
      .resize(w, Math.round((w * 3) / 4), { fit: "cover", position: "centre" })
      .webp({ quality: q, effort: 5 })
      .toFile(outPath);
  }

  const out1600 = statSync(path.join(OUT, `${slug}-1600.webp`)).size;
  const out800 = statSync(path.join(OUT, `${slug}-800.webp`)).size;
  rows.push({
    slug,
    source: file,
    dims: `${meta.width}x${meta.height}`,
    beforeKB: Math.round(before / 1024),
    out1600KB: Math.round(out1600 / 1024),
    out800KB: Math.round(out800 / 1024),
  });
}

console.log("\nslug                          source dims    before   →1600w  →800w");
for (const r of rows) {
  console.log(
    `${r.slug.padEnd(28)} ${r.dims.padEnd(12)} ${String(r.beforeKB + "KB").padStart(7)} ${String(r.out1600KB + "KB").padStart(8)} ${String(r.out800KB + "KB").padStart(7)}`,
  );
}
const missing = MAP.filter(([p]) => !sources.some((f) => f.startsWith(p)));
if (missing.length) {
  console.error(`\nERROR: ${missing.length} mapped source(s) not found in ${SRC}`);
  process.exit(1);
}
console.log(`\nOK: ${rows.length} photos → ${OUT}`);
