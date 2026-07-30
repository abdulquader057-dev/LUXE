"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

export default function SlideOverCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-[#0A0A0C]/60 backdrop-blur-[4px]"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[210] w-full max-w-[420px] bg-[#16161A] border-l border-[#C9A962]/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-baseline gap-3">
                <h2 className="font-cormorant text-[20px] font-normal text-[#F0EDE8]">Your Ensemble</h2>
                <span className="font-sans text-[11px] font-medium tracking-[0.1em] text-white/50 uppercase">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-white/50 hover:text-[#F0EDE8] transition-colors p-1"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    {/* Hanger SVG Mock */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#C9A962]">
                      <path d="M12 4c-1.5 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                      <path d="M12 8l-9 8v4h18v-4l-9-8z" />
                    </svg>
                  </div>
                  <h3 className="font-cormorant text-xl text-[#F0EDE8]">Your Ensemble Awaits</h3>
                  <p className="font-sans text-sm text-white/50 font-light max-w-[250px]">
                    Curate your perfect look. Add pieces to your ensemble to see them here.
                  </p>
                  <button onClick={closeCart} className="mt-6 px-6 py-2 border border-[#C9A962]/30 text-[#C9A962] font-sans text-xs tracking-widest uppercase hover:bg-[#C9A962]/10 transition-colors">
                    Explore Collections
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                      <div className="relative w-[80px] h-[100px] flex-shrink-0 bg-black/20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-sans text-[14px] font-normal text-[#F0EDE8]">{item.name}</h3>
                            <span className="font-mono text-[14px] font-normal text-[#C9A84C]">
                              ₹{item.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="font-sans text-[12px] font-light text-white/60 mt-1">{item.variant}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-[#F5F0E8]/10 w-[80px] h-[32px]">
                            <button
                              onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                              className="flex-1 flex items-center justify-center text-white/50 hover:text-[#F0EDE8] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-sans text-[12px] font-light text-[#F0EDE8] w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                              className="flex-1 flex items-center justify-center text-white/50 hover:text-[#F0EDE8] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            className="font-sans text-[11px] text-white/40 hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white/40 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-6 bg-[#12121A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[12px] text-white/60">Subtotal</span>
                  <span className="font-mono text-[16px] text-[#F0EDE8]">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="font-sans text-[11px] text-white/40 mb-6">Shipping calculated at checkout</p>
                
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <button className="w-full bg-[#C9A84C] text-[#0A0A0C] font-sans text-[12px] font-medium tracking-[0.15em] uppercase py-4 hover:bg-[#D4B55B] transition-colors flex items-center justify-center gap-2">
                    Proceed to Checkout
                  </button>
                </Link>
                
                <button 
                  onClick={closeCart}
                  className="w-full mt-4 font-sans text-[12px] text-white/50 hover:text-[#F0EDE8] transition-colors tracking-wide"
                >
                  Continue Curating
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
