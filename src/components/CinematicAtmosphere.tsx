"use client";

import React, { useRef, useEffect } from "react";

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
    const particleCount = isMobile ? 20 : 40;

    const colors = [
      "rgba(201,169,98,0.4)",  // gold dust
      "rgba(232,213,183,0.3)",  // warm pale
      "rgba(166,124,82,0.4)"    // warm bronze
    ];

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10000 + 8000, 
      time: Math.random() * 10000,
      swaySpeed: Math.random() * 0.001 + 0.0005,
      swayAmount: Math.random() * 0.4 + 0.1,
    }));

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.time += dt;
        
        const progress = (p.time % p.duration) / p.duration;
        p.opacity = Math.sin(progress * Math.PI) * 0.7;
        
        ctx.beginPath();
        const currentX = p.x + Math.sin(p.time * p.swaySpeed) * p.swayAmount * 15;
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
    <div className="fixed inset-0 z-bg pointer-events-none overflow-hidden select-none" style={{ backgroundColor: "#0A0A0C" }}>
      {/* LAYER 1: Base Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #16161A 0%, #0F0F12 35%, #0A0A0C 65%, #0A0A0C 100%)",
          zIndex: 0
        }}
      />

      {/* LAYER 2: Warm Center Glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,169,98,0.03) 0%, transparent 70%)",
          zIndex: 1
        }}
      />

      {/* LAYER 3: Rose Gold Ambient Orb Left */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,169,98,0.12) 0%, transparent 60%)",
          filter: "blur(90px)",
          top: "-250px",
          left: "-250px",
          zIndex: 1,
          animation: "orbDriftLeft 30s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 4: Blush Ambient Orb Right */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,213,183,0.08) 0%, transparent 60%)",
          filter: "blur(90px)",
          bottom: "-150px",
          right: "-150px",
          zIndex: 1,
          animation: "orbDriftRight 25s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 5: Deep Bronze Pulse Center */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full top-1/2 left-1/2"
        style={{
          background: "radial-gradient(circle, rgba(166,124,82,0.12) 0%, transparent 50%)",
          filter: "blur(140px)",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          animation: "centerPulse 20s ease-in-out infinite alternate",
        }}
      />

      {/* LAYER 6: Noise Grain Texture (Subtler) */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 2,
        }}
      />

      {/* LAYER 7: Ultra Fine Grid (More spread out, editorial) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          zIndex: 2,
        }}
      />

      {/* LAYER 8: Blush Vignette Bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(201,169,98,0.02) 0%, transparent 35%)",
          zIndex: 3,
        }}
      />

      {/* LAYER 9: Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 4, mixBlendMode: "screen" }}
      />

      {/* LAYER 10: Vignette Edges (Obsidian framing) */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,12,0.85) 100%)",
          zIndex: 5,
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orbDriftLeft {
          from { transform: translate(0px, 0px) scale(1); }
          to   { transform: translate(80px, 100px) scale(1.1); }
        }
        @keyframes orbDriftRight {
          from { transform: translate(0px, 0px) scale(1); }
          to   { transform: translate(-70px, -90px) scale(1.15); }
        }
        @keyframes centerPulse {
          from { transform: translate(-50%,-50%) scale(0.9); opacity: 0.7; }
          to   { transform: translate(-50%,-50%) scale(1.1); opacity: 1.0; }
        }
      `}} />
    </div>
  );
};
