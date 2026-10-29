import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Deployed under https://…/emergency/
  base: '/emergency/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Be Prepared',
        short_name: 'Be Prepared',
        description:
          'Plan and track household emergency supplies for N people and M days.',
        theme_color: '#1e5a3c',
        background_color: '#f3f0e8',
        display: 'standalone',
        start_url: '/emergency/',
        scope: '/emergency/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        navigateFallback: '/emergency/index.html',
      },
    }),
  ],
});
