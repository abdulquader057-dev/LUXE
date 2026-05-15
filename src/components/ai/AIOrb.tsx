"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AIOrbProps {
  isListening?: boolean;
  isProcessing?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const AIOrb = ({ isListening, isProcessing, size = "md" }: AIOrbProps) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-56 h-56",
    xl: "w-80 h-80",
  };

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center perspective-1000`}>
      {/* Background Volumetric Glow */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.4, 1] : [1, 1.1, 1],
          opacity: isListening ? [0.4, 0.7, 0.4] : [0.2, 0.3, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-primary blur-[80px]"
      />
      
      {/* Secondary Accent Glow */}
      <motion.div
        animate={{
          scale: isProcessing ? [1, 1.3, 1] : 1,
          opacity: isProcessing ? 0.4 : 0.1,
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-full bg-secondary blur-[60px]"
      />

      {/* Outer Holographic Rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          animate={{ 
            rotate: ring % 2 === 0 ? 360 : -360,
            scale: isListening ? [1, 1.05, 1] : 1
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 10 + ring * 5, ease: "linear" },
            scale: { repeat: Infinity, duration: 2 }
          }}
          className={`absolute inset-${ring * 4} border border-primary/20 rounded-full`}
          style={{ 
            boxShadow: `0 0 20px rgba(0, 242, 255, ${0.1 / ring})`,
            transform: `translateZ(${ring * 10}px)`
          }}
        />
      ))}

      {/* Animated Core */}
      <motion.div
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 180, 0],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/10 shadow-[inset_0_0_50px_rgba(0,242,255,0.2)]"
      >
        {/* Internal Nebula Effect */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0 opacity-60 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 blur-xl"
          style={{ backgroundSize: "200% 200%" }}
        />

        {/* Neural Network Lines (Mock) */}
        <div className="absolute inset-0 opacity-20 cyber-grid" />
        
        {/* Center Sparkle */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-1/4 h-1/4 bg-white rounded-full blur-2xl relative z-10"
        />
      </motion.div>

      {/* Floating Data Bits */}
      <AnimatePresence>
        {(isListening || isProcessing) && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: Math.cos(i * (45 * Math.PI / 180)) * 100,
                  y: Math.sin(i * (45 * Math.PI / 180)) * 100
                }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#00f2ff]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Audio Waveform */}
      {isListening && (
        <div className="absolute -bottom-16 flex items-end gap-1.5 h-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: ["20%", "100%", "30%", "80%", "20%"],
                backgroundColor: ["#00f2ff", "#ff00ff", "#00f2ff"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.8, 
                delay: i * 0.05,
                ease: "easeInOut"
              }}
              className="w-1.5 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.5)]"
            />
          ))}
        </div>
      )}
    </div>
  );
};
