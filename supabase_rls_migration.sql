-- LUXE OS: Supabase Database RLS & Schema Migration Script
-- Run this entire script in your Supabase SQL Editor to apply security rules and tables!

-- 1. Create Style DNA / XP Table with Explicit Foreign Key Reference
CREATE TABLE IF NOT EXISTS public.style_dna (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  badges jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Drop Gates Table
CREATE TABLE IF NOT EXISTS public.drop_gates (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  required_xp_level integer DEFAULT 1,
  unlock_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) on all target tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drop_gates ENABLE ROW LEVEL SECURITY;

-- 4. Clean up existing/legacy policies to prevent overlaps
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can select own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can select own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can select own style dna" ON public.style_dna;
DROP POLICY IF EXISTS "Users can update own style dna" ON public.style_dna;
DROP POLICY IF EXISTS "Users can insert own style dna" ON public.style_dna;
DROP POLICY IF EXISTS "Admin can manage all style dna" ON public.style_dna;
DROP POLICY IF EXISTS "Anyone can view drop gates" ON public.drop_gates;
DROP POLICY IF EXISTS "Admin can manage drop gates" ON public.drop_gates;
DROP POLICY IF EXISTS "Authenticated users can select products" ON public.products;

-- 5. Define Profiles Policies (Dynamic Role-based Admin checks, no hardcoded emails)
CREATE POLICY "Users can select own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles" ON public.profiles 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 6. Define Orders Policies
CREATE POLICY "Users can select own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

CREATE POLICY "Admin can manage all orders" ON public.orders 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 7. Define Style DNA / XP Policies (Allows INSERT on signup onboarding)
CREATE POLICY "Users can select own style dna" ON public.style_dna 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own style dna" ON public.style_dna 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own style dna" ON public.style_dna 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can manage all style dna" ON public.style_dna 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 8. Define Products (Catalog) Policies
CREATE POLICY "Authenticated users can select products" ON public.products 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage products" ON public.products 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 9. Define Drop Gates Policies
CREATE POLICY "Anyone can view drop gates" ON public.drop_gates 
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage drop gates" ON public.drop_gates 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 10. Performance Indexes for Scaling Optimization
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_drop_gates_product_id ON public.drop_gates(product_id);
CREATE INDEX IF NOT EXISTS idx_style_dna_level ON public.style_dna(level);
