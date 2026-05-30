"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const checkGoldStatus = () => {
      try {
        const savedMockProfile = localStorage.getItem("luxe-mock-profile");
        const savedMockUser = localStorage.getItem("luxe-mock-user");
        const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
        const isGoldTheme = ["Royal Obsidian", "Cognac", "Midnight Rose"].includes(activeTheme);
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        
        let hasGoldLevel = false;
        if (savedMockUser) {
          const userObj = JSON.parse(savedMockUser);
          if (userObj?.user_metadata?.style_dna?.level >= 3) {
            hasGoldLevel = true;
          }
        }

        let isGoldProfile = false;
        if (savedMockProfile) {
          const profile = JSON.parse(savedMockProfile);
          if (profile?.tier === "Gold" || profile?.role === "admin") {
            isGoldProfile = true;
          }
        }

        setIsGold(isGoldTheme || isGoldLocal || hasGoldLevel || isGoldProfile);
      } catch (e) {}
    };

    checkGoldStatus();
    
    // Check frequently and listen to storage changes
    window.addEventListener("storage", checkGoldStatus);
    const interval = setInterval(checkGoldStatus, 1500);
    return () => {
      window.removeEventListener("storage", checkGoldStatus);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      swayRange: number;
      swaySpeed: number;
      time: number;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const particleCount = isGold ? 40 : 0;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.5,
      speedY: -(Math.random() * 0.35 + 0.1),
      speedX: 0,
      opacity: Math.random() * 0.4 + 0.1,
      swayRange: Math.random() * 0.5 + 0.2,
      swaySpeed: Math.random() * 0.002 + 0.001,
      time: Math.random() * 10000,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isGold && particles.length > 0) {
        particles.forEach((p) => {
          p.time += 16; // approx 60fps frame delta
          p.y += p.speedY;
          p.x += Math.sin(p.time * p.swaySpeed) * p.swayRange * 0.3;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#D4AF37";
          ctx.fill();

          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -10 || p.x > canvas.width + 10) {
            p.x = Math.random() * canvas.width;
          }
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGold]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-bg-base transition-colors duration-1000">
      {/* Background depth radial glow */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, var(--theme-card, #0A0D14) 0%, transparent 80%)",
          opacity: 0.95
        }}
      />
      
      {/* Subtle Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Gold Dust Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
