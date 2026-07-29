"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Footer = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="py-16 border-t border-white/[0.03] relative bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-3xl font-display font-black tracking-tighter text-white/80 uppercase">
            LUXE THREADS<span className="text-[#D4AF37]">.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black tracking-[0.3em] text-white/15 uppercase">
            <Link href="/ar-scanner" className="hover:text-white/30 transition-colors">AI Suite</Link>
            <Link href="/privacy" className="hover:text-white/30 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/30 transition-colors">Terms & Conditions</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500/60 rounded-full animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-white/12 uppercase">
              Node: DXB-01 Status: Online
            </span>
          </div>
        </div>

        {/* Contact/Support Section */}
        <div className="border-t border-white/[0.03] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono tracking-widest text-white/40 uppercase">
          <div className="text-center md:text-left">
            <span className="text-white/20 mr-2 font-bold">Support Email:</span>
            <a href="mailto:abdulquader057@gmail.com" className="hover:text-white transition-colors underline">abdulquader057@gmail.com</a>
          </div>
          <div className="text-center">
            <span className="text-white/20 mr-2 font-bold">WhatsApp Support:</span>
            <a href="https://wa.me/917337246297" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">wa.me/917337246297</a>
          </div>
          <div className="text-center md:text-right">
            <span className="text-white/20 mr-2 font-bold">Feedback Node:</span>
            <a href="mailto:abdulquader057@gmail.com?subject=LUXE%20Threads%20Feedback" className="hover:text-white transition-colors underline">Report a Bug</a>
          </div>
        </div>
      </div>
      <p className="text-center text-[9px] font-black tracking-[0.6em] text-white/[0.04] uppercase mt-10">
        © {new Date().getFullYear()} LUXE THREADS COGNITIVE FASHION CORP. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};

export default Footer;
