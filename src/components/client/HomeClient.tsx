'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Category, Product } from '@/lib/supabase'
import ProductCard from './ProductCard'
import { ProductSkeleton } from '@/components/ui/LoadingSkeleton'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

type Props = {
  categories: Category[]
  products:   Product[]
}

export default function HomeClient({ categories, products }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!selectedId) return products
    return products.filter(p => p.category_id === selectedId)
  }, [products, selectedId])

  const selectedCat = categories.find(c => c.id === selectedId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">

        {/* ── Sidebar catégories (desktop) ─────────────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Catégories
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
                <span className="truncate">Tous les articles</span>
                <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${!selectedId ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
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
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-base">🏷️</span>
                      )}
                    </span>
                    <span className="truncate text-left">{cat.name}</span>
                    <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
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
              Tous
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedId === cat.id ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {cat.image && (
                  <span className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={cat.image} alt="" width={16} height={16} className="w-full h-full object-cover" />
                  </span>
                )}
                {cat.name}
              </button>
            ))}
          </div>

          {/* En-tête de section */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCat ? selectedCat.name : 'Tous les articles'}
              </h2>
              {selectedCat?.description && (
                <p className="text-sm text-gray-500 mt-0.5">{selectedCat.description}</p>
              )}
            </div>
            <span className="text-sm text-gray-400 font-medium">
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grille produits */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500">Aucun article dans cette catégorie pour le moment.</p>
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
