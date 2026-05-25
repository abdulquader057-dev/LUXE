"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { convertPrice, addToCart } = useCommerce();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fake random AI match score for effect
  const matchScore = Math.floor(Math.random() * 15) + 85; 

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-[#0A0A0C] border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.15,1)] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Section */}
      <Link href={`/product/${product.id}`} className="relative h-[240px] w-full overflow-hidden bg-[#0A0A0F] block">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.15,1)] ${isHovered ? 'scale-110 rotate-2' : 'scale-100 rotate-0'}`}
          style={{ backgroundImage: `url(${product.images[0]})` }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-transparent to-transparent opacity-90" />

        {/* AI Badge Top Left */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          <span className="text-[9px] font-sora font-bold text-white/90 tracking-widest">
            AI MATCH {matchScore}%
          </span>
        </div>

        {/* Heart Icon Top Right */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
            isLiked 
              ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
              : 'bg-black/40 border border-white/10 text-white/50 hover:bg-black/60 hover:text-white'
          }`}
        >
          <Heart size={14} className={isLiked ? 'fill-[#D4AF37]' : ''} />
        </button>
      </Link>

      {/* Info Section Bottom */}
      <div className="flex-1 p-5 flex flex-col justify-between relative z-10 bg-gradient-to-b from-transparent to-[#0A0A0C]">
        <div>
          <h3 className="text-[13px] font-sora font-bold text-white tracking-widest uppercase mb-1.5 line-clamp-1 group-hover:text-white/80 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] font-sora text-white/40 tracking-wider line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between">
          <div>
            {/* Fake original price for dashboard aesthetic */}
            <div className="text-[9px] font-sora text-white/30 line-through tracking-wider mb-0.5">
              {convertPrice(product.price * 1.35).symbol}{convertPrice(product.price * 1.35).amount}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-orbitron font-bold text-white tracking-wider">
                {convertPrice(product.price).symbol}{convertPrice(product.price).amount}
              </span>
              <span className="px-1.5 py-0.5 rounded-sm bg-red-500/20 text-red-400 text-[8px] font-sora font-bold tracking-widest border border-red-500/30">
                -35%
              </span>
            </div>
          </div>

          <button 
            onClick={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity: 1,
              size: "L" // Default size, product page will let them choose
            })}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center hover:bg-white hover:text-black hover:shadow-[0_5px_15px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
