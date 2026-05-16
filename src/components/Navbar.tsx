"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LuxeLogo from "./LuxeLogo";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ delay: 3.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 h-[64px] z-navbar flex items-center px-6 glass-standard !bg-[rgba(7,7,15,0.72)] !border-none !rounded-none border-b border-[rgba(0,229,204,0.07)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-8 flex-1">
        {/* LOGO IN NAV */}
        <Link href="/" className="scale-[0.45] origin-left -ml-4">
          <LuxeLogo showTagline={false} />
        </Link>

        {/* NAV LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { name: "Collections", href: "/shop" },
            { name: "The Archive", href: "/swipe" },
            { name: "Neural DNA", href: "/profile" },
            { name: "Build", href: "/build-outfit" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative text-[12px] font-rajdhani tracking-[0.3em] uppercase transition-colors group",
                pathname === link.href ? "text-accent-cyan" : "text-text-secondary hover:text-white"
              )}
            >
              {link.name}
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-[1px] bg-accent-cyan origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: pathname === link.href ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* NEURAL SYNC BADGE */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-standard !rounded-full border-[rgba(0,229,204,0.1)] group relative overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00E5CC] animate-pulse" />
          <span className="text-[9px] font-orbitron text-accent-cyan tracking-widest uppercase">Neural Sync</span>
          
          {/* Scanline Sweep */}
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[20deg]"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-5">
          <button className="text-text-secondary hover:text-accent-cyan transition-all hover:drop-shadow-[0_0_8px_rgba(0,229,204,0.3)]">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <button className="relative text-text-secondary hover:text-accent-cyan transition-all hover:drop-shadow-[0_0_8px_rgba(0,229,204,0.3)]">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <motion.span 
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-cyan text-black text-[8px] font-bold rounded-full flex items-center justify-center"
              whileTap={{ scale: 1.3 }}
            >
              0
            </motion.span>
          </button>

          <Link href="/profile" className="text-text-secondary hover:text-accent-cyan transition-all hover:drop-shadow-[0_0_8px_rgba(0,229,204,0.3)]">
            <User size={20} strokeWidth={1.5} />
          </Link>

          <button className="lg:hidden text-text-secondary">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
