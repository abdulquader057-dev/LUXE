"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Sparkles, Mic, BrainCircuit,
  Zap, Activity, Search, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";
import { parseDbProduct } from "@/data/products";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Product } from "@/types";
import { aiService, ChatMessage } from "@/lib/services/ai";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";
import { useCommerce } from "@/lib/contexts/CommerceContext";

interface Message {
  id?: string;
  role: string;
  content: string;
  type: string;
  product?: Product;
  items?: Product[];
  isStreaming?: boolean;
}

const QUICK_REPLIES = [
  ["Show me streetwear looks", "What's trending this season?", "Help me pick a size"],
  ["Best for weddings?", "Casual day outfits?", "Office-ready styles?"],
  ["Budget under ₹1000?", "Best selling items?", "New arrivals?"],
  ["Care instructions?", "Exchange policy?", "Delivery time?"],
];

const AIChatbot = () => {
  const { convertPrice } = useCommerce();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [styleDna, setStyleDna] = useState<any>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const assistantMsgCountRef = useRef(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase.from("products").select("*");
        if (data) {
          setDbProducts(data.map(parseDbProduct));
        }
      } catch (err) {
        console.error("AI chatbot failed to load products:", err);
      }
    }
    loadProducts();
  }, []);

  // Load Style DNA for the logged-in user
  useEffect(() => {
    const loadDna = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('style_dna')
          .select('xp, level, badges')
          .eq('id', user.id)
          .single();
        setStyleDna(data || user.user_metadata?.style_dna || null);
      }
    };
    loadDna();
  }, []);
  
  const renderMessageContent = (content: string) => {
    const recommendRegex = /\[RECOMMEND:\s*([a-zA-Z0-9-]+)\]/g;
    
    if (!content.match(recommendRegex)) {
      return <span>{content}</span>;
    }
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    recommendRegex.lastIndex = 0;
    while ((match = recommendRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const productId = match[1];
      
      if (matchIndex > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, matchIndex)}</span>);
      }
      
      const p = dbProducts.find((prod) => prod.id === productId);
      if (p) {
        parts.push(
          <div
            key={`recommend-${productId}-${matchIndex}`}
            onClick={() => window.location.href = `/product/${p.id}`}
            className="my-3 w-full rounded-2xl p-4 border border-primary/20 bg-white/[0.03] group cursor-pointer hover:bg-white/[0.05] transition-all hover:border-primary/40 pointer-events-auto block"
          >
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-white/[0.06] flex-shrink-0">
                <Image 
                  src={p.modelImages?.variants?.["White"]?.front || p.images[0] || "/brand/linen_model_front.png"} 
                  alt={p.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-black text-[11px] tracking-tight truncate text-white">{p.name}</h4>
                <p className="text-[9px] text-white/40 mt-0.5 line-clamp-1">{p.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-black text-xs">{convertPrice(p.price).symbol}{convertPrice(p.price).amount}</span>
                  <span className="text-[8px] font-black tracking-widest bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded uppercase hover:bg-primary/20 hover:text-primary transition-all">
                    View
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      lastIndex = recommendRegex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }
    
    return <div className="space-y-1">{parts}</div>;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: "assistant",
      content: "I am LUXE, your Neural Style Consultant. How shall we architect your silhouette today?",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => handleSend(result),
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSend = async (text = input) => {
    const messageText = text.trim();
    if (!messageText || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    setQuickReplies([]);

    try {
      const chatMessages = messages.concat(userMessage).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const response = await fetch("/api/zyra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages,
          styleDna,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      // Add a streaming placeholder message
      const placeholderId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: placeholderId,
          role: "assistant",
          content: "",
          type: "text",
          isStreaming: true,
        },
      ]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes("[DONE]")) {
          // Strip the sentinel and finalize
          const cleanChunk = chunk.replace(/\n?\[DONE\]/, "");
          if (cleanChunk) fullText += cleanChunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId
                ? { ...m, content: fullText, isStreaming: false }
                : m
            )
          );
          // Show quick-reply chips
          assistantMsgCountRef.current += 1;
          const chipSet = QUICK_REPLIES[assistantMsgCountRef.current % QUICK_REPLIES.length];
          setQuickReplies(chipSet);
          break;
        }

        if (chunk.includes("[ERROR]")) {
          const errorText = chunk.replace(/\n?\[ERROR\]\s*/, "");
          fullText = errorText || "Neural uplink degraded. Please try again.";
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId
                ? { ...m, content: fullText, isStreaming: false }
                : m
            )
          );
          break;
        }

        fullText += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId ? { ...m, content: fullText } : m
          )
        );
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Neural link interrupted. Re-initializing...",
          type: "text",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setQuickReplies([]);
    handleSend(reply);
  };

  const toggleVoice = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <>
      {/* ── Compact AI Trigger Orb ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-[100] group"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Ambient Glow */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
              />
              {/* Button Body */}
              <div className="w-full h-full rounded-2xl glass-panel-elevated border-primary/20 flex items-center justify-center text-primary group-hover:text-white transition-all relative overflow-hidden">
                <BrainCircuit size={22} className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[8px] font-black text-white shadow-lg">
                1
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Compact Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-8 left-8 z-[100] w-[420px] max-w-[calc(100vw-2rem)] h-[580px] rounded-[28px] overflow-hidden flex flex-col border border-white/[0.06] glass-pill"
            style={{
              background: "rgba(5, 5, 5, 0.8)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 120px rgba(0,242,255,0.03)",
            }}
          >
            {/* Header — Minimal */}
            <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-black tracking-tight text-white/90">LUXE</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
              >
                <X size={18} />
              </button>
              {/* Subtle header glow */}
              <div className="absolute -top-10 right-10 w-24 h-24 bg-primary/5 blur-[40px] pointer-events-none" />
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar">
              {messages.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-5 py-3.5 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "bg-primary/15 text-white/90 rounded-2xl rounded-tr-md border border-primary/20"
                        : "bg-white/[0.03] text-white/60 rounded-2xl rounded-tl-md border border-white/[0.04]"
                    )}
                  >
                    {renderMessageContent(m.content)}
                    {/* Blinking cursor while streaming */}
                    {m.isStreaming && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        className="inline-block ml-0.5 text-primary font-bold"
                      >
                        |
                      </motion.span>
                    )}
                  </div>

                  {/* Single Product Recommendation Card */}
                  {m.product && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full rounded-2xl p-4 border border-primary/15 bg-white/[0.02] group cursor-pointer hover:bg-white/[0.04] transition-all"
                      onClick={() => window.location.href = `/product/${m.product?.id}`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-white/[0.06] flex-shrink-0">
                          <Image src={m.product.modelImages?.variants?.["White"]?.front || m.product.images[0] || "/brand/linen_model_front.png"} alt={m.product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-black text-xs tracking-tight truncate">{m.product.name}</h4>
                          <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{m.product.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-black text-xs">{convertPrice(m.product.price).symbol}{convertPrice(m.product.price).amount}</span>
                            <button className="text-[8px] font-black tracking-widest bg-white/5 border border-white/10 text-white/50 px-3 py-1.5 rounded-lg uppercase hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Multiple Product Recommendations List */}
                  {m.items && m.items.length > 0 && (
                    <div className="flex flex-col gap-2.5 w-full">
                      {m.items.map((item, idx) => (
                        <motion.div
                          key={`${item.id}-${idx}`}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="w-full rounded-2xl p-4 border border-primary/15 bg-white/[0.02] group cursor-pointer hover:bg-white/[0.04] transition-all"
                          onClick={() => window.location.href = `/product/${item.id}`}
                        >
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-white/[0.06] flex-shrink-0">
                              <Image src={item.modelImages?.variants?.["White"]?.front || item.images[0] || "/brand/linen_model_front.png"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-display font-black text-xs tracking-tight truncate">{item.name}</h4>
                              <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{item.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-primary font-black text-xs">{convertPrice(item.price).symbol}{convertPrice(item.price).amount}</span>
                                <button className="text-[8px] font-black tracking-widest bg-white/5 border border-white/10 text-white/50 px-3 py-1.5 rounded-lg uppercase hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Processing dots (only shown before streaming starts) */}
              {isProcessing && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex flex-col gap-2">
                  <div className="bg-white/[0.03] border border-white/[0.04] px-5 py-3.5 rounded-2xl rounded-tl-md w-16">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="flex gap-1.5"
                    >
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Quick Reply Chips */}
              <AnimatePresence>
                {quickReplies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex flex-wrap gap-2 mr-auto"
                  >
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold text-primary/80 hover:bg-primary/15 hover:border-primary/40 hover:text-primary transition-all whitespace-nowrap"
                      >
                        {reply}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Voice Listening Overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                  >
                    <Mic size={28} className="text-primary" />
                  </motion.div>
                  <p className="text-primary font-display font-black tracking-[0.4em] text-xs uppercase mb-2">Listening...</p>
                  <button onClick={stopListening} className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar — Compact */}
            <div className="px-5 py-4 border-t border-white/[0.04] bg-white/[0.015]">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                {[
                  { label: "Trends", icon: Activity },
                  { label: "Predict", icon: Cpu },
                  { label: "Search", icon: Search },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.label)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/[0.04] bg-white/[0.02] text-[9px] font-black text-white/25 hover:text-primary hover:border-primary/20 transition-all whitespace-nowrap uppercase tracking-widest"
                  >
                    <s.icon size={11} />
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Zyra..."
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl py-3.5 pl-5 pr-24 text-sm focus:outline-none focus:border-primary/30 transition-all placeholder:text-white/10"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                  <button
                    onClick={toggleVoice}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                      isListening ? "bg-red-500/20 text-red-400" : "text-white/20 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isProcessing}
                    className="w-9 h-9 bg-primary/80 text-black rounded-lg flex items-center justify-center hover:bg-primary transition-all disabled:opacity-20 active:scale-95"
                  >
                    <Send size={15} />
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
