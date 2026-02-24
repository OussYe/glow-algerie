'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { formatPrice, getDiscountedPrice } from '@/lib/cart'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const hasDiscount = product.discount_percent > 0
  const finalPrice = getDiscountedPrice(product.price, product.discount_percent)
  const mainImage = product.images?.[0]

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    toast.success('Ajouté au panier', { duration: 1500 })
  }

  return (
    <Link
      href={`/produit/${product.id}`}
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount_percent}%
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-semibold text-sm px-3 py-1 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-rose-500 transition">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-gray-900 text-base">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.in_stock && (
            <button
              onClick={handleAdd}
              className="p-2 rounded-full bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 transition"
              aria-label="Ajouter au panier"
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
