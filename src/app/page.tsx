"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
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

// Mock products for the homepage
const neuralPicks = [
  {
    id: "prod-1",
    name: "AERO-WEAVE COMBAT JACKET",
    description: "Adaptive thermal regulation with nano-fiber mesh.",
    price: 890,
    images: ["/hero-1.jpg"],
    category: "STREETWEAR",
    isNew: true,
  },
  {
    id: "prod-2",
    name: "OBSIDIAN TECH-HOODIE",
    description: "Vantablack absorption fabric. Neural weave.",
    price: 450,
    images: ["/hero-2.jpg"],
    category: "MODEST TECH",
    isNew: false,
  },
  {
    id: "prod-3",
    name: "QUANTUM RUNNERS V2",
    description: "Kinetic energy displacement soles.",
    price: 320,
    images: ["/hero-3.jpg"],
    category: "SNEAKERS",
    isNew: true,
  },
  {
    id: "prod-4",
    name: "SYNTH-LEATHER TRENCH",
    description: "Waterproof, breathable lab-grown leather.",
    price: 1200,
    images: ["/hero-4.jpg"],
    category: "LUXURY",
    isNew: true,
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL COLLECTIONS");

  return (
    <div className="px-6 md:px-8 w-full max-w-[1600px] mx-auto">
      <Hero />

      {/* Search and Filters Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-10 w-full">
        {/* Search Bar */}
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#00F0FF]" />
          </div>
          <input 
            type="text" 
            placeholder="Search neural base..." 
            className="w-full bg-[#050508] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white text-[11px] font-sora tracking-wide focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          />
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
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-sora font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === filter 
                    ? "bg-[#00F0FF]/10 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                    : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEURAL PICKS Grid */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={20} className="text-[#B52BFF]" />
          <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">NEURAL PICKS FOR YOU</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#B52BFF]/30 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {neuralPicks.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
