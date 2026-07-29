"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {/* Outer Glow Ring */}
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          left: -20,
          top: -20,
        }}
        className="absolute w-8 h-8 border border-[#C9A962]/50 rounded-full opacity-60 mix-blend-difference"
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 0.6 : 0
        }}
      />

      {/* Inner Dot */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
          left: -3,
          top: -3,
        }}
        className="absolute w-2 h-2 bg-[#C9A962] rounded-full shadow-[0_0_10px_#C9A962,0_0_20px_rgba(201,169,98,0.5)] mix-blend-difference"
        animate={{
          scale: isVisible ? 1 : 0,
        }}
      />

      {/* Trailing Energy Effect */}
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          left: -40,
          top: -40,
        }}
        className="absolute w-20 h-20 bg-[#C9A962]/5 blur-[30px] rounded-full mix-blend-difference"
        animate={{
          scale: isVisible ? 1.5 : 0,
        }}
      />
    </div>
  );
};

export default CustomCursor;
