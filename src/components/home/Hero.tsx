"use client";

import React from "react";
import { motion } from "framer-motion";
import LuxeLogo from "../LuxeLogo";
import MagneticWrapper from "../MagneticWrapper";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10 px-6 py-24 md:py-32">
      
      {/* BACKGROUND FX: strictly contained and opacity restrained */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[40vw] h-[80vh] rounded-full mix-blend-overlay opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(224,191,184,0.3) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[50vw] h-[60vh] rounded-[40%] mix-blend-overlay opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="hero-container relative z-10 w-full max-w-5xl mx-auto">
        <div className="hero-text">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 1, 0.15, 1] }}
            className="w-full flex justify-center mb-4"
          >
            <LuxeLogo />
          </motion.div>

          {/* EDITORIAL STATEMENT */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease: [0.25, 1, 0.15, 1] }}
            className="font-cormorant font-light tracking-tight text-white leading-tight mb-2 text-[clamp(2.5rem,5vw,5rem)] w-full max-w-4xl mx-auto"
          >
            <span className="text-rose-gold font-normal italic pr-2">Where</span> obsidian meets <br />
            the blush of dawn
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: [0.25, 1, 0.15, 1] }}
            className="text-[clamp(10px,1.5vw,14px)] font-sora tracking-[0.3em] uppercase text-white/50 mb-8 w-full max-w-2xl mx-auto"
          >
            Engineered couture for the next century
          </motion.p>
        </div>

        {/* CTA BUTTON SYSTEM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1, ease: [0.25, 1, 0.15, 1] }}
          className="hero-buttons w-full"
        >
          <MagneticWrapper>
            <button className="metal-pill px-8 py-4 flex items-center justify-center gap-2 group relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_rgba(224,191,184,0.15)] w-full sm:w-auto">
              <span className="relative z-10 text-[10px] font-sora tracking-[0.2em] uppercase text-white group-hover:text-rose-gold-light transition-colors">
                Explore Collection
              </span>
            </button>
          </MagneticWrapper>
          
          <MagneticWrapper>
            <button className="glass-pill px-8 py-4 flex items-center justify-center gap-2 group transition-all duration-500 hover:bg-white/10 w-full sm:w-auto">
              <span className="relative z-10 text-[10px] font-sora tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors">
                Enter The Archive
              </span>
            </button>
          </MagneticWrapper>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
