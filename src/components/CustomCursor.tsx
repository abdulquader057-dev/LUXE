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
        className="w-10 h-10 border border-accent-cyan/30 rounded-full opacity-60"
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
        className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#00E5CC]"
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
        className="w-20 h-20 bg-accent-cyan/5 blur-[30px] rounded-full"
        animate={{
          scale: isVisible ? 1.5 : 0,
        }}
      />
    </div>
  );
};

export default CustomCursor;
