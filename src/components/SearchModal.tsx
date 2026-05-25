"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, History, Sparkles, ArrowRight, Zap, ShoppingBag, ChevronRight, Activity } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import ProductCard from "@/components/shop/ProductCard";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(MOCK_PRODUCTS.slice(0, 4));
  const inputRef = useRef<HTMLInputElement>(null);
  const { convertPrice } = useCommerce();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(MOCK_PRODUCTS.slice(0, 4));
    } else {
      const filtered = MOCK_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);

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
            className="relative w-full max-w-5xl glass-panel !rounded-[24px] md:!rounded-[40px] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh] md:max-h-full"
          >
            {/* Search Header */}
            <div className="p-6 md:p-10 border-b border-white/5 relative">
              <div className="relative flex items-center gap-3">
                <Search className="text-primary animate-pulse shrink-0" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SCAN DATABASE..."
                  className="w-full bg-transparent text-xl md:text-5xl font-display font-black tracking-tighter text-white placeholder:text-white/10 focus:outline-none uppercase"
                />
                <button 
                  onClick={onClose}
                  className="w-10 h-10 md:w-16 md:h-16 shrink-0 rounded-xl md:rounded-2xl glass hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Scanline Effect */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20 overflow-hidden">
                 <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-40 h-full bg-primary shadow-[0_0_15px_#00f2ff]"
                 />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 grid md:grid-cols-[250px_1fr] gap-10 md:gap-16 no-scrollbar">
               {/* Left Column: Intelligence */}
               <div className="space-y-8 md:space-y-12">
                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-primary uppercase mb-4 md:mb-6 flex items-center gap-2">
                       <TrendingUp size={12} />
                       NEURAL TRENDS
                    </h4>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {["Cybercore Sneaker", "Liquid Metal", "Neural Link", "Techwear"].map((t) => (
                        <button 
                          key={t}
                          onClick={() => setQuery(t)}
                          className="text-left py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl glass border border-white/5 text-[12px] md:text-sm font-black tracking-tight text-white/40 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-between group"
                        >
                          {t}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel !rounded-[24px] md:!rounded-[32px] p-6 md:p-8 border-secondary/20 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4">
                        <Sparkles size={16} className="text-secondary animate-pulse" />
                     </div>
                     <h5 className="text-[12px] md:text-sm font-black mb-2 md:mb-3 uppercase">AI STYLIST TIP</h5>
                     <p className="text-[10px] md:text-[11px] text-white/40 leading-relaxed italic">
                        "Your current silhouette indicates a 92% match with the 'Obsidian Cyber' collection."
                     </p>
                  </div>
               </div>

               {/* Right Column: Visual Buffer */}
               <div>
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                     <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-white/20 uppercase">
                        {query ? "DATABASE MATCHES" : "RECOMMENDED NODES"}
                     </h4>
                     <span className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase">
                        {results.length} nodes
                     </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {results.map((product, i) => (
                       <motion.div
                         key={product.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                       >
                         <Link 
                           href={`/product/${product.id}`}
                           onClick={onClose}
                           className="group block glass-panel !rounded-[32px] p-4 border-white/5 hover:border-primary/20 transition-all"
                         >
                            <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative mb-6">
                               <Image 
                                 src={product.images[0]} 
                                 alt={product.name} 
                                 fill 
                                 className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                               />
                               <div className="absolute top-4 right-4 glass-panel !px-3 py-1.5 !rounded-xl border-white/20">
                                  <span className="text-[10px] font-black text-white">{convertPrice(product.price)}</span>
                               </div>
                            </div>
                            <div className="px-2">
                               <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-display font-black text-sm tracking-tight">{product.name}</h5>
                                  <Zap size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                               </div>
                               <p className="text-[10px] text-white/40 uppercase tracking-widest">{product.category}</p>
                            </div>
                         </Link>
                       </motion.div>
                     ))}
                  </div>

                  {results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <div className="w-20 h-20 rounded-full glass border border-white/5 flex items-center justify-center mb-6 text-white/10">
                          <Search size={40} />
                       </div>
                       <h5 className="text-xl font-black mb-2">NO NODES FOUND</h5>
                       <p className="text-white/40 text-sm">Your search did not return any matches in the current collection.</p>
                    </div>
                  )}
               </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-10">
               <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.3em] text-white/10 uppercase">
                  <Activity size={12} className="text-primary" />
                  Latency: 1.2ms
               </div>
               <div className="flex gap-10">
                  <button className="text-[9px] font-black tracking-[0.5em] text-white/20 hover:text-white transition-colors uppercase">CLEAR RECENT</button>
                  <button className="text-[9px] font-black tracking-[0.5em] text-white/20 hover:text-white transition-colors uppercase">ADVANCED FILTERS</button>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
