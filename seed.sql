-- Seed file for LUXE Products Database
-- Run this script in the Supabase SQL editor to populate public.products with baseline items.

-- Clean up any existing catalog records with matching IDs
DELETE FROM public.products WHERE id IN (
  '00000000-0000-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000003',
  '00000000-0000-4000-a000-000000000004',
  '00000000-0000-4000-a000-000000000005',
  '00000000-0000-4000-a000-000000000006'
);

INSERT INTO public.products (id, name, description, price, stock_quantity, category, image_url, discount_percentage, is_active)
VALUES 
(
  '00000000-0000-4000-a000-000000000001',
  'Luxe Signature Short-Sleeve Linen Shirt',
  '{"text": "Tailored from 100% premium organic flax linen. Designed for ultimate tropical breathability and clean, relaxed luxury drape. Fits true to size.", "colors": ["White", "Desert Sand", "Sunset Pink"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.37.13 PM.jpeg", "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg", "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg"], "ratings": 4.9, "reviewsCount": 142, "offer": "Buy One Get One Free", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.13 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg", "variants": {"White": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.13 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.13 PM.jpeg"}, "Desert Sand": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.24 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg"}, "Sunset Pink": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM.jpeg"}}}}',
  799,
  150,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.37.13 PM.jpeg',
  0,
  true
),
(
  '00000000-0000-4000-a000-000000000002',
  'Luxe Premium Long-Sleeve Knit Polo',
  '{"text": "Premium long-sleeve knit polo shirt crafted from double-mercerized Egyptian cotton. Features a sleek collar line and a signature embroidered logo.", "colors": ["Desert Sand", "Carbon Black"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "/brand/WhatsApp Image 2026-05-26 at 8.37.24 PM.jpeg"], "ratings": 4.8, "reviewsCount": 63, "offer": "Limited First Drop Offer", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.24 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "variants": {"Desert Sand": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.24 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg"}, "Carbon Black": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg"}}}}',
  799,
  95,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg',
  0,
  true
),
(
  '00000000-0000-4000-a000-000000000003',
  'Luxe Signature Cotton Button-Up',
  '{"text": "Crafted from fine-combed cotton fibers with high-density embroidery details. Neatly folded with regular-fit comfort styling.", "colors": ["Carbon Black", "White"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "/brand/WhatsApp Image 2026-05-26 at 8.37.22 PM (2).jpeg"], "ratings": 4.8, "reviewsCount": 82, "offer": "Special Price", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.22 PM (2).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "variants": {"Carbon Black": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.22 PM (2).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg"}, "White": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.37.22 PM (2).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.37.23 PM (1).jpeg"}}}}',
  799,
  130,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.37.21 PM (1).jpeg',
  0,
  true
),
(
  '00000000-0000-4000-a000-000000000004',
  'Luxe Premium Crew-Neck Tee',
  '{"text": "Premium crew-neck t-shirt. Tailored in high-density cotton-lycra blend for unmatched shape retention and soft hand-feel.", "colors": ["White"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg"], "ratings": 4.9, "reviewsCount": 118, "offer": "Buy One Get One Free", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "variants": {"White": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg"}}}}',
  549,
  110,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.41.59 PM (1).jpeg',
  0,
  true
),
(
  '00000000-0000-4000-a000-000000000005',
  'Luxe Tipped Collar Polo',
  '{"text": "Premium pique cotton polo featuring tipped details on collar and cuffs. Adorned with a signature chest logo badge.", "colors": ["Carbon Black"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg", "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM (2).jpeg"], "ratings": 4.7, "reviewsCount": 63, "offer": "Introductory 10% Off", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM (2).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg", "variants": {"Carbon Black": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM (2).jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg"}}}}',
  799,
  85,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.42.00 PM (1).jpeg',
  10,
  true
),
(
  '00000000-0000-4000-a000-000000000006',
  'Luxe Crew-Neck Embossed Tee',
  '{"text": "Embossed brand typography print across chest. Heavyweight soft cotton loopback tee, relaxed comfort fit.", "colors": ["Red"], "sizes": ["M", "L", "XL", "XXL"], "images": ["/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg"], "ratings": 4.8, "reviewsCount": 98, "offer": "Buy One Get One Free", "modelImages": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "variants": {"Red": {"front": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "side": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "back": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg", "original": "/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg"}}}}',
  549,
  120,
  'streetwear',
  '/brand/WhatsApp Image 2026-05-26 at 8.42.01 PM.jpeg',
  0,
  true
);
