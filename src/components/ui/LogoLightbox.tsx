"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LogoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoLightbox({ isOpen, onClose }: LogoLightboxProps) {
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Reset scale when opened
  useEffect(() => {
    if (isOpen) setScale(1);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      const newScale = prev - e.deltaY * 0.005;
      return Math.min(Math.max(newScale, 1), 2.5);
    });
  };

  // Handle Touch Pinch Zoom
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);

  const getDistance = (touches: React.TouchList) => {
    const [t1, t2] = [touches[0], touches[1]];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistanceRef.current = getDistance(e.touches);
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistanceRef.current) {
      e.preventDefault(); // Prevent scrolling
      const currentDistance = getDistance(e.touches);
      const diff = currentDistance / initialDistanceRef.current;
      const newScale = initialScaleRef.current * diff;
      setScale(Math.min(Math.max(newScale, 1), 2.5));
    }
  };

  const handleTouchEnd = () => {
    initialDistanceRef.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: "rgba(10, 10, 12, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          onClick={onClose}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 z-50 text-[12px] font-mono transition-colors duration-300"
            style={{ color: "var(--color-muted, #6B655D)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-offwhite, #F5F0E8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted, #6B655D)")}
          >
            ✕ CLOSE
          </button>

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking logo
          >
            <motion.div
              animate={{ scale }}
              transition={{ ease: "easeOut", duration: 0.1 }}
              className="relative"
            >
              <Image
                ref={imageRef as any}
                src="/brand/luxe-logo-full.webp"
                alt="LUXE THREADS Full Logo"
                width={1200}
                height={1200}
                className="w-full h-auto max-w-[95vw] md:max-w-[60vw] max-h-[85vh] object-contain shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
