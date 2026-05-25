"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import MagneticWrapper from "@/components/MagneticWrapper";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-16 mb-24">
        <div className="max-w-2xl">
          <MotionItem animation="slideUp">
            <span className="text-[10px] font-sora text-rose-gold uppercase tracking-[0.4em] block mb-6">
              Season 2027
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-cormorant font-light tracking-tighter leading-[0.8] mb-8">
              The <br /><span className="italic text-white/50">Archive</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base font-sora tracking-wide max-w-lg leading-relaxed">
              Synthesized by LUXE Intelligence. Engineered for the future. Explore the global digital wardrobe of rare artifacts.
            </p>
          </MotionItem>
        </div>

        <MotionItem animation="slideLeft" className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          <div className="relative group w-full sm:w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-gold transition-colors" size={18} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Search Artifacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-bg-surface border border-white/5 rounded-full py-5 pl-16 pr-8 text-[11px] font-sora tracking-[0.2em] focus:outline-none focus:border-rose-gold/50 w-full transition-all text-white placeholder-white/20"
            />
          </div>
          <MagneticWrapper>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-8 py-5 rounded-full flex items-center justify-center gap-4 text-[10px] font-sora uppercase tracking-[0.3em] transition-all duration-500 border whitespace-nowrap",
                isFilterOpen ? "border-rose-gold text-rose-gold bg-rose-gold/5" : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
              )}
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} /> Filters
            </button>
          </MagneticWrapper>
        </MotionItem>
      </div>

      {/* Categories Bar */}
      <MotionItem animation="fade" className="mb-16 flex items-center gap-8 overflow-x-auto no-scrollbar pb-8 border-b border-white/5">
        {categories.map((cat) => (
          <MagneticWrapper key={cat.id}>
            <button
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "whitespace-nowrap pb-2 text-[10px] font-sora uppercase tracking-[0.25em] transition-all duration-500 border-b border-transparent",
                selectedCategory === cat.id 
                  ? "text-rose-gold border-rose-gold" 
                  : "text-white/40 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          </MagneticWrapper>
        ))}
      </MotionItem>

      {/* Cinematic Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.15, 1] }}
            className="overflow-hidden mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-12 px-12 bg-bg-surface border border-white/5">
              <div className="space-y-8">
                <h4 className="text-[9px] font-sora tracking-[0.4em] text-white/30 uppercase border-b border-white/5 pb-4">Sort Protocol</h4>
                <div className="flex flex-col gap-5">
                  {["Latest Synchronization", "Valuation: Ascending", "Valuation: Descending", "Neural Trending"].map((s) => (
                    <button key={s} className="text-left text-[11px] font-sora text-white/50 hover:text-rose-gold transition-colors uppercase tracking-[0.2em]">{s}</button>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="h-full bg-bg-base border border-rose-gold/10 p-10 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
                     <Sparkles size={120} className="text-rose-gold" strokeWidth={0.5} />
                  </div>
                  
                  <div className="relative z-10 mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-gold animate-pulse" />
                      <h4 className="text-sm font-sora tracking-[0.3em] uppercase text-rose-gold">Neural Synthesis</h4>
                    </div>
                    <p className="text-2xl font-cormorant font-light tracking-wide text-white/70 max-w-lg leading-relaxed">
                      Let LUXE intelligence synthesize your perfect match based on biometric intent and aesthetic history.
                    </p>
                  </div>
                  
                  <div className="relative z-10">
                    <MagneticWrapper>
                      <button className="px-8 py-4 border border-rose-gold text-rose-gold font-sora text-[10px] tracking-[0.3em] uppercase hover:bg-rose-gold hover:text-bg-base transition-all duration-500">
                        Initialize Engine
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry Product Grid */}
      <div className="min-h-[50vh]">
        {filteredProducts.length > 0 ? (
          <MotionContainer 
            animation="stagger" 
            staggerChildren={0.1} 
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8"
          >
            {filteredProducts.map((p, idx) => (
              <div key={p.id} className="break-inside-avoid">
                <ProductCard product={p} index={idx} />
              </div>
            ))}
          </MotionContainer>
        ) : (
          <div className="text-center py-40 border border-white/5 bg-bg-surface">
            <h3 className="text-3xl md:text-5xl font-cormorant font-light text-white/30 mb-8">No artifacts found.</h3>
            <button 
              onClick={() => {setSelectedCategory("all"); setSearchQuery("");}}
              className="text-[10px] font-sora tracking-[0.3em] text-rose-gold hover:text-white uppercase transition-colors"
            >
              Reset Protocol
            </button>
          </div>
        )}
      </div>

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
    <main className="min-h-screen pt-24 bg-bg-base">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-base">
          <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 border border-white/10 border-t-rose-gold rounded-full animate-spin" />
             <p className="text-[10px] font-sora tracking-[0.5em] text-rose-gold animate-pulse uppercase">Syncing Archive...</p>
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
