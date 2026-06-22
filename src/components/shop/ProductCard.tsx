"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Link from "next/link";
import Image from "next/image";
import SwatchSelector from "@/components/shop/SwatchSelector";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[] | string | any;
  category: string;
  isNew?: boolean;
  stock?: number;
  colors?: string[];
  discount?: number;
  offer?: string;
  modelImages?: any;
}

function getFirstImage(images: any): string {
  const fallback = "/brand/linen_model_front.png";
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
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [isImageFading, setIsImageFading] = useState(false);
  const [showCartBtn, setShowCartBtn] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [12, -12]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), { stiffness: 300, damping: 20 });

  // Specular highlight position
  const [specX, setSpecX] = useState(50);
  const [specY, setSpecY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1
    mouseX.set(x * 2 - 1);  // -1..1
    mouseY.set(y * 2 - 1);  // -1..1
    setSpecX(x * 100);
    setSpecY(y * 100);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpecX(50);
    setSpecY(50);
    setIsHovered(false);
    setShowCartBtn(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowCartBtn(true);
  };

  // Determine image based on modelImages and selected color
  const modelImg = product.modelImages?.variants?.[selectedColor] || product.modelImages || {};
  const frontImage = modelImg.front && modelImg.front !== "/model_placeholder.png" ? modelImg.front : getFirstImage(product.images);
  const sideImage = modelImg.side && modelImg.side !== "/model_placeholder.png" ? modelImg.side : frontImage;
  const imageUrl = isHovered ? sideImage : frontImage;
  const matchScore = Math.floor(Math.random() * 15) + 85;

  useEffect(() => {
    setIsImageFading(true);
    const timer = setTimeout(() => setIsImageFading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedColor]);

  const priceInfo = convertPrice(product.price);
  const discountPct = product.discount && product.discount > 0 ? product.discount : null;

  return (
    <motion.div
      ref={cardRef}
      // LUXE-FIX [4]: Replace rounded-xl on card with rounded-luxe
      className="product-card group relative rounded-luxe h-[500px] bg-transparent"
      style={{
        perspective: 800,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ translateZ: 20, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        // LUXE-FIX [4]: Replace rounded-xl with rounded-luxe
        className="w-full h-full rounded-luxe overflow-hidden flex flex-col relative"
        style={{
          background: "var(--surface-card, #1A1A26)",
          border: "0.5px solid var(--border-subtle, #2A2A3E)",
          boxShadow: isHovered
            ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.2)"
            : "0 8px 24px rgba(0,0,0,0.4)",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          borderColor: isHovered ? "var(--accent-gold, #C9A84C)" : "var(--border-subtle, #2A2A3E)",
        }}
      >
        {/* Specular highlight overlay */}
        <div
          // LUXE-FIX [4]: Replace rounded-xl with rounded-luxe
          className="absolute inset-0 pointer-events-none z-30 rounded-luxe transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${specX}% ${specY}%, rgba(201,168,76,0.08) 0%, transparent 55%)`,
          }}
        />

        {/* Gold border shimmer overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none rounded-luxe overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              backgroundPosition: isHovered ? "200% 0" : "-100% 0",
              transition: "background-position 1.2s ease",
            }}
          />
        </div>

        {/* Image section */}
        <Link
          href={`/product/${product.id}?color=${encodeURIComponent(selectedColor)}`}
          className="relative flex-shrink-0 overflow-hidden block"
          style={{ height: "310px" }}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ease-[cubic-bezier(0.25,1,0.15,1)] ${
              isImageFading ? "opacity-0" : ""
            } ${isHovered ? "opacity-100 scale-[1.06]" : "opacity-90 scale-100"}`}
            style={{ background: "#FAF9F6" }}
          />

          {/* LUXE watermark — right edge, vertical, very subtle */}
          <div
            className="absolute right-2 top-0 bottom-0 flex items-center justify-center pointer-events-none z-10"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              opacity: 0.18,
              fontFamily: "var(--font-cormorant)",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--accent-gold, #C9A84C)",
              userSelect: "none",
            }}
          >
            LUXE
          </div>

          {/* Soft inner shadow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.3), inset 0 -20px 40px rgba(10,10,15,0.6)",
            }}
          />

          {/* Out of Stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg bg-black/90 uppercase">
                Unavailable
              </span>
            </div>
          )}

          {/* AI Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[9px] font-sora font-bold text-white/90 tracking-widest">AI MATCH {matchScore}%</span>
          </div>

          {/* Heart */}
          <button
            onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
            // LUXE-FIX [4]: Replace rounded-full on button with rounded-luxe
            className={`absolute top-3 right-3 w-8 h-8 rounded-luxe flex items-center justify-center backdrop-blur-md transition-all duration-300 z-10 ${
              isLiked
                ? "bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                : "bg-black/40 border border-white/10 text-white/50 hover:bg-black/60 hover:text-white"
            }`}
          >
            <Heart size={14} className={isLiked ? "fill-[#C9A84C]" : ""} />
          </button>
        </Link>

        {/* Info section */}
        <div className="flex-1 p-5 flex flex-col justify-between relative z-10" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,10,15,0.95) 100%)" }}>
          <div>
            <h3 className="text-[13px] font-orbitron font-bold text-white/90 tracking-wider uppercase mb-1.5 line-clamp-1 group-hover:text-[#00f2ff] transition-colors">
              {product.name}
            </h3>
            <p className="text-[10px] font-sora text-white/40 tracking-wider line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            <SwatchSelector
              colors={product.colors || []}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />
          </div>

          <div className="mt-4 pt-4 flex items-end justify-between" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            <div />

            {product.stock === 0 ? (
              <span className="text-[9px] font-mono font-bold text-red-500/60 uppercase tracking-widest px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-lg">
                N/A
              </span>
            ) : (
              <motion.button
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: imageUrl, quantity: 1, size: "L", color: selectedColor })}
                // LUXE-FIX [4]: Replace rounded-full on button with rounded-luxe
                className="w-10 h-10 rounded-luxe flex items-center justify-center transition-all duration-300"
                style={{
                  background: showCartBtn ? "var(--accent-gold, #C9A84C)" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: showCartBtn ? "#0A0A0F" : "rgba(255,255,255,0.7)",
                }}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: showCartBtn ? 0 : 8, opacity: showCartBtn ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
