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
        className="absolute top-[-10%] left-[-10%] rounded-full opacity-[0.18]"
        style={{
          width: "700px",
          height: "700px",
          background: "#5C2BE8",
          filter: "blur(200px)",
        }}
        animate={{
          x: [0, 400, 0],
          y: [0, 300, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 2: Cyan */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] rounded-full opacity-[0.12]"
        style={{
          width: "500px",
          height: "500px",
          background: "#00E5CC",
          filter: "blur(160px)",
        }}
        animate={{
          x: [0, -300, 0],
          y: [0, -400, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 3: Deep Indigo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.25]"
        style={{
          width: "900px",
          height: "900px",
          background: "#1A0A4A",
          filter: "blur(240px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. TEXTURE LAYER: SVG feTurbulence Noise Grain */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="4" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

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
