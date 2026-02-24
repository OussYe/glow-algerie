-- ============================================
-- SCHEMA GLOW ALGERIE E-COMMERCE
-- A exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Table catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table produits
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour catégories et produits
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Insertion publique pour commandes (clients sans compte)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Accès complet pour service_role (admin)
CREATE POLICY "Service role all categories" ON categories USING (auth.role() = 'service_role');
CREATE POLICY "Service role all products" ON products USING (auth.role() = 'service_role');
CREATE POLICY "Service role all orders" ON orders USING (auth.role() = 'service_role');

-- 5. Index pour performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============================================
-- BUCKET STORAGE : à créer manuellement dans
-- Supabase > Storage > New bucket > "products"
-- cocher "Public bucket"
-- ============================================
