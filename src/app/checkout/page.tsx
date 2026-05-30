/* src/app/checkout/page.tsx */
"use client";

import { useState, useEffect, useRef } from "react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Phone, User, ShoppingBag, QrCode, Clipboard, CheckCircle2, Loader2 } from "lucide-react";
import { escapeString } from "@/lib/security";


export default function CheckoutPage() {
  const { cart, clearCart, totalPrice } = useCommerce();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [upi, setUpi] = useState("");
  const [promo, setPromo] = useState("");
  const [cod, setCod] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const autocompleteRef = useRef<any>(null);


  // Load Google Maps API Script
  useEffect(() => {
    if (typeof window === "undefined") return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key is missing. Autocomplete disabled.");
      return;
    }

    const initAutocomplete = () => {
      const input = document.getElementById("address-input") as HTMLInputElement;
      const win = window as any;
      if (!input || !win.google || !win.google.maps || !win.google.maps.places || !win.google.maps.places.Autocomplete) return;

      try {
        autocompleteRef.current = new win.google.maps.places.Autocomplete(input, {
          types: ["address"],
          componentRestrictions: { country: "IN" } // Prioritize India addresses
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (!place.address_components) return;

          let pin = "";
          let cty = "";

          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes("postal_code")) {
              pin = component.long_name;
            }
            if (types.includes("locality")) {
              cty = component.long_name;
            } else if (types.includes("administrative_area_level_2") && !cty) {
              cty = component.long_name;
            }
          }

          // Set address to formatted address or name
          setAddress(place.formatted_address || input.value);
          if (pin) setPincode(pin);
          if (cty) setCity(cty);

          toast.success(`Synced location: ${cty} (${pin})`);
        });
      } catch (err) {
        console.warn("Google Maps Autocomplete failed to initialize:", err);
      }
    };

    const win = window as any;
    if (win.google && win.google.maps && win.google.maps.places) {
      initAutocomplete();
    } else {
      let script = document.getElementById("google-maps-sdk") as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "google-maps-sdk";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setTimeout(initAutocomplete, 500);
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener("load", () => {
          setTimeout(initAutocomplete, 500);
        });
      }
    }
  }, []);

  const isUpiValid = cod ? true : /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9\.\-_]+$/.test(upi || "");
  const isPhoneValid = /^[6-9]\d{9}$/.test((phone || "").replace(/[^0-9]/g, "").slice(-10)); // Accept Indian numbers
  const canSubmit = name && address && city && pincode && isPhoneValid && (cod ? true : isUpiValid) && cart.length > 0;

  const subtotal = totalPrice;
  const tax = subtotal * 0.07; // 7% tax example
  
  // Delivery Fee Calculation based on Pincode and City
  // Free delivery for orders above 1999, else Hyderabad is 45, others 90
  const isHyderabad = (city || "").toLowerCase().includes("hyderabad");
  const deliveryFee = subtotal > 1999 ? 0 : (isHyderabad ? 45 : 90);
  const total = subtotal + tax + deliveryFee;

  const copyUpiId = () => {
    navigator.clipboard.writeText("7995338472@ptaxis");
    setUpiCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = (name || "").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedAddress = (address || "").trim();
    const trimmedCity = (city || "").trim();
    const trimmedPincode = (pincode || "").trim();
    const trimmedUpi = (upi || "").trim();
    const trimmedPromo = (promo || "").trim();

    if (!trimmedName || !trimmedPhone || !trimmedAddress || !trimmedCity || !trimmedPincode) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (
      trimmedName.length > 255 ||
      trimmedPhone.length > 255 ||
      trimmedAddress.length > 255 ||
      trimmedCity.length > 255 ||
      trimmedPincode.length > 255 ||
      trimmedUpi.length > 255 ||
      trimmedPromo.length > 255
    ) {
      setErrorMsg("Oversized inputs are rejected (max 255 characters).");
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    if (!cod && !isUpiValid) {
      setErrorMsg("Invalid UPI ID format (must be username@bank).");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Syncing order node to LUXE OS...");

    try {
      const isUuid = user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);

      const cartItems = cart.map((item: any) => ({
        id: item.id,
        name: escapeString(item.name || ""),
        price: item.price,
        quantity: item.quantity,
        size: escapeString(item.size || "L"),
        color: escapeString(item.color || "White")
      }));
      
      const escapedName = escapeString(trimmedName);
      const escapedPhone = escapeString(trimmedPhone);
      const escapedAddress = escapeString(trimmedAddress);
      const escapedCity = escapeString(trimmedCity);
      const escapedPincode = escapeString(trimmedPincode);
      const escapedUpi = trimmedUpi ? escapeString(trimmedUpi) : "";
      const escapedPromo = trimmedPromo ? escapeString(trimmedPromo) : "";

      // Structure all info inside delivery_address column as JSON
      const orderPayload = JSON.stringify({
        name: escapedName,
        phone: escapedPhone,
        address: escapedAddress,
        city: escapedCity,
        pincode: escapedPincode,
        paymentMethod: cod ? "COD" : "UPI",
        upi: escapedUpi,
        promo: escapedPromo,
        items: cartItems,
      });

      // Save order to Supabase orders table
      const { data: orderData, error: dbError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: isUuid ? user.id : null,
            total_price: total,
            status: "Pending",
            delivery_address: orderPayload,
          }
        ])
        .select("id")
        .single();

      if (dbError) throw dbError;

      // ── Trigger notification API (WhatsApp + Email + Supabase log) ──────────
      try {
        await fetch("/api/notify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData?.id,
            name: escapedName,
            phone: escapedPhone,
            address: escapedAddress,
            city: escapedCity,
            pincode: escapedPincode,
            paymentMethod: cod ? "COD" : "UPI",
            upi: escapedUpi,
            items: cartItems,
            subtotal: subtotal.toFixed(2),
            deliveryFee,
            total: total.toFixed(2),
          }),
        });
      } catch (notifyErr) {
        // Non-fatal: order was placed, notification is best-effort
        console.warn("Notification API error:", notifyErr);
      }

      // Prepare WhatsApp message text for the store using clean trimmed values
      const itemsText = cart
        .map((i: any) => `• ${i.name} (Size: ${i.size || "L"}, Color: ${i.color || "White"}) x ${Number(i.quantity) || 0} = ₹${((Number(i.price) || 0) * (Number(i.quantity) || 0)).toFixed(2)}`)
        .join("\n");

      const whatsappMsg = `🌟 LUXE NEW ORDER 🌟\n━━━━━━━━━━━━━━━━━━━━━━━\n👤 Name: ${trimmedName}\n📞 Phone: ${trimmedPhone}\n📍 Address: ${trimmedAddress}\n🏙️ City: ${trimmedCity} – ${trimmedPincode}\n💳 Payment: ${cod ? "COD" : `UPI (${trimmedUpi})`}\n\n🛍️ Items:\n${itemsText}\n\n💰 Subtotal: ₹${subtotal.toFixed(2)}\n🚚 Delivery: ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}\n🧾 *Total: ₹${total.toFixed(2)}*\n━━━━━━━━━━━━━━━━━━━━━━━`;

      // GTM Event Tracking for Purchase
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "purchase",
          ecommerce: {
            transaction_id: orderData?.id || `mock-${Date.now()}`,
            value: total,
            tax: tax,
            shipping: deliveryFee,
            currency: "INR",
            items: cart.map((item: any) => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity,
              item_size: item.size,
              item_color: item.color
            }))
          }
        });
      }

      toast.dismiss(toastId);
      toast.success("Order placed! Connecting you to WhatsApp...");

      clearCart();
      
      // Open WhatsApp for primary number; secondary opens after short delay
      setTimeout(() => {
        window.open(`https://wa.me/917995338472?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
        setTimeout(() => {
          window.open(`https://wa.me/917337246297?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
        }, 800);
        router.push("/");
      }, 1200);

    } catch (err: any) {
      toast.dismiss(toastId);
      setErrorMsg(`Order creation failed: ${err.message || "Please try again"}`);
      toast.error(`Order creation failed: ${err.message || "Please try again"}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen bg-[#020203] text-[#F9FAFB] p-6 md:p-12 relative overflow-hidden flex items-center justify-center pt-28">
      {/* Background radial glow */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-[#0A0A0C]/80 border border-white/5 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-display font-light italic tracking-tight text-white mb-2">Checkout Uplink</h1>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">LUXE secure transaction terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                  <User size={10} className="text-[#D4AF37]" /> Full Name
                </label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Shadab Qr" 
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                  <Phone size={10} className="text-[#D4AF37]" /> Contact Number
                </label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="E.g., 9999999999" 
                  className={`w-full p-3.5 rounded-2xl bg-black/60 border text-[#F9FAFB] text-xs font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-white/20 ${phone && !isPhoneValid ? 'border-[#D4AF37]/50 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30' : 'border-white/10 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/30'}`} 
                />
                {phone && !isPhoneValid && <p className="validation-error ml-2 mt-1">Invalid Indian phone format</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                <MapPin size={10} className="text-[#D4AF37]" /> Street Address (Google Autocomplete)
              </label>
              <textarea 
                id="address-input"
                required 
                rows={2} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Start typing your address for autocomplete suggestions..." 
                className="w-full p-4 rounded-2xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all resize-none placeholder:text-white/20 leading-relaxed" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">City</label>
                <input 
                  type="text" 
                  required 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="Auto-detected or custom" 
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">ZIP / Pincode</label>
                <input 
                  type="text" 
                  required 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  placeholder="E.g. 500024" 
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20" 
                />
              </div>
            </div>

            {/* Toggle COD / UPI */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <label className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">Payment Protocol</label>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCod(false)}
                  className={`py-3.5 rounded-2xl border flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer ${
                    !cod
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"
                  }`}
                >
                  <QrCode size={14} /> UPI Transfer
                </button>
                <button
                  type="button"
                  className={`py-3.5 rounded-2xl border flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer ${
                    cod
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"
                  }`}
                  onClick={() => setCod(true)}
                >
                  <MapPin size={14} /> Cash on Delivery (COD)
                </button>
              </div>

              {/* UPI Sub-Interface */}
              {!cod && (
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center gap-4 text-center">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Pay overall total then submit your UPI ID</span>
                  
                  <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-4 py-2 w-full justify-between">
                    <span className="text-[10px] font-mono text-white tracking-widest">7995338472@ptaxis</span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="p-1 text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                    >
                      {upiCopied ? <CheckCircle2 size={14} className="text-green-400" /> : <Clipboard size={14} />}
                    </button>
                  </div>

                  <div className="w-36 h-36 border border-white/15 rounded-xl overflow-hidden bg-white p-1">
                    <img src="/upi-qr.jpg" alt="UPI QR" className="w-full h-full object-contain" />
                  </div>

                  <div className="w-full space-y-1.5 text-left">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Your UPI ID (e.g. user@bank)</label>
                    <input 
                      type="text" 
                      value={upi} 
                      onChange={(e) => setUpi(e.target.value)} 
                      placeholder="example@bank" 
                      className={`w-full p-3 rounded-xl bg-black/60 border text-[#F9FAFB] text-xs font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-white/10 ${upi && !isUpiValid ? 'border-[#D4AF37]/50 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30' : 'border-white/10 focus:border-[#D4AF37]/50'}`} 
                    />
                    {upi && !isUpiValid && <p className="validation-error ml-2 mt-1">Invalid UPI handle format</p>}
                  </div>
                </div>
              )}

              {cod && (
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-center flex flex-col items-center justify-center gap-1">
                  <CheckCircle2 size={20} className="text-[#D4AF37] animate-pulse" />
                  <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest font-bold">COD Mode Selected</p>
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Pay overall total in cash at time of physical package handoff</span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Promo / Voucher Code</label>
              <input 
                type="text" 
                value={promo} 
                onChange={(e) => setPromo(e.target.value.toUpperCase())} 
                placeholder="ENTER PROMO CODE" 
                className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20 uppercase" 
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-xs font-mono text-center">
                {errorMsg}
              </div>
            )}
            <button 
              type="submit" 
              disabled={!canSubmit || isSubmitting} 
              className="w-full py-4.5 bg-[#D4AF37] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#D4AF37]/90 hover:scale-[1.01] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >

              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Uplinking Order...
                </>
              ) : (
                "Place Order & Dispatch"
              )}
            </button>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0C]/80 border border-white/5 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-xl font-display font-light italic tracking-tight text-white mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
              <ShoppingBag size={18} className="text-[#D4AF37]" /> Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest py-6">Your transaction manifest is empty.</p>
            ) : (
              <div className="space-y-6">
                {/* Items list */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item: any) => (
                    <div key={item.id + (item.size || "") + (item.color || "")} className="flex justify-between items-center gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-white uppercase tracking-tight line-clamp-1">{item.name}</p>
                          <span className="text-[9px] font-mono text-white/30 uppercase">{item.quantity} × Size {item.size || "L"} · {item.color || "White"}</span>
                        </div>
                      </div>
                      <span className="font-mono font-medium text-white/80">₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="pt-6 border-t border-white/5 space-y-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7% example)</span>
                    <span className="text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-white">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-baseline text-white">
                    <span className="text-xs font-bold">Total Payable</span>
                    <span className="text-xl font-orbitron font-bold text-[#D4AF37] tracking-wider">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Badge info */}
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-[24px] p-6 space-y-3">
            <h4 className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Dispatch Protocol
            </h4>
            <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">
              Upon uplinking, your dispatch coordinates are sent to our central coordination team. Real-time updates will synchronize via the WhatsApp interface.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
