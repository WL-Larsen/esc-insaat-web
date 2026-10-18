// Proje fotoğraflarını küçültür: en uzun kenar 2000 px, JPEG/WebP kalite 80,
// EXIF/GPS gibi gömülü bilgiler silinir, telefon yönü (rotation) düzeltilir.
// Dosya adı ve uzantısı değişmez (YAML'daki yollar bozulmaz).
//
// Toplu kullanım (proje kökünden): npm run images
// Geliştirme sırasında: astro.config.mjs içindeki entegrasyon yeni yüklemeleri otomatik işler.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const IMAGE_DIR = 'src/assets/projects';
const MAX_SIDE = 2000;
// Bu sınırın altındaki, zaten küçük ve temiz dosyalar yeniden sıkıştırılmaz (kalite kaybı olmasın).
const MAX_BYTES = 1500 * 1024;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/** Gerekirse dosyayı yerinde küçültür. Değişiklik yapılmadıysa null döner. */
export async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTENSIONS.has(ext)) return null;

  const input = await fs.readFile(file);
  const meta = await sharp(input).metadata();
  const tooLarge = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_SIDE;
  const tooHeavy = input.length > MAX_BYTES;
  const hasEmbeddedData = Boolean(meta.exif || meta.xmp || meta.iptc);
  if (!tooLarge && !tooHeavy && !hasEmbeddedData) return null;

  let pipeline = sharp(input)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true });
  // PNG fotoğraflar kayıpsız sıkıştırmayla küçülmez; ağır olanlar renk paletine indirilir
  // (dosya adı/uzantı aynı kalır, YAML yolları bozulmaz).
  if (ext === '.png') pipeline = tooHeavy ? pipeline.png({ palette: true, quality: 90, effort: 10, dither: 1 }) : pipeline.png({ compressionLevel: 9 });
  else if (ext === '.webp') pipeline = pipeline.webp({ quality: 80 });
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });

  const output = await pipeline.toBuffer(); // sharp gömülü bilgileri varsayılan olarak yazmaz
  if (output.length >= input.length && !tooLarge && !hasEmbeddedData) {
    return { file, before: input.length, after: input.length, skipped: true };
  }

  await fs.writeFile(file, output);
  const outMeta = await sharp(output).metadata();
  return { file, before: input.length, after: output.length, width: outMeta.width, height: outMeta.height };
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
const name = (r) => `${path.basename(path.dirname(r.file))}/${path.basename(r.file)}`;
export const describe = (r) =>
  r.skipped
    ? `${name(r)}: ${kb(r.before)} — küçültülemedi (fotoğraflar için JPG önerilir)`
    : `${name(r)}: ${kb(r.before)} → ${kb(r.after)} (${r.width}×${r.height})`;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Doğrudan çalıştırıldıysa: tüm proje görsellerini işle
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let changed = 0;
  for await (const file of walk(path.resolve(IMAGE_DIR))) {
    const result = await optimizeImage(file);
    if (result?.skipped) console.log('uyarı:', describe(result));
    else if (result) {
      changed++;
      console.log('küçültüldü:', describe(result));
    }
  }
  console.log(changed ? `${changed} görsel küçültüldü.` : 'Tüm görseller zaten uygun boyutta.');
}
