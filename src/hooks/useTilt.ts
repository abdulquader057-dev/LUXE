"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useTilt - React hook for 3D tilt hover effect.
 * Tracks mouse position over element and returns transform style.
 * Accepts maxAngle parameter.
 * Disabled on touch devices and prefers-reduced-motion.
 */
export function useTilt(maxAngle: number = 10) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = 
      window.matchMedia("(pointer: coarse)").matches || 
      ("ontouchstart" in window) || 
      (navigator.maxTouchPoints > 0);
    
    if (prefersReduced || isTouch) {
      setIsDisabled(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) return;

      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = -((y - centerY) / centerY) * maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
        willChange: "transform",
      });
    },
    [maxAngle, isDisabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (isDisabled) return;
    
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.5s ease-out",
      willChange: "transform",
    });
  }, [isDisabled]);

  return {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: isDisabled ? {} : style,
  };
}
