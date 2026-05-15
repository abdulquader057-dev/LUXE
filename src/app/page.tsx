"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Activity, Zap, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import { Magnetic } from "@/components/ui/Magnetic";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { LuxeIntro } from "@/components/LuxeIntro";

const CATEGORIES = [
  { id: "all", label: "ALL ARTIFACTS" },
  { id: "streetwear", label: "STREETWEAR" },
  { id: "modest-wear", label: "MODEST WEAR" },
  { id: "sneakers", label: "SNEAKERS" },
  { id: "watches", label: "WATCHES" },
  { id: "accessories", label: "ACCESSORIES" },
];

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(MOCK_PRODUCTS);
    } else {
      setFilteredProducts(MOCK_PRODUCTS.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <main className="relative min-h-screen bg-transparent">
      {!introComplete && <LuxeIntro onComplete={() => setIntroComplete(true)} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Navbar />
        
        {/* ═══ 01. HERO — Cinematic Dimension ═══ */}
        <Hero />

      {/* ═══ 02. CATEGORY ECOSYSTEM — Floating Filter Bar ═══ */}
      <section className="sticky top-24 z-40 py-8 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-2 rounded-full bg-surface/40 backdrop-blur-3xl border border-white/5 pointer-events-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="relative px-6 py-2.5 rounded-full overflow-hidden group transition-all duration-500"
                >
                  {/* Shimmer Sweep Effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="cat-active"
                      className="absolute inset-0 bg-primary shadow-[0_0_20px_rgba(0,245,212,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className={itemStyle(activeCategory === cat.id)}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 03. THE ECOSYSTEM — Asymmetric Product Grid ═══ */}
      <section className="py-32 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-16">
          <MotionContainer>
            <MotionItem className="mb-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-tech font-bold tracking-[0.5em] text-primary uppercase">
                  Current Inventory Manifest
                </span>
              </div>
              <h2 className="text-[clamp(3rem,8vw,120px)] font-display font-black tracking-tighter leading-[0.8] text-white">
                THE<br />
                <span className="text-gradient">ECOSYSTEM.</span>
              </h2>
            </MotionItem>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={idx % 5 === 0 ? "md:mt-24" : idx % 3 === 0 ? "lg:mt-12" : ""}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </MotionContainer>
        </div>
      </section>

      {/* ═══ 04. AI INTEGRATION — ZYRA PROMPT ═══ */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <BrainCircuit size={16} className="text-primary" />
                <span className="text-[10px] font-tech font-bold tracking-[0.3em] text-white/60 uppercase">
                  Neural Styling Core
                </span>
              </div>
              <h3 className="text-6xl lg:text-8xl font-display font-black tracking-tighter leading-[0.85] text-white mb-10">
                AI NATIVE<br />
                <span className="text-white/20">CURATION.</span>
              </h3>
              <p className="text-xl text-muted font-nav leading-relaxed max-w-lg mb-12">
                Our neural engines analyze your aesthetic DNA to synthesize the perfect wardrobe architecture. No more searching. Just discovery.
              </p>
              <Magnetic>
                <Link href="/ai-style" className="inline-flex items-center gap-6 group">
                  <span className="text-xs font-nav font-bold tracking-[0.4em] uppercase text-white group-hover:text-primary transition-colors">
                    INITIALIZE ZYRA
                  </span>
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Magnetic>
            </div>
            
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[40px] blur-3xl" />
              <div className="relative h-full rounded-[40px] border border-white/10 bg-surface/40 backdrop-blur-3xl overflow-hidden p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Zap size={24} className="text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-tech text-white/40 tracking-widest uppercase mb-1">Status</div>
                    <div className="text-xs font-tech text-primary tracking-widest uppercase">Sync Active</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-sm font-nav text-white/60 leading-relaxed italic">
                      "Zyra, synthesize a tactical look for a high-density urban environment, temperature 14°C, 80% humidity."
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 ml-12">
                    <p className="text-sm font-nav text-white leading-relaxed">
                      "Understood. Accessing The Archive. Compiling layering systems with Aero-Tech membrane..."
                    </p>
                  </div>
                </div>
                
                <button className="w-full py-4 rounded-xl bg-white text-black font-nav font-bold tracking-[0.2em] uppercase text-xs hover:bg-primary transition-colors">
                  Generate Aesthetic
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05. FOOTER CALL TO ACTION ═══ */}
      <section className="py-48 text-center relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl lg:text-9xl font-display font-black tracking-tighter leading-none text-white mb-16">
            JOIN THE<br />
            <span className="text-gradient">VANGUARD.</span>
          </h2>
          <Magnetic>
            <button className="px-16 py-8 rounded-full bg-white text-black font-nav font-bold tracking-[0.5em] uppercase text-sm hover:bg-primary transition-all duration-500 hover:scale-105">
              Enter The Dimension
            </button>
          </Magnetic>
        </div>
      </section>
      </motion.div>
    </main>
  );
}

const itemStyle = (isActive: boolean) => cn(
  "relative z-10 text-[11px] font-tech font-bold tracking-[0.4em] uppercase transition-colors duration-500",
  isActive ? "text-black" : "text-white/40 group-hover:text-white"
);
