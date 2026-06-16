"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGold, setIsGold] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    const checkGoldStatus = () => {
      try {
        const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
        const isGoldTheme = ["Royal Obsidian", "Cognac", "Midnight Rose"].includes(activeTheme);
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        const userLevel = user?.user_metadata?.style_dna?.level || 0;
        const isGoldProfile = profile?.tier === "Gold" || profile?.role === "admin";
        
        setIsGold(isGoldTheme || isGoldLocal || userLevel >= 3 || isGoldProfile);
      } catch (e) {}
    };
    checkGoldStatus();
  }, [user, profile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    
    interface Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      twinkleSpeed: number;
      phase: number;
    }
    
    const stars: Star[] = [];
    const particles: Array<{ x:number; y:number; size:number; speedY:number; speedX:number; opacity:number; swayRange:number; swaySpeed:number; time:number }> = [];
    
    const populateStars = () => {
      stars.length = 0;
      const isMobile = window.innerWidth < 768;
      const starCount = isMobile ? 60 : 150;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.7 + 0.3, // Tiny stars: 0.3px to 1.0px
          baseOpacity: Math.random() * 0.20 + 0.05, // Faint: 0.05 to 0.25 opacity
          twinkleSpeed: Math.random() * 0.008 + 0.003, // Slow twinkling
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      populateStars();
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    const count = isGold ? 35 : 0;
    for (let k = 0; k < count; k++) {
      particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*1.8+0.5, speedY: -(Math.random()*0.35+0.1), speedX: 0, opacity: Math.random()*0.35+0.08, swayRange: Math.random()*0.5+0.2, swaySpeed: Math.random()*0.002+0.001, time: Math.random()*10000 });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Twinkling Stars
      stars.forEach(s => {
        s.phase += s.twinkleSpeed;
        const opacity = s.baseOpacity + Math.sin(s.phase) * 0.05;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 245, 255, ${Math.max(0.02, opacity)})`;
        ctx.fill();
      });

      if (isGold) {
        particles.forEach(p => {
          p.time += 16; p.y += p.speedY;
          p.x += Math.sin(p.time * p.swaySpeed) * p.swayRange * 0.3;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fillStyle = "#C9A84C"; ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 5; ctx.shadowColor = "#C9A84C"; ctx.fill();
          if (p.y < -10) { p.y = canvas.height+10; p.x = Math.random()*canvas.width; }
          if (p.x < -10 || p.x > canvas.width+10) p.x = Math.random()*canvas.width;
        });
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", handleResize); cancelAnimationFrame(animId); };
  }, [isGold]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "var(--bg-base, #0A0A0F)", transition: "background 1s" }}>
      {/* Background depth radial glow */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, var(--theme-card, #12121A) 0%, transparent 75%)", opacity: 0.9 }} />

      {/* Slow-moving gold orb 1 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700, height: 700,
          top: "-15%", left: "-10%",
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          animation: "goldOrbFloat1 24s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      {/* Slow-moving gold orb 2 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600, height: 600,
          bottom: "-10%", right: "-8%",
          background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
          animation: "goldOrbFloat2 30s ease-in-out infinite",
          filter: "blur(50px)",
        }}
      />
      {/* Deep burgundy orb */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          top: "40%", left: "60%",
          background: "radial-gradient(circle, rgba(107,30,60,0.05) 0%, transparent 70%)",
          animation: "burgundyOrbFloat 20s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />

      {/* Noise / film grain SVG texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.02, mixBlendMode: "overlay" }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      {/* Gold dust particles canvas (for Gold tier) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
