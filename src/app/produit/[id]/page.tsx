import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import ProductDetailClient from '@/components/client/ProductDetailClient'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, id)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const category = (product as { categories?: { name: string; id: string } }).categories

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-rose-500 transition">Accueil</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/categorie/${category.id}`} className="hover:text-rose-500 transition flex items-center gap-1">
                <ChevronLeftIcon className="w-4 h-4" />
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 font-medium line-clamp-1">{product.title}</span>
        </div>

        <ProductDetailClient product={product} />
      </main>
    </div>
  )
}
