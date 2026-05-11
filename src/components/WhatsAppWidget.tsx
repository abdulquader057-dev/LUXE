"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppWidget = () => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/91XXXXXXXXXX?text=Hi Zyvora! I'm interested in your futuristic fashion collections.`, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsApp}
      className="fixed bottom-8 left-8 z-[100] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)]"
    >
      <MessageCircle size={28} fill="white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold">1</span>
    </motion.button>
  );
};

export default WhatsAppWidget;
