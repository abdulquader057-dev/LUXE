"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Maximize2, Rotate3D } from "lucide-react";

interface ProductViewer3DProps {
  images: string[];
  productName: string;
}

export const ProductViewer3D = ({ images, productName }: ProductViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Physics-based motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for ultra-smooth inertia
  const rotateX = useSpring(useTransform(y, [-300, 300], [25, -25]), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-25, 25]), { damping: 30, stiffness: 100 });
  const scale = useSpring(isInteracting ? 1.05 : 1, { damping: 20, stiffness: 150 });
  
  // Dynamic lighting
  const lightX = useTransform(x, [-300, 300], ["100%", "0%"]);
  const lightY = useTransform(y, [-300, 300], ["100%", "0%"]);

  const handleDrag = (event: any, info: any) => {
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);

    // Simulate 360 spin by changing image if dragged far enough horizontally
    if (images.length > 1) {
      const threshold = 100;
      const currentX = x.get();
      if (currentX > threshold) {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
        x.set(0);
      } else if (currentX < -threshold) {
        setActiveImage((prev) => (prev + 1) % images.length);
        x.set(0);
      }
    }
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
    setIsInteracting(false);
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] perspective-[2000px] group"
      ref={containerRef}
    >
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDragStart={() => setIsInteracting(true)}
        onDrag={handleDrag}
        onDragEnd={resetPosition}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
      >
        {/* Holographic Container */}
        <div 
          className="absolute inset-0 rounded-[48px] overflow-hidden border border-white/[0.05] bg-white/[0.02] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          style={{ transform: "translateZ(0px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImage]}
                alt={`${productName} view ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Environmental Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Cinematic Hover Lighting - Reactive to Drag */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${lightX.get()} ${lightY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* 3D Floating Elements */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(80px)" }}
        >
          {/* Interaction Hint */}
          <motion.div 
            animate={{ opacity: isInteracting ? 0 : 1, y: isInteracting ? 10 : 0 }}
            className="absolute inset-0 flex items-center justify-center flex-col gap-3"
          >
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-white/50 border border-white/10 shadow-2xl animate-pulse">
              <Rotate3D size={24} />
            </div>
            <span className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
              Drag to Rotate
            </span>
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div className="bg-black/60 backdrop-blur-xl border border-primary/30 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Neural Sync 98.4%</span>
            </div>

            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all pointer-events-auto">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Shadow Floor */}
      <motion.div 
        style={{ scale }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/60 blur-2xl rounded-full pointer-events-none"
      />
    </div>
  );
};
