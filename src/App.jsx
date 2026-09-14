import { useEffect, useRef, useState } from 'react'
import './App.css'
import './theme.css'
import logo from './assets/logo.jpeg'
import { DASHBOARD_URL, PLAYSTORE_URL } from './config'
import BannerCarousel from './components/BannerCarousel'
import CategorySection from './components/CategorySection'
import ProductSection from './components/ProductSection'
import ProductModal from './components/ProductModal'
import SearchBar from './components/SearchBar'

function App() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [storeFilter, setStoreFilter] = useState(null)
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

  const visitStore = (seller) => {
    if (!seller?.id && !seller?.name) return
    setStoreFilter({ id: seller?.id ?? null, name: seller?.name ?? 'Toko' })
    setSelected(null)
    requestAnimationFrame(() => {
      document
        .querySelector('.product-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const openPrincipalDashboard = () => {
    window.open(
      DASHBOARD_URL,
      '_blank',
      'noopener,noreferrer'
    )
    setShowLogin(false)
  }

  const openBuyerPlayStore = () => {
    window.open(
      PLAYSTORE_URL,
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

          <SearchBar value={query} onChange={setQuery} onPickProduct={openProduct} />

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

        {/* KEUNGGULAN */}
        <section className="perks">
          <div className="perk">
            <span className="perk-icon">🇮🇩</span>

            <div>
              <b>100% Produk Lokal</b>
              <small>Dukung UMKM dari seluruh Indonesia</small>
            </div>
          </div>

          <div className="perk">
            <span className="perk-icon">🛡️</span>

            <div>
              <b>Belanja Aman</b>
              <small>Transaksi aman lewat aplikasi resmi</small>
            </div>
          </div>

          <div className="perk">
            <span className="perk-icon">🚚</span>

            <div>
              <b>Pengiriman Luas</b>
              <small>Jangkauan kirim ke banyak daerah</small>
            </div>
          </div>
        </section>

        {/* KATEGORI */}
        <CategorySection />

        {/* PRODUK */}
        <ProductSection query={query} onOpen={openProduct} storeFilter={storeFilter} onClearStore={() => setStoreFilter(null)} />

      </main>

      {/* FOOTER */}
      <footer>

        <div className="footer-brand">

          <div className="brand-mark">
            <img className="brand-logo" src={logo} alt="Lokaloka" />
          </div>

          <span className="footer-desc">
            Pasar online Indonesia untuk produk lokal berkualitas dari UMKM terbaik.
          </span>

          <small>
            Download aplikasi
          </small>

          <div className="stores">
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Google Play
            </a>
          </div>
        </div>

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

        <div className="footer-complaint">
          <b>Layanan Pengaduan Konsumen</b>
          <span className="complaint-company">PT. Super Pasar Rakyat Indonesia</span>
          <span className="complaint-contact">
            Hubungi{' '}
            <a href="tel:081119990084">0811 1999 0084</a>
            {' '}atau email ke{' '}
            <a href="mailto:help@pari.co.id">help@pari.co.id</a>
          </span>
          <span className="complaint-gov">
            Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga
            Kementerian Perdagangan RI — Whatsapp Ditjen PKTN{' '}
            <a
              href="https://wa.me/6285311111010"
              target="_blank"
              rel="noopener noreferrer"
            >
              0853 1111 1010
            </a>
          </span>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Lokaloka. Seluruh hak cipta dilindungi.</span>
          <span>Dibuat dengan bangga untuk UMKM Indonesia</span>
        </div>

      </footer>

      {/* PRODUCT MODAL */}
      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={closeProduct}
          onVisitStore={visitStore}
        />
      )}

    </div>
  )
}

export default App