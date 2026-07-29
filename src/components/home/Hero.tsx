// src/components/home/Hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX  = useTransform(mouseX, [-1, 1], [-20, 20]);
  const bgY  = useTransform(mouseY, [-1, 1], [-12, 12]);
  const fgX  = useTransform(mouseX, [-1, 1], [-40, 40]);
  const fgY  = useTransform(mouseY, [-1, 1], [-24, 24]);

  const bgXSpring  = useSpring(bgX,  { stiffness: 50, damping: 20 });
  const bgYSpring  = useSpring(bgY,  { stiffness: 50, damping: 20 });
  const fgXSpring  = useSpring(fgX,  { stiffness: 60, damping: 22 });
  const fgYSpring  = useSpring(fgY,  { stiffness: 60, damping: 22 });

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleReset = () => { mouseX.set(0); mouseY.set(0); };

    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMouseMove);
    el?.addEventListener("mouseleave", handleReset);
    return () => {
      el?.removeEventListener("mousemove", handleMouseMove);
      el?.removeEventListener("mouseleave", handleReset);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgXSpring, y: bgYSpring }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,98,0.04) 0%, transparent 60%)' }} />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(201,169,98,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Top gold accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,98,0.25), transparent)' }} />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-[1400px] mx-auto"
        style={{ x: fgXSpring, y: fgYSpring }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-10"
          style={{
            background: 'transparent',
            border: '1px solid rgba(201,169,98,0.2)',
          }}
        >
          <span
            className="text-[11px] uppercase font-medium"
            style={{ letterSpacing: '0.25em', color: '#C9A962' }}
          >
            The Summer Edit · 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-cormorant font-light leading-none mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            letterSpacing: '0.02em',
            color: '#F5F0E8',
            lineHeight: 1.1,
          }}
        >
          Woven for
          <span className="block italic" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
            the Bold
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-light max-w-[480px] mx-auto mb-12"
          style={{ fontSize: '16px', color: 'rgba(245, 240, 232, 0.55)', lineHeight: 1.7, letterSpacing: '0.02em' }}
        >
          Affordable luxury fashion crafted from premium breathable fabrics.
          Designed for the bold generation of Hyderabad.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-9 py-4 text-[12px] font-medium uppercase transition-all duration-300"
            style={{
              letterSpacing: '0.2em',
              background: 'transparent',
              border: '1px solid rgba(201,169,98,0.4)',
              color: '#C9A962',
            }}
          >
            Explore the Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/ai-style"
            className="flex items-center gap-2 px-9 py-4 text-[12px] font-medium uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1px solid rgba(245, 240, 232, 0.15)',
              color: 'rgba(245, 240, 232, 0.8)',
              letterSpacing: '0.2em',
            }}
          >
            Style Studio
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap gap-12 justify-center mt-20"
        >
          {[
            { label: 'Handpicked Fabrics', sub: 'Breathable & Soft' },
            { label: 'Tailored Precision', sub: 'Perfect Sizing' },
            { label: 'Hyderabad Atelier', sub: 'Fast Delivery' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <p className="text-[10px] font-medium uppercase" style={{ letterSpacing: '0.2em', color: '#F5F0E8' }}>{stat.label}</p>
              <p className="text-[10px] font-light" style={{ letterSpacing: '0.05em', color: '#9E968A' }}>{stat.sub}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,98,0.4), transparent)' }} />
      </motion.div>
    </section>
  );
};

export default Hero;
