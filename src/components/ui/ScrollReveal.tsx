"use client";

import React from "react";
import { motion } from "framer-motion";

type RevealVariant = "fadeUp" | "slideLeft" | "flipCard" | "scaleReveal" | "stagger";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  index?: number; // for stagger
}

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  flipCard: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
  },
  scaleReveal: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  stagger: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
};

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className = "",
  index = 0,
}: ScrollRevealProps) {
  const staggerDelay = variant === "stagger" ? index * 0.07 : delay;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants[variant]}
      transition={{
        duration,
        delay: staggerDelay,
        ease: [0.25, 1, 0.5, 1],
        ...(variant === "flipCard" ? { type: "spring", stiffness: 100, damping: 15 } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}
