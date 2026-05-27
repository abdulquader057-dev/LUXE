"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Maximize2, Rotate3d, ZoomIn, ZoomOut, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  selectedColor?: string;
  currentIndex?: number;
  onChangeIndex?: (index: number) => void;
}

const getColorFilter = (colorName: string) => {
  return "none"; // Filters are removed to ensure natural colors and prevent background/skin tone shifts
};

export const ProductViewer3D = ({ 
  images, 
  productName, 
  selectedColor = "White",
  currentIndex = 0,
  onChangeIndex
}: ProductViewer3DProps) => {
  const modelImages = images && images.length > 0 ? images : [
    "/brand/linen_model_front.png",
    "/brand/linen_model_back.png",
    "/brand/linen_model_side.png"
  ];

  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startIndex = useRef(0);
  const startPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync selectedColor index if available
  useEffect(() => {
    // Reset zoom and pan on color change
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedColor]);

  // Sync internalIndex with prop
  useEffect(() => {
    setInternalIndex(currentIndex);
  }, [currentIndex]);

  const updateIndex = (newIndex: number) => {
    setInternalIndex(newIndex);
    if (onChangeIndex) {
      onChangeIndex(newIndex);
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    startIndex.current = internalIndex;
    startPosition.current = { x: position.x, y: position.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    if (scale === 1) {
      // Rotate Turntable
      const deltaX = clientX - dragStart.current.x;
      const step = 60; // pixels of drag per step
      const offset = Math.floor(deltaX / step);
      const newIndex = (startIndex.current - offset + modelImages.length * 10) % modelImages.length;
      if (newIndex !== internalIndex) {
        updateIndex(newIndex);
      }
    } else {
      // Pan image
      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;
      setPosition({
        x: startPosition.current.x + deltaX / scale,
        y: startPosition.current.y + deltaY / scale
      });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.5));
    toast.success("Zoom level increased", { duration: 800 });
  };

  const zoomOut = () => {
    setScale(prev => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) setPosition({ x: 0, y: 0 }); // reset pan on full zoom out
      return next;
    });
    toast.success("Zoom level decreased", { duration: 800 });
  };

  const viewModeLabel = () => {
    if (internalIndex === 0) return "Front Angle";
    if (internalIndex === 1) return "Rear Profile";
    return "Side Profile";
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-[48px] overflow-hidden bg-[#050508] border border-white/10 group cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
    >
      {/* Dynamic Colored Image Turntable */}
      <div 
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: "center center"
        }}
      >
        <Image
          src={modelImages[internalIndex]}
          alt={`${productName} - ${viewModeLabel()}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
          style={{ 
            filter: "none" 
          }}
        />
        
        {/* Soft Luxury Vignette shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Floating Zoom & Helper HUD Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-white hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-white hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        {scale > 1 && (
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center animate-pulse">
            <Move size={18} />
          </div>
        )}
      </div>

      {/* Angle Selector Indicators */}
      <div className="absolute top-6 left-6 flex gap-2 z-20">
        {modelImages.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); updateIndex(idx); }}
            className={`px-3 py-1.5 rounded-full text-[8px] font-mono border uppercase tracking-widest transition-all cursor-pointer ${
              internalIndex === idx 
                ? "bg-primary text-black border-primary font-bold shadow-[0_0_15px_#00f2ff]" 
                : "bg-black/40 text-white/50 border-white/10 hover:text-white"
            }`}
          >
            {idx === 0 ? "Front" : idx === 1 ? "Back" : "Side"}
          </button>
        ))}
      </div>

      {/* Bottom Status Labels */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-20">
        <div className="bg-black/60 backdrop-blur-xl border border-primary/30 px-5 py-2.5 rounded-full flex flex-col gap-1 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <Rotate3d size={14} className="text-primary animate-spin" style={{ animationDuration: "10s" }} />
            <span className="text-[9px] font-mono tracking-[0.25em] text-primary uppercase font-bold">
              {viewModeLabel()}
            </span>
          </div>
          <span className="text-[7px] font-mono text-white/40 tracking-wider uppercase ml-6">
            Drag to Rotate Turntable // {scale > 1 ? "Drag to Pan" : "Zoom in for details"}
          </span>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full flex items-center gap-2 pointer-events-auto">
          <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
            Color: <span className="text-primary font-bold">{selectedColor}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
