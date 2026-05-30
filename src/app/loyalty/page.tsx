// src/app/loyalty/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/contexts/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Crown, Users, Sparkles, CheckCircle2, Loader2, Phone, Mail, User, Lock } from "lucide-react";
import Link from "next/link";
import { useTilt } from "@/hooks/useTilt";

const WA_GROUP_LINK = "https://chat.whatsapp.com/BsNY4Jkv67GC6NvxkcTBji";
const MAX_MEMBERS = 100;

const TIERS = [
  {
    name: "Bronze",
    glow: "#CD7F32",
    description: "Foundational membership tier. Unlock basic rewards and stay updated on local drops.",
    benefits: ["Earn points on every purchase", "Standard customer support", "Exclusive community newsletters"],
  },
  {
    name: "Silver",
    glow: "#C0C0C0",
    description: "Enhanced loyalty tier. Experience priority access and special member privileges.",
    benefits: ["10% points accelerator", "Priority WhatsApp support", "Invites to local community pop-ups"],
  },
  {
    name: "Gold",
    glow: "#D4AF37",
    description: "The ultimate membership level. VIP luxury privileges tailored for elite collectors.",
    benefits: ["20% points accelerator", "Personal stylist console", "Early access to limited releases", "Free shipping on all drops"],
  },
];

