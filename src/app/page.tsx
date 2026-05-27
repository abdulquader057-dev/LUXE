"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, MapPin, Truck, CheckCircle2, ShieldCheck, Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import { useCommerce } from "@/lib/contexts/CommerceContext";

const filters = [
  "ALL DESIGNS",
  "WHITE SHIRTS",
  "PASTEL SHIRTS",
  "DARK SHIRTS"
];

import { supabase } from "@/lib/supabase";
import { MOCK_PRODUCTS } from "@/data/products";

export default function Home() {
  const { cart, convertPrice, toggleCart, removeFromCart } = useCommerce();
  const [activeFilter, setActiveFilter] = useState("ALL DESIGNS");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          // If the DB has items, ensure they match the local Linen Collection
          const hasLinen = data.some(p => p.name.toLowerCase().includes("linen"));
          if (hasLinen) {
            setProducts(data);
          }
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <Hero />

      {/* Brand Philosophy & Trust Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
        {/* Left column: Flyer image */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 group min-h-[350px] lg:min-h-[420px] flex items-center justify-center bg-black/40">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/brand/linen_flyer.jpg" 
            alt="Luxe Linen Collection Flyer" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <span className="text-[9px] font-sora tracking-[0.3em] text-[#D4AF37] uppercase block mb-2 font-bold">Exclusive Launch</span>
            <h3 className="text-3xl font-cormorant font-light text-white italic tracking-wide leading-tight">Summer Soft Linen Collection</h3>
          </div>
        </div>

        {/* Right column: Trust details (The 7 Brand Marketing/Trust Lines) */}
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
              We have been providing these premium linen collections directly to our WhatsApp community, and now we are elevating your shopping experience. 100% trusted, minimal pricing, with zero hidden or extra charges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
            {/* Location & Delivery */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[#D4AF37]">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-sora font-semibold tracking-wider text-white uppercase">Dispatch Hub</h4>
                  <p className="text-[10px] font-sora text-white/40 tracking-wider mt-1">📍 Hafiz Baba Nagar, Hyderabad</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[#D4AF37]">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-sora font-semibold tracking-wider text-white uppercase">COD Access</h4>
                  <p className="text-[10px] font-sora text-white/40 tracking-wider mt-1">🚚 Cash on Delivery available</p>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[#D4AF37]">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-sora font-semibold tracking-wider text-white uppercase">Trust Factor</h4>
                  <p className="text-[10px] font-sora text-white/40 tracking-wider mt-1">✨ 100% trusted & reliable app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[#D4AF37]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-sora font-semibold tracking-wider text-white uppercase">Soft Fabric Collection</h4>
                  <p className="text-[10px] font-sora text-white/40 tracking-wider mt-1">▫️ Premium & Luxury Inspired</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-10 w-full">
        {/* Search Bar */}
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <form onSubmit={handleSearch} className="w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/50" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Linen products..." 
              className="w-full bg-[#0A0A0C] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white text-[11px] font-sora tracking-wide focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            />
          </form>
          <button className="absolute inset-y-1 right-1 px-4 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/5 transition-colors">
            <SlidersHorizontal size={14} className="text-white/70" />
            <span className="ml-2 text-[9px] font-sora tracking-widest text-white/70">FILTERS</span>
          </button>
        </div>

        {/* Filter Pills */}
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

      {/* ACTIVE ARSENAL / CURRENT CURATION SECTION */}
      {cart.length > 0 && (
        <div className="mb-16 p-8 rounded-3xl border border-primary/20 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-primary animate-pulse" />
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide uppercase">Your Active Curation</h2>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mt-1">Ready for initialization // {cart.length} unique shapes</p>
              </div>
            </div>
            
            <button 
              onClick={toggleCart}
              className="text-[9px] font-mono tracking-widest text-primary border border-primary/30 hover:border-primary px-4 py-2 rounded-full uppercase transition-all bg-primary/5 hover:bg-primary/10 cursor-pointer"
            >
              Open Arsenal Sidebar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}-${item.color}`} 
                className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-[#0A0A0C]/50 hover:border-white/10 transition-all group"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest uppercase truncate text-white">{item.name}</h3>
                    <div className="flex gap-2 text-[9px] font-mono text-white/40 uppercase mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && (
                        <>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-mono text-primary font-bold">
                      {convertPrice(item.price).symbol}{convertPrice(item.price).amount} x {item.quantity}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-[9px] font-mono tracking-wider text-red-500/60 hover:text-red-400 uppercase transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDED PICKS Grid */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={20} className="text-white/70" />
          <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">RECOMMENDED FOR YOU</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
    </div>
  );
}


