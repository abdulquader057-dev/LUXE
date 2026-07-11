"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, Phone, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, STORE_ADMIN_EMAIL, useAuth } from "@/lib/contexts/AuthContext";
import toast from "react-hot-toast";
import { escapeString } from "@/lib/security";


const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export default function AuthPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
 
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);
 
  // Rate Limiting Handler
  const checkRateLimit = (): boolean => {
    try {
      const attemptsStr = localStorage.getItem("luxe-auth-attempts");
      const attempts: number[] = attemptsStr ? JSON.parse(attemptsStr) : [];
      const now = Date.now();
      const fifteenMins = 15 * 60 * 1000;
      
      // Filter out attempts older than 15 minutes
      const recentAttempts = attempts.filter((t: number) => now - t < fifteenMins);
      
      if (recentAttempts.length >= 5) {
        setError("Rate limit exceeded. Maximum 5 attempts per 15 minutes. Please try again later. 🔒");
        setIsRateLimited(true);
        return false;
      }
      
      recentAttempts.push(now);
      localStorage.setItem("luxe-auth-attempts", JSON.stringify(recentAttempts));
      setIsRateLimited(false);
      return true;
    } catch (e) {
      return true;
    }
  };
 
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!checkRateLimit()) {
      setLoading(false);
      return;
    }
 
    try {
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "login_start",
          method: "google"
        });
      }
 
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
 
      if (oAuthError) throw oAuthError;
    } catch (err: any) {
      setError(err.message || "OAuth redirection failed.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please input your Email Directive first to receive the reset link.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (resetError) throw resetError;
      setSuccess("Reset link sent! Check your inbox 🖤");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
 
    if (!checkRateLimit()) {
      setLoading(false);
      return;
    }
 
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedFullName = fullName.trim();
    const trimmedPhone = phone.trim();
 
    if (
      trimmedEmail.length > 255 ||
      trimmedPassword.length > 255 ||
      trimmedFullName.length > 255 ||
      trimmedPhone.length > 255
    ) {
      setError("Oversized inputs are rejected (max 255 characters).");
      setLoading(false);
      return;
    }
 
    const normalizedEmail = trimmedEmail.toLowerCase();
 
    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: trimmedPassword,
        });
 
        if (signInError) throw signInError;
 
        if (data?.user) {
          // Block login until verified if email is not confirmed
          if (!data.user.email_confirmed_at) {
            await supabase.auth.signOut();
            setError("Please verify your email before logging in. Check your email to verify your account 🖤");
            setLoading(false);
            return;
          }
        }
 
        // GTM Event Tracking for Email Login Success
        if (typeof window !== "undefined") {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: "login",
            email: normalizedEmail,
            method: "email"
          });
        }

        router.refresh();
        router.push("/");
      } else {
        const escapedFullName = escapeString(trimmedFullName);
        const escapedPhone = escapeString(trimmedPhone);

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedEmail,
            password: trimmedPassword,
            fullName: escapedFullName,
            phone: escapedPhone,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Signup failed");
        }

        // Auto-login the user immediately after successful signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: trimmedPassword,
        });

        if (signInError) throw signInError;

        // GTM Event Tracking for Signup Success
        if (typeof window !== "undefined") {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: "sign_up",
            email: normalizedEmail,
            method: "email"
          });
        }
        setSuccess("Account created successfully! Logging you in... 🖤");
        router.refresh();
        setTimeout(() => {
          router.push("/");
        }, 1500);
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };
 
  const isGoldError = isRateLimited || (error && error.includes("OAuth"));
 
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative z-20 bg-[#1C1410] pt-28 pb-28">
      {/* Cinematic Highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md bg-[#F5E6C8] text-[#1C1410] border border-[#D4AF37]/40 p-10 rounded-[32px] shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#1C1410]/5 border border-[#D4AF37]/40 flex items-center justify-center mb-6">
            <ShieldCheck size={32} className="text-[#1C1410]/80" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-[0.2em] uppercase mb-2 text-center text-[#00f2ff] text-shadow">
            {isLogin ? "Neural Access" : "Initialize Identity"}
          </h1>
          <p className="text-[#1C1410]/60 text-sm font-sora text-center">
            {isLogin 
              ? "Authenticate to sync your personalized style matrix." 
              : "Register to unlock the full potential of LUXE OS."}
          </p>
        </div>
 
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 border rounded-xl text-xs font-sora text-center ${
              isGoldError
                ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#00f2ff]"
                : "bg-[#C0392B]/10 border-[#C0392B]/30 text-[#C0392B]"
            }`}
          >
            {error}
          </motion.div>
        )}
 
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-[#00f2ff] text-xs font-sora text-center"
          >
            {success}
          </motion.div>
        )}
 
        {/* Continue with Google button above email form */}
        {isLogin && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-transparent border-2 border-[#D4AF37] text-[#1C1410] font-display font-black tracking-widest uppercase rounded-xl transition-all flex items-center justify-center hover:bg-[#1C1410]/5 active:scale-95"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-[#1C1410]/20"></div>
              <span className="flex-shrink mx-4 text-[#1C1410]/40 text-[9px] font-bold tracking-widest uppercase">OR EMAIL DIRECTIVE</span>
              <div className="flex-grow border-t border-[#1C1410]/20"></div>
            </div>
          </div>
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
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1C1410] mb-2">Legal Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1410]/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Legal Name"
                      className="w-full h-14 bg-white border border-[#D4AF37]/40 rounded-xl pl-12 pr-4 text-[#1C1410] font-sora placeholder:text-[#1C1410]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1C1410] mb-2">Mobile Link</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1410]/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Number (+91...)"
                      className="w-full h-14 bg-white border border-[#D4AF37]/40 rounded-xl pl-12 pr-4 text-[#1C1410] font-sora placeholder:text-[#1C1410]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
 
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1C1410] mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1410]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Directive"
                className="w-full h-14 bg-white border border-[#D4AF37]/40 rounded-xl pl-12 pr-4 text-[#1C1410] font-sora placeholder:text-[#1C1410]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>
 
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1C1410] mb-2">Security Key</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1410]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Security Key (Password)"
                className="w-full h-14 bg-white border border-[#D4AF37]/40 rounded-xl pl-12 pr-4 text-[#1C1410] font-sora placeholder:text-[#1C1410]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
            {isLogin && (
              <div className="flex justify-end text-xs mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#00f2ff] hover:underline font-mono tracking-wider uppercase text-[10px] font-bold"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#D4AF37] text-[#1C1410] hover:bg-[#D4AF37]/90 font-display font-black tracking-[0.25em] uppercase rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                {isLogin ? "Initialize Link" : "Create Identity"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
 
        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
            className="text-[#1C1410]/60 hover:text-[#1C1410] font-sora text-xs transition-colors font-semibold"
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
