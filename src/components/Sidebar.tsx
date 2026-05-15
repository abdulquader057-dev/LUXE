"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Layers, Fingerprint, Activity,
  Heart, Compass, Search, Menu, X, Box, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./ui/Magnetic";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const mainLinks = [
    { name: "Discover", href: "/shop", icon: Compass },
    { name: "Artifacts", href: "/drops", icon: Box },
    { name: "Neural Fit", href: "/build-outfit", icon: Layers },
    { name: "Pulse", href: "/feed", icon: Activity },
  ];

  const secondaryLinks = [
    { name: "Archive", href: "/swipe", icon: Heart },
    { name: "Identity", href: "/profile", icon: Fingerprint },
  ];

  const renderNavIcon = (link: any, index: number) => {
    const isActive = pathname === link.href;

    return (
      <Link href={link.href} key={link.name} className="block w-full">
        <Magnetic>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
            className={cn(
              "relative flex items-center gap-4 px-5 py-4 transition-all duration-500 group cursor-pointer",
              isActive ? "bg-primary/5" : "hover:bg-white/[0.02]"
            )}
          >
            {/* Active Indicator Border */}
            {isActive && (
              <motion.div
                layoutId="activeSidebarBorder"
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_#00E5CC]"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            <div className="relative">
              <link.icon
                size={18}
                strokeWidth={isActive ? 2 : 1.2}
                className={cn(
                  "transition-all duration-300 z-10 relative",
                  isActive ? "text-primary scale-110" : "text-white/30 group-hover:text-white/80 group-hover:scale-110"
                )}
              />
              {isActive && (
                <motion.div 
                  layoutId="iconGlow"
                  className="absolute inset-0 bg-primary/20 blur-[8px] rounded-full -z-0" 
                />
              )}
            </div>

            <motion.span
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
              }}
              className={cn(
                "text-[9px] font-mono font-bold tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-300",
                isActive ? "text-primary" : "text-white/20 group-hover:text-white/80"
              )}
            >
              {link.name}
            </motion.span>

            {/* Scanning line indicator on active */}
            {isActive && isHovered && (
              <motion.div 
                className="absolute inset-x-0 h-[1px] bg-primary/20 pointer-events-none"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        </Magnetic>
      </Link>
    );
  };

  return (
    <>
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          width: isHovered ? "220px" : "64px",
          backgroundColor: isHovered ? "rgba(7, 7, 15, 0.95)" : "rgba(7, 7, 15, 0.4)",
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 h-screen z-[90] hidden lg:flex flex-col border-r border-white/[0.03] backdrop-blur-[12px] overflow-hidden group/sidebar"
      >
        <div className="flex-grow flex flex-col py-24">
          <nav className="flex flex-col gap-1">
            {mainLinks.map((link, i) => renderNavIcon(link, i))}
          </nav>

          <div className="mt-auto flex flex-col gap-1">
            <div className="px-5 mb-4">
               <div className="w-full h-px bg-white/[0.05]" />
            </div>
            {secondaryLinks.map((link, i) => renderNavIcon(link, i + 4))}
          </div>
        </div>

        {/* HUD Data Readout at Bottom */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 border-t border-white/[0.03]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Network</span>
                  <span className="text-[7px] font-mono text-green-400 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Latency</span>
                  <span className="text-[7px] font-mono text-white/60 uppercase tracking-widest">24ms</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile Bottom Navigation (High-Fidelity App Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pointer-events-none">
        <div className="h-[64px] bg-black/80 backdrop-blur-2xl border border-white/5 rounded-full flex items-center justify-around px-6 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {mainLinks.slice(0, 4).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link href={link.href} key={link.name} className="relative flex flex-col items-center gap-1">
                <link.icon 
                  size={18} 
                  strokeWidth={isActive ? 2 : 1.2} 
                  className={cn("transition-colors duration-300", isActive ? "text-primary" : "text-white/30")} 
                />
                {isActive && (
                  <motion.div 
                    layoutId="mobileNavGlow"
                    className="absolute -inset-2 bg-primary/10 blur-[10px] rounded-full -z-10"
                  />
                )}
                <span className={cn("text-[6px] font-mono uppercase tracking-[0.2em]", isActive ? "text-primary" : "text-white/20")}>
                  {link.name.slice(0, 4)}
                </span>
              </Link>
            );
          })}
          <Link href="/profile" className="relative flex flex-col items-center gap-1">
            <Fingerprint 
              size={18} 
              strokeWidth={pathname === "/profile" ? 2 : 1.2} 
              className={cn("transition-colors duration-300", pathname === "/profile" ? "text-primary" : "text-white/30")} 
            />
            <span className={cn("text-[6px] font-mono uppercase tracking-[0.2em]", pathname === "/profile" ? "text-primary" : "text-white/20")}>
              Identity
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
