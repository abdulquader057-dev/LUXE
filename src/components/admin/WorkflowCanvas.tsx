"use client";

import React, { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { 
  Zap, BrainCircuit, MessageSquare, 
  Database, Bell, Play, Plus, 
  Settings2, Trash2, GitFork, 
  ArrowRight, Search, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  type: "trigger" | "action" | "ai" | "condition";
  label: string;
  desc: string;
  icon: any;
  color: string;
}

const initialNodes: Node[] = [
  { id: "1", type: "trigger", label: "New Order Node", desc: "Triggers on new checkout", icon: ShoppingCart, color: "#C9A962" },
  { id: "2", type: "ai", label: "Style Analysis", desc: "Deep neural style matching", icon: BrainCircuit, color: "#ff00ff" },
  { id: "3", type: "action", label: "Personalized SMS", desc: "AI-generated luxury invite", icon: MessageSquare, color: "#00ff9d" },
  { id: "4", type: "condition", label: "VIP Threshold", desc: "Check customer loyalty score", icon: GitFork, color: "#ffcc00" },
];

import { ShoppingCart } from "lucide-react";

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-2xl font-display font-black tracking-tighter text-gradient uppercase">Neural Flows</h3>
            <p className="text-xs text-white/40 tracking-widest uppercase">Orchestrate your commerce intelligence</p>
         </div>
         <div className="flex gap-4">
            <button className="glass border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black tracking-widest uppercase hover:bg-white/5 transition-all">
               <Plus size={16} /> Add Node
            </button>
            <button className="bg-primary px-8 py-3 rounded-2xl flex items-center gap-3 text-xs font-black tracking-widest uppercase text-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(201, 169, 98,0.3)]">
               <Play size={16} fill="black" /> Deploy Flow
            </button>
         </div>
      </div>

      <div className="flex-1 glass-panel !rounded-[48px] border-white/5 bg-black/40 relative overflow-hidden flex">
         {/* Canvas Grid Background */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
         
         {/* Side Toolbar */}
         <div className="w-20 border-r border-white/5 flex flex-col items-center py-10 gap-8 relative z-10 bg-black/20">
            {[Search, Filter, Settings2, Database].map((Icon, i) => (
               <div key={i} className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                  <Icon size={20} />
               </div>
            ))}
         </div>

         {/* Nodes Container */}
         <div className="flex-1 p-12 relative overflow-auto no-scrollbar">
            <div className="flex flex-col items-center gap-16 min-w-[800px]">
               {nodes.map((node, i) => (
                  <React.Fragment key={node.id}>
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-[320px] glass-panel !rounded-[32px] p-6 border-white/10 relative group cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                     >
                        <div className="flex items-center gap-5 mb-4">
                           <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ color: node.color }}>
                              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: node.color }} />
                              <node.icon size={22} />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">{node.type}</h4>
                              <h3 className="text-sm font-black text-white uppercase tracking-tight">{node.label}</h3>
                           </div>
                           <button className="text-white/10 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                           </button>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic mb-6">"{node.desc}"</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Active State</span>
                           </div>
                           <div className="text-[8px] font-black text-primary uppercase tracking-widest">v1.2</div>
                        </div>

                        {/* Connection Port */}
                        {i < nodes.length - 1 && (
                           <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 h-16 w-[2px] bg-gradient-to-b from-primary/40 to-transparent flex flex-col items-center justify-end pb-2">
                              <motion.div 
                                 animate={{ y: [0, 10, 0] }}
                                 transition={{ repeat: Infinity, duration: 2 }}
                              >
                                 <ArrowRight size={14} className="text-primary rotate-90" />
                              </motion.div>
                           </div>
                        )}
                     </motion.div>
                  </React.Fragment>
               ))}

               <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full glass border border-dashed border-white/20 flex items-center justify-center text-white/20 hover:border-primary hover:text-primary transition-all shadow-xl"
               >
                  <Plus size={24} />
               </motion.button>
            </div>
         </div>

         {/* Execution Inspector */}
         <div className="w-80 border-l border-white/5 p-8 flex flex-col gap-8 relative z-10 bg-black/20">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Node Inspector</h4>
            <div className="space-y-6">
               <div className="glass p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-4">Selected Instance</span>
                  <div className="flex items-center gap-3 mb-4">
                     <BrainCircuit size={18} className="text-accent" />
                     <span className="text-sm font-bold text-white uppercase tracking-tighter">Style Analysis</span>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                        <span className="text-[9px] text-white/30 uppercase">Latency</span>
                        <span className="text-[9px] text-white/60 uppercase">12ms</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-[9px] text-white/30 uppercase">Tokens</span>
                        <span className="text-[9px] text-white/60 uppercase">240</span>
                     </div>
                  </div>
               </div>

               <div className="glass p-6 rounded-3xl border border-white/5">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-4">Execution Log</span>
                  <div className="space-y-4">
                     {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-3 text-[10px]">
                           <div className="w-1 h-4 bg-green-500/40 rounded-full mt-1" />
                           <div className="flex-1">
                              <p className="text-white/60 italic leading-none mb-1">Pass [ZY-9402]</p>
                              <p className="text-white/20 font-mono">14:24:09.432</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
