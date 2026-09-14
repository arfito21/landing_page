import { useEffect, useState } from 'react'
import { getProductDetail } from '../api'
import { DASHBOARD_URL, PLAYSTORE_URL } from '../config'
import { formatPrice } from '../utils'

export default function ProductModal({ product, onClose, onVisitStore }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [selVar, setSelVar] = useState(null)

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
  const variantCount = pricing.length || detail.variant_names?.length || 1
  const displayPrice = selVar
    ? (selVar.pricePerUnit?.price ?? selVar.groceryPrice?.price ?? detail.price)
    : detail.price || pricing[0]?.pricePerUnit?.price || 0
  const soldText = Number(detail.total_sold ?? 0).toLocaleString('id-ID')
  const stockText = `${Number(detail.stock ?? 0).toLocaleString('id-ID')} ${detail.stock_unit || 'pcs'}`
  const locText = (detail.seller?.location || '-').replace(/^(kota|kabupaten|kab\.?)\s+/i, '')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <div className="modal-detail modal-detail-3">
          <div className="modal-gallery">
            <img className="modal-main-image" src={images[activeImage] || detail.thumbnail} alt={detail.name} />
            {images.length > 1 && (
              <div className="modal-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={i === activeImage ? 'active' : ''} onClick={() => setActiveImage(i)}>
                    <img src={src} alt={`${detail.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="modal-info">
            <span className="tag">{(detail.categories ?? []).join(', ') || 'Produk'}</span>
            <h2>{detail.name}</h2>
            <div className="modal-meta-line">
              <span className="rating">★ {Number(detail.rating ?? 0).toFixed(1)}</span>
              <span>{detail.total_review ?? 0} ulasan</span>
              <span className="dot">•</span>
              <span>{soldText} terjual</span>
            </div>
            <div className="modal-price">
              {formatPrice(displayPrice)}
              {detail.discount?.value > 0 && (<small>{formatPrice(detail.price_before_promo)}</small>)}
            </div>
            {detail.description && (
              <div className="modal-desc">
                <b className="variants-title">Deskripsi</b>
                <p>{detail.description}</p>
              </div>
            )}
          </div>
          <div className="modal-variant">
            {pricing.length > 0 ? (
              <div className="variants">
                <b className="variants-title">Varian &amp; Harga</b>
                <div className="variant-price-list">
                  {pricing.map((item) => {
                    const ip = item.pricePerUnit?.price ?? item.groceryPrice?.price ?? 0
                    const out = (item.stock ?? 0) <= 0
                    return (
                      <button key={item.id} className={selVar?.id === item.id ? 'active' : ''} onClick={() => setSelVar(item)} disabled={out}>
                        <span className="vp-name">{item.name}</span>
                        <span className="vp-price">{formatPrice(ip)}</span>
                        <span className="vp-stock">{out ? 'Stok habis' : `Stok: ${item.stock} ${item.stockUnit ?? ''}`}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              detail.variant_names?.length > 0 && (
                <div className="variants">
                  <b className="variants-title">Varian</b>
                  <div className="variant-list">
                    {detail.variant_names.map((n) => (<span key={n} className="variant-chip">{n}</span>))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="modal-foot">
          <div className="seller-card">
            <div className="seller-grid32">
              <div className="seller-cell seller-ava">
                {detail.seller?.image ? (
                  <img className="seller-avatar" src={detail.seller.image} alt={detail.seller.name} loading="lazy" />
                ) : (
                  <span className="seller-avatar seller-avatar-fallback">{(detail.seller?.name || 'T').charAt(0)}</span>
                )}
              </div>
              <div className="seller-cell"><small>Terjual</small><b>{soldText}</b></div>
              <div className="seller-cell"><small>Lokasi</small><b className="seller-loc">{locText}</b></div>
              <div className="seller-cell seller-name-cell"><b className="seller-name">{detail.seller?.name || 'Penjual'}</b></div>
              <div className="seller-cell"><small>Produk</small><b>{variantCount}</b></div>
              <div className="seller-cell"><small>Stok</small><b>{stockText}</b></div>
            </div>
            <div className="seller-actions">
              <a className="seller-btn primary" href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">💬 Chat Sekarang</a>
              <button className="seller-btn" type="button" onClick={() => onVisitStore?.(detail.seller)} disabled={!detail.seller?.id && !detail.seller?.name}>🏬 Kunjungi Toko</button>
            </div>
          </div>
          <div className="modal-cta">
            <a className="cta-primary" href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer">Buka di Aplikasi 📲</a>
            <a className="cta-soft" href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">Jadi Seller 🏪</a>
          </div>
        </div>
      </div>
    </div>
  )
}
