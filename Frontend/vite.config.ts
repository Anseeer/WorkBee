import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'WorkBee',
        short_name: 'WorkBee',
        description: 'WorkBee - Local Job Management App',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/Logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Logo1.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
