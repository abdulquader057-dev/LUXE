"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import SciFiWrapper from "@/components/home/SciFiWrapper";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import CinematicShowcase from "@/components/home/CinematicShowcase";

import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";

export default function Home() {
  const { cart, convertPrice, toggleCart, removeFromCart, cartCount, totalPrice } = useCommerce();
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          const unique = parsed.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
          setProducts(unique);
        }
      } catch (err) {
        console.warn("Using offline catalog fallback:", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* Immersive Sci-Fi Interactive Portal (First Viewport) */}
      <SciFiWrapper />

      {/* 1. ABOVE THE FOLD (100vh) - Interactive 3D Luxury Experience */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-24">

        {/* 2. BRAND HUB */}
        <div className="mb-24 p-8 md:p-12 rounded-3xl border border-white/10 bg-[#0A0A0C]/65 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[250px] h-[250px] rounded-full bg-[#00f2ff]/5 blur-[80px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#D4AF37]/50" />
              <span className="text-[10px] font-sora text-[#D4AF37] uppercase tracking-[0.4em] font-bold">Brand Hub</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-cormorant font-light tracking-wide text-white mb-6 leading-snug">
              Everyday comfort crafted with <span className="italic text-white/60">premium luxury-inspired</span> soft fabrics.
            </h2>
            
            <p className="text-sm font-sora text-white/50 tracking-wider leading-relaxed mb-10 max-w-2xl">
              We have been providing these premium collections directly to our WhatsApp community, and now we are elevating your shopping experience. 100% trusted, minimal pricing, with zero hidden or extra charges.
            </p>

            <div className="space-y-6 pt-8 border-t border-white/5">
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] block font-bold">{"// Collection DNA & Trust Indicators"}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">✨</span>
                    <span className="font-sora">Premium luxury soft fabric collection</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">📍</span>
                    <span className="font-sora">Hafiz Baba Nagar, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">🚚</span>
                    <span className="font-sora">Cash on Delivery available</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">✨</span>
                    <span className="font-sora">100% trusted & reliable</span>
                  </div>
                </div>
                <div className="space-y-4 md:border-l md:border-white/5 md:pl-8">
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">▫️</span>
                    <span className="font-sora">Everyday Essential</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">▫️</span>
                    <span className="font-sora">Premium</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-base">▫️</span>
                    <span className="font-sora">Luxury Inspired</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FEATURED COLLECTION */}
        <div className="mb-24">
           <div className="flex items-center justify-center gap-3 mb-10">
            <Sparkles size={20} className="text-white/70" />
            <h2 className="text-3xl font-orbitron font-bold text-white tracking-widest text-center">FEATURED DROPS</h2>
            <Sparkles size={20} className="text-white/70" />
          </div>
          <CinematicShowcase products={products} />
        </div>



        {/* 5. SHOPPING EXPERIENCE (Curation Summary Banner) */}
        {cart.length > 0 && (
          // LUXE-FIX [5]: Replace inline cart grid with a premium summary banner calling the sidebar drawer
          <div className="mb-16 p-8 rounded-luxe border border-primary/20 bg-[#050508]/85 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-luxe border border-primary/20 flex items-center justify-center text-primary bg-primary/5">
                  <ShoppingBag size={20} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white tracking-wide uppercase">Your Active Curation</h2>
                  <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mt-1">
                    {cartCount} {cartCount === 1 ? "Item" : "Items"} in your arsenal // Total: <span className="text-[#00f2ff] font-bold">{convertPrice(totalPrice).symbol}{convertPrice(totalPrice).amount}</span>
                  </p>
                </div>
              </div>
              
              <button 
                onClick={toggleCart}
                className="px-8 py-3.5 bg-primary text-black text-[10px] font-mono font-bold tracking-widest uppercase rounded-luxe hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.6)]"
              >
                Review & Checkout
              </button>
            </div>
          </div>
        )}



        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LUXE",
              "url": "https://valceron.in",
              "logo": "https://valceron.in/logo.png",
              "sameAs": [
                "https://www.instagram.com/valceron.in",
                "https://wa.me/917995338472"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-7995338472",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["en", "hi"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hafiz Baba Nagar",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "postalCode": "500058",
                "addressCountry": "IN"
              }
            })
          }}
        />
      </div>
    </div>
  );
}
