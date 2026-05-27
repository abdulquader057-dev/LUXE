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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("vip_migration").insert({ name, phone, email });
      if (error) throw error;
      toast.success("Welcome to the Inner Circle 🖤");
      setName("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
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
