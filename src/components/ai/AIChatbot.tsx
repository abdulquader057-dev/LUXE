"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Mic, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Greetings. I am ZYRA, your AI fashion consultant. How can I elevate your style today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Interesting choice. Based on current cyber-street trends, I recommend pairing that with our Neon-Pulse Sneakers and a utility vest for a complete futuristic silhouette." 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent p-[2px] shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all hover:scale-110 group"
      >
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-primary group-hover:text-white transition-colors">
          <BrainCircuit size={28} />
        </div>
        {/* Pulsing Orb Background */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[100] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] glass-morphism rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-primary/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center relative">
                  <Sparkles size={20} className="text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight text-sm">ZYRA AI</h3>
                  <p className="text-[10px] text-white/40 font-medium">FASHION INTELLIGENCE v4.2</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      m.role === "user" 
                        ? "bg-primary text-black font-medium" 
                        : "glass border border-white/10 text-white/90"
                    )}
                  >
                    {m.content}
                  </div>
                  <span className="text-[9px] text-white/30 mt-1 uppercase tracking-widest font-bold">
                    {m.role === "user" ? "Client" : "Zyra AI"}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {["Find my style", "Summer trends", "Modest wear", "Match sneakers"].map((s) => (
                <button 
                  key={s}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full glass border border-white/5 text-[10px] font-bold text-white/60 hover:text-primary hover:border-primary transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Zyra about style..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-24 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 text-white/40 hover:text-primary transition-colors">
                    <Mic size={18} />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="p-2 bg-primary rounded-xl text-black hover:scale-105 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
