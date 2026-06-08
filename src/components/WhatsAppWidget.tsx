"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

const WhatsAppWidget = () => {
  const handleWhatsApp = () => {
    try { track("whatsapp_initiated", { source: "floating_widget" }); } catch (e) {}
    // Primary number for product inquiries and general support
    window.open(
      `https://wa.me/917995338472?text=Hi%20Luxe!%20I'm%20interested%20in%20your%20fashion%20collections.`,
      "_blank"
    );
    // Secondary number for tech or payment related issues
    setTimeout(() => {
      window.open(
        `https://wa.me/917337246297?text=Hi%20Luxe!%20I'm%20facing%20a%20technical%20or%20payment%20issue.`,
        "_blank"
      );
    }, 500);
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3.8, duration: 0.5 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsApp}
      title="WhatsApp Support: Primary for Products & Support, Secondary for Tech & Payment Issues"
      className="whatsapp-btn fixed bottom-6 right-6 max-md:bottom-28 z-max w-[56px] h-[56px] rounded-full bg-[rgba(10,10,15,0.7)] backdrop-blur-xl border border-green-500/30 text-green-400 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all group hover:scale-110 hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]"
    >
      <MessageCircle size={26} className="relative z-10 transition-transform group-hover:scale-110" />
      <div className="absolute inset-0 rounded-full bg-accent-cyan opacity-[0.05]" />
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-accent-cyan/30"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

export default WhatsAppWidget;
