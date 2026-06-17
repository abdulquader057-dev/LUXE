"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Wand2, Palette, Ruler, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { parseDbProduct, MOCK_PRODUCTS } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import { useCommerce } from "@/lib/contexts/CommerceContext";

const AIStylePage = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { addToCart, toggleCart } = useCommerce();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          const unique = parsed.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
          setAllProducts(unique);
        } else {
          console.log("Supabase products empty, falling back to mock catalog.");
          setAllProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to load products for AI Style analysis, falling back to mock catalog:", err);
        setAllProducts(MOCK_PRODUCTS);
      }
    }
    fetchProducts();
  }, []);

  const nextStep = () => setStep(step + 1);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Use real Supabase products, fallback to mock if DB empty
      const pool = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS;
      // Shuffle and take 3
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 3));
      setStep(5);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-6 max-w-4xl pt-32 pb-24 min-h-screen">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-white/20 to-white/5 mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/10"
          >
            <BrainCircuit size={40} className="text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tighter mb-6 text-white">FIND YOUR <span className="text-white/40 italic font-cormorant">IDENTITY.</span></h1>
          <p className="text-white/40 max-w-xl mx-auto font-sora text-sm tracking-wide">
            Our AI engine will analyze your personality and aesthetics to curate the perfect futuristic silhouette for you.
          </p>
        </div>

        <div className="bg-[#050508]/80 border border-white/10 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full bg-white/40"
            />
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-10">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                s <= step ? "bg-white/70" : "bg-white/10"
              )} />
            ))}
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
                  <Palette size={24} className="text-white/60" />
                  <h3 className="text-2xl font-orbitron font-bold tracking-tight uppercase text-white">What is your core aesthetic?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["CYBER TECHWEAR", "MINIMAL MODEST", "URBAN HYPED", "CLASSIC LUXE"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={nextStep}
                      className="p-8 rounded-2xl bg-white/3 border border-white/5 text-left hover:border-white/20 hover:bg-white/5 transition-all group"
                    >
                      <span className="text-xl font-orbitron font-bold tracking-tight text-white/60 group-hover:text-white transition-colors">{opt}</span>
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
                  <Wand2 size={24} className="text-white/60" />
                  <h3 className="text-2xl font-orbitron font-bold tracking-tight uppercase text-white">Select your primary color palette</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { name: "NEON BLUE", class: "bg-blue-500" },
                    { name: "PHANTOM BLACK", class: "bg-zinc-900 border border-white/20" },
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
                      <div className={cn("w-20 h-20 rounded-full border-4 border-white/5 group-hover:border-white/30 group-hover:scale-110 transition-all", color.class)} />
                      <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase font-sora group-hover:text-white transition-colors">{color.name}</span>
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
                  <Ruler size={24} className="text-white/60" />
                  <h3 className="text-2xl font-orbitron font-bold tracking-tight uppercase text-white">What&apos;s your preferred fit?</h3>
                </div>
                <div className="space-y-4">
                  {["OVERSIZED & LOOSE", "REGULAR FIT", "SLIM & TAPERED", "TECHNICAL LAYERING"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={nextStep}
                      className="w-full p-6 rounded-2xl bg-white/3 border border-white/5 text-left hover:border-white/20 hover:bg-white/5 transition-all group"
                    >
                      <span className="text-lg font-orbitron font-bold tracking-tight text-white/60 group-hover:text-white transition-colors">{opt}</span>
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
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-10">
                      <Sparkles size={40} className="text-white/60 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-orbitron font-bold tracking-tighter mb-6 uppercase text-white">Ready for synthesis?</h3>
                    <button 
                      onClick={startAnalysis}
                      className="px-12 py-5 bg-white text-black rounded-2xl font-orbitron font-bold tracking-tight hover:bg-white/90 transition-colors flex items-center gap-3 mx-auto"
                    >
                      GENERATE RECOMMENDATIONS
                      <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <div className="space-y-10">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="text-white/50 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold tracking-tight mb-2 uppercase animate-pulse text-white">Analyzing Identity...</h3>
                      <p className="text-white/40 text-xs tracking-widest font-sora font-bold">SCANNING NEURAL AESTHETIC PATTERNS</p>
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-4">
                    <Sparkles size={12} /> Analysis Complete
                  </div>
                  <h3 className="text-4xl font-orbitron font-bold tracking-tighter uppercase text-white">Your Curated Identity</h3>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendations.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-white/40 font-sora text-sm uppercase tracking-widest">No products available matching this aesthetic.</p>
                  </div>
                )}

                <div className="p-8 rounded-3xl bg-white/3 border border-white/10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h4 className="text-xl font-orbitron font-bold tracking-tight uppercase mb-2 text-white">Buy the Full Bundle</h4>
                      <p className="text-white/40 text-sm font-sora">Save 15% when you purchase the AI recommended ensemble.</p>
                    </div>
                    <button 
                      onClick={() => {
                        recommendations.forEach((p) => {
                          const modelImg = p.modelImages?.variants?.[p.colors?.[0]] || p.modelImages || {};
                          const img = modelImg.front && modelImg.front !== "/model_placeholder.png" 
                            ? modelImg.front 
                            : (Array.isArray(p.images) ? p.images[0] : p.images) || "/brand/linen_model_front.png";
                          
                          addToCart({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: img,
                            quantity: 1,
                            size: "L",
                            color: p.colors?.[0] || "White",
                          });
                        });
                        toggleCart();
                      }}
                      className="px-8 py-4 bg-white text-black rounded-xl font-orbitron font-bold tracking-tight hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      ADD BUNDLE TO CART <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-4 text-[10px] font-bold tracking-widest text-white/30 hover:text-white transition-colors font-sora uppercase"
                >
                  RE-ANALYZE STYLE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default AIStylePage;
