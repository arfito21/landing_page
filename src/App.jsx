import { useMemo, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Pisang Cavendish',
    price: 15000,
    unit: '/sisir',
    category: 'Buah',
    seller: 'Toko Buah Sandi',
    location: 'Depok',
    badge: 'Bebas Ongkir',
    emoji: '🍌',
    bg: 'yellow',
    description:
      'Pisang Cavendish pilihan dengan rasa manis, tekstur lembut, dan tingkat kematangan yang pas. Cocok untuk camilan, sarapan, smoothie, atau kebutuhan harian keluarga.',
  },
  {
    id: 2,
    name: 'Tomat Merah Bogor',
    price: 15000,
    unit: '/kg',
    category: 'Sayuran',
    seller: 'Fresh Mart Bogor',
    location: 'Jakarta Selatan',
    badge: 'Segar Hari Ini',
    emoji: '🍅',
    bg: 'red',
    description:
      'Tomat merah segar dengan tekstur padat dan rasa yang seimbang. Dipilih dari hasil panen berkualitas untuk masakan sehari-hari.',
  },
  {
    id: 3,
    name: 'Cabe Ijo',
    price: 15000,
    unit: '/250 gr',
    category: 'Sayuran',
    seller: 'Warung Segar',
    location: 'Jakarta Selatan',
    badge: 'Bebas Ongkir',
    emoji: '🌶️',
    bg: 'green',
    description:
      'Cabe hijau segar dengan aroma khas dan tingkat pedas yang nikmat. Pas untuk sambal, tumisan, nasi goreng, dan berbagai masakan Indonesia.',
  },
  {
    id: 4,
    name: 'Tomat Merah Bogor',
    price: 15000,
    unit: '/kg',
    category: 'Sayuran',
    seller: 'Lokakita',
    location: 'Jakarta Pusat',
    badge: 'Bebas Ongkir',
    emoji: '🍅',
    bg: 'red',
    description:
      'Tomat merah pilihan dari penjual lokal. Segar, bersih, dan siap digunakan untuk kebutuhan dapur harian.',
  },
  {
    id: 5,
    name: 'Pisang Cavendish',
    price: 18000,
    unit: '/sisir',
    category: 'Buah',
    seller: 'Toko Buah Sandi',
    location: 'Depok',
    badge: 'Bebas Ongkir',
    emoji: '🍌',
    bg: 'yellow',
    description:
      'Pisang Cavendish premium dengan rasa manis alami. Dikemas rapi agar tetap segar sampai tujuan.',
  },
  {
    id: 6,
    name: 'Cabe Ijo',
    price: 15000,
    unit: '/250 gr',
    category: 'Sayuran',
    seller: 'Warung Segar',
    location: 'Jakarta Selatan',
    badge: 'Bebas Ongkir',
    emoji: '🌶️',
    bg: 'green',
    description:
      'Cabe hijau segar yang cocok untuk berbagai menu rumahan dan kebutuhan kuliner.',
  },
]

const categories = [
  {
    name: 'Buah',
    emoji: '🍓',
    className: 'fruit',
  },
  {
    name: 'Sayuran',
    emoji: '🥬',
    className: 'vegetable',
  },
  {
    name: 'Makanan Ringan',
    emoji: '🍟',
    className: 'snack',
  },
  {
    name: 'Minuman',
    emoji: '🍋',
    className: 'drink',
  },
]

function formatPrice(value) {
  return `Rp${value.toLocaleString('id-ID')}`
}

function ProductCard({ product, onOpen }) {
  return (
    <button
      className="product-card"
      onClick={() => onOpen(product)}
    >
      <div className={`product-image ${product.bg}`}>
        <span>{product.emoji}</span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <div className="price">
          {formatPrice(product.price)}{' '}
          <small>{product.unit}</small>
        </div>

        <div className="seller">
          <span>●</span> {product.seller}
        </div>

        <div className="location">
          ⌖ {product.location}
        </div>

        <div className="shipping">
          ✓ {product.badge}
        </div>
      </div>
    </button>
  )
}

