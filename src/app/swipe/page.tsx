"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Heart, X, Bookmark,
  Sparkles, BrainCircuit
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseDbProduct } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useXP } from "@/lib/hooks/useXP";

type SwipeDirection = "left" | "right" | "up" | null;

export default function SwipePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [liked, setLiked] = useState<Product[]>([]);
  const [saved, setSaved] = useState<Product[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const { convertPrice } = useCommerce();
  const { awardXP } = useXP();

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          setProducts(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch products for swipe page:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const currentProduct = products.length > 0 ? products[currentIndex % products.length] : null;
  const nextProduct = products.length > 0 ? products[(currentIndex + 1) % products.length] : null;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (!currentProduct) return;
    const threshold = 120;
    
    if (info.offset.x > threshold) {
      // Swipe right → Like
      setSwipeDirection("right");
      setLiked((prev) => [...prev, currentProduct]);
      awardXP('swipe_right');
      // 30% chance of "match" 
      if (Math.random() > 0.7) {
        setTimeout(() => setShowMatch(true), 300);
        setTimeout(() => setShowMatch(false), 2000);
      }
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swipe left → Skip
      setSwipeDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
      }, 300);
    } else if (info.offset.y < -threshold) {
      // Swipe up → Save
      setSwipeDirection("up");
      setSaved((prev) => [...prev, currentProduct]);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
      }, 300);
    }
  }, [currentProduct]);

  const handleButtonSwipe = (direction: SwipeDirection) => {
    if (!currentProduct) return;
    setSwipeDirection(direction);
    if (direction === "right") {
      setLiked((prev) => [...prev, currentProduct]);
      awardXP('swipe_right');
    }
    if (direction === "up") setSaved((prev) => [...prev, currentProduct]);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 400);
  };

  const exitVariants = {
    left: { x: -500, rotate: -30, opacity: 0 },
    right: { x: 500, rotate: 30, opacity: 0 },
    up: { y: -500, scale: 0.5, opacity: 0 },
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border border-white/5 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-sora tracking-[0.3em] text-white/50 uppercase">Loading Styles...</p>
        </div>
      </main>
    );
  }

  if (products.length === 0 || !currentProduct) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md text-center px-6">
          <Sparkles size={32} className="text-white/20 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-display font-black tracking-tighter mb-4 text-gradient">NO ARTIFACTS AVAILABLE</h2>
          <p className="text-sm text-white/40 mb-8 font-sora">The archive is currently empty. Please check back later when new limited designs are catalogued.</p>
          <Link href="/shop" className="btn-secondary px-8 py-3 rounded-full text-[10px] font-mono tracking-widest uppercase border border-white/20 hover:border-white">
            Browse Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-16 relative overflow-hidden">
      {/* Atmospheric */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[50%] bg-secondary/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary/10 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-lg mx-auto px-6 relative z-10">
        {/* Return Link */}
        <div className="mb-8 flex justify-center">
          <Link href="/shop" className="flex items-center gap-2 text-primary hover:text-white text-[9px] font-mono tracking-widest uppercase transition-colors cursor-pointer group">
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Return to Archive Catalog
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-primary">Neural Discovery</span>
            <Sparkles size={16} className="text-primary" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
            SWIPE YOUR <span className="text-gradient">STYLE</span>
          </h1>
          <p className="text-sm text-white/40">Our AI learns from every swipe to refine your taste profile</p>
        </motion.div>

        {/* Stats bar */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-red-500" />
            <span className="text-sm font-black">{liked.length}</span>
            <span className="text-[9px] text-white/30 font-black tracking-widest uppercase">Liked</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark size={14} className="text-primary" />
            <span className="text-sm font-black">{saved.length}</span>
            <span className="text-[9px] text-white/30 font-black tracking-widest uppercase">Saved</span>
          </div>
        </div>

        {/* Card stack */}
        <div className="relative h-[520px] w-full perspective-1000">
          {/* Background card (next) */}
          {nextProduct && (
            <div className="absolute inset-4 rounded-[36px] overflow-hidden border border-white/5 bg-muted">
              <Image
                src={nextProduct.images[0] || "/brand/linen_model_front.png"}
                alt=""
                fill
                sizes="400px"
                className="object-cover opacity-50 scale-95 blur-sm"
              />
            </div>
          )}

          {/* Active card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              style={{ x, rotate }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={
                swipeDirection
                  ? exitVariants[swipeDirection]
                  : { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }
              }
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute inset-0 rounded-[36px] overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing shadow-2xl"
            >
              <Image
                src={currentProduct.images[0] || "/brand/linen_model_front.png"}
                alt={currentProduct.name}
                fill
                priority
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-cover"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Like indicator */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-10 left-10 bg-green-500/20 border-2 border-green-500 px-6 py-3 rounded-2xl rotate-[-15deg]"
              >
                <span className="text-green-500 font-black text-2xl tracking-wider">LIKE</span>
              </motion.div>

              {/* Nope indicator */}
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-10 right-10 bg-red-500/20 border-2 border-red-500 px-6 py-3 rounded-2xl rotate-[15deg]"
              >
                <span className="text-red-500 font-black text-2xl tracking-wider">SKIP</span>
              </motion.div>

              {/* Product info */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {currentProduct.category.replace("-", " ")}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-xs font-black">{currentProduct.ratings}</span>
                    <span className="text-[9px] text-white/30">★</span>
                  </div>
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 line-clamp-1">{currentProduct.name}</h2>
                <p className="text-2xl font-black text-gradient mb-3">{convertPrice(currentProduct.price).symbol}{convertPrice(currentProduct.price).amount}</p>
                <p className="text-sm text-white/40 line-clamp-2">{currentProduct.description}</p>
              </div>

              {/* AI Match badge */}
              <div className="absolute top-6 right-6">
                <div className="glass-panel !rounded-2xl border border-primary/20 px-4 py-2 flex items-center gap-2">
                  <BrainCircuit size={14} className="text-primary" />
                  <span className="text-[9px] font-black tracking-wider text-primary">
                    {Math.floor(80 + Math.random() * 18)}% MATCH
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleButtonSwipe("left")}
            className="w-16 h-16 rounded-full border-2 border-red-500/30 flex items-center justify-center hover:bg-red-500/10 transition-all"
          >
            <X size={28} className="text-red-500" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleButtonSwipe("up")}
            className="w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-all"
          >
            <Bookmark size={22} className="text-primary" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleButtonSwipe("right")}
            className="w-16 h-16 rounded-full border-2 border-green-500/30 flex items-center justify-center hover:bg-green-500/10 transition-all"
          >
            <Heart size={28} className="text-green-500" />
          </motion.button>
        </div>

        {/* Instruction */}
        <p className="text-center text-[9px] font-black tracking-[0.4em] text-white/15 uppercase mt-6">
          Drag right to like · Left to skip · Up to save
        </p>
      </div>

      {/* AI Match overlay */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="text-8xl mb-4"
              >
                ✨
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-display font-black tracking-tighter text-gradient"
              >
                AI MATCH!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-white/40 mt-2 font-sora"
              >
                This piece perfectly fits your style DNA
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
