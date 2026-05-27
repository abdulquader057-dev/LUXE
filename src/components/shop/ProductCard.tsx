"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[] | string | any;
  category: string;
  isNew?: boolean;
  stock?: number;
}

// Safely extract first image from either array, JSON string, or plain URL
function getFirstImage(images: any): string {
  const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
  if (!images) return fallback;
  if (Array.isArray(images)) return images[0] || fallback;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed[0] || fallback;
      return String(parsed) || fallback;
    } catch {
      return images || fallback;
    }
  }
  return fallback;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { convertPrice, addToCart } = useCommerce();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const imageUrl = getFirstImage(product.images);
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
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg bg-black/90 uppercase">
              Unavailable
            </span>
          </div>
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-20" />

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

          {product.stock === 0 ? (
            <span className="text-[9px] font-mono font-bold text-red-500/60 uppercase tracking-widest px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-lg">
              N/A
            </span>
          ) : (
            <button 
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: imageUrl,
                quantity: 1,
                size: "L"
              })}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center hover:bg-white hover:text-black hover:shadow-[0_5px_15px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
