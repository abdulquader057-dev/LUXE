"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, ShoppingBag, Lock } from "lucide-react";
import Image from "next/image";
import { LiveDrop } from "@/types";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";

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
  const [isNotified, setIsNotified] = useState(false);
  const stockPercentage = (drop.remainingStock / drop.totalStock) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.2, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      className="relative group w-full h-[80vh] md:h-[90vh] overflow-hidden bg-bg-surface border border-white/5 cursor-spotlight-card animate-page-transition"
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }}
    >
      {/* Background Image (Cinematic scale & depth) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={drop.product.images[0] || "/brand/linen_model_front.png"}
          alt={drop.product.name}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[4s] ease-[0.25,1,0.5,1] group-hover:scale-[1.03]"
        />
        {/* Layered Fog Gradients for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent mix-blend-multiply opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent opacity-80" />
        <div className="absolute inset-0 group-hover:bg-white/5 transition-colors duration-[2s] mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between z-10">
        {/* Top: Metadata */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-sora tracking-[0.4em] uppercase text-primary block mb-2">
              Project #{String(index + 1).padStart(3, "0")}
            </span>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 border border-primary/30 text-[9px] font-sora uppercase tracking-widest text-primary">
                {drop.rarity}
              </span>
              {drop.exclusive && (
                <div className="badge-appear flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded">
                  <Lock size={14} />
                  <span className="text-xs font-sora uppercase">Gold Members Only</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              const nextState = !isNotified;
              setIsNotified(nextState);
              if (nextState && typeof window !== "undefined") {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({
                  event: "notify_drop",
                  product_id: drop.product.id,
                  product_name: drop.product.name
                });
              }
            }}
            className={cn(
              "glass-pill w-12 h-12 flex items-center justify-center transition-all duration-500",
              isNotified ? "text-primary bg-primary/10" : "text-white/50 hover:text-white"
            )}
          >
            <Bell size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Bottom: Typography & Elite CTA */}
        <div className="max-w-4xl relative text-left">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-cormorant font-light tracking-tighter text-white mb-4 leading-[0.9]">
            {drop.product.name}
          </h2>
          <p className="text-sm md:text-lg text-white/50 font-sora max-w-xl mb-12 leading-relaxed">
            {drop.product.description}
          </p>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            {/* Countdown */}
            <div className="flex gap-4 md:gap-8">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="text-4xl md:text-6xl font-sora font-light tracking-tighter text-white mb-2 flex justify-center gap-0.5">
                    {String(unit.value).padStart(2, "0").split("").map((digit, idx) => (
                      <span key={idx + "-" + digit} className="inline-block flipDigit">
                        {digit}
                      </span>
                    ))}
                  </div>
                  <div className="text-[9px] font-sora tracking-[0.3em] text-white/30 uppercase">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="text-left md:text-right mb-16 md:mb-0">
              <div className="text-3xl font-sora font-light text-primary mb-2">
                ₹{drop.product.price}
                {drop.remainingStock === 0 && (
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-sora ml-2 inline-block">Sold Out</div>
                )}
              </div>
              <div className="flex items-center justify-start md:justify-end gap-4">
                <span className="text-[9px] font-sora tracking-widest text-white/40 uppercase">
                  Availability
                </span>
                <div className="w-32 h-1 bg-white/10 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stockPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elite Action Button - STRICTLY Lower Right Quadrant */}
      <div className="absolute bottom-8 md:bottom-16 right-8 md:right-16 z-20">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => window.location.href = `/product/${drop.product.id}`}
          className="metal-pill px-8 py-4 flex items-center gap-3 text-white hover:text-white transition-colors duration-500 shadow-[0_10px_40px_rgba(201,168,76,0.15)] group/btn"
        >
          <ShoppingBag size={14} strokeWidth={1.5} className="text-primary group-hover/btn:scale-110 transition-transform" /> 
          <span className="font-sora text-[10px] tracking-[0.3em] uppercase text-white/90">
            Secure Allocation
          </span>
        </motion.button>
      </div>

    </motion.div>
  );
}

export default function DropsPage() {
  const [drops, setDrops] = useState<LiveDrop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrops() {
      try {
        const { data } = await supabase.from("products").select("*").limit(3);
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          const formattedDrops: LiveDrop[] = parsed.map((product, idx) => ({
            id: `drop-${product.id}`,
            product,
            dropDate: new Date(Date.now() + 3600000 * (idx + 1) * 24).toISOString(),
            totalStock: product.stock || 100,
            remainingStock: product.stock || 100,
            rarity: idx === 0 ? "ultra-rare" : idx === 1 ? "exclusive" : "limited",
            hypeScore: 80 + idx * 5,
            waitlistCount: 200 + idx * 150,
            exclusive: idx === 0,
          }));
          setDrops(formattedDrops);
        }
      } catch (err) {
        console.error("Failed to load live drops:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDrops();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-40 relative overflow-hidden">
      
      {/* Background Depth & Textures */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url(/noise.png)] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Header section */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-left"
        >
          <div>
            <span className="text-[10px] font-sora text-primary uppercase tracking-[0.4em] block mb-6">
              The Genesis Protocol
            </span>
            <h1 className="text-6xl md:text-[8rem] font-cormorant font-light tracking-tighter leading-[0.8]">
              Exclusive <br />
              <span className="italic text-white/50">Releases</span>
            </h1>
          </div>
          
          <div className="max-w-xs text-left md:text-right">
            <p className="text-[11px] font-sora text-white/40 leading-relaxed mb-6 tracking-wide">
              Highly curated pieces released in absolute limited quantities. Enter the protocol to secure your allocation before synchronization ends.
            </p>
            <div className="flex justify-start md:justify-end gap-4">
              <div className="flex items-center gap-3 border-b border-primary/30 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-sora tracking-widest uppercase text-primary">Live</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Drop Cards Container */}
      <div className="max-w-[1400px] mx-auto px-6 space-y-24 md:space-y-40 relative z-10">
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest animate-pulse">Initializing release feed...</span>
          </div>
        ) : drops.length > 0 ? (
          drops.map((drop, index) => (
            <DropCard key={drop.id} drop={drop} index={index} />
          ))
        ) : (
          <div className="py-24 text-center">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">No active releases synchronized in LUXE OS.</span>
          </div>
        )}
      </div>
    </main>
  );
}
