import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import ProductCard from '@/components/client/ProductCard'
import { FooterSection } from '@/components/client/HeroSection'
import { ProductSkeleton } from '@/components/ui/LoadingSkeleton'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/client/Breadcrumb'
import CategoryHeader from '@/components/client/CategoryHeader'
import ProductsEmptyState from '@/components/client/ProductsEmptyState'

type Props = { params: Promise<{ id: string }> }

async function ProductsGrid({ categoryId }: { categoryId: string }) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) return <ProductsEmptyState type="error" />
  if (!products || products.length === 0) return <ProductsEmptyState type="empty" />

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params

  const [{ data: category }, { data: categories }] = await Promise.all([
    supabase.from('categories').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('created_at', { ascending: true }),
  ])

  if (!category) notFound()

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories || []} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          label={category.name}
          labelAr={category.name_ar}
        />

        <CategoryHeader
          nameFr={category.name}
          nameAr={category.name_ar}
          descriptionFr={category.description}
          descriptionAr={category.description_ar}
        />

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

      <FooterSection />
    </div>
  )
}
