import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          name_ar: string | null
          description: string | null
          description_ar: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar?: string | null
          description?: string | null
          description_ar?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string | null
          description?: string | null
          description_ar?: string | null
          image_url?: string | null
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          title: string
          title_ar: string | null
          description: string | null
          description_ar: string | null
          price: number
          discount_percent: number
          images: string[]
          videos: string[]
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          title: string
          title_ar?: string | null
          description?: string | null
          description_ar?: string | null
          price: number
          discount_percent?: number
          images?: string[]
          videos?: string[]
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          title?: string
          title_ar?: string | null
          description?: string | null
          description_ar?: string | null
          price?: number
          discount_percent?: number
          images?: string[]
          videos?: string[]
          in_stock?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          full_name: string
          phone: string
          wilaya: string
          commune: string
          address: string
          notes: string | null
          items: OrderItem[]
          total_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          wilaya: string
          commune: string
          address: string
          notes?: string | null
          items: OrderItem[]
          total_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          status?: string
        }
      }
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

export type OrderItem = {
  product_id: string
  title: string
  price: number
  quantity: number
  image: string
}

export type CartItem = {
  product: Product
  quantity: number
}
