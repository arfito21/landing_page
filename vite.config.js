import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/* global process */

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Baca env agar target proxy dev bisa diatur lewat VITE_API_PROXY_TARGET.
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    (env.VITE_API_BASE_URL
      ? new URL(env.VITE_API_BASE_URL).origin
      : 'https://api.landing-page.superpari.co.id')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Teruskan request API di mode dev ke server landing page,
        // supaya tidak terkena masalah CORS.
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})

