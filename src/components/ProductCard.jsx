import { formatPrice } from '../utils'

export default function ProductCard({ product, onOpen }) {
  const hasDiscount =
    product.discount?.value > 0 && product.price_before_promo > 0

  return (
    <button
      className="product-card"
      onClick={() => onOpen(product)}
    >
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        {hasDiscount && (
          <span className="discount-badge">
            -{product.discount.value}%
          </span>
        )}

        {product.seller?.image && (
          <span className="product-seller-chip">
            <img src={product.seller.image} alt={product.seller.name} loading="lazy" />
            <span>{product.seller.name}</span>
          </span>
        )}

        {(product.stock ?? 1) <= 0 && (
          <span className="product-stock-flag">Stok habis</span>
        )}

        {(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10 && (
          <span className="product-stock-flag low">Sisa {product.stock}</span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <div className="price">
          {formatPrice(product.price)}
        </div>

        {hasDiscount && (
          <div className="price-before">
            {formatPrice(product.price_before_promo)}
          </div>
        )}

        <div className="product-meta">
          <span className="rating">
            ★ {Number(product.rating).toFixed(1)}
          </span>

          <span className="sold">
            {Number(product.total_sold).toLocaleString('id-ID')}{' '}
            terjual
          </span>
        </div>

        {(product.seller?.location || product.seller?.name) && (
          <div className="product-loc">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>{product.seller?.location || product.seller?.name}</span>
          </div>
        )}
      </div>
    </button>
  )
}
