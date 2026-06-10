import React, { Suspense } from "react";
import ProductCatalogGrid from "@/components/shop/ProductCatalogGrid";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { parseDbProduct } from "@/data/products";

// Revalidate on every request to show real-time catalog changes
export const revalidate = 0;

async function CatalogLoader() {
  const supabase = await createSupabaseServerClient();
  let products: ReturnType<typeof parseDbProduct>[] = [];
  
  try {
    const { data } = await supabase.from("products").select("*");
    if (data && data.length > 0) {
      const parsed = data.map(parseDbProduct);
      products = parsed.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
    }
  } catch (err) {
    console.error("Error loading products inside Server Component:", err);
  }

  return <ProductCatalogGrid initialProducts={products} />;
}

export default function ShopPage() {
  return (
    <main className="min-h-screen pt-24 bg-bg-base relative overflow-hidden">
      {/* Background Obsidian Texture & Fog Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center relative z-10 pt-24">
          <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 border border-white/5 border-t-[#C9A84C]/50 rounded-full animate-spin" />
             <p className="text-[9px] font-sora tracking-[0.5em] text-[#C9A84C]/50 uppercase">Syncing Archive...</p>
          </div>
        </div>
      }>
        <CatalogLoader />
      </Suspense>
    </main>
  );
}
