"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  LayoutGrid, 
  BrainCircuit, 
  Smartphone,
  Globe,
  ShoppingCart
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { LuxeIntro } from "@/components/LuxeIntro";
import { CinematicAtmosphere } from "@/components/CinematicAtmosphere";
import { MotionContainer } from "@/components/animations/MotionContainer";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "ALL COLLECTIONS" },
  { id: "cyber", label: "CYBERCORE" },
  { id: "tech", label: "TECHWEAR" },
  { id: "minimal", label: "MINIMALIST" },
  { id: "limited", label: "LIMITED DROP" }
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const itemStyle = (isActive: boolean) => `
    relative z-10 text-[10px] md:text-[11px] font-tech font-bold tracking-[0.3em] uppercase transition-colors duration-500
    ${isActive ? "text-black" : "text-white/40 group-hover:text-white"}
  `;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-primary">
      <CinematicAtmosphere />
      
      <AnimatePresence mode="wait">
        {showIntro ? (
          <LuxeIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            >
              <Navbar />
            </motion.div>
            
            <main className="pt-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              >
                <Hero />
              </motion.div>
              
              {/* Product Explorer */}
              <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Category Filter */}
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex overflow-x-auto no-scrollbar gap-4 mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center"
                >
                  <div className="inline-flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-full bg-surface/40 backdrop-blur-3xl border border-white/5 pointer-events-auto">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="relative px-4 md:px-6 py-2 md:py-2.5 rounded-full overflow-hidden group transition-all duration-500 whitespace-nowrap"
                      >
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
                </motion.div>

                {/* Grid */}
                <MotionContainer>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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

              {/* AI Integration Section */}
              <section className="py-24 md:py-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
                <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
                  <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div>
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <BrainCircuit size={16} className="text-primary" />
                        <span className="text-[9px] md:text-[10px] font-tech font-bold tracking-[0.3em] text-white/60 uppercase">
                          LUXE Neural Core
                        </span>
                      </div>
                      <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter text-white mb-8 leading-[0.9]">
                        FASHION <br/> <span className="text-primary italic">INTELLIGENCE</span>
                      </h2>
                      <p className="text-lg text-white/40 leading-relaxed mb-12 max-w-xl">
                        Our AI engine analyzes your aesthetic footprint to generate personalized 3D silhouettes. 
                        Experience clothing that evolves with your identity.
                      </p>
                      <button className="group relative px-10 py-5 bg-white text-black font-nav font-bold tracking-[0.3em] uppercase overflow-hidden">
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:text-black transition-colors">Launch Stylist</span>
                      </button>
                    </div>
                    <div className="relative aspect-square">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[40px] animate-pulse" />
                      <div className="absolute inset-4 glass-panel !rounded-[32px] border-white/10 overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80"
                          alt="AI Fashion"
                          fill
                          className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-1 bg-primary" />
                            <span className="text-[10px] font-tech text-white/60 uppercase tracking-[0.5em]">Scanning Environment</span>
                          </div>
                          <div className="flex gap-2">
                             {[1,2,3,4,5].map(i => (
                               <div key={i} className="flex-1 h-8 bg-white/5 rounded-sm overflow-hidden">
                                  <motion.div 
                                    animate={{ height: ["10%", "90%", "30%"] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-full bg-primary/40 mt-auto"
                                  />
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Newsletter / Footer Preview */}
              <section className="bg-white text-black py-24 md:py-48 overflow-hidden relative">
                <motion.div 
                  style={{ x: "-10%" }}
                  animate={{ x: "-50%" }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex whitespace-nowrap text-[15vh] md:text-[25vh] font-display font-black leading-none opacity-5 select-none"
                >
                  FUTURE PROOF • BEYOND LUXURY • AI NATIVE • 
                </motion.div>
                <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10 -mt-20 md:-mt-40">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                    <div className="max-w-2xl">
                      <h3 className="text-4xl md:text-8xl font-display font-black tracking-tighter leading-none mb-8">
                        JOIN THE <br/> <span className="text-outline">EMPIRE.</span>
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4">
                        <input 
                          type="email" 
                          placeholder="ENTER NEURAL ID (EMAIL)" 
                          className="flex-1 bg-black/5 border-b-2 border-black/20 p-4 font-tech text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button className="bg-black text-white px-12 py-4 font-nav font-bold tracking-widest uppercase hover:bg-primary hover:text-black transition-all">
                          Connect
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-tech text-[10px] tracking-[0.5em] text-black/40 uppercase mb-4">Version 2.0.4 - Local Node</p>
                       <div className="flex gap-8 justify-end">
                          {["INSTAGRAM", "TWITTER", "DISCORD"].map(s => (
                            <Link key={s} href="#" className="text-[10px] font-black tracking-widest hover:text-primary transition-colors">{s}</Link>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
