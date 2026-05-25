"use client";

import React from "react";
import { motion } from "framer-motion";
import LuxeLogo from "../LuxeLogo";
import MagneticWrapper from "../MagneticWrapper";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10">
      
      {/* Abstract Fashion Silhouettes / Ambient Motion in Hero */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft floating geometry representing structural couture */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[40vw] h-[80vh] rounded-full mix-blend-overlay opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(224,191,184,0.4) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[60vh] rounded-[40%] mix-blend-overlay opacity-15"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.3) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mt-12">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 1, 0.15, 1] }}
          className="w-full flex justify-center mb-8"
        >
          <LuxeLogo />
        </motion.div>

        {/* EDITORIAL STATEMENT */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1, ease: [0.25, 1, 0.15, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-cormorant font-light tracking-tight text-primary leading-tight mb-6"
        >
          <span className="text-rose-gradient font-normal italic pr-2">Where</span> obsidian meets <br />
          the blush of dawn
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1, ease: [0.25, 1, 0.15, 1] }}
          className="text-sm md:text-base font-sora tracking-[0.3em] uppercase text-white/50 mb-16 max-w-2xl"
        >
          Engineered couture for the next century
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 1, ease: [0.25, 1, 0.15, 1] }}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center"
        >
          <MagneticWrapper>
            <button className="btn-primary group relative overflow-hidden">
              <span className="relative z-10 text-black">Explore Collection</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-[cubic-bezier(0.25,1,0.15,1)]" />
            </button>
          </MagneticWrapper>
          
          <MagneticWrapper>
            <button className="btn-secondary group">
              <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500">Enter The Archive</span>
              <div className="absolute inset-0 bg-rose-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </MagneticWrapper>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity"
      >
        <span className="font-sora text-[8px] uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [-48, 48] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-rose-gold-light"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
