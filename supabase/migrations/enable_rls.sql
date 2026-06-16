-- Supabase SQL Editor Script: Enable Row Level Security & Access Policies
-- Run this entire script inside your Supabase SQL Editor (https://supabase.com/dashboard/project/_/editor)

-- 1. Enable RLS on core tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any existing policies to prevent naming collisions
DROP POLICY IF EXISTS "Users see own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can select own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can select products" ON public.products;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;

-- 3. Create Orders Policies (Users only see/create their own orders; admin has full access)
CREATE POLICY "Users see own orders"
ON public.orders FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

-- Admin can manage all orders (using profiles check or email metadata)
CREATE POLICY "Admin can manage all orders"
ON public.orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
  )
  OR auth.jwt()->>'email' = 'abdulquader057@gmail.com'
);

-- 4. Create Products Policies (Anyone can view products, only admin can modify)
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Admin can manage products"
ON public.products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
  )
  OR auth.jwt()->>'email' = 'abdulquader057@gmail.com'
);
