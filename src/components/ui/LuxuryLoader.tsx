"use client";

import React from "react";
import { motion } from "framer-motion";

interface LuxuryLoaderProps {
  label?: string;
}

export default function LuxuryLoader({ label = "Synthesizing Luxe Architecture" }: LuxuryLoaderProps) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 bg-gradient-to-r from-primary to-accent" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative w-20 h-20">
          {/* Inner pulsating circle */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-2 rounded-full border border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(201, 169, 98,0.1)]"
          />
          {/* Outer rotating luxury border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-t border-b border-[#D4AF37] border-l-transparent border-r-transparent"
          />
          {/* Tiny orbital node */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0 shadow-[0_0_10px_#fff]" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-mono font-bold tracking-[0.4em] text-white uppercase text-center pl-[0.4em]"
          >
            {label}
          </motion.p>
          <div className="w-24 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
