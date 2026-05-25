"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
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
    { name: "Collections", href: "/" },
    { name: "Drops", href: "/drops" },
    { name: "Feed", href: "/feed" },
    { name: "Build Fit", href: "/build-outfit" },
    { name: "Archive", href: "/shop" },
    { name: "Identity", href: "/profile" },
  ];

  const handleCartClick = () => {
    cartControls.start({
      scale: [1, 1.4, 0.9, 1],
      transition: { duration: 0.4, ease: "easeInOut" }
    });
  };

  return (
    <motion.nav
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex flex-col px-6 md:px-12 py-6 transition-all duration-700 ease-[0.25,1,0.5,1]",
        isScrolled 
          ? "bg-[#0B0B0E] border-b border-white/[0.03] shadow-[0_4px_32px_rgba(0,0,0,0.5)]" 
          : "bg-[#0B0B0E] border-b border-transparent"
      )}
    >
      {/* 1. FORCE HEADER UNCOUPLING: Logo independent block */}
      <div 
        className="logo-container !p-0"
        style={{ display: "block", width: "fit-content", clear: "both", position: "relative", marginBottom: "40px" }}
      >
        <Link href="/" className="!p-0 !flex-row !gap-1 flex items-center">
          <span className="logo-luxe !text-2xl md:!text-3xl !text-[#FFFFFF]">LUXE</span>
          <span className="text-rose-gold !text-2xl md:!text-3xl">.</span>
        </Link>
      </div>

      <div className="flex items-center justify-between w-full">
        {/* Navigation links strictly below logo */}
        <div className="nav-links flex gap-6 lg:gap-10 overflow-hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative font-sora text-[10px] tracking-[0.2em] uppercase transition-colors duration-500",
                  isActive ? "text-[#FFFFFF]" : "text-[#FFFFFF]/50 hover:text-[#FFFFFF]"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#FFFFFF]"
                    transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions right */}
        <div className="utility-icons flex gap-5 shrink-0">
          <button aria-label="Search" className="text-[#FFFFFF]/50 hover:text-[#FFFFFF] transition-colors duration-500">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Cart" onClick={handleCartClick} className="relative text-[#FFFFFF]/50 hover:text-[#FFFFFF] transition-colors duration-500">
            <motion.div animate={cartControls} className="absolute inset-0 bg-[#FFFFFF]/10 rounded-full mix-blend-overlay opacity-0 scale-0 origin-center" />
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
          <Link href="/profile" className="hidden md:block text-[#FFFFFF]/50 hover:text-[#FFFFFF] transition-colors duration-500">
            <User size={18} strokeWidth={1.5} />
          </Link>
          <button aria-label="Menu" className="lg:hidden text-[#FFFFFF]/50 hover:text-[#FFFFFF] transition-colors duration-500">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
