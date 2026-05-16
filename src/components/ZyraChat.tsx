"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ZyraChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-6 left-6 z-max">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 left-0 w-[320px] md:w-[380px] h-[500px] glass-elevated overflow-hidden flex flex-col border border-accent-cyan/20 shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                       <Sparkles size={20} className="text-accent-cyan" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF00] rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="text-[11px] font-orbitron text-white tracking-widest uppercase">ZYRA AI</h3>
                  <p className="text-[9px] font-rajdhani text-accent-cyan/70 tracking-wider">Neural Assistant Active</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-rajdhani text-sm">
              <div className="flex flex-col gap-1 max-w-[80%]">
                <span className="text-[8px] font-orbitron text-accent-cyan/50 tracking-widest uppercase ml-2">Zyra</span>
                <div className="p-3 glass-standard !rounded-2xl !rounded-tl-none text-white/90">
                  Welcome to the LUXE ecosystem. I am ZYRA, your neural fashion architect. How may I refine your aesthetic today?
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask Zyra..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-rajdhani placeholder:text-white/20 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent-cyan hover:scale-110 transition-transform">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet p-[1px] shadow-[0_8px_32px_rgba(0,229,204,0.3)] relative group"
      >
        <div className="w-full h-full rounded-full bg-[#07070F] flex items-center justify-center relative overflow-hidden">
          <MessageSquare size={24} className="text-white relative z-10" />
          
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-accent-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Pulse Ring */}
        <div className="absolute -inset-1 rounded-full border border-accent-cyan/30 animate-ping opacity-20" />
      </motion.button>
    </div>
  );
};

export default ZyraChat;
