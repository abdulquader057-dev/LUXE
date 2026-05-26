"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useCommerce, Currency } from "@/lib/contexts/CommerceContext";

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  { code: "en", currency: "USD", name: "USA", flag: "🇺🇸" },
  { code: "en", currency: "GBP", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ar", currency: "USD", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "ar", currency: "USD", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "en", currency: "EUR", name: "France", flag: "🇫🇷" },
  { code: "en", currency: "EUR", name: "Germany", flag: "🇩🇪" },
  { code: "en", currency: "INR", name: "India", flag: "🇮🇳" },
  { code: "ur", currency: "INR", name: "Pakistan", flag: "🇵🇰" },
];

export const CountrySelectorModal = ({ isOpen, onClose }: CountrySelectorModalProps) => {
  const { setLanguage } = useLanguage();
  const { setCurrency } = useCommerce();

  if (!isOpen) return null;

  const handleSelect = (country: typeof countries[0]) => {
    setLanguage(country.code as any);
    setCurrency(country.currency as Currency);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0a0a0f]/95 border border-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)] flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-white/5 relative bg-transparent">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-display font-light italic text-white mb-1">Welcome to LUXE</h2>
            <p className="text-xs font-sora text-white/40 uppercase tracking-wider">Please select your country for shopping</p>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto p-4 custom-scrollbar bg-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {countries.map((country, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(country)}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 border border-white/5 bg-white/[0.02] rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{country.flag}</span>
                  <span className="text-[11px] font-sora font-semibold text-white/70 text-center uppercase tracking-wider">{country.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
