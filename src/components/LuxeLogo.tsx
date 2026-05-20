"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuxeX } from "./LuxeX";
import { cn } from "@/lib/utils";

interface LuxeLogoProps {
  className?: string;
  showTagline?: boolean;
}

const LuxeLogo = ({ className, showTagline = true }: LuxeLogoProps) => {
  const letterTransition = (delay: number) => ({
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: delay,
  });

  return (
    <div className={cn("flex flex-col items-center justify-center select-none", className)}>
      {/* Main Logo Composition: L U X E */}
      <div className="flex items-end gap-2 md:gap-4 relative z-brand h-[96px]">
        {/* L */}
        <motion.span
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={letterTransition(1.6)}
          className="text-7xl md:text-[72px] font-bebas text-gold-gradient logo-text-shadow leading-none"
        >
          L
        </motion.span>

        {/* U */}
        <motion.span
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={letterTransition(1.7)}
          className="text-7xl md:text-[72px] font-bebas text-gold-gradient logo-text-shadow leading-none"
        >
          U
        </motion.span>

        {/* X (Animated SVG) */}
        <LuxeX className="mb-1" />

        {/* E */}
        <motion.span
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={letterTransition(2.1)}
          className="text-7xl md:text-[72px] font-bebas text-gold-gradient logo-text-shadow leading-none"
        >
          E
        </motion.span>
      </div>

      {/* by SYEDS Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        className="flex flex-col items-center mt-2 relative z-brand"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.4, duration: 0.4 }}
            className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[rgba(201,169,110,0.5)] origin-right" 
          />
          <span className="font-cormorant italic text-sm md:text-base text-[rgba(201,169,110,0.75)] tracking-[0.35em]">by</span>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.4, duration: 0.4 }}
            className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[rgba(201,169,110,0.5)] origin-left" 
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-rajdhani font-semibold text-lg md:text-xl text-[rgba(201,169,110,0.9)] tracking-[0.45em] uppercase">S</span>
          <LuxeX isSmall delayOffset={0.3} className="scale-[0.55]" />
          <span className="font-rajdhani font-semibold text-lg md:text-xl text-[rgba(201,169,110,0.9)] tracking-[0.45em] uppercase">EDS</span>
        </div>
      </motion.div>

      {/* Tagline */}
      {showTagline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-6 text-[10px] md:text-xs font-rajdhani text-white/40 tracking-[0.6em] uppercase text-center"
        >
          <TypewriterText text="Beyond Luxury. Beyond Imaginable." delay={2500} />
        </motion.div>
      )}
    </div>
  );
};

const TypewriterText = ({ text, delay }: { text: string; delay: number }) => {
  const [displayed, setDisplayed] = React.useState("");
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-[10px] bg-accent-cyan ml-1 align-middle"
      />
    </span>
  );
};

export default LuxeLogo;
