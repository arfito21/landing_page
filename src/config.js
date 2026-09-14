// ============================================================
// KONFIGURASI APLIKASI — semua URL penting diambil dari env.
// Lihat .env.example untuk daftar variabel yang tersedia.
//
//   VITE_API_BASE_URL     → base URL API landing page
//   VITE_DASHBOARD_URL    → link dashboard principal
//   VITE_PLAYSTORE_URL    → link Google Play Store aplikasi
//
// Setiap variabel punya nilai fallback (URL production saat ini)
// supaya aplikasi tetap jalan walau .env belum dibuat.
// ============================================================

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.landing-page.superpari.co.id/api/v1'

export const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || 'https://dashboard-v2.localoka.co.id/'

export const PLAYSTORE_URL =
  import.meta.env.VITE_PLAYSTORE_URL ||
  'https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id'

