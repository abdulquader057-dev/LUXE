"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export const CinematicAtmosphere = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number; color: string; duration: number; time: number; swaySpeed: number; swayAmount: number }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;

    const colors = [
      "rgba(201,169,110,0.7)",  // gold
      "rgba(0,229,204,0.5)",    // cyan
      "rgba(108,63,232,0.5)"    // violet
    ];

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height, // Initial random distribution
      size: Math.random() * 1.5 + 1, // 1px to 2.5px
      speed: Math.random() * 0.4 + 0.1, // mapped to 6s to 18s roughly
      opacity: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 8000 + 6000, 
      time: Math.random() * 10000,
      swaySpeed: Math.random() * 0.002 + 0.001,
      swayAmount: Math.random() * 0.5 + 0.2,
    }));

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.time += dt;
        
        // Opacity 0 -> 0.8 -> 0
        const progress = (p.time % p.duration) / p.duration;
        p.opacity = Math.sin(progress * Math.PI) * 0.8;
        
        ctx.beginPath();
        
        // Sway logic
        const currentX = p.x + Math.sin(p.time * p.swaySpeed) * p.swayAmount * 10;
        
        ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
        
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
          p.time = 0;
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
    <div className="fixed inset-0 z-bg pointer-events-none overflow-hidden select-none" style={{ backgroundColor: "#03030A" }}>
      {/* LAYER 1: Base Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #150D2E 0%, #0A0718 35%, #06050F 65%, #03030A 100%)",
          zIndex: 0
        }}
      />

      {/* LAYER 2: Warm Center Glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,169,110,0.08) 0%, transparent 70%)",
          zIndex: 1
        }}
      />

      {/* LAYER 3: Violet Ambient Orb Left */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(108,63,232,0.22) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "-200px",
          left: "-200px",
          zIndex: 1,
          animation: "orbDriftLeft 25s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 4: Cyan Ambient Orb Right */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,229,204,0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "-100px",
          right: "-100px",
          zIndex: 1,
          animation: "orbDriftRight 20s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 5: Deep Indigo Pulse Center */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full top-1/2 left-1/2"
        style={{
          background: "radial-gradient(circle, rgba(58,12,163,0.18) 0%, transparent 60%)",
          filter: "blur(120px)",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          animation: "centerPulse 18s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 6: Noise Grain Texture */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 2,
        }}
      />

      {/* LAYER 7: Ultra Fine Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          zIndex: 2,
        }}
      />

      {/* LAYER 8: Gold Vignette Bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(201,169,110,0.04) 0%, transparent 40%)",
          zIndex: 3,
        }}
      />

      {/* LAYER 9: Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 4, mixBlendMode: "screen" }}
      />

      {/* LAYER 10: Vignette Edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,10,0.6) 100%)",
          zIndex: 5,
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orbDriftLeft {
          from { transform: translate(0px, 0px); }
          to   { transform: translate(60px, 80px); }
        }
        @keyframes orbDriftRight {
          from { transform: translate(0px, 0px); }
          to   { transform: translate(-50px, -60px); }
        }
        @keyframes centerPulse {
          from { transform: translate(-50%,-50%) scale(1.0); opacity: 0.8; }
          to   { transform: translate(-50%,-50%) scale(1.2); opacity: 1.0; }
        }
      `}} />
    </div>
  );
};
