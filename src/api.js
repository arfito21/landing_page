// ============================================================
// API LAYER — endpoint landing page
// Base: https://api.landing-page.superpari.co.id/api/v1
//
// Di mode development, request melewati Vite proxy (vite.config.js)
// agar terhindar dari masalah CORS. Di mode production, memanggil
// URL absolut API.
//
// Tambahkan endpoint baru di sini (categories, products, dll.).
// ============================================================

export const API_BASE = import.meta.env.PROD
  ? 'https://api.landing-page.superpari.co.id/api/v1'
  : '/api/v1'

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`)
  }

  const json = await response.json()

  if (json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan pada API')
  }

  return json.response_data
}

// BANNER — GET /banners
export async function getBanners() {
  const data = await apiGet('/banners')
  return data?.data ?? []
}

// Contoh endpoint berikutnya (aktifkan saat dibutuhkan):

// GET /categories
// export async function getCategories() {
//   const data = await apiGet('/categories')
//   return data?.data ?? []
// }

// GET /products
// export async function getProducts() {
//   const data = await apiGet('/products')
//   return data?.data ?? []
// }
