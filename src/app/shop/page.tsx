"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, Grid, List, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ShopPage = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

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
    <main className="min-h-screen pt-24 bg-mesh">
      <Navbar />
      
      {/* Header Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
                THE <span className="text-gradient">COLLECTION.</span>
              </h1>
              <p className="text-white/40 text-lg font-medium tracking-wide">
                Synthesized by AI. Engineered for the street. Explore the future of global fashion.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVE..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold tracking-widest focus:outline-none focus:border-primary/50 w-full md:w-80 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-6 py-4 glass rounded-2xl flex items-center gap-3 text-xs font-black tracking-widest transition-all",
                isFilterOpen ? "border-primary text-primary" : "border-white/10 text-white/60 hover:text-white"
              )}
            >
              <SlidersHorizontal size={18} /> FILTERS
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-16 flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] transition-all",
                selectedCategory === cat.id 
                  ? "bg-white text-black" 
                  : "text-white/40 hover:text-white border border-white/5 hover:border-white/20"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Drawer (Mini) */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-white/5">
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Sort By</h4>
                  <div className="flex flex-col gap-2">
                    {["Newest", "Price: Low to High", "Price: High to Low", "Trending"].map((s) => (
                      <button key={s} className="text-left text-xs font-bold text-white/60 hover:text-primary transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Price Range</h4>
                  <div className="px-2">
                    <div className="h-1.5 w-full bg-white/5 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 right-0 bg-primary/40 rounded-full" />
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-primary" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-primary" />
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-black text-white/40 tracking-widest">
                      <span>₹0</span>
                      <span>₹50,000+</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black tracking-tight mb-1 flex items-center gap-2">
                        <Sparkles size={16} className="text-primary" /> AI SMART FILTERS
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Let Zyra find your perfect match based on recent activity.</p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black tracking-widest hover:scale-105 transition-transform">
                      ACTIVATE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="py-20">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <h3 className="text-2xl font-black tracking-tighter text-white/20 uppercase mb-4">No products found in this dimension.</h3>
              <button 
                onClick={() => {setSelectedCategory("all"); setSearchQuery("");}}
                className="text-xs font-bold tracking-widest text-primary border-b border-primary pb-1"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>

        {/* Pagination Teaser */}
        <div className="flex flex-col items-center gap-8 py-20 border-t border-white/5">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} items</p>
          <button className="px-10 py-4 glass border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-white hover:text-black transition-all">
            LOAD MORE ARCHIVES
          </button>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </main>
  );
};

export default ShopPage;
