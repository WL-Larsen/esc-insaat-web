// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Yönetim paneli (Keystatic) yalnızca `astro dev` sırasında açılır;
// üretim derlemesine panel ve React girmez. (Bkz. PLAN.md Aşama 7–8)
const isDev = process.argv.includes('dev');

export default defineConfig({
  devToolbar: { enabled: false },
  integrations: isDev ? [react(), keystatic()] : [],
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
