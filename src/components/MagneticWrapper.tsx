"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Max offset 6px X, 4px Y is handled implicitly by the 0.15 multiplier, 
    // but we can clamp it to be safe
    const dx = Math.max(-6, Math.min(6, middleX * 0.15));
    const dy = Math.max(-4, Math.min(4, middleY * 0.15));
    
    setPosition({ x: dx, y: dy });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
