"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Sparkles, ArrowRight, Zap, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { convertPrice } = useCommerce();

  // Load products from Supabase on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          const unique = parsed.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
          setAllProducts(unique);
          setResults(unique.slice(0, 4));
        } else {
          setAllProducts([]);
          setResults([]);
        }
      } catch (err) {
        console.error("Search modal failed to load products:", err);
        setAllProducts([]);
        setResults([]);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(allProducts.slice(0, 4));
    } else {
      const filtered = allProducts.filter((p) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, allProducts]);

  const getProductImage = (product: any) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed[0] : product.images;
      } catch {
        return product.images;
      }
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-20 overflow-hidden"
        >
          {/* Backdrop Blur Layer */}
          <motion.div 
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(40px)" }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl bg-[#050508]/95 border border-white/10 rounded-[24px] md:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
          >
            {/* Search Header */}
            <div className="p-6 md:p-10 border-b border-white/5 relative">
              <div className="relative flex items-center gap-3">
                <Search className="text-white/40 shrink-0" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="w-full bg-transparent text-xl md:text-4xl font-orbitron font-bold tracking-tight text-white placeholder:text-white/10 focus:outline-none uppercase"
                />
                <button 
                  onClick={onClose}
                  className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Scanline Effect */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
                 <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="w-40 h-full bg-white/50 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                 />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 grid md:grid-cols-[220px_1fr] gap-10 md:gap-16 custom-scrollbar">
               {/* Left Column: Trends */}
               <div className="space-y-8 md:space-y-12">
                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-white/40 uppercase mb-4 md:mb-6 flex items-center gap-2">
                       <TrendingUp size={12} />
                       TRENDING NOW
                    </h4>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {["Abaya", "Sneakers", "Techwear", "Modest Set", "Luxury Watch"].map((t) => (
                        <button 
                          key={t}
                          onClick={() => setQuery(t)}
                          className="text-left py-2.5 md:py-3 px-4 md:px-5 rounded-xl bg-white/3 border border-white/5 text-[12px] md:text-sm font-sora text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-between group"
                        >
                          {t}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/3 border border-white/5">
                     <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-white/50" />
                        <h5 className="text-[11px] font-bold tracking-widest uppercase text-white/60">AI STYLIST TIP</h5>
                     </div>
                     <p className="text-[10px] md:text-[11px] text-white/30 leading-relaxed italic font-sora">
                        "Your silhouette profile suggests a high match with dark, structured outerwear pieces."
                     </p>
                  </div>
               </div>

               {/* Right Column: Results */}
               <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                     <h4 className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-white/20 uppercase">
                        {query ? "SEARCH RESULTS" : "FEATURED"}
                     </h4>
                     {query && results.length > 0 && (
                       <div className="flex items-center gap-2 text-[9px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          <Sparkles size={10} className="animate-pulse" />
                          <span>We found {results.length} products matching your request. Tap to inspect.</span>
                       </div>
                     )}
                     <span className="text-[9px] md:text-[10px] font-bold text-white/20 uppercase">
                        {results.length} found
                     </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {results.map((product, i) => {
                       const stockVal = product.stock !== undefined ? product.stock : (product.stock_quantity !== undefined ? product.stock_quantity : 0);
                       const isAvailable = stockVal > 0;
                       return (
                         <motion.div
                           key={product.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                         >
                           <Link 
                             href={`/product/${product.id}`}
                             onClick={onClose}
                             className="group block bg-white/3 border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-all"
                           >
                              <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-4 bg-white/5">
                                 <Image 
                                   src={getProductImage(product)} 
                                   alt={product.name} 
                                   fill 
                                   className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                 />
                                 <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded-lg border border-white/10">
                                    <span className="text-[10px] font-orbitron font-bold text-white">{convertPrice(product.price).symbol}{convertPrice(product.price).amount}</span>
                                 </div>
                              </div>
                              <div className="px-1">
                                 <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-sora font-bold text-sm tracking-wide text-white group-hover:text-white/80 transition-colors line-clamp-1">{product.name}</h5>
                                    <Zap size={14} className="text-white/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                 </div>
                                 <div className="flex justify-between items-center mt-1">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-sora">{product.category}</p>
                                    <span className={cn(
                                      "text-[9px] font-mono uppercase tracking-wider font-bold",
                                      isAvailable ? "text-green-400" : "text-red-500"
                                    )}>
                                      {isAvailable ? "✅ In Stock" : "❌ Out of Stock"}
                                    </span>
                                 </div>
                              </div>
                           </Link>
                         </motion.div>
                       );
                     })}
                  </div>

                  {results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                       <div className="w-20 h-20 rounded-full bg-white/3 border border-white/5 flex items-center justify-center text-white/10">
                          <Search size={40} />
                       </div>
                       <h5 className="text-xl font-orbitron font-bold text-white/50 tracking-widest">NO MATCHING DROPS</h5>
                       <p className="text-white/40 text-xs font-mono max-w-md bg-red-500/5 border border-red-500/10 rounded-2xl p-4 leading-relaxed uppercase tracking-wider">
                          Notice: No matching drops found. Try asking our AI Chatbot in the bottom-right corner to check custom orders!
                       </p>
                       <button
                         onClick={() => {
                           onClose();
                           try {
                             const chatBtn = document.getElementById("zyrachat-trigger") || document.querySelector(".zyrachat-btn");
                             if (chatBtn) {
                               (chatBtn as HTMLElement).click();
                             } else {
                               localStorage.setItem("zyrachat-open", "true");
                               window.dispatchEvent(new Event("storage"));
                             }
                           } catch (e) {
                             console.error("Chat trigger error:", e);
                           }
                         }}
                         className="px-6 py-3 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black text-[10px] font-mono font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                       >
                         Launch AI Chatbot
                       </button>
                    </div>
                  )}
               </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-8">
               <div className="flex items-center gap-3 text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase">
                  <Activity size={12} className="text-white/30" />
                  {allProducts.length} items in database
               </div>
               <button 
                 onClick={() => { setQuery(""); setResults(allProducts.slice(0, 4)); }}
                 className="text-[9px] font-bold tracking-[0.5em] text-white/20 hover:text-white transition-colors uppercase"
               >
                 CLEAR SEARCH
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
