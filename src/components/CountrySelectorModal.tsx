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
  { code: "hi", currency: "INR", name: "India (Hindi)", flag: "🇮🇳" },
  { code: "te", currency: "INR", name: "India (Telugu)", flag: "🇮🇳" },
  { code: "ta", currency: "INR", name: "India (Tamil)", flag: "🇮🇳" },
  { code: "mr", currency: "INR", name: "India (Marathi)", flag: "🇮🇳" },
  { code: "ml", currency: "INR", name: "India (Malayalam)", flag: "🇮🇳" },
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 relative bg-white">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome to LUXE</h2>
            <p className="text-sm text-gray-500">Please select your country for shopping</p>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto p-4 custom-scrollbar bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {countries.map((country, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(country)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-black hover:shadow-md transition-all group bg-white"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{country.flag}</span>
                  <span className="text-xs font-semibold text-gray-800 text-center">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
