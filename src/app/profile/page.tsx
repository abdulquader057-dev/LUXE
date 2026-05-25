"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { motion } from "framer-motion";
import LuxeButton from "@/components/ui/LuxeButton";
import {
  BrainCircuit, Palette, Heart, Star,
  Zap, Trophy, Crown, Diamond,
  TrendingUp, Eye, ShoppingBag, Sparkles,
  ChevronRight, BarChart3, Settings2
} from "lucide-react";
import { DEFAULT_STYLE_DNA, ALL_BADGES, MOCK_OUTFITS, TREND_RADAR } from "@/data/ecosystem";
import { cn } from "@/lib/utils";

const XP_PER_LEVEL = 400;

function CircularProgress({ value, size = 120, strokeWidth = 8, color = "#00f2ff", children }: {
  value: number; size?: number; strokeWidth?: number; color?: string; children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  const dna = DEFAULT_STYLE_DNA;
  const [activeSection, setActiveSection] = useState("overview");
  const xpProgress = ((dna.totalXP % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  const xpToNext = XP_PER_LEVEL - (dna.totalXP % XP_PER_LEVEL);

  const rarityColors: Record<string, string> = {
    common: "#a0a0a0",
    rare: "#00f2ff",
    epic: "#c084fc",
    legendary: "#ffcc00",
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-40 relative overflow-hidden">
      {/* Atmospheric */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50%] h-[40%] bg-primary/8 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/8 blur-[200px] rounded-full" />
      </div>

      {isLoading || !user ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
           <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
        </div>
      ) : (
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Avatar / Level Ring */}
          <div className="flex justify-center mb-8">
            <CircularProgress value={xpProgress} size={160} strokeWidth={6} color="#00f2ff">
              <div className="w-[130px] h-[130px] rounded-full glass-panel border border-primary/20 flex flex-col items-center justify-center">
                <span className="text-4xl mb-1">🧠</span>
                <span className="text-[9px] font-black tracking-widest text-primary uppercase">LVL {dna.level}</span>
              </div>
            </CircularProgress>
          </div>

          <h1 className="text-5xl font-display font-black tracking-tighter mb-2 uppercase">Your Style DNA</h1>
          <p className="text-lg text-white/40 font-medium mb-4">{dna.stylePersonality} · {dna.fashionEra}</p>
          
          {/* XP Bar */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-[9px] font-black tracking-widest text-white/30 uppercase mb-2">
              <span>{dna.totalXP} XP</span>
              <span>{xpToNext} XP to Level {dna.level + 1}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "overview", label: "Overview", icon: Eye },
            { id: "aesthetics", label: "Aesthetics", icon: Palette },
            { id: "badges", label: "Badges", icon: Trophy },
            { id: "trends", label: "Trend Radar", icon: TrendingUp },
            { id: "settings", label: "Control Hub", icon: Settings2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                activeSection === tab.id
                  ? "bg-primary text-black"
                  : "glass-panel border border-white/5 text-white/40 hover:text-white hover:border-white/20"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Core Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fashion Score", value: "87", icon: Star, color: "#ffcc00" },
                { label: "Items Saved", value: "34", icon: Heart, color: "#ff4466" },
                { label: "Outfits Built", value: "12", icon: Sparkles, color: "#c084fc" },
                { label: "Wardrobe %", value: `${dna.wardrobeCompletion}%`, icon: ShoppingBag, color: "#00f2ff" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel !rounded-[28px] p-6 border border-white/5 text-center"
                >
                  <stat.icon size={24} className="mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                  <div className="text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: `${stat.color}80` }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Dominant Colors */}
            <div className="glass-panel !rounded-[32px] p-8 border border-white/5">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Dominant Color Palette</h3>
              <div className="flex gap-4">
                {dna.dominantColors.map((color) => (
                  <div key={color} className="flex items-center gap-3 glass-panel !rounded-2xl px-5 py-3 border border-white/5">
                    <div className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: color === "Obsidian Black" ? "#111" : color === "Cyber Cyan" ? "#00f2ff" : "#f8f8f8" }}
                    />
                    <span className="text-sm font-black tracking-wider uppercase">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Aesthetics */}
            <div className="glass-panel !rounded-[32px] p-8 border border-white/5">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Preferred Aesthetics</h3>
              <div className="flex flex-wrap gap-3">
                {dna.preferredAesthetics.map((aesthetic) => (
                  <span key={aesthetic} className="bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full text-xs font-black tracking-wider text-primary">
                    {aesthetic}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Badges Section */}
        {activeSection === "badges" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {ALL_BADGES.map((badge, i) => {
              const isUnlocked = dna.badges.some((b) => b.id === badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "glass-panel !rounded-[28px] p-6 border text-center transition-all",
                    isUnlocked ? "border-white/10" : "border-white/5 opacity-40 grayscale"
                  )}
                >
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <div className="text-sm font-black tracking-wider uppercase mb-1">{badge.name}</div>
                  <div className="text-[9px] text-white/30 mb-3">{badge.description}</div>
                  <span
                    className="text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full"
                    style={{
                      color: rarityColors[badge.rarity],
                      backgroundColor: `${rarityColors[badge.rarity]}15`,
                      border: `1px solid ${rarityColors[badge.rarity]}30`,
                    }}
                  >
                    {badge.rarity}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Trend Radar Section */}
        {activeSection === "trends" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid gap-4">
              {TREND_RADAR.map((trend, i) => {
                const forecastColors = {
                  rising: "#00ff9d",
                  peaking: "#ffcc00",
                  declining: "#ff4466",
                  emerging: "#c084fc",
                };
                return (
                  <motion.div
                    key={trend.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-panel !rounded-[24px] p-6 border border-white/5 flex items-center gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-black tracking-wider uppercase">{trend.name}</h4>
                        <span
                          className="text-[8px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full"
                          style={{
                            color: forecastColors[trend.forecast],
                            backgroundColor: `${forecastColors[trend.forecast]}15`,
                            border: `1px solid ${forecastColors[trend.forecast]}30`,
                          }}
                        >
                          {trend.forecast}
                        </span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">{trend.category}</span>
                    </div>

                    {/* Momentum bar */}
                    <div className="w-32">
                      <div className="text-[8px] font-black tracking-widest text-white/20 uppercase mb-1">Momentum</div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(trend.momentum)}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: trend.momentum > 0 ? "#00ff9d" : "#ff4466" }}
                        />
                      </div>
                    </div>

                    {/* Popularity */}
                    <CircularProgress value={trend.popularity} size={56} strokeWidth={4} color={forecastColors[trend.forecast]}>
                      <span className="text-xs font-black">{trend.popularity}</span>
                    </CircularProgress>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Aesthetics Section */}
        {activeSection === "aesthetics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-panel !rounded-[32px] p-8 border border-white/5">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Your AI Summary</h3>
              <p className="text-xl text-white/60 leading-relaxed italic">
                &quot;Your style DNA reveals a bold fusion of cyber-minimalism and tech-modest aesthetics. 
                You gravitate towards dark tonal palettes with cyan accents. Your silhouette preferences 
                lean architectural and oversized. The AI recommends exploring more textural layering 
                and iridescent materials to evolve your wardrobe to the next stage.&quot;
              </p>
              <div className="flex items-center gap-3 mt-6">
                <BrainCircuit size={16} className="text-primary" />
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">LUXE Neural Analysis v4.0</span>
              </div>
            </div>

            {/* Wardrobe Evolution */}
            <div className="glass-panel !rounded-[32px] p-8 border border-white/5">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">Wardrobe Evolution</h3>
              <div className="flex items-center gap-8">
                {["Beginner", "Explorer", "Architect", "Neural", "Deity"].map((stage, i) => (
                  <div key={stage} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-sm font-black",
                      i < dna.evolutionStage ? "bg-primary/20 text-primary border border-primary/40" :
                        i === dna.evolutionStage ? "bg-primary text-black" :
                          "bg-white/5 text-white/20 border border-white/5"
                    )}>
                      {i + 1}
                    </div>
                    <span className="text-[8px] font-black tracking-widest text-white/30 uppercase">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings / Control Hub Section */}
        {activeSection === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel !rounded-[32px] p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
               <Settings2 size={40} className="animate-spin-slow" />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10"
               />
            </div>
            
            <div className="space-y-4 max-w-md">
              <h3 className="text-3xl font-display font-light italic">System Configuration</h3>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                Initialize the primary command center to manage your identity, neural style preferences, and elite membership status.
              </p>
            </div>

            <Link href="/settings">
               <LuxeButton size="lg">Initialize Control Hub</LuxeButton>
            </Link>
          </motion.div>
        )}
      </div>
      )}
    </main>
  );
}
