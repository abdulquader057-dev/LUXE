"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    images?: string[];
    category: string;
    momentum?: number;
    rarity?: "ULTRA RARE" | "EXCLUSIVE" | "LIMITED" | "STANDARD";
  };
  index?: number;
}

const getRarityStyles = (rarity?: string) => {
  switch (rarity) {
    case "ULTRA RARE":
      return "bg-gradient-to-r from-accent-violet to-[#9d00ff] text-white shadow-[0_0_12px_rgba(108,63,232,0.6)] animate-pulse-glow";
    case "EXCLUSIVE":
      return "bg-gradient-to-r from-[#C9A96E] to-[#F5E6C8] text-black shadow-[0_0_12px_rgba(201,169,110,0.6)] animate-pulse-glow";
    case "LIMITED":
      return "bg-accent-cyan text-black shadow-[0_0_12px_rgba(0,229,204,0.6)]";
    default:
      return "bg-white/10 text-white border border-white/20";
  }
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  
  const imageSrc = product.image || (product.images && product.images[0]) || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-[rgba(14,14,28,0.8)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] rounded-[20px] overflow-hidden transition-all duration-400 group-hover:-translate-y-[10px] group-hover:border-[rgba(0,229,204,0.18)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,229,204,0.08),0_0_30px_rgba(0,229,204,0.05)]"
      >
        {/* Rarity Tag */}
        <div className={cn(
          "absolute top-3 left-3 z-20 px-3 py-1 rounded-full backdrop-blur-[12px]",
          getRarityStyles(product.rarity || "STANDARD")
        )}>
          <span className="text-[9px] font-orbitron font-bold tracking-widest uppercase">
            {product.rarity || "STANDARD"}
          </span>
        </div>

        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-black relative">
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-[1.06]"
          />
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-[0.16,1,0.3,1] bg-gradient-to-t from-black/80 to-transparent">
            <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full text-black font-rajdhani font-bold text-[11px] tracking-[0.1em] uppercase hover:opacity-90 active:scale-95 transition-all">
              <Plus size={16} strokeWidth={2.5} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[clamp(13px,2vw,16px)] font-rajdhani font-bold text-white tracking-[0.06em] uppercase truncate max-w-full">
              {product.name}
            </h3>
            <button className="text-text-muted hover:text-[#00E5CC] transition-colors hover:-translate-y-[2px] active:scale-95" aria-label="Like">
              <Heart size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-accent-cyan font-orbitron font-medium text-[13px]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-text-muted font-orbitron text-[11px] line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
