"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Search, ShoppingBag, User, Zap, LogIn, Globe, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCommerce, Currency } from "@/lib/contexts/CommerceContext";
import { CountrySelectorModal } from "./CountrySelectorModal";
import { SearchModal } from "./SearchModal";

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const cartControls = useAnimation();
  const { t } = useLanguage();
  const { user, profile, isAdmin } = useAuth();
  const { currency, setCurrency, cartCount, toggleCart, availableCurrencies } = useCommerce();
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const checkGoldStatus = () => {
      try {
        const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
        const isGoldTheme = ["Royal Obsidian", "Cognac", "Midnight Rose"].includes(activeTheme);
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        const userLevel = user?.user_metadata?.style_dna?.level || 0;
        
        setIsGold(isGoldTheme || isGoldLocal || userLevel >= 3 || profile?.tier === "Gold" || profile?.role === "admin");
      } catch (e) {}
    };

    checkGoldStatus();
  }, [user, profile]);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);

    const handleOpenCountryModal = () => {
      setIsCountryModalOpen(true);
    };
    window.addEventListener("open-country-modal", handleOpenCountryModal);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-country-modal", handleOpenCountryModal);
    };
  }, [lastScrollY]);

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.aiStylist"), href: "/ai-style" },
    { name: t("nav.collections"), href: "/shop?cat=collections" },
    { name: t("nav.shop"), href: "/shop" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-6",
        isScrolled 
          ? "bg-[#050508]/85 backdrop-blur-md border-b border-white/5 py-4" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-8 pl-16 md:pl-20">
          <Link href="/" className="text-2xl font-display font-black tracking-tighter text-white hover:text-white/80 transition-colors">
            LUXE<span className="text-white/40">.</span>
          </Link>
          
          {/* Main Nav Links */}
          <div className="hidden md:flex items-center gap-8 pl-8 border-l border-white/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[10px] font-sora font-bold tracking-widest uppercase transition-colors relative py-2",
                    isActive ? "text-white" : "text-white/40 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Currency Pills */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            {availableCurrencies.map((cur) => (
              <button 
                key={cur}
                onClick={() => setCurrency(cur)}
                className={cn(
                  "text-[9px] font-sora font-bold tracking-wider transition-colors",
                  currency === cur ? "text-white" : "text-white/40 hover:text-white/80"
                )}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search size={16} />
            </button>

            {/* Country Selector */}
            <button 
              onClick={() => setIsCountryModalOpen(true)}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Globe size={16} />
            </button>

            {/* Cart */}
            <button 
              onClick={toggleCart} 
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors relative"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] rounded-full flex items-center justify-center text-[7px] font-bold text-[#050508] shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin OS Shortcut */}
            {isAdmin && (
              <Link href="/admin">
                <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 text-primary hover:bg-primary/20 transition-colors shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                  <Settings size={16} className="animate-spin-slow" />
                </button>
              </Link>
            )}

            {/* User / Login */}
            <Link href={user ? "/profile" : "/auth"} className="flex items-center gap-2">
              {isGold && (
                <span className="text-[#D4AF37] font-sora font-bold text-[10px] tracking-wider uppercase animate-pulse-glow mr-1">
                  {profile?.full_name || user?.user_metadata?.full_name || "Vanguard"}
                </span>
              )}
              <button className={cn(
                "w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                isGold ? "border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#D4AF37]/80" : "border-white/10"
              )}>
                {user ? <User size={16} /> : <LogIn size={16} />}
              </button>
            </Link>
          </div>

          {/* System Status Badge */}
          <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right">
              <div className="text-[10px] font-sora font-bold tracking-widest text-white">SYSTEM SYNC</div>
              <div className="text-[9px] font-sora tracking-widest text-white/40">
                {user ? "SECURE UPLINK" : "NEURAL LINK"}
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              user 
                ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                : "bg-white/5 border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            }`}>
              <Zap size={14} className={user ? "text-green-400" : "text-white/50"} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Trust Marquee */}
      <div className="w-full bg-black/90 border-t border-white/5 py-2 overflow-hidden relative z-10 flex select-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex whitespace-nowrap gap-16 text-[8px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase"
        >
          <span>✦ FREE SHIPPING ACROSS INDIA</span>
          <span>✦ CASH ON DELIVERY (COD) AVAILABLE</span>
          <span>✦ 100% SECURE TRANSACTIONS</span>
          <span>✦ 7-DAY NO-QUESTIONS RETURN POLICY</span>
          <span>✦ LUXURY SOFT COTTON COLLECTION</span>

          <span>✦ FREE SHIPPING ACROSS INDIA</span>
          <span>✦ CASH ON DELIVERY (COD) AVAILABLE</span>
          <span>✦ 100% SECURE TRANSACTIONS</span>
          <span>✦ 7-DAY NO-QUESTIONS RETURN POLICY</span>
          <span>✦ LUXURY SOFT COTTON COLLECTION</span>
        </motion.div>
      </div>
      
      <CountrySelectorModal 
        isOpen={isCountryModalOpen} 
        onClose={() => setIsCountryModalOpen(false)} 
      />

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;
