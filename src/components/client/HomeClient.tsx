'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Category, Product } from '@/lib/supabase'
import ProductCard from './ProductCard'
import { useTranslation } from '@/context/LanguageContext'

type Props = {
  categories: Category[]
  products: Product[]
}

export default function HomeClient({ categories, products }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { t, lang } = useTranslation()

  const filtered = useMemo(() => {
    if (!selectedId) return products
    return products.filter(p => p.category_id === selectedId)
  }, [products, selectedId])

  const getCatName = (cat: Category) =>
    lang === 'ar' ? (cat.name_ar || cat.name) : cat.name

  return (
    <main id="products" className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Category filter tabs ───────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <button
          onClick={() => setSelectedId(null)}
          className={`flex-shrink-0 px-5 py-2 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
            !selectedId
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          {t('allProducts')}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={`flex-shrink-0 px-5 py-2 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
              selectedId === cat.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {getCatName(cat)}
          </button>
        ))}
      </div>

      {/* ── Product count ─────────────────────────────────────── */}
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
        {filtered.length} {lang === 'ar' ? 'منتج' : 'Produits'}
      </p>

      {/* ── Product grid ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 font-medium">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ── View category page link (when filter active) ──────── */}
      {selectedId && (
        <div className="mt-10 text-center">
          <Link
            href={`/categorie/${selectedId}`}
            className="inline-block border border-black text-black font-semibold text-sm uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-colors"
          >
            {lang === 'ar' ? 'عرض الكل' : 'Voir tout'}
          </Link>
        </div>
      )}
    </main>
  )
}
