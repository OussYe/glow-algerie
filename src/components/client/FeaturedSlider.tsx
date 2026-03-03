'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { useTranslation } from '@/context/LanguageContext'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Props = { products: Product[] }

export default function FeaturedSlider({ products }: Props) {
  const { lang } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [fading, setFading] = useState(false)

  const total = products.length

  // Fade-out → change index → fade-in
  const goTo = useCallback((idx: number) => {
    if (idx === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(idx)
      setFading(false)
    }, 220)
  }, [current])

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo])
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next, total])

  if (total === 0) return null

  const product = products[current]
  const img = product.images?.[0]

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'clamp(340px, 56vw, 620px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Image (rendu d'UN SEUL produit à la fois) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.22s ease-in-out',
        }}
      >
        {img ? (
          <Image
            src={img}
            alt={product.title}
            fill
            className="object-contain object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
      </div>

      {/* ── Léger dégradé bas pour que le bouton soit lisible ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Bouton Découvrir centré en bas ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.22s ease-in-out',
        }}
      >
        <Link
          href={`/produit/${product.id}`}
          style={{
            background: 'white',
            color: 'black',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '0.875rem 2.5rem',
            display: 'inline-block',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#f43f5e'
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'white'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'white'
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'black'
          }}
        >
          {lang === 'ar' ? 'اكتشف المنتج' : 'Découvrir'}
        </Link>
      </div>

      {/* ── Flèches ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Précédent"
            style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', zIndex: 30,
              background: 'rgba(0,0,0,0.45)', color: 'white',
              border: 'none', borderRadius: '50%',
              width: '2.5rem', height: '2.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          <button
            onClick={next}
            aria-label="Suivant"
            style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)', zIndex: 30,
              background: 'rgba(0,0,0,0.45)', color: 'white',
              border: 'none', borderRadius: '50%',
              width: '2.5rem', height: '2.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRightIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute', bottom: '1rem',
            left: '50%', transform: 'translateX(-50%)',
            zIndex: 30, display: 'flex', gap: '0.5rem', alignItems: 'center',
          }}
        >
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                border: 'none', cursor: 'pointer',
                borderRadius: '9999px',
                height: '8px',
                width: i === current ? '24px' : '8px',
                background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
