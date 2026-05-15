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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block outline-none">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, perspective: "1000px" }}
          className={cn(
            "relative bg-surface rounded-lg overflow-hidden border border-subtle transition-all duration-400 ease-luxury",
            "group-hover:-translate-y-2.5 group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,229,204,0.15)]"
          )}
        >
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-400 ease-luxury group-hover:scale-[1.06]"
            />
            
            {/* Category Tag */}
            <div className="absolute top-4 left-4 z-10 px-2 py-1 rounded-[4px] bg-black/60 backdrop-blur-md border border-white/5">
              <span className="text-[8px] font-tech font-bold tracking-widest text-white/80 uppercase">
                {product.category}
              </span>
            </div>

            {/* Quick-add overlay (Desktop) / Action Button (Mobile) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden md:block" />
            
            {/* Desktop Quick Add */}
            <button className="hidden md:flex absolute bottom-0 left-0 w-full py-4 bg-gradient-to-r from-primary to-secondary text-black font-nav font-bold tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-luxury items-center justify-center gap-2">
              <Plus size={16} strokeWidth={2.5} />
              Quick Add
            </button>

            {/* Mobile Quick Add Button */}
            <button className="md:hidden absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform z-20">
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* CARD INFO */}
          <div className="p-4 md:p-5">
            <h3 className="text-xs md:text-sm font-nav font-bold tracking-wider text-white uppercase group-hover:text-primary transition-colors mb-1 truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[12px] md:text-[13px] font-tech font-bold text-primary tracking-widest">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] md:text-[11px] font-tech text-muted line-through tracking-widest">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Cyan Glow behind card on hover */}
          <div className="absolute -inset-10 bg-primary/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
