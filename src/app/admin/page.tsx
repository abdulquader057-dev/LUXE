"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  MessageCircle, 
  TrendingUp, 
  Plus, 
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/data/products";
import Image from "next/image";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    { label: "Total Revenue", value: "₹2,84,500", change: "+12.5%", trending: "up" },
    { label: "Orders", value: "142", change: "+8.2%", trending: "up" },
    { label: "Customers", value: "892", change: "-2.4%", trending: "down" },
    { label: "Conversion Rate", value: "3.2%", change: "+1.1%", trending: "up" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 hidden lg:flex">
        <div className="text-xl font-black tracking-tighter mb-12">
          ZYVORA<span className="text-primary">.</span> ADMIN
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "products", icon: Package, label: "Products" },
            { id: "orders", icon: ShoppingBag, label: "Orders" },
            { id: "customers", icon: Users, label: "Customers" },
            { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
            { id: "analytics", icon: TrendingUp, label: "Analytics" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-primary text-black" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors text-sm font-bold">
          <Settings size={18} /> Settings
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#080808]">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Admin Control</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Project Lead</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview
                </h1>
                <p className="text-xs text-white/40 font-medium tracking-wide">Monday, 12 May 2026</p>
              </div>
              <button className="px-6 py-3 bg-white text-black rounded-xl text-xs font-black tracking-tight hover:bg-primary transition-colors flex items-center gap-2">
                <Plus size={16} /> ADD PRODUCT
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass-morphism p-6 rounded-3xl border-white/5">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-4">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                      stat.trending === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {stat.trending === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Product Table */}
              <div className="xl:col-span-2 glass-morphism rounded-[2.5rem] overflow-hidden border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold tracking-tight">Recent Products</h3>
                  <button className="text-[10px] font-bold tracking-widest text-primary uppercase">View Inventory</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-white/5">
                        <th className="p-6 text-[10px] font-bold tracking-widest text-white/30 uppercase">Product</th>
                        <th className="p-6 text-[10px] font-bold tracking-widest text-white/30 uppercase">Category</th>
                        <th className="p-6 text-[10px] font-bold tracking-widest text-white/30 uppercase">Price</th>
                        <th className="p-6 text-[10px] font-bold tracking-widest text-white/30 uppercase">Stock</th>
                        <th className="p-6 text-[10px] font-bold tracking-widest text-white/30 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MOCK_PRODUCTS.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-muted">
                                <Image src={p.images[0]} alt="" fill className="object-cover" />
                              </div>
                              <p className="text-sm font-bold">{p.name}</p>
                            </div>
                          </td>
                          <td className="p-6 text-xs text-white/40 uppercase font-bold tracking-tighter">
                            {p.category.replace("-", " ")}
                          </td>
                          <td className="p-6 text-sm font-black tracking-tighter">₹{p.price.toLocaleString()}</td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full", p.stock < 50 ? "bg-red-500" : "bg-primary")} 
                                  style={{ width: `${(p.stock / 100) * 100}%` }} 
                                />
                              </div>
                              <span className="text-[10px] font-bold">{p.stock}</span>
                            </div>
                          </td>
                          <td className="p-6 text-white/20 hover:text-white cursor-pointer">
                            <MoreVertical size={18} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                {/* Orders Feed */}
                <div className="glass-morphism rounded-[2.5rem] p-6 border-white/5">
                  <h3 className="font-bold tracking-tight mb-6">Recent Orders</h3>
                  <div className="space-y-6">
                    {[
                      { user: "Aryan S.", item: "Cyber-Modest Tech Kaftan", time: "2 min ago", status: "Paid" },
                      { user: "Imran K.", item: "Neon-Pulse Sneakers X1", time: "15 min ago", status: "COD" },
                      { user: "Sarah M.", item: "Vortex Chrono Watch", time: "1 hour ago", status: "Paid" },
                    ].map((order, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <ShoppingBag size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{order.user}</p>
                          <p className="text-[10px] text-white/40 truncate">{order.item}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-white/30">{order.time}</p>
                          <p className="text-[10px] font-black tracking-widest text-primary uppercase">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-3 glass border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:border-white/20 transition-all">
                    VIEW ALL ORDERS
                  </button>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2.5rem] p-8 border border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight uppercase mb-2">AI INSIGHT</h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    "Neon-Pulse Sneakers" are trending in New Delhi. I recommend increasing stock by 20% and launching a WhatsApp blast.
                  </p>
                  <button className="w-full py-4 bg-white text-black rounded-xl text-xs font-black tracking-tight hover:bg-primary transition-colors flex items-center justify-center gap-2">
                    TAKE ACTION <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
