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
import LuxeButton from "@/components/ui/LuxeButton";

const CATEGORIES = [
  { id: "all", label: "INDEX" },
  { id: "cyber", label: "NEURAL" },
  { id: "tech", label: "SYNTH" },
  { id: "minimal", label: "VOID" },
  { id: "limited", label: "ARCHIVE" }
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [systemActive, setSystemActive] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      setTimeout(() => setSystemActive(true), 200);

      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
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

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-primary selection:text-black overflow-x-hidden">
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
            <Hero />
            
            <main className="relative z-10">
              <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32">
                
                {/* CATEGORY HUD */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-24 border-b border-white/[0.03] pb-12">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">Registry // v.4.02</span>
                      <h2 className="text-4xl md:text-5xl font-display font-light tracking-tight italic">Current Collections</h2>
                   </div>

                   <div className="flex flex-wrap gap-2 justify-center">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={cn(
                            "px-6 py-2 rounded-full border text-[9px] font-mono tracking-[0.3em] uppercase transition-all duration-500",
                            activeCategory === cat.id 
                              ? "bg-primary border-primary text-black shadow-[0_0_20px_rgba(0,229,204,0.3)]" 
                              : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: idx * 0.05, duration: 0.8 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* EDITORIAL BREAK */}
                <section className="py-48 grid lg:grid-cols-2 gap-24 items-center">
                   <div className="relative aspect-[4/5] overflow-hidden rounded-2xl group">
                      <Image 
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80"
                        alt="Editorial"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-12 left-12">
                         <span className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4 block">Material Archive</span>
                         <h3 className="text-5xl font-display font-light italic text-white max-w-sm leading-tight">Synthetic Silk & Neural Fibers.</h3>
                      </div>
                   </div>

                   <div className="space-y-12">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-px bg-primary/40" />
                         <span className="text-[10px] font-mono text-white/30 tracking-[0.8em] uppercase">Core Philosophy</span>
                      </div>
                      <h2 className="text-6xl md:text-8xl font-display font-light leading-[0.9] tracking-tighter">
                        FASHION AS <br/>
                        <span className="text-primary italic">SOFTWARE.</span>
                      </h2>
                      <p className="text-xl text-white/40 leading-relaxed max-w-lg">
                        LUXE transcends physical boundaries, treating every garment as an executable interface. Our silhouettes are designed to resonate with your digital and biological frequency.
                      </p>
                      <LuxeButton size="lg" className="w-full md:w-auto">
                        READ MANIFESTO
                      </LuxeButton>
                   </div>
                </section>

                {/* FULL WIDTH CTA */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl border border-white/[0.03]">
                   <div className="absolute inset-0 z-0">
                      <Image 
                        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80"
                        alt="CTA Background"
                        fill
                        className="object-cover opacity-20 scale-110"
                      />
                   </div>
                   <div className="relative z-10 text-center space-y-12 px-6">
                      <h2 className="text-5xl md:text-8xl font-display font-light tracking-tighter">JOIN THE EVOLUTION</h2>
                      <div className="flex flex-col md:flex-row gap-6 justify-center">
                         <LuxeButton size="lg">START REGISTRY</LuxeButton>
                         <LuxeButton variant="outline" size="lg">EXPLORE ARCHIVE</LuxeButton>
                      </div>
                   </div>
                   
                   {/* HUD Corner Accents */}
                   <div className="absolute top-8 left-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.5em]">System.Active()</div>
                   <div className="absolute bottom-8 right-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.5em]">Protocol.042</div>
                </section>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
