"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, RotateCcw, Award, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
            Terms &<br />
            <span className="text-[#F5E6C8] italic font-light font-cormorant tracking-normal text-3xl md:text-6xl lowercase">conditions.</span>
          </h1>
          <p className="text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-[0.3em] mt-4">
            Service rules. System parameters. User responsibilities.
          </p>
        </motion.div>

        {/* Content Cards */}
        <div className="space-y-12">
          {/* Card 1: Logistics & Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                01 // Logistics Parameter
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              LUXE currently operates exclusively within the boundary coordinates of **Hyderabad, India**. 
            </p>
            <p className="text-sm font-medium leading-relaxed">
              Orders placed with delivery coordinates outside our operational zone will be systematically cancelled by the control system.
            </p>
          </motion.div>

          {/* Card 2: Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                02 // Payment Protocols
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              We support two transaction methods for order node finalization:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#1C1410]/20 mb-4">
              <li>• Cash on Delivery (COD)</li>
              <li>• Instant Unified Payments Interface (UPI)</li>
            </ul>
            <p className="text-sm font-medium leading-relaxed">
              UPI payments must clear verification on the network before orders enter the transit/dispatch state.
            </p>
          </motion.div>

          {/* Card 3: Returns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <RotateCcw size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                03 // Return Policy
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              LUXE offers a seamless **7-day return framework**. If a garment does not fit your style silhouette, returns can be initiated from your dashboard node.
            </p>
            <p className="text-sm font-medium leading-relaxed">
              Items must be in pristine, unworn condition with all fabric authentication tags attached.
            </p>
          </motion.div>

          {/* Card 4: Loyalty Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <Award size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                04 // Loyalty Calibration
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              XP rewards, level gains, and tier unlocks (Bronze, Silver, Gold) are awarded dynamically based on purchase volume and style alignment.
            </p>
            <p className="text-sm font-medium leading-relaxed">
              Gold loyalty status unlocks exclusive themes, gold profile badges, and an automatic 15% discount. Abuse or manipulation of style metrics will result in level reversion.
            </p>
          </motion.div>

          {/* Card 5: User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-[#F5E6C8] text-[#1C1410] rounded-[32px] p-8 md:p-12 border border-[#D4AF37]/40 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1C1410]/10 flex items-center justify-center text-[#1C1410]">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-[#1C1410]">
                05 // User Responsibility
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-4">
              As a user of the LUXE network, you agree to:
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-wider pl-4 border-l border-[#1C1410]/20">
              <li>• Provide valid coordinates & authentic phone numbers</li>
              <li>• Honor Cash on Delivery (COD) commitments</li>
              <li>• Keep login telemetry and access tokens secure</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
