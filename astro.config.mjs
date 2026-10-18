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
  return {
    name: 'optimize-uploads',
    hooks: {
      'astro:server:setup': async ({ server, logger }) => {
        const { optimizeImage, describe, IMAGE_DIR } = await import('./scripts/optimize-images.mjs');
        const justWritten = new Set();
        const inProgress = new Set();
        /** @param {string} file */
        const handle = async (file) => {
          const key = file.replace(/\\/g, '/');
          if (!key.includes(`/${IMAGE_DIR}/`) || justWritten.has(key) || inProgress.has(key)) return;
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
            if (justWritten.has(key)) return; // kendi yazdığımız dosyanın değişiklik olayı
            try {
              const result = await optimizeImage(file);
              if (result) {
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
        server.watcher.on('add', handle);
        server.watcher.on('change', handle);
      },
    },
  };
}

export default defineConfig({
  devToolbar: { enabled: false },
  integrations: isDev ? [react(), keystatic(), optimizeUploads()] : [],
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
