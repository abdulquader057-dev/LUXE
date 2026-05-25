"use client";

import React, { useState } from "react";
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
  Settings,
  MessageCircle
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
    { name: "WhatsApp (Primary)", href: "https://wa.me/917995338472", icon: MessageCircle, subtitle: "Support & Queries", isPremium: false },
    { name: "WhatsApp (Alt)", href: "https://wa.me/917337246297", icon: MessageCircle, subtitle: "Secondary Contact", isPremium: false },
    { name: "Settings", href: "/settings", icon: Settings, subtitle: "Preferences", isPremium: false },
  ];

  return (
    <>
      {/* Universal Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-[60] p-2 bg-[#0A0A0F]/80 backdrop-blur-md border border-white/10 rounded-md text-white/70 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300"
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

      <aside 
        onMouseLeave={() => setIsOpen(false)}
        className={cn(
          "w-[280px] h-screen flex-shrink-0 bg-[#0A0A0F] border-r border-white/5 flex flex-col overflow-hidden fixed z-[55] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[20px_0_40px_rgba(0,0,0,0.8)] pt-16",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      
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
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex flex-col gap-1 py-3 px-4 rounded-lg transition-all duration-300 relative group",
                  isActive ? "bg-white/5" : "hover:bg-white/5"
                )}
              >
                {/* Left Accent line - Chrome instead of Cyan */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  />
                )}
                
                <div className="flex items-center gap-3">
                  <link.icon size={18} className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                  )} />
                  <span className={cn(
                    "text-[13px] font-sora font-semibold tracking-wide transition-colors",
                    isActive ? "text-white" : "text-white/60 group-hover:text-white"
                  )}>
                    {link.name}
                  </span>
                </div>
                <span className="text-[10px] font-sora text-white/30 tracking-wider pl-[30px]">
                  {link.subtitle}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Category Links */}
        <div className="flex flex-col gap-1">
          {categoryLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
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
                  link.isPremium && "bg-gradient-to-r from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20",
                  isActive ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}>
                  <div className={cn(
                    "transition-colors", 
                    link.isPremium ? "text-[#D4AF37]" : "group-hover:text-white"
                  )}>
                    <link.icon size={20} strokeWidth={link.isPremium ? 2 : 1.5} />
                  </div>
                  <div>
                    <div className={cn("text-[13px] font-medium tracking-wide", link.isPremium && "text-[#D4AF37]")}>
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
    </>
  );
};

export default Sidebar;
