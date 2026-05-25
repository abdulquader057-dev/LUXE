"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Compass, 
  Box, 
  Layers, 
  Fingerprint, 
  Settings2 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Discover", href: "/shop", icon: Compass },
    { name: "Artifacts", href: "/drops", icon: Box },
    { name: "Neural Fit", href: "/build-outfit", icon: Layers },
    { name: "Identity", href: "/profile", icon: Fingerprint },
    { name: "Settings", href: "/settings", icon: Settings2 },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 h-screen w-[80px] z-[100] hidden lg:flex flex-col items-center py-24 glass-standard !bg-[rgba(7,7,15,0.4)] !border-none !rounded-none border-r border-white/[0.03]"
      >
        <div className="flex flex-col gap-8">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className="group relative">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                    isActive ? "text-accent-cyan" : "text-white/20 hover:text-white/80"
                  )}
                >
                  <link.icon size={20} strokeWidth={isActive ? 2 : 1.2} className="relative z-10" />
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveGlow"
                      className="absolute inset-0 bg-accent-cyan/10 blur-md rounded-xl"
                    />
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute left-[100%] top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 glass-standard opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[999]">
                  <span className="text-[10px] font-rajdhani font-bold tracking-[0.2em] uppercase">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <motion.nav
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay: 3.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="lg:hidden bottom-nav"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn("bottom-tab-icon", isActive && "active")}
            >
              <link.icon size={20} strokeWidth={isActive ? 2 : 1.2} className="relative z-10" />
              <span className="bottom-tab-label">{link.name}</span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
};

export default Sidebar;
