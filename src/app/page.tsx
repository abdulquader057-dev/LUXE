"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import { LuxeIntro } from "@/components/LuxeIntro";
import { CinematicAtmosphere } from "@/components/CinematicAtmosphere";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";

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
  const [systemActive, setSystemActive] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      // Trigger System Activation Sequence
      setTimeout(() => setSystemActive(true), 200);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, [showIntro]);

  const filteredProducts = activeCategory === "all" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const itemStyle = (isActive: boolean) => `
    relative z-10 text-[10px] md:text-[11px] font-tech font-bold tracking-[0.3em] uppercase transition-colors duration-500
    ${isActive ? "text-black" : "text-white/40 group-hover:text-white"}
  `;

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <CinematicAtmosphere />
      
      <AnimatePresence mode="wait">
        {showIntro ? (
          <LuxeIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Cinematic Assembly Sequence */}
            <AnimatePresence>
              {systemActive && (
                <>
                  {/* PHASE 1: NAV & HUD */}
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Navbar />
                  </motion.div>

                  {/* PHASE 2: HERO (The Core) */}
                  <motion.div
                    initial={{ scale: 1.2, opacity: 0, filter: "blur(40px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.3, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Hero />
                  </motion.div>

                  {/* PHASE 3: CATEGORIES & FEED */}
                  <main className="pt-20">
                    <div className="container mx-auto px-4 py-12 md:py-20">
                      <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex overflow-x-auto no-scrollbar gap-4 mb-24 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center"
                      >
                        <div className="inline-flex items-center gap-2 p-2 rounded-full bg-surface/20 backdrop-blur-3xl border border-white/5 relative">
                          {/* Floating Tech Accent */}
                          <div className="absolute -top-4 -left-4 text-primary opacity-20">
                            <Cpu size={12} />
                          </div>
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className="relative px-6 py-2.5 rounded-full overflow-hidden group transition-all duration-500 whitespace-nowrap"
                            >
                              {activeCategory === cat.id && (
                                <motion.div
                                  layoutId="cat-active"
                                  className="absolute inset-0 bg-primary shadow-[0_0_30px_rgba(0,245,212,0.5)]"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                                />
                              )}
                              <span className={itemStyle(activeCategory === cat.id)}>
                                {cat.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12">
                        {filteredProducts.map((product, idx) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 1.2 + idx * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className={idx % 5 === 0 ? "md:mt-32" : idx % 3 === 0 ? "lg:mt-16" : ""}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* AI SYNTHESIS SECTION */}
                    <section className="py-40 md:py-80 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,245,212,0.05)_0%,transparent_60%)]" />
                      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
                        <div className="grid lg:grid-cols-2 gap-32 items-center">
                          <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                          >
                            <div className="flex items-center gap-4 mb-10">
                               <div className="w-12 h-[1px] bg-primary" />
                               <span className="text-[10px] font-tech font-bold tracking-[1em] text-primary uppercase">Neural Blueprint</span>
                            </div>
                            <h2 className="text-6xl md:text-[9rem] font-display font-black tracking-tighter text-white mb-10 leading-[0.8]">
                              GENETIC <br/> <span className="text-outline italic">COUTURE</span>
                            </h2>
                            <p className="text-2xl text-white/40 leading-relaxed mb-16 max-w-xl font-light">
                              Holographic tailoring meets biological resonance. Our AI core synthesizes garments that evolve with your neural frequency.
                            </p>
                            <Link href="/shop" className="group inline-flex items-center gap-8 text-[12px] font-tech font-bold tracking-[0.5em] uppercase text-white hover:text-primary transition-colors">
                              Initialize Connection
                              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all">
                                <ArrowRight size={16} />
                              </div>
                            </Link>
                          </motion.div>

                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
                            whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                          >
                            <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-white/5 relative group">
                              <Image 
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
                                alt="Future Fashion"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent" />
                              
                              {/* HUD ACCENT */}
                              <div className="absolute bottom-10 left-10 right-10">
                                 <div className="flex justify-between items-end mb-4">
                                    <div className="text-[8px] font-tech text-white/40 tracking-[0.5em] uppercase">Material: Bioplastic Chrome</div>
                                    <div className="text-[8px] font-tech text-primary tracking-[0.5em] uppercase">Sync: 100%</div>
                                 </div>
                                 <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-primary"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: "100%" }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 3 }}
                                    />
                                 </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </section>

                    {/* MARQUEE FOOTER PREVIEW */}
                    <section className="bg-white text-black py-40 overflow-hidden relative">
                       <motion.div 
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex whitespace-nowrap text-[25vh] font-display font-black leading-none opacity-5 select-none"
                      >
                        LUXE AI • FUTURE FASHION • NEURAL SILHOUETTE • 
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-4xl text-center px-6">
                           <h4 className="text-4xl md:text-7xl font-display font-black tracking-tight mb-12 uppercase leading-tight">
                             Witness the Evolution of <span className="text-primary italic">Identity.</span>
                           </h4>
                           <button className="px-20 py-8 bg-black text-white font-nav font-black tracking-[0.5em] uppercase hover:bg-primary hover:text-black transition-all duration-500 text-sm">
                              Enter the Multiverse
                           </button>
                        </div>
                      </div>
                    </section>
                  </main>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
