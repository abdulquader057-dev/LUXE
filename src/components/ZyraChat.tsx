"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Mic, Volume2, VolumeX, PhoneCall, Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import toast from "react-hot-toast";
import { track } from "@vercel/analytics";

interface Message {
  role: string;
  content: string;
  timestamp?: string;
  isError?: boolean;
}

export default function ZyraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const { t, currentLangData } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Welcome to LUXE AI. I am your personal stylist. How can I assist you with your wardrobe today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Helper to save messages to state and localStorage (max 20)
  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem("luxe-zyra-messages", JSON.stringify(newMsgs.slice(-20)));
      localStorage.setItem("luxe-zyra-last-activity", String(new Date().getTime()));
    } catch (e) {}
  };

  // Listen for open event from bottom navigation bar
  useEffect(() => {
    const handleOpenZyra = () => setIsOpen(true);
    window.addEventListener("open-zyra", handleOpenZyra);
    return () => window.removeEventListener("open-zyra", handleOpenZyra);
  }, []);

  // Load chat history & check inactivity on mount
  useEffect(() => {
    // 30 minute inactivity reset check
    const lastActivity = localStorage.getItem("luxe-zyra-last-activity");
    const thirtyMins = 30 * 60 * 1000;
    const now = new Date().getTime();
    
    if (lastActivity && (now - Number(lastActivity) > thirtyMins)) {
      localStorage.removeItem("luxe-zyra-messages");
    } else {
      const saved = localStorage.getItem("luxe-zyra-messages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        } catch (e) {}
      }
    }

    // Default message if no saved history exists
    setMessages([
      {
        role: "model",
        content: t("chat.placeholder").replace("...", ""),
        timestamp: new Date().toISOString()
      }
    ]);
  }, [currentLangData, t]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const diffMs = new Date().getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLangData.speechCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLangData.speechCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSendMessage = async (textToProcess?: string) => {
    const text = textToProcess || message;
    if (!text.trim()) return;

    try { track("zyra_message_sent", { messageLength: text.trim().length }); } catch (e) {}

    // Trigger haptic vibration feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }

    const userMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    setMessage("");
    setIsLoading(true);
    // 25-second fetch timeout controller for serverless function cold-starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages,
          language: currentLangData.name 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const aiResponse = { 
        role: "model", 
        content: data.message, 
        timestamp: new Date().toISOString() 
      };
      saveMessages([...updatedMessages, aiResponse]);
      speak(data.message);
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error(error);
      
      const errorContent = error.name === "AbortError" 
        ? "Zyra is taking a moment. Network latency detected."
        : "System Offline. Neural link severed. Please try again.";

      const aiErrorResponse = { 
        role: "model", 
        content: errorContent,
        isError: true,
        timestamp: new Date().toISOString() 
      };
      saveMessages([...updatedMessages, aiErrorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!", { duration: 1000 });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    const defaultGreet = [{
      role: "model",
      content: t("chat.placeholder").replace("...", ""),
      timestamp: new Date().toISOString()
    }];
    saveMessages(defaultGreet);
    toast.success("Chat history cleared");
  };

  const suggestedChips = [
    "What suits my body type?",
    "Check shipping to Mumbai",
    "Occasion wear suggestions",
    "Latest techwear drops"
  ];

  return (
    <div className="relative z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: -30 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            style={{ perspective: "1200px", transformOrigin: "bottom center", borderColor: "rgba(201,168,76,0.15)" }}
            className="fixed bottom-0 md:bottom-24 right-0 md:right-0 w-full md:w-[380px] h-[75vh] md:h-[500px] bg-[#0A0A0F]/95 backdrop-blur-md rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col border-t md:border shadow-2xl z-[9999]"
          >
            {/* Draggable Handle for Mobile */}
            <div className="md:hidden w-12 h-1 bg-white/10 rounded-full mx-auto my-2 shrink-0" />

            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <motion.div
                    className="relative"
                    animate={{ y: ["-4px", "4px", "-4px"] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/40 to-[#C9A84C]/10 p-[1px]">
                      <div className="w-full h-full rounded-full bg-[#0A0A0F] flex items-center justify-center">
                         <Sparkles size={18} style={{ color: "#C9A84C" }} />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                  </motion.div>
                <div>
                  <h3 className="text-[11px] font-orbitron text-white tracking-widest uppercase">LUXE AI</h3>
                  <p className="text-[9px] font-sora text-white/50 tracking-wider">{t("chat.online")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleClearChat}
                  className="text-white/40 hover:text-white transition-colors text-[9px] font-mono tracking-widest uppercase cursor-pointer"
                  title="Clear Chat History"
                >
                  <RotateCcw size={14} className="inline mr-1" /> Clear
                </button>
                <button 
                  onClick={() => setVoiceEnabled(!voiceEnabled)} 
                  className={cn("transition-colors cursor-pointer", voiceEnabled ? "text-[#00F0FF]" : "text-white/40 hover:text-white")}
                  title="Toggle Voice Output"
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sora text-sm custom-scrollbar">
              {messages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn("flex flex-col gap-1 max-w-[85%] relative group", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}
                  >
                  <span className="text-[8px] font-orbitron text-white/40 tracking-widest uppercase mx-2 flex items-center gap-2">
                    {msg.role === "user" ? "YOU" : "LUXE"}
                    {msg.timestamp && <span className="font-sans text-[7px] text-white/20 normal-case">{formatTime(msg.timestamp)}</span>}
                  </span>
                  
                  <div className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed relative",
                    msg.role === "user" 
                      ? "bg-white text-black rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                  )}>
                    <div>{msg.content}</div>

                    {msg.isError && (
                      <button
                        onClick={() => {
                          const userMsgs = messages.filter((m) => m.role === "user");
                          if (userMsgs.length > 0) {
                            const lastUserMsg = userMsgs[userMsgs.length - 1].content;
                            const cleaned = messages.slice(0, -1);
                            saveMessages(cleaned);
                            handleSendMessage(lastUserMsg);
                          }
                        }}
                        className="mt-2 flex items-center gap-1 px-2.5 py-1 bg-primary/20 border border-primary/40 text-primary text-[8px] font-mono tracking-widest uppercase rounded cursor-pointer hover:bg-primary/30 transition-colors"
                      >
                        Retry request
                      </button>
                    )}

                    {/* Copy action visible on hover/tap */}
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/60 rounded text-white/40 hover:text-white cursor-pointer"
                      title="Copy Message"
                    >
                      {copiedIndex === index ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                    </button>
                  </div>
                  </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex flex-col gap-1 max-w-[85%] mr-auto items-start">
                  <span className="text-[8px] font-orbitron text-white/40 tracking-widest uppercase mx-2">LUXE</span>
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-white/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>

            {/* Suggested Chips (visible at start of conversation) */}
            {messages.length <= 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2 mb-1 shrink-0">
                {suggestedChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setMessage(chip);
                      handleSendMessage(chip);
                    }}
                    className="px-3 py-1.5 rounded-full border border-white/5 bg-white/3 text-[9px] font-mono tracking-wider text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40">
              {/* Direct Support Quick Links */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar px-1 pb-1">
                <a
                  href="https://wa.me/917995338472?text=Hi! I would like to query about orders/collections."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 text-green-400 hover:bg-green-500/10 hover:border-green-500/40 transition-all text-[8px] font-mono tracking-widest uppercase whitespace-nowrap"
                >
                  <MessageSquare size={10} />
                  WhatsApp Primary
                </a>
                <a
                  href="https://wa.me/917337246297?text=Hi! I have a style support query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/10 bg-green-500/0 text-green-400/70 hover:bg-green-500/5 hover:border-green-500/30 transition-all text-[8px] font-mono tracking-widest uppercase whitespace-nowrap"
                >
                  <MessageSquare size={10} />
                  WhatsApp Alt
                </a>
                <a
                  href="tel:+917995338472"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-[8px] font-mono tracking-widest uppercase whitespace-nowrap"
                >
                  <PhoneCall size={10} />
                  Call Primary
                </a>
                <a
                  href="tel:+917337246297"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/10 bg-blue-500/0 text-blue-400/70 hover:bg-blue-500/5 hover:border-blue-500/30 transition-all text-[8px] font-mono tracking-widest uppercase whitespace-nowrap"
                >
                  <PhoneCall size={10} />
                  Call Alt
                </a>
              </div>

              <div className="relative flex items-center gap-2">
                <button 
                  onClick={startListening}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex-shrink-0 cursor-pointer",
                    isListening 
                      ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  title="Speech to Text"
                >
                  <Mic size={18} />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={isListening ? t("chat.listening") : t("chat.placeholder")}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white font-sora placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        id="zyrachat-trigger"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) { try { track("zyra_opened"); } catch (e) {} }
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-white/40 to-white/10 p-[1px] shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-transform relative group cursor-pointer"
      >
        <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center relative overflow-hidden">
          <MessageSquare size={24} className="text-white relative z-10" />
          <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
    </div>
  );
}
