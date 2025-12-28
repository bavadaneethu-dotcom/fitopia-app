import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/fitopia-app/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'Fitopia - Zootopia Fitness',
            short_name: 'Fitopia',
            description: 'A gamified fitness companion app featuring Zootopia characters.',
            theme_color: '#FACC15',
            icons: [
              {
                src: 'https://static.wikia.nocookie.net/zootopia/images/a/aa/Judy_Hopps_Render.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'https://static.wikia.nocookie.net/zootopia/images/0/03/Nick_Wilde_Render.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
