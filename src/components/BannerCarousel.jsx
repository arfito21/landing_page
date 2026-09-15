import { useEffect, useState } from 'react'
import { getBanners } from '../api'

const AUTOPLAY_MS = 10000

export default function BannerCarousel() {
  const [banners, setBanners] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getBanners()
      .then((items) => {
        if (cancelled) return

        const active = items
          .filter((banner) => banner.status === 'ACTIVE')
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

        setBanners(active)
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

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % banners.length)
    }, AUTOPLAY_MS)

    return () => clearInterval(timer)
  }, [banners.length])

  if (loading) {
    return (
      <div className="banner-carousel banner-skel skel" aria-label="Memuat banner" />
    )
  }

  if (error || banners.length === 0) {
    return null
  }

  const next = () =>
    setIndex((current) => (current + 1) % banners.length)

  const prev = () =>
    setIndex((current) => (current - 1 + banners.length) % banners.length)

  return (
    <div className="banner-carousel">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner) => (
          <a
            key={banner.id}
            className="banner-slide"
            href={banner.url || undefined}
            target={banner.url ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <img
              src={banner.thumbnail}
              alt={banner.name}
              loading="lazy"
            />
          </a>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            className="banner-arrow prev"
            onClick={prev}
            aria-label="Banner sebelumnya"
          >
            ‹
          </button>

          <button
            className="banner-arrow next"
            onClick={next}
            aria-label="Banner berikutnya"
          >
            ›
          </button>

          <div className="banner-dots">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                className={i === index ? 'active' : ''}
                onClick={() => setIndex(i)}
                aria-label={`Ke banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
