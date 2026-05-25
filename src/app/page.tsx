"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "1",
    name: "CYBER-LACE HOODIE",
    price: 450,
    originalPrice: 580,
    image: "/hero-1.jpg",
    category: "Upper",
    momentum: 24,
    rarity: "ULTRA RARE" as const,
  },
  {
    id: "2",
    name: "NEURAL GRID RUNNER",
    price: 890,
    image: "/hero-2.jpg",
    category: "Footwear",
    momentum: 18,
    rarity: "EXCLUSIVE" as const,
  },
  {
    id: "3",
    name: "VOID-TECH CARGO",
    price: 620,
    image: "/hero-3.jpg",
    category: "Lower",
    rarity: "LIMITED" as const,
  },
  {
    id: "4",
    name: "ORBITAL SHELL V2",
    price: 1200,
    originalPrice: 1500,
    image: "/hero-4.jpg",
    category: "Outerwear",
    momentum: 42,
    rarity: "ULTRA RARE" as const,
  },
];

const categories = [
  { id: "all", label: "All DNA" },
  { id: "Upper", label: "Uppers" },
  { id: "Lower", label: "Lowers" },
  { id: "Footwear", label: "Footwear" },
  { id: "Outerwear", label: "Outerwear" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />

      <motion.section 
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-6 py-24"
      >
        {/* CATEGORY CHIPS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20 relative z-brand">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + (i * 0.07), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-8 py-3 rounded-full font-rajdhani text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group overflow-hidden clickable",
                activeCategory === cat.id 
                  ? "text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                  : "text-white/40 glass-standard border-white/5 hover:text-white hover:border-accent-cyan/50"
              )}
            >
              <span className="relative z-10">{cat.label}</span>
              {activeCategory !== cat.id && (
                <motion.div 
                  className="absolute inset-0 bg-accent-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-brand">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {/* NEURAL FOOTER TAG */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 text-center"
        >
          <span className="text-[10px] font-orbitron text-accent-cyan/40 tracking-[0.8em] uppercase">
            End of Neural Sequence // 0x4F2A
          </span>
        </motion.div>
      </motion.section>
    </main>
  );
}
