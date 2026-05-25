"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, MoreHorizontal, 
  Eye, Edit, Trash2, ExternalLink,
  ChevronRight, Box, CreditCard, User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManagementHubProps {
  type: "orders" | "products";
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export const ManagementHub = ({ type, data, onAdd, onEdit, onDelete }: ManagementHubProps) => {
  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h3 className="text-3xl font-display font-black tracking-tighter text-gradient uppercase">
               {type === "orders" ? "Commerce Nodes" : "Asset Manifest"}
            </h3>
            <p className="text-xs text-white/40 tracking-widest uppercase mt-1">
               {type === "orders" ? "Realtime transactional data streams" : "High-fidelity product asset management"}
            </p>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors" size={18} />
               <input 
                  type="text" 
                  placeholder={`Search ${type}...`}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all w-80 font-medium"
               />
            </div>
            <button className="glass border-white/10 p-4 rounded-2xl hover:bg-white/5 transition-all text-white/40 hover:text-white">
               <Filter size={20} />
            </button>
            <button 
               onClick={onAdd}
               className="bg-white text-black px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
               Add {type === "orders" ? "Node" : "Asset"}
            </button>
         </div>
      </div>

      {/* Grid View (Replacing Standard Tables) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
         <div className="grid grid-cols-1 gap-4">
            {data.map((item, i) => (
               <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel !rounded-[24px] p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
               >
                  <div className="flex items-center gap-8 relative z-10">
                     {/* Identity Section */}
                     <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-all">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">ID</span>
                        <span className="text-xs font-black text-white uppercase italic">#{item.id.toString().padStart(4, '0')}</span>
                     </div>

                     {/* Details Section */}
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {type === "orders" ? (
                           <>
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <User size={12} className="text-primary/60" />
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Customer Node</span>
                                 </div>
                                 <span className="text-sm font-bold text-white uppercase tracking-tight">{item.customer_name || 'Anonymous User'}</span>
                                 <span className="text-[10px] text-white/40 italic">Linked via Neural Auth</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <CreditCard size={12} className="text-primary/60" />
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Value Transfer</span>
                                 </div>
                                 <span className="text-sm font-black text-white italic tracking-tighter">${item.total_price}</span>
                                 <span className="text-[10px] text-white/40 italic">Transaction Complete</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <Box size={12} className="text-primary/60" />
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Asset Count</span>
                                 </div>
                                 <span className="text-sm font-bold text-white uppercase tracking-tight">{item.items?.length || 1} Objects</span>
                              </div>
                              <div className="flex flex-col justify-center">
                                 <div className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] w-fit italic",
                                    item.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 
                                    item.status === 'processing' ? 'bg-primary/10 text-primary animate-pulse' :
                                    'bg-white/5 text-white/40'
                                 )}>
                                    {item.status}
                                 </div>
                              </div>
                           </>
                        ) : (
                           <>
                              <div className="col-span-2 flex items-center gap-6">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden glass border border-white/10">
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                 </div>
                                 <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Asset Title</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-tight">{item.name}</span>
                                    <span className="text-[10px] text-white/40 italic">Category: {item.category}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <CreditCard size={12} className="text-primary/60" />
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Listed Value</span>
                                 </div>
                                 <span className="text-sm font-black text-white italic tracking-tighter">${item.price}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <Box size={12} className="text-primary/60" />
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Node Availability</span>
                                 </div>
                                 <span className="text-sm font-bold text-white uppercase tracking-tight">{item.stock_quantity} Units</span>
                              </div>
                           </>
                        )}
                     </div>

                     {/* Actions Section */}
                     <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all">
                           <Eye size={16} />
                        </button>
                        <button 
                           onClick={() => onEdit && onEdit(item)}
                           className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/20 transition-all"
                        >
                           <Edit size={16} />
                        </button>
                        <button 
                           onClick={() => onDelete && onDelete(item.id)}
                           className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/20 transition-all"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>

                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </motion.div>
            ))}
         </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-2xl border border-white/10 flex items-center gap-12 bg-black/80 backdrop-blur-3xl z-50 shadow-2xl">
         <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
            <span className="text-white">01</span>
            <span>02</span>
            <span>03</span>
            <span>...</span>
            <span>12</span>
         </div>
         <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:gap-4 transition-all group">
            Next Stream <ChevronRight size={14} />
         </button>
      </div>
    </div>
  );
};
