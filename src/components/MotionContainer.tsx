"use client";

import React from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  animation?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerChildren = 0.1) => ({
    opacity: 1,
    transition: {
      staggerChildren,
    },
  }),
};

export const MotionContainer = ({ children, className, delay = 0, staggerChildren = 0.1 }: MotionContainerProps) => {
  return (
    <motion.div
      variants={containerVariants}
      custom={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

interface MotionItemProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  animation?: string;
  delay?: number;
}

const itemVariants: Record<string, Variants> = {
  reveal: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1 }
    },
  },
};

export const MotionItem = ({ children, className, variant, animation, delay }: MotionItemProps) => {
  const selectedVariant = variant || animation || "reveal";
  const variants = itemVariants[selectedVariant] || itemVariants.reveal;

  return (
    <motion.div
      variants={variants}
      className={className}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection = ({ children, className, speed = 0.5 }: ParallaxSectionProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
