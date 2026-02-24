'use client'

import Link from 'next/link'
import CartIcon from './CartIcon'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">Glow</span>
            <span className="font-bold text-xl text-rose-500 tracking-tight">Algérie</span>
          </div>
        </Link>
        <CartIcon />
      </div>
    </header>
  )
}
