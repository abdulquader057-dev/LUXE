"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BrainCircuit, Zap, Shield, Cpu, 
  Terminal, Network, RefreshCcw, Activity
} from "lucide-react";
import { AIOrb } from "@/components/ai/AIOrb";

export const AIControlPanel = () => {
  return (
    <div className="glass-panel !rounded-[48px] p-10 border-primary/20 bg-primary/[0.02] relative overflow-hidden h-full flex flex-col gap-10">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[120px] rounded-full" />

      <div className="flex items-start justify-between relative z-10">
         <div>
            <h3 className="text-2xl font-display font-black tracking-tighter text-gradient uppercase mb-2">Neural Orchestrator</h3>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Core</span>
               </div>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Model: ZYRA-X-4.0</span>
            </div>
         </div>
         <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-primary hover:scale-110 transition-transform cursor-pointer">
            <RefreshCcw size={24} />
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 relative z-10">
         <div className="scale-125">
            <AIOrb isProcessing={true} />
         </div>

         <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
               { label: "Stability", value: "99.9%", icon: Shield },
               { label: "Latency", value: "42ms", icon: Zap },
               { label: "Neural Load", value: "12%", icon: Network },
               { label: "Concurrency", value: "1.2k", icon: Cpu },
            ].map((stat, i) => (
               <div key={i} className="glass p-4 rounded-3xl border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                     <stat.icon size={14} className="text-primary/60" />
                     <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="text-xl font-display font-black text-white tracking-tight">{stat.value}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="glass-panel !rounded-[24px] p-6 border-white/5 bg-black/40 relative z-10">
         <div className="flex items-center gap-3 mb-4">
            <Terminal size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Intelligence Insights</span>
         </div>
         <p className="text-xs text-white/40 leading-relaxed italic">
            "Neural patterns suggest a 15% increase in high-end techwear demand for the upcoming node cycle."
         </p>
         <div className="mt-4 flex items-center gap-4">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  className="h-full bg-gradient-to-r from-primary to-accent" 
               />
            </div>
            <span className="text-[10px] font-black text-primary uppercase">85% Confidence</span>
         </div>
      </div>
    </div>
  );
};
