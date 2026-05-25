"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#050508] border border-white/5 mb-8 min-h-[400px] flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      
      {/* Background Cyberpunk Image layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen transition-transform duration-[10s] hover:scale-105"
        style={{ backgroundImage: "url('/hero-1.jpg')" }}
      />
      
      {/* Gradients to blend image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent z-0" />
      
      {/* Cyberpunk Glow Rings behind model */}
      <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[2px] border-[#00F0FF]/30 shadow-[0_0_40px_rgba(0,240,255,0.2)] z-0" />
      <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-[1px] border-[#B52BFF]/20 shadow-[0_0_60px_rgba(181,43,255,0.1)] z-0" />

      <div className="relative z-10 w-full px-8 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Content: The Archive */}
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <h1 className="text-[clamp(3rem,6vw,6rem)] font-bebas leading-[0.85] tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
              THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B52BFF] to-[#00F0FF]">ARCHIVE.</span>
            </h1>
            
            <p className="text-[11px] font-sora text-white/50 tracking-widest leading-relaxed mb-8 max-w-sm">
              Synthesized by LUXE Intelligence. <br/>
              Engineered for the future. <br/>
              Explore the global digital wardrobe.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="px-8 py-3 rounded-md bg-gradient-to-r from-[#B52BFF] to-[#00F0FF] text-white text-[10px] font-sora font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95">
                Explore Now
              </button>
              
              <button className="px-8 py-3 rounded-md bg-white/5 border border-white/10 text-white text-[10px] font-sora font-bold tracking-widest uppercase transition-all hover:bg-white/10 flex items-center gap-2 group">
                AI Stylist
                <Sparkles size={14} className="text-[#00F0FF] group-hover:animate-pulse" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Content: Data Widgets */}
        <div className="hidden lg:flex flex-col gap-4 min-w-[200px]">
          
          {/* Widget 1 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#050508]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />
            <div className="text-[9px] font-sora text-[#00F0FF] tracking-widest font-bold mb-2">STYLE MATCH</div>
            <div className="text-3xl font-orbitron font-bold text-white">98<span className="text-sm text-white/50">%</span></div>
          </motion.div>

          {/* Widget 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-[#050508]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B52BFF] to-transparent opacity-50" />
            <div className="text-[9px] font-sora text-[#B52BFF] tracking-widest font-bold mb-2">TRENDING</div>
            <div className="text-3xl font-orbitron font-bold text-white flex items-center gap-2">
              #1
              <TrendingUp size={20} className="text-[#B52BFF]" />
            </div>
          </motion.div>

          {/* Widget 3 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-[#050508]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="text-[9px] font-sora text-white/50 tracking-widest font-bold mb-3">AI RECOMMENDED</div>
            <div className="flex items-end justify-center gap-1.5 h-6 w-full">
              {[40, 70, 45, 90, 60, 30, 80, 50].map((h, i) => (
                <div key={i} className="w-1.5 bg-[#00F0FF] rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
