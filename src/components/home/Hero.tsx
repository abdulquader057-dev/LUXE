// src/components/home/Hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles as LucideSparkles, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3 depth layers with different parallax speeds
  const bgX  = useTransform(mouseX, [-1, 1], [-20, 20]);
  const bgY  = useTransform(mouseY, [-1, 1], [-12, 12]);
  const midX = useTransform(mouseX, [-1, 1], [-40, 40]);
  const midY = useTransform(mouseY, [-1, 1], [-24, 24]);
  const fgX  = useTransform(mouseX, [-1, 1], [-64, 64]);
  const fgY  = useTransform(mouseY, [-1, 1], [-40, 40]);

  const bgXSpring  = useSpring(bgX,  { stiffness: 50, damping: 20 });
  const bgYSpring  = useSpring(bgY,  { stiffness: 50, damping: 20 });
  const midXSpring = useSpring(midX, { stiffness: 60, damping: 22 });
  const midYSpring = useSpring(midY, { stiffness: 60, damping: 22 });
  const fgXSpring  = useSpring(fgX,  { stiffness: 80, damping: 25 });
  const fgYSpring  = useSpring(fgY,  { stiffness: 80, damping: 25 });

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1; // -1..1
      const y = ((e.clientY - rect.top)  / rect.height) * 2 - 1; // -1..1
      mouseX.set(x);
      mouseY.set(y);
    };
    const handleReset = () => { mouseX.set(0); mouseY.set(0); };

    // Device orientation for mobile
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = Math.max(-30, Math.min(30, e.gamma || 0)) / 30;
      const beta  = Math.max(-20, Math.min(20, (e.beta  || 0) - 40)) / 20;
      mouseX.set(gamma);
      mouseY.set(beta);
    };

    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMouseMove);
    el?.addEventListener("mouseleave", handleReset);
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      el?.removeEventListener("mousemove", handleMouseMove);
      el?.removeEventListener("mouseleave", handleReset);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Layer 1 — background gradient (slowest, 0.02x) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgXSpring, y: bgYSpring }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(107,30,60,0.05) 0%, transparent 55%)" }} />
        {/* Animated dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(201,168,76,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Gold horizontal accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />

      {/* Layer 2 — product visual placeholder (medium speed) */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ x: midXSpring, y: midYSpring, opacity: 0.04 }}
      >
        <div
          className="w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.5) 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* Layer 3 — text / logo (fastest, foreground) */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ x: fgXSpring, y: fgYSpring }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <LucideSparkles size={12} style={{ color: "#C9A84C" }} />
          <span
            className="text-[10px] uppercase tracking-[0.25em] font-semibold"
            style={{ fontFamily: "var(--font-sora)", color: "#00f2ff" }}
          >
            Premium LUXE Collection — Latest Drop
          </span>
        </motion.div>

        {/* Main headline — gold gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-cormorant font-light leading-none tracking-tight mb-4 floatHeadline"
          style={{
            background: "linear-gradient(135deg, #00f2ff 0%, #00d8ff 50%, #008da5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(0,242,255,0.2))",
          }}
        >
          Luxury
          <span
            className="block italic"
            style={{
              background: "linear-gradient(135deg, #00d8ff 0%, #00f2ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Redefined
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 1, 0.15, 1] }}
          className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-sora)", color: "rgba(240,237,232,0.55)", lineHeight: 1.75 }}
        >
          Affordable luxury fashion crafted from premium breathable fabrics.
          Designed for the bold generation of Hyderabad.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-2 px-8 py-4 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300"
            style={{
              background: "var(--accent-gold, #C9A84C)",
              color: "#0A0A0F",
              fontFamily: "var(--font-sora)",
              boxShadow: "0 4px 24px rgba(201,168,76,0.3)",
            }}
          >
            Shop Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/drops"
            className="flex items-center gap-2 px-8 py-4 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#00f2ff",
              fontFamily: "var(--font-sora)",
            }}
          >
            Upcoming Drops
          </Link>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap gap-8 justify-center mt-16"
        >
          {[
            { icon: <LucideSparkles size={14} />, label: "Premium Luxury Fabric", sub: "Breathable & Soft" },
            { icon: <LucideSparkles size={14} />, label: "Calibrated Fit",       sub: "Perfect sizing" },
            { icon: <span className="text-xs font-mono">📍</span>, label: "Hyderabad", sub: "Fast delivery" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 text-center">
              <div style={{ color: "#C9A84C" }}>{stat.icon}</div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-primary)" }}>{stat.label}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "rgba(240,237,232,0.3)" }}>{stat.sub}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "rgba(240,237,232,0.2)" }}
      >
        <div className="w-[1px] h-12" style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)" }} />
        <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
