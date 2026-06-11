"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, RotateCcw, Award, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
            className="inline-flex items-center gap-2 text-[10px] font-mono text-[#C9A84C] hover:text-text-primary uppercase tracking-[0.2em] transition-colors"
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
          <h1 className="text-4xl md:text-7xl font-cormorant font-bold text-[#C9A84C] uppercase tracking-[0.25em] leading-[0.9] mb-4">
            Terms &<br />
            <span className="text-text-primary italic font-light font-cormorant tracking-normal text-3xl md:text-6xl lowercase">conditions.</span>
          </h1>
          <p className="text-[10px] font-mono text-[#C9A84C]/80 uppercase tracking-[0.3em] mt-4">
            Service rules. System parameters. User responsibilities.
          </p>
        </motion.div>

        {/* Content Cards */}
        <div className="space-y-12">
          {/* Card 1: Shipping Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
                01 // Shipping Parameter
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              We ship across India with the following transit configurations:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#C9A84C]/25 text-text-secondary">
              <li>• **Express Shipping**: 1-2 business days to metro cities (Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata)</li>
              <li>• **Standard Shipping**: 3-5 business days to all other regions across India</li>
            </ul>
          </motion.div>

          {/* Card 2: Returns Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <RotateCcw size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
                02 // Returns Protocol
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              We stand by our product quality and fit silhouettes. If you wish to return an item:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#C9A84C]/25 text-text-secondary">
              <li>• Returns must be initiated within **7 days of delivery**</li>
              <li>• Items must be **unused, unwashed**, and in original packaging</li>
              <li>• Product tags and authentication elements must be intact</li>
            </ul>
          </motion.div>

          {/* Card 3: Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-bg-surface text-text-primary rounded-[32px] p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
                03 // Transaction & Checkout
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              All transactions are confirmed and cleared via:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#C9A84C]/25 text-text-secondary">
              <li>• Order confirmation and details coordinated directly via **WhatsApp**</li>
              <li>• Secure payment settlement via **UPI or Bank Transfer**</li>
            </ul>
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
                <AlertCircle size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
                04 // Governing Law
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              These terms & conditions are governed by and construed in accordance with the laws of India, and any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of **Hyderabad, Telangana, India**.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
