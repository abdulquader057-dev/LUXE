"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["L", "U", "X", "E"];

const EntranceAnimation = () => {
  const [phase, setPhase] = useState<"logo" | "split" | "done">("logo");
  const [show, setShow] = useState(true);

  useEffect(() => {
    const splitTimer = setTimeout(() => setPhase("split"), 2600);
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
          className="fixed inset-0 z-[100000]"
        >
          {/* ── TOP PANEL — solid black, slides up on split */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{ background: "#0A0A0F", zIndex: 10 }}
            animate={phase === "split" ? { y: "-100%" } : { y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
              delay: phase === "split" ? 0.05 : 0,
            }}
          />

          {/* ── BOTTOM PANEL — solid black, slides down on split */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "#0A0A0F", zIndex: 10 }}
            animate={phase === "split" ? { y: "100%" } : { y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
              delay: phase === "split" ? 0.05 : 0,
            }}
          />

          {/* ── DOT GRID — above panels, split with them via z-index */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(201,168,76,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              zIndex: 9,
            }}
          />

          {/* ── LOGO LAYER — centered, above panels, never clipped */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 20 }}
            animate={phase === "split" ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gold orb glow behind text */}
            <div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
              }}
            />

            {/* LUXE letters — letter-by-letter rotateX flip */}
            <div className="flex items-center" style={{ gap: "0.05em" }}>
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={letter + i}
                  initial={{ rotateX: 90, y: 15, opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.3 + i * 0.1,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(48px, 9vw, 80px)",
                    fontWeight: 300,
                    letterSpacing: "0.12em",
                    lineHeight: 1,
                    background:
                      "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #9A7B30 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transformOrigin: "center bottom",
                    filter: "drop-shadow(0 0 30px rgba(201,168,76,0.25))",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Gold shimmer line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "140px", opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-5"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)",
              }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "140px" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "linear",
                  delay: 1.0,
                }}
                className="absolute top-[-1px] left-0 w-8"
                style={{
                  height: "3px",
                  background: "#E8C97A",
                  boxShadow: "0 0 10px rgba(232,201,122,0.7)",
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-col items-center mt-5"
              style={{ gap: "6px" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,232,0.75)",
                }}
              >
                Premium Indian Fashion
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  color: "rgba(201,168,76,0.55)",
                }}
              >
                Hyderabad · Est. 2026
              </div>
            </motion.div>
          </motion.div>

          {/* ── GOLD FLASH just before split */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{ delay: 2.4, duration: 0.35 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(201,168,76,0.18)", zIndex: 30 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntranceAnimation;
