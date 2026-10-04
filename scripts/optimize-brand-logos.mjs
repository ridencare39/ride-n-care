/**
 * Brand logo optimization (SEOmator Part 1): kawasaki.svg (93.7 KB, embeds a
 * 2560×404 raster inside the SVG) and royalenfield.svg (37.7 KB) render at a
 * max 36×28 CSS px inside the marquee plate. Rasterize both to 4× WebP and
 * verify with a pixel diff against the original SVG rendering.
 *
 * Usage: bun scripts/optimize-brand-logos.mjs [--write]
 * Without --write it only renders + reports the diff (no files written).
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const WRITE = process.argv.includes("--write");
const ITEMS = [
  { name: "kawasaki", svg: "public/brands/kawasaki.svg", out: "public/brands/kawasaki.webp", width: 144 },
  { name: "royalenfield", svg: "public/brands/royalenfield.svg", out: "public/brands/royalenfield.webp", width: 144 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 400 } });

for (const item of ITEMS) {
  const svgData = readFileSync(item.svg).toString("base64");
  const result = await page.evaluate(
    async ({ data, width }) => {
      const load = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("load failed"));
          img.src = src;
        });
      const svgUrl = `data:image/svg+xml;base64,${data}`;
      const img = await load(svgUrl);
      const ratio = img.naturalHeight / img.naturalWidth;
      const w = width;
      const h = Math.max(1, Math.round(width * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const webp = canvas.toDataURL("image/webp", 0.92);
      return { webp, w, h, natural: [img.naturalWidth, img.naturalHeight] };
    },
    { data: svgData, width: item.width },
  );

  const base64 = result.webp.split(",")[1];
  const bytes = Buffer.from(base64, "base64");
  console.log(`${item.name}: natural ${result.natural.join("×")} → ${result.w}×${result.h} webp, ${bytes.length} bytes (svg ${readFileSync(item.svg).length} bytes)`);

  // Pixel-diff check: render SVG and WebP at the same size, compare.
  const diff = await page.evaluate(
    async ({ svgData, webpData, w, h }) => {
      const load = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      const a = await load(`data:image/svg+xml;base64,${svgData}`);
      const b = await load(`data:image/webp;base64,${webpData}`);
      const grab = (img) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff"; // plate background
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h).data;
      };
      const da = grab(a);
      const db = grab(b);
      let sum = 0;
      let max = 0;
      for (let i = 0; i < da.length; i += 4) {
        for (let ch = 0; ch < 3; ch++) {
          const d = Math.abs(da[i + ch] - db[i + ch]);
          sum += d;
          if (d > max) max = d;
        }
      }
      return { mean: sum / (da.length / 4 * 3), max };
    },
    { svgData, webpData: base64, w: result.w, h: result.h },
  );
  console.log(`  pixel diff vs original SVG: mean=${diff.mean.toFixed(2)}/255 max=${diff.max}/255 ${diff.mean < 6 ? "(visually equivalent)" : "(CHECK!)"}`);

  if (WRITE) {
    writeFileSync(item.out, bytes);
    console.log(`  wrote ${item.out}`);
  }
}

await browser.close();
