"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, Heart, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "SHOP", href: "/shop" },
    { name: "MODEST", href: "/shop?category=modest-wear" },
    { name: "SNEAKERS", href: "/shop?category=sneakers" },
    { name: "AI STYLIST", href: "/ai-style" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "glass border-b py-3" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white">
              ZYVORA<span className="text-primary">.</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold tracking-widest text-white/70 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-white/70 hover:text-primary transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <button className="p-2 text-white/70 hover:text-primary transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(255,0,255,0.6)]" />
            </button>
            <button className="p-2 text-white/70 hover:text-primary transition-colors hidden md:block">
              <User size={20} />
            </button>
            <button 
              className="md:hidden p-2 text-white/70 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black tracking-tighter">ZYVORA<span className="text-primary">.</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-black tracking-tight hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex gap-6">
              <button className="flex-1 py-4 glass-morphism rounded-2xl flex items-center justify-center gap-2">
                <Search size={20} /> Search
              </button>
              <button className="flex-1 py-4 glass-morphism rounded-2xl flex items-center justify-center gap-2">
                <User size={20} /> Account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
