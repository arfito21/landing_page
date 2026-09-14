import { useEffect, useRef, useState } from 'react'
import { getCategories, searchProducts } from '../api'
import { formatPrice } from '../utils'

const TRENDING = ['Baju', 'Kursi', 'Meja', 'Gamepad', 'Furniture', 'Pakaian']

export default function SearchBar({ value, onChange, onPickProduct }) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [suggests, setSuggests] = useState([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const wrapRef = useRef(null)
  const keyword = value.trim()

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    let cancelled = false
    getCategories()
      .then((items) => {
        if (!cancelled) setCategories((items ?? []).slice(0, 6))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!keyword) return undefined
    const timer = setTimeout(() => {
      setSuggestLoading(true)
      searchProducts({ search: keyword, page: 1, per_page: 6 })
        .then((res) => setSuggests(res.data ?? []))
        .catch(() => setSuggests([]))
        .finally(() => setSuggestLoading(false))
    }, 350)
    return () => clearTimeout(timer)
  }, [keyword])

  const pickKeyword = (text) => {
    onChange(text)
    setOpen(false)
  }

  return (
    <div className="search-wrap search-has-drop" ref={wrapRef}>
      <span className="search-icon">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
      </span>
      <input
        value={value}
        onChange={(e) => {
          if (!e.target.value.trim()) {
            setSuggests([])
            setSuggestLoading(false)
          }
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Cari baju, furniture, elektronik…"
        aria-label="Cari produk"
      />
      {keyword && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Hapus pencarian" type="button">×</button>
      )}
      {open && (
        <div className="search-drop">
          {keyword ? (
            <>
              <button className="search-drop-row search-drop-all" onMouseDown={(e) => e.preventDefault()} onClick={() => pickKeyword(keyword)} type="button">
                <span className="search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
                </span>
                <span>Cari “<b>{keyword}</b>”</span>
              </button>
              <p className="search-drop-title">Rekomendasi produk</p>
              {suggestLoading && (
                <div className="search-drop-loading">
                  <span className="skel" style={{ width: 38, height: 38, borderRadius: 10 }} />
                  <span className="skel" style={{ height: 12, width: '60%', borderRadius: 6 }} />
                </div>
              )}
              {!suggestLoading && suggests.length === 0 && (
                <p className="search-drop-empty">Belum ada rekomendasi untuk “{keyword}”.</p>
              )}
              {!suggestLoading &&
                suggests.map((item) => (
                  <button key={item.id} className="search-drop-row search-drop-product" onMouseDown={(e) => e.preventDefault()} onClick={() => {
                    setOpen(false)
                    onPickProduct?.(item)
                  }} type="button">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span className="search-drop-pinfo">
                      <span className="search-drop-pname">{item.name}</span>
                      <span className="search-drop-pprice">{formatPrice(item.price)}</span>
                    </span>
                    <span className="search-drop-go">›</span>
                  </button>
                ))}
            </>
          ) : (
            <>
              <p className="search-drop-title">Pencarian populer</p>
              <div className="search-tags">
                {TRENDING.map((text) => (
                  <button key={text} type="button" className="search-tag" onMouseDown={(e) => e.preventDefault()} onClick={() => pickKeyword(text)}>
                    {text}
                  </button>
                ))}
              </div>
              {categories.length > 0 && (
                <>
                  <p className="search-drop-title">Kategori populer</p>
                  <div className="search-cats">
                    {categories.map((cat) => (
                      <button key={cat.id} type="button" className="search-cat" onMouseDown={(e) => e.preventDefault()} onClick={() => pickKeyword(cat.name)}>
                        <img src={cat.image} alt={cat.name} loading="lazy" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

