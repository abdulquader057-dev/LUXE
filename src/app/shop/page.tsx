"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MagneticWrapper from "@/components/MagneticWrapper";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "Complete Archive" },
    { id: "Upper", name: "Uppers" },
    { id: "Lower", name: "Lowers" },
    { id: "Footwear", name: "Footwear" },
    { id: "Outerwear", name: "Outerwear" },
    { id: "accessories", name: "Hardware" },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory || (p.category.toLowerCase() === selectedCategory.toLowerCase());
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
              onClick={() => setSelectedCategory(cat.id)}
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
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  layout 
                  key={p.id} 
                  className="h-[500px]" // Strict height for zero-shift stability
                >
                  <ProductCard product={p} index={idx} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
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
          Displaying {filteredProducts.length} of {MOCK_PRODUCTS.length}
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

      <Navbar />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 border border-white/5 border-t-rose-gold/50 rounded-full animate-spin" />
             <p className="text-[9px] font-sora tracking-[0.5em] text-rose-gold/50 uppercase">Syncing Archive...</p>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      
      <Footer />
      <AIChatbot />
    </main>
  );
};

export default ShopPage;
