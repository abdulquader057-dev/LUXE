"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 glass-morphism rounded-full text-[10px] font-bold tracking-[0.2em] text-primary mb-6">
              THE FUTURE OF FASHION IS HERE
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              CYBER CULTURE <br />
              <span className="text-gradient">MODEST LUXURY.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed">
              Experience the next generation of streetwear. AI-powered styling, 
              modest aesthetics, and futuristic silhouettes for the global Gen-Z.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link href="/shop" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <button className="relative px-8 py-4 bg-background rounded-xl flex items-center gap-3 font-bold tracking-tight">
                  EXPLORE SHOP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button className="px-8 py-4 glass-morphism rounded-xl flex items-center gap-3 font-bold tracking-tight hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play size={14} fill="white" />
                </div>
                WATCH FILM
              </button>
            </div>
          </motion.div>

          {/* Stats / Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10"
          >
            {[
              { label: "COLLECTIONS", val: "24+" },
              { label: "DAILY DROPS", val: "100%" },
              { label: "AI POWERED", val: "GEN-3" },
              { label: "GLOBAL SHIPPING", val: "FREE" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[10px] font-bold tracking-widest text-white/40 mb-1">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.val}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating UI Element */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-10 hidden xl:block"
      >
        <div className="glass-morphism p-4 rounded-2xl w-64">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div>
              <p className="text-xs font-bold">ZYVORA ASSISTANT</p>
              <p className="text-[10px] text-white/50">Listening...</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/3 bg-primary" 
              />
            </div>
            <p className="text-[10px] italic text-white/40">"Finding the perfect sneakers for your style..."</p>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-[10px] font-bold tracking-widest text-white/40">SCROLL</p>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
