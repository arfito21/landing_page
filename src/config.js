// ============================================================
// KONFIGURASI APLIKASI — semua URL penting diambil dari env.
// Lihat .env.example untuk daftar variabel yang tersedia.
//
//   VITE_API_BASE_URL     → base URL API landing page (production)
//   VITE_API_PROXY_TARGET → target proxy Vite saat development
//   VITE_DASHBOARD_URL    → link dashboard principal
//   VITE_PLAYSTORE_URL    → link Google Play Store aplikasi
//
// Setiap variabel punya nilai fallback (URL production saat ini)
// supaya aplikasi tetap jalan walau .env belum dibuat.
// ============================================================

function readEnv(key) {
  if (typeof window !== 'undefined') {
    const runtimeValue = window.__LOKALOKA_ENV__?.[key]
    if (runtimeValue) return runtimeValue
  }

  return import.meta.env?.[key] || ''
}

export const API_BASE =
  readEnv('VITE_API_BASE_URL') ||
  'https://api.landing-page.superpari.co.id/api/v1'

export const API_PROXY_TARGET =
  readEnv('VITE_API_PROXY_TARGET') ||
  'https://api.landing-page.superpari.co.id'

export const DASHBOARD_URL =
  readEnv('VITE_DASHBOARD_URL') || 'https://dashboard-v2.localoka.co.id/'

export const PLAYSTORE_URL =
  readEnv('VITE_PLAYSTORE_URL') ||
  'https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id'

