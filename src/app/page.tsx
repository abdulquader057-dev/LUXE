"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";

const filters = [
  "ALL COLLECTIONS",
  "MODEST TECH",
  "SNEAKERS",
  "WATCHES",
  "ACCESSORIES",
  "STREETWEAR",
  "LUXURY"
];

import { supabase } from "@/lib/supabase";
import { MOCK_PRODUCTS } from "@/data/products";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL COLLECTIONS");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        setProducts(MOCK_PRODUCTS);
      }
    }
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter !== "ALL COLLECTIONS") {
      router.push(`/shop?cat=${encodeURIComponent(filter)}`);
    } else {
      router.push(`/shop`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <Hero />

      {/* Search and Filters Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-10 w-full">
        {/* Search Bar */}
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <form onSubmit={handleSearch} className="w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/50" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-[#0A0A0C] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white text-[11px] font-sora tracking-wide focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            />
          </form>
          <button className="absolute inset-y-1 right-1 px-4 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/5 transition-colors">
            <SlidersHorizontal size={14} className="text-white/70" />
            <span className="ml-2 text-[9px] font-sora tracking-widest text-white/70">FILTERS</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          <div className="flex items-center gap-3 w-max">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-sora font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === filter 
                    ? "bg-white/10 border-white/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                    : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RECOMMENDED PICKS Grid */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={20} className="text-white/70" />
          <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">RECOMMENDED FOR YOU</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * i), duration: 1.2, ease: "easeOut" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

