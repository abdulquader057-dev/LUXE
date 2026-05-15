"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import { Magnetic } from "@/components/ui/Magnetic";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: "all", name: "ALL COLLECTIONS" },
    { id: "modest-wear", name: "MODEST TECH" },
    { id: "sneakers", name: "SNEAKERS" },
    { id: "watches", name: "WATCHES" },
    { id: "accessories", name: "ACCESSORIES" },
    { id: "mixed-fashion", name: "STREETWEAR" },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-2xl">
          <MotionItem animation="slideUp">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              THE <br /><span className="text-gradient">ARCHIVE.</span>
            </h1>
            <p className="text-white/40 text-xl font-medium tracking-wide max-w-lg">
              Synthesized by ZYRA Intelligence. Engineered for the future. Explore the global digital wardrobe.
            </p>
          </MotionItem>
        </div>

        <MotionItem animation="slideLeft" className="flex flex-wrap gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="SEARCH NEURAL BASE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-8 text-[11px] font-black tracking-widest focus:outline-none focus:border-primary/50 w-full md:w-96 transition-all"
            />
          </div>
          <Magnetic>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-8 py-6 glass rounded-[24px] flex items-center gap-4 text-[11px] font-black tracking-widest transition-all border",
                isFilterOpen ? "border-primary text-primary" : "border-white/10 text-white/40 hover:text-white"
              )}
            >
              <SlidersHorizontal size={20} /> FILTERS
            </button>
          </Magnetic>
        </MotionItem>
      </div>

      {/* Categories Pulse Bar */}
      <MotionItem animation="fade" className="mt-20 flex items-center gap-6 overflow-x-auto no-scrollbar pb-6 border-b border-white/5">
        {categories.map((cat) => (
          <Magnetic key={cat.id}>
            <button
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-8 py-3 rounded-full text-[11px] font-black tracking-[0.3em] transition-all border uppercase",
                selectedCategory === cat.id 
                  ? "bg-white text-black border-white shadow-xl shadow-white/5" 
                  : "text-white/30 hover:text-white border-white/5 hover:border-white/20"
              )}
            >
              {cat.name}
            </button>
          </Magnetic>
        ))}
      </MotionItem>

      {/* Filter Drawer (Cinematic) */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-b border-white/5">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Sort Parameters</h4>
                <div className="flex flex-col gap-4">
                  {["Latest Sync", "Value: Low - High", "Value: High - Low", "Neural Trending"].map((s) => (
                    <button key={s} className="text-left text-xs font-black text-white/40 hover:text-primary transition-all uppercase tracking-widest">{s}</button>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="glass-3 !rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                     <Sparkles size={60} className="text-primary" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles size={20} className="text-primary animate-pulse" />
                      <h4 className="text-lg font-black tracking-tighter uppercase">AI Neural Filtering</h4>
                    </div>
                    <p className="text-xs text-white/40 font-medium tracking-widest uppercase leading-relaxed max-w-md">Let ZYRA synthesize your perfect match based on biometric intent and aesthetic history.</p>
                  </div>
                  <Magnetic>
                    <button className="px-12 py-5 bg-primary text-black rounded-[20px] font-black tracking-widest text-[10px] uppercase hover:bg-white transition-all shadow-[0_0_40px_rgba(0,242,255,0.3)]">
                      INITIALIZE ZYRA
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid - Cinematic Reveal */}
      <div className="py-32">
        {filteredProducts.length > 0 ? (
          <MotionContainer animation="stagger" staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
            {filteredProducts.map((p) => (
              <MotionItem key={p.id} animation="scale">
                <ProductCard product={p} />
              </MotionItem>
            ))}
          </MotionContainer>
        ) : (
          <div className="text-center py-60">
            <h3 className="text-3xl font-black tracking-tighter text-white/10 uppercase mb-8">No results found in this frequency.</h3>
            <button 
              onClick={() => {setSelectedCategory("all"); setSearchQuery("");}}
              className="text-[10px] font-black tracking-[0.5em] text-primary border-b-[2px] border-primary pb-2 uppercase"
            >
              Reset Frequency
            </button>
          </div>
        )}
      </div>

      {/* Load More Section */}
      <div className="flex flex-col items-center gap-12 py-32 border-t border-white/5">
        <p className="text-[10px] font-black tracking-[0.5em] text-white/10 uppercase italic">
          Synchronized {filteredProducts.length} // Total {MOCK_PRODUCTS.length}
        </p>
        <Magnetic>
          <button className="px-16 py-7 glass border border-white/10 rounded-[28px] text-[11px] font-black tracking-[0.4em] hover:bg-white hover:text-black transition-all uppercase">
            Load More Archive
          </button>
        </Magnetic>
      </div>
    </section>
  );
};

const ShopPage = () => {
  return (
    <main className="min-h-screen pt-24 bg-mesh">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black tracking-[1em] text-primary animate-pulse uppercase">Syncing Archive...</p>
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
