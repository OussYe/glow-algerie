import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import HomeClient from '@/components/client/HomeClient'
import { HeroSection, FooterSection } from '@/components/client/HeroSection'
import FeaturedSlider from '@/components/client/FeaturedSlider'

export default async function HomePage() {
  const [{ data: categories }, { data: products }, { data: featured }] =
    await Promise.all([
      supabase.from('categories').select('*').order('created_at', { ascending: true }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('featured', true).order('created_at', { ascending: false }),
    ])

  const featuredList = featured ?? []

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories || []} />

      {/* Show featured slider if at least one product is featured, otherwise fallback hero */}
      {featuredList.length > 0
        ? <FeaturedSlider products={featuredList} />
        : <HeroSection />
      }

      <HomeClient
        categories={categories || []}
        products={products || []}
      />
      <FooterSection />
    </div>
  )
}
