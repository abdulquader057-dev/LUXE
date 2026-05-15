"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, Heart, Settings, Cpu, Flame, Sparkles, Zap, Users, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./ui/Magnetic";
import { SearchModal } from "./SearchModal";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "COLLECTIONS", href: "/shop" },
    { name: "BUILD FIT", href: "/build-outfit" },
    { name: "DROPS", href: "/drops" },
    { name: "FEED", href: "/feed" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          "h-[64px] md:h-[72px] flex items-center px-8",
          "bg-[rgba(7,7,15,0.7)] backdrop-blur-[32px] saturate-[180%] border-b border-[rgba(0,229,204,0.08)]",
          "shadow-[0_1px_0_rgba(0,229,204,0.04),0_8px_32px_rgba(0,0,0,0.4)]"
        )}
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Scanning beam for navbar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0 w-full h-[2px] bg-primary animate-[scanning-beam_8s_linear_infinite]" />
        </div>

        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Magnetic>
              <Link href="/" className="relative text-[26px] font-display font-black tracking-[0.2em] text-white group flex items-center gap-1">
                <span className="relative z-10">LUXE</span>
                <span className="text-primary animate-pulse">.</span>
                {/* Logo scanning effect */}
                <motion.div 
                  className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </Link>
            </Magnetic>
            
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Magnetic key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-[10px] font-mono font-medium tracking-[0.4em] transition-all uppercase group py-2",
                        isActive ? "text-primary" : "text-white/40 hover:text-white"
                      )}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.span 
                          layoutId="nav-active"
                          className="absolute inset-0 bg-primary/5 border-x border-primary/20 -mx-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-500 ease-luxury",
                        isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                      )} />
                    </Link>
                  </Magnetic>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* System Status HUD */}
            <div className="hidden xl:flex items-center gap-4 px-4 py-2 border-x border-white/5 bg-white/[0.02]">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono tracking-[0.2em] text-white/30 uppercase">Neural Status</span>
                  <motion.div 
                    className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_#00E5CC]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="text-[9px] font-mono tracking-[0.1em] text-primary uppercase">Synchronized</span>
              </div>
              <div className="h-6 w-[1px] bg-white/5" />
              <div className="flex flex-col items-start">
                <span className="text-[8px] font-mono tracking-[0.2em] text-white/30 uppercase">Auth Level</span>
                <span className="text-[9px] font-mono tracking-[0.1em] text-white/80 uppercase">Tier 01 // Admin</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Magnetic>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary border border-transparent hover:border-primary/20 transition-all hover:bg-primary/5"
                >
                  <Search size={16} strokeWidth={1.5} />
                </button>
              </Magnetic>
              
              <Magnetic>
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-primary border border-transparent hover:border-primary/20 transition-all hover:bg-primary/5 relative group">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-black shadow-[0_0_10px_#00E5CC]">
                    02
                  </span>
                </button>
              </Magnetic>

              <div className="h-4 w-[1px] bg-white/10 mx-2" />

              <Magnetic>
                <button className="flex items-center gap-3 px-4 py-2 bg-primary text-black rounded-sm font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,204,0.3)]">
                  <User size={14} />
                  <span>Access</span>
                </button>
              </Magnetic>

              <button 
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white/60 hover:text-primary transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            <div className="p-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-16">
                <span className="text-[28px] font-display font-black tracking-[0.15em] text-white">LUXE<span className="text-primary">.</span></span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-5xl font-display font-black tracking-tight text-white/60 hover:text-white transition-all uppercase"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
