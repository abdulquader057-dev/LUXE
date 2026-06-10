"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, BrainCircuit, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function CommunityPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-40 relative overflow-hidden flex items-center justify-center">
      {/* Atmospheric Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="max-w-2xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel !rounded-[48px] border border-white/5 p-12 md:p-16 flex flex-col items-center gap-10 shadow-2xl relative overflow-hidden group"
        >
          {/* Decorative Corner Shimmers */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent blur-md pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-accent/10 to-transparent blur-md pointer-events-none" />

          {/* Premium Animated Icon */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing Outer Ring */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
            />
            {/* Outer Hexagon / Shield */}
            <div className="w-full h-full rounded-[32px] bg-white/[0.02] border border-primary/20 flex items-center justify-center text-primary relative z-10">
              <Crown size={36} className="text-[#C9A84C] animate-pulse" />
            </div>
            
            {/* Small float orbits */}
            <div className="absolute top-1 right-1">
              <Sparkles size={12} className="text-[#C9A84C] animate-bounce" />
            </div>
          </div>

          {/* Content block */}
          <div className="space-y-6">
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] block font-black">
              System Authorization Level // Gated Drop
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tighter uppercase text-white leading-none">
              ELITE ACCESS <br />
              <span className="text-gradient font-bold">REQUIRED</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto my-6" />
            <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto font-sora uppercase tracking-wider text-[11px] font-bold">
              The Arena is currently charging. Level up your Style DNA to unlock Community Battles in Phase 2.
            </p>
          </div>

          {/* User status tracker card */}
          <div className="w-full max-w-md p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-left space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <BrainCircuit size={18} className="text-[#C9A84C]" />
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">Style DNA Calibration Status</span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/30">
              <span>Required Unlock Level</span>
              <span className="text-primary font-bold">Level 10</span>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/30">
              <span>Your Identity Level</span>
              <span className="text-white font-bold">
                {user ? "Authenticated (Evaluating DNA...)" : "Guest Identity (LOCKED)"}
              </span>
            </div>

            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: user ? "40%" : "10%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-red-500/50 to-primary shadow-[0_0_10px_rgba(201,168,76,0.3)]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/shop" 
              className="btn-primary flex items-center justify-center px-10 py-4 text-[10px] font-mono tracking-widest uppercase rounded-2xl cursor-pointer"
            >
              Browse Shop
            </Link>
            <Link 
              href={user ? "/profile" : "/auth?redirect=/community"} 
              className="btn-secondary flex items-center justify-center px-10 py-4 text-[10px] font-mono tracking-widest uppercase rounded-2xl cursor-pointer"
            >
              {user ? "View Style DNA" : "Authenticate Identity"}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
