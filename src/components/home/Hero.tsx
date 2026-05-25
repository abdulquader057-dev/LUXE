"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LuxeLogo from "../LuxeLogo";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 40;

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.2 + 0.4,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.35 + 0.05,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
        ctx.fill();

        p.y -= p.speed;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero">
      {/* BACKGROUND AREA (Z-INDEX 0) */}
      <div className="hero-background">
        {/* Layer 1: The Image itself (z-index: 0, opacity animated from 2.2s) */}
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.0 }}
          transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" }}
          src="/hero-1.jpg"
          alt="Cyberpunk Fashion Model"
          className="hero-bg-image"
        />

        {/* Layer 2: Base dark gradient (z-index: 1) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="hero-overlay-base" 
        />

        {/* Layer 3: Vignette overlay (z-index: 2) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="hero-overlay-vignette" 
        />

        {/* Layer 4: Ambient color tint (z-index: 3) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="hero-overlay-tint" 
        />

        {/* Layer 5: Particles canvas (z-index: 4) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-[4] opacity-30"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Layer 6: Ambient orbiting ring (z-index: 5, below hero-content at 10) */}
        <div 
          className="absolute bottom-[8%] md:bottom-[12%] left-1/2 -translate-x-1/2 w-[280px] md:w-[520px] h-[60px] md:h-[120px] border border-[rgba(201,169,110,0.15)] rounded-full pointer-events-none z-[5]"
          style={{ transform: "translateX(-50%) rotateX(75deg)" }}
        >
          {/* Orbiting glowing point */}
          <div 
            className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#00E5CC] rounded-full blur-[1px] animate-spin-slow origin-[0_30px] md:origin-[0_60px]"
            style={{ animationDuration: "12s" }}
          />
        </div>
      </div>

      {/* HERO CONTENT (Z-INDEX 10) */}
      <div className="hero-content">
        {/* Row 1: Logo fades in as one unit (600ms - 1200ms) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <LuxeLogo />
        </motion.div>

        {/* Row 2: Subtitle fades in (1200ms - 2000ms) */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
          className="hero-subtitle"
        >
          Experience the evolution of digital identity.
          Neural-powered luxury curation for the 
          architects of the next-gen fashion universe.
        </motion.p>

        {/* Row 3: Buttons fade in (1800ms - 2400ms) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4, ease: "easeOut" }}
          className="hero-buttons"
        >
          <button className="btn-primary">Initialize Search</button>
          <button className="btn-secondary">Explore Drops</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
