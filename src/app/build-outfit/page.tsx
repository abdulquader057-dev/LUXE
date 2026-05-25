"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ChevronRight, ChevronLeft, Heart,
  ShoppingBag, Zap, BrainCircuit, Palette,
  Sun, Moon, PartyPopper, Briefcase,
  RotateCcw, ArrowRight, Star
} from "lucide-react";
import Image from "next/image";
import { MOCK_OUTFITS, VIRTUAL_STYLISTS } from "@/data/ecosystem";
import { MOCK_PRODUCTS } from "@/data/products";
import { AIOutfit, VirtualStylist } from "@/types";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";

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
  const { convertPrice } = useCommerce();

  const handleGenerate = useCallback((prompt: string) => {
    setSelectedPrompt(prompt);
    setIsGenerating(true);
    setRevealPhase(0);

    // Simulate AI generation with phased reveal
    setTimeout(() => setRevealPhase(1), 800);
    setTimeout(() => setRevealPhase(2), 1600);
    setTimeout(() => {
      const outfit = MOCK_OUTFITS[currentOutfitIndex % MOCK_OUTFITS.length];
      setGeneratedOutfit(outfit);
      setRevealPhase(3);
      setIsGenerating(false);
    }, 2400);
  }, [currentOutfitIndex]);

  const handleNext = () => {
    setCurrentOutfitIndex((prev) => prev + 1);
    const nextOutfit = MOCK_OUTFITS[(currentOutfitIndex + 1) % MOCK_OUTFITS.length];
    setGeneratedOutfit(nextOutfit);
  };

  const handlePrev = () => {
    setCurrentOutfitIndex((prev) => Math.max(0, prev - 1));
    const prevOutfit = MOCK_OUTFITS[Math.max(0, currentOutfitIndex - 1) % MOCK_OUTFITS.length];
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
      .map((item) => MOCK_PRODUCTS.find((p) => p.id === item.productId))
      .filter(Boolean);
  }, [generatedOutfit]);

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
                    ? "bg-primary text-black scale-105"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-black px-8 py-4 rounded-[20px] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-30"
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
                  { label: "AI Confidence", value: `${generatedOutfit.confidence}%`, color: "#00f2ff" },
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
                        <p className="text-lg font-black text-gradient">{convertPrice(product.price)}</p>
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
                  <div className="text-4xl font-black tracking-tighter text-gradient">{convertPrice(generatedOutfit.totalPrice)}</div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => selectedPrompt && handleGenerate(selectedPrompt)}
                    className="px-8 py-5 rounded-[24px] glass-panel border border-white/10 font-black text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <RotateCcw size={16} /> Regenerate
                  </button>
                  <button className="px-10 py-5 rounded-[24px] bg-primary text-black font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-3">
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
