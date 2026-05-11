"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Twitter, MessageCircle, ArrowUpRight, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white mb-6 block">
              ZYVORA<span className="text-primary">.</span>
            </Link>
            <p className="text-white/50 max-w-sm mb-8 leading-relaxed">
              Transforming the future of fashion through AI and cyber-culture aesthetics. 
              Join the evolution of Gen-Z streetwear.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: MessageCircle, href: "#", color: "text-green-500" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className={`w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform ${social.color || 'text-white/60 hover:text-white'}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-8">Navigation</h4>
            <ul className="space-y-4">
              {["New Arrivals", "Shop All", "Modest Wear", "Accessories", "About Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-white/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-8">Newsletter</h4>
            <p className="text-xs text-white/40 mb-6">Receive early access to drops and AI style insights.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs focus:outline-none focus:border-primary/50"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black rounded-lg text-[10px] font-black tracking-widest hover:bg-primary transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:row items-center justify-between gap-6 border-t border-white/5 pt-10">
          <p className="text-[10px] font-bold tracking-widest text-white/20">
            © 2026 ZYVORA. ALL RIGHTS RESERVED. DESIGNED FOR THE FUTURE.
          </p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-bold tracking-widest text-white/20 hover:text-white transition-colors uppercase">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
