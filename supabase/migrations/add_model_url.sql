-- Add model_url column to products table for R3F GLB model support
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS model_url text DEFAULT NULL;

-- Index for quick lookup of products that have 3D models
CREATE INDEX IF NOT EXISTS idx_products_model_url ON public.products(model_url) WHERE model_url IS NOT NULL;

COMMENT ON COLUMN public.products.model_url IS 
  'Optional URL to a GLB/GLTF 3D model file in Supabase storage. When present, ProductViewer3DReal is shown instead of the 2D turntable.';
