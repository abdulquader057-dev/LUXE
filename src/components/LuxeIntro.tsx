"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LuxeLogo from "./LuxeLogo";
import { CinematicAtmosphere } from "./CinematicAtmosphere";
import { cn } from "@/lib/utils";
import Image from "next/image";

const LuxeIntro = () => {
  const [phase, setPhase] = useState(0); // 0: Void, 1: First Light, 2: Atmosphere, 3: Logo, 4: Scan, 5: UI Reveal, 6: Complete
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // PHASE 1: THE VOID (0-400ms)
    const t1 = setTimeout(() => setPhase(1), 400);
    
    // PHASE 2: FIRST LIGHT (400-900ms)
    const t2 = setTimeout(() => setPhase(2), 900);
    
    // PHASE 3: ATMOSPHERE (900-1600ms)
    const t3 = setTimeout(() => setPhase(3), 1600);
    
    // PHASE 4: BRAND REVEAL (1600-2900ms)
    const t4 = setTimeout(() => setPhase(4), 2900);
    
    // PHASE 5: SCAN LINE (2900-3300ms)
    const t5 = setTimeout(() => setPhase(5), 3300);
    
    // PHASE 6: UI FADE (3300-3800ms)
    const t6 = setTimeout(() => {
      setPhase(6);
      // Wait for UI animations to settle
      setTimeout(() => setIsFinished(true), 1000);
    }, 3800);

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, []);

  if (isFinished) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#07070F] overflow-hidden flex items-center justify-center">
      {/* PHASE 3+: Living Atmosphere */}
      {phase >= 2 && <CinematicAtmosphere />}

      {/* PHASE 2: First Light Line */}
      {phase >= 1 && phase < 5 && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100vw", opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-1/2 left-0 h-[1px] -translate-y-1/2 z-deco"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)"
          }}
        />
      )}

      {/* PHASE 2: Radial Gold Glow */}
      {phase >= 1 && phase < 6 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full z-bg pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)"
          }}
        />
      )}

      {/* PHASE 3: Fashion Silhouette Wipe */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 0.55, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 top-0 h-full w-1/3 z-editorial pointer-events-none hidden md:block"
        >
          <Image 
            src="/fashion-silhouette.jpg" 
            alt="Fashion Silhouette" 
            fill
            sizes="33vw"
            className="h-full w-full object-cover grayscale"
          />
        </motion.div>
      )}

      {/* PHASE 4: Brand Reveal */}
      {phase >= 3 && (
        <div className="relative z-brand">
          <LuxeLogo />
          
          {/* Neural Synthesis Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-[8px] font-orbitron text-accent-cyan tracking-[0.4em] uppercase"
          >
            Neural Synthesis Active
          </motion.div>
        </div>
      )}

      {/* PHASE 5: Scan Line Sweep */}
      {phase >= 4 && (
        <motion.div
          initial={{ translateY: "-100vh" }}
          animate={{ translateY: "100vh" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent z-max"
        />
      )}

      {/* Global Transition Out */}
      <AnimatePresence>
        {phase === 6 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-transparent z-[10000] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxeIntro;
