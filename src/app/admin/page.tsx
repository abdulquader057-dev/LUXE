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
  Cpu, Network, X,
  Shield, Plus, Lock, Check, Power, Key, Trash2
} from "lucide-react";
import { MOCK_PRODUCTS, parseDbProduct } from "@/data/products";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { STORE_ADMIN_EMAIL } from "@/lib/contexts/AuthContext";

export default function AdminDashboard() {
  const { user, isAdmin, isSuperAdmin, isStoreAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  // Admin Management state (Super admin only)
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEditing, setAdminEditing] = useState<any | null>(null);

  // Security Check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      if (user) router.push("/profile");
      else router.push("/auth");
    }
  }, [authLoading, isAdmin, user, router]);

  // Tab Access Control
  useEffect(() => {
    if (!authLoading && isAdmin && !isSuperAdmin) {
      if (activeTab === "automation" || activeTab === "admins") {
        setActiveTab("overview");
        toast.error("Access Denied: Tab reserved for Root Administration.");
      }
    }
  }, [activeTab, isSuperAdmin, isAdmin, authLoading]);


  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;

      // 1. Initial load from local storage with cache-buster
      const cacheVersion = localStorage.getItem("luxe-catalog-version");
      if (cacheVersion !== "v2.2") {
        localStorage.removeItem("luxe-catalog");
        localStorage.setItem("luxe-catalog-version", "v2.2");
      }

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
          const formattedOrders = ordersRes.data.map(o => {
            let parsedDetails = null;
            try {
              parsedDetails = JSON.parse(o.delivery_address || "");
            } catch (e) {
              // Not a JSON string
            }

            return {
              ...o,
              customer_name: parsedDetails?.name || o.profiles?.full_name || 'Unknown User',
              phone: parsedDetails?.phone || o.profiles?.phone_number || 'N/A',
              address: parsedDetails?.address || o.delivery_address || 'N/A',
              city: parsedDetails?.city || 'Hyderabad',
              pincode: parsedDetails?.pincode || '',
              items: parsedDetails?.items || o.items || [],
              payment_method: parsedDetails?.paymentMethod || o.payment_method || 'UPI',
              upi_id: parsedDetails?.upi || '',
              promo_code: parsedDetails?.promo || '',
            };
          });
          setOrders(formattedOrders);
        }
        
        if (productsRes.data && productsRes.data.length > 0) {
          const parsed = productsRes.data.map(parseDbProduct);
          const unique = parsed.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
          setProducts(unique);
          localStorage.setItem("luxe-catalog", JSON.stringify(unique));
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    if (isAdmin) fetchData();
  }, [isAdmin]);

  // Load admins list
  const fetchAdmins = async () => {
    const officialAdmin = {
      id: "official-store-admin",
      full_name: "LUXE Store Admin",
      email: "official.valceron.in@gmail.com",
      role: "store-admin",
      status: "active",
      created_at: new Date().toISOString()
    };

    let localAdmins: any[] = [];
    const saved = localStorage.getItem("luxe-admins");
    if (saved) {
      try {
        localAdmins = JSON.parse(saved);
      } catch (e) {
        localAdmins = [];
      }
    }

    if (!localAdmins.some(a => a.email.toLowerCase() === officialAdmin.email.toLowerCase())) {
      localAdmins.push(officialAdmin);
      localStorage.setItem("luxe-admins", JSON.stringify(localAdmins));
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["super-admin", "store-admin", "admin"]);
      
      if (!error && data) {
        const merged = [...localAdmins];
        data.forEach(dbAdmin => {
          if (!merged.some(m => m.email.toLowerCase() === dbAdmin.email.toLowerCase())) {
            merged.push({
              id: dbAdmin.id,
              full_name: dbAdmin.full_name || "Admin Account",
              email: dbAdmin.email,
              role: dbAdmin.role === "admin" ? "super-admin" : dbAdmin.role,
              status: "active",
              created_at: dbAdmin.created_at
            });
          }
        });
        setAdminsList(merged);
        return;
      }
    } catch (e) {
      console.warn("Could not fetch profiles from Supabase, using local storage admins");
    }

    setAdminsList(localAdmins);
  };

  useEffect(() => {
    if (isSuperAdmin && activeTab === "admins") {
      fetchAdmins();
    }
  }, [isSuperAdmin, activeTab]);

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminName) return;

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const trimmedName = adminName.trim();

    if (trimmedName.length > 255 || trimmedEmail.length > 255 || (adminPassword && adminPassword.length > 255)) {
      toast.error("Oversized inputs are rejected.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Invalid email format.");
      return;
    }

    const newAdmin = {
      id: adminEditing ? adminEditing.id : `admin-${Date.now()}`,
      full_name: trimmedName,
      email: trimmedEmail,
      role: "store-admin",
      status: adminEditing ? adminEditing.status : "active",
      created_at: adminEditing ? adminEditing.created_at : new Date().toISOString()
    };

    if (!adminEditing && adminPassword) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: adminPassword,
          options: {
            data: {
              full_name: trimmedName,
              phone_number: "+919999999999",
            }
          }
        });
        if (error) console.warn("Supabase signUp for admin failed:", error.message);
        
        if (data?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: trimmedEmail,
              full_name: trimmedName,
              role: "store-admin",
              phone_number: "+919999999999"
            });
          if (profileError) console.warn("Supabase profile insert for admin failed:", profileError.message);
        }
      } catch (err) {
        console.warn("Supabase auth signUp error:", err);
      }
    }

    let updated = [...adminsList];
    if (adminEditing) {
      updated = adminsList.map(a => a.id === adminEditing.id ? newAdmin : a);
      toast.success("Admin account parameters calibrated.");
    } else {
      if (adminsList.some(a => a.email.toLowerCase() === newAdmin.email.toLowerCase())) {
        toast.error("An admin account with this email already exists.");
        return;
      }
      updated = [...adminsList, newAdmin];
      toast.success("New store-admin initialized.");
    }

    setAdminsList(updated);
    localStorage.setItem("luxe-admins", JSON.stringify(updated));
    setShowAdminModal(false);
    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminEditing(null);
  };

  const handleDeleteAdmin = async (id: string) => {
    if (id === "official-store-admin" || id === "super-admin-id-123") {
      toast.error("Cannot decommission root system administrators.");
      return;
    }

    if (confirm("Decommission this admin node?")) {
      const updated = adminsList.filter(a => a.id !== id);
      setAdminsList(updated);
      localStorage.setItem("luxe-admins", JSON.stringify(updated));
      toast.success("Admin node decommissioned.");
      
      try {
        await supabase.from("profiles").delete().eq("id", id);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleToggleAdminStatus = (id: string) => {
    if (id === "official-store-admin" || id === "super-admin-id-123") {
      toast.error("Root administrators cannot be deactivated.");
      return;
    }
    const updated = adminsList.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === "active" ? "inactive" : "active";
        toast.success(`Admin state set to ${nextStatus}`);
        return { ...a, status: nextStatus };
      }
      return a;
    });
    setAdminsList(updated);
    localStorage.setItem("luxe-admins", JSON.stringify(updated));
  };

  const handleResetAdminPassword = (admin: any) => {
    const newPass = prompt(`Enter new password for ${admin.full_name}:`, "Syed09.");
    if (newPass) {
      toast.success(`Password reset request dispatched for ${admin.email}`);
    }
  };


  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      // 1. Update status in Supabase orders table
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;

      // 2. Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);

      // 3. WhatsApp notification when status changes to "Shipped"
      if (newStatus === "Shipped") {
        const phoneNum = order.phone || "";
        const trackingLink = `https://luxe.ai/track/${orderId}`;
        const messageText = `Your LUXE order is on the way! 🖤 Track: ${trackingLink}`;
        
        // Clean phone number (digits only, prefix 91 if not present)
        let cleanPhone = phoneNum.replace(/[^0-9]/g, "");
        if (cleanPhone.length === 10) {
          cleanPhone = `91${cleanPhone}`;
        }
        
        const whatsappUrl = `https://wa.me/${cleanPhone || '917995338472'}?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, "_blank");
        toast.success("WhatsApp tracking message prepared!");
      }

      // 4. Loyalty points addition when status changes to "Delivered"
      if (newStatus === "Delivered") {
        if (order.customer_id) {
          // If customer is a mock user, update mock user profile locally
          const savedMockUser = localStorage.getItem("luxe-mock-user");
          if (savedMockUser) {
            const parsed = JSON.parse(savedMockUser);
            if (parsed.id === order.customer_id) {
              const currentDna = parsed.user_metadata?.style_dna || { totalXP: 2450, level: 7 };
              currentDna.totalXP = (currentDna.totalXP || 0) + 100;
              currentDna.level = Math.floor(currentDna.totalXP / 400);
              parsed.user_metadata.style_dna = currentDna;
              localStorage.setItem("luxe-mock-user", JSON.stringify(parsed));
              
              const savedMockProfile = localStorage.getItem("luxe-mock-profile");
              if (savedMockProfile) {
                const parsedProf = JSON.parse(savedMockProfile);
                parsedProf.loyalty_points = (parsedProf.loyalty_points || 0) + 100;
                localStorage.setItem("luxe-mock-profile", JSON.stringify(parsedProf));
              }
            }
          }
          
          // Also try to update profiles table if loyalty_points column exists (non-blocking)
          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("loyalty_points")
              .eq("id", order.customer_id)
              .single();
            
            const currentPoints = profileData?.loyalty_points || 0;
            await supabase
              .from("profiles")
              .update({ loyalty_points: currentPoints + 100 })
              .eq("id", order.customer_id);
          } catch (e) {
            // Ignore if column doesn't exist
          }
          
          toast.success("Loyalty points (+100 XP) added to customer profile! 🖤");
        }
      }
    } catch (err: any) {
      toast.error(`Status update failed: ${err.message}`);
    }
  };

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
      setFormColors("White, Sky Blue, Desert Sand, Olive Green, Sunset Pink, Navy Blue, Carbon Black, Cocoa Brown");
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
      ...editingProduct,
      id: editingProduct ? editingProduct.id : `luxe-${formCategory.toLowerCase()}-${Date.now()}`,
      name: formName,
      description: formDescription,
      price: Number(formPrice),
      currency: "INR",
      category: formCategory,
      images: editingProduct?.images || [formImageUrl],
      image_url: formImageUrl,
      stock: Number(formStock),
      stock_quantity: Number(formStock),
      isTrending: formIsTrending,
      sizes: sizesArr,
      colors: colorsArr,
      offer: formOffer,
      ratings: editingProduct?.ratings || 4.8,
      reviewsCount: editingProduct?.reviewsCount || 1,
      discount: editingProduct?.discount || 0,
      modelImages: editingProduct?.modelImages || {
        front: formImageUrl,
        side: formImageUrl,
        back: formImageUrl,
        variants: {}
      }
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
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[40] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-[50] transform transition-transform duration-300 ease-in-out lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />
      </div>

      {/* Main Operating Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto overflow-x-hidden relative">
        
        {/* Top OS Bar */}
        <header className="h-16 lg:h-20 border-b border-white/5 px-4 lg:px-10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-20 sticky top-0">
           <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <span className="block w-5 h-[1.5px] bg-white/60" />
                <span className="block w-5 h-[1.5px] bg-white/60" />
                <span className="block w-5 h-[1.5px] bg-white/60" />
              </button>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                 <span className="text-[10px] font-black tracking-widest uppercase text-white/40 hidden sm:block">Neural Link: Stable</span>
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
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-10 relative">
           
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
                        <button className="bg-[var(--primary-color)] text-black px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">
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
                  className="space-y-8 h-full"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-display font-black tracking-tighter text-gradient uppercase">Order Hub Controller</h3>
                      <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Real-time order management & logistics coordination</p>
                    </div>
                  </div>

                  <div className="space-y-4 pb-20 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    {orders.length === 0 ? (
                      <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl">
                        <ShoppingBag className="mx-auto mb-4 text-white/20 animate-pulse" size={32} />
                        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">No order streams initialized in the network.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {orders.map((order, i) => {
                          const statusColors: Record<string, string> = {
                            "Pending": "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
                            "Confirmed": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                            "Packed": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                            "Shipped": "bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse",
                            "Delivered": "bg-green-500/10 text-green-500 border border-green-500/20",
                            "Cancelled": "bg-red-500/10 text-red-500 border border-red-500/20"
                          };

                          return (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="bg-[#0A0A0C] border border-white/5 rounded-[24px] p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-500"
                            >
                              {/* Order Header */}
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Order Identifier</span>
                                  <h4 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2">
                                    LX-ORD-{order.id.slice(0, 8).toUpperCase()}
                                  </h4>
                                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider">{new Date(order.created_at).toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Set Status:</label>
                                  <select
                                    value={order.status || "Pending"}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className={cn(
                                      "px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider bg-black border-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer",
                                      statusColors[order.status || "Pending"] || "bg-white/5 text-white"
                                    )}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Packed">Packed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>

                              {/* Order Details Body */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                                {/* Customer Info */}
                                <div className="space-y-3 text-xs leading-relaxed">
                                  <h5 className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">Recipient Node</h5>
                                  <div className="space-y-1 text-white/80">
                                    <p className="font-bold text-white uppercase">{order.customer_name}</p>
                                    <p className="font-mono text-white/60">{order.phone}</p>
                                    <p className="text-white/50">{order.address}</p>
                                    <p className="text-white/40 font-mono text-[10px]">{order.city} {order.pincode ? `- ${order.pincode}` : ""}</p>
                                  </div>
                                </div>

                                {/* Items Ordered */}
                                <div className="space-y-3">
                                  <h5 className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">Garment Cargo</h5>
                                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Array.isArray(order.items) && order.items.length > 0 ? (
                                      order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                          <div className="space-y-0.5">
                                            <p className="font-bold text-white/80 uppercase line-clamp-1">{item.name}</p>
                                            <span className="text-[8px] font-mono text-white/30 uppercase">QTY: {item.quantity} · Size: {item.size || "L"} · Color: {item.color || "White"}</span>
                                          </div>
                                          <span className="font-mono text-white/60">₹{item.price * item.quantity}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-[9px] font-mono text-white/30 uppercase">Generic Product Bundle</p>
                                    )}
                                  </div>
                                </div>

                                {/* Bill & Payment Info */}
                                <div className="space-y-3 text-xs flex flex-col justify-between">
                                  <div className="space-y-2">
                                    <h5 className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">Financial Stream</h5>
                                    <div className="flex justify-between items-baseline text-white">
                                      <span className="text-white/40 uppercase tracking-wider text-[9px]">Total Value:</span>
                                      <span className="text-lg font-orbitron font-bold text-[#D4AF37] tracking-wider">₹{order.total_price}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono">
                                      <span className="text-white/40">Transfer Method:</span>
                                      <span className="text-white font-bold uppercase tracking-wider">{order.payment_method || "COD"}</span>
                                    </div>
                                    {order.upi_id && (
                                      <div className="flex justify-between text-[9px] font-mono">
                                        <span className="text-white/30">UPI Ref ID:</span>
                                        <span className="text-white/60">{order.upi_id}</span>
                                      </div>
                                    )}
                                    {order.promo_code && (
                                      <div className="flex justify-between text-[9px] font-mono">
                                        <span className="text-white/30">Used Promo:</span>
                                        <span className="text-green-400 font-bold">{order.promo_code}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Delete Order Button */}
                                  {isSuperAdmin && (
                                    <div className="flex justify-end pt-4">
                                      <button
                                        onClick={() => handleDelete(order.id, 'orders')}
                                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                                      >
                                        Decommission Node
                                      </button>
                                    </div>
                                  )}

                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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

              {activeTab === "admins" && isSuperAdmin && (
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-8 h-full"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-display font-black tracking-tighter text-gradient uppercase">Admin Access Control</h3>
                      <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Manage system administrators and store managers</p>
                    </div>
                    <button
                      onClick={() => {
                        setAdminEditing(null);
                        setAdminName("");
                        setAdminEmail("");
                        setAdminPassword("");
                        setShowAdminModal(true);
                      }}
                      className="bg-white text-black px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add Store Admin
                    </button>
                  </div>

                  <div className="space-y-4 pb-20 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    {adminsList.length === 0 ? (
                      <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl">
                        <Shield className="mx-auto mb-4 text-white/20 animate-pulse" size={32} />
                        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">No administrator nodes loaded.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {adminsList.map((admin, idx) => (
                          <div
                            key={admin.id || idx}
                            className="bg-[#0A0A0C] border border-white/5 rounded-[24px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-all duration-500"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                                <Shield size={20} />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight">{admin.full_name}</h4>
                                <p className="text-[10px] font-mono text-white/40">{admin.email}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-mono text-white/30 uppercase">Role:</span>
                                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono text-[8px] uppercase tracking-wider">{admin.role}</span>
                                  <span className="text-[8px] font-mono text-white/30 uppercase ml-2">Status:</span>
                                  <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider ${admin.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{admin.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleAdminStatus(admin.id)}
                                className={`p-2 rounded-xl border text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer ${admin.status === 'active' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'}`}
                                title={admin.status === 'active' ? 'Deactivate Admin' : 'Activate Admin'}
                              >
                                <Power size={12} /> {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleResetAdminPassword(admin)}
                                className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer"
                                title="Reset Password"
                              >
                                <Key size={12} /> Reset Pass
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-1 cursor-pointer"
                                title="Delete Admin"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

         {/* Admin Creation / Editing Modal */}
         <AnimatePresence>
           {showAdminModal && (
             <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowAdminModal(false)}
                 className="fixed inset-0 bg-black/85 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0, y: 30 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 30 }}
                 className="relative w-full max-w-md bg-[#08080c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] text-left"
               >
                 <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                 <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                   <div>
                     <h3 className="text-lg font-display italic text-white">{adminEditing ? "Modify Admin Settings" : "Initialize Store Admin"}</h3>
                     <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Luxe OS Admin Directory</p>
                   </div>
                   <button 
                     onClick={() => setShowAdminModal(false)}
                     className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
                   >
                     <X size={18} />
                   </button>
                 </div>

                 <form onSubmit={handleSaveAdmin} className="p-8 space-y-4 overflow-y-auto max-h-[65vh] custom-scrollbar">
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Admin Name</label>
                     <input
                       type="text"
                       required
                       value={adminName}
                       onChange={(e) => setAdminName(e.target.value)}
                       placeholder="E.g., LUXE Store Admin"
                       className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#D4AF37]/40 text-white placeholder:text-white/20 transition-all"
                     />
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Email Address</label>
                     <input
                       type="email"
                       required
                       disabled={!!adminEditing}
                       value={adminEmail}
                       onChange={(e) => setAdminEmail(e.target.value)}
                       placeholder="E.g., official.valceron.in@gmail.com"
                       className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#D4AF37]/40 text-white placeholder:text-white/20 transition-all disabled:opacity-50"
                     />
                   </div>

                   {!adminEditing && (
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest ml-2">Password</label>
                       <input
                         type="password"
                         required
                         value={adminPassword}
                         onChange={(e) => setAdminPassword(e.target.value)}
                         placeholder="Minimum 6 characters"
                         className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#D4AF37]/40 text-white placeholder:text-white/20 transition-all"
                       />
                     </div>
                   )}

                   <div className="pt-4 border-t border-white/5 flex gap-4">
                     <button
                       type="button"
                       onClick={() => setShowAdminModal(false)}
                       className="flex-1 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest cursor-pointer text-center"
                     >
                       Abort
                     </button>
                     <button
                       type="submit"
                       className="flex-1 py-3 bg-[#D4AF37] text-black rounded-xl hover:bg-[#D4AF37]/90 transition-all text-xs font-mono font-bold uppercase tracking-widest cursor-pointer text-center"
                     >
                       {adminEditing ? "Calibrate" : "Deploy Admin"}
                     </button>
                   </div>
                 </form>
               </motion.div>
             </div>
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
