import { supabase } from '@/lib/supabase'
import Header from '@/components/client/Header'
import HomeClient from '@/components/client/HomeClient'
import { HeroSection, FooterSection } from '@/components/client/HeroSection'

export default async function HomePage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('created_at', { ascending: true }),
    supabase.from('products').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <HomeClient
        categories={categories || []}
        products={products || []}
      />
      <FooterSection />
    </div>
  )
}
