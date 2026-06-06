"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import ProductCard from "@/components/shop/ProductCard";
import { supabase } from "@/lib/supabase";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MagneticWrapper from "@/components/MagneticWrapper";

const ShopContent = () => {
  const [dbProducts, setDbProducts] = React.useState<any[]>(MOCK_PRODUCTS);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          const hasLuxe = data.some(p => p.id.toLowerCase().includes("luxe"));
          if (hasLuxe) {
            setDbProducts(data);
          }
        }
      } catch (err) {
        console.warn("Using offline catalog fallback:", err);
      }
    }
    fetchProducts();
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = searchParams?.get("category") || searchParams?.get("cat") || "all";
  const initialSearch = searchParams?.get("q") || "";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync state when URL changes
  useEffect(() => {
    const cat = searchParams?.get("category") || searchParams?.get("cat");
    if (cat) setSelectedCategory(cat);
    
    const q = searchParams?.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const categories = [
    { id: "all", name: "All Designs" },
    { id: "white", name: "White Shirts" },
    { id: "pastel", name: "Pastel Shirts" },
    { id: "dark", name: "Dark Shirts" },
  ];

  const filteredProducts = dbProducts.filter((p) => {
    let matchesCategory = false;
    if (selectedCategory === "all") {
      matchesCategory = true;
    } else {
      const selCat = selectedCategory.toLowerCase();
      
      if (selCat === "white") {
        matchesCategory = p.name.toLowerCase().includes("white") || p.description.toLowerCase().includes("white");
      } else if (selCat === "pastel") {
        matchesCategory = p.name.toLowerCase().includes("blue") || 
                          p.name.toLowerCase().includes("sand") || 
                          p.name.toLowerCase().includes("green") || 
                          p.name.toLowerCase().includes("pink") ||
                          p.description.toLowerCase().includes("blue") || 
                          p.description.toLowerCase().includes("sand") || 
                          p.description.toLowerCase().includes("green") || 
                          p.description.toLowerCase().includes("pink");
      } else if (selCat === "dark") {
        matchesCategory = p.name.toLowerCase().includes("navy") || 
                          p.name.toLowerCase().includes("black") || 
                          p.name.toLowerCase().includes("brown") ||
                          p.description.toLowerCase().includes("navy") || 
                          p.description.toLowerCase().includes("black") || 
                          p.description.toLowerCase().includes("brown");
      } else {
        matchesCategory = p.category?.toLowerCase() === selCat;
      }
    }

    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      {/* Header Area */}
      <div className="flex flex-col items-center text-center justify-center gap-8 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className="text-[10px] font-sora text-rose-gold uppercase tracking-[0.4em] block mb-6">
            Season 2027
          </span>
          <h1 className="text-6xl md:text-[7rem] lg:text-[9rem] font-cormorant font-light tracking-tighter leading-[0.8] mb-8">
            The <span className="italic text-white/50">Archive</span>
          </h1>
        </motion.div>

        {/* Search Overlay Layer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="relative group w-full max-w-sm"
        >
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-gold transition-colors" size={16} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Search Artifacts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-bg-surface/50 backdrop-blur-md border border-white/5 rounded-full py-4 pl-16 pr-8 text-[10px] font-sora tracking-[0.2em] focus:outline-none focus:border-rose-gold/50 w-full transition-all text-white placeholder-white/20 text-center"
          />
        </motion.div>
      </div>

      {/* Floating Control Tags (Zero-Shift Philosophy) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="flex items-center justify-center flex-wrap gap-4 mb-24 max-w-3xl mx-auto"
      >
        {categories.map((cat) => (
          <MagneticWrapper key={cat.id}>
            <button
              onClick={() => {
                setSelectedCategory(cat.id);
                router.push(`/shop?cat=${cat.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`);
              }}
              className={cn(
                "glass-pill px-6 py-3 text-[9px] font-sora uppercase tracking-[0.3em] transition-all duration-700 ease-[0.25,1,0.5,1]",
                selectedCategory === cat.id 
                  ? "text-rose-gold-light bg-rose-gold/10 border-rose-gold/30 shadow-[0_0_20px_rgba(224,191,184,0.15)] scale-105" 
                  : "text-white/40 hover:text-white border-white/5 hover:border-white/10 hover:bg-white/5"
              )}
            >
              {cat.name}
            </button>
          </MagneticWrapper>
        ))}
      </motion.div>

      {/* Product Grid (FLIP Smooth Height Interpolation) */}
      <motion.div 
        layout
        className="relative min-h-[60vh]"
      >
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
              <motion.div 
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="product-grid"
            >
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  layout 
                  key={p.id} 
                  className="flex flex-col min-h-[500px]" // Stable aspect ratios, stretch to fit
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center py-40 border border-white/5 bg-bg-surface/30 backdrop-blur-md rounded-2xl"
            >
              <h3 className="text-3xl md:text-5xl font-cormorant font-light text-white/30 mb-8">No artifacts found.</h3>
              <button 
                onClick={() => {setSelectedCategory("all"); setSearchQuery("");}}
                className="text-[10px] font-sora tracking-[0.3em] text-rose-gold hover:text-white uppercase transition-colors"
              >
                Reset Protocol
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination / Load More */}
      <div className="flex flex-col items-center justify-center gap-8 py-32 mt-16">
        <p className="text-[9px] font-sora tracking-[0.4em] text-white/30 uppercase">
          Displaying {filteredProducts.length} of {dbProducts.length}
        </p>
        <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
};

const ShopPage = () => {
  return (
    <main className="min-h-screen pt-24 bg-bg-base relative overflow-hidden">
      {/* Background Obsidian Texture & Fog Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-gold/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>


      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center relative z-10 pt-24">
          <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 border border-white/5 border-t-rose-gold/50 rounded-full animate-spin" />
             <p className="text-[9px] font-sora tracking-[0.5em] text-rose-gold/50 uppercase">Syncing Archive...</p>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      

    </main>
  );
};

export default ShopPage;

