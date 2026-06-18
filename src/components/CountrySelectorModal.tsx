"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Compass, Loader2 } from "lucide-react";
import { useCommerce, Currency } from "@/lib/contexts/CommerceContext";
import toast from "react-hot-toast";

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  { name: "India", flag: "🇮🇳", currency: "INR" },
  { name: "USA", flag: "🇺🇸", currency: "USD" },
  { name: "United Kingdom", flag: "🇬🇧", currency: "USD" },
  { name: "United Arab Emirates", flag: "🇦🇪", currency: "USD" },
  { name: "Saudi Arabia", flag: "🇸🇦", currency: "USD" },
  { name: "France", flag: "🇫🇷", currency: "EUR" },
  { name: "Germany", flag: "🇩🇪", currency: "EUR" },
  { name: "Turkey", flag: "🇹🇷", currency: "USD" },
  { name: "Azerbaijan", flag: "🇦🇿", currency: "USD" },
  { name: "Qatar", flag: "🇶🇦", currency: "USD" },
  { name: "Kuwait", flag: "🇰🇼", currency: "USD" },
  { name: "Bahrain", flag: "🇧🇭", currency: "USD" },
  { name: "Oman", flag: "🇴🇲", currency: "USD" },
  { name: "Netherlands", flag: "🇳🇱", currency: "EUR" },
  { name: "Italy", flag: "🇮🇹", currency: "EUR" },
  { name: "Spain", flag: "🇪🇸", currency: "EUR" },
];

export const CountrySelectorModal = ({ isOpen, onClose }: CountrySelectorModalProps) => {
  const { setCountry, setCurrency } = useCommerce();
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (countryName: string, defaultCurrency: string) => {
    setCountry(countryName);
    setCurrency(defaultCurrency as Currency);
    onClose();
  };

  const autoDetectCountry = () => {
    setDetecting(true);
    const toastId = toast.loading("Locating coordinates...");

    const geoOverride = typeof window !== "undefined" ? localStorage.getItem("luxe-override-geolocation") : "default";

    if (geoOverride === "denied") {
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.error("Location access denied. Please select manually.");
        setDetecting(false);
      }, 800);
      return;
    }

    if (geoOverride === "granted") {
      setTimeout(() => {
        toast.dismiss(toastId);
        handleSelect("India", "INR");
        toast.success("Detected location: India (Simulated). Welcome to LUXE!");
        setDetecting(false);
      }, 800);
      return;
    }

    if (!navigator.geolocation) {
      toast.dismiss(toastId);
      toast.error("Geolocation is not supported by your browser");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (!res.ok) throw new Error("Failed to reverse geocode");
          const data = await res.json();
          const detectedCountry = data.address?.country || "";
          
          toast.dismiss(toastId);
          
          if (detectedCountry.toLowerCase().includes("india")) {
            handleSelect("India", "INR");
            toast.success("Detected location: India. Welcome to LUXE!");
          } else {
            const match = countries.find(c => detectedCountry.toLowerCase().includes(c.name.toLowerCase()));
            if (match) {
              handleSelect(match.name, match.currency);
              toast.success(`Detected location: ${match.name}. Welcome to LUXE!`);
            } else {
              handleSelect("USA", "USD");
              toast.success(`Detected: ${detectedCountry}. Defaulted to USA.`);
            }
          }
        } catch (err) {
          toast.dismiss(toastId);
          toast.error("Could not auto-detect country. Please select manually.");
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        toast.dismiss(toastId);
        toast.error("Location access denied. Please select manually.");
        setDetecting(false);
      }
    );
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
          className="relative w-full max-w-2xl bg-[#0a0a0f]/95 border border-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)] flex flex-col max-h-[80vh] relative z-10"
        >
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-white/5 relative bg-transparent px-8 text-center">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-display font-light italic text-white mb-1">Welcome to LUXE</h2>
            <p className="text-xs font-sora text-white/40 uppercase tracking-wider mb-4">Please select your country for shopping</p>
            
            {/* Auto detect button */}
            <button
              onClick={autoDetectCountry}
              disabled={detecting}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all text-[9px] font-mono tracking-widest uppercase cursor-pointer"
            >
              {detecting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Compass size={12} className="animate-pulse" />
                  Auto-Detect Location
                </>
              )}
            </button>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto p-4 custom-scrollbar bg-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {countries.map((country, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(country.name, country.currency)}
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
