"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Compass, 
  Box, 
  Layers, 
  Activity, 
  Heart, 
  Fingerprint, 
  Settings2,
  Search,
  ShoppingBag
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  const mainLinks = [
    { name: "Discover", href: "/shop", icon: Compass },
    { name: "Artifacts", href: "/drops", icon: Box },
    { name: "Neural Fit", href: "/build-outfit", icon: Layers },
    { name: "Pulse", href: "/feed", icon: Activity },
  ];

  const secondaryLinks = [
    { name: "Archive", href: "/swipe", icon: Heart },
    { name: "Identity", href: "/profile", icon: Fingerprint },
    { name: "Settings", href: "/settings", icon: Settings2 },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 h-screen w-[80px] z-navbar hidden lg:flex flex-col items-center py-24 glass-standard !bg-[rgba(7,7,15,0.4)] !border-none !rounded-none border-r border-white/[0.03]"
      >
        <div className="flex flex-col gap-8">
          {mainLinks.map((link, i) => (
            <SidebarIcon key={link.name} link={link} index={i} active={pathname === link.href} />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-8">
          <div className="w-8 h-[1px] bg-white/10" />
          {secondaryLinks.map((link, i) => (
            <SidebarIcon key={link.name} link={link} index={i + 4} active={pathname === link.href} />
          ))}
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 3.4, duration: 0.5 }}
        className="lg:hidden fixed bottom-6 left-6 right-6 h-16 z-max glass-standard !bg-[rgba(15,15,28,0.88)] !rounded-full flex items-center justify-around px-4 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {[...mainLinks.slice(0, 3), { name: "Identity", href: "/profile", icon: Fingerprint }].map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.name} href={link.href} className="relative flex flex-col items-center gap-1 group">
              <link.icon 
                size={20} 
                strokeWidth={isActive ? 2 : 1.2}
                className={cn("transition-colors duration-300", isActive ? "text-accent-cyan" : "text-white/30 group-hover:text-white/60")} 
              />
              {isActive && (
                <motion.div 
                  layoutId="mobileNavGlow"
                  className="absolute -inset-3 bg-accent-cyan/10 blur-[15px] rounded-full -z-10"
                />
              )}
              <span className={cn("text-[7px] font-orbitron uppercase tracking-widest", isActive ? "text-accent-cyan" : "text-white/20")}>
                {link.name.slice(0, 4)}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
};

const SidebarIcon = ({ link, index, active }: { link: any; index: number; active: boolean }) => {
  return (
    <Link href={link.href} className="group relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.4 + (index * 0.08), duration: 0.6 }}
        className={cn(
          "p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
          active ? "text-accent-cyan" : "text-white/20 hover:text-white/80"
        )}
      >
        <link.icon size={20} strokeWidth={active ? 2 : 1.2} className="relative z-10" />
        
        {active && (
          <motion.div
            layoutId="sidebarActiveGlow"
            className="absolute inset-0 bg-accent-cyan/10 blur-md rounded-xl"
          />
        )}

        {/* Magnetic effect is handled by a global or shared component if available, 
            otherwise we can add local simplified version */}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute left-[100%] top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 glass-standard opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-max">
        <span className="text-[10px] font-rajdhani font-bold tracking-[0.2em] uppercase">{link.name}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
