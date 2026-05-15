"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Flame, ShieldCheck, Bell,
  Zap, Crown, Diamond, Star,
  ChevronRight, ShoppingBag, Users
} from "lucide-react";
import Image from "next/image";
import { LIVE_DROPS } from "@/data/ecosystem";
import { LiveDrop } from "@/types";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function DropCard({ drop, index }: { drop: LiveDrop; index: number }) {
  const countdown = useCountdown(drop.dropDate);
  const { formatPrice } = useCurrency();
  const [isNotified, setIsNotified] = useState(false);
  const stockPercentage = (drop.remainingStock / drop.totalStock) * 100;

  const rarityConfig = {
    "ultra-rare": { color: "#ff00ff", label: "ULTRA RARE", icon: Diamond, glow: "shadow-[0_0_60px_rgba(255,0,255,0.3)]" },
    "exclusive": { color: "#ffcc00", label: "EXCLUSIVE", icon: Crown, glow: "shadow-[0_0_60px_rgba(255,204,0,0.3)]" },
    "limited": { color: "#00f2ff", label: "LIMITED", icon: Star, glow: "shadow-[0_0_60px_rgba(0,242,255,0.3)]" },
  };

  const config = rarityConfig[drop.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative group rounded-[40px] overflow-hidden border border-white/5", config.glow)}
    >
      {/* Background image */}
      <div className="aspect-[16/10] md:aspect-[21/9] relative">
        <Image
          src={drop.product.images[0]}
          alt={drop.product.name}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Holographic rarity aura */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 50%, ${config.color}15, transparent 60%)` }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 p-10 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}40` }}
              >
                <config.icon size={20} style={{ color: config.color }} />
              </motion.div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-panel !rounded-full px-4 py-2 border border-white/10">
                <Users size={14} className="text-white/40" />
                <span className="text-[10px] font-black tracking-wider">{drop.waitlistCount.toLocaleString()} waiting</span>
              </div>
              <button
                onClick={() => setIsNotified(!isNotified)}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                  isNotified ? "bg-primary text-black" : "glass-panel border border-white/10 hover:border-primary/40"
                )}
              >
                <Bell size={18} />
              </button>
            </div>
          </div>

          {/* Bottom content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-2">
              {drop.product.name}
            </h2>
            <p className="text-lg text-white/40 mb-8 max-w-md">{drop.product.description}</p>

            {/* Countdown */}
            <div className="flex gap-4 mb-8">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="glass-panel !rounded-[20px] border border-white/5 px-6 py-4 text-center min-w-[80px]"
                >
                  <motion.div
                    key={`${unit.label}-${unit.value}`}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-black tracking-tighter"
                    style={{ color: config.color }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </motion.div>
                  <div className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase mt-1">{unit.label}</div>
                </div>
              ))}
            </div>

            {/* Price & Stock */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-gradient mb-2">{formatPrice(drop.product.price)}</div>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercentage}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-white/30">
                    {drop.remainingStock}/{drop.totalStock} units
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="glass-panel !rounded-2xl border border-white/5 px-5 py-3 flex items-center gap-2">
                  <Flame size={16} style={{ color: config.color }} />
                  <span className="text-sm font-black">{drop.hypeScore}%</span>
                  <span className="text-[9px] text-white/30 font-black tracking-widest uppercase">Hype</span>
                </div>
                <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-primary transition-all flex items-center gap-2">
                  <ShoppingBag size={16} /> Cop Drop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DropsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-40 relative overflow-hidden">
      {/* Atmospheric */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-secondary/10 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame size={24} className="text-secondary" />
            </motion.div>
            <span className="text-secondary text-[10px] font-black tracking-[0.5em] uppercase">Live Drop Station</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] mb-6">
            EXCLUSIVE<br />
            <span className="text-gradient">DROPS.</span>
          </h1>
          <p className="text-xl text-white/40 font-medium max-w-xl">
            Limited edition releases. Once they&apos;re gone, they&apos;re gone. Set your alerts and be ready.
          </p>
        </motion.div>

        {/* Active & Upcoming Status */}
        <div className="flex gap-4 mb-12">
          <div className="flex items-center gap-2 px-5 py-2.5 glass-panel !rounded-full border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-green-500">1 Active Drop</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 glass-panel !rounded-full border border-white/10">
            <Clock size={14} className="text-white/40" />
            <span className="text-[10px] font-black tracking-widest uppercase text-white/40">{LIVE_DROPS.length - 1} Upcoming</span>
          </div>
        </div>

        {/* Drop Cards */}
        <div className="space-y-10">
          {LIVE_DROPS.map((drop, index) => (
            <DropCard key={drop.id} drop={drop} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
