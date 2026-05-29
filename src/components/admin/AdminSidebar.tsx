"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Package, 
  Zap, BarChart3, Settings, Cpu, Activity,
  Database, Terminal, BrainCircuit, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "overview", icon: LayoutDashboard, label: "Control Center", color: "#00f2ff" },
  { id: "orders", icon: ShoppingBag, label: "Commerce Nodes", color: "#ff00ff" },
  { id: "products", icon: Package, label: "Asset Manifest", color: "#7000ff" },
  { id: "automation", icon: BrainCircuit, label: "Neural Flows", color: "#00ff9d" },
  { id: "analytics", icon: BarChart3, label: "Intelligence", color: "#ffcc00" },
];

export const AdminSidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="w-[280px] sm:w-80 h-full flex flex-col p-6 gap-8 border-r border-white/5 bg-black/40 backdrop-blur-3xl relative overflow-y-auto no-scrollbar group">
      {/* Background Pulse */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)] animate-pulse-slow" />
      </div>

      {/* Brand / Core Identity */}
      <div className="flex items-center gap-4 px-4 py-6 border-b border-white/5 relative">
        <div className="relative">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent p-[1px] animate-glow">
              <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                 <Cpu size={24} className="text-primary animate-pulse" />
              </div>
           </div>
           <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_#22c55e]" />
        </div>
        <div>
           <h2 className="text-xl font-display font-black tracking-tighter text-gradient uppercase">LUXE OS</h2>
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase">SYSTEM: ONLINE</span>
           </div>
        </div>
      </div>

      {/* Navigation Nodes */}
      <div className="flex-1 space-y-2 relative">
        <div className="text-[9px] font-black tracking-[0.4em] text-white/10 uppercase mb-4 px-4">Navigation Nodes</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500",
              activeTab === item.id 
                ? "glass-panel border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                : "hover:bg-white/[0.03] text-white/40 hover:text-white"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-sidebar"
                className="absolute left-0 w-1 h-8 bg-primary rounded-full shadow-[0_0_15px_#00f2ff]"
              />
            )}
            
            <div className={cn(
               "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
               activeTab === item.id ? "bg-white/5 text-white" : "group-hover:bg-white/5"
            )}>
               <item.icon size={20} style={{ color: activeTab === item.id ? item.color : undefined }} />
            </div>
            
            <div className="flex flex-col items-start">
               <span className={cn(
                 "text-sm font-black tracking-tight transition-all duration-500 uppercase",
                 activeTab === item.id ? "text-white" : "text-white/40"
               )}>
                 {item.label}
               </span>
               <span className="text-[8px] font-medium text-white/10 uppercase tracking-widest mt-0.5">
                  Node v{item.id.length}.0
               </span>
            </div>

            {activeTab === item.id && (
               <div className="ml-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Infrastructure */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-6 relative">
         <div className="px-4">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">Core Load</span>
               <span className="text-[9px] font-black text-primary uppercase">12%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "12%" }}
                 className="h-full bg-primary shadow-[0_0_10px_#00f2ff]" 
               />
            </div>
         </div>

         <div className="flex items-center gap-4 px-4 text-white/20 hover:text-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center group-hover:border-red-500/40 group-hover:text-red-500 transition-all">
               <LogOut size={18} />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">Terminate Session</span>
         </div>
      </div>

      {/* Futuristic Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};
