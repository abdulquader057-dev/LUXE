// src/components/home/Hero.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Hero = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  // Placeholder for any future interaction logic (e.g., navigation on click)
  const handleClick = () => {
    toast.success("Welcome to LUXE!");
    router.push("/shop");
  };

  return (
    <section className="relative min-h-screen bg-primary flex items-center justify-center overflow-hidden">
      {/* Dark cinematic background - could be an image or video */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gold gradient headline overlay */}
      <h1 className="relative text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-offwhite animate-pulse">
        LUXURY REDEFINED
      </h1>

      {/* Optional widgets – keep existing styling but make them appear on top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6"
      >
        {/* Widget 1 */}
        <div className="flex flex-col items-center text-center text-gold">
          <Sparkles size={24} />
          <span className="text-sm">{t("hero.styleMatch")}</span>
        </div>
        {/* Widget 2 */}
        <div className="flex flex-col items-center text-center text-gold">
          <TrendingUp size={24} />
          <span className="text-sm">{t("hero.trending")}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
