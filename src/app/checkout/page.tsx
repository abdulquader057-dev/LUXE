"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useCheckoutStore, ShippingDetails } from "@/lib/store/checkoutStore";
import { ShiprocketPincodeResponse } from "@/lib/payments/types";
import { motion, AnimatePresence } from "framer-motion";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  keepUpdated: z.boolean().default(true),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  addressLine1: z.string().min(5, "Please enter your full address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits").regex(/^\d+$/, "Pincode must contain only numbers"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone must contain only numbers"),
});

export default function CheckoutPage() {
  const { items } = useCartStore();
  const { 
    shippingDetails, 
    setShippingDetails, 
    deliveryEstimate, 
    setDeliveryEstimate,
    isCheckingPincode,
    setIsCheckingPincode
  } = useCheckoutStore();

  const [mounted, setMounted] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false); // Mobile accordion

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: shippingDetails.email || "",
      keepUpdated: shippingDetails.keepUpdated ?? true,
      fullName: shippingDetails.fullName || "",
      addressLine1: shippingDetails.addressLine1 || "",
      addressLine2: shippingDetails.addressLine2 || "",
      city: shippingDetails.city || "",
      state: shippingDetails.state || "",
      pincode: shippingDetails.pincode || "",
      phone: shippingDetails.phone || "",
    },
  });

  const watchPincode = watch("pincode");

  useEffect(() => {
    const checkPincode = async () => {
      if (watchPincode && watchPincode.length === 6 && /^\d+$/.test(watchPincode)) {
        setIsCheckingPincode(true);
        setDeliveryEstimate(null);
        try {
          const res = await fetch("/api/mock/shiprocket/pincode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pincode: watchPincode }),
          });
          const data: ShiprocketPincodeResponse = await res.json();
          setDeliveryEstimate(data);
        } catch (error) {
          console.error("Failed to check pincode", error);
        } finally {
          setIsCheckingPincode(false);
        }
      } else {
        setDeliveryEstimate(null);
      }
    };

    const timeoutId = setTimeout(checkPincode, 800); // Debounce
    return () => clearTimeout(timeoutId);
  }, [watchPincode, setIsCheckingPincode, setDeliveryEstimate]);

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    setShippingDetails(data);
    // Day 2 Mock: Not proceeding to real payment yet
    console.log("Form data valid. Ready for Day 3 integration.");
  };

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = deliveryEstimate?.serviceable ? deliveryEstimate.cost || 0 : 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F0EDE8] font-sans selection:bg-[#C9A84C]/30 pt-20">
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row">
        
        {/* Left Column — Forms */}
        <div className="w-full lg:w-[55%] p-6 lg:p-12 lg:pr-16">
          <Link href="/" className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#D4B55B] transition-colors mb-10 text-sm tracking-wide">
            <ChevronLeft size={16} /> Return to Boutique
          </Link>

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section 1: Contact */}
            <section className="space-y-6">
              <h2 className="font-sans text-[11px] font-medium tracking-[0.15em] uppercase text-[#C9A84C]">Contact</h2>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                  />
                  {errors.email && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      {...register("keepUpdated")}
                      className="peer appearance-none w-4 h-4 border border-[#F5F0E8]/20 rounded-sm bg-transparent checked:bg-[#C9A84C] checked:border-[#C9A84C] transition-colors cursor-pointer"
                    />
                    <svg className="absolute w-2.5 h-2.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#0A0A0C]" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/60 group-hover:text-[#F0EDE8] transition-colors">Keep me updated on news and exclusive offers</span>
                </label>
              </div>
            </section>

            {/* Section 2: Shipping */}
            <section className="space-y-6">
              <h2 className="font-sans text-[11px] font-medium tracking-[0.15em] uppercase text-[#C9A84C]">Shipping</h2>
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    {...register("fullName")}
                    placeholder="Full Name"
                    className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                  />
                  {errors.fullName && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.fullName.message}</p>}
                </div>

                <div className="relative">
                  <input 
                    {...register("addressLine1")}
                    placeholder="Address Line 1"
                    className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                  />
                  {errors.addressLine1 && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.addressLine1.message}</p>}
                </div>

                <div className="relative">
                  <input 
                    {...register("addressLine2")}
                    placeholder="Address Line 2 (Optional)"
                    className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      {...register("city")}
                      placeholder="City"
                      className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                    />
                    {errors.city && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.city.message}</p>}
                  </div>
                  <div className="relative">
                    <select 
                      {...register("state")}
                      className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors text-[#F0EDE8] appearance-none"
                    >
                      <option value="" className="bg-[#0A0A0C]">State / Province</option>
                      <option value="MH" className="bg-[#0A0A0C]">Maharashtra</option>
                      <option value="KA" className="bg-[#0A0A0C]">Karnataka</option>
                      <option value="DL" className="bg-[#0A0A0C]">Delhi</option>
                      {/* Add more states */}
                    </select>
                    {errors.state && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      {...register("pincode")}
                      placeholder="Pincode"
                      maxLength={6}
                      className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                    />
                    {errors.pincode && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.pincode.message}</p>}
                  </div>
                  <div className="relative">
                    <input 
                      {...register("phone")}
                      placeholder="Phone Number"
                      className="w-full bg-transparent border-0 border-b border-[#F5F0E8]/15 px-0 py-3 text-[14px] font-light focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-white/30"
                    />
                    {errors.phone && <p className="text-[#EF4444]/80 text-xs mt-1 absolute -bottom-5">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Delivery */}
            <section className="space-y-6">
              <h2 className="font-sans text-[11px] font-medium tracking-[0.15em] uppercase text-[#C9A84C]">Delivery</h2>
              <div className="min-h-[60px] border border-[#F5F0E8]/10 rounded-sm p-4 bg-[#12121A]/50 flex items-center">
                {isCheckingPincode ? (
                  <div className="flex items-center gap-3 w-full justify-center text-white/50 text-[13px]">
                    <div className="w-4 h-4 rounded-full border border-[#C9A84C] border-t-transparent animate-spin" />
                    Checking serviceable locations...
                  </div>
                ) : deliveryEstimate ? (
                  deliveryEstimate.serviceable ? (
                    <div className="w-full flex justify-between items-center text-[14px]">
                      <div>
                        <span className="text-[#F0EDE8]">Standard Delivery</span>
                        <span className="text-white/50 block text-[12px] mt-0.5">{deliveryEstimate.estimatedDays} business days</span>
                      </div>
                      <span className="font-mono text-[#C9A84C]">{deliveryEstimate.cost === 0 ? "Free" : `₹${deliveryEstimate.cost}`}</span>
                    </div>
                  ) : (
                    <div className="w-full text-center text-[#EF4444]/90 text-[13px]">
                      {deliveryEstimate.message}
                    </div>
                  )
                ) : (
                  <div className="w-full text-center text-white/30 text-[13px]">
                    Enter your pincode to see delivery options
                  </div>
                )}
              </div>
            </section>

          </form>
        </div>

        {/* Right Column — Order Summary */}
        <div className="w-full lg:w-[45%] bg-[#12121A] lg:min-h-[calc(100vh-80px)] p-6 lg:p-12 lg:pl-16 border-b lg:border-b-0 lg:border-l border-[#C9A962]/10 relative">
          
          {/* Mobile Accordion Toggle */}
          <div className="lg:hidden flex justify-between items-center pb-6 border-b border-[#C9A962]/10 mb-6" onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}>
            <span className="font-sans text-[13px] text-[#C9A84C]">Order Summary ({items.length})</span>
            <span className="font-mono text-[16px] text-[#F0EDE8]">₹{total.toLocaleString()}</span>
          </div>

          <div className={cn("lg:block", isOrderSummaryOpen ? "block" : "hidden")}>
            <div className="flex flex-col gap-6 mb-8 lg:mb-12">
              {items.map(item => (
                <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center">
                  <div className="relative w-[48px] h-[64px] flex-shrink-0 bg-black/20">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#C9A84C]/20 backdrop-blur-md border border-[#C9A84C]/50 rounded-full flex items-center justify-center text-[#F0EDE8] text-[10px] font-mono">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-[14px] text-[#F0EDE8]">{item.name}</h3>
                    <p className="font-sans text-[12px] text-white/50">{item.variant}</p>
                  </div>
                  <span className="font-mono text-[14px] text-[#F0EDE8]">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-[#C9A962]/10 pt-6 pb-8">
              <div className="flex justify-between font-sans text-[13px] text-white/60">
                <span>Subtotal</span>
                <span className="font-mono text-[#F0EDE8]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-sans text-[13px] text-white/60">
                <span>Shipping</span>
                <span className="font-mono text-[#F0EDE8]">{shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[#C9A962]/10 pt-6 mb-10">
              <span className="font-sans text-[14px] text-[#F0EDE8]">Total</span>
              <span className="font-cormorant text-[24px] font-light text-[#C9A84C]">
                <span className="font-sans text-[12px] text-white/40 mr-2 uppercase">INR</span>
                ₹{total.toLocaleString()}
              </span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={true}
              className="w-full bg-[#16161A] border border-[#C9A84C]/30 text-white/40 font-sans text-[12px] font-medium tracking-[0.15em] uppercase py-4 flex items-center justify-center gap-2 cursor-not-allowed transition-all"
            >
              <Lock size={14} className="text-[#C9A84C]/50" />
              Awaiting Payment Gateway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
