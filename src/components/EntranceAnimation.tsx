"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["L", "U", "X", "E"];

const EntranceAnimation = () => {
  const [phase, setPhase] = useState<"logo" | "split" | "done">("logo");
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Step 2: trigger gold shimmer + split after logo reveals
    const splitTimer = setTimeout(() => setPhase("split"), 2600);
    // Step 3: remove entirely
    const doneTimer = setTimeout(() => {
      setPhase("done");
      setShow(false);
      window.dispatchEvent(new CustomEvent("open-country-modal"));
    }, 3600);
    return () => {
      clearTimeout(splitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100000] overflow-hidden"
          style={{ background: "#0A0A0F" }}
        >
          {/* Subtle dot grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(201,168,76,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Gold orb glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }}
          />

          {/* ── TOP HALF (for split) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 flex items-end justify-center pb-4"
            style={{ background: "#0A0A0F", zIndex: 10 }}
            animate={phase === "split" ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: phase === "split" ? 0.1 : 0 }}
          >
            {/* Top half of LUXE logo */}
            <div className="flex items-end gap-0 overflow-hidden" style={{ height: "60px" }}>
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={letter + i}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.3 + i * 0.09,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="block"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(56px, 10vw, 100px)",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #9A7B30 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transformOrigin: "bottom",
                    display: "inline-block",
                    paddingLeft: i === 0 ? 0 : "0.02em",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* ── BOTTOM HALF (for split) */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 flex items-start justify-center pt-4"
            style={{ background: "#0A0A0F", zIndex: 10 }}
            animate={phase === "split" ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: phase === "split" ? 0.1 : 0 }}
          >
            {/* Tagline + bar */}
            <div className="flex flex-col items-center gap-4 mt-2">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] relative"
                style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)" }}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200px" }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "linear", delay: 1.0 }}
                  className="absolute top-[-1px] left-0 w-8 h-[3px]"
                  style={{ background: "#E8C97A", boxShadow: "0 0 10px rgba(232,201,122,0.6)" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="text-[10px] uppercase tracking-[0.4em]"
                  style={{ fontFamily: "var(--font-sora)", color: "rgba(240,237,232,0.7)" }}
                >
                  Premium Indian Fashion
                </div>
                <div
                  className="text-[8px] tracking-[0.25em]"
                  style={{ fontFamily: "var(--font-sora)", color: "rgba(201,168,76,0.5)" }}
                >
                  Hyderabad · Est. 2026
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Flash before split */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ delay: 2.4, duration: 0.4 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(201,168,76,0.2)", zIndex: 20 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntranceAnimation;
