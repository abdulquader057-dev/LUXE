"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import SciFiWrapper from "@/components/home/SciFiWrapper";
import ProductCard from "@/components/shop/ProductCard";
import Image from "next/image";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import CinematicShowcase from "@/components/home/CinematicShowcase";

const filters = [
  "ALL DESIGNS",
  "WHITE SHIRTS",
  "PASTEL SHIRTS",
  "DARK SHIRTS"
];

import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";

export default function Home() {
  const { cart, convertPrice, toggleCart, removeFromCart, cartCount, totalPrice } = useCommerce();
  const [activeFilter, setActiveFilter] = useState("ALL DESIGNS");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    let catId = "all";
    if (filter === "WHITE SHIRTS") catId = "white";
    else if (filter === "PASTEL SHIRTS") catId = "pastel";
    else if (filter === "DARK SHIRTS") catId = "dark";
    
    if (catId !== "all") {
      router.push(`/shop?cat=${encodeURIComponent(catId)}`);
    } else {
      router.push(`/shop`);
    }
  };

  return (
    <div className="w-full">
      {/* Immersive Sci-Fi Interactive Portal (First Viewport) */}
      <SciFiWrapper />

      {/* 1. ABOVE THE FOLD (100vh) - Interactive 3D Luxury Experience */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-24">
        {/* 2. BRAND STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-stretch">
          {/* Left column: Flyer image */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 group min-h-[350px] lg:min-h-[420px] flex items-center justify-center bg-black/40">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-10" />
            <Image 
              src="/brand/linen_flyer.jpg" 
              alt="Luxe Collection Flyer" 
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <span className="text-[9px] font-sora tracking-[0.3em] text-[#D4AF37] uppercase block mb-2 font-bold">Exclusive Launch</span>
              <h3 className="text-3xl font-cormorant font-light text-white italic tracking-wide leading-tight">Summer Soft Collection</h3>
            </div>
          </div>

          {/* Right column: Trust details */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 md:p-10 rounded-2xl border border-white/10 bg-[#0A0A0C]/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-px w-8 bg-[#D4AF37]/50" />
                <span className="text-[10px] font-sora text-[#D4AF37] uppercase tracking-[0.4em] font-bold">Brand Hub</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-cormorant font-light tracking-wide text-white mb-6 leading-snug">
                Everyday comfort crafted with <span className="italic text-white/60">premium luxury-inspired</span> soft fabrics.
              </h2>
              
              <p className="text-xs font-sora text-white/50 tracking-wider leading-relaxed mb-8 max-w-xl">
                We have been providing these premium collections directly to our WhatsApp community, and now we are elevating your shopping experience. 100% trusted, minimal pricing, with zero hidden or extra charges.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] block mb-2 font-bold">{"// Collection DNA & Trust Indicators"}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">✨</span>
                    <span className="font-sora">Premium luxury soft fabric collection</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">📍</span>
                    <span className="font-sora">Hafiz Baba Nagar, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">🚚</span>
                    <span className="font-sora">Cash on Delivery available</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">✨</span>
                    <span className="font-sora">100% trusted & reliable</span>
                  </div>
                </div>
                <div className="space-y-3 sm:border-l sm:border-white/5 sm:pl-6">
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">▫️</span>
                    <span className="font-sora">Everyday Essential</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">▫️</span>
                    <span className="font-sora">Premium</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider text-white/80">
                    <span className="text-[#D4AF37] select-none text-sm">▫️</span>
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

        {/* 4. SEARCH AND FILTERS */}
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-10 w-full mt-16 pt-16 border-t border-white/10">
          <div className="relative w-full lg:w-1/3 flex-shrink-0">
            <form onSubmit={handleSearch} className="w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-white/50" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-[#0A0A0C] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white text-[11px] font-sora tracking-wide focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              />
            </form>
            {/* LUXE-FIX [4]: Replace rounded-full on button with rounded-luxe */}
            <button className="absolute inset-y-1 right-1 px-4 bg-white/5 hover:bg-white/10 rounded-luxe flex items-center justify-center border border-white/5 transition-colors">
              <SlidersHorizontal size={14} className="text-white/70" />
              <span className="ml-2 text-[9px] font-sora tracking-widest text-white/70">FILTERS</span>
            </button>
          </div>

          <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
            <div className="flex items-center gap-3 w-max">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-sora font-bold tracking-widest uppercase transition-all duration-300 border ${
                    activeFilter === filter 
                      ? "bg-white/10 border-white/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                      : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
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

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles size={20} className="text-white/70" />
            <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">EXPLORE COLLECTION</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
          </div>

          <div className="product-grid">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (0.1 * i), duration: 1.2, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>

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
