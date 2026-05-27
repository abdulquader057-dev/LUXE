"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const StatCard = ({ label, value, change, isPositive, icon: Icon, color, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="admin-card glass-panel !rounded-[32px] p-8 relative overflow-hidden group transition-all duration-500"
    >
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }} />
             <Icon size={24} style={{ color }} />
          </div>
          <div className={cn(
             "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
             isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
             {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             {change}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">{label}</h3>
          <div className="flex items-end gap-3">
             <span className="text-4xl font-display font-black tracking-tighter text-white">{value}</span>
             <div className="h-10 w-[1px] bg-white/5 mx-2" />
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Neural Forecast</span>
                <span className="text-[10px] font-bold text-white/40 italic">Optimal</span>
             </div>
          </div>
        </div>

        {/* Small Sparkline Visualization (Mock) */}
        <div className="h-8 flex items-end gap-1">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${Math.random() * 100}%` }}
               transition={{ delay: delay + i * 0.05, duration: 1 }}
               className="flex-1 rounded-full opacity-20"
               style={{ backgroundColor: color }}
             />
           ))}
        </div>
      </div>

      {/* Interactive Background Gradient */}
      <div 
        className="absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};
