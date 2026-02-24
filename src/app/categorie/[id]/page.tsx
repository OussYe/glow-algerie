import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import ProductCard from '@/components/client/ProductCard'
import { ProductSkeleton } from '@/components/ui/LoadingSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

async function ProductsGrid({ categoryId }: { categoryId: string }) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-center py-10 text-gray-500">Erreur de chargement.</div>
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500">Aucun article dans cette catégorie pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) notFound()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-rose-500 transition flex items-center gap-1">
            <ChevronLeftIcon className="w-4 h-4" />
            Accueil
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{category.name}</span>
        </div>

        {/* En-tête catégorie */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mt-2 max-w-xl">{category.description}</p>
          )}
        </div>

        {/* Produits */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          }
        >
          <ProductsGrid categoryId={id} />
        </Suspense>
      </main>
    </div>
  )
}
