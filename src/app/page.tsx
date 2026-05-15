"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  ArrowRight,
  Sparkles
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showIntro) {
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
            transition={{ duration: 2 }}
            className="relative"
          >
            {/* Cinematic Assembly Phase 1: Navbar */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Navbar />
            </motion.div>
            
            <main className="pt-20">
              {/* Cinematic Assembly Phase 2: Hero */}
              <motion.div
                initial={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
              >
                <Hero />
              </motion.div>
              
              {/* Cinematic Assembly Phase 3: Explorer */}
              <div className="container mx-auto px-4 py-12 md:py-20">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="flex overflow-x-auto no-scrollbar gap-4 mb-16 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center items-center"
                >
                  <div className="inline-flex items-center gap-2 p-2 rounded-full bg-surface/20 backdrop-blur-3xl border border-white/5">
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

                <MotionContainer>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product, idx) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
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
              <section className="py-32 md:py-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full translate-x-1/2 opacity-30" />
                <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
                  <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <BrainCircuit size={16} className="text-primary" />
                        <span className="text-[10px] font-tech font-bold tracking-[0.3em] text-white/60 uppercase">
                          LUXE Neural Core v4.2
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white mb-8 leading-[0.85]">
                        FASHION <br/> <span className="text-primary italic">INTELLIGENCE</span>
                      </h2>
                      <p className="text-xl text-white/30 leading-relaxed mb-12 max-w-xl font-light">
                        Our proprietary AI architect analyzes your biometric intent and aesthetic footprint to synthesize personalized digital silhouettes. 
                        Clothing that evolves in real-time with your identity.
                      </p>
                      <button className="group relative px-12 py-6 bg-white text-black font-nav font-black tracking-[0.4em] uppercase overflow-hidden transition-all duration-500">
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:text-black transition-colors">Initialize Stylist</span>
                      </button>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2 }}
                      className="relative aspect-square"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[60px] blur-3xl animate-pulse" />
                      <div className="absolute inset-0 glass-panel !rounded-[40px] border-white/10 overflow-hidden group">
                        <Image 
                          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80"
                          alt="AI Fashion"
                          fill
                          className="object-cover opacity-40 grayscale group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent" />
                        
                        {/* HUD Elements */}
                        <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                           <div className="text-[8px] font-tech text-primary/60 tracking-widest uppercase">Syncing... 87%</div>
                           <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary"
                                animate={{ width: ["10%", "87%"] }}
                                transition={{ duration: 4, repeat: Infinity }}
                              />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Newsletter */}
              <section className="bg-white text-black py-32 md:py-64 overflow-hidden relative">
                <motion.div 
                  style={{ x: "-10%" }}
                  animate={{ x: "-50%" }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="flex whitespace-nowrap text-[20vh] md:text-[35vh] font-display font-black leading-none opacity-5 select-none"
                >
                  FUTURE PROOF • LUXE NATIVE • BEYOND COUTURE • 
                </motion.div>
                <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10 -mt-24 md:-mt-48">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-16">
                    <div className="max-w-3xl">
                      <h3 className="text-5xl md:text-9xl font-display font-black tracking-tighter leading-[0.8] mb-12">
                        JOIN THE <br/> <span className="text-outline">SYNTHESIS.</span>
                      </h3>
                      <div className="flex flex-col md:flex-row gap-6">
                        <input 
                          type="email" 
                          placeholder="ENTER NEURAL ID (EMAIL)" 
                          className="flex-1 bg-black/5 border-b-2 border-black/20 p-6 font-tech text-sm focus:outline-none focus:border-black transition-colors uppercase tracking-[0.2em]"
                        />
                        <button className="bg-black text-white px-16 py-6 font-nav font-black tracking-[0.4em] uppercase hover:bg-primary hover:text-black transition-all duration-500">
                          Connect
                        </button>
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
