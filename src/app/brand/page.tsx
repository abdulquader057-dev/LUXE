// src/app/brand/page.tsx
"use client";

import Seo from "@/components/seo/Seo";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function BrandPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await supabase.from("waitlist").insert({ email });
      toast.success("You have been added to the waitlist! 🎉");
      setEmail("");
    } catch (error) {
      toast.error("Failed to join waitlist.");
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
      </section>
    </main>
  );
}
