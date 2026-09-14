import { useEffect, useState } from 'react'
import { getProducts, searchProducts } from '../api'
import ProductCard from './ProductCard'

const PER_PAGE = 100
const INITIAL_VISIBLE = 15
const SEARCH_DEBOUNCE_MS = 400

export default function ProductSection({ query = '', onOpen, storeFilter, onClearStore }) {
  const [products, setProducts] = useState([])
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingAll, setLoadingAll] = useState(false)
  const [error, setError] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const normalizedQuery = query.trim()
  const storeName = storeFilter?.name?.trim() || ''

  // Muat produk biasa, hasil pencarian (POST /products/search), atau
  // filter toko (POST /products/search dengan seller_id) dengan debounce.
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      setError(false)
      setShowAll(false)

      const request = storeFilter?.id
        ? searchProducts({
            seller_id: storeFilter.id,
            search: normalizedQuery || undefined,
            page: 1,
            per_page: PER_PAGE,
          })
        : normalizedQuery
          ? searchProducts({
              search: normalizedQuery,
              page: 1,
              per_page: PER_PAGE,
            })
          : getProducts(1, PER_PAGE)

      request
        .then((res) => {
          if (cancelled) return
          setProducts(res.data)
          setTotalPage(res.paging?.total_page ?? 1)
        })
        .catch(() => {
          if (!cancelled) setError(true)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [normalizedQuery, storeFilter?.id])

  const fetchPage = (page) =>
    storeFilter?.id
      ? searchProducts({
          seller_id: storeFilter.id,
          search: normalizedQuery || undefined,
          page,
          per_page: PER_PAGE,
        })
      : normalizedQuery
        ? searchProducts({
            search: normalizedQuery,
            page,
            per_page: PER_PAGE,
          })
        : getProducts(page, PER_PAGE)

  // Muat semua halaman tersisa saat "Lihat Semua" diklik
  const loadAll = async () => {
    if (loadingAll) return
    setLoadingAll(true)

    try {
      let current = products

      for (let page = 2; page <= totalPage; page += 1) {
        const res = await fetchPage(page)
        const existing = new Set(current.map((item) => item.id))
        const fresh = (res.data ?? []).filter(
          (item) => !existing.has(item.id)
        )
        current = [...current, ...fresh]
      }

      setProducts(current)
    } catch {
      setError(true)
    } finally {
      setLoadingAll(false)
    }
  }

  const toggleShowAll = () => {
    if (!showAll && totalPage > 1) {
      loadAll()
    }
    setShowAll((value) => !value)
  }

  const heading = storeName
    ? `Produk dari ${storeName}`
    : normalizedQuery
      ? `Hasil pencarian "${normalizedQuery}"`
      : 'Rekomendasi Untukmu'
  const subheading = storeName
    ? `${products.length} produk dari toko ini`
    : normalizedQuery
      ? `${products.length} produk ditemukan`
      : 'Produk pilihan dari UMKM lokal terbaik'

  if (loading) {
    return (
      <section className="section product-section">
        <div className="section-title">
          <h2>{heading}</h2>
        </div>

        <p className="section-sub">
          {subheading}
        </p>

        <div className="product-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="product-card">
              <div className="product-image skel" />

              <div className="product-info">
                <div className="skel" style={{ height: 13, borderRadius: 7 }} />
                <div className="skel" style={{ height: 13, width: '70%', borderRadius: 7 }} />
                <div className="skel" style={{ height: 15, width: '45%', borderRadius: 7, marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error && products.length === 0) {
    return (
      <section className="section product-section">
        <div className="section-title">
          <h2>{heading}</h2>
        </div>

        <div className="products-state">
          <span>😢 Gagal memuat produk. Coba muat ulang halaman.</span>
        </div>
      </section>
    )
  }

  const hasMore = products.length > INITIAL_VISIBLE
  const visible = showAll ? products : products.slice(0, INITIAL_VISIBLE)

  return (
    <section className="section product-section">
      <div className="prod-head-card">
        <div className="section-title">
          <h2>
            {heading}
          </h2>
        </div>

        <p className="section-sub">
          {subheading}
        </p>
      </div>

      {storeName && (
        <div className="store-filter-chip">
          <span>
            🏬 Menampilkan produk dari <b>{storeName}</b>
          </span>
          <button type="button" onClick={onClearStore}>
            ✕ Tampilkan semua
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="products-state">
          <span>🔍 Produk tidak ditemukan{storeName ? ` di toko ${storeName}` : ''}{normalizedQuery ? ` untuk "${normalizedQuery}"` : ''}. Coba kata kunci lain.</span>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}

      {loadingAll && (
        <div className="products-loading-more">
          Memuat semua produk…
        </div>
      )}

      {hasMore && (
        <div className="products-more">
          <button className="more-btn" onClick={toggleShowAll}>
            {showAll ? 'Sembunyikan' : 'Lihat Semua'}
          </button>
        </div>
      )}
    </section>
  )
}


