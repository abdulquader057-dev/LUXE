"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AdminSidebar 
} from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { AIControlPanel } from "@/components/admin/AIControlPanel";
import { WorkflowCanvas } from "@/components/admin/WorkflowCanvas";
import { AnalyticsVisuals } from "@/components/admin/AnalyticsVisuals";
import { ManagementHub } from "@/components/admin/ManagementHub";
import { 
  ShoppingBag, Users, Zap, 
  BarChart3, BrainCircuit, Activity,
  Database, ShieldCheck, Terminal,
  Cpu, Network
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  // Mock Data (Preserving structural logic while upgrading visuals)
  const orders = [
    { id: 1, customer_name: "CYBER_NOMAD", total_price: 1240.00, status: "processing", items: [{}, {}] },
    { id: 2, customer_name: "NEURAL_ENTITY", total_price: 850.00, status: "delivered", items: [{}] },
    { id: 3, customer_name: "TECH_PRIEST", total_price: 2100.50, status: "shipped", items: [{}, {}, {}] },
  ];

  const products = [
    { id: 1, name: "Neural Overlay V1", price: 450, stock_quantity: 12, category: "Headwear", image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop" },
    { id: 2, name: "Kinetic Exo-Shell", price: 1200, stock_quantity: 5, category: "Outerwear", image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=200&fit=crop" },
    { id: 3, name: "Data-Stream Joggers", price: 280, stock_quantity: 45, category: "Bottoms", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop" },
  ];

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
         <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
         >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/40 flex items-center justify-center relative overflow-hidden">
               <Cpu size={40} className="text-primary animate-pulse" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-3xl"
               />
            </div>
            <div className="flex flex-col items-center">
               <h1 className="text-2xl font-display font-black tracking-[0.5em] text-gradient uppercase">LUXE OS</h1>
               <p className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase mt-2">Initializing Neural Infrastructure...</p>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-primary shadow-[0_0_15px_#00f2ff]" 
               />
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans selection:bg-primary selection:text-black">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Operating Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top OS Bar */}
        <header className="h-16 md:h-20 border-b border-white/5 px-4 md:px-10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-20">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                 <span className="text-[10px] font-black tracking-widest uppercase text-white/40">Neural Link: Stable</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-3">
                 <Database size={14} className="text-primary/60" />
                 <span className="text-[10px] font-black tracking-widest uppercase text-white/40">DB_SHADAB_MESH_01</span>
              </div>
           </div>

           <div className="flex items-center gap-4 md:gap-10">
              <div className="flex flex-col items-end">
                 <span className="text-xl font-display font-black tracking-tighter text-white">
                    {currentTime.toLocaleTimeString([], { hour12: false })}
                 </span>
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                 </span>
              </div>
              <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center hover:border-primary/40 transition-all cursor-pointer group">
                 <ShieldCheck size={20} className="group-hover:text-primary transition-colors" />
              </div>
           </div>
        </header>

        {/* Dynamic Content Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-10 relative">
           
           <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Top Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                     <div>
                        <h2 className="text-2xl md:text-4xl font-display font-black tracking-tighter uppercase mb-1 md:mb-2">Control Center</h2>
                        <p className="text-xs md:text-sm text-white/40 tracking-widest uppercase italic">Executive Neural Overview</p>
                     </div>
                     <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none glass border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all">
                           <Terminal size={14} /> CLI Access
                        </button>
                        <button className="flex-1 md:flex-none bg-primary text-black px-4 py-2 md:px-6 md:py-3 rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">
                           <Zap size={14} fill="black" /> Turbo Sync
                        </button>
                     </div>
                  </div>

                  {/* Core Statistics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <StatCard label="Total Revenue" value="$12,402" change="+12.5%" isPositive={true} icon={ShoppingBag} color="#00f2ff" delay={0.1} />
                     <StatCard label="Active Sessions" value="842" change="+5.2%" isPositive={true} icon={Users} color="#ff00ff" delay={0.2} />
                     <StatCard label="Neural Matches" value="94%" change="+2.1%" isPositive={true} icon={BrainCircuit} color="#00ff9d" delay={0.3} />
                     <StatCard label="Automation Load" value="12%" change="-1.5%" isPositive={false} icon={Activity} color="#ffcc00" delay={0.4} />
                  </div>

                  {/* Operational Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                     <div className="lg:col-span-2 space-y-10">
                        <div className="h-[500px]">
                           <AIControlPanel />
                        </div>
                        <div className="h-[400px]">
                           <AnalyticsVisuals />
                        </div>
                     </div>
                     <div className="h-full min-h-[600px]">
                        <ActivityFeed />
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full"
                >
                  <ManagementHub type="orders" data={orders} />
                </motion.div>
              )}

              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full"
                >
                  <ManagementHub type="products" data={products} />
                </motion.div>
              )}

              {activeTab === "automation" && (
                <motion.div
                  key="automation"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="h-full"
                >
                  <WorkflowCanvas />
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="space-y-10"
                >
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-2">Neural Intelligence</h2>
                        <p className="text-sm text-white/40 tracking-widest uppercase italic">Deep-dive behavioral forecasting</p>
                     </div>
                  </div>
                  <AnalyticsVisuals />
                </motion.div>
              )}
           </AnimatePresence>

        </div>

        {/* Global OS Accents - Optimized for mobile performance */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
           <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full opacity-30 bg-[radial-gradient(circle_at_center,_rgba(0,229,204,0.3),_transparent_70%)]" />
        </div>
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
      </main>
    </div>
  );
}
