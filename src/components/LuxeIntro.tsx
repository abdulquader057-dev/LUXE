"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LuxeIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Timing structure:
    // 0-1s: Phase 1 (Environment & AI Energy Awakening)
    // 1-2s: Phase 2 (Cinematic Cloth Reveal begins)
    // 2-3s: Phase 3 (Logo Reveal)
    // 3-4s: Phase 4 (Energy Surge)
    // 4-5s: Phase 5 (Camera Fly-Through)
    // >5s: Complete

    const timers = [
      setTimeout(() => setPhase(1), 1000), // cloth
      setTimeout(() => setPhase(2), 2000), // logo
      setTimeout(() => setPhase(3), 3000), // surge
      setTimeout(() => setPhase(4), 4000), // fly-through
      setTimeout(() => {
        setPhase(5);
        onComplete();
      }, 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          key="luxe-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center pointer-events-none"
        >
          {/* Phase 1: Environment & AI Energy */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-[#0a0a0c] to-black opacity-90" />
          
          {/* Ambient Fog / Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,245,212,0.05),_transparent_60%)]"
          />

          {/* Luxury Metallic Ambient Lighting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
            transition={{ duration: 2 }}
            className="absolute top-[-20%] left-[-10%] w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.15),_transparent_70%)] mix-blend-screen"
          />

          {/* Violet Reflections & Emerald Accents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.2 : 0 }}
            transition={{ duration: 3 }}
            className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[50%] bg-[radial-gradient(circle_at_bottom_right,_rgba(108,63,232,0.2),_transparent_60%)] mix-blend-screen"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.15 : 0 }}
            transition={{ duration: 3.5 }}
            className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[60%] bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.15),_transparent_50%)] mix-blend-screen"
          />

          {/* Phase 2: Cinematic Cloth Reveal (Abstracted via gradient waves) */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={
              phase >= 1
                ? { opacity: 0.8, y: "0%" }
                : { opacity: 0, y: "100%" }
            }
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-gradient-to-t from-black via-[#111] to-transparent mix-blend-multiply opacity-80"
            style={{
              backgroundSize: "200% 200%",
              animation: "cloth-wave 4s ease infinite alternate",
            }}
          />

          {/* Phase 3 & 4: Logo Reveal & Energy Surge */}
          <div className="relative z-10 flex items-center justify-center">
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={
                  phase >= 4
                    ? { scale: 50, opacity: 0, filter: "blur(10px)" } // Phase 5: Camera Fly-Through
                    : phase >= 3
                    ? { scale: 1.05, opacity: 1, filter: "blur(0px)" } // Phase 4: Surge
                    : { scale: 1, opacity: 1, filter: "blur(0px)" } // Phase 3: Reveal
                }
                transition={
                  phase >= 4
                    ? { duration: 1.2, ease: [0.8, 0, 0.2, 1] } // Fast zoom out for fly-through
                    : { duration: 2, ease: "easeOut" }
                }
                className="relative flex items-center justify-center"
              >
                {/* Logo Text */}
                <h1 className="text-[clamp(4rem,10vw,150px)] font-display font-black tracking-[0.2em] uppercase relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#e6e6e6] to-[#808080]">
                  LUXE
                </h1>

                {/* Platinum Edge Detailing / Chrome Reflection */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.4)] to-transparent bg-clip-text text-transparent pointer-events-none"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  LUXE
                </motion.div>

                {/* Holographic Gold Energy & AI Cyan Pulse */}
                {phase >= 3 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.8, 2, 3] }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,245,212,0.4),_transparent_70%)] rounded-full mix-blend-screen"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2.5] }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.3),_transparent_70%)] rounded-full mix-blend-screen"
                    />
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Phase 4: Luxury Particle Explosion */}
          {phase >= 3 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    scale: Math.random() * 2 + 0.5,
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    ease: "easeOut",
                  }}
                  className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_15px_rgba(255,215,0,0.8)] mix-blend-screen"
                  style={{
                    backgroundColor: Math.random() > 0.6 ? "#00f5d4" : Math.random() > 0.3 ? "#ffd700" : "#6c3fe8",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
