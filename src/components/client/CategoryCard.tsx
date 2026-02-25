'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/supabase'
import { useTranslation } from '@/context/LanguageContext'

type Props = { category: Category; productCount?: number }

export default function CategoryCard({ category, productCount }: Props) {
  const { t, lang } = useTranslation()

  const displayName        = lang === 'ar' ? (category.name_ar || category.name) : category.name
  const displayDescription = lang === 'ar' ? (category.description_ar || category.description) : category.description

  return (
    <Link
      href={`/categorie/${category.id}`}
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
            <span className="text-5xl">🛍️</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base group-hover:text-rose-500 transition">
          {displayName}
        </h3>
        {displayDescription && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{displayDescription}</p>
        )}
        {productCount !== undefined && (
          <p className="text-xs text-gray-400 mt-2">
            {t('productCount', { count: productCount, s: productCount !== 1 ? 's' : '' })}
          </p>
        )}
      </div>
    </Link>
  )
}
