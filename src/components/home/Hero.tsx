"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, Filter, Sparkles, Command } from "lucide-react";
import { Magnetic } from "../ui/Magnetic";
import { cn } from "@/lib/utils";

import { LuxeButton } from "../ui/LuxeButton";

// Animated Heading Split
const RevealText = ({ text, delay = 0, variant = "the" }: { text: string; delay?: number; variant?: "the" | "archive" }) => {
  const letters = text.split("");
  
  return (
    <div className="flex overflow-hidden">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={variant === "the" 
            ? { y: "100%" } 
            : { y: "100%", rotate: i % 2 === 0 ? 5 : -5, scale: 0.9, opacity: 0 }
          }
          animate={variant === "the"
            ? { y: 0 }
            : { y: 0, rotate: 0, scale: 1, opacity: 1 }
          }
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + (i * 0.04)
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

const SearchBar = () => {
  const placeholders = ["SCAN_ARCHIVE_X", "NEURAL_BASE_26", "S/S_PROTOCOL", "LUXE_CORE_V4"];
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) setIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-2xl items-stretch sm:items-center gap-4 mt-12 relative z-30">
      <div className="relative flex-grow group">
        <div className={cn(
          "absolute -inset-[1px] bg-primary/20 rounded-sm blur-[1px] transition-opacity duration-700",
          isFocused ? "opacity-100" : "opacity-0"
        )} />
        <div className="relative flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-sm px-6 py-4 transition-all duration-500">
          <Search size={14} className={cn("transition-colors duration-500", isFocused ? "text-primary" : "text-white/20")} />
          <div className="relative flex-grow h-6 overflow-hidden ml-4">
            <AnimatePresence mode="popLayout">
              {!isFocused && (
                <motion.div
                  key={index}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 text-[10px] font-mono text-white/20 tracking-[0.4em] pointer-events-none flex items-center"
                >
                  {placeholders[index]}
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="text"
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => !e.target.value && setIsFocused(false)}
              className="w-full h-full bg-transparent text-white font-mono text-xs tracking-[0.2em] focus:outline-none"
            />
          </div>
          <div className="hidden xs:flex items-center gap-2 px-2 py-1 rounded-sm bg-white/5 border border-white/5">
            <Command size={10} className="text-white/20" />
            <span className="text-[8px] font-mono text-white/20 tracking-tighter">TAB</span>
          </div>
        </div>
      </div>
      
      <LuxeButton variant="hud" className="px-10">
        Filter
      </LuxeButton>
    </div>
  );
};

const EditorialImage = ({ src, className, delay = 0, parallax = 0, rotate = 0 }: { src: string, className: string, delay?: number, parallax?: number, rotate?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("absolute overflow-hidden border border-white/5 group", className)}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="w-full h-full relative"
      >
        <img src={src} alt="editorial" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-luxury" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-primary mix-blend-overlay transition-opacity duration-700" />
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-24 pb-32">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 md:px-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        
        {/* LEFT CONTENT */}
        <div className="relative z-20 w-full lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-[1px] bg-primary/30" />
            <span className="text-[9px] font-mono font-bold tracking-[0.6em] text-primary/60 uppercase">
              LUXE // NEURAL_OS // 04.2
            </span>
          </motion.div>
          
          <h1 className="leading-[0.85] tracking-tighter select-none cursor-default">
            <div className="text-[clamp(4rem,12vw,140px)] font-serif font-light text-white italic opacity-80">
              <RevealText text="The" delay={0.4} variant="the" />
            </div>
            <div className="text-[clamp(4rem,16vw,200px)] font-display font-black flex items-end -mt-4">
              <span className="relative">
                <RevealText text="ARCHIVE" delay={0.7} variant="archive" />
                <motion.div 
                  className="absolute -inset-2 bg-primary/5 blur-2xl -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-primary translate-y-[-0.15em] ml-2"
              >
                .
              </motion.span>
            </div>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8 }}
            className="mt-12 space-y-6"
          >
            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white/40 uppercase leading-relaxed max-w-md">
              Synthesized neural fashion. A curated convergence of digital heritage and future silhouettes.
            </p>
            <div className="flex items-center gap-8 text-[9px] font-mono tracking-[0.2em] text-primary/40 uppercase">
              <div className="flex flex-col">
                <span className="text-white/60">Core Sync</span>
                <span>Active</span>
              </div>
              <div className="w-[1px] h-8 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-white/60">Region</span>
                <span>Global_01</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="w-full"
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* MOBILE IMAGE */}
        <div className="relative w-full aspect-[4/5] block lg:hidden perspective-1000 mt-12">
           <EditorialImage
            src="https://images.unsplash.com/photo-1550614000-4b95d4edfaeb?q=80&w=800&auto=format&fit=crop"
            className="inset-0 w-full h-full z-10"
            delay={2.5}
            parallax={20}
            rotate={0}
          />
        </div>

        {/* RIGHT IMAGES (Floating Editorial - Desktop) */}
        <div className="flex-1 relative w-full h-[90vh] hidden lg:block perspective-1000">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main Portrait */}
            <EditorialImage
              src="https://images.unsplash.com/photo-1550614000-4b95d4edfaeb?q=80&w=800&auto=format&fit=crop"
              className="top-[5%] right-[0%] w-[380px] aspect-[3/4] z-10"
              delay={1.2}
              parallax={40}
              rotate={1}
            />
            
            {/* Secondary Square */}
            <EditorialImage
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
              className="top-[45%] right-[45%] w-[280px] aspect-square z-20"
              delay={1.5}
              parallax={80}
              rotate={-2}
            />
            
            {/* Deep Foreground Portrait */}
            <EditorialImage
              src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?q=80&w=800&auto=format&fit=crop"
              className="bottom-[0%] right-[15%] w-[300px] aspect-[4/5] z-30"
              delay={1.8}
              parallax={30}
              rotate={0}
            />

            {/* HUD Status Element in Image Area */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute top-[20%] left-[10%] p-6 border-l border-primary/20 bg-black/20 backdrop-blur-md z-40 hidden xl:block"
            >
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <span className="block text-[8px] font-mono text-white/30 tracking-[0.4em] uppercase">Material Analysis</span>
                  <span className="block text-[10px] font-mono text-primary tracking-[0.1em] uppercase font-bold">Titanium_Fiber_V2</span>
                </div>
                <div className="w-12 h-[1px] bg-white/10" />
                <div className="space-y-1">
                  <span className="block text-[8px] font-mono text-white/30 tracking-[0.4em] uppercase">Integrity</span>
                  <span className="block text-[10px] font-mono text-white/80 tracking-[0.1em] uppercase font-bold">99.84% Verified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
