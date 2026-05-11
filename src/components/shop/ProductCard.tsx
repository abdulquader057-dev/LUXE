"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
            <ShoppingCart size={20} />
          </button>
          <Link href={`/product/${product.id}`} className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Eye size={20} />
          </Link>
          <button className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all">
            <Heart size={20} />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isTrending && (
            <span className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.5)]">
              TRENDING
            </span>
          )}
          {product.discount && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.isPreorder && (
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
              PREORDER
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-black tracking-tighter">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
        <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase">
          {product.category.replace("-", " ")}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
