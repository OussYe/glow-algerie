'use client'

import Link from 'next/link'
import Image from 'next/image'
import CartIcon from './CartIcon'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Glow Algérie"
            width={44}
            height={44}
            className="object-contain group-hover:scale-105 transition duration-200"
            priority
          />
          <div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">Glow</span>
            <span className="font-bold text-xl text-rose-500 tracking-tight">Algérie</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <CartIcon />
        </div>
      </div>
    </header>
  )
}
