"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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
  Cpu, Network, X
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Product Modal Forms state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState(549);
  const [formCategory, setFormCategory] = useState("streetwear");
  const [formStock, setFormStock] = useState(100);
  const [formSizes, setFormSizes] = useState("M, L, XL, XXL");
  const [formColors, setFormColors] = useState("White, Sky Blue, Pink");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("/brand/linen_model_front.png");
  const [formOffer, setFormOffer] = useState("Buy One Get One Free");
  const [formIsTrending, setFormIsTrending] = useState(false);

  // Security Check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      if (user) router.push("/profile");
      else router.push("/auth");
    }
  }, [authLoading, isAdmin, user, router]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;

      // 1. Initial load from local storage
      const localCat = localStorage.getItem("luxe-catalog");
      if (localCat) {
        try {
          setProducts(JSON.parse(localCat));
        } catch (e) {
          setProducts(MOCK_PRODUCTS);
        }
      } else {
        setProducts(MOCK_PRODUCTS);
        localStorage.setItem("luxe-catalog", JSON.stringify(MOCK_PRODUCTS));
      }

      try {
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }),
          supabase.from('products').select('*').order('created_at', { ascending: false })
        ]);
        
        // Format orders for UI
        if (ordersRes.data) {
          const formattedOrders = ordersRes.data.map(o => ({
            ...o,
            customer_name: o.profiles?.full_name || 'Unknown'
          }));
          setOrders(formattedOrders);
        }
        
        if (productsRes.data && productsRes.data.length > 0) {
          const hasLinen = productsRes.data.some(p => p.name.toLowerCase().includes("linen"));
          if (hasLinen) {
            setProducts(productsRes.data);
            localStorage.setItem("luxe-catalog", JSON.stringify(productsRes.data));
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleDelete = async (id: string, type: 'orders' | 'products') => {
    if (confirm(`Are you sure you want to delete this ${type === 'orders' ? 'order' : 'product'}?`)) {
      try {
        const { error } = await supabase.from(type).delete().eq('id', id);
        if (error) throw error;
        
        if (type === 'orders') setOrders(orders.filter(o => o.id !== id));
        else {
          const updatedProds = products.filter(p => p.id !== id);
          setProducts(updatedProds);
          localStorage.setItem("luxe-catalog", JSON.stringify(updatedProds));
          toast.success("Product deleted successfully.");
        }
      } catch (err: any) {
        console.warn("Supabase delete failed, using local fallback:", err.message);
        if (type === 'products') {
          const updatedProds = products.filter(p => p.id !== id);
          setProducts(updatedProds);
          localStorage.setItem("luxe-catalog", JSON.stringify(updatedProds));
          toast.success("Product deleted from local cache.");
        }
      }
    }
  };

  const handleAdd = (type: 'orders' | 'products') => {
    if (type === 'products') {
      setEditingProduct(null);
      setFormName("");
      setFormPrice(549);
      setFormCategory("streetwear");
      setFormStock(100);
      setFormSizes("M, L, XL, XXL");
      setFormColors("White, Sky Blue, Pink, Olive Green, Tan Beige, Cocoa Brown, Navy Blue, Carbon Black");
      setFormDescription("");
      setFormImageUrl("/brand/linen_model_front.png");
      setFormOffer("Buy One Get One Free");
      setFormIsTrending(false);
      setShowProductModal(true);
    } else {
      alert("Order node creation is automated via the checkout terminal.");
    }
  };

  const handleEdit = (item: any) => {
    setEditingProduct(item);
    setFormName(item.name || "");
    setFormPrice(item.price || 0);
    setFormCategory(item.category || "streetwear");
    const itemStock = item.stock !== undefined ? item.stock : (item.stock_quantity !== undefined ? item.stock_quantity : 100);
    setFormStock(itemStock);
    setFormSizes(Array.isArray(item.sizes) ? item.sizes.join(", ") : "M, L, XL, XXL");
    setFormColors(Array.isArray(item.colors) ? item.colors.join(", ") : "White, Sky Blue, Pink");
    setFormDescription(item.description || "");
    const imgUrl = item.image_url || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "") || "/brand/linen_model_front.png";
    setFormImageUrl(imgUrl);
    setFormOffer(item.offer || "");
    setFormIsTrending(!!item.isTrending);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sizesArr = formSizes.split(",").map(s => s.trim()).filter(Boolean);
    const colorsArr = formColors.split(",").map(c => c.trim()).filter(Boolean);

    const productData = {
      id: editingProduct ? editingProduct.id : `luxe-${formCategory.toLowerCase()}-${Date.now()}`,
      name: formName,
      description: formDescription,
      price: Number(formPrice),
      currency: "INR",
      category: formCategory,
      images: [formImageUrl],
      image_url: formImageUrl,
      stock: Number(formStock),
      stock_quantity: Number(formStock),
      isTrending: formIsTrending,
      sizes: sizesArr,
      colors: colorsArr,
      offer: formOffer,
      ratings: editingProduct?.ratings || 4.8,
      reviewsCount: editingProduct?.reviewsCount || 1,
      discount: editingProduct?.discount || 0
    };

    let updatedProducts = [...products];

    // Try to sync to Supabase (non-blocking)
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formName,
            description: formDescription,
            price: Number(formPrice),
            category: formCategory,
            image_url: formImageUrl,
            stock_quantity: Number(formStock),
            offer: formOffer
          })
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            id: productData.id,
            name: formName,
            description: formDescription,
            price: Number(formPrice),
            category: formCategory,
            image_url: formImageUrl,
            stock_quantity: Number(formStock),
            offer: formOffer
          }]);
          
        if (error) throw error;
      }
    } catch (dbErr: any) {
      console.warn("Supabase CRUD sync failed, updating local state only:", dbErr.message);
    }

    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      toast.success("Product updated in local registry.");
    } else {
      updatedProducts = [productData, ...products];
      toast.success("New product initialized in local registry.");
    }

    setProducts(updatedProducts);
    localStorage.setItem("luxe-catalog", JSON.stringify(updatedProducts));
    setShowProductModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  if (authLoading || (!isAdmin && !authLoading)) {
    return <div className="min-h-screen bg-black" />; // Hidden while checking
  }

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
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-20">
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

           <div className="flex items-center gap-10">
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
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 relative">
           
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
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-2">Control Center</h2>
                        <p className="text-sm text-white/40 tracking-widest uppercase italic">Executive Neural Overview</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="glass border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all">
                           <Terminal size={14} /> CLI Access
                        </button>
                        <button className="bg-primary text-black px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">
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
                  <ManagementHub 
                    type="orders" 
                    data={orders} 
                    onAdd={() => handleAdd('orders')}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id, 'orders')}
                  />
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
                  <ManagementHub 
                    type="products" 
                    data={products} 
                    onAdd={() => handleAdd('products')}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id, 'products')}
                  />
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

         {/* Product Management CRUD Modal */}
         <AnimatePresence>
           {showProductModal && (
             <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowProductModal(false)}
                 className="fixed inset-0 bg-black/85 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0, y: 30 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 30 }}
                 className="relative w-full max-w-xl bg-[#08080c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] text-left"
               >
                 <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff]/50 to-transparent" />
                 <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                   <div>
                     <h3 className="text-lg font-display italic text-white">{editingProduct ? "Modify Product Asset" : "Initialize New Asset"}</h3>
                     <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Luxe OS Asset Manifest</p>
                   </div>
                   <button 
                     onClick={() => setShowProductModal(false)}
                     className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
                   >
                     <X size={18} />
                   </button>
                 </div>

                 <form onSubmit={handleSaveProduct} className="p-8 space-y-4 overflow-y-auto max-h-[65vh] custom-scrollbar">
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Product Name</label>
                     <input
                       type="text"
                       required
                       value={formName}
                       onChange={(e) => setFormName(e.target.value)}
                       placeholder="E.g., Luxe Linen Shirt - Sky Blue"
                       className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Price (INR)</label>
                       <input
                         type="number"
                         required
                         value={formPrice}
                         onChange={(e) => setFormPrice(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Stock Units</label>
                       <input
                         type="number"
                         required
                         value={formStock}
                         onChange={(e) => setFormStock(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Category</label>
                       <select
                         value={formCategory}
                         onChange={(e) => setFormCategory(e.target.value)}
                         className="w-full bg-white/[0.02] border border-white/10 border-white/20 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all uppercase bg-[#08080c]"
                       >
                         <option value="streetwear">Streetwear</option>
                         <option value="accessories">Accessories</option>
                         <option value="outerwear">Outerwear</option>
                         <option value="formal">Formal</option>
                       </select>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Offer Text</label>
                       <input
                         type="text"
                         value={formOffer}
                         onChange={(e) => setFormOffer(e.target.value)}
                         placeholder="E.g., Buy One Get One Free"
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                       />
                     </div>
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Image URL / Path</label>
                     <input
                       type="text"
                       required
                       value={formImageUrl}
                       onChange={(e) => setFormImageUrl(e.target.value)}
                       placeholder="/brand/linen_model_front.png"
                       className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Sizes (Comma separated)</label>
                       <input
                         type="text"
                         value={formSizes}
                         onChange={(e) => setFormSizes(e.target.value)}
                         placeholder="M, L, XL, XXL"
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all uppercase"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Colors (Comma separated)</label>
                       <input
                         type="text"
                         value={formColors}
                         onChange={(e) => setFormColors(e.target.value)}
                         placeholder="White, Sky Blue, Pink"
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all"
                       />
                     </div>
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Description</label>
                     <textarea
                       rows={3}
                       value={formDescription}
                       onChange={(e) => setFormDescription(e.target.value)}
                       placeholder="Enter garment styling specifics..."
                       className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-[#00f2ff]/40 text-white placeholder:text-white/20 transition-all resize-none"
                     />
                   </div>

                   <div className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                     <input
                       type="checkbox"
                       checked={formIsTrending}
                       onChange={(e) => setFormIsTrending(e.target.checked)}
                       id="is-trending-checkbox"
                       className="w-4 h-4 accent-primary rounded cursor-pointer"
                     />
                     <label htmlFor="is-trending-checkbox" className="text-[10px] font-mono text-white/50 uppercase tracking-widest cursor-pointer select-none">
                       Feature on Storefront Trending Drop
                     </label>
                   </div>

                   <div className="pt-4 flex gap-4">
                     <button
                       type="button"
                       onClick={() => setShowProductModal(false)}
                       className="flex-1 py-3.5 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors cursor-pointer text-center text-white"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="flex-1 py-3.5 bg-white text-black rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors cursor-pointer text-center"
                     >
                       {editingProduct ? "Update Asset" : "Initialize Asset"}
                     </button>
                   </div>
                 </form>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

        {/* Global OS Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
           <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full opacity-30" />
        </div>
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
      </main>
    </div>
  );
}
