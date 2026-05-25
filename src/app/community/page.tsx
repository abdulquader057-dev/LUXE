"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Trophy, Crown,
  Flame, Users, Star, ArrowUp,
  ChevronRight, Sparkles, Filter
} from "lucide-react";
import { COMMUNITY_FITS, MOCK_OUTFITS } from "@/data/ecosystem";
import { MOCK_PRODUCTS } from "@/data/products";
import { CommunityFit } from "@/types";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Image from "next/image";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("trending");
  const [votedFits, setVotedFits] = useState<Set<string>>(new Set());
  const { formatPrice } = useCommerce();

  const toggleVote = (fitId: string) => {
    setVotedFits((prev) => {
      const next = new Set(prev);
      if (next.has(fitId)) next.delete(fitId);
      else next.add(fitId);
      return next;
    });
  };

  const tabs = [
    { id: "trending", label: "Trending", icon: Flame },
    { id: "top", label: "Top Rated", icon: Trophy },
    { id: "battles", label: "Style Battles", icon: Crown },
    { id: "new", label: "Fresh Fits", icon: Sparkles },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-40 relative overflow-hidden">
      {/* Atmospheric */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[40%] h-[40%] bg-accent/8 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-primary/8 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-accent" />
            <span className="text-accent text-[10px] font-black tracking-[0.5em] uppercase">Neural Community</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-6">
            RATE THE<br />
            <span className="text-gradient">FIT.</span>
          </h1>
          <p className="text-xl text-white/40 font-medium max-w-xl">
            Vote on community outfits, compete in style battles, and climb the fashion leaderboard.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-accent text-black"
                  : "glass-panel border border-white/5 text-white/40 hover:text-white hover:border-white/20"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Community Fits Grid */}
        {(activeTab === "trending" || activeTab === "top" || activeTab === "new") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMMUNITY_FITS.map((fit, i) => {
              const isVoted = votedFits.has(fit.id);
              const fitProducts = fit.outfit.items
                .map((item) => MOCK_PRODUCTS.find((p) => p.id === item.productId))
                .filter(Boolean);

              return (
                <motion.div
                  key={fit.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel !rounded-[32px] border border-white/5 overflow-hidden group"
                >
                  {/* Product grid preview */}
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {fitProducts.slice(0, 4).map((product, j) => product && (
                      <div key={j} className="aspect-square rounded-[20px] overflow-hidden relative">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{fit.avatar}</span>
                      <div>
                        <div className="text-sm font-black tracking-wider">@{fit.username}</div>
                        <div className="text-[9px] text-white/30 font-black tracking-widest uppercase">{fit.aesthetic}</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-black tracking-tighter uppercase mb-2">{fit.outfit.name}</h3>
                    <p className="text-sm text-white/40 mb-4 line-clamp-2">{fit.outfit.description}</p>

                    {/* Score & Votes */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleVote(fit.id)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                            isVoted
                              ? "bg-accent/20 border border-accent/40 text-accent"
                              : "glass-panel border border-white/10 text-white/40 hover:text-white"
                          )}
                        >
                          <ArrowUp size={14} />
                          <span className="text-xs font-black">{fit.votes + (isVoted ? 1 : 0)}</span>
                        </button>
                        <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">
                          Score: {fit.outfit.fashionScore}/100
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-400" />
                        <span className="text-sm font-black">{fit.outfit.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Style Battles */}
        {activeTab === "battles" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Active Battle */}
            <div className="glass-panel !rounded-[40px] border border-accent/20 p-8 relative overflow-hidden">
              <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Crown size={20} className="text-yellow-400" />
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-yellow-400 uppercase">Active Style Battle</h3>
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  {/* Fighter 1 */}
                  <div className="text-center">
                    <div className="text-4xl mb-3">{COMMUNITY_FITS[0].avatar}</div>
                    <div className="text-sm font-black tracking-wider mb-1">@{COMMUNITY_FITS[0].username}</div>
                    <div className="text-3xl font-black tracking-tighter mb-2 text-gradient">{COMMUNITY_FITS[0].outfit.name}</div>
                    <button className="w-full py-4 bg-primary/20 border border-primary/40 rounded-2xl font-black text-[10px] tracking-widest uppercase text-primary hover:bg-primary hover:text-black transition-all">
                      Vote This Fit
                    </button>
                  </div>

                  {/* VS */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-16 h-16 rounded-full bg-accent flex items-center justify-center"
                    >
                      <span className="font-black text-black text-xl">VS</span>
                    </motion.div>
                  </div>

                  {/* Fighter 2 */}
                  <div className="text-center">
                    <div className="text-4xl mb-3">{COMMUNITY_FITS[1].avatar}</div>
                    <div className="text-sm font-black tracking-wider mb-1">@{COMMUNITY_FITS[1].username}</div>
                    <div className="text-3xl font-black tracking-tighter mb-2 text-gradient">{COMMUNITY_FITS[1].outfit.name}</div>
                    <button className="w-full py-4 bg-accent/20 border border-accent/40 rounded-2xl font-black text-[10px] tracking-widest uppercase text-accent hover:bg-accent hover:text-black transition-all">
                      Vote This Fit
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="text-[9px] font-black tracking-widest text-white/20 uppercase">Battle ends in 23h 45m · 1,240 votes cast</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
