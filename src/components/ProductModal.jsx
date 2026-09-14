import { useEffect, useState } from 'react'
import { getProductDetail } from '../api'
import { formatPrice } from '../utils'

export default function ProductModal({ product, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    let cancelled = false

    getProductDetail(product.id)
      .then((data) => {
        if (cancelled) return
        setDetail(data)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [product.id])

  if (loading) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close" onClick={onClose}>×</button>
          <div className="modal-loading">Memuat detail produk…</div>
        </div>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close" onClick={onClose}>×</button>
          <div className="modal-loading">Gagal memuat detail produk</div>
        </div>
      </div>
    )
  }

  const images = detail.images?.length
    ? detail.images
    : [detail.thumbnail].filter(Boolean)

  const pricing = detail.variants?.pricing ?? []

  const displayPrice = selectedVariant
    ? selectedVariant.pricePerUnit?.price ??
      selectedVariant.groceryPrice?.price ??
      detail.price
    : detail.price || pricing[0]?.pricePerUnit?.price || 0

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>

        <div className="modal-gallery">
          <img
            className="modal-main-image"
            src={images[activeImage] || detail.thumbnail}
            alt={detail.name}
          />

          {images.length > 1 && (
            <div className="modal-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Gambar ${i + 1}`}
                >
                  <img src={src} alt={`${detail.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <span className="tag">
              {(detail.categories ?? []).join(', ') || 'Produk'}
            </span>

            <h2>{detail.name}</h2>

            <div className="modal-price">
              {formatPrice(displayPrice)}

              {detail.discount?.value > 0 && (
                <small>{formatPrice(detail.price_before_promo)}</small>
              )}
            </div>

            {pricing.length > 0 && (
              <div className="variants">
                <b className="variants-title">Varian &amp; Harga</b>

                <div className="variant-price-list">
                  {pricing.map((item) => {
                    const itemPrice =
                      item.pricePerUnit?.price ??
                      item.groceryPrice?.price ??
                      0
                    const out = (item.stock ?? 0) <= 0

                    return (
                      <button
                        key={item.id}
                        className={
                          selectedVariant?.id === item.id ? 'active' : ''
                        }
                        onClick={() => setSelectedVariant(item)}
                        disabled={out}
                      >
                        <span className="vp-name">{item.name}</span>

                        <span className="vp-price">
                          {formatPrice(itemPrice)}
                        </span>

                        <span className="vp-stock">
                          {out
                            ? 'Stok habis'
                            : `Stok: ${item.stock} ${item.stockUnit ?? ''}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {detail.description && (
              <div className="modal-desc">
                <b className="variants-title">Deskripsi</b>
                <p>{detail.description}</p>
              </div>
            )}

            <div className="detail-lines">
              <span>
                ◉ Penjual{' '}
                <b>{detail.seller?.name}</b>
              </span>

              <span>
                ⌖ Lokasi{' '}
                <b>{detail.seller?.location}</b>
              </span>

              <span>
                ★{' '}
                <b>
                  {Number(detail.rating).toFixed(1)} (
                  {detail.total_review} ulasan)
                </b>
              </span>

              <span>
                🔥{' '}
                <b>
                  {Number(detail.total_sold).toLocaleString('id-ID')}{' '}
                  terjual
                </b>
              </span>

              <span>
                📦 Stok{' '}
                <b>
                  {detail.stock} {detail.stock_unit}
                </b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
