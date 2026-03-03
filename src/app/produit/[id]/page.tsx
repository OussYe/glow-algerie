import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import ProductDetailClient from '@/components/client/ProductDetailClient'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/client/Breadcrumb'

type Props = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(name, id, name_ar)').eq('id', id).single(),
    supabase.from('categories').select('*').order('created_at', { ascending: true }),
  ])

  if (!product) notFound()

  const category = (product as {
    categories?: { name: string; id: string; name_ar?: string | null }
  }).categories

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories || []} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb
          label={product.title}
          labelAr={product.title_ar}
          middle={category ? {
            href: `/categorie/${category.id}`,
            name: category.name,
            nameAr: category.name_ar,
          } : undefined}
        />
        <ProductDetailClient product={product} pixelId={product.pixel_id} />
      </main>
    </div>
  )
}
