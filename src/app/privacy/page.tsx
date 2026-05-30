"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Key, Eye, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#1C1410] text-[#F5E6C8] pt-32 pb-40 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
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
            className="inline-flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] hover:text-[#F5E6C8] uppercase tracking-[0.2em] transition-colors"
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
          <h1 className="text-4xl md:text-7xl font-display font-black text-[#D4AF37] uppercase tracking-[0.25em] leading-[0.9] mb-4">
            Privacy<br />
            <span className="text-[#F5E6C8] italic font-light font-cormorant tracking-normal text-3xl md:text-6xl lowercase">protocol.</span>
          </h1>
          <p className="text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-[0.3em] mt-4">
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
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <Shield size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                01 // Data Acquisition
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-6">
              We collect the following personal parameters necessary to facilitate luxury deliveries and coordinate neural wardrobe syncs:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#1C1410]/20">
              <li>• Full Identity Name</li>
              <li>• Secure Phone / Communication Link</li>
              <li>• Electronic Mail Address (Email)</li>
              <li>• Physical Coordinates (Delivery Address)</li>
            </ul>
          </motion.div>

          {/* Card 2: Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <Key size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                02 // Functional Utilization
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-6">
              Acquired telemetry is strictly leveraged for the following operations within the LUXE eco-structure:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#1C1410]/20">
              <li>• Courier Dispatch and Order Fulfillment</li>
              <li>• WhatsApp order updates & notifications</li>
              <li>• Loyalty tier XP calculation and rewards calibration</li>
            </ul>
          </motion.div>

          {/* Card 3: Storage & Safety */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <Eye size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                03 // Security & Third-Parties
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              Your profile is stored securely using **Supabase database layers** with strict Row Level Security (RLS) policies.
            </p>
            <p className="text-sm font-medium leading-relaxed">
              **We never sell, rent, or lease your data** to third parties. Your coordinates are private information.
            </p>
          </motion.div>

          {/* Contact Segment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="border border-[#D4AF37]/40 rounded-[32px] p-8 md:p-12 text-center bg-[#1C1410]"
          >
            <div className="flex justify-center mb-6 text-[#D4AF37]">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-display font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
              Direct Uplink
            </h3>
            <p className="text-[#F5E6C8]/80 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              If you require access logs or want your personal parameters wiped from the LUXE database node, connect directly:
            </p>
            <a 
              href="mailto:abdulquader057@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] text-[#1C1410] font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 hover:bg-[#D4AF37]/90 transition-all duration-300"
            >
              abdulquader057@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
