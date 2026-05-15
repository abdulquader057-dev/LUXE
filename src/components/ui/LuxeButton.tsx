"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LuxeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "hud";
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
  const baseStyles = "relative inline-flex items-center justify-center gap-3 overflow-hidden font-mono tracking-[0.2em] uppercase transition-all duration-500 ease-luxury group disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-[8px]",
    md: "px-8 py-3.5 text-[10px]",
    lg: "px-12 py-5 text-[12px]",
  };

  const variants = {
    primary: "bg-primary text-black font-bold shadow-[0_0_20px_rgba(0,229,204,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
    outline: "border border-primary/30 text-primary hover:border-primary hover:bg-primary/5",
    ghost: "text-white/40 hover:text-white hover:bg-white/5",
    hud: "hud-border bg-black/40 backdrop-blur-md text-white/80 hover:text-primary hover:border-primary/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {/* Glitch Effect on Hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[800ms] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg]" />
      
      {/* Scanning Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 group-hover:animate-[scanning-beam_2s_linear_infinite]" />

      {icon && <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      <span className="relative z-10">{children}</span>
      
      {/* Corner Brackets for HUD variant */}
      {variant === "hud" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors" />
        </div>
      )}
    </motion.button>
  );
};
