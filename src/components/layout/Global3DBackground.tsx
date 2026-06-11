"use client";

import React, { useEffect, useRef } from "react";

export default function Global3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Particles: gold stars + depth layers
    const PARTICLES = 280;
    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
      color: string; depth: number;
    };

    const COLORS = ["#C9A84C", "#E8C97A", "#D4AF37", "#9A7B30", "#F5D781"];

    const particles: Particle[] = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      depth: Math.random(),
    }));

    // Large ambient orbs (3D-like volumetric blobs)
    type Orb = { x: number; y: number; r: number; vx: number; vy: number; hue: number };
    const ORBS: Orb[] = [
      { x: w * 0.2, y: h * 0.3, r: 220, vx: 0.12, vy: 0.07, hue: 40 },
      { x: w * 0.8, y: h * 0.7, r: 180, vx: -0.09, vy: -0.11, hue: 35 },
      { x: w * 0.5, y: h * 0.5, r: 140, vx: 0.06, vy: -0.08, hue: 45 },
    ];

    let t = 0;

    const draw = () => {
      t += 0.005;

      // Background
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Draw ambient gold orbs (volumetric glow)
      ORBS.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r || orb.x > w + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > h + orb.r) orb.vy *= -1;

        const pulse = 0.8 + 0.2 * Math.sin(t + orb.hue);
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * pulse);
        grad.addColorStop(0, `rgba(201,168,76,0.07)`);
        grad.addColorStop(0.4, `rgba(201,168,76,0.04)`);
        grad.addColorStop(1, `rgba(201,168,76,0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw particles
      particles.forEach((p) => {
        // Parallax drift by depth
        p.x += p.vx * (0.4 + p.depth * 0.8);
        p.y += p.vy * (0.4 + p.depth * 0.8);

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Twinkle
        const twinkle = p.opacity * (0.7 + 0.3 * Math.sin(t * 2 + p.x));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(twinkle * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow for brighter stars
        if (p.r > 1.2) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          glow.addColorStop(0, `rgba(201,168,76,${twinkle * 0.3})`);
          glow.addColorStop(1, "rgba(201,168,76,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });

      // Draw connecting lines between close particles (constellation effect)
      for (let i = 0; i < PARTICLES; i++) {
        for (let j = i + 1; j < PARTICLES; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
