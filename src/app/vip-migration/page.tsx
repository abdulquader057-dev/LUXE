// src/app/vip-migration/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Seo from "@/components/seo/Seo";

export default function VipMigrationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedPhone) {
      setErrorMsg("Name and Phone parameters are required.");
      return;
    }

    if (trimmedName.length > 255 || trimmedPhone.length > 255 || trimmedEmail.length > 255) {
      setErrorMsg("Oversized inputs are rejected (max 255 characters).");
      return;
    }

    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setErrorMsg("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setErrorMsg("Invalid email directive format.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      toast.success("Welcome to the Inner Circle 🖤");
      setName("");
      setPhone("");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary text-offwhite flex flex-col items-center justify-center p-6 md:p-12 glass">
      <Seo title="LUXE — VIP Migration" description="Join the inner circle and migrate your profile." />
      <section className="max-w-md w-full space-y-4">
        <h1 className="text-3xl font-cormorant font-light text-gold text-center mb-4">VIP Migration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-primary border border-gold text-offwhite"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-primary border border-gold text-offwhite"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-primary border border-gold text-offwhite"
            />
          </div>
          {errorMsg && (
            <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2 bg-gold text-primary font-bold rounded hover:bg-gold/90 transition disabled:opacity-50"
          >
            Submit
          </button>

        </form>
      </section>
    </main>
  );
}
