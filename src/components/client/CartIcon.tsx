'use client'

import Link from 'next/link'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/context/CartContext'
import { useTranslation } from '@/context/LanguageContext'

export default function CartIcon() {
  const { count } = useCart()
  const { t } = useTranslation()

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center p-1.5 rounded hover:bg-white/10 transition"
      aria-label={t('cart')}
    >
      <ShoppingBagIcon className="w-6 h-6 text-gray-300 hover:text-white transition" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
