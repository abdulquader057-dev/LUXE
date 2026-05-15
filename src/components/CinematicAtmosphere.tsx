"use client";

import React from "react";
import { motion } from "framer-motion";

export const CinematicAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. BASE LAYER: Deep Obsidian Radial Gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(circle at center, #0D0D1A 0%, #05050E 100%)"
        }}
      />

      {/* 2. AMBIENT ORB LAYER */}
      {/* Orb 1: Soft Violet */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] rounded-full"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(92,43,232,0.15) 0%, rgba(92,43,232,0) 70%)",
        }}
        animate={{
          x: [0, 200, 0],
          y: [0, 150, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 2: Cyan */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] rounded-full"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,229,204,0.12) 0%, rgba(0,229,204,0) 70%)",
        }}
        animate={{
          x: [0, -150, 0],
          y: [0, -200, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 3: Deep Indigo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "900px",
          background: "radial-gradient(circle, rgba(26,10,74,0.2) 0%, rgba(26,10,74,0) 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. TEXTURE LAYER: Removed SVG feTurbulence for performance */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. GRID LAYER: Ultra-faint diagonal grid */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />

      {/* VIGNETTE LAYER */}
      <div 
        className="absolute inset-0 z-[3]"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)"
        }}
      />
    </div>
  );
};
