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

  // Dummy function to simulate adding an item
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
      transition={{ delay: 2.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("navbar", isScrolled && "scrolled")}
    >
      {/* Brand logo left */}
      <Link href="/" className="nav-logo text-decoration-none">
        <span className="nav-brand">LUXE</span>
        <span className="nav-brand-dot">.</span>
      </Link>

      {/* Navigation links center */}
      <div className="nav-links">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(isActive && "active")}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Actions right */}
      <div className="nav-actions">
        <button aria-label="Search" className="clickable">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button aria-label="Cart" onClick={handleCartClick} className="clickable relative">
          <motion.div animate={cartControls} className="absolute inset-0 bg-[#E0BFB8] rounded-full mix-blend-overlay opacity-0 scale-0 origin-center" />
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
        <Link href="/profile" passHref legacyBehavior>
          <button aria-label="Profile" className="clickable">
            <User size={20} strokeWidth={1.5} />
          </button>
        </Link>
        <button aria-label="Menu" className="mobile-menu-btn clickable">
          <Menu size={20} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
