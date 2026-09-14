import { useEffect, useState } from 'react'
import { getCategories } from '../api'

const INITIAL_VISIBLE = 6

export default function CategorySection() {
  const [categories, setCategories] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    getCategories()
      .then((items) => {
        if (!cancelled) setCategories(items)
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

  if (loading) {
    return (
      <section className="section categories-section">
        <div className="section-title">
          <h2>Kategori Pilihan</h2>
        </div>

        <p className="section-sub">Jelajahi kebutuhanmu berdasarkan kategori</p>

        <div className="categories">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="category-skel skel" />
          ))}
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return null
  }

  const hasMore = categories.length > INITIAL_VISIBLE
  const visible = showAll
    ? categories
    : categories.slice(0, INITIAL_VISIBLE)

  return (
    <section className="section categories-section">
      <div className="section-title">
        <h2>Kategori Pilihan</h2>

        {hasMore && (
          <button onClick={() => setShowAll((value) => !value)}>
            {showAll ? 'Sembunyikan' : 'Lihat Semua'}
          </button>
        )}
      </div>

      <p className="section-sub">Jelajahi kebutuhanmu berdasarkan kategori</p>

      <div className="categories">
        {visible.map((category) => (
          <button key={category.id} className="category-card">
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
            />

            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
