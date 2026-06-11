"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-transparent text-text-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-10 glass-luxury p-12 border border-white/5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary">
          <Compass size={28} className="animate-spin-slow" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-display font-black tracking-tighter text-white">404</h1>
          <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-primary uppercase pl-[0.4em]">
            Archive Protocol Breached
          </p>
          <p className="text-sm text-white/40 leading-relaxed font-medium">
            The artifact you seek has been dereferenced, archived, or moved to another secure storage block.
          </p>
        </div>

        <div className="w-16 h-[1px] bg-white/10 mx-auto" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-xl bg-white text-black font-mono font-bold text-[10px] tracking-widest uppercase hover:bg-[#D4AF37] hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Compass size={14} /> Re-enter Catalog
          </Link>
          <Link
            href="/"
            className="px-8 py-4 rounded-xl border border-white/10 font-mono font-bold text-[10px] tracking-widest uppercase hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
