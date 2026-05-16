"use client";

import React from "react";
import { motion } from "framer-motion";

export const CinematicAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-bg pointer-events-none overflow-hidden select-none atmosphere-base">
      {/* BASE LAYER is handled by atmosphere-base class */}

      {/* AMBIENT ORB LAYER */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1: Violet */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, #5C2BE8 0%, transparent 70%)",
            filter: "blur(200px)",
            opacity: 0.18,
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 2: Cyan-teal */}
        <motion.div
          className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, #00E5CC 0%, transparent 70%)",
            filter: "blur(160px)",
            opacity: 0.12,
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 3: Deep indigo */}
        <motion.div
          className="absolute top-1/2 -right-[20%] w-[900px] h-[900px] rounded-full translate-y-[-50%]"
          style={{
            background: "radial-gradient(circle, #1A0A4A 0%, transparent 70%)",
            filter: "blur(240px)",
            opacity: 0.25,
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
      </div>

      {/* TEXTURE LAYER */}
      <div className="noise-grain" />

      {/* GRID LAYER */}
      <div className="absolute inset-0 z-[1] grid-overlay opacity-[0.025]" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 z-[2] vignette-overlay" />
    </div>
  );
};
