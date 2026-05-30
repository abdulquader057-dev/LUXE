"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LuxeButton from "./LuxeButton";


export default function CartSidebar() {
  const { isCartOpen, toggleCart, cart: items, removeFromCart, updateQuantity, totalPrice } = useCommerce();
  const { convertPrice } = useCommerce();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    if (isCartOpen) {
      const savedCoupons = JSON.parse(localStorage.getItem("luxe-coupons") || "[]");
      setCoupons(savedCoupons);
    }
  }, [isCartOpen]);

  const formatPrice = (p: number, skipDiscount = false) => { const res = convertPrice(p, skipDiscount); return res.symbol + res.amount; };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050508] border-l border-white/10 shadow-2xl z-[210] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-primary" size={20} />
                  <h2 className="text-xl font-display font-light italic">Your Arsenal</h2>
                </div>
                <button 
                  onClick={toggleCart}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">No items detected</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || 'default'}`} className="flex gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-mono font-bold tracking-widest uppercase line-clamp-1 pr-2">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex gap-2 text-[10px] font-mono text-white/40 uppercase">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && (
                              <>
                                <span>•</span>
                                <span>Color: {item.color}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm font-mono text-primary">{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Saved Coupons Section */}
                {coupons.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                    <h3 className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em] font-bold">Your Prepaid Rewards</h3>
                    <div className="space-y-2">
                      {coupons.map((coupon, idx) => (
                        <div key={idx} className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl flex items-center justify-between text-left">
                          <div>
                            <p className="text-xs font-mono font-bold text-green-400">{coupon.code}</p>
                            <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{coupon.discount}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast.success("Coupon code copied!");
                            }}
                            className="text-[8px] font-mono tracking-widest uppercase bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Subtotal</span>
                    <span className="text-2xl font-display text-primary">{formatPrice(totalPrice, true)}</span>
                  </div>
                  <LuxeButton 
                    onClick={() => {
                      toggleCart();
                      router.push("/checkout");
                    }} 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    INITIALIZE CHECKOUT <ArrowRight size={16} />
                  </LuxeButton>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

