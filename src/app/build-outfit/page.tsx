"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ChevronRight, ChevronLeft, Heart,
  ShoppingBag, Zap, BrainCircuit, Palette,
  Sun, Moon, PartyPopper, Briefcase,
  RotateCcw, ArrowRight, Star
} from "lucide-react";
import Image from "next/image";
import { VIRTUAL_STYLISTS } from "@/data/ecosystem";
import { parseDbProduct } from "@/data/products";
import { AIOutfit, VirtualStylist, Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const PROMPTS = [
  { label: "Minimal Black Fit", icon: Moon, aesthetic: "Cyber-Minimal" },
  { label: "Streetwear Under ₹5K", icon: Zap, aesthetic: "Streetwear Futurism" },
  { label: "Luxury Modest", icon: Sparkles, aesthetic: "Tech-Modest" },
  { label: "Gen-Z Oversized", icon: PartyPopper, aesthetic: "Neon-Luxury" },
  { label: "Night Out Drip", icon: Star, aesthetic: "Neon-Luxury" },
  { label: "Corporate Futurism", icon: Briefcase, aesthetic: "Cyber-Minimal" },
];

const MOODS = ["🖤 Dark", "☀️ Bright", "🌊 Cool", "🔥 Bold", "✨ Elegant", "⚡ Electric"];

export default function BuildOutfitPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<AIOutfit | null>(null);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [selectedStylist, setSelectedStylist] = useState<VirtualStylist>(VIRTUAL_STYLISTS[0]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [revealPhase, setRevealPhase] = useState(0);
  const [likedOutfits, setLikedOutfits] = useState<Set<string>>(new Set());
  const { convertPrice, addToCart } = useCommerce();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Supabase Integration States
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbOutfits, setDbOutfits] = useState<AIOutfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch real products from Supabase
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");
        
        if (productsError) throw productsError;
        if (!productsData || productsData.length === 0) {
          throw new Error("Catalog database returned empty. Populate the catalog to design outfits.");
        }
        
        const loadedProducts = productsData.map(parseDbProduct);
        setDbProducts(loadedProducts);

        // 2. Fetch outfits from Supabase
        let loadedOutfits: AIOutfit[] = [];
        try {
          const { data: outfitsData, error: outfitsError } = await supabase
            .from("outfits")
            .select("*");
          
          if (!outfitsError && outfitsData && outfitsData.length > 0) {
            loadedOutfits = outfitsData as any[];
          } else {
            throw new Error("No outfits in database");
          }
        } catch (outfitErr) {
          console.warn("Outfits table fetch failed, constructing outfits from live catalog:", outfitErr);
          // Construct default outfits dynamically using actual products loaded from database!
          if (loadedProducts.length > 0) {
            const tops = loadedProducts.filter(p => p.category === "streetwear" || p.name.toLowerCase().includes("shirt") || p.name.toLowerCase().includes("polo") || p.name.toLowerCase().includes("tee"));
            const accessories = loadedProducts.filter(p => p.name.toLowerCase().includes("watch") || p.name.toLowerCase().includes("chrono") || p.name.toLowerCase().includes("belt") || p.name.toLowerCase().includes("accessory") || p.name.toLowerCase().includes("bag") || p.name.toLowerCase().includes("cap"));
            const footwear = loadedProducts.filter(p => p.name.toLowerCase().includes("sneaker") || p.name.toLowerCase().includes("footwear") || p.name.toLowerCase().includes("shoe") || p.name.toLowerCase().includes("sock") || p.name.toLowerCase().includes("slide"));
            const outers = loadedProducts.filter(p => p.name.toLowerCase().includes("kaftan") || p.name.toLowerCase().includes("jacket") || p.name.toLowerCase().includes("outerwear") || p.name.toLowerCase().includes("vest") || p.name.toLowerCase().includes("coat") || p.name.toLowerCase().includes("hoodie"));

            const getProductOrFallback = (list: Product[], index: number, fallbackList: Product[]): Product => {
              if (list.length > 0) return list[index % list.length];
              return fallbackList[index % fallbackList.length];
            };

            loadedOutfits = [
              {
                id: "outfit-live-1",
                name: "Midnight Vanguard",
                description: "A refined cyberpunk modular silhouette constructed from lightweight carbon-weave fabrics.",
                aesthetic: "Cyber-Minimal",
                occasion: "Evening / Gallery",
                confidence: 95,
                items: [
                  { productId: getProductOrFallback(tops, 0, loadedProducts).id, role: "top" },
                  { productId: getProductOrFallback(outers, 0, loadedProducts).id, role: "outerwear" },
                  { productId: getProductOrFallback(footwear, 0, loadedProducts).id, role: "footwear" },
                  { productId: getProductOrFallback(accessories, 0, loadedProducts).id, role: "accessory" }
                ],
                totalPrice: 22000,
                fashionScore: 94,
                colorHarmony: 92,
                trendAlignment: 88
              },
              {
                id: "outfit-live-2",
                name: "Solstice Techwear",
                description: "High-mobility tactical streetwear utilizing organic cotton flax layers.",
                aesthetic: "Streetwear Futurism",
                occasion: "Street / Festival",
                confidence: 92,
                items: [
                  { productId: getProductOrFallback(tops, 1, loadedProducts).id, role: "top" },
                  { productId: getProductOrFallback(footwear, 1, loadedProducts).id, role: "footwear" },
                  { productId: getProductOrFallback(accessories, 1, loadedProducts).id, role: "accessory" }
                ],
                totalPrice: 15500,
                fashionScore: 88,
                colorHarmony: 86,
                trendAlignment: 92
              },
              {
                id: "outfit-live-3",
                name: "Quantum Modest",
                description: "Elegant and breathable geometric silhouette constructed for daily smart-casual environments.",
                aesthetic: "Tech-Modest",
                occasion: "Daily / Formal",
                confidence: 97,
                items: [
                  { productId: getProductOrFallback(tops, 2, loadedProducts).id, role: "top" },
                  { productId: getProductOrFallback(accessories, 2, loadedProducts).id, role: "accessory" },
                  { productId: getProductOrFallback(outers, 1, loadedProducts).id, role: "outerwear" }
                ],
                totalPrice: 19800,
                fashionScore: 95,
                colorHarmony: 94,
                trendAlignment: 85
              }
            ];

            // Calculate exact total price of the outfits based on their products
            loadedOutfits.forEach(outfit => {
              let total = 0;
              outfit.items.forEach(item => {
                const p = loadedProducts.find(x => x.id === item.productId);
                if (p) total += p.price;
              });
              if (total > 0) outfit.totalPrice = total;
            });
          }
        }
        setDbOutfits(loadedOutfits);
      } catch (err: any) {
        console.error("Failed to load catalog/outfits data:", err);
        setError(err.message || "Failed to establish secure link to database.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleGenerate = useCallback((prompt: string) => {
    if (dbOutfits.length === 0) {
      toast.error("No catalog outfits available.");
      return;
    }
    setSelectedPrompt(prompt);
    setIsGenerating(true);
    setRevealPhase(0);

    // Simulate AI generation with phased reveal
    setTimeout(() => setRevealPhase(1), 800);
    setTimeout(() => setRevealPhase(2), 1600);
    setTimeout(() => {
      const outfit = dbOutfits[currentOutfitIndex % dbOutfits.length];
      setGeneratedOutfit(outfit);
      setRevealPhase(3);
      setIsGenerating(false);
    }, 2400);
  }, [currentOutfitIndex, dbOutfits]);

  const handleNext = () => {
    if (dbOutfits.length === 0) return;
    setCurrentOutfitIndex((prev) => prev + 1);
    const nextOutfit = dbOutfits[(currentOutfitIndex + 1) % dbOutfits.length];
    setGeneratedOutfit(nextOutfit);
  };

  const handlePrev = () => {
    if (dbOutfits.length === 0) return;
    setCurrentOutfitIndex((prev) => Math.max(0, prev - 1));
    const prevOutfit = dbOutfits[Math.max(0, currentOutfitIndex - 1) % dbOutfits.length];
    setGeneratedOutfit(prevOutfit);
  };

  const toggleLike = (id: string) => {
    setLikedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const outfitProducts = useMemo(() => {
    if (!generatedOutfit) return [];
    return generatedOutfit.items
      .map((item) => dbProducts.find((p) => p.id === item.productId))
      .filter(Boolean) as Product[];
  }, [generatedOutfit, dbProducts]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Loading Neural Catalog...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-40 flex items-center justify-center">
        <div className="max-w-md p-8 rounded-3xl bg-red-500/5 border border-red-500/20 text-center space-y-4">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-red-400">Database Offline</h2>
          <p className="text-xs font-mono text-white/40 uppercase leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded-xl hover:scale-105 transition-transform">
            Retry Sync
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-40 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full blur-[200px] opacity-20"
          style={{ background: `radial-gradient(circle, ${selectedStylist.accentColor}40, transparent 70%)` }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full blur-[200px] bg-secondary/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-primary" />
            <span className="text-primary text-[10px] font-black tracking-[0.5em] uppercase">Neural Fashion Engine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-6">
            BUILD MY<br />
            <span className="text-gradient">OUTFIT.</span>
          </h1>
          <p className="text-xl text-white/40 font-medium max-w-xl">
            Describe your vibe. Our AI architect will construct the perfect ensemble from our curated inventory.
          </p>
        </motion.div>

        {/* AI Stylist Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Choose Your Stylist</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {VIRTUAL_STYLISTS.map((stylist) => (
              <button
                key={stylist.id}
                onClick={() => setSelectedStylist(stylist)}
                className={cn(
                  "flex-shrink-0 p-6 rounded-[28px] border-2 transition-all duration-500 min-w-[200px]",
                  selectedStylist.id === stylist.id
                    ? "border-primary/60 glass-panel bg-primary/5 scale-105"
                    : "border-white/5 glass-panel hover:border-white/20"
                )}
              >
                <div className="text-3xl mb-3">{stylist.avatar}</div>
                <div className="text-sm font-black tracking-wider uppercase mb-1" style={{ color: stylist.accentColor }}>
                  {stylist.name}
                </div>
                <div className="text-[9px] font-bold text-white/30 tracking-widest uppercase">{stylist.personality}</div>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedStylist.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white/50 italic mt-4 pl-2 border-l-2"
              style={{ borderColor: selectedStylist.accentColor }}
            >
              &quot;{selectedStylist.greeting}&quot;
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Set the Mood</h3>
          <div className="flex flex-wrap gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood === selectedMood ? null : mood)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-black tracking-wider transition-all duration-300",
                  selectedMood === mood
                    ? "bg-[var(--primary-color)] text-black scale-105"
                    : "glass-panel border border-white/10 hover:border-white/30 text-white/60"
                )}
              >
                {mood}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Quick Neural Prompts</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handleGenerate(prompt.label)}
                disabled={isGenerating}
                className={cn(
                  "group p-6 rounded-[24px] border transition-all duration-500 text-left relative overflow-hidden",
                  selectedPrompt === prompt.label
                    ? "border-primary/40 bg-primary/5"
                    : "border-white/5 glass-panel hover:border-white/20"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <prompt.icon size={20} className="text-primary mb-3 relative z-10" />
                <div className="text-sm font-black tracking-wider uppercase relative z-10">{prompt.label}</div>
                <div className="text-[9px] text-white/20 tracking-widest uppercase mt-1 relative z-10">{prompt.aesthetic}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Custom Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="relative">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && customPrompt && handleGenerate(customPrompt)}
              placeholder="Describe your perfect outfit..."
              className="w-full p-8 pr-24 glass-panel !rounded-[28px] border border-white/10 text-lg font-medium focus:outline-none focus:border-primary/40 placeholder:text-white/15 transition-all bg-transparent"
            />
            <button
              onClick={() => customPrompt && handleGenerate(customPrompt)}
              disabled={isGenerating || !customPrompt}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--primary-color)] text-black px-8 py-4 rounded-[20px] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-30"
            >
              {isGenerating ? "Generating..." : "Build Fit"}
            </button>
          </div>
        </motion.div>

        {/* Generation Animation / Reveal */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-32 gap-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-primary/30 border-t-primary"
              />
              <div className="text-center">
                <motion.p
                  key={revealPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-black tracking-[0.4em] uppercase"
                  style={{ color: selectedStylist.accentColor }}
                >
                  {revealPhase === 0 && "Analyzing your aesthetic..."}
                  {revealPhase === 1 && "Scanning neural inventory..."}
                  {revealPhase === 2 && "Constructing outfit architecture..."}
                </motion.p>
              </div>
              {/* Progress dots */}
              <div className="flex gap-3">
                {[0, 1, 2].map((phase) => (
                  <motion.div
                    key={phase}
                    animate={{
                      scale: revealPhase >= phase ? 1 : 0.5,
                      backgroundColor: revealPhase >= phase ? selectedStylist.accentColor : "rgba(255,255,255,0.1)",
                    }}
                    className="w-3 h-3 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Generated Outfit Reveal */}
          {generatedOutfit && !isGenerating && (
            <motion.div
              key="outfit"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12"
            >
              {/* Outfit Header */}
              <div className="flex items-start justify-between">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-3"
                  >
                    {generatedOutfit.name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-white/40 italic max-w-lg"
                  >
                    {generatedOutfit.description}
                  </motion.p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button onClick={handlePrev} className="w-14 h-14 rounded-full glass-panel border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNext} className="w-14 h-14 rounded-full glass-panel border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* AI Confidence & Scores */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { label: "AI Confidence", value: `${generatedOutfit.confidence}%`, color: "#C9A962" },
                  { label: "Fashion Score", value: `${generatedOutfit.fashionScore}/100`, color: "#ff00ff" },
                  { label: "Color Harmony", value: `${generatedOutfit.colorHarmony}%`, color: "#00ff9d" },
                  { label: "Trend Align", value: `${generatedOutfit.trendAlignment}%`, color: "#ffcc00" },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass-panel !rounded-[24px] p-6 border border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute bottom-0 left-0 h-1 rounded-full" style={{ width: `${parseInt(metric.value)}%`, backgroundColor: metric.color }} />
                    <div className="text-[9px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: `${metric.color}80` }}>{metric.label}</div>
                    <div className="text-2xl font-black tracking-tighter">{metric.value}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Interactive Style Board */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">Interactive Style Board</span>
                  </div>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Drag & Layer Silhouette Elements</span>
                </div>
                
                <div 
                  ref={canvasRef}
                  className="relative overflow-hidden w-full h-[400px] rounded-[32px] border border-white/5 bg-black/30 backdrop-blur-md shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-center bg-[linear-gradient(rgba(201,168,76,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"
                >
                  {/* Decorative corner brackets for a HUD feel */}
                  <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
                  <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20 pointer-events-none" />
                  <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />
                  
                  {outfitProducts.length === 0 && (
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
                      No assets loaded
                    </div>
                  )}

                  {outfitProducts.map((product, i) => {
                    if (!product) return null;
                    
                    const isMobile = isMounted && typeof window !== "undefined" && window.innerWidth < 768;
                    const leftOffset = isMobile ? i * 65 + 10 : i * 190 + 50;
                    const topOffset = isMobile ? 35 + (i % 2) * 40 : 40 + (i % 2) * 60;
                    
                    return (
                      <motion.div
                        key={`collage-${product.id}`}
                        drag
                        dragConstraints={canvasRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        whileHover={{ scale: 1.05, zIndex: 50 }}
                        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                        style={{
                          left: `${leftOffset}px`,
                          top: `${topOffset}px`,
                        }}
                        className="absolute w-[130px] md:w-[160px] aspect-[3/4] rounded-[24px] overflow-hidden border border-white/15 bg-[#12121a] shadow-2xl cursor-grab active:cursor-grabbing touch-none group select-none"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 140px, 170px"
                            className="object-cover pointer-events-none select-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Mini info overlay */}
                          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                            <span className="text-[8px] font-mono tracking-widest text-primary uppercase block truncate">
                              {generatedOutfit.items[i]?.role}
                            </span>
                            <span className="text-[9px] font-bold text-white uppercase block truncate">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Outfit Items Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {outfitProducts.map((product, i) => product && (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative"
                  >
                    <div className="aspect-[3/4] rounded-[32px] overflow-hidden relative border border-white/5 bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Role badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-[8px] font-black tracking-[0.3em] uppercase text-primary border border-primary/20">
                          {generatedOutfit.items[i]?.role}
                        </span>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => toggleLike(product.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Heart
                          size={16}
                          className={cn(likedOutfits.has(product.id) ? "text-red-500 fill-red-500" : "text-white/40")}
                        />
                      </button>

                      {/* Product info */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h4 className="text-sm font-black tracking-wider uppercase mb-1 truncate">{product.name}</h4>
                        <p className="text-lg font-black text-gradient">{(() => { const p = convertPrice(product.price); return `${p.symbol}${p.amount}`; })()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total & Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 glass-panel !rounded-[32px] border border-white/5"
              >
                <div>
                  <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-1">Complete Outfit</div>
                    <div className="text-3xl md:text-5xl font-black tracking-tighter text-gradient">{(() => { const p = convertPrice(generatedOutfit.totalPrice); return `${p.symbol}${p.amount}`; })()}</div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => selectedPrompt && handleGenerate(selectedPrompt)}
                    className="px-8 py-5 rounded-[24px] glass-panel border border-white/10 font-black text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <RotateCcw size={16} /> Regenerate
                  </button>
                  <button 
                    onClick={() => {
                      if (outfitProducts.length === 0 || !generatedOutfit) {
                        toast.error("No outfit products to add.");
                        return;
                      }
                      outfitProducts.forEach((product) => {
                        if (product) {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            quantity: 1,
                            size: product.sizes?.[0] || "L",
                            color: product.colors?.[0] || "Obsidian"
                          });
                        }
                      });
                      toast.success("Complete outfit added to your shopping bag!");
                    }}
                    className="px-10 py-5 rounded-[24px] bg-[var(--primary-color)] text-black font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <ShoppingBag size={16} /> Add Complete Fit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
