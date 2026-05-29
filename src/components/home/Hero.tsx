// src/components/home/Hero.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(0,242,255,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-5 py-2 mb-8"
        >
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.3em]">
            Premium Linen Collection 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-cormorant font-light text-white leading-none tracking-tight mb-4 floatHeadline"
        >
          Luxury
          <span className="block italic text-[#D4AF37]">Redefined</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-sm sm:text-base text-white/50 font-sora max-w-xl mx-auto leading-relaxed mb-10"
        >
          Affordable luxury fashion crafted from premium breathable linen.
          Designed for the bold generation of Hyderabad.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37]/90 hover:scale-[1.02] transition-all duration-300"
          >
            Shop Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/drops"
            className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white/15 text-white/70 font-mono text-xs uppercase tracking-widest rounded-xl hover:border-[#D4AF37]/40 hover:text-white transition-all duration-300"
          >
            Upcoming Drops
          </Link>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap gap-8 justify-center mt-16"
        >
          {[
            { icon: <Sparkles size={14} />, label: "Premium Linen Fabric", sub: "Breathable & Soft" },
            { icon: <TrendingUp size={14} />, label: "Trending Styles", sub: "New drops weekly" },
            { icon: <span className="text-xs font-mono">📍</span>, label: "Hyderabad Local", sub: "Fast delivery" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 text-center">
              <div className="text-[#D4AF37]">{stat.icon}</div>
              <p className="text-[10px] font-mono text-white uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{stat.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
        <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
