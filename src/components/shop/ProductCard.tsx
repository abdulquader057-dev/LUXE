"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Plus, Activity, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import Link from "next/link";
import { Magnetic } from "../ui/Magnetic";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block outline-none">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={!isMobile ? { rotateX, rotateY, perspective: "1000px" } : {}}
          className={cn(
            "relative bg-black/40 backdrop-blur-xl rounded-sm overflow-hidden border border-white/5 transition-all duration-700 ease-luxury",
            "group-hover:border-primary/30 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]",
            "hud-border"
          )}
        >
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-1000 ease-luxury grayscale group-hover:grayscale-0 group-hover:scale-[1.08] brightness-75 group-hover:brightness-100"
            />
            
            {/* Scanning beam on image */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-700">
              <div className="absolute inset-x-0 h-[2px] bg-primary shadow-[0_0_15px_#00E5CC] animate-[scanning-beam_3s_linear_infinite]" />
            </div>

            {/* Top Left: Category Data */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
              <div className="px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-sm">
                <span className="text-[7px] font-mono font-bold tracking-[0.2em] text-primary uppercase">
                  CAT // {product.category}
                </span>
              </div>
              <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
                <span className="text-[7px] font-mono text-white/40 tracking-[0.2em] uppercase">
                  ID: {product.id.slice(0, 8)}
                </span>
              </div>
            </div>

            {/* Top Right: Status HUD */}
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
                 <motion.div 
                   className="w-1 h-1 rounded-full bg-green-400"
                   animate={{ opacity: [0.4, 1, 0.4] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                 />
                 <span className="text-[7px] font-mono text-white/80 tracking-[0.1em] uppercase">In_Stock</span>
              </div>
            </div>

            {/* Bottom Overlay: Technical Readout */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-luxury bg-gradient-to-t from-black via-black/60 to-transparent">
               <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                  <div className="space-y-1">
                    <span className="block text-[6px] font-mono text-white/30 tracking-[0.2em] uppercase">Collection</span>
                    <span className="block text-[8px] font-mono text-white/80 tracking-[0.1em] uppercase font-bold truncate">Archive_X_2026</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="block text-[6px] font-mono text-white/30 tracking-[0.2em] uppercase">Authentication</span>
                    <span className="block text-[8px] font-mono text-primary tracking-[0.1em] uppercase font-bold">Verified_Core</span>
                  </div>
               </div>
            </div>
          </div>

          {/* CARD INFO */}
          <div className="p-5 bg-black/20">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[11px] font-mono font-bold tracking-[0.2em] text-white/80 uppercase group-hover:text-primary transition-colors flex-1 pr-4">
                {product.name}
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-[13px] font-mono font-bold text-primary tracking-widest">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[8px] font-mono text-white/20 line-through tracking-widest">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[7px] font-mono text-white/20 tracking-widest uppercase">
                <Activity size={8} /> <span>Neural_Sync</span>
              </div>
              <div className="flex items-center gap-1 text-[7px] font-mono text-white/20 tracking-widest uppercase">
                <Eye size={8} /> <span>View_Details</span>
              </div>
            </div>
          </div>
          
          {/* Corner Glow */}
          <div className="absolute -inset-10 bg-primary/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
