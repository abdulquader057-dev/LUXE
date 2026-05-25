"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LuxeLogo from "../LuxeLogo";
import MagneticWrapper from "../MagneticWrapper";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number; color: string; duration: number; time: number }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 50;

    const colors = [
      "rgba(201,169,110,0.6)", // gold
      "rgba(0,229,204,0.4)",   // cyan
      "rgba(108,63,232,0.4)"   // violet
    ];

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1, // 1-3px
      speed: Math.random() * 0.5 + 0.1, // very slow
      opacity: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 12000 + 8000, // 8-20s
      time: Math.random() * 10000,
    }));

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.time += dt;
        
        // Calculate opacity based on sine wave for fade in/out
        const progress = (p.time % p.duration) / p.duration;
        p.opacity = Math.sin(progress * Math.PI) * (isMobile ? 0.5 : 1);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Apply calculated opacity to the color string
        const colorMatch = p.color.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
        if (colorMatch) {
          const r = colorMatch[1];
          const g = colorMatch[2];
          const b = colorMatch[3];
          const maxAlpha = parseFloat(colorMatch[4]);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, p.opacity * maxAlpha)})`;
        } else {
          ctx.fillStyle = p.color;
        }
        
        ctx.fill();

        p.y -= p.speed * (dt / 16);
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.time = 0; // reset cycle
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero">
      {/* BACKGROUND AREA (Z-INDEX 0) */}
      <div className="hero-background">
        {/* Layer 1: The Image itself */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" }}
          src="/hero-1.jpg"
          alt="Cyberpunk Fashion Model"
          className="hero-bg-image"
        />

        {/* Layer 2: Base dark gradient */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="hero-overlay-base" 
        />

        {/* Layer 3: Ambient Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-[4] mix-blend-screen"
        />

        {/* Layer 4: Vignette overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="hero-overlay-vignette" 
        />
      </div>

      {/* HERO CONTENT (Z-INDEX 10) */}
      <div className="hero-content">
        {/* Row 1: Logo fades in as one unit */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <LuxeLogo />
        </motion.div>

        {/* Row 2: Subtitle fades in */}
        <motion.p
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-subtitle"
        >
          Experience the evolution of digital identity.
          Neural-powered luxury curation for the 
          architects of the next-gen fashion universe.
        </motion.p>

        {/* Row 3: Buttons fade in */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-buttons"
        >
          <MagneticWrapper>
            <button className="btn-primary clickable">Initialize Search</button>
          </MagneticWrapper>
          <MagneticWrapper>
            <button className="btn-secondary clickable">Explore Drops</button>
          </MagneticWrapper>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
