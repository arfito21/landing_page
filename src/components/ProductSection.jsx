import { useEffect, useRef, useState } from 'react'
import { getProducts } from '../api'
import ProductCard from './ProductCard'

const PER_PAGE = 100

export default function ProductSection({ query = '', onOpen }) {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const sentinelRef = useRef(null)
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const loadingRef = useRef(false)

  // Muat halaman pertama
  useEffect(() => {
    let cancelled = false

    getProducts(1, PER_PAGE)
      .then((res) => {
        if (cancelled) return
        pageRef.current = res.paging?.page ?? 1
        totalPageRef.current = res.paging?.total_page ?? 1
        setProducts(res.data)
        setPage(pageRef.current)
        setTotalPage(totalPageRef.current)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Infinite scroll — muat halaman berikutnya saat sentinel terlihat
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        if (loadingRef.current) return
        if (pageRef.current >= totalPageRef.current) return

        loadingRef.current = true
        setLoadingMore(true)

        getProducts(pageRef.current + 1, PER_PAGE)
          .then((res) => {
            setProducts((prev) => {
              const existing = new Set(prev.map((p) => p.id))
              const fresh = (res.data ?? []).filter(
                (p) => !existing.has(p.id)
              )
              return [...prev, ...fresh]
            })

            pageRef.current = res.paging?.page ?? pageRef.current + 1
            totalPageRef.current =
              res.paging?.total_page ?? totalPageRef.current
            setPage(pageRef.current)
            setTotalPage(totalPageRef.current)
          })
          .catch(() => setError(true))
          .finally(() => {
            loadingRef.current = false
            setLoadingMore(false)
          })
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <section className="section product-section">
        <div className="section-title">
          <h2>Produk</h2>
        </div>

        <div className="products-state">Memuat produk…</div>
      </section>
    )
  }

  if (error && products.length === 0) {
    return (
      <section className="section product-section">
        <div className="section-title">
          <h2>Produk</h2>
        </div>

        <div className="products-state">Gagal memuat produk</div>
      </section>
    )
  }

  const normalizedQuery = query.trim().toLowerCase()
  const visible = normalizedQuery
    ? products.filter(
        (p) =>
          (p.name ?? '').toLowerCase().includes(normalizedQuery) ||
          (p.seller?.name ?? '').toLowerCase().includes(normalizedQuery)
      )
    : products

  const hasMore = page < totalPage

  return (
    <section className="section product-section">
      <div className="section-title">
        <h2>Produk</h2>
      </div>

      {visible.length === 0 ? (
        <div className="products-state">Produk tidak ditemukan</div>
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

      {loadingMore && (
        <div className="products-loading-more">
          Memuat produk lainnya…
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="products-end">Semua produk sudah ditampilkan</div>
      )}

      <div ref={sentinelRef} className="product-sentinel" />
    </section>
  )
}
