import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Teruskan request API di mode dev ke server landing page,
      // supaya tidak terkena masalah CORS.
      '/api': {
        target: 'https://api.landing-page.superpari.co.id',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

