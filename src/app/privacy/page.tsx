"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Key, Eye, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-primary pt-32 pb-40 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[#C9A84C]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-mono text-[#00f2ff] hover:text-text-primary uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Nexus
          </Link>
        </motion.div>

        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-7xl font-cormorant font-bold text-[#00f2ff] uppercase tracking-[0.25em] leading-[0.9] mb-4">
            Privacy<br />
            <span className="text-text-primary italic font-light font-cormorant tracking-normal text-3xl md:text-6xl lowercase">protocol.</span>
          </h1>
          <p className="text-[10px] font-mono text-[#00f2ff]/80 uppercase tracking-[0.3em] mt-4">
            Security. Storage. Trust.
          </p>
        </motion.div>

        {/* Content Cards */}
        <div className="space-y-12">
          {/* Card 1: Data Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Shield size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#00f2ff]">
                01 // Data Acquisition
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              We collect the following personal parameters necessary to facilitate luxury deliveries and coordinate style consults:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#C9A84C]/25 text-text-secondary">
              <li>• Full Name</li>
              <li>• Phone Number (provided via WhatsApp)</li>
              <li>• Browsing and Interaction Data</li>
            </ul>
          </motion.div>

          {/* Card 2: Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Key size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#00f2ff]">
                02 // Functional Utilization
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Acquired telemetry is strictly leveraged for the following operations within the LUXE eco-structure:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#C9A84C]/25 text-text-secondary">
              <li>• Order processing and delivery logistics</li>
              <li>• Customer support and communication</li>
              <li>• Personalized style recommendations via Zyra</li>
            </ul>
          </motion.div>

          {/* Card 3: Storage & Safety */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Eye size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#00f2ff]">
                03 // Security & Storage
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Your profile is stored securely using **Supabase database layers** hosted in the **India region** with strict Row Level Security (RLS) policies.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              **We never sell, rent, or lease your data** to third parties. All transactions and communication details are kept private.
            </p>
          </motion.div>

          {/* Card 4: Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Shield size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#00f2ff]">
                04 // Governing Law
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              These privacy policies and data handling rules are governed by and formulated in accordance with the laws of **India** (specifically the **Information Technology Act, 2000** and rules made thereunder).
            </p>
          </motion.div>

          {/* Contact Segment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="border border-[#C9A84C]/25 rounded-[32px] p-8 md:p-12 text-center bg-bg-surface"
          >
            <div className="flex justify-center mb-6 text-[#C9A84C]">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-[#00f2ff] uppercase tracking-[0.2em] mb-4">
              Direct Uplink
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              If you require access logs or want your personal parameters wiped from the LUXE database node, connect directly:
            </p>
            <a 
              href="mailto:abdulquader057@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-[#0A0A0F] font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 hover:bg-[#E8C97A] transition-all duration-300"
            >
              abdulquader057@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
