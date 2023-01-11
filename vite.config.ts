import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({
    includeAssets: [],
    manifest: {
      "theme_color": "#0f1b2a",
      "background_color": "#0f1b2a",
      "display": "fullscreen",
      "scope": "/",
      "start_url": "/",
      "name": "mini-me",
      "short_name": "mini-me",
      "description": "mini-me control ui",
      "icons": [
          {
              "src": "/icon-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
          },
          {
              "src": "/icon-256x256.png",
              "sizes": "256x256",
              "type": "image/png"
          },
          {
              "src": "/icon-384x384.png",
              "sizes": "384x384",
              "type": "image/png"
          },
          {
              "src": "/icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
          }
      ]
    }
  })
]})
