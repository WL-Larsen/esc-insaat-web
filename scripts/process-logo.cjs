// Logo dosyasından site görsellerini üretir: şeffaf zeminli logo, beyaz versiyon, favicon.
// Girdi: açık (beyaza yakın) zemin üzerinde logo (PNG/JPG).
// Kullanım (proje kökünden): node scripts/process-logo.cjs "D:\ESC insaat gorseller\logo.png"
// Çıktı: src/assets/brand/logo-mark(-white).png, public/favicon.png, public/apple-touch-icon.png
const path = require('path');
const fs = require('fs');
const root = process.argv[3] || process.cwd();
const sharp = require(path.join(root, 'node_modules', 'sharp'));

const BG = 249;
const LOGO_MIN = 40; // darkest-channel value of solid logo pixels (approx.)

(async () => {
  const { data, info } = await sharp(process.argv[2]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  const white = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.min(r, g, b);
    let a = (BG - m) / (BG - LOGO_MIN);
    a = Math.max(0, Math.min(1, a));
    // un-blend the background so edges keep the true logo color
    const ub = (c) => (a > 0 ? Math.max(0, Math.min(255, Math.round((c - (1 - a) * BG) / a))) : 0);
    out[i] = ub(r); out[i + 1] = ub(g); out[i + 2] = ub(b); out[i + 3] = Math.round(a * 255);
    white[i] = 255; white[i + 1] = 255; white[i + 2] = 255; white[i + 3] = Math.round(a * 255);
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  const brandDir = path.join(root, 'src', 'assets', 'brand');
  const publicDir = path.join(root, 'public');
  fs.mkdirSync(brandDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const trimmed = async (buf) => sharp(await sharp(buf, raw).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer();
  const color = await trimmed(out);
  const mono = await trimmed(white);

  await sharp(color).resize({ height: 240 }).png({ compressionLevel: 9 }).toFile(path.join(brandDir, 'logo-mark.png'));
  await sharp(mono).resize({ height: 240 }).png({ compressionLevel: 9 }).toFile(path.join(brandDir, 'logo-mark-white.png'));

  const square = async (size, bg) => {
    const inner = Math.round(size * 0.84);
    const mark = await sharp(color).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: mark, gravity: 'center' }]).png({ compressionLevel: 9 });
  };
  await (await square(48, { r: 0, g: 0, b: 0, alpha: 0 })).toFile(path.join(publicDir, 'favicon.png'));
  await (await square(180, { r: 255, g: 255, b: 255, alpha: 1 })).toFile(path.join(publicDir, 'apple-touch-icon.png'));

  for (const f of ['src/assets/brand/logo-mark.png', 'src/assets/brand/logo-mark-white.png', 'public/favicon.png', 'public/apple-touch-icon.png']) {
    const p = path.join(root, f);
    const m = await sharp(p).metadata();
    console.log(f, `${m.width}x${m.height}`, `${Math.round(fs.statSync(p).size / 1024)} KB`);
  }
})();
