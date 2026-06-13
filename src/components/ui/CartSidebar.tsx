"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LuxeButton from "./LuxeButton";
import { track } from "@vercel/analytics";


export default function CartSidebar() {
  const { isCartOpen, toggleCart, cart: items, removeFromCart, updateQuantity, totalPrice } = useCommerce();
  const { convertPrice } = useCommerce();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      const savedCoupons = JSON.parse(localStorage.getItem("luxe-coupons") || "[]");
      setCoupons(savedCoupons);
    }
  }, [isCartOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatPrice = (p: number, skipDiscount = false) => { 
    const res = convertPrice(p, skipDiscount); 
    return res.symbol + res.amount; 
  };

  const handleWhatsAppCheckout = () => {
    try { track("whatsapp_initiated", { source: "cart_sidebar", itemCount: items.length }); } catch (e) {}
    const summary = items
      .map(
        (item) =>
          `- ${item.name} | Size: ${item.size || "N/A"} | Color: ${
            item.color || "N/A"
          } | Qty: ${item.quantity} | Price: ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");
    const total = formatPrice(totalPrice, true);
    const text = encodeURIComponent(
      `Hi, I'd like to order the following from LUXE:\n\n${summary}\n\n*Total:* ${total}\n\nPlease verify my order and provide payment details.`
    );
    window.open(`https://wa.me/917995338472?text=${text}`, "_blank");
  };

  const variants = {
    initial: isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 },
    animate: { x: 0, y: 0 },
    exit: isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 },
  };

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

            {/* Sidebar / Bottom Sheet */}
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 md:top-0 right-0 h-[75vh] md:h-full w-full max-w-full md:max-w-md bg-[#050508] border-t md:border-t-0 md:border-l border-white/10 shadow-2xl z-[210] flex flex-col rounded-t-[24px] md:rounded-t-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-primary" size={20} />
                  <h2 className="text-xl font-display font-light italic text-white">Your Arsenal</h2>
                </div>
                <button 
                  onClick={toggleCart}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-6 text-center py-12 px-6">
                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 animate-pulse bg-white/3">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/60">Your Arsenal is Empty</p>
                      <p className="text-[11px] font-sora text-white/30 max-w-[200px]">Equip your wardrobe with the latest neural drops.</p>
                    </div>
                    <button
                      onClick={() => {
                        toggleCart();
                        router.push("/shop");
                      }}
                      // LUXE-FIX [4]: Replace rounded-full on button with rounded-luxe
                      className="px-6 py-3 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold tracking-widest uppercase rounded-luxe transition-all cursor-pointer text-white"
                    >
                      Explore Collection
                    </button>
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
                            <h3 className="text-sm font-mono font-bold tracking-widest uppercase line-clamp-1 pr-2 text-white">{item.name}</h3>
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
                            className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-mono w-6 text-center text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer"
                          >
                            <Plus size={14} />
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
                  <div className="flex flex-col items-end mb-6">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Subtotal</span>
                      <span className="text-2xl font-display text-primary">{formatPrice(totalPrice, true)}</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-1">Inclusive of all taxes</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <LuxeButton 
                      onClick={() => {
                        toggleCart();
                        router.push("/checkout");
                      }} 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      INITIALIZE CHECKOUT <ArrowRight size={16} />
                    </LuxeButton>
                    <button
                      onClick={handleWhatsAppCheckout}
                      // LUXE-FIX [4]: Replace rounded-xl on button with rounded-luxe
                      className="w-full py-4 border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-mono font-bold tracking-widest uppercase rounded-luxe transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                      <MessageCircle size={14} /> ORDER VIA WHATSAPP
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

