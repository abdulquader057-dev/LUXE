// src/app/brand/page.tsx
"use client";

import Seo from "@/components/seo/Seo";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function BrandPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (trimmedEmail.length > 255) {
      setErrorMsg("Oversized email is rejected (max 255 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Invalid email directive format.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to join waitlist.");
      }

      // GTM Event Tracking for Waitlist
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "join_waitlist",
          email: trimmedEmail,
        });
      }

      toast.success("You have been added to the waitlist! 🎉");
      setEmail("");
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to join waitlist.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen bg-primary text-offwhite flex flex-col items-center justify-center p-6 md:p-12 glass">
      <Seo title="LUXE — Brand Story" description="LUXE – Affordable luxury fashion for the bold generation." />
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-cormorant font-light text-gold mb-4">
          Luxury Redefined
        </h1>
        <p className="text-lg md:text-xl text-offwhite/80">
          Started in WhatsApp groups, built by word of mouth, now LUXE is for everyone who deserves luxury without the price tag.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-auto px-4 py-2 rounded bg-primary border border-gold text-offwhite placeholder:text-offwhite/50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gold text-primary font-bold rounded hover:bg-gold/90 transition disabled:opacity-50"
          >
            Join the Inner Circle
          </button>
        </form>
        {errorMsg && (
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-xs font-mono text-center max-w-sm mx-auto">
            {errorMsg}
          </div>
        )}
      </section>
    </main>
  );
}
