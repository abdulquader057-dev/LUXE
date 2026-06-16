"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  MessageCircle,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Menu, X, Globe, LogIn, LogOut } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const { user, signOut, isAdmin } = useAuth();

  const mainLinks = [
    { name: t("nav.home"), href: "/", icon: Home, subtitle: "Dashboard" },
    { name: t("nav.aiStylist"), href: "/ai-style", icon: Sparkles, subtitle: "Your Personal Stylist" },
    { name: t("nav.collections"), href: "/shop?cat=collections", icon: Grid, subtitle: "Curated for You" },
    { name: t("nav.shop"), href: "/shop", icon: ShoppingBag, subtitle: "Explore Products" },
    ...(isAdmin ? [{ name: "Cognition Hub", href: "/cognition", icon: Brain, subtitle: "Neural Policy & Logistics" }] : []),
    { name: t("nav.newArrivals"), href: "/shop?sort=new", icon: Zap, subtitle: "Fresh & Trendy" },
  ];

  const categoryLinks = [
    { name: t("cat.sneakers"), href: "/shop?cat=sneakers", icon: Footprints, subtitle: "Premium Kicks" },
    { name: t("cat.watches"), href: "/shop?cat=watches", icon: Watch, subtitle: "Timeless Style" },
  ];

  const bottomLinks = [
    { name: t("bot.luxePlus"), href: "/profile", icon: Crown, subtitle: "Exclusive Access", isPremium: true },
    ...(isAdmin ? [{ name: "Admin OS", href: "/admin", icon: Settings, subtitle: "Control Center", isPremium: true }] : []),
    { name: t("bot.whatsappPrimary"), href: "https://wa.me/917995338472", icon: MessageCircle, subtitle: "Support & Queries", isPremium: false },
    { name: t("bot.whatsappAlt"), href: "https://wa.me/917337246297", icon: MessageCircle, subtitle: "Secondary Contact", isPremium: false },
    { name: t("bot.settings"), href: "/settings", icon: Settings, subtitle: "Preferences", isPremium: false },
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
      <div className="p-6 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.jpeg" alt="Brand Logo" width={120} height={40} className="h-10 w-auto rounded-md object-contain" />
        </Link>
        <div className="relative group/lang">
          <button className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <Globe size={18} />
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 bg-[#050508] border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-[70] shadow-xl">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={cn(
                  "w-full text-left px-4 py-3 text-xs font-sora hover:bg-white/10 transition-colors",
                  language === lang.code ? "text-white bg-white/5" : "text-white/50"
                )}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
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
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                  link.isPremium && "bg-gradient-to-r from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20",
                  isActive ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}>
                  <div className={cn(
                    "transition-colors", 
                    link.isPremium ? "text-[#00f2ff]" : "group-hover:text-white"
                  )}>
                    <link.icon size={20} strokeWidth={link.isPremium ? 2 : 1.5} />
                  </div>
                  <div>
                    <div className={cn("text-[13px] font-medium tracking-wide", link.isPremium && "text-[#00f2ff]")}>
                      {link.name}
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5">{link.subtitle}</div>
                  </div>
                </div>
              </Link>
            );
          })}

          {user ? (
            <button onClick={() => { signOut(); setIsOpen(false); }} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden text-red-400 hover:bg-red-500/10">
              <div className="transition-colors group-hover:text-red-500">
                <LogOut size={20} strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-medium tracking-wide">Sign Out</div>
                <div className="text-[10px] text-red-400/50 mt-0.5">Disconnect Session</div>
              </div>
            </button>
          ) : (
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden text-white/60 hover:bg-white/5 hover:text-white">
                <div className="transition-colors group-hover:text-white">
                  <LogIn size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[13px] font-medium tracking-wide">Sign In</div>
                  <div className="text-[10px] text-white/30 mt-0.5">Neural Auth</div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
