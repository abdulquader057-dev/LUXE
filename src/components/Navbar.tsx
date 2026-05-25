"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Search, ShoppingBag, User, Menu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Collections", href: "/shop?cat=collections" },
    { name: "Neural Drops", href: "/shop?sort=new" },
    { name: "Intel", href: "/shop?cat=intel" },
    { name: "Cognition", href: "/ai-style" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 transition-all duration-300 backdrop-blur-md bg-[#050508]/80 border-b border-white/5",
      )}
    >
      <div className="flex items-center gap-10 w-full">
        {/* Left Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[11px] font-sora font-semibold tracking-widest uppercase transition-colors duration-300 relative",
                  isActive ? "text-[#00F0FF]" : "text-white/60 hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <div className="absolute -bottom-5 left-0 right-0 h-[2px] bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Currency Pills */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            {["INR", "USD", "EUR", "GBP"].map((cur) => (
              <button 
                key={cur}
                className={cn(
                  "text-[9px] font-sora font-bold tracking-wider",
                  cur === "USD" ? "text-[#00F0FF]" : "text-white/40 hover:text-white/80"
                )}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Search size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors relative">
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#B52BFF] rounded-full flex items-center justify-center text-[7px] font-bold text-white shadow-[0_0_8px_rgba(181,43,255,0.6)]">
                3
              </span>
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <User size={16} />
            </button>
          </div>

          {/* Neural Sync Badge */}
          <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right">
              <div className="text-[10px] font-sora font-bold tracking-widest text-[#00F0FF]">NEURAL SYNC</div>
              <div className="text-[9px] font-sora tracking-widest text-white/40">ACTIVE CORE V4.2</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/30">
              <Zap size={14} className="text-[#00F0FF]" />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
