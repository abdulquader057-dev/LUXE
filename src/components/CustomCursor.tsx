"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<"default" | "hover" | "image" | "text">("default");
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the lag effect (Outer Ring)
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      
      if (target.closest("button, a, .interactive")) {
        setCursorState("hover");
      } else if (target.closest("img, .image-cursor")) {
        setCursorState("image");
      } else if (target.closest("h1, h2, h3, p, .text-cursor")) {
        setCursorState("text");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden lg:block">
      {/* OUTER RING: 36px circle with 80ms lag */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border-[1.5px] border-primary/50 mix-blend-difference flex items-center justify-center overflow-hidden"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorState === "hover" ? "50px" : cursorState === "image" ? "40px" : cursorState === "text" ? "2px" : "36px",
          height: cursorState === "hover" ? "50px" : cursorState === "image" ? "40px" : cursorState === "text" ? "24px" : "36px",
          borderRadius: cursorState === "image" ? "0%" : cursorState === "text" ? "4px" : "50%",
          rotate: cursorState === "image" ? 45 : 0,
          backgroundColor: cursorState === "hover" ? "rgba(0, 229, 204, 0.15)" : "transparent",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 150,
          mass: 0.5
        }}
      >
        {cursorState === "image" && (
          <span className="text-[8px] font-black tracking-widest text-primary rotate-[-45deg]">VIEW</span>
        )}
      </motion.div>

      {/* INNER DOT: 6px circle following precisely */}
      <motion.div
        className="absolute top-0 left-0 w-[6px] h-[6px] bg-primary rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: cursorState === "text" ? 0 : 1,
        }}
      />
    </div>
  );
};
