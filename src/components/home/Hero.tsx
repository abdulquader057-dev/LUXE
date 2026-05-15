"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, Filter, Sparkles, Command } from "lucide-react";
import { Magnetic } from "../ui/Magnetic";
import { cn } from "@/lib/utils";

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
            : { y: "100%", rotate: i % 2 === 0 ? 15 : -15, scale: 0.8, opacity: 0 }
          }
          animate={variant === "the"
            ? { y: 0 }
            : { y: 0, rotate: 0, scale: 1, opacity: 1 }
          }
          transition={{
            duration: 1.2,
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
  const placeholders = ["NEURAL BASE...", "ARCHIVE_X...", "S/S_2026...", "LUXE_CORE..."];
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) setIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-2xl items-stretch sm:items-center gap-3 md:gap-4 mt-8 md:mt-16 relative z-30">
      <div className="relative flex-grow group">
        <div className={cn(
          "absolute -inset-[1px] bg-gradient-to-r from-primary to-secondary rounded-full blur-[2px] transition-opacity duration-500",
          isFocused ? "opacity-100" : "opacity-0"
        )} />
        <div className="relative flex items-center bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-full px-5 md:px-6 py-3.5 md:py-4 transition-all duration-500 focus-within:bg-surface/60">
          <Search size={16} className={cn("transition-colors duration-500", isFocused ? "text-primary" : "text-white/40")} />
          <div className="relative flex-grow h-6 overflow-hidden ml-3 md:ml-4">
            <AnimatePresence mode="popLayout">
              {!isFocused && (
                <motion.div
                  key={index}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 text-[11px] md:text-sm font-tech text-white/20 tracking-[0.2em] pointer-events-none flex items-center"
                >
                  {placeholders[index]}
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="text"
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => !e.target.value && setIsFocused(false)}
              className="w-full h-full bg-transparent text-white font-tech text-xs md:text-sm tracking-widest focus:outline-none"
            />
          </div>
          <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
            <Command size={10} className="text-white/40" />
            <span className="text-[9px] font-tech text-white/40">K</span>
          </div>
        </div>
      </div>
      
      <Magnetic>
        <button className="relative px-6 md:px-8 py-3.5 md:py-4 rounded-full overflow-hidden group">
          <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-primary/30 transition-colors" />
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg]" />
          <span className="relative flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-nav font-bold tracking-[0.3em] uppercase text-white/80 group-hover:text-white transition-colors">
            <Filter size={12} className="text-primary" /> Filters
          </span>
        </button>
      </Magnetic>
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
      initial={{ opacity: 0, scale: 0.9, rotate: rotate + 5 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("absolute rounded-lg overflow-hidden border border-white/10 group", className)}
    >
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        <img src={src} alt="editorial" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        
        {/* LEFT CONTENT */}
        <div className="relative z-20 w-full lg:w-3/5 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6 md:mb-10"
          >
            <div className="w-12 h-[1px] bg-primary/40" />
            <span className="text-[9px] font-tech font-bold tracking-[0.5em] text-primary uppercase">
              LUXE Intelligence System v2.4
            </span>
          </motion.div>
          
          <h1 className="leading-[0.8] tracking-tighter select-none cursor-default">
            <div className="text-[clamp(3.5rem,15vw,180px)] font-display font-black text-white">
              <RevealText text="THE" delay={0.4} variant="the" />
            </div>
            <div className="text-[clamp(3.5rem,15vw,180px)] font-display font-black flex items-end">
              <span className="text-gradient">
                <RevealText text="ARCHIVE" delay={0.7} variant="archive" />
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-primary translate-y-[-0.1em]"
              >
                .
              </motion.span>
            </div>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-8 md:mt-12 h-auto"
          >
            <p className="text-[11px] md:text-sm font-tech tracking-[0.2em] text-muted uppercase leading-relaxed max-w-md">
              Synthesized by LUXE Core. Engineered for the future of fashion.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="w-full"
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* MOBILE IMAGE (Simplified) */}
        <div className="relative w-full aspect-[4/5] block lg:hidden perspective-1000">
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
          {/* Main Portrait */}
          <EditorialImage
            src="https://images.unsplash.com/photo-1550614000-4b95d4edfaeb?q=80&w=800&auto=format&fit=crop"
            className="top-[10%] right-[5%] w-[320px] aspect-[3/4] z-10"
            delay={1.2}
            parallax={60}
            rotate={2}
          />
          
          {/* Secondary Square */}
          <EditorialImage
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
            className="top-[45%] right-[35%] w-[240px] aspect-square z-20"
            delay={1.5}
            parallax={100}
            rotate={-3}
          />
          
          {/* Deep Foreground Portrait */}
          <EditorialImage
            src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?q=80&w=800&auto=format&fit=crop"
            className="bottom-[5%] right-[10%] w-[260px] aspect-[4/5] z-30"
            delay={1.8}
            parallax={40}
            rotate={1}
          />

          {/* Deep Background Cutout */}
          <EditorialImage
            src="https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=800&auto=format&fit=crop"
            className="top-[5%] left-[5%] w-[200px] aspect-[3/4] z-0 opacity-40 blur-[1px]"
            delay={2.1}
            parallax={150}
            rotate={-8}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
