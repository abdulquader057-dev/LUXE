"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, CheckCircle2, ChevronRight, Sparkles, Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function ARScannerPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Successfully registered for Neural Scan Beta!");
      // Save locally to persist state
      localStorage.setItem("luxe-scanner-waitlist", "true");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-6 relative overflow-hidden pt-28">
      {/* Background grids and glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl w-full glass-luxury p-10 md:p-14 border border-white/5 shadow-2xl text-center space-y-10">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Pulsing scanner bounds */}
          <div className="absolute inset-0 border border-primary/30 rounded-2xl animate-pulse" />
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
          
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-full h-[1px] bg-primary/80 absolute shadow-[0_0_10px_rgba(0,242,255,0.8)] z-10"
          />
          <Camera size={32} className="text-white/60" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-[#D4AF37] uppercase pl-[0.4em]">
              Preview Protocol
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white uppercase leading-none">
            Neural Fit<br/>
            <span className="text-gradient">Scanner.</span>
          </h1>
          <p className="text-sm text-white/40 leading-relaxed font-medium max-w-md mx-auto">
            Elevate physical tailoring to virtual sizing. Using device camera spatial depth, Zyra builds your exact 3D silhouette model. Currently in restricted preview.
          </p>
        </div>

        <div className="w-16 h-[1px] bg-white/10 mx-auto" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto space-y-4 text-left"
            >
              <div className="space-y-1">
                <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest block ml-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shadab Qr"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest block ml-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--primary-color)] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Syncing..." : "Access Beta Hub"} <ChevronRight size={14} />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto p-6 rounded-2xl border border-green-500/20 bg-green-500/5 space-y-4"
            >
              <CheckCircle2 size={32} className="text-green-400 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest">
                  ACCESS APPROVED
                </h3>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  Your coordinates have been registered. Beta key will arrive via email.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
