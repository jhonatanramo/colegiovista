import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
 // eslint-disable-next-line no-undef
const env = loadEnv(mode, process.cwd(), '');


  return {
    server: {
      port: 3000,
      strictPort: false,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE, // usa la variable de entorno
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Coro Juvenil',
          short_name: 'Coro',
          description: 'Aplicación del Coro Juvenil',
          theme_color: '#2A3A71',
          background_color: '#96D1F1',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        }
      })
    ]
  };
});
