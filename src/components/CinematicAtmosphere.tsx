"use client";

import React from "react";
import { motion } from "framer-motion";

export const CinematicAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#05050E]">
      {/* BASE LAYER */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(circle at 50% 50%, #0D0D1A 0%, #05050E 100%)",
          transform: "translateZ(0)"
        }}
      />

      {/* OPTIMIZED AMBIENT ORBS */}
      <div className="absolute inset-0 opacity-[0.2]" style={{ transform: "translateZ(0)" }}>
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[100vw] h-[100vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(92, 43, 232, 0.4) 0%, rgba(92, 43, 232, 0) 70%)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 229, 204, 0.2) 0%, rgba(0, 229, 204, 0) 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* TEXTURE LAYER */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* VIGNETTE */}
      <div 
        className="absolute inset-0 z-[3]"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          transform: "translateZ(0)"
        }}
      />
    </div>
  );
};
