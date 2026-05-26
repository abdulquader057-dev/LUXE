"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-white/[0.03] relative bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-3xl font-display font-black tracking-tighter text-white/80">
          LUXE<span className="text-primary">.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black tracking-[0.4em] text-white/15 uppercase">
          <Link href="/cognition" className="hover:text-white/30 transition-colors">Neural Policy</Link>
          <Link href="/cognition" className="hover:text-white/30 transition-colors">Global Logistics</Link>
          <Link href="/cognition" className="hover:text-white/30 transition-colors">Cognition Hub</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-green-500/60 rounded-full animate-pulse" />
          <span className="text-[9px] font-black tracking-widest text-white/12 uppercase">
            Node: DXB-01 Status: Online
          </span>
        </div>
      </div>
      <p className="text-center text-[9px] font-black tracking-[0.6em] text-white/[0.04] uppercase mt-10">
        © {new Date().getFullYear()} LUXE COGNITIVE FASHION CORP. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};

export default Footer;
