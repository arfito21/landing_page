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
      </div>
    </button>
  )
}
