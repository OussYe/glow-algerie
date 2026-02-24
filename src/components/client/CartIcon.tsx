'use client'

import Link from 'next/link'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/context/CartContext'

export default function CartIcon() {
  const { count } = useCart()

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center p-2 rounded-full hover:bg-rose-50 transition"
      aria-label="Panier"
    >
      <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
