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
          "h-[64px] md:h-[64px] flex items-center px-8",
          "bg-[rgba(7,7,15,0.7)] backdrop-blur-[32px] saturate-[180%] border-b border-[rgba(0,229,204,0.08)]",
          "shadow-[0_1px_0_rgba(0,229,204,0.04),0_8px_32px_rgba(0,0,0,0.4)]"
        )}
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Magnetic>
              <Link href="/" className="text-[28px] font-display font-black tracking-[0.15em] text-white group flex items-center gap-1 hover:scale-[1.02] transition-all duration-300">
                LUXE<span className="text-primary animate-pulse shadow-[0_0_10px_#00e5cc]">.</span>
              </Link>
            </Magnetic>
            
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Magnetic key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-[12px] font-nav font-medium tracking-[0.3em] transition-all uppercase group py-2",
                        isActive ? "text-primary" : "text-white/60 hover:text-white"
                      )}
                    >
                      {link.name}
                      <span className={cn(
                        "absolute bottom-0 left-0 h-[1.5px] bg-primary transition-transform duration-300 ease-out origin-left",
                        isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                      )} />
                    </Link>
                  </Magnetic>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:block scale-90 origin-right">
              <CurrencySwitcher />
            </div>
            
            <div className="flex items-center gap-2">
              <Magnetic>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-primary hover:drop-shadow-[0_0_24px_rgba(0,229,204,0.3)] transition-all"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </Magnetic>
              
              <Magnetic>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-primary hover:drop-shadow-[0_0_24px_rgba(0,229,204,0.3)] transition-all relative group">
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span className="absolute top-2 right-2 w-[14px] h-[14px] bg-[#00E5CC] rounded-full flex items-center justify-center text-[8px] font-tech font-bold text-black group-hover:animate-bounce">
                    2
                  </span>
                </button>
              </Magnetic>

              <Magnetic>
                <Link href="/profile" className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-primary hover:drop-shadow-[0_0_24px_rgba(0,229,204,0.3)] transition-all relative group">
                   <User size={18} strokeWidth={1.5} />
                   <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-primary/20 text-[8px] font-tech text-primary whitespace-nowrap pointer-events-none">
                     CONNECTED
                   </div>
                </Link>
              </Magnetic>

              <button 
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-primary transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-4 ml-4">
               <div className="flex flex-col items-end relative overflow-hidden py-1 pr-1">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="w-1.5 h-1.5 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[9px] font-tech font-bold tracking-widest text-primary uppercase">Neural Sync Active</span>
                  </div>
                  <span className="text-[8px] font-tech tracking-widest text-white/20 uppercase">Core v4.2</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
               </div>
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
