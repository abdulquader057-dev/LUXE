"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid, ShoppingBag, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount, toggleCart } = useCommerce();
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    if (pathname) {
      setActiveTab(pathname);
    }
  }, [pathname]);

  const handleZyraClick = () => {
    window.dispatchEvent(new CustomEvent("open-zyra"));
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Catalog", href: "/shop", icon: Grid },
    {
      name: "Zyra AI",
      href: "#zyra",
      icon: Sparkles,
      onClick: handleZyraClick,
      isAi: true,
    },
    {
      name: "Cart",
      href: "#cart",
      icon: ShoppingBag,
      onClick: toggleCart,
      isCart: true,
    },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[190] bg-[#050508]/80 backdrop-blur-lg border-t border-white/5 px-4 pb-safe pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isSelected = activeTab === item.href;
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              <div
                className={cn(
                  "p-2 rounded-full transition-all duration-300 relative",
                  item.isAi
                    ? "bg-gradient-to-tr from-[#D4AF37]/20 to-primary/20 border border-primary/30 text-white animate-pulse"
                    : isSelected
                    ? "text-[#00f2ff]"
                    : "text-white/40 group-hover:text-white"
                )}
              >
                <Icon size={20} className={item.isAi ? "text-[#D4AF37]" : ""} />
                
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center text-[8px] font-bold text-[#050508] shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-mono tracking-wider mt-0.5",
                  isSelected ? "text-[#00f2ff] font-bold" : "text-white/30"
                )}
              >
                {item.name}
              </span>

              {isSelected && !item.isCart && !item.isAi && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex-1 flex items-center justify-center h-12 w-12 min-w-[44px] min-h-[44px] cursor-pointer group"
                aria-label={item.name}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex items-center justify-center h-12 w-12 min-w-[44px] min-h-[44px] group"
              aria-label={item.name}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
