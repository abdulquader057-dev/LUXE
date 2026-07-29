"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MapPin, AlertCircle, Sparkles, Compass, Loader2, CreditCard, QrCode, Clipboard, CheckCircle2 } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Image from "next/image";
import { telemetry } from "@/lib/telemetry";
import { escapeString } from "@/lib/security";
import { useXP } from "@/lib/hooks/useXP";

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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, totalPrice, convertPrice, clearCart, toggleCart } = useCommerce();
  const { user } = useAuth();
  const { awardXP } = useXP();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  const [isOfflineGeo, setIsOfflineGeo] = useState(false);

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

  // Coupon States
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

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
    const res = convertPrice(p, true);
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

  const discountRate = Number(getDiscountRate()) || 0;
  const discountAmount = Math.round(Number(totalPrice) * discountRate);
  const discountedSubtotal = Number(totalPrice) - discountAmount;

  // Coupon Discount
  const couponDiscountAmount = Math.round(discountedSubtotal * (Number(couponDiscountPercent) || 0));
  const postCouponSubtotal = discountedSubtotal - couponDiscountAmount;

  const getDeliveryFee = () => {
    if (postCouponSubtotal > 1999) return 0; // Free delivery for orders > 1999
    if (distance !== null) {
      const distNum = Number(distance) || 0;
      if (distNum <= 5) return 0;
      return Math.round(distNum * 7.5); // 7.5 per km overall
    }
    return 45; // Default standard delivery fee
  };

  const deliveryFee = getDeliveryFee();

  // Item-by-item GST Calculation
  let cgstAmount = 0;
  let sgstAmount = 0;
  
  cart.forEach((item) => {
    // Apply discount rate and coupon discount rate to item price
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    const discountedItemPrice = itemPrice * (1 - discountRate) * (1 - (Number(couponDiscountPercent) || 0));
    const rate = discountedItemPrice <= 1000 ? 0.05 : 0.12;
    const itemCgst = Math.round((discountedItemPrice * (rate / 2)) * itemQty);
    const itemSgst = Math.round((discountedItemPrice * (rate / 2)) * itemQty);
    cgstAmount += itemCgst;
    sgstAmount += itemSgst;
  });

  const gstAmount = cgstAmount + sgstAmount;
  const grandTotal = postCouponSubtotal + gstAmount + deliveryFee;

  // Auto-detect address using Geolocation and Nominatim
  const detectLocation = () => {
    setDetecting(true);
    setIsOfflineGeo(false);
    const toastId = toast.loading("Acquiring GPS coordinates...");

    const geoOverride = typeof window !== "undefined" ? localStorage.getItem("luxe-override-geolocation") : "default";

    if (geoOverride === "denied") {
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.error("GPS access denied. Please fill manually.");
        setDetecting(false);
      }, 800);
      return;
    }

    if (geoOverride === "granted") {
      setTimeout(() => {
        toast.dismiss(toastId);
        const lat = 17.3850;
        const lon = 78.4867;
        setCoords({ lat, lon });
        const dist = getDistanceKM(lat, lon, BABA_NAGAR.lat, BABA_NAGAR.lon);
        setDistance(dist);
        setAddress("Neural District, Sector 12");
        setCity("Hyderabad");
        setState("Telangana");
        setPincode("500024");
        setError(null);
        toast.success(`Location synced! Distance from Baba Nagar: ${dist.toFixed(1)} km (Simulated)`);
        setDetecting(false);
      }, 800);
      return;
    }

    if (geoOverride === "offline_fallback") {
      setTimeout(() => {
        toast.dismiss(toastId);
        const lat = 17.3272; // Baba Nagar
        const lon = 78.4908;
        setCoords({ lat, lon });
        const dist = getDistanceKM(lat, lon, BABA_NAGAR.lat, BABA_NAGAR.lon);
        setDistance(dist);
        setAddress(`GPS: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setCity("Hyderabad");
        setState("Telangana");
        setPincode("500024");
        setError(null);
        setIsOfflineGeo(true);
        toast.success(`Location synced! Distance from Baba Nagar: ${dist.toFixed(1)} km (Offline Fallback)`);
        setDetecting(false);
      }, 800);
      return;
    }

    if (!navigator.geolocation) {
      toast.dismiss(toastId);
      toast.error("Geolocation is not supported by your browser");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });

        const dist = getDistanceKM(latitude, longitude, BABA_NAGAR.lat, BABA_NAGAR.lon);
        setDistance(dist);

        try {
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
          console.error("Error geocoding:", err);
          toast.dismiss(toastId);
          if (dist <= 50) {
            setAddress(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setCity("Hyderabad");
            setState("Telangana");
            setPincode("500024");
            setError(null);
            setIsOfflineGeo(true);
            toast.success(`Location synced! Distance from Baba Nagar: ${dist.toFixed(1)} km (Offline Fallback)`);
          } else {
            setError(`Detected location is outside Hyderabad. Distance from Baba Nagar: ${dist.toFixed(1)} km. Delivery is currently exclusive to Hyderabad.`);
            toast.error("Location outside Hyderabad!");
          }
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

      // 2. Create order record in Supabase orders table via server checkout API
      const deliveryAddressPayload = JSON.stringify({
        name,
        phone,
        email,
        address,
        landmark,
        city,
        state,
        pincode,
        instructions,
        paymentMethod: paymentMethod === "cod" ? "COD" : "Razorpay Online",
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "L",
          color: item.color || "White"
        }))
      });      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          total_price: grandTotal,
          status: paymentMethod === "cod" ? "processing" : "Pending",
          delivery_address: deliveryAddressPayload,
          activePlan,
          couponDiscountPercent,
          distance
        }),
      });
      if (!checkoutResponse.ok) {
        const checkErr = await checkoutResponse.json();
        throw new Error(checkErr.error || "Failed to create order on server.");
      }

      const checkoutResData = await checkoutResponse.json();
      const orderData = checkoutResData.data;

      // 3. Prepaid payment path using Razorpay
      if (paymentMethod !== "cod") {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error("Razorpay script failed to load. Check network connection.");
        }

        const orderResponse = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            orderId: orderData.id,
          }),
        });

        if (!orderResponse.ok) {
          const errData = await orderResponse.json();
          throw new Error(errData.error || "Order initialization failed on Gateway.");
        }

        const razorpayOrder = await orderResponse.json();

        telemetry.track("purchase_initiated", {
          order_id: orderData.id,
          amount: grandTotal,
          payment_method: "Razorpay"
        });

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "LUXE",
          description: `Order LX-ORD${orderIdNumber}`,
          order_id: razorpayOrder.id,
          prefill: {
            name: name,
            email: email || "customer@luxe.ai",
            contact: phone,
          },
          theme: {
            color: "#C9A84C", // Gold theme accent
          },
          modal: {
            ondismiss: () => {
              telemetry.track("payment_failed", {
                order_id: orderData.id,
                amount: grandTotal,
                reason: "Payment window dismissed by customer",
                stage: "payment_popup",
                timestamp: new Date().toISOString()
              });
              setLoading(false);
              toast.error("Payment cancelled. You can retry from the checkout window.");
            }
          },
          handler: async function (response: any) {
            const verifyToastId = toast.loading("Verifying payment transaction secure signature...");
            try {
              const verifyResponse = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderData.id,
                }),
              });

              if (!verifyResponse.ok) {
                const verifyErr = await verifyResponse.json();
                throw new Error(verifyErr.error || "Payment signature verification failed.");
              }

              toast.dismiss(verifyToastId);
              toast.success("Payment verified! Custom receipt generated.");

              telemetry.track("purchase_success", {
                order_id: orderData.id,
                payment_id: response.razorpay_payment_id,
                amount: grandTotal
              });

              // Call notify-order API
              try {
                await fetch("/api/notify-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: orderData.id,
                    notifyToken: orderData.notifyToken,
                    name,
                    phone,
                    address,
                    city,
                    pincode,
                    paymentMethod: "Razorpay",
                    items: cart.map(item => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      size: item.size || "L",
                      color: item.color || "White"
                    })),
                    subtotal: totalPrice.toFixed(2),
                    deliveryFee,
                    total: grandTotal.toFixed(2),
                  }),
                });
              } catch (notifyErr) {
                console.warn("Notification error:", notifyErr);
              }

              // Prepare WhatsApp message
              const itemsText = cart
                .map((i) => `${i.name} (${i.color || "White"}, Size ${i.size || "L"})\n₹${i.price} × ${i.quantity} = ₹${i.price * i.quantity}`)
                .join("\n\n");

              const addressVerifiedFlag = coords 
                ? "✅ GPS Verified" 
                : "⚠️ Pending Verification (Manual Entry)";

              const messageText = `🌟 LUXE PREPAID ORDER DISPATCH 🌟
━━━━━━━━━━━━━━━━━━━━━━━
🆔 Order ID: LX-ORD${orderIdNumber}
💳 Payment ID: ${response.razorpay_payment_id}
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
Razorpay Paid - Status: Prepaid SUCCESS
${couponCode ? `Prepaid Reward Coupon: ${couponCode} (10% OFF Saved)` : ""}
${appliedCoupon ? `Applied Coupon: ${appliedCoupon} (${Math.round(couponDiscountPercent * 100)}% OFF)` : ""}

━━━━━━━━━━━━━━━━━━━━━━━
💰 Bill Breakdown
Subtotal: ${formatPrice(totalPrice)}
${discountAmount > 0 ? `Membership Discount (${Math.round(discountRate * 100)}%): -${formatPrice(discountAmount)}\n` : ""}${couponDiscountAmount > 0 ? `Coupon Discount (${Math.round(couponDiscountPercent * 100)}%): -${formatPrice(couponDiscountAmount)}\n` : ""}Post-Discount Subtotal: ${formatPrice(postCouponSubtotal)}
CGST (${postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(cgstAmount)}
SGST (${postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(sgstAmount)}
Delivery: ${deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
━━━━━━━━━━━━━━━━━━━━━━━
🧾 Total Payable: ${formatPrice(grandTotal)}
━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Please confirm availability before dispatch.
🚚 Dispatch after confirmation only.
*This dispatch has been synced with LUXE OS. The owner (+91 79953 38472) will coordinate immediate shipping.*`;

              clearCart();
              onClose();
              toggleCart();
              awardXP('purchase');

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
              toast.dismiss(verifyToastId);
              telemetry.track("payment_failed", {
                order_id: orderData.id,
                amount: grandTotal,
                reason: err.message || "Signature verification failed",
                stage: "verification_api",
                timestamp: new Date().toISOString()
              });
              setLoading(false);
              toast.error(`Verification Failed: ${err.message}`);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // 4. COD Handoff Path
      const itemsText = cart
        .map((i) => `${i.name} (${i.color || "White"}, Size ${i.size || "L"})\n₹${i.price} × ${i.quantity} = ₹${i.price * i.quantity}`)
        .join("\n\n");

      const addressVerifiedFlag = coords 
        ? "✅ GPS Verified" 
        : "⚠️ Pending Verification (Manual Entry)";

      const messageText = `🌟 LUXE ORDER DISPATCH 🌟
━━━━━━━━━━━━━━━━━━━━━━━
🆔 Order ID: LX-ORD${orderIdNumber}
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
Cash on Delivery (COD) - Status: Pay on Delivery
${appliedCoupon ? `Applied Coupon: ${appliedCoupon} (${Math.round(couponDiscountPercent * 100)}% OFF)` : ""}

━━━━━━━━━━━━━━━━━━━━━━━
💰 Bill Breakdown
Subtotal: ${formatPrice(totalPrice)}
${discountAmount > 0 ? `Membership Discount (${Math.round(discountRate * 100)}%): -${formatPrice(discountAmount)}\n` : ""}${couponDiscountAmount > 0 ? `Coupon Discount (${Math.round(couponDiscountPercent * 100)}%): -${formatPrice(couponDiscountAmount)}\n` : ""}Post-Discount Subtotal: ${formatPrice(postCouponSubtotal)}
CGST (${postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(cgstAmount)}
SGST (${postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"}): ${formatPrice(sgstAmount)}
Delivery: ${deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
━━━━━━━━━━━━━━━━━━━━━━━
🧾 Total Payable: ${formatPrice(grandTotal)}
━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Please confirm availability before dispatch.
🚚 Dispatch after confirmation only.
*This dispatch has been synced with LUXE OS. The owner (+91 79953 38472) will coordinate immediate shipping.*`;

      // Trigger notification API for COD
      try {
        await fetch("/api/notify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.id,
            notifyToken: orderData.notifyToken,
            name,
            phone,
            address,
            city,
            pincode,
            paymentMethod: "COD",
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size || "L",
              color: item.color || "White"
            })),
            subtotal: totalPrice.toFixed(2),
            deliveryFee,
            total: grandTotal.toFixed(2),
          }),
        });
      } catch (notifyErr) {
        console.warn("Notification API error:", notifyErr);
      }

      clearCart();
      onClose();
      toggleCart();
      awardXP('purchase');

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/917995338472?text=${encodedMessage}`;
      
      toast.success("Order logged in dispatch terminal!");
      
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during dispatch initialization.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const drawerVariants = {
    initial: isMobile ? { y: "100%", opacity: 1 } : { scale: 0.95, opacity: 0, y: 30 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: isMobile ? { y: "100%", opacity: 1 } : { scale: 0.95, opacity: 0, y: 30 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-hidden sm:overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={drawerVariants}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="relative w-full max-w-xl bg-[#07070a]/95 border border-white/10 backdrop-blur-2xl rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)] flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh] relative z-10"
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
          <form onSubmit={handleCheckout} className="flex-1 p-5 sm:p-8 space-y-5 overflow-y-auto custom-scrollbar text-left pb-24 sm:pb-8">
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
            <div className="flex items-center justify-between gap-4">
              {isOfflineGeo ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 text-[8px] font-mono tracking-widest uppercase animate-pulse">
                  <AlertCircle size={10} className="text-yellow-400" />
                  <span>offline geocoding fallback active</span>
                </div>
              ) : (
                <div />
              )}
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
              <div className="flex items-center gap-2 text-[#00f2ff]">
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
                      <Image src="/upi-qr.jpg" alt="UPI Payment QR Code" fill className="w-full h-full object-contain" />
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

            {/* Promo / Coupon Code Section */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <label className="text-[10px] font-mono text-primary uppercase tracking-widest block font-bold">Apply Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 transition-all uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const cleanCode = promoCode.trim().toUpperCase();
                    if (!cleanCode) return;
                    if (cleanCode === "COUPON60") {
                      setAppliedCoupon("COUPON60");
                      setCouponDiscountPercent(0.60);
                      setCouponError("");
                      toast.success("60% OFF Coupon Applied!");
                    } else if (cleanCode.startsWith("LUXE-PREPAID-") || cleanCode.includes("PREPAID")) {
                      setAppliedCoupon(cleanCode);
                      setCouponDiscountPercent(0.10);
                      setCouponError("");
                      toast.success("10% Prepaid Coupon Applied!");
                    } else {
                      setCouponError("Invalid or expired coupon code");
                      toast.error("Invalid coupon code");
                    }
                  }}
                  className="px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest ml-2">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex justify-between items-center bg-green-500/5 border border-green-500/20 px-4 py-2 rounded-xl text-green-400 text-[10px] font-mono uppercase tracking-widest">
                  <span>Coupon Applied: {appliedCoupon} ({couponDiscountPercent * 100}% OFF)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon("");
                      setPromoCode("");
                      setCouponDiscountPercent(0);
                    }}
                    className="text-white/40 hover:text-white font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Total / Submit */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="space-y-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Membership Discount ({Math.round(discountRate * 100)}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Discount ({Math.round(couponDiscountPercent * 100)}%)</span>
                    <span>-{formatPrice(couponDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Post-Discount Subtotal</span>
                  <span>{formatPrice(postCouponSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST ({postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"})</span>
                  <span className="text-white">{formatPrice(cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({postCouponSubtotal <= 1000 ? "2.5%" : "6.0%"})</span>
                  <span className="text-white">{formatPrice(sgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total GST ({postCouponSubtotal <= 1000 ? "5%" : "12%"})</span>
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
