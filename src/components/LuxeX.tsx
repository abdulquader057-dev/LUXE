"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LuxeXProps {
  className?: string;
  size?: number;
  isSmall?: boolean;
  delayOffset?: number;
}

export const LuxeX = ({ className, size = 96, isSmall = false, delayOffset = 0 }: LuxeXProps) => {
  const scale = isSmall ? 0.55 : 1;
  const strokeWidth = 7;
  const viewBoxWidth = 72;
  const viewBoxHeight = 96;
  const center = { x: 36, y: 48 };

  const transition = {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay: 0.35 + delayOffset,
  };

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center relative overflow-visible", className)}
      style={{ width: viewBoxWidth * scale, height: viewBoxHeight * scale }}
      initial={{ opacity: 0, y: -30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transition}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id="luxeXGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="72"
            y2="96"
          >
            <stop offset="0%" stopColor="#00E5CC" />
            <stop offset="50%" stopColor="#6C3FE8" />
            <stop offset="100%" stopColor="#C9A96E" />
          </linearGradient>

          <filter id="junctionGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* X Strokes */}
        <motion.line
          x1="12" y1="24" x2="60" y2="72"
          stroke="url(#luxeXGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.0 + delayOffset, ease: "easeOut" }}
        />
        <motion.line
          x1="60" y1="24" x2="12" y2="72"
          stroke="url(#luxeXGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + delayOffset, ease: "easeOut" }}
        />

        {/* Junction Pulse */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={10}
          fill="rgba(0, 229, 204, 0.2)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.15, 0.45, 0.15],
            r: [10, 18, 10]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2.0 + delayOffset
          }}
        />

        {/* Junction Node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 1.5 + delayOffset 
          }}
        >
          <circle cx={center.x} cy={center.y} r={5} fill="#00E5CC" filter="url(#junctionGlow)" />
          <circle cx={center.x} cy={center.y} r={2.5} fill="white" />
        </motion.g>

        {/* Orbiting Ring */}
        <motion.g
          initial={{ opacity: 0, scale: 0.2, rotate: -120 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 1.65 + delayOffset, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r={22}
            stroke="url(#luxeXGradient)"
            strokeWidth="0.8"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.6"
            className="origin-center"
          />
          <motion.circle
            cx={center.x + 22}
            cy={center.y}
            r={2.5}
            fill="#00E5CC"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          />
        </motion.g>

        {/* Energy Threads (Hidden on Mobile) */}
        {!isSmall && (
          <g className="hidden md:block">
            {[
              { x2: center.x - 20, y2: center.y - 20, color: "#00E5CC", delay: 1.9 },
              { x2: center.x + 20, y2: center.y - 20, color: "#6C3FE8", delay: 2.0 },
              { x2: center.x - 20, y2: center.y + 20, color: "#C9A96E", delay: 2.1 },
              { x2: center.x + 20, y2: center.y + 20, color: "#00E5CC", delay: 2.2 },
            ].map((thread, i) => (
              <motion.line
                key={i}
                x1={center.x}
                y1={center.y}
                x2={thread.x2}
                y2={thread.y2}
                stroke={thread.color}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.4, delay: thread.delay + delayOffset }}
              />
            ))}
          </g>
        )}
      </svg>
      
      {/* Interactive Hover Logic is handled by the parent Logo container */}
    </motion.div>
  );
};
