-- LUXE OS: Supabase Database Schema
-- Run this entire script in your Supabase SQL Editor to initialize the database for real data!

-- 1. Create Profiles Table (Stores extra user info like Phone Numbers)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  role text DEFAULT 'customer'::text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table (Full CRUD for Admin)
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock_quantity integer DEFAULT 0,
  category text,
  image_url text,
  discount_percentage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table (For Admin Tracking)
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'processing'::text, -- processing, shipped, delivered, cancelled
  delivery_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Profiles: Users can read/update their own profile. Admin can read all.
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR auth.jwt()->>'email' = 'abdulquader057@gmail.com');
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can view active products. Only Admin can insert/update/delete.
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin can insert products" ON public.products FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'abdulquader057@gmail.com');
CREATE POLICY "Admin can update products" ON public.products FOR UPDATE USING (auth.jwt()->>'email' = 'abdulquader057@gmail.com');
CREATE POLICY "Admin can delete products" ON public.products FOR DELETE USING (auth.jwt()->>'email' = 'abdulquader057@gmail.com');

-- Orders: Users can view their own orders. Admin can view/update all.
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR auth.jwt()->>'email' = 'abdulquader057@gmail.com');
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE USING (auth.jwt()->>'email' = 'abdulquader057@gmail.com');

-- 6. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    CASE WHEN new.email = 'abdulquader057@gmail.com' THEN 'admin' ELSE 'customer' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create Price Drop Alerts Table
CREATE TABLE public.price_drop_alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  target_price numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.price_drop_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for alerts
CREATE POLICY "Anyone can create price drop alerts" ON public.price_drop_alerts FOR INSERT WITH CHECK (true);
-- Only Admin can view alerts
CREATE POLICY "Admin can view price drop alerts" ON public.price_drop_alerts FOR SELECT USING (auth.jwt()->>'email' = 'abdulquader057@gmail.com');
