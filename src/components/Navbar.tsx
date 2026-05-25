"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Collections", href: "/shop" },
    { name: "Drops", href: "/drops" },
    { name: "Feed", href: "/feed" },
    { name: "Build Fit", href: "/build-outfit" },
  ];

  return (
    <motion.nav
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ delay: 3.0, duration: 0.4, ease: "easeOut" }}
      className="navbar"
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
              className={cn(
                "transition-colors duration-200",
                isActive ? "text-accent-cyan" : "text-white/60 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Actions right */}
      <div className="nav-actions">
        <button aria-label="Search">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button aria-label="Cart">
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
        <Link href="/profile" passHref legacyBehavior>
          <button aria-label="Profile">
            <User size={20} strokeWidth={1.5} />
          </button>
        </Link>
        <button aria-label="Menu" className="mobile-menu-btn">
          <Menu size={20} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
