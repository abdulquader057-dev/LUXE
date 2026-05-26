"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, Phone, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, useAuth } from "@/lib/contexts/AuthContext";

export default function AuthPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { loginAsDemo } = useAuth();

  const handleBypassAuth = () => {
    loginAsDemo();
    router.push("/profile");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Redirect based on role
        if (email === ADMIN_EMAIL) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phone,
            },
          },
        });

        if (signUpError) throw signUpError;
        
        // Auto sign-in or alert to check email if email confirmation is required by Supabase settings
        alert("Registration successful! Logging you in...");
        
        if (email === ADMIN_EMAIL) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative z-20">
      
      {/* Cinematic Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md bg-[#050508]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.05)] relative overflow-hidden"
      >
        {/* Subtle Cyber Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <ShieldCheck size={32} className="text-white/80" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase mb-2 text-center">
            {isLogin ? "Neural Access" : "Initialize Identity"}
          </h1>
          <p className="text-white/40 text-sm font-sora text-center">
            {isLogin 
              ? "Authenticate to sync your personalized style matrix." 
              : "Register to unlock the full potential of LUXE OS."}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-sora text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white font-sora placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number (+91...)"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white font-sora placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Directive"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white font-sora placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Key (Password)"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white font-sora placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-white text-black hover:bg-gray-200 font-display font-black tracking-widest uppercase rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                {isLogin ? "Initialize Link" : "Create Identity"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-white/20 text-[9px] font-bold tracking-widest uppercase">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleBypassAuth}
            className="w-full h-14 bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-[#00F0FF]/80 hover:text-[#00F0FF] hover:bg-[#00F0FF]/15 font-display font-black tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-3"
          >
            Bypass Authentication (Test Mode)
            <ShieldCheck size={20} className="text-[#00F0FF]" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/40 hover:text-white font-sora text-xs transition-colors"
          >
            {isLogin 
              ? "No neural identity yet? Register here." 
              : "Already synced? Login here."}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
