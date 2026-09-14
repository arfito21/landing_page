import { useEffect, useRef, useState } from 'react'
import './App.css'
import logo from './assets/logo.jpeg'
import BannerCarousel from './components/BannerCarousel'
import CategorySection from './components/CategorySection'
import ProductSection from './components/ProductSection'
import ProductModal from './components/ProductModal'

function App() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const loginRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowLogin(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const openProduct = (product) => {
    setSelected(product)
  }

  const closeProduct = () => {
    setSelected(null)
  }

  const openPrincipalDashboard = () => {
    window.open(
      'https://dashboard-v2.localoka.co.id/',
      '_blank',
      'noopener,noreferrer'
    )
    setShowLogin(false)
  }

  const openBuyerPlayStore = () => {
    window.open(
      'https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id',
      '_blank',
      'noopener,noreferrer'
    )
    setShowLogin(false)
  }

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand-mark">
            <img className="brand-logo" src={logo} alt="Lokaloka" />
          </div>

          <div className="search-wrap">
            <span>⌕</span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
            />
          </div>

          <nav className="nav-actions">

            {/* BUTTON MASUK */}
            <div className="login-wrap" ref={loginRef}>
              <button
                className="login"
                onClick={() => setShowLogin((value) => !value)}
                aria-haspopup="true"
                aria-expanded={showLogin}
              >
                Masuk
              </button>

              {showLogin && (
                <div className="login-menu">
                  <button
                    className="login-option"
                    onClick={openPrincipalDashboard}
                  >
                    <span className="menu-icon">🏪</span>

                    <span>
                      <b className="menu-title">
                        Login sebagai Principal
                      </b>

                      <small className="menu-sub">
                        Kelola toko &amp; dashboard UMKM
                      </small>
                    </span>
                  </button>

                  <button
                    className="login-option"
                    onClick={openBuyerPlayStore}
                  >
                    <span className="menu-icon">📲</span>

                    <span>
                      <b className="menu-title">
                        Login sebagai Buyer
                      </b>

                      <small className="menu-sub">
                        Download aplikasi Lokaloka di Google Play
                      </small>
                    </span>
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>
      </header>

      <main>

        {/* BANNER CAROUSEL */}
        <section className="banner-section">
          <BannerCarousel />
        </section>

        {/* KATEGORI */}
        <CategorySection />

        {/* PRODUK */}
        <ProductSection query={query} onOpen={openProduct} />

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
          <span>Pasar BRILINK</span>
          <span>Pasar UMKM</span>
          <span>Segar Lokal</span>
        </div>

        <div>
          <b>Pembayaran</b>
          <span>BRIVA</span>
        </div>

        <div>
        </div>

        <div className="footer-brand">

          <div className="brand-mark">
            <img className="brand-logo" src={logo} alt="Lokaloka" />
          </div>

          <small>
            Download aplikasi
          </small>

          <div className="stores">
            <a
              href="https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>▶ Google Play</span>
            </a>
          </div>
        </div>

      </footer>

      {/* PRODUCT MODAL */}
      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={closeProduct}
        />
      )}

    </div>
  )
}

export default App