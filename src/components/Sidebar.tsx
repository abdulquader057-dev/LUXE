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
            transition={{ delay: 0.4 + index * 0.08, duration: 0.6 }}
            className={cn(
              "relative flex items-center gap-4 px-5 py-4 transition-all duration-400 group cursor-pointer",
              isActive ? "bg-[rgba(0,229,204,0.06)]" : "hover:bg-white/[0.02]"
            )}
          >
            {/* Active Indicator Border */}
            {isActive && (
              <motion.div
                layoutId="activeSidebarBorder"
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            <link.icon
              size={20}
              strokeWidth={1.5}
              className={cn(
                "transition-all duration-300",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,229,204,0.5)]" : "text-[#44445A] group-hover:text-white group-hover:scale-110"
              )}
            />

            <motion.span
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
              }}
              className={cn(
                "text-[10px] font-nav font-bold tracking-[0.25em] uppercase whitespace-nowrap",
                isActive ? "text-white" : "text-[#44445A] group-hover:text-white/80"
              )}
            >
              {link.name}
            </motion.span>

            {/* Tooltip on collapse */}
            {!isHovered && (
              <div className="absolute left-[70px] bg-black/80 backdrop-blur-md px-3 py-1.5 rounded border border-primary/20 text-[9px] font-nav text-primary tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none z-50 uppercase">
                {link.name}
              </div>
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
          width: isHovered ? "200px" : "64px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 h-screen z-[90] hidden lg:flex flex-col border-r border-white/[0.04] bg-[rgba(10,10,20,0.5)] backdrop-blur-[20px] overflow-hidden group/sidebar"
      >
        <div className="flex-grow flex flex-col py-20">
          <nav className="flex flex-col gap-2">
            {mainLinks.map((link, i) => renderNavIcon(link, i))}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <div className="w-full h-px bg-white/[0.04] mx-auto my-4" />
            {secondaryLinks.map((link, i) => renderNavIcon(link, i + 4))}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation (Optional fallback) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[64px] bg-[rgba(10,10,20,0.8)] backdrop-blur-2xl border-t border-white/[0.05] flex items-center justify-around px-4">
        {mainLinks.slice(0, 4).map((link) => (
          <Link href={link.href} key={link.name}>
             <link.icon size={20} strokeWidth={1.5} className={pathname === link.href ? "text-primary" : "text-white/40"} />
          </Link>
        ))}
        <Link href="/profile">
           <Fingerprint size={20} strokeWidth={1.5} className={pathname === "/profile" ? "text-primary" : "text-white/40"} />
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