function App() {
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')
  const [quantity, setQuantity] = useState(1)

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === 'Semua' || product.category === category

      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.seller.toLowerCase().includes(query.toLowerCase())

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const openProduct = (product) => {
    setSelected(product)
    setQuantity(1)
  }

  const closeProduct = () => {
    setSelected(null)
    setQuantity(1)
  }

  const addToCart = () => {
    setCart((current) => current + quantity)
    closeProduct()
  }

  const openDownloadApp = () => {
    window.open(
      'https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand-mark">
            <span>pasar</span>lokaloka
          </div>

          <div className="search-wrap">
            <span>⌕</span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari buah, sayur, makanan..."
            />
          </div>

          <nav className="nav-actions">

            <button title="Keranjang">
              🛒
              <b>{cart}</b>
            </button>

            <button title="Wishlist">
              ♡
            </button>

            {/* BUTTON MASUK */}
            <button
              className="login"
              onClick={openDownloadApp}
              title="Download aplikasi Lokaloka"
            >
              Masuk
            </button>

          </nav>
        </div>

        {/* CATEGORY NAV */}
        <div className="category-nav">
          {[
            'Semua',
            'Buah',
            'Sayuran',
            'Makanan Ringan',
            'Minuman',
            'Daging',
            'Dapur & Bumbu',
          ].map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero-banner">

          <div className="hero-copy">

            <div className="bumn">
              BUMN{' '}
              <span>
                UNTUK
                <br />
                INDONESIA
              </span>
            </div>

            <h1>
              Kembangkan Usahamu
              <br />
              di <strong>linkumkm</strong>
            </h1>

            <p>
              Kini hadir LinkUMKM, platform online pemberdayaan
              <br />
              bagi para pelaku UMKM Naik Kelas.
            </p>

          </div>

          <div
            className="hero-people"
            aria-hidden="true"
          >
            <div className="person person-a">
              👨🏻‍💼
            </div>

            <div className="person person-b">
              👩🏻‍🍳
            </div>

            <div className="person person-c">
              👨🏻‍🌾
            </div>

            <i>●</i>
            <i>●</i>
          </div>

          <div className="bri-logo">
            BRI
          </div>

        </section>

        {/* KATEGORI */}
        <section className="section categories-section">

          <div className="section-title">
            <h2>Kategori</h2>

            <button>
              Lihat Semua
            </button>
          </div>

          <div className="categories">

            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`category-card ${cat.className}`}
                onClick={() => {
                  setCategory(cat.name)

                  window.scrollTo({
                    top: 360,
                    behavior: 'smooth',
                  })
                }}
              >
                <span>{cat.name}</span>
                <b>{cat.emoji}</b>
              </button>
            ))}

          </div>

        </section>

        {/* PRODUK REKOMENDASI */}
        <section className="section">

          <div className="section-title">
            <h2>Produk Rekomendasi</h2>

            <button>
              Lihat Semua
            </button>
          </div>

          <div className="product-grid">

            {filtered
              .slice(0, 6)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={openProduct}
                />
              ))}

          </div>

        </section>

        {/* FLASH SALE */}
        <section className="flash-section">

          <div className="section-title">

            <div>
              <h2>Flash Sale</h2>

              <span className="countdown">
                Berakhir dalam &nbsp;01 : 36 : 09
              </span>
            </div>

            <button>
              Lihat Semua
            </button>

          </div>

          <div className="product-grid">

            {products
              .slice(1, 6)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={openProduct}
                />
              ))}

          </div>

        </section>

        {/* DI DEKAT ANDA */}
        <section className="section nearby">

          <div className="section-title">
            <h2>Di Dekat Anda</h2>

            <button>
              Lihat Semua
            </button>
          </div>

          <div className="product-grid">

            {products.map((product) => (
              <ProductCard
                key={`near-${product.id}`}
                product={product}
                onOpen={openProduct}
              />
            ))}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div>
          <b>Bantuan dan Panduan</b>
          <span>Belanja di Pasar</span>
          <span>Kebijakan Privasi</span>
          <span>Syarat dan Ketentuan</span>
        </div>

        <div>
          <b>Jelajah Lokaloka</b>
          <span>Pasar Lokal</span>
          <span>Digital UMKM</span>
          <span>Segar Lokal</span>
        </div>

        <div>
          <b>Pembayaran</b>
          <span>LinkAja</span>
          <span>BRI</span>
        </div>

        <div>
          <b>Layanan Pelanggan</b>
          <span>Pengembalian</span>
          <span>Wishlist</span>
          <span>Chat</span>
        </div>

        <div className="footer-brand">

          <div className="brand-mark">
            <span>pasar</span>lokaloka
          </div>

          <small>
            Download aplikasi
          </small>

          <div className="stores">
            <span> App Store</span>
            <span>▶ Google Play</span>
          </div>

        </div>

      </footer>

      {/* PRODUCT MODAL */}
      {selected && (
        <div
          className="modal-backdrop"
          onClick={closeProduct}
        >

          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close"
              onClick={closeProduct}
            >
              ×
            </button>

            <div
              className={`modal-image ${selected.bg}`}
            >
              <span>{selected.emoji}</span>
            </div>

            <div className="modal-body">

              {/* PRODUCT DESCRIPTION */}
              <div className="modal-main">

                <span className="tag">
                  Produk Segar
                </span>

                <h2>
                  {selected.name}
                </h2>

                <div className="modal-price">
                  {formatPrice(selected.price)}{' '}
                  <small>{selected.unit}</small>
                </div>

                <p>
                  {selected.description}
                </p>

                <div className="detail-lines">

                  <span>
                    ◉ Penjual{' '}
                    <b>{selected.seller}</b>
                  </span>

                  <span>
                    ⌖ Lokasi{' '}
                    <b>{selected.location}</b>
                  </span>

                  <span>
                    ✓ <b>{selected.badge}</b>
                  </span>

                </div>

              </div>

              {/* ORDER */}
              <aside>

                <label>
                  Atur Jumlah Produk
                </label>

                <div className="quantity">

                  <button
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {quantity}
                  </strong>

                  <button
                    onClick={() =>
                      setQuantity((current) =>
                        current + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <div className="subtotal">

                  <span>
                    Total
                  </span>

                  <b>
                    {formatPrice(
                      selected.price * quantity
                    )}
                  </b>

                </div>

                <button
                  className="add-cart"
                  onClick={addToCart}
                >
                  + Keranjang
                </button>

                <div className="voucher">

                  <b>
                    Voucher
                  </b>

                  <p>
                    Diskon ongkir untuk belanja hari ini
                  </p>

                  <button>
                    Klaim
                  </button>

                </div>

              </aside>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default App