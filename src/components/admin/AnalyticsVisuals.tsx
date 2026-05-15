"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, 
  Target, Zap, MousePointer2, 
  ArrowUpRight, Globe, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AnalyticsVisuals = () => {
  return (
    <div className="space-y-8">
      {/* Top Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="glass-panel !rounded-[40px] p-10 border-white/5 relative overflow-hidden group col-span-2">
            <div className="absolute top-0 right-0 p-8">
               <div className="flex items-center gap-2 px-4 py-2 glass border border-primary/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Realtime Traffic Hub</span>
               </div>
            </div>
            
            <div className="relative z-10">
               <h3 className="text-sm font-black text-white/20 uppercase tracking-[0.4em] mb-2">Revenue Growth Engine</h3>
               <div className="flex items-end gap-6 mb-12">
                  <span className="text-6xl font-display font-black tracking-tighter text-white">$142,502</span>
                  <div className="flex items-center gap-2 text-green-500 font-bold mb-3">
                     <ArrowUpRight size={20} />
                     <span className="text-xl">+24.5%</span>
                  </div>
               </div>

               {/* Mock Multi-layer Wave Chart */}
               <div className="h-64 w-full relative flex items-end gap-[2px]">
                  {[...Array(40)].map((_, i) => (
                     <div key={i} className="flex-1 flex flex-col gap-1 items-center group/bar">
                        <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${20 + Math.random() * 80}%` }}
                           transition={{ delay: i * 0.02, duration: 1.5, ease: "circOut" }}
                           className="w-full bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-lg group-hover/bar:from-primary/40 group-hover/bar:to-primary transition-all duration-300"
                        />
                        <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${10 + Math.random() * 40}%` }}
                           transition={{ delay: i * 0.02 + 0.5, duration: 1.5, ease: "circOut" }}
                           className="w-full bg-white/5 rounded-b-lg group-hover/bar:bg-white/10 transition-all"
                        />
                     </div>
                  ))}
                  {/* Floating Tooltip Mock */}
                  <div className="absolute top-1/4 left-3/4 glass border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-3xl animate-float pointer-events-none">
                     <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Peak Cycle</span>
                     <span className="text-lg font-black text-white tracking-tighter">$8,420.00</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-panel !rounded-[40px] p-10 border-white/5 bg-accent/[0.02] flex flex-col justify-between">
            <div>
               <h3 className="text-sm font-black text-white/20 uppercase tracking-[0.4em] mb-8">Neural Conversion</h3>
               <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative">
                     <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                        <motion.circle 
                           cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                           strokeDasharray={552}
                           initial={{ strokeDashoffset: 552 }}
                           animate={{ strokeDashoffset: 552 * (1 - 0.68) }}
                           transition={{ duration: 2, ease: "circOut" }}
                           strokeLinecap="round"
                           className="text-accent shadow-[0_0_20px_rgba(255,0,255,0.5)]" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-display font-black text-white">68%</span>
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest">Optimized</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Inventory Health</span>
                  <span className="text-[10px] font-black text-white uppercase italic">Critical [12%]</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "88%" }}
                     className="h-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                  />
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
            { label: "Active Nodes", value: "1,204", icon: Globe, color: "#00f2ff" },
            { label: "Interaction Depth", value: "8.4m", icon: MousePointer2, color: "#ff00ff" },
            { label: "Neural Matches", value: "92%", icon: Target, color: "#00ff9d" },
            { label: "Processing Power", value: "4.2 tflops", icon: Layers, color: "#ffcc00" },
         ].map((item, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 + i * 0.1 }}
               className="glass-panel !rounded-[32px] p-8 border-white/5 flex flex-col gap-6 group hover:border-white/20 transition-all"
            >
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center glass border border-white/5 text-white/20 group-hover:text-white transition-all">
                  <item.icon size={20} style={{ color: item.color }} />
               </div>
               <div>
                  <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">{item.label}</h4>
                  <span className="text-2xl font-display font-black text-white tracking-tighter italic">{item.value}</span>
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
};
