"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MapPin, AlertCircle, Sparkles } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, totalPrice, convertPrice, clearCart, toggleCart } = useCommerce();
  const { user } = useAuth();

  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (p: number) => {
    const res = convertPrice(p);
    return res.symbol + res.amount;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Hyderabad only validation
    const targetCity = city.trim().toLowerCase();
    if (targetCity !== "hyderabad") {
      setError("Delivery is currently exclusive to Hyderabad, TS. We will expand global teleport shipping soon.");
      return;
    }

    setLoading(true);

    try {
      const orderIdNumber = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderId = `LX-ORD${orderIdNumber}`;
      
      const fullDeliveryAddress = `${address}, Landmark: ${landmark || "None"}, City: ${city}, State: ${state}, ZIP: ${pincode}, Instructions: ${instructions || "None"}`;

      // 1. Create order record in Supabase orders table if logged in
      if (user) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
        const { error: dbError } = await supabase
          .from("orders")
          .insert([
            {
              customer_id: isUuid ? user.id : null,
              total_price: totalPrice,
              status: "processing",
              delivery_address: fullDeliveryAddress,
            }
          ]);
        
        if (dbError) {
          console.warn("Could not save order to database, dispatching via WhatsApp only:", dbError.message);
        }
      }

      // 2. Format the dispatch payload for WhatsApp message
      const itemsText = cart
        .map((i) => `- ${i.name} (Size: ${i.size || "Standard"}) x${i.quantity} | ${formatPrice(i.price * i.quantity)}`)
        .join("\n");

      const messageText = `🌟 LUXE OS DISPATCH UPLINK 🌟
------------------------------
Order ID: ${generatedOrderId}
Date: ${new Date().toLocaleString()}

👤 CUSTOMER DIRECTIVE:
Name: ${name}
Phone: ${phone}
Email: ${email}

📍 COORDINATES (ADDRESS):
Address: ${address}
Landmark: ${landmark || "N/A"}
City: ${city}
State: ${state}
Pincode/ZIP: ${pincode}
Instructions: ${instructions || "None"}

🛍️ ARTIFACT DETAILS:
${itemsText}

------------------------------
GRAND TOTAL: ${formatPrice(totalPrice)}
------------------------------
*This dispatch has been synced with LUXE OS. The owner (+91 79953 38472) will coordinate immediate shipping.*`;

      // 3. Clear Cart & Close modals
      clearCart();
      onClose();
      toggleCart();

      // 4. Open WhatsApp redirect
      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/917995338472?text=${encodedMessage}`;
      
      toast.success("Order logged in dispatch terminal!");
      
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 800);

    } catch (err: any) {
      setError("An unexpected error occurred during dispatch initialization.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-xl bg-[#07070a]/95 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)] flex flex-col my-8 relative z-10"
        >
          {/* Subtle Glowing Header beam */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff]/50 to-transparent" />

          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#00f2ff] animate-pulse" size={20} />
              <div>
                <h3 className="text-md font-mono font-bold tracking-widest uppercase text-white">Dispatch Uplink</h3>
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Enter delivery coordinates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckout} className="p-8 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono flex items-start gap-3 leading-relaxed uppercase tracking-wider"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form Fields Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Shadab Qr"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g., +91 79953 38472"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Email directive</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@luxe.ai"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Full Delivery Address</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Apartment, Area..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Telangana"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">ZIP/Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="500001"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Landmark <span className="text-white/20">(Optional)</span></label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="E.g., Near Metro Station"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Delivery notes <span className="text-white/20">(Optional)</span></label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="E.g., Leave with security"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Total / Submit */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Dispatch Value</span>
                <span className="text-xl font-display text-[#00f2ff]">{formatPrice(totalPrice)}</span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-black hover:bg-gray-200 font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                {loading ? "Processing Dispatch..." : (
                  <>
                    UPLINK ORDER TO WHATSAPP
                    <Send size={14} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
