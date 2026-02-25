import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import HomeClient from '@/components/client/HomeClient'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default async function HomePage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('created_at', { ascending: true }),
    supabase.from('products').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white py-10 px-4 border-b border-rose-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <SparklesIcon className="w-4 h-4" />
            Livraison partout en Algérie
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Découvrez notre boutique
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base max-w-lg">
            Des produits soigneusement sélectionnés. Qualité garantie, livraison rapide.
          </p>
        </div>
      </section>

      {/* Layout sidebar + produits */}
      <HomeClient
        categories={categories || []}
        products={products || []}
      />

      <footer className="mt-10 border-t border-gray-100 py-8 text-center text-gray-400 text-sm bg-white">
        <p>© 2024 Glow Algérie. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
