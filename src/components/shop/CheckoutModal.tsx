"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MapPin, AlertCircle, Sparkles, Compass, Loader2, CreditCard, QrCode, Clipboard, CheckCircle2 } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Baba Nagar, Hyderabad Coordinates
const BABA_NAGAR = { lat: 17.3272, lon: 78.4908 };

function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, totalPrice, convertPrice, clearCart, toggleCart } = useCommerce();
  const { user } = useAuth();

  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // Location coordinates and distance state
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [detecting, setDetecting] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("upi");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiCopied, setUpiCopied] = useState(false);

  // Compliance Identifiers
  const [invoiceNo, setInvoiceNo] = useState("");
  const [gstin] = useState("36ABCDE1234F1Z5");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique invoice number on open
  useEffect(() => {
    if (isOpen) {
      const orderIdNumber = Math.floor(100000 + Math.random() * 900000);
      setInvoiceNo(`INV/2026/ORD-${orderIdNumber}`);
    }
  }, [isOpen]);

  // Automatically adjust payment method if COD becomes blocked
  const isCodBlocked = totalPrice > 1999;
  useEffect(() => {
    if (isCodBlocked && paymentMethod === "cod") {
      setPaymentMethod("upi");
    }
  }, [isCodBlocked, paymentMethod]);

  if (!isOpen) return null;

  const formatPrice = (p: number) => {
    const res = convertPrice(p);
    return res.symbol + res.amount;
  };

  // Get shipping cost
  const [activePlan, setActivePlan] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const plan = localStorage.getItem("luxe-active-plan");
      setActivePlan(plan);
    }
  }, [isOpen]);

  const getDiscountRate = () => {
    if (activePlan === "Luxe Insider") return 0.05;
    if (activePlan === "Luxe Elite") return 0.15;
    if (activePlan === "Neural Vanguard") return 0.25;
    return 0;
  };

  const discountRate = getDiscountRate();
  const discountAmount = Math.round(totalPrice * discountRate);
  const discountedSubtotal = totalPrice - discountAmount;

  const getDeliveryFee = () => {
    if (discountedSubtotal > 1999) return 0; // Free delivery for orders > 1999
    if (distance !== null) {
      if (distance <= 5) return 0;
      return Math.round(distance * 7.5); // 7.5 per km overall
    }
    return 45; // Default standard delivery fee
  };

  const deliveryFee = getDeliveryFee();

  // Item-by-item GST Calculation
  let cgstAmount = 0;
  let sgstAmount = 0;
  
  cart.forEach((item) => {
    // Apply discount rate to item price
    const discountedItemPrice = item.price * (1 - discountRate);
    const rate = discountedItemPrice <= 1000 ? 0.05 : 0.12;
    const itemCgst = Math.round((discountedItemPrice * (rate / 2)) * item.quantity);
    const itemSgst = Math.round((discountedItemPrice * (rate / 2)) * item.quantity);
    cgstAmount += itemCgst;
    sgstAmount += itemSgst;
  });

  const gstAmount = cgstAmount + sgstAmount;
  const grandTotal = discountedSubtotal + gstAmount + deliveryFee;

  // Auto-detect address using Geolocation and Nominatim
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    const toastId = toast.loading("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });

          const dist = getDistanceKM(latitude, longitude, BABA_NAGAR.lat, BABA_NAGAR.lon);
          setDistance(dist);

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (!res.ok) throw new Error("Reverse geocode failed");
          
          const data = await res.json();
          toast.dismiss(toastId);

          const addressInfo = data.address || {};
          const detectedCity = addressInfo.city || addressInfo.town || addressInfo.suburb || addressInfo.village || addressInfo.state_district || "";
          const detectedState = addressInfo.state || "Telangana";
          const detectedPincode = addressInfo.postcode || "";
          
          // Formulate street address details
          const road = addressInfo.road || "";
          const neighbourhood = addressInfo.neighbourhood || addressInfo.suburb || "";
          const county = addressInfo.county || "";
          const fullAddr = [neighbourhood, road, county].filter(Boolean).join(", ");

          if (detectedCity.toLowerCase() !== "hyderabad" && !data.display_name.toLowerCase().includes("hyderabad")) {
            setError(`Detected location is outside Hyderabad (${detectedCity || "Unknown"}). Delivery is currently exclusive to Hyderabad.`);
            toast.error("Delivery exclusive to Hyderabad!");
            return;
          }

          setAddress(fullAddr || "Detected GPS Coordinates");
          setCity("Hyderabad");
          setState(detectedState);
          if (detectedPincode) setPincode(detectedPincode);
          
          setError(null);
          toast.success(`Location synced! Distance from Baba Nagar: ${dist.toFixed(1)} km`);
        } catch (err) {
          toast.dismiss(toastId);
          toast.error("Could not fetch location details. Please enter manually.");
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        toast.dismiss(toastId);
        toast.error("GPS access denied. Please fill manually.");
        setDetecting(false);
      }
    );
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText("7995338472@ptaxis");
    setUpiCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Hyderabad verification check
    const targetCity = city.trim().toLowerCase();
    if (targetCity !== "hyderabad") {
      setError("Delivery is currently exclusive to Hyderabad, TS. We will expand global teleport shipping soon.");
      toast.error("We only deliver to Hyderabad!");
      return;
    }

    setLoading(true);

    try {
      const orderIdNumber = invoiceNo.replace("INV/2026/ORD-", "");
      const generatedOrderId = `LX-ORD${orderIdNumber}`;
      const invoiceNumber = invoiceNo;
      
      const fullDeliveryAddress = `${address}, Landmark: ${landmark || "None"}, City: ${city}, State: ${state}, ZIP: ${pincode}, Instructions: ${instructions || "None"}`;

      // 1. Generate prepaid coupon if prepaid order
      let couponCode = "";
      if (paymentMethod === "card" || paymentMethod === "upi") {
        const rand = Math.floor(1000 + Math.random() * 9000);
        couponCode = `LUXE-PREPAID-${rand}`;
        
        // Save coupon code in localStorage
        const savedCoupons = JSON.parse(localStorage.getItem("luxe-coupons") || "[]");
        savedCoupons.push({
          code: couponCode,
          discount: "10% OFF on next order",
          createdAt: new Date().toISOString()
        });
        localStorage.setItem("luxe-coupons", JSON.stringify(savedCoupons));
      }

      // 2. Create order record in Supabase orders table if logged in
      if (user) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
        const { error: dbError } = await supabase
          .from("orders")
          .insert([
            {
              customer_id: isUuid ? user.id : null,
              total_price: grandTotal,
              status: "processing",
              delivery_address: fullDeliveryAddress,
            }
          ]);
        
        if (dbError) {
          console.warn("Could not save order to database, dispatching via WhatsApp only:", dbError.message);
        }
      }

      // 3. Format the dispatch payload for WhatsApp message
      const itemsText = cart
        .map((i) => `${i.name} (${i.color || "White"}, Size ${i.size || "L"})\n₹${i.price} × ${i.quantity} = ₹${i.price * i.quantity}`)
        .join("\n\n");

      const paymentMethodNames = {
        card: "Visa / Credit Card",
        upi: "UPI Transfer (7995338472@ptaxis)",
        cod: "Cash on Delivery (COD)"
      };

      const addressVerifiedFlag = coords 
        ? "✅ GPS Verified" 
        : "⚠️ Pending Verification (Manual Entry)";

      const messageText = `🌟 LUXE ORDER DISPATCH 🌟
━━━━━━━━━━━━━━━━━━━━━━━
🆔 Order ID: ${generatedOrderId}
📅 Date: ${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString()}
🧾 Invoice No: ${invoiceNumber}
🏢 GSTIN: 36ABCDE1234F1Z5
🔍 Location Status: ${addressVerifiedFlag}

👤 Customer Details
Name: ${name}
Phone: ${phone}
Email: ${email}

📍 Delivery Address
${address}
${city}, ${state} - ${pincode}
📝 Note: ${instructions || "None"}
📍 Distance: ${distance ? `${distance.toFixed(1)} km from Base` : "Not calculated"}

🛍️ Order Summary
${itemsText}

💳 Payment Mode
${paymentMethodNames[paymentMethod]} - Status: ${paymentMethod === "cod" ? "Pay on Delivery" : "Prepaid (Pending Verification)"}
${couponCode ? `Prepaid Reward Coupon: ${couponCode} (10% OFF Saved)` : ""}

━━━━━━━━━━━━━━━━━━━━━━━
💰 Bill Breakdown
Subtotal: ${formatPrice(totalPrice)}
${discountAmount > 0 ? `Membership Discount (${Math.round(discountRate * 100)}%): -${formatPrice(discountAmount)}\nDiscounted Subtotal: ${formatPrice(discountedSubtotal)}` : ""}
CGST (${discountedSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(cgstAmount)}
SGST (${discountedSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(sgstAmount)}
Delivery: ${deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
━━━━━━━━━━━━━━━━━━━━━━━
🧾 Total Payable: ${formatPrice(grandTotal)}
━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Please confirm availability before dispatch.
🚚 Dispatch after confirmation only.
*This dispatch has been synced with LUXE OS. The owner (+91 79953 38472) will coordinate immediate shipping.*`;

      // 4. Clear Cart & Close modals
      clearCart();
      onClose();
      toggleCart();

      // 5. Open WhatsApp redirect
      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/917995338472?text=${encodedMessage}`;
      
      if (couponCode) {
        toast.success(`Order logged! Prepaid Coupon unlocked: ${couponCode}`);
      } else {
        toast.success("Order logged in dispatch terminal!");
      }
      
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);

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
          {/* Glowing Header beam */}
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
          <form onSubmit={handleCheckout} className="p-8 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar text-left">
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

            {/* Autofill location button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={detectLocation}
                disabled={detecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all text-[9px] font-mono tracking-widest uppercase cursor-pointer"
              >
                {detecting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Locating GPS...
                  </>
                ) : (
                  <>
                    <Compass size={12} className="animate-pulse" />
                    Auto-Fill Current Location
                  </>
                )}
              </button>
            </div>

            {/* Brand Handoff & Trust tags */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] font-mono uppercase tracking-widest text-white/50 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <MapPin size={12} className="animate-pulse" />
                <span>Hub: Hafiz Baba Nagar, Hyderabad</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/30">
                <span>✨ 100% Trusted & Reliable</span>
                <span>▫️ Premium Luxury Inspired Soft Fabrics</span>
              </div>
            </div>

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

            {/* Payment Section */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <label className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest block mb-2 font-bold">Select Payment Protocol</label>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <QrCode size={16} />
                  UPI / Scan QR
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <CreditCard size={16} />
                  Visa / Card
                </button>

                <button
                  type="button"
                  disabled={isCodBlocked}
                  onClick={() => setPaymentMethod("cod")}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                  }`}
                >
                  <MapPin size={16} />
                  COD
                </button>
              </div>

              {/* COD Warning */}
              {isCodBlocked && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-[9px] font-mono uppercase tracking-wider flex items-center gap-2 leading-relaxed">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  <span>COD capped at ₹1,999. Online payment required for this order value.</span>
                </div>
              )}

              {/* Prepaid Coupon Reward notification */}
              {(paymentMethod === "upi" || paymentMethod === "card") && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-[9px] font-mono uppercase tracking-wider flex items-center gap-2 leading-relaxed">
                  <Sparkles size={12} className="flex-shrink-0 animate-pulse" />
                  <span>PREPAID PERK: Placing this prepaid order unlocks a 10% OFF coupon for your next drop!</span>
                </div>
              )}

              {/* Payment Details Sub-interfaces */}
              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl min-h-[100px]">
                {paymentMethod === "upi" && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Scan QR or Pay to UPI ID</p>
                    
                    {/* UPI copy area */}
                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 w-full justify-between">
                      <span className="text-[10px] font-mono text-white tracking-widest">7995338472@ptaxis</span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="p-1 text-primary hover:text-white transition-colors cursor-pointer"
                      >
                        {upiCopied ? <CheckCircle2 size={14} className="text-green-400" /> : <Clipboard size={14} />}
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="w-48 h-48 relative border-2 border-white/10 rounded-xl overflow-hidden bg-white p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/upi-qr.jpg" alt="UPI Payment QR Code" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Pay overall total then submit checklist below</span>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Enter Card Credentials</p>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="CARDHOLDER NAME"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 transition-all uppercase tracking-wider"
                    />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      maxLength={19}
                      placeholder="CARD NUMBER"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 transition-all tracking-widest"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 transition-all tracking-wider text-center"
                      />
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        maxLength={3}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 transition-all tracking-wider text-center"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                    <CheckCircle2 className="text-primary animate-bounce" size={24} />
                    <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest font-bold">Cash on Delivery Verified</p>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest max-w-[320px]">Pay by Cash or UPI to the shipping courier upon physical handoff.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total / Submit */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="space-y-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-400">
                      <span>Membership Discount ({Math.round(discountRate * 100)}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Discounted Subtotal</span>
                      <span>{formatPrice(discountedSubtotal)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>CGST ({discountedSubtotal <= 1000 ? "2.5%" : "6.0%"})</span>
                  <span className="text-white">{formatPrice(cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({discountedSubtotal <= 1000 ? "2.5%" : "6.0%"})</span>
                  <span className="text-white">{formatPrice(sgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total GST ({discountedSubtotal <= 1000 ? "5%" : "12%"})</span>
                  <span className="text-white">{formatPrice(gstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-white">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-[8px] text-white/30">
                  <span>GSTIN Compliance</span>
                  <span>{gstin}</span>
                </div>
                <div className="flex justify-between text-[8px] text-white/30">
                  <span>Invoice Identifier</span>
                  <span>{invoiceNo}</span>
                </div>
                {distance !== null && (
                  <div className="text-[8px] text-white/20 text-right">
                    Calculated Distance: {distance.toFixed(2)} km from Baba Nagar Base
                  </div>
                )}
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span className="text-[#00f2ff]">Grand Total</span>
                  <span className="text-lg text-[#00f2ff]">{formatPrice(grandTotal)}</span>
                </div>
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
