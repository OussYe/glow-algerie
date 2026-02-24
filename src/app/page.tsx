import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import CategoryCard from '@/components/client/CategoryCard'
import { CategorySkeleton } from '@/components/ui/LoadingSkeleton'
import { Suspense } from 'react'
import { SparklesIcon } from '@heroicons/react/24/solid'

async function CategoriesGrid() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return (
      <div className="text-center py-16 text-gray-500">
        Erreur lors du chargement des catégories. Veuillez réessayer.
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛍️</div>
        <p className="text-gray-500 text-lg">Aucune catégorie disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  )
}

function CategoriesLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            Livraison partout en Algérie
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez notre boutique
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Des produits soigneusement sélectionnés pour vous. Qualité garantie, livraison rapide.
          </p>
        </div>
      </section>

      {/* Catégories */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nos Catégories</h2>
        </div>
        <Suspense fallback={<CategoriesLoading />}>
          <CategoriesGrid />
        </Suspense>
      </main>

      <footer className="mt-16 border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 Glow Algérie. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
