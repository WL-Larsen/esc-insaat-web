// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Yönetim paneli (Keystatic) yalnızca `astro dev` sırasında açılır;
// üretim derlemesine panel ve React girmez. (Bkz. PLAN.md Aşama 7–8)
const isDev = process.argv.includes('dev');

/**
 * Panelden yüklenen fotoğrafları kaydedildikleri anda küçültür (yalnızca geliştirmede).
 * @returns {import('astro').AstroIntegration}
 */
function optimizeUploads() {
  // Vite izleyicisi yerine Node'un fs.watch'u kullanılır: Vite, ayar değişikliğiyle yeniden
  // başladığında olayları kaçırabiliyordu. Her yeniden başlatmada izleyici kapatılıp yeniden kurulur.
  /** @type {import('node:fs').FSWatcher | undefined} */
  let watcher;
  return {
    name: 'optimize-uploads',
    hooks: {
      'astro:server:done': () => {
        watcher?.close();
        watcher = undefined;
      },
      'astro:server:setup': async ({ logger }) => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const { optimizeImage, describe, IMAGE_DIR } = await import('./scripts/optimize-images.mjs');
        const root = path.resolve(IMAGE_DIR);
        const justWritten = new Set();
        const inProgress = new Set();
        /** @param {string} file */
        const handle = async (file) => {
          const key = file.replace(/\\/g, '/');
          if (justWritten.has(key) || inProgress.has(key) || !fs.existsSync(file)) return;
          inProgress.add(key);
          try {
            await optimizeWithRetry(file, key);
          } finally {
            inProgress.delete(key);
          }
        };
        /** @param {string} file @param {string} key */
        const optimizeWithRetry = async (file, key) => {
          for (const delay of [400, 1500]) {
            await new Promise((r) => setTimeout(r, delay)); // dosyanın yazılması bitsin
            if (justWritten.has(key) || !fs.existsSync(file)) return; // kendi yazdığımız dosya / silinmiş dosya
            try {
              const result = await optimizeImage(file);
              if (result?.skipped) logger.warn(`fotoğraf: ${describe(result)}`);
              else if (result) {
                justWritten.add(key);
                setTimeout(() => justWritten.delete(key), 5000);
                logger.info(`fotoğraf küçültüldü: ${describe(result)}`);
              }
              return;
            } catch (error) {
              if (delay === 1500) logger.warn(`fotoğraf işlenemedi: ${key} (${error})`);
            }
          }
        };
        watcher?.close();
        fs.mkdirSync(root, { recursive: true });
        watcher = fs.watch(root, { recursive: true }, (_event, filename) => {
          if (filename) handle(path.join(root, filename.toString()));
        });
      },
    },
  };
}

export default defineConfig({
  devToolbar: { enabled: false },
  integrations: isDev ? [react(), keystatic(), optimizeUploads()] : [],
  // Panele kısa yol: /admin → /keystatic (Keystatic'in adresi pakette sabit, değiştirilemiyor).
  // Panel canlıya alınınca (Faz B) üretimde de etkinleştirilecek.
  redirects: isDev ? { '/admin': '/keystatic' } : {},
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    // .tmp (test çıktıları, tarayıcı profilleri) izlenmez; aksi halde sayfalar gereksiz yenilenir
    server: { watch: { ignored: ['**/.tmp/**'] } },
  },
});
