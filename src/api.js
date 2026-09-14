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
  const data = await apiGet('/banners?per_page=100')
  return data?.data ?? []
}

// KATEGORI — GET /categories
export async function getCategories() {
  const data = await apiGet('/categories?per_page=100')
  return data?.data ?? []
}

// PRODUK — GET /products (pagination: ?page=1&per_page=100)
export async function getProducts(page = 1, perPage = 100) {
  const data = await apiGet(`/products?page=${page}&per_page=${perPage}`)
  return {
    data: data?.data ?? [],
    paging: data?.paging,
  }
}

// DETAIL PRODUK — GET /products/:id
export async function getProductDetail(id) {
  return apiGet(`/products/${id}`)
}

// PENCARIAN PRODUK — POST /products/search
export async function searchProducts(params = {}) {
  const response = await fetch(`${API_BASE}/products/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`)
  }

  const json = await response.json()

  if (json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan pada API')
  }

  return {
    data: json.response_data?.data ?? [],
    paging: json.response_data?.paging,
  }
}


