"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2, Mic, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function ZyraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const { t, currentLangData } = useLanguage();
  
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Welcome to LUXE AI. I am your personal stylist. How can I assist you with your wardrobe today?"
    }
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenZyra = () => setIsOpen(true);
    window.addEventListener("open-zyra", handleOpenZyra);
    return () => window.removeEventListener("open-zyra", handleOpenZyra);
  }, []);

  // Update initial message when language changes if no other messages exist
  useEffect(() => {
    if (messages.length === 1) {
       setMessages([{
         role: "model",
         content: t("chat.placeholder").replace("...", "") // Simple translated greeting
       }]);
    }
  }, [currentLangData]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Stop any current speech
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
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
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

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          language: currentLangData.name 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.message }]);
      
      // Auto-play the response if voice is enabled
      speak(data.message);
      
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", content: "System Offline. Neural link severed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[500px] bg-[#050508]/90 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/40 to-white/10 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                       <Sparkles size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF00] rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="text-[11px] font-orbitron text-white tracking-widest uppercase">LUXE AI</h3>
                  <p className="text-[9px] font-sora text-white/50 tracking-wider">{t("chat.online")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setVoiceEnabled(!voiceEnabled)} 
                  className={cn("transition-colors", voiceEnabled ? "text-[#00F0FF]" : "text-white/40 hover:text-white")}
                  title="Toggle Voice Output"
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-rajdhani text-sm custom-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex flex-col gap-1 max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
                  <span className="text-[8px] font-orbitron text-white/40 tracking-widest uppercase mx-2">
                    {msg.role === "user" ? "YOU" : "LUXE"}
                  </span>
                  <div className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed",
                    msg.role === "user" 
                      ? "bg-white text-black rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex flex-col gap-1 max-w-[85%] mr-auto items-start">
                  <span className="text-[8px] font-orbitron text-white/40 tracking-widest uppercase mx-2">LUXE</span>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-white/90">
                    <Loader2 size={16} className="animate-spin text-white/50" />
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40">
              <div className="relative flex items-center gap-2">
                <button 
                  onClick={startListening}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex-shrink-0",
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
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white font-rajdhani placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-white/40 to-white/10 p-[1px] shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-transform relative group"
      >
        <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center relative overflow-hidden">
          <MessageSquare size={24} className="text-white relative z-10" />
          <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
    </div>
  );
}
