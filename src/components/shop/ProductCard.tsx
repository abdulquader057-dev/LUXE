"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });
  
  const imageSrc = product.image || (product.images && product.images[0]) || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For cursor spotlight
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Subtle Parallax Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 40; // reduced tilt for stability
    const rotateY = (centerX - x) / 40;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ 
        duration: 1.2, 
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1] // ease-cinematic
      }}
      className="group perspective-1000 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="relative bg-bg-surface border border-white/5 rounded-sm overflow-hidden h-full flex flex-col cursor-spotlight-card"
      >
        {/* Image Container with Fabric Texture Hover */}
        <div className="aspect-[3/4] overflow-hidden bg-bg-elevated relative fabric-texture flex-shrink-0">
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.25,1,0.5,1] group-hover:scale-[1.03]"
          />
          
          {/* Layered Fog Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-rose-gold/0 group-hover:bg-rose-gold/5 transition-colors duration-[1.5s] mix-blend-overlay" />
        </div>

        {/* Card Info - Typography Isolation & Spatial Depth */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-8 frosted-wrapper border-t border-white/5 z-10 relative">
          <div className="relative z-10">
            <span className="text-[9px] font-sora uppercase tracking-[0.4em] text-white/30 block mb-3">
              {product.category}
            </span>
            <h3 className="text-xl md:text-2xl font-cormorant font-light text-white tracking-wide leading-tight group-hover:text-rose-gold transition-colors duration-700">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10 w-full mt-4">
            <div className="flex items-center gap-4">
              <span className="font-sora text-[10px] tracking-[0.3em] text-white/70 shadow-sm">
                USD {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-white/20 font-sora text-[9px] line-through tracking-[0.3em]">
                  {product.originalPrice}
                </span>
              )}
            </div>
            {/* Contained Footer Action Buttons */}
            <motion.button 
              whileTap={{ scale: 0.96 }}
              className="glass-pill px-4 py-2 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus size={12} strokeWidth={1.5} />
              <span className="font-sora text-[9px] tracking-[0.2em] uppercase whitespace-nowrap">Acquire</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
