import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/* global process */

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl =
    env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
  let proxyTarget
  try {
    proxyTarget = new URL(baseUrl).origin
  } catch {
    proxyTarget = baseUrl
  }

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

