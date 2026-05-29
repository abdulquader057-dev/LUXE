// src/components/ui/LuxeButton.tsx
"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface LuxeButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "hud" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const LuxeButton = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  ...props
}: LuxeButtonProps) => {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-3 overflow-hidden font-mono tracking-[0.2em] uppercase transition-all duration-500 ease-luxury group disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-2 text-[8px]",
    md: "px-8 py-3.5 text-[10px]",
    lg: "px-12 py-5 text-[12px]",
  };

  const variants = {
    // Gold — warm, readable, luxury
    gold: "bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#e8c84a] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:bg-[#cda42b] active:text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50",
    // Primary — white with dark text, always readable
    primary:
      "bg-white text-[#050508] font-bold rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:bg-white/80 active:text-[#050508] focus:outline-none focus:ring-2 focus:ring-white/50",
    // Outline — bordered gold
    outline:
      "border-2 border-[#D4AF37]/60 text-[#D4AF37] font-bold rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:bg-[#cda42b] active:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30",
    // Ghost — subtle
    ghost: "text-white/60 hover:text-white hover:bg-white/5 rounded-xl active:bg-white/10 focus:outline-none",
    // HUD — techy glass
    hud: "border-2 border-white/20 bg-black/60 backdrop-blur-md text-white font-bold rounded-xl hover:text-[#D4AF37] hover:border-[#D4AF37]/60 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] active:bg-white/10 active:text-white focus:outline-none focus:ring-2 focus:ring-white/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[700ms] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-30deg] pointer-events-none" />

      {icon && (
        <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>

      {/* Corner Brackets for HUD variant */}
      {variant === "hud" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-colors" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-colors" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-colors" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-colors" />
        </div>
      )}
    </motion.button>
  );
};

export default LuxeButton;
