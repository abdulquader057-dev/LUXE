"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Heart, Bookmark, X, ShoppingBag,
  Volume2, VolumeX, Share2, MessageCircle,
  Play, ChevronUp, Sparkles
} from "lucide-react";
import Image from "next/image";
import { FASHION_REELS } from "@/data/ecosystem";
import { FashionReel } from "@/types";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Link from "next/link";

export default function FeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [showBuyOverlay, setShowBuyOverlay] = useState(false);
  const { convertPrice } = useCommerce();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReel = FASHION_REELS[currentIndex];

  const handleSwipeUp = useCallback(() => {
    if (currentIndex < FASHION_REELS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowBuyOverlay(false);
    }
  }, [currentIndex]);

  const handleSwipeDown = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowBuyOverlay(false);
    }
  }, [currentIndex]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -80) handleSwipeUp();
    else if (info.offset.y > 80) handleSwipeDown();
  };

  const toggleLike = () => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (next.has(currentReel.id)) next.delete(currentReel.id);
      else next.add(currentReel.id);
      return next;
    });
  };

  const toggleSave = () => {
    setSavedReels((prev) => {
      const next = new Set(prev);
      if (next.has(currentReel.id)) next.delete(currentReel.id);
      else next.add(currentReel.id);
      return next;
    });
  };

  const isLiked = likedReels.has(currentReel?.id);
  const isSaved = savedReels.has(currentReel?.id);

  return (
    <main className="fixed inset-0 bg-black text-white overflow-hidden z-50">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full glass-panel border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
      >
        <X size={20} />
      </Link>

      {/* Progress bar */}
      <div className="absolute top-4 left-20 right-20 z-50 flex gap-1.5">
        {FASHION_REELS.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
              transition={{ duration: i === currentIndex ? 5 : 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Main reel viewport */}
      <div ref={containerRef} className="w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={currentReel.mediaUrl}
                alt={currentReel.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex">
              {/* Left content area */}
              <div className="flex-1 flex flex-col justify-end p-8 pb-24">
                {/* Type badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="bg-primary/20 border border-primary/30 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase text-primary">
                    {currentReel.type}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-[0.85] mb-3 uppercase"
                >
                  {currentReel.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/50 font-medium mb-6"
                >
                  {currentReel.subtitle}
                </motion.p>

                {/* Product tag */}
                {currentReel.product && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={() => setShowBuyOverlay(!showBuyOverlay)}
                      className="group flex items-center gap-4 glass-panel !rounded-[20px] border border-white/10 p-4 pr-8 hover:border-primary/30 transition-all"
                    >
                      <div className="w-14 h-14 rounded-[14px] overflow-hidden relative flex-shrink-0">
                        <Image
                          src={currentReel.product.images[0]}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black tracking-wider uppercase truncate max-w-[200px]">{currentReel.product.name}</div>
                        <div className="text-sm font-black text-primary">{convertPrice(currentReel.product.price)}</div>
                      </div>
                      <ShoppingBag size={16} className="text-white/40 group-hover:text-primary transition-colors ml-auto" />
                    </button>
                  </motion.div>
                )}

                {/* Engagement stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-6 mt-6 text-[10px] font-black tracking-widest uppercase text-white/30"
                >
                  <span>{(currentReel.likes + (isLiked ? 1 : 0)).toLocaleString()} likes</span>
                  <span>{(currentReel.saves + (isSaved ? 1 : 0)).toLocaleString()} saves</span>
                </motion.div>
              </div>

              {/* Right action bar */}
              <div className="flex flex-col items-center justify-end gap-6 p-6 pb-28">
                {/* Like */}
                <motion.button
                  onClick={toggleLike}
                  whileTap={{ scale: 1.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                    isLiked ? "bg-red-500/20 border border-red-500/40" : "glass-panel border border-white/10"
                  )}>
                    <Heart size={22} className={cn(isLiked ? "text-red-500 fill-red-500" : "text-white")} />
                  </div>
                  <span className="text-[9px] font-black tracking-wider">{isLiked ? "Liked" : "Like"}</span>
                </motion.button>

                {/* Save */}
                <motion.button
                  onClick={toggleSave}
                  whileTap={{ scale: 1.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                    isSaved ? "bg-primary/20 border border-primary/40" : "glass-panel border border-white/10"
                  )}>
                    <Bookmark size={22} className={cn(isSaved ? "text-primary fill-primary" : "text-white")} />
                  </div>
                  <span className="text-[9px] font-black tracking-wider">{isSaved ? "Saved" : "Save"}</span>
                </motion.button>

                {/* Share */}
                <button className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full glass-panel border border-white/10 flex items-center justify-center">
                    <Share2 size={22} />
                  </div>
                  <span className="text-[9px] font-black tracking-wider">Share</span>
                </button>

                {/* Mute */}
                <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full glass-panel border border-white/10 flex items-center justify-center">
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </div>
                  <span className="text-[9px] font-black tracking-wider">{isMuted ? "Unmute" : "Mute"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buy Overlay */}
      <AnimatePresence>
        {showBuyOverlay && currentReel.product && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-8 pb-12 z-50 rounded-t-[36px]"
          >
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-8" />
            <div className="flex gap-6 items-center mb-6">
              <div className="w-20 h-20 rounded-[20px] overflow-hidden relative flex-shrink-0">
                <Image
                  src={currentReel.product.images[0]}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black tracking-wider uppercase">{currentReel.product.name}</h3>
                <p className="text-2xl font-black text-gradient">{convertPrice(currentReel.product.price)}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-5 bg-white text-black rounded-[20px] font-black text-[10px] tracking-widest uppercase hover:bg-primary transition-all flex items-center justify-center gap-3">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="flex-1 py-5 bg-[#25D366] text-white rounded-[20px] font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3">
                <MessageCircle size={18} fill="white" /> WhatsApp Buy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe indicator */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
      >
        <ChevronUp size={20} className="text-white/20" />
        <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase">Swipe</span>
      </motion.div>
    </main>
  );
}
