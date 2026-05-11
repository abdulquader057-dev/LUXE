"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Wand2, Palette, Ruler, ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

const AIStylePage = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const nextStep = () => setStep(step + 1);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setRecommendations(MOCK_PRODUCTS.slice(0, 3));
      setStep(5);
    }, 3000);
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-accent mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.3)]"
          >
            <BrainCircuit size={40} className="text-black" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">FIND YOUR <span className="text-gradient">IDENTITY.</span></h1>
          <p className="text-white/40 max-w-xl mx-auto font-medium tracking-wide">
            Our AI engine will analyze your personality and aesthetics to curate the perfect futuristic silhouette for you.
          </p>
        </div>

        <div className="glass-morphism rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="h-full bg-primary shadow-[0_0_15px_rgba(0,242,255,0.8)]"
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Palette size={24} className="text-primary" />
                  <h3 className="text-2xl font-black tracking-tight uppercase">What is your core aesthetic?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["CYBER TECHWEAR", "MINIMAL MODEST", "URBAN HYPED", "CLASSIC LUXE"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={nextStep}
                      className="p-8 rounded-2xl glass border border-white/5 text-left hover:border-primary transition-all group"
                    >
                      <span className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{opt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Wand2 size={24} className="text-primary" />
                  <h3 className="text-2xl font-black tracking-tight uppercase">Select your primary color palette</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { name: "NEON BLUE", class: "bg-blue-500" },
                    { name: "PHANTOM BLACK", class: "bg-black" },
                    { name: "CYBER PINK", class: "bg-pink-500" },
                    { name: "MATRIX GREEN", class: "bg-green-500" },
                    { name: "GHOST WHITE", class: "bg-white" },
                    { name: "TITANIUM", class: "bg-slate-400" },
                  ].map((color) => (
                    <button 
                      key={color.name}
                      onClick={nextStep}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className={cn("w-20 h-20 rounded-full border-4 border-white/5 group-hover:border-primary transition-all", color.class)} />
                      <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{color.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Ruler size={24} className="text-primary" />
                  <h3 className="text-2xl font-black tracking-tight uppercase">What's your preferred fit?</h3>
                </div>
                <div className="space-y-4">
                  {["OVERSIZED & LOOSE", "REGULAR FIT", "SLIM & TAPERED", "TECHNICAL LAYERING"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={nextStep}
                      className="w-full p-6 rounded-2xl glass border border-white/5 text-left hover:border-primary transition-all"
                    >
                      <span className="text-lg font-black tracking-tight">{opt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-20"
              >
                {!isAnalyzing ? (
                  <>
                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-10">
                      <Sparkles size={40} className="text-primary animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase">Ready for synthesis?</h3>
                    <button 
                      onClick={startAnalysis}
                      className="px-12 py-5 bg-white text-black rounded-2xl font-black tracking-tight hover:bg-primary transition-colors"
                    >
                      GENERATE RECOMMENDATIONS
                    </button>
                  </>
                ) : (
                  <div className="space-y-10">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-2 uppercase animate-pulse">Analyzing Identity...</h3>
                      <p className="text-white/40 text-xs tracking-widest font-bold">SCANNING NEURAL AESTHETIC PATTERNS</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                    <Sparkles size={12} /> Analysis Complete
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase">Your Curated Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommendations.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h4 className="text-xl font-black tracking-tight uppercase mb-2">Buy the Full Bundle</h4>
                      <p className="text-white/40 text-sm">Save 15% when you purchase the AI recommended ensemble.</p>
                    </div>
                    <button className="px-8 py-4 bg-primary text-black rounded-xl font-black tracking-tight hover:scale-105 transition-transform flex items-center gap-2">
                      ADD BUNDLE TO CART <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-4 text-[10px] font-bold tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  RE-ANALYZE STYLE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default AIStylePage;