function TierCard({ name, glow, description, benefits }: { name: string; glow: string; description: string; benefits: string[] }) {
  const tilt = useTilt(8);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl p-6 bg-black/60 border border-white/10 transition-shadow duration-500 flex flex-col h-full cursor-pointer select-none"
      onMouseMove={tilt.onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        tilt.onMouseLeave();
      }}
      style={{
        ...tilt.style,
        boxShadow: isHovered ? `0 0 25px -5px ${glow}, 0 8px 20px -6px rgba(0,0,0,0.7)` : "none",
        borderColor: isHovered ? glow : "rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
          {name}
        </h3>
        <div 
          className="w-3.5 h-3.5 rounded-full" 
          style={{ 
            backgroundColor: glow,
            boxShadow: `0 0 10px ${glow}`
          }} 
        />
      </div>
      <p className="text-[11px] font-sora text-white/50 leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <ul className="space-y-2 border-t border-white/5 pt-4">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[10px] font-sora text-white/70">
            <span className="text-[9px] font-mono mt-0.5" style={{ color: glow }}>•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LoyaltyPage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validation helpers
  const isPhoneValid = /^[6-9]\d{9}$/.test(phone.replace(/[^0-9]/g, "").slice(-10));
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLengthValid = name.length <= 255 && phone.length <= 255 && email.length <= 255 && address.length <= 255;
  const canSubmit = name.trim() && isPhoneValid && isEmailValid && address.trim() && isLengthValid && !submitting;

  const fetchCount = async () => {
    const { count } = await supabase
      .from("vip_migration")
      .select("*", { count: "exact", head: true });
    setMemberCount(count ?? 0);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!canSubmit) {
      if (!isLengthValid) {
        setErrorMsg("Oversized inputs are rejected (max 255 characters).");
      } else {
        setErrorMsg("Please verify that all fields are filled out correctly.");
      }
      return;
    }

    if (!user) {
      toast.error("Please log in to join the Inner Circle.");
      return;
    }

    if ((memberCount ?? 0) >= MAX_MEMBERS) {
      toast.error("All 100 Elite spots have been claimed! 🎉");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Securing your spot...");

    try {
      // POST to secure /api/vip route
      const response = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          user_id: user.id,
          tier: "Elite",
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to join VIP Inner Circle");
      }

      // GTM Event Tracking for joining Inner Circle
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "join_inner_circle",
          user_email: email.trim(),
          tier: "Elite"
        });
      }

      // Send congratulations WhatsApp to customer
      const customerMsg = encodeURIComponent(
        `🎉 Congratulations ${name}!\n\nYou have successfully joined the *LUXE Elite Inner Circle* — the most exclusive membership available.\n\n✨ Your Elite membership of ₹5,000 is *FREE for LIFE*.\n\nWelcome to the circle.\n\n— LUXE Team`
      );

      // Notify primary number
      const adminMsg = encodeURIComponent(
        `👑 New Inner Circle Member!\n━━━━━━━━━━━━━━━━━━━━━━━\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n📍 Address: ${address}\n💎 Tier: Elite (Free for Life)\n━━━━━━━━━━━━━━━━━━━━━━━`
      );

      // Open congratulations WhatsApp to customer, then admin notification
      setTimeout(() => {
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "").slice(-10)}?text=${customerMsg}`, "_blank");
        setTimeout(() => {
          window.open(`https://wa.me/917995338472?text=${adminMsg}`, "_blank");
        }, 700);
      }, 800);

      toast.dismiss(toastId);
      toast.success("🎉 You're in the Inner Circle! Sending your welcome message...");
      setJoined(true);
      fetchCount();
    } catch (err: any) {
      console.error(err);
      toast.dismiss(toastId);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };


  const spotsLeft = memberCount !== null ? MAX_MEMBERS - memberCount : null;
  const isFull = (memberCount ?? 0) >= MAX_MEMBERS;

  return (
    <main className="min-h-screen bg-[#020203] text-[#F9FAFB] flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden pt-28 pb-24">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-4">
              <Crown size={28} className="text-[#D4AF37]" />
            </div>
            <h1 className="text-4xl font-cormorant font-light text-white italic tracking-wide mb-2">
              Loyalty Inner Circle
            </h1>
            <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em]">
              Exclusive Founding Member Access
            </p>
          </div>

          {/* Member Counter */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="admin-card px-6 py-3 flex items-center gap-3">
              <Users size={16} className="text-[#D4AF37]" />
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Members Joined</p>
                <p className="text-xl font-orbitron font-bold text-white">
                  {memberCount !== null ? memberCount : <span className="skeleton inline-block w-8 h-5 rounded" />}
                  <span className="text-white/30 text-sm"> / {MAX_MEMBERS}</span>
                </p>
              </div>
            </div>
            {spotsLeft !== null && (
              <div className="admin-card px-6 py-3 text-center">
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Spots Left</p>
                <p className={`text-xl font-orbitron font-bold ${spotsLeft <= 10 ? "text-red-400" : "text-[#D4AF37]"}`}>
                  {spotsLeft}
                </p>
              </div>
            )}
          </div>

          {/* Offer details */}
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-5 mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                Founding Member Offer
              </span>
            </div>
            <p className="text-[12px] font-sora text-white/70 leading-relaxed">
              First <strong className="text-white">100 members</strong> from our WhatsApp community get <strong className="text-[#D4AF37]">FREE Elite membership (₹5,000 value) for life.</strong> Fill the form below to claim your spot.
            </p>
            <a
              href={WA_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-mono text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors underline tracking-wider"
            >
              Join WhatsApp Group ↗
            </a>
          </div>

          {/* Success State */}
          {joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="admin-card p-8 text-center space-y-4"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mx-auto">
                <CheckCircle2 size={28} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-cormorant font-light text-white italic">Welcome to the Circle</h2>
              <p className="text-[11px] font-mono text-white/50 uppercase tracking-widest">
                Your Elite membership is active. Check your WhatsApp for the welcome message.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-4 px-8 py-3 bg-[#D4AF37] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37]/90 transition-all button-gold"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : isFull ? (
            <div className="admin-card p-8 text-center space-y-3">
              <Lock size={28} className="text-red-400 mx-auto" />
              <h2 className="text-xl font-cormorant text-white">All 100 Spots Claimed!</h2>
              <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest">
                This offer has ended. Stay tuned for the next round.
              </p>
            </div>
          ) : !user ? (
            <div className="admin-card p-8 text-center space-y-4">
              <Lock size={24} className="text-[#D4AF37] mx-auto" />
              <p className="text-[12px] font-sora text-white/70">
                You must be logged in to claim your free Elite membership.
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-8 py-3 bg-[#D4AF37] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-xl button-gold"
              >
                Log In to Join
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="admin-card p-8 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <User size={10} className="text-[#D4AF37]" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20"
                />
                {!name.trim() && <p className="validation-msg ml-1">Name is required</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={10} className="text-[#D4AF37]" /> WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit Indian number"
                  className={`w-full p-3.5 rounded-xl bg-black/60 border text-[#F9FAFB] text-xs font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-white/20 ${
                    phone && !isPhoneValid
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                      : "border-white/10 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/30"
                  }`}
                />
                {phone && !isPhoneValid && (
                  <p className="validation-error ml-1">Invalid Indian phone number</p>
                )}
                {isPhoneValid && <p className="validation-msg ml-1">✓ Congratulations message will be sent here</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail size={10} className="text-[#D4AF37]" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full p-3.5 rounded-xl bg-black/60 border text-[#F9FAFB] text-xs font-mono focus:outline-none focus:ring-1 transition-all placeholder:text-white/20 ${
                    email && !isEmailValid
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                      : "border-white/10 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/30"
                  }`}
                />
                {email && !isEmailValid && (
                  <p className="validation-error ml-1">Invalid email format</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full delivery address"
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/10 text-[#F9FAFB] text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20 resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-xs font-mono text-center">
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-4 bg-[#D4AF37] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37]/90 hover:scale-[1.01] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 button-gold"
              >
                {submitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Securing Your Spot...</>
                ) : (
                  <><Crown size={14} /> Claim Free Elite Membership</>
                )}
              </button>


              <p className="text-[9px] font-mono text-white/20 text-center uppercase tracking-widest">
                Offer valid for first {MAX_MEMBERS} members only • Limited time
              </p>
            </form>
          )}
        </motion.div>

        {/* Tier Cards Section */}
        <div className="w-full border-t border-white/5 pt-16">
          <h2 className="text-2xl font-cormorant font-light text-center italic text-white/90 mb-10 tracking-widest uppercase">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} {...tier} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
