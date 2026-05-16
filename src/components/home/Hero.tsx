"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LuxeLogo from "../LuxeLogo";
import { cn } from "@/lib/utils";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const y3 = useTransform(scrollY, [0, 500], [0, -80]);
  const y4 = useTransform(scrollY, [0, 500], [0, -120]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-bg pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-brand">
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-12">
          <LuxeLogo className="scale-90 md:scale-110 lg:origin-left" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <p className="max-w-md text-text-secondary font-sora text-sm md:text-base leading-relaxed tracking-wide">
              Experience the evolution of digital identity. Neural-powered luxury curation 
              for the architects of the next-gen fashion universe.
            </p>
            
            <div className="flex items-center gap-6">
              <button className="px-8 py-4 bg-white text-black font-rajdhani font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-accent-cyan transition-colors">
                Initialize Search
              </button>
              <button className="px-8 py-4 glass-standard border-white/10 font-rajdhani font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:border-accent-cyan transition-colors">
                Explore Drops
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT CONTENT: FLOATING EDITORIAL IMAGES */}
        <div className="hidden lg:block relative h-[600px] w-full">
          {/* Image 1 */}
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 right-[10%] w-[280px] h-[380px] z-editorial group"
          >
            <div className="w-full h-full rounded-radius-lg overflow-hidden border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rotate-[-3deg] animate-float transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
              <img src="/hero-1.jpg" alt="Editorial 1" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Image 2 */}
          <motion.div
            style={{ y: y2 }}
            className="absolute top-[80px] right-[40%] w-[200px] h-[280px] z-[19] group"
          >
            <div className="w-full h-full rounded-radius-lg overflow-hidden border border-accent-cyan/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rotate-[5deg] animate-float [animation-delay:2s] transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
              <img src="/hero-2.jpg" alt="Editorial 2" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Image 3 */}
          <motion.div
            style={{ y: y3 }}
            className="absolute bottom-[40px] right-[5%] w-[160px] h-[220px] z-[18] group"
          >
            <div className="w-full h-full rounded-radius-lg overflow-hidden border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rotate-[-7deg] animate-float [animation-delay:4s] transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
              <img src="/hero-3.jpg" alt="Editorial 3" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-accent-violet/10 mix-blend-overlay" />
            </div>
          </motion.div>

          {/* Image 4 */}
          <motion.div
            style={{ y: y4 }}
            className="absolute top-[200px] right-0 w-[120px] h-[160px] z-[17] opacity-50 blur-[1px] group"
          >
            <div className="w-full h-full rounded-radius-lg overflow-hidden border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-float [animation-delay:1s]">
              <img src="/hero-4.jpg" alt="Editorial 4" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>

        {/* MOBILE EDITORIAL BANNER */}
        <div className="lg:hidden w-full mt-12 rounded-radius-lg overflow-hidden border border-white/5 shadow-2xl">
           <img src="/hero-1.jpg" alt="Editorial Banner" className="w-full h-64 object-cover" />
        </div>
      </div>

      {/* Decorative Scanline */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  );
};

export default Hero;
