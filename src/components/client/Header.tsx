'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import CartIcon from './CartIcon'
import LanguageToggle from './LanguageToggle'
import { Category } from '@/lib/supabase'
import { useTranslation } from '@/context/LanguageContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

type Props = {
  categories?: Category[]
}

export default function Header({ categories = [] }: Props) {
  const { lang } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const getCatName = (cat: Category) =>
    lang === 'ar' ? (cat.name_ar || cat.name) : cat.name

  return (
    <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Row 1 ── */}
        <div className="relative h-14 flex items-center">

          {/* Centre — Livraison (desktop seulement) */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-300 whitespace-nowrap">
              🚚&nbsp;{lang === 'ar' ? 'التوصيل في كل الجزائر' : 'Livraison partout en Algérie'}
            </span>
          </div>

          {/* Gauche — Logo + nom */}
          <Link href="/" className="relative z-10 flex items-center gap-2 flex-shrink-0 group">
            <Image
              src="/logo.png"
              alt="Glow Algérie"
              width={36}
              height={36}
              className="object-contain group-hover:opacity-90 transition"
              priority
            />
            <span className="font-bold text-base tracking-tight">
              Glow<span className="text-rose-400">Algérie</span>
            </span>
          </Link>

          {/* Mobile centre — Livraison */}
          <div className="md:hidden flex-1 flex items-center justify-center px-2 overflow-hidden">
            <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-400 truncate">
              🚚&nbsp;{lang === 'ar' ? 'توصيل في كل الجزائر' : 'Livraison en Algérie'}
            </span>
          </div>

          {/* Droite — réseaux (desktop) + langue + panier + hamburger */}
          <div className="relative z-10 ml-auto md:ml-auto flex items-center gap-1">
            {/* Réseaux sociaux — desktop uniquement */}
            <a
              href="https://www.facebook.com/profile.php?id=100064619993176"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex text-gray-400 hover:text-white transition p-1.5 rounded hover:bg-white/10"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.instagram.com/glow.by.algerie/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex text-gray-400 hover:text-white transition p-1.5 rounded hover:bg-white/10"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <LanguageToggle />
            <CartIcon />
            {categories.length > 0 && (
              <button
                className="md:hidden p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen
                  ? <XMarkIcon className="w-6 h-6" />
                  : <Bars3Icon className="w-6 h-6" />
                }
              </button>
            )}
          </div>
        </div>

        {/* ── Row 2 : sous-nav catégories (desktop) ── */}
        {categories.length > 0 && (
          <div className="hidden md:flex items-center justify-center gap-0.5 border-t border-white/10 h-10">
            <Link
              href="/"
              className="px-4 py-1 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded transition whitespace-nowrap uppercase tracking-widest"
            >
              {lang === 'ar' ? 'الكل' : 'Tout'}
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.id}`}
                className="px-4 py-1 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded transition whitespace-nowrap uppercase tracking-widest"
              >
                {getCatName(cat)}
              </Link>
            ))}
          </div>
        )}

        {/* ── Menu mobile ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition uppercase tracking-wide"
            >
              {lang === 'ar' ? 'الكل' : 'Tout'}
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition uppercase tracking-wide"
              >
                {getCatName(cat)}
              </Link>
            ))}
          </div>
        )}

      </div>
    </header>
  )
}
