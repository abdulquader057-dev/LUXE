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
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ 
        duration: 1, 
        delay: index * 0.1,
        ease: [0.25, 1, 0.15, 1] 
      }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-bg-surface border border-white/5 rounded-sm overflow-hidden transition-all duration-[800ms] ease-luxury group-hover:-translate-y-2 group-hover:border-rose-gold-light/20 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
      >
        {/* Image Container with Fabric Texture Hover */}
        <div className="aspect-[3/4] overflow-hidden bg-bg-elevated relative fabric-texture">
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.25,1,0.15,1] group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-bg-base/10 group-hover:bg-transparent transition-colors duration-[1s]" />

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,1,0.15,1] bg-gradient-to-t from-bg-base/90 to-transparent">
            <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-white text-black font-sora font-medium text-[10px] tracking-[0.2em] uppercase hover:bg-rose-gold-light transition-colors">
              <Plus size={14} strokeWidth={1.5} />
              Acquire
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[9px] font-sora uppercase tracking-[0.3em] text-white/40 block mb-2">
                {product.category}
              </span>
              <h3 className="text-lg font-cormorant font-light text-white tracking-wide truncate max-w-full group-hover:text-rose-gold-light transition-colors">
                {product.name}
              </h3>
            </div>
            <button className="text-white/40 hover:text-rose-gold-light transition-colors" aria-label="Like">
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-sora text-[11px] tracking-widest text-white/90">
              USD {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-white/30 font-sora text-[10px] line-through tracking-widest">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
