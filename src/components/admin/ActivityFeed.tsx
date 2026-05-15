"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Zap, BrainCircuit, Activity, 
  ChevronRight, AlertCircle, CheckCircle2, 
  Cpu, Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { id: 1, type: "order", label: "New Node Sync", desc: "Order #ZY-9402 successfully synthesized", time: "2m ago", status: "success", icon: ShoppingBag },
  { id: 2, type: "ai", label: "Neural Update", desc: "Trend prediction model updated to v4.2.1", time: "15m ago", status: "info", icon: BrainCircuit },
  { id: 3, type: "system", label: "System Alert", desc: "Inventory node DXB-01 low on techwear assets", time: "1h ago", status: "warning", icon: AlertCircle },
  { id: 4, type: "automation", label: "Flow Triggered", desc: "Welcome sequence executed for 12 new users", time: "3h ago", status: "success", icon: Zap },
  { id: 5, type: "system", label: "Sync Complete", desc: "Database nodes synchronized with global mesh", time: "5h ago", status: "success", icon: Database },
];

export const ActivityFeed = () => {
  return (
    <div className="glass-panel !rounded-[40px] border-white/5 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl glass border border-primary/20 flex items-center justify-center text-primary">
               <Activity size={20} className="animate-pulse" />
            </div>
            <div>
               <h3 className="text-sm font-black tracking-widest uppercase">Operational Feed</h3>
               <p className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase">Realtime Neural Logs</p>
            </div>
         </div>
         <button className="text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.4em]">Clear Logs</button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {activities.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex gap-6 p-6 rounded-[24px] glass border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer"
          >
            <div className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500",
               item.status === "success" ? "bg-green-500/10 text-green-500" :
               item.status === "warning" ? "bg-orange-500/10 text-orange-500" :
               "bg-primary/10 text-primary"
            )}>
               <item.icon size={20} />
            </div>

            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-black tracking-tight group-hover:text-primary transition-colors uppercase">{item.label}</h4>
                  <span className="text-[9px] font-black text-white/10 uppercase">{item.time}</span>
               </div>
               <p className="text-xs text-white/40 leading-relaxed italic line-clamp-1">"{item.desc}"</p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight size={16} className="text-white/20" />
            </div>
            
            {/* Left Indicator */}
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 rounded-full",
              item.status === "success" ? "bg-green-500" :
              item.status === "warning" ? "bg-orange-500" :
              "bg-primary"
            )} />
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-white/[0.02] border-t border-white/5 text-center">
         <button className="text-[10px] font-black tracking-[0.5em] text-white/20 hover:text-white transition-colors uppercase">View All Protocol Logs</button>
      </div>
    </div>
  );
};
