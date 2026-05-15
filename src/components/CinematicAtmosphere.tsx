"use client";

import React from "react";
import { motion } from "framer-motion";

export const CinematicAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#05050E]">
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
        className="absolute top-[-10%] left-[-10%] rounded-full opacity-[0.15]"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background: "#5C2BE8",
          filter: "blur(150px)",
          willChange: "transform, opacity",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 2: Cyan */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] rounded-full opacity-[0.1]"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "500px",
          maxHeight: "500px",
          background: "#00E5CC",
          filter: "blur(120px)",
          willChange: "transform, opacity",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 3: Deep Indigo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.2]"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: "800px",
          maxHeight: "800px",
          background: "#1A0A4A",
          filter: "blur(180px)",
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. TEXTURE LAYER: CSS Grain (Lighter than SVG feTurbulence) */}
      <div className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* 4. GRID LAYER: Ultra-faint diagonal grid */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px"
        }}
      />

      {/* VIGNETTE LAYER */}
      <div 
        className="absolute inset-0 z-[3]"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)"
        }}
      />
    </div>
  );
};
