'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Category, Product } from '@/lib/supabase'
import ProductCard from './ProductCard'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/context/LanguageContext'

type Props = {
  categories: Category[]
  products:   Product[]
}

export default function HomeClient({ categories, products }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { t, lang } = useTranslation()

  const filtered = useMemo(() => {
    if (!selectedId) return products
    return products.filter(p => p.category_id === selectedId)
  }, [products, selectedId])

  const selectedCat = categories.find(c => c.id === selectedId)

  // Helpers pour les données bilingues
  const getCatName = (cat: Category) =>
    lang === 'ar' ? (cat.name_ar || cat.name) : cat.name
  const getCatDesc = (cat: Category) =>
    lang === 'ar' ? (cat.description_ar || cat.description) : cat.description

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">

        {/* ── Sidebar catégories (desktop) ─────────────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {t('categories')}
          </p>
          <ul className="space-y-1">
            {/* Tous les articles */}
            <li>
              <button
                onClick={() => setSelectedId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !selectedId
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!selectedId ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Squares2X2Icon className="w-4 h-4" />
                </span>
                <span className="truncate">{t('allProducts')}</span>
                <span className={`ms-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${!selectedId ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {products.length}
                </span>
              </button>
            </li>

            {categories.map(cat => {
              const count = products.filter(p => p.category_id === cat.id).length
              const active = selectedId === cat.id
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedId(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {/* Miniature image */}
                    <span className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt={getCatName(cat)} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-base">🏷️</span>
                      )}
                    </span>
                    <span className="truncate text-start">{getCatName(cat)}</span>
                    <span className={`ms-auto text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* ── Contenu principal ────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Pills horizontaux (mobile uniquement) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedId(null)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                !selectedId ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              <Squares2X2Icon className="w-3.5 h-3.5" />
              {t('all')}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedId === cat.id ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {cat.image_url && (
                  <span className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={cat.image_url} alt="" width={16} height={16} className="w-full h-full object-cover" />
                  </span>
                )}
                {getCatName(cat)}
              </button>
            ))}
          </div>

          {/* En-tête de section */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCat ? getCatName(selectedCat) : t('allProducts')}
              </h2>
              {selectedCat && getCatDesc(selectedCat) && (
                <p className="text-sm text-gray-500 mt-0.5">{getCatDesc(selectedCat)}</p>
              )}
            </div>
            <span className="text-sm text-gray-400 font-medium">
              {t('productCount', { count: filtered.length, s: filtered.length !== 1 ? 's' : '' })}
            </span>
          </div>

          {/* Grille produits */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500">{t('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
