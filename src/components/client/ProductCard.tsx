'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useTranslation } from '@/context/LanguageContext'

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const { t, lang } = useTranslation()
  const hasDiscount = product.discount_percent > 0
  const finalPrice = getDiscountedPrice(product.price, product.discount_percent)
  const mainImage = product.images?.[0]

  const displayTitle = lang === 'ar' ? (product.title_ar || product.title) : product.title

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast.success(t('addedToCart'), { duration: 1500 })
  }

  return (
    <Link
      href={`/produit/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{ aspectRatio: '3/4' }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
        )}

        {/* Badge réduction — pill arrondi */}
        {hasDiscount && (
          <div
            className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow"
          >
            -{product.discount_percent}%
          </div>
        )}

        {/* Overlay Rupture de stock */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-gray-800 font-semibold text-xs px-4 py-1.5 rounded-full uppercase tracking-wide shadow">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="px-3 pt-3 pb-3">
        {/* Titre */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
          {displayTitle}
        </h3>

        {/* Prix + bouton panier */}
        <div className="flex items-center justify-between gap-2">
          {/* Prix */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[#16a34a] text-sm">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-red-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Bouton panier — persistant, rose */}
          {product.in_stock && (
            <button
              onClick={handleAdd}
              aria-label={t('addToCart')}
              className="flex-shrink-0 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full p-2 shadow transition-all duration-200"
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
