"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ShoppingCart, Heart, Plus } from "lucide-react";
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
  };
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
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
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-surface border border-border-subtle rounded-radius-md overflow-hidden transition-all duration-400 group-hover:-translate-y-2 group-hover:shadow-[0_24_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,229,204,0.15)]"
      >
        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-20 px-2 py-1 glass-standard !bg-black/60 !border-white/10">
          <span className="text-[8px] font-orbitron text-white/70 tracking-widest uppercase">{product.category}</span>
        </div>

        {/* Momentum Indicator */}
        {product.momentum && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 glass-standard !bg-accent-cyan/10 !border-accent-cyan/20">
            <div className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[8px] font-orbitron text-accent-cyan tracking-widest uppercase">+{product.momentum}%</span>
          </div>
        )}

        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-black">
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-luxury bg-gradient-to-t from-black/80 to-transparent">
            <button className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-radius-sm text-black font-rajdhani font-bold text-sm tracking-[0.1em] uppercase">
              <Plus size={18} strokeWidth={2.5} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-rajdhani text-white tracking-wide uppercase truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-accent-cyan font-orbitron font-semibold text-[13px]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-text-muted font-orbitron text-[11px] line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <button className="text-text-muted hover:text-white transition-colors">
              <Heart size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
