"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  Sparkles, 
  Grid, 
  ShoppingBag, 
  Zap, 
  TrendingUp, 
  Footprints,
  Watch,
  Briefcase,
  Award,
  Crown,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const mainLinks = [
    { name: "Home", href: "/", icon: Home, subtitle: "Dashboard" },
    { name: "AI Stylist", href: "/ai-style", icon: Sparkles, subtitle: "Your Personal Stylist" },
    { name: "Collections", href: "/shop?cat=collections", icon: Grid, subtitle: "Curated for You" },
    { name: "Shop", href: "/shop", icon: ShoppingBag, subtitle: "Explore Products" },
    { name: "New Arrivals", href: "/shop?sort=new", icon: Zap, subtitle: "Fresh & Trendy" },
    { name: "Trending", href: "/shop?sort=trending", icon: TrendingUp, subtitle: "Popular Now" },
  ];

  const categoryLinks = [
    { name: "Sneakers", href: "/shop?cat=sneakers", icon: Footprints, subtitle: "Premium Kicks" },
    { name: "Accessories", href: "/shop?cat=accessories", icon: Award, subtitle: "Elevate Your Fit" },
    { name: "Watches", href: "/shop?cat=watches", icon: Watch, subtitle: "Timeless Style" },
    { name: "Bags", href: "/shop?cat=bags", icon: Briefcase, subtitle: "Carry the Future" },
    { name: "Brands", href: "/shop?cat=brands", icon: Award, subtitle: "Top Rated Brands" },
  ];

  const bottomLinks = [
    { name: "LUXE Plus", href: "/profile", icon: Crown, subtitle: "Exclusive Access", isPremium: true },
    { name: "Settings", href: "/settings", icon: Settings, subtitle: "Preferences" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-[#050508]/80 backdrop-blur-md border border-white/10 rounded-md text-white/70 hover:text-white"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-[280px] h-screen flex-shrink-0 bg-[#0A0A0F] border-r border-white/5 flex flex-col overflow-hidden fixed md:relative z-[55] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <Link href="/">
          <img src="/logo.jpeg" alt="Brand Logo" className="h-10 w-auto rounded-md object-contain" />
        </Link>
      </div>

      {/* Scrollable Nav Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 pb-6 flex flex-col gap-8">
        
        {/* Main Links */}
        <div className="flex flex-col gap-1">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                  isActive ? "bg-white/5 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}>
                  {/* Neon active border */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00F0FF] to-[#B52BFF]" />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-50" />
                  )}
                  
                  <div className={cn(
                    "relative z-10 transition-colors", 
                    isActive ? "text-[#00F0FF]" : "group-hover:text-white"
                  )}>
                    <link.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-[13px] font-medium tracking-wide">{link.name}</div>
                    <div className={cn("text-[10px] mt-0.5", isActive ? "text-[#00F0FF]/60" : "text-white/30")}>
                      {link.subtitle}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Category Links */}
        <div className="flex flex-col gap-1">
          {categoryLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                  isActive ? "bg-white/5 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}>
                  <div className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-white")}>
                    <link.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium tracking-wide">{link.name}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{link.subtitle}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Links */}
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                  link.isPremium && "bg-gradient-to-r from-[#B52BFF]/10 to-transparent border border-[#B52BFF]/20",
                  isActive ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}>
                  <div className={cn(
                    "transition-colors", 
                    link.isPremium ? "text-[#B52BFF]" : "group-hover:text-white"
                  )}>
                    <link.icon size={20} strokeWidth={link.isPremium ? 2 : 1.5} />
                  </div>
                  <div>
                    <div className={cn("text-[13px] font-medium tracking-wide", link.isPremium && "text-[#B52BFF]")}>
                      {link.name}
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5">{link.subtitle}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
