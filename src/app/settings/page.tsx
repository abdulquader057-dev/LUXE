"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, CreditCard, MapPin, 
  Settings2, Shirt, Watch, Crown, 
  Bell, HelpCircle, Camera, Cpu, 
  History, Share2, MessageSquare, 
  CheckCircle2, ChevronRight, X, Lock,
  LogOut, Globe, Moon, Eye, Sparkles, Diamond, ShoppingBag, Palette, Calendar, Send, Clipboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import LuxeButton from "@/components/ui/LuxeButton";
import { ARScannerModal } from "@/components/ui/ARScannerModal";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import confetti from "canvas-confetti";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { setCookie } from "@/lib/cookies";

const SETTINGS_MENU = [
  { id: "account", label: "Account", icon: User, color: "#00f2ff" },
  { id: "themes", label: "Theme Hub", icon: Palette, color: "#D4AF37" },
  { id: "preferences", label: "Preferences", icon: Shirt, color: "#c084fc" },
  { id: "accessories", label: "Accessory Hub", icon: Watch, color: "#ffcc00" },
  { id: "subscription", label: "Luxe Elite", icon: Crown, color: "#ff4466" },
  { id: "notifications", label: "Status Feed", icon: Bell, color: "#00ff9d" },
  { id: "support", label: "Support", icon: HelpCircle, color: "#f8f8f8" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Session Terminated.");
    router.push("/auth");
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "themes":
        return <ThemeSettings />;
      case "preferences":
        return <ClothingPreferences />;
      case "accessories":
        return <AccessoryHub />;
      case "subscription":
        return <SubscriptionServices />;
      case "notifications":
        return <NotificationSettings />;
      case "support":
        return <SupportCenter />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white pt-32 pb-40 relative overflow-hidden">
      {/* Background HUD Accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Settings Navigation */}
          <aside className="w-full lg:w-[320px] space-y-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">Nexus // Control</span>
              <h1 className="text-4xl font-display font-light italic tracking-tight">System Settings</h1>
            </div>

            <nav className="space-y-1">
              {SETTINGS_MENU.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 group relative overflow-hidden cursor-pointer",
                      isActive 
                        ? "bg-primary/10 border border-primary/20 text-white" 
                        : "text-white/30 hover:text-white/60"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute inset-0 bg-primary/5 blur-xl -z-10" 
                      />
                    )}
                    <Icon 
                      size={18} 
                      style={{ color: isActive ? item.color : "currentColor" }}
                      className={cn("transition-transform duration-500", isActive && "scale-110")} 
                    />
                    <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase">{item.label}</span>
                    <ChevronRight size={14} className={cn("ml-auto transition-transform", isActive && "rotate-90")} />
                  </motion.button>
                );
              })}
            </nav>

            {/* Logout / Secondary Action */}
            <div className="pt-8 border-t border-white/[0.03]">
              <motion.button 
                onClick={() => setShowConfirmLogout(true)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-400/60 hover:text-red-400 transition-colors group cursor-pointer"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase">Terminate Session</span>
              </motion.button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-grow min-h-[600px] glass-panel !rounded-[32px] p-8 md:p-12 border border-white/[0.03] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>

            {/* Subtle Corner Accents */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <div className="w-24 h-24 border-t border-r border-white" />
            </div>
          </section>
        </div>
      </div>

      {/* Confirm Logout Modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmLogout(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
              <h3 className="text-xl font-display font-light italic mb-4">Terminate Neural Connection?</h3>
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-8 leading-relaxed">
                Signing out will temporarily break your personalized style DNA calibration feed. Do you wish to proceed?
              </p>
              <div className="flex gap-4">
                <motion.button 
                  onClick={() => setShowConfirmLogout(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs font-mono uppercase tracking-widest hover:bg-red-500/30 transition-colors cursor-pointer"
                >
                  Terminate
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SUB-COMPONENTS ---

function Toggle({ active, onChange }: { active: boolean; onChange?: () => void }) {
  return (
    <motion.div 
      onClick={onChange}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-10 h-5 rounded-full relative transition-colors duration-500 cursor-pointer",
        active ? "bg-primary" : "bg-white/10"
      )}
    >
      <motion.div 
        animate={{ x: active ? 22 : 4 }}
        className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
      />
    </motion.div>
  );
}

function AccountSettings() {
  const { user, profile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(true);

  useEffect(() => {
    if (user) {
      setName(profile?.full_name || user?.user_metadata?.full_name || "");
      setEmail(user?.email || "");
      setPhone(profile?.phone_number || user?.user_metadata?.phone_number || "");
    }
  }, [user, profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // 1. Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          phone_number: phone,
        }
      });
      if (authError) throw authError;

      // 2. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          phone_number: phone,
        })
        .eq("id", user.id);
      
      if (profileError) {
        console.warn("Profile table update failed:", profileError.message);
      }
      
      toast.success("Identity vectors updated in Supabase!");
      
      // Redirect and reload page to re-evaluate AuthContext states
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      toast.error(`Update failed: ${err.message || err}`);
    }
  };

  const handleModifyPassword = () => {
    if (!password) {
      toast.error("Please fill in a new password first.");
      return;
    }
    toast.success("Password calibration complete. Reset link sent.");
    setPassword("");
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Identity Management</h2>
        <div className="text-[8px] font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Active</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Primary Data</h3>
          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest ml-4">Name</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Luxe Client"
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-primary/40 transition-all text-white"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest ml-4">Email</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="client@luxe.ai"
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-primary/40 transition-all text-white"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest ml-4">Phone</label>
               <input 
                 type="text" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 placeholder="+91 9876543210"
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-primary/40 transition-all text-white"
               />
             </div>
             <LuxeButton size="sm" onClick={handleUpdateProfile}>Update Identity</LuxeButton>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Security Protocol</h3>
          <div className="space-y-4">
             <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Shield className="text-primary" size={20} />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Two-Factor Auth</span>
                      <span className="text-[8px] font-mono text-white/20 uppercase">Highly Recommended</span>
                   </div>
                </div>
                <Toggle active={twoFactor} onChange={() => {
                  setTwoFactor(!twoFactor);
                  toast.success(!twoFactor ? "Two-Factor Auth active." : "Two-Factor Auth suspended.");
                }} />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest ml-4">New Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••••••"
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-primary/40 transition-all text-white"
               />
             </div>
             <LuxeButton variant="outline" size="sm" className="w-full" onClick={handleModifyPassword}>Modify Password</LuxeButton>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Saved Coordinates</h3>
        <div className="grid md:grid-cols-2 gap-4">
           <AddressCard type="Home" address="Neural District, 42nd Avenue, Neo-Tokyo" />
           <AddressCard type="Office" address="Cyber Hub, Sector 7, Mars Colony" isNew />
        </div>
      </div>
    </div>
  );
}

function ClothingPreferences() {
  const [isAROpen, setIsAROpen] = React.useState(false);
  const [activeMaterial, setActiveMaterial] = React.useState("Silk");
  const [activeFit, setActiveFit] = React.useState("Oversized");
  const [monogram, setMonogram] = useState(false);

  const handleMaterialChange = (mat: string) => {
    setActiveMaterial(mat);
    toast.success(`Material filter updated: ${mat}`);
  };

  const handleFitChange = (fit: string) => {
    setActiveFit(fit);
    toast.success(`Fit profile locked: ${fit}`);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Neural Style Prefs</h2>
        <div className="text-[8px] font-mono text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-widest">Optimized</div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-6">Interactive Size Guide</h3>
            <div onClick={() => setIsAROpen(true)} className="cursor-pointer aspect-video rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative overflow-hidden group">
               <Camera size={40} className="text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,204,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="absolute bottom-4 text-[8px] font-mono text-primary uppercase tracking-[0.5em]">Initialize AR Scanner</span>
            </div>
            <ARScannerModal isOpen={isAROpen} onClose={() => setIsAROpen(false)} />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Material Filter</h3>
            <div className="flex flex-wrap gap-2">
               {["Silk", "Merino Wool", "Bioplastic", "Chrome Fiber", "Organic Cotton"].map(m => (
                 <motion.button 
                   key={m} 
                   onClick={() => handleMaterialChange(m)}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className={cn(
                     "px-4 py-2 rounded-full border text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer",
                     activeMaterial === m ? "bg-primary text-[var(--primary-color)] border-primary" : "border-white/10 text-white hover:border-primary/40 hover:text-primary"
                   )}
                 >
                   {m}
                 </motion.button>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Fit Profile</h3>
              <div className="grid grid-cols-3 gap-2">
                 {["Oversized", "Athletic", "Skin"].map(f => (
                   <motion.button 
                     key={f} 
                     onClick={() => handleFitChange(f)}
                     whileHover={{ scale: 1.03, y: -2 }}
                     whileTap={{ scale: 0.97 }}
                     className={cn(
                       "p-4 rounded-2xl border text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer",
                       activeFit === f ? "bg-primary text-[var(--primary-color)] border-primary" : "border-white/5 text-white/40 hover:border-primary/40"
                     )}
                   >
                     {f}
                   </motion.button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Personalization</h3>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Monogramming</span>
                    <Toggle active={monogram} onChange={() => {
                      setMonogram(!monogram);
                      toast.success(!monogram ? "Monogramming enabled." : "Monogramming disabled.");
                    }} />
                 </div>
                 <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
                   Enable laser-etched identifiers on luxury garments.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TurntableCanvas({ shape }: { shape: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 1;
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 60;
      
      angle += 0.01;

      // Draw Grid / Radar lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = "rgba(0, 240, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw details based on shape
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      
      if (shape === "Horology") {
        // Draw Watch Dial
        ctx.beginPath();
        ctx.arc(cx, cy, r - 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw ticks
        for (let i = 0; i < 12; i++) {
          const a = (i * Math.PI) / 6 + angle;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * (r - 22), cy + Math.sin(a) * (r - 22));
          ctx.lineTo(cx + Math.cos(a) * (r - 15), cy + Math.sin(a) * (r - 15));
          ctx.stroke();
        }
        
        // Draw hands
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle * 2) * (r - 30), cy + Math.sin(angle * 2) * (r - 30));
        ctx.stroke();
      } else if (shape === "Jewelry") {
        // Draw Diamond shape
        const points: { x: number; y: number }[] = [];
        const numPoints = 6;
        for (let i = 0; i < numPoints; i++) {
          const a = (i * Math.PI * 2) / numPoints + angle;
          points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * (r / 3.5) });
        }
        
        // Draw top and bottom apex
        const topY = cy - r;
        const bottomY = cy + r;
        
        points.forEach((p, idx) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cx, topY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cx, bottomY);
          ctx.stroke();
          
          // Connect to next point
          const next = points[(idx + 1) % numPoints];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        });
      } else {
        // Draw Box / Artifact
        const size = r - 15;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const vertices = [
          { x: -size, y: -size, z: -size },
          { x: size, y: -size, z: -size },
          { x: size, y: size, z: -size },
          { x: -size, y: size, z: -size },
          { x: -size, y: -size, z: size },
          { x: size, y: -size, z: size },
          { x: size, y: size, z: size },
          { x: -size, y: size, z: size },
        ];
        
        const projected = vertices.map(v => {
          // Rotate around Y and X axis
          const x1 = v.x * cos - v.z * sin;
          const z1 = v.x * sin + v.z * cos;
          
          const y2 = v.y * cos - z1 * sin;
          const z2 = v.y * sin + z1 * cos;
          
          // Perspective projection
          const f = 180 / (180 + z2);
          return { x: cx + x1 * f, y: cy + y2 * f };
        });
        
        const drawLine = (i: number, j: number) => {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        };
        
        // Connect vertices
        drawLine(0, 1); drawLine(1, 2); drawLine(2, 3); drawLine(3, 0); // back face
        drawLine(4, 5); drawLine(5, 6); drawLine(6, 7); drawLine(7, 4); // front face
        drawLine(0, 4); drawLine(1, 5); drawLine(2, 6); drawLine(3, 7); // connections
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [shape]);

  return <canvas ref={canvasRef} width={300} height={200} className="mx-auto" />;
}

function AccessoryHub() {
  const [activeCategory, setActiveCategory] = useState("Horology");
  const [isRotating, setIsRotating] = useState(true);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    toast.success(`Accessory view set to ${cat}`);
  };

  const handleCalibrate = () => {
    setIsRotating(false);
    toast.success("Turntable calibrated to coordinates [0, 0, 0].");
    setTimeout(() => setIsRotating(true), 800);
  };

  const handleSnapshot = () => {
    toast.success("High-resolution style snapshot synced to profile.");
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Accessory Selection</h2>
        <div className="text-[8px] font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Premium</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <motion.div 
           onClick={() => handleCategorySelect("Horology")}
           whileHover={{ scale: 1.03, y: -4 }}
           whileTap={{ scale: 0.98 }}
           className={cn("p-6 rounded-2xl bg-white/[0.02] border transition-all cursor-pointer group",
             activeCategory === "Horology" ? "border-primary bg-primary/5" : "border-white/5 hover:border-primary/40")}
         >
           <Watch size={24} className={cn("mb-4 transition-colors", activeCategory === "Horology" ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
           <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Horology</h4>
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">12 AR Artifacts</span>
         </motion.div>
         
         <motion.div 
           onClick={() => handleCategorySelect("Jewelry")}
           whileHover={{ scale: 1.03, y: -4 }}
           whileTap={{ scale: 0.98 }}
           className={cn("p-6 rounded-2xl bg-white/[0.02] border transition-all cursor-pointer group",
             activeCategory === "Jewelry" ? "border-primary bg-primary/5" : "border-white/5 hover:border-primary/40")}
         >
           <Diamond size={24} className={cn("mb-4 transition-colors", activeCategory === "Jewelry" ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
           <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Jewelry</h4>
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">8 AR Artifacts</span>
         </motion.div>

         <motion.div 
           onClick={() => handleCategorySelect("Artifacts")}
           whileHover={{ scale: 1.03, y: -4 }}
           whileTap={{ scale: 0.98 }}
           className={cn("p-6 rounded-2xl bg-white/[0.02] border transition-all cursor-pointer group",
             activeCategory === "Artifacts" ? "border-primary bg-primary/5" : "border-white/5 hover:border-primary/40")}
         >
           <ShoppingBag size={24} className={cn("mb-4 transition-colors", activeCategory === "Artifacts" ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
           <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Artifacts</h4>
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">24 AR Artifacts</span>
         </motion.div>
      </div>

      <div className="glass-panel !rounded-[24px] p-8 border border-white/5 relative overflow-hidden">
         <div className="relative z-10 space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">360° Inspection Module</h3>
            <div className="h-64 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
               {isRotating ? (
                 <TurntableCanvas shape={activeCategory} />
               ) : (
                 <div className="text-[10px] font-mono text-primary uppercase tracking-[0.5em]">Calibrating...</div>
               )}
            </div>
            <div className="flex justify-center gap-4">
               <LuxeButton size="sm" variant="outline" onClick={handleCalibrate}>Calibrate View</LuxeButton>
               <LuxeButton size="sm" onClick={handleSnapshot}>Capture Snapshot</LuxeButton>
            </div>
         </div>
      </div>
    </div>
  );
}

function SubscriptionServices() {
  const { convertPrice } = useCommerce();
  const { user } = useAuth();
  
  // Tiers and pricing details
  const [insiderBase, setInsiderBase] = useState(450);
  const [eliteBase, setEliteBase] = useState(3500);
  const [vanguardBase, setVanguardBase] = useState(5000);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [activePlan, setActivePlan] = useState("Luxe Elite");
  const [spotsLeft, setSpotsLeft] = useState(94);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);
  const [usePromoSlot, setUsePromoSlot] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiCopied, setUpiCopied] = useState(false);
  const [paying, setPaying] = useState(false);

  // Success Celebration state
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [celebrationPlanName, setCelebrationPlanName] = useState("");

  const isAdmin = user?.email?.toLowerCase() === "abdulquader057@gmail.com";

  useEffect(() => {
    const p1 = localStorage.getItem("price-insider");
    const p2 = localStorage.getItem("price-elite");
    const p3 = localStorage.getItem("price-vanguard");
    setInsiderBase(p1 ? parseInt(p1) : 450);
    setEliteBase(p2 ? parseInt(p2) : 3500);
    setVanguardBase(p3 ? parseInt(p3) : 5000);

    const savedPlan = localStorage.getItem("luxe-active-plan");
    if (savedPlan) setActivePlan(savedPlan);

    const savedSpots = localStorage.getItem("luxe-promo-spots");
    if (savedSpots) {
      setSpotsLeft(parseInt(savedSpots));
    } else {
      const initialSpots = Math.floor(Math.random() * 9) + 90; // 90 to 98
      localStorage.setItem("luxe-promo-spots", initialSpots.toString());
      setSpotsLeft(initialSpots);
    }
  }, []);

  const handleSavePrices = () => {
    localStorage.setItem("price-insider", insiderBase.toString());
    localStorage.setItem("price-elite", eliteBase.toString());
    localStorage.setItem("price-vanguard", vanguardBase.toString());
    toast.success("Admin tier prices updated successfully!");
    setIsAdminMode(false);
  };

  const openPaymentModal = (planName: string, price: number) => {
    setSelectedPlanName(planName);
    setSelectedPlanPrice(price);
    setUsePromoSlot(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setPaying(true);
    setTimeout(() => {
      // Complete payment
      setActivePlan(selectedPlanName);
      localStorage.setItem("luxe-active-plan", selectedPlanName);
      
      if (usePromoSlot) {
        const newSpots = Math.max(0, spotsLeft - 1);
        setSpotsLeft(newSpots);
        localStorage.setItem("luxe-promo-spots", newSpots.toString());
      }

      setPaying(false);
      setShowPaymentModal(false);
      
      // Fire confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Show success overlay
      setCelebrationPlanName(selectedPlanName);
      setShowSuccessCelebration(true);
      
      // Close success overlay after 3.5 seconds
      setTimeout(() => {
        setShowSuccessCelebration(false);
        // Force full page reload or state updates
        window.location.reload();
      }, 3500);

      toast.success(`Synched with ${selectedPlanName}! Enjoy your perks.`);
    }, 1500);
  };

  const handleSetTheme = (color: string) => {
    if (activePlan !== "Luxe Elite" && activePlan !== "Neural Vanguard") {
      toast.error("Access Denied. Custom UI Theme is only available for Luxe Elite and Neural Vanguard tiers.");
      return;
    }
    localStorage.setItem("luxe-theme-color", color);
    document.documentElement.style.setProperty("--primary-color", color);
    try { track("theme_changed", { color }); } catch (e) {}
    toast.success(`Interface colorway updated to ${color}`);
  };

  // Convert prices
  const insiderConverted = convertPrice(insiderBase);
  const eliteConverted = convertPrice(eliteBase);
  const vanguardConverted = convertPrice(vanguardBase);

  return (
    <div className="space-y-12 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Elite Membership</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-[8px] font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-400/30 cursor-pointer"
            >
              {isAdminMode ? "Cancel Edit" : "Admin Price Edit"}
            </button>
          )}
          <div className="text-[8px] font-mono text-red-400 bg-red-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Active Plan: {activePlan}</div>
        </div>
      </div>

      {spotsLeft > 0 && (
         <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-[#00f2ff]/5 to-transparent border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <span className="text-[8px] font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Limited Promotion</span>
               <h4 className="text-lg font-display font-light italic">First 100 Customers Upgrade Free!</h4>
               <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Only <span className="text-primary font-bold">{spotsLeft} slots remaining</span> in the neural registry.
               </p>
            </div>
            <LuxeButton 
              size="sm" 
              onClick={() => {
                setSelectedPlanName("Luxe Elite");
                setSelectedPlanPrice(0);
                setUsePromoSlot(true);
                setShowPaymentModal(true);
              }}
            >
              Claim Elite Access (Free)
            </LuxeButton>
         </div>
      )}

      {isAdminMode && (
        <div className="p-6 rounded-2xl bg-yellow-400/5 border border-yellow-400/20 space-y-4 mb-4">
          <h4 className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-bold">Admin Console: Modify Base Prices (INR)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Insider Price (INR)</label>
              <input 
                type="number" 
                value={insiderBase}
                onChange={(e) => setInsiderBase(parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Elite Price (INR)</label>
              <input 
                type="number" 
                value={eliteBase}
                onChange={(e) => setEliteBase(parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Vanguard Price (INR)</label>
              <input 
                type="number" 
                value={vanguardBase}
                onChange={(e) => setVanguardBase(parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white" 
              />
            </div>
          </div>
          <LuxeButton size="sm" onClick={handleSavePrices}>Save Admin Prices</LuxeButton>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
         {/* TIER 1 */}
         <div className={cn("p-6 rounded-[32px] border space-y-6 relative overflow-hidden group transition-all text-left",
            activePlan === "Luxe Insider" ? "border-primary bg-primary/5" : "border-white/5 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/30")}>
            <Crown className="text-primary/60" size={24} />
            <div className="space-y-2">
               <h3 className="text-xl font-display font-light italic">Luxe Insider</h3>
               <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  Basic drops, standard shipping, and early access.
               </p>
            </div>
            <div className="text-2xl font-display font-light">{insiderConverted.symbol}{insiderConverted.amount}<span className="text-xs">/MO</span></div>
            {activePlan === "Luxe Insider" ? (
              <LuxeButton className="w-full cursor-default">Current Plan</LuxeButton>
            ) : (
              <LuxeButton variant="outline" className="w-full" onClick={() => openPaymentModal("Luxe Insider", insiderBase)}>Downgrade</LuxeButton>
            )}
         </div>

         {/* TIER 2 */}
         <div className={cn("p-6 rounded-[32px] border space-y-6 relative overflow-hidden group transition-all shadow-[0_0_30px_rgba(0,242,255,0.05)] text-left",
            activePlan === "Luxe Elite" ? "border-primary bg-primary/20" : "border-white/5 bg-gradient-to-br from-primary/10 to-accent/10 hover:border-primary/50")}>
            <Crown className="text-primary" size={28} />
            <div className="space-y-2">
               <h3 className="text-xl font-display font-light italic">Luxe Elite</h3>
               <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  Priority drops, global teleport shipping, and master stylists.
               </p>
            </div>
            <div className="text-2xl font-display font-light">{eliteConverted.symbol}{eliteConverted.amount}<span className="text-xs">/YR</span></div>
            {activePlan === "Luxe Elite" ? (
              <LuxeButton className="w-full cursor-default">Current Plan</LuxeButton>
            ) : (
              <LuxeButton className="w-full" onClick={() => openPaymentModal("Luxe Elite", eliteBase)}>Select Plan</LuxeButton>
            )}
         </div>

         {/* TIER 3 */}
         <div className={cn("p-6 rounded-[32px] border space-y-6 relative overflow-hidden group transition-all text-left",
            activePlan === "Neural Vanguard" ? "border-purple-500 bg-purple-500/10 text-purple-200" : "border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/30")}>
            <Diamond className="text-purple-400/80" size={24} />
            <div className="space-y-2">
               <h3 className="text-xl font-display font-light italic text-purple-200">Neural Vanguard</h3>
               <p className="text-[9px] font-mono text-purple-200/40 uppercase tracking-widest leading-relaxed">
                  Bespoke 1-of-1 pieces, 24/7 holographic styling, VIP event access.
               </p>
            </div>
            <div className="text-2xl font-display font-light text-purple-200">{vanguardConverted.symbol}{vanguardConverted.amount}<span className="text-xs">/YR</span></div>
            {activePlan === "Neural Vanguard" ? (
              <LuxeButton className="w-full text-purple-400 border-purple-500/40 bg-purple-500/15 cursor-default">Current Plan</LuxeButton>
            ) : (
              <LuxeButton variant="outline" className="w-full text-purple-400 border-purple-500/20 hover:bg-purple-500/10" onClick={() => openPaymentModal("Neural Vanguard", vanguardBase)}>Upgrade</LuxeButton>
            )}
         </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Elite Benefits & Customization</h3>
         <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <BenefitItem label="5% - 25% purchase discount" active />
               <BenefitItem label="Master Stylist Sessions" active={activePlan !== "Luxe Insider"} />
               <BenefitItem label="Free Delivery & Priority Support" active={activePlan !== "Luxe Insider"} />
               <BenefitItem label="Theme customization & Custom UI" active={activePlan !== "Luxe Insider"} />
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <Palette size={16} className="text-primary" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Custom UI Theme</span>
               </div>
               <p className="text-[9px] font-mono text-white/40 uppercase leading-relaxed mb-6">
                  Select your neural interface colorway. (Requires Luxe Elite or higher)
               </p>
               <div className="flex gap-4">
                  {['#00f2ff', '#c084fc', '#ff4466', '#00ff9d'].map((color) => (
                    <motion.button 
                      key={color} 
                      onClick={() => handleSetTheme(color)}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-all cursor-pointer shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
               </div>
            </div>
         </div>
       </div>

       <CouponsDisplay />

       {/* Interactive Payment Gateway Modal */}
       <AnimatePresence>
         {showPaymentModal && (
           <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowPaymentModal(false)} 
               className="absolute inset-0 bg-black/85 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.95, opacity: 0 }} 
               className="relative w-full max-w-md bg-[#07070a]/95 border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 text-left"
             >
               <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff]/50 to-transparent" />
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-xl font-display font-light italic">Quantum Gateway</h3>
                   <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Membership calibration fee</p>
                 </div>
                 <button 
                   onClick={() => setShowPaymentModal(false)} 
                   className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
                 >
                   <X size={18} />
                 </button>
               </div>

               {spotsLeft > 0 && selectedPlanName !== "Luxe Insider" && (
                 <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between mb-6">
                   <div className="space-y-1">
                     <span className="text-[8px] font-mono text-primary uppercase font-bold tracking-wider">Promotional Slot Available</span>
                     <p className="text-[10px] font-mono text-white/60 uppercase">Activate for free using registry spot</p>
                   </div>
                   <input
                     type="checkbox"
                     checked={usePromoSlot}
                     onChange={(e) => {
                       setUsePromoSlot(e.target.checked);
                       if (e.target.checked) {
                         setSelectedPlanPrice(0);
                       } else {
                         setSelectedPlanPrice(selectedPlanName === "Luxe Insider" ? insiderBase : selectedPlanName === "Luxe Elite" ? eliteBase : vanguardBase);
                       }
                     }}
                     className="w-5 h-5 accent-primary rounded cursor-pointer"
                   />
                 </div>
               )}

               <div className="space-y-6">
                 <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Calibrating Tier</span>
                   <div className="text-right">
                     <p className="text-lg font-display italic text-[#00f2ff]">{selectedPlanName}</p>
                     <p className="text-xl font-mono font-bold text-white tracking-tight">
                       {usePromoSlot ? "₹0 (Free Claim)" : `${convertPrice(selectedPlanPrice).symbol}${convertPrice(selectedPlanPrice).amount}`}
                     </p>
                   </div>
                 </div>

                 {!usePromoSlot && (
                   <>
                     <div className="grid grid-cols-2 gap-2 mb-4">
                       <button
                         type="button"
                         onClick={() => setPaymentMethod("upi")}
                         className={cn(
                           "py-2.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5",
                           paymentMethod === "upi" ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/[0.02] text-white/40"
                         )}
                       >
                         UPI QR / ID
                       </button>
                       <button
                         type="button"
                         onClick={() => setPaymentMethod("card")}
                         className={cn(
                           "py-2.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5",
                           paymentMethod === "card" ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/[0.02] text-white/40"
                         )}
                       >
                         Visa / Card
                       </button>
                     </div>

                     {paymentMethod === "upi" ? (
                       <div className="space-y-4 text-center">
                         <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 w-full justify-between">
                           <span className="text-[10px] font-mono text-white tracking-widest">7995338472@ptaxis</span>
                           <button
                             type="button"
                             onClick={() => {
                               navigator.clipboard.writeText("7995338472@ptaxis");
                               setUpiCopied(true);
                               toast.success("UPI ID copied!");
                               setTimeout(() => setUpiCopied(false), 2000);
                             }}
                             className="p-1 text-primary hover:text-white transition-colors cursor-pointer"
                           >
                             {upiCopied ? <CheckCircle2 size={14} className="text-green-400" /> : <Clipboard size={14} />}
                           </button>
                         </div>
                         <div className="w-36 h-36 mx-auto relative border border-white/10 rounded-xl bg-white p-1">
                           <Image src="/upi-qr.jpg" alt="UPI QR" fill className="w-full h-full object-contain" />
                         </div>
                       </div>
                     ) : (
                       <div className="space-y-3">
                         <input
                           type="text"
                           required
                           value={cardName}
                           onChange={(e) => setCardName(e.target.value)}
                           placeholder="CARDHOLDER NAME"
                           className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[9px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 uppercase tracking-widest"
                         />
                         <input
                           type="text"
                           required
                           value={cardNumber}
                           onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                           maxLength={19}
                           placeholder="CARD NUMBER"
                           className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[9px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 tracking-widest"
                         />
                         <div className="grid grid-cols-2 gap-3">
                           <input
                             type="text"
                             required
                             value={cardExpiry}
                             onChange={(e) => setCardExpiry(e.target.value)}
                             placeholder="MM/YY"
                             maxLength={5}
                             className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[9px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 text-center tracking-wider"
                           />
                           <input
                             type="password"
                             required
                             value={cardCvv}
                             onChange={(e) => setCardCvv(e.target.value)}
                             placeholder="CVV"
                             maxLength={3}
                             className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[9px] font-mono focus:outline-none focus:border-primary/40 text-white placeholder:text-white/20 text-center tracking-wider"
                           />
                         </div>
                       </div>
                     )}
                   </>
                 )}

                 {usePromoSlot && (
                   <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-[10px] font-mono uppercase tracking-wider text-green-400 text-center leading-relaxed">
                     ✨ 100% OFF PROMO SLOT APPLIED! CLICK ACTIVATE PLAN TO CLAIM FREE MEMBERSHIP.
                   </div>
                 )}

                 <LuxeButton
                   onClick={handleConfirmPayment}
                   disabled={paying}
                   className="w-full py-4 text-center justify-center font-bold tracking-widest mt-4"
                 >
                   {paying ? "Verifying Transaction..." : usePromoSlot ? "ACTIVATE FREE MEMBERSHIP" : "CONFIRM TRANSACTION"}
                 </LuxeButton>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* Full-Screen Congratulations Celebration Overlay */}
       <AnimatePresence>
         {showSuccessCelebration && (
           <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.15),transparent_60%)] animate-pulse" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="w-64 h-64 border border-dashed border-primary/20 rounded-full absolute"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="w-72 h-72 border border-dotted border-white/10 rounded-full absolute"
             />

             <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className="text-center space-y-6 relative z-10"
             >
               <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/10 border border-primary flex items-center justify-center shadow-[0_0_50px_rgba(0,242,255,0.4)]">
                 <Crown size={48} className="text-primary animate-bounce" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-4xl font-display font-black tracking-[0.2em] text-gradient uppercase">Calibration Succeeded</h2>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">NEURAL MEMBERSHIP INDEX UPDATED</p>
               </div>
               <div className="py-2 px-6 bg-white/5 border border-white/10 rounded-full w-fit mx-auto text-xs font-mono font-bold tracking-widest uppercase text-white/80">
                 Welcome to {celebrationPlanName}
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}

function CouponsDisplay() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("luxe-coupons") || "[]");
    setCoupons(saved);
  }, []);

  if (coupons.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-white/[0.03] text-left">
      <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Prepaid Reward Coupons</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {coupons.map((coupon: any, idx: number) => (
          <div key={idx} className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Prepaid Code</span>
              <p className="text-xl font-mono font-bold text-white tracking-widest">{coupon.code}</p>
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{coupon.discount}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(coupon.code);
                toast.success("Coupon code copied!");
              }}
              className="px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 font-mono text-[9px] uppercase tracking-widest transition-colors cursor-pointer border border-green-500/20"
            >
              Copy Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { user } = useAuth();
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestOrder() {
      setLoading(true);
      try {
        if (user) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
          const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1);
          if (data && data.length > 0) {
            setLatestOrder(data[0]);
          }
        }
      } catch (e) {
        console.warn("Error fetching latest order:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestOrder();
  }, [user]);

  const orderId = latestOrder 
    ? `LX-ORD${latestOrder.id.slice(0, 4).toUpperCase()}` 
    : "LX-ORD5676";
  const status = latestOrder?.status || "processing";
  
  let currentStep = 0;
  if (status.toLowerCase().includes("deliver") && !status.toLowerCase().includes("out")) {
    currentStep = 4;
  } else if (status.toLowerCase().includes("out")) {
    currentStep = 3;
  } else if (status.toLowerCase().includes("dispatch")) {
    currentStep = 2;
  } else if (status.toLowerCase().includes("pack")) {
    currentStep = 1;
  } else {
    currentStep = 0;
  }

  const steps = [
    { label: "Confirmed", time: "09:30 AM", desc: "Order details synced to terminal" },
    { label: "Packed", time: "11:45 AM", desc: "Premium luxury soft fabric packed" },
    { label: "Dispatched", time: "02:15 PM", desc: "Leaving Hafiz Baba Nagar Hub" },
    { label: "Out For Delivery", time: "04:30 PM", desc: "Courier on route in Hyderabad" },
    { label: "Delivered", time: "Pending", desc: "Handover complete" }
  ];

  return (
    <div className="space-y-12 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Status Feedback</h2>
        <span className="text-[8px] font-mono text-[#00ff9d] bg-[#00ff9d]/10 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live Tracking</span>
      </div>

      <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 space-y-8 relative overflow-hidden">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
               <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Active Transmission</span>
               <h3 className="text-lg font-mono font-bold tracking-widest text-[#00ff9d]">{orderId}</h3>
            </div>
            <div className="text-right">
               <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Estimated Handoff</span>
               <p className="text-xs font-mono text-white/80 uppercase tracking-wider">Today, before 8:00 PM</p>
            </div>
         </div>

         <div className="relative py-4">
            <div className="hidden md:block absolute top-[19px] left-8 right-8 h-[2px] bg-white/5 -z-10" />
            <div 
               className="hidden md:block absolute top-[19px] left-8 h-[2px] bg-gradient-to-r from-[#00ff9d] to-emerald-400 -z-10 transition-all duration-1000"
               style={{ width: `${(currentStep / 4) * 85}%` }} 
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
               {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isActive = idx === currentStep;
                  return (
                     <div key={idx} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group">
                        <div className={cn(
                           "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0",
                           isCompleted 
                             ? "bg-black border-[#00ff9d] text-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.2)]" 
                             : "bg-[#050508] border-white/10 text-white/20"
                        )}>
                           <CheckCircle2 size={16} className={cn("transition-transform duration-500", isActive && "scale-125")} />
                        </div>
                        
                        <div className="space-y-1">
                           <p className={cn(
                              "text-[10px] font-mono font-bold uppercase tracking-widest",
                              isCompleted ? "text-white" : "text-white/20"
                           )}>
                              {step.label}
                           </p>
                           <p className="text-[8px] font-mono text-white/40 uppercase">{isCompleted && idx !== currentStep ? step.time : step.label === "Delivered" && currentStep < 4 ? "Pending" : "Active"}</p>
                           <p className="text-[8px] font-mono text-white/20 uppercase max-w-[150px] mx-auto leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-[9px] font-mono uppercase tracking-widest text-white/40 leading-relaxed">
            <div className="flex items-center gap-2">
               <MapPin size={12} className="text-[#00ff9d]" />
               <span>Origin Hub: Hafiz Baba Nagar, Hyderabad, Telangana</span>
            </div>
            <div>
               <span>Verification Status: <span className="text-green-400">✅ Synced with LUXE OS</span></span>
            </div>
         </div>
      </div>
    </div>
  );
}

function SupportCenter() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "bot", text: "Welcome to LUXE Live Concierge. How may I assist you with your neural sync session or orders today?" }
  ]);
  const [inputText, setInputText] = useState("");

  // Stylist schedule state
  const [stylistDate, setStylistDate] = useState("");
  const [stylistTime, setStylistTime] = useState("");

  // Feedback form state
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);

  React.useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      if (user) {
        try {
          const isAdmin = user.email?.toLowerCase() === "abdulquader057@gmail.com";
          if (isAdmin) {
            // Admin fetches all orders in the system
            const { data, error } = await supabase
              .from("orders")
              .select("*")
              .order("created_at", { ascending: false });
            if (!error && data) {
              setOrders(data);
            } else {
              setOrders([]);
            }
          } else {
            // Check if user.id is a valid UUID
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
            if (isUuid) {
              const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("customer_id", user.id)
                .order("created_at", { ascending: false });
              if (!error && data) {
                setOrders(data);
              } else {
                setOrders([]);
              }
            } else {
              // For fallback local mock accounts, they won't have real orders in DB
              setOrders([]);
            }
          }
        } catch (err) {
          console.error("Error fetching database orders:", err);
          setOrders([]);
        }
      } else {
        // Unauthenticated Guest sees mock order logs to see how it works!
        setOrders([
          {
            id: "ord-98741",
            created_at: new Date().toISOString(),
            total_price: 4398,
            status: "shipped",
            delivery_address: "102 Cognitive Way, Hyderabad, IN"
          },
          {
            id: "ord-88321",
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            total_price: 2999,
            status: "delivered",
            delivery_address: "102 Cognitive Way, Hyderabad, IN"
          }
        ]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = { sender: "user", text: inputText };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputText("");

    setTimeout(() => {
      let botResponse = "Your request has been logged. An expert concierge will contact you shortly.";
      if (inputText.toLowerCase().includes("order")) {
        botResponse = "I see your active orders are currently in transit. We are optimizing shipping protocols for Mars Colony and Neural District.";
      } else if (inputText.toLowerCase().includes("size") || inputText.toLowerCase().includes("ar")) {
        botResponse = "To recalibrate your size profile, please run the Interactive AR Scanner under preferences.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  const handleScheduleStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stylistDate || !stylistTime) {
      toast.error("Please fill in both Date and Time.");
      return;
    }
    toast.success(`Styling session scheduled for ${stylistDate} at ${stylistTime}!`);
    setActiveModal(null);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter feedback before submitting.");
      return;
    }
    toast.success("Redirecting to Google Reviews...");
    setFeedbackText("");
    setActiveModal(null);
    setTimeout(() => {
      window.open("https://www.google.com/search?q=luxe+fashion+hyderabad+reviews", "_blank");
    }, 1000);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Support Terminal</h2>
        <div className="text-[8px] font-mono text-white/30 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
          {user ? "Authenticated" : "Guest Mode"}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Direct Link</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/20 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <MessageSquare size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-mono font-bold tracking-widest uppercase">Live Concierge</h4>
                       <p className="text-[9px] font-mono text-white/30 uppercase">Estimated response: 2m</p>
                    </div>
                 </div>
                 <LuxeButton size="sm" className="w-full" onClick={() => setActiveModal("chat")}>Initialize Chat</LuxeButton>
              </div>

              <div className="p-6 rounded-[24px] bg-accent/5 border border-accent/20 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-mono font-bold tracking-widest uppercase">Expert Stylist</h4>
                       <p className="text-[9px] font-mono text-yellow-500 uppercase font-bold">Stylists Offline (Fully Booked)</p>
                    </div>
                 </div>
                 <LuxeButton variant="outline" size="sm" className="w-full opacity-60" onClick={() => setActiveModal("stylist")}>Stylist Offline</LuxeButton>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Transmission</h3>
            <div className="space-y-4">
               <LuxeButton variant="outline" className="w-full justify-between" onClick={() => setActiveModal("faq")}>
                  OPEN FAQ ARCHIVE <ChevronRight size={14} />
               </LuxeButton>
               <LuxeButton variant="outline" className="w-full justify-between" onClick={() => setActiveModal("feedback")}>
                  SUBMIT SYSTEM FEEDBACK <ChevronRight size={14} />
               </LuxeButton>
            </div>
         </div>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
         <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-6">Recent Order Logs</h3>
         <div className="space-y-4">
            {loading ? (
               <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Accessing Neural Database...</div>
            ) : orders.length > 0 ? (
               orders.map((order) => (
                 <OrderRow 
                   key={order.id} 
                   id={order.id.startsWith("ord-") ? `LX-${order.id.slice(4).toUpperCase()}` : `LX-${order.id.slice(0, 4).toUpperCase()}`} 
                   status={order.status || "Processing"} 
                   date={new Date(order.created_at).toLocaleDateString()} 
                 />
               ))
            ) : (
               <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                 {user ? "No order records found in your archive." : "No orders placed yet."}
               </div>
            )}
         </div>
      </div>

      {/* Support Modals */}
      <AnimatePresence>
        {activeModal === "chat" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl relative z-10">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-lg font-display italic">LUXE Live Concierge</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5"><X size={18} /></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {chatMessages.map((m, i) => (
                  <div key={i} className={cn("flex flex-col max-w-[80%] rounded-2xl p-4 text-xs font-mono leading-relaxed", 
                    m.sender === "bot" ? "bg-white/5 text-white/80 self-start" : "bg-primary/20 text-white self-end border border-primary/30")}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2 bg-white/[0.01]">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message to Concierge..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary/40 text-white"
                />
                <button type="submit" className="p-3 bg-primary text-[var(--primary-color)] border border-primary/20 rounded-xl hover:opacity-90 transition-opacity"><Send size={14} /></button>
              </form>
            </motion.div>
          </div>
        )}

        {activeModal === "stylist" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 text-left">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-light italic">Schedule Expert Stylist</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5"><X size={18} /></button>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-[10px] font-mono uppercase tracking-wider mb-6 leading-relaxed">
                ⚠️ Currently, our expert fashion designers are fully booked. Stylist services and scheduling numbers are temporarily unavailable at this time.
              </div>
              <form onSubmit={handleScheduleStylist} className="space-y-4 opacity-40 pointer-events-none">
                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Select Date</label>
                  <input 
                    type="date" 
                    disabled
                    value={stylistDate}
                    onChange={(e) => setStylistDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Select Time Slot</label>
                  <input 
                    type="time" 
                    disabled
                    value={stylistTime}
                    onChange={(e) => setStylistTime(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-white"
                  />
                </div>
                <button type="submit" disabled className="w-full py-4 bg-white/10 text-white/40 rounded-xl text-xs font-mono uppercase tracking-widest font-bold mt-4 cursor-not-allowed">Confirm Schedule</button>
              </form>
            </motion.div>
          </div>
        )}

        {activeModal === "faq" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-light italic">FAQ Archive</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5"><X size={18} /></button>
              </div>
              <div className="space-y-6">
                {[
                  { q: "How does the AI Stylist work?", a: "The AI Stylist maps your style preferences and uses advanced LLM processing to curates custom coordinates and recommends drops that fit your personality." },
                  { q: "Is the 3D Virtual Turntable fully interactive?", a: "Yes, you can click and drag to orbit and inspect accessories. The renderer simulates premium metal, crystal, and fabric reflections." },
                  { q: "What is global teleport shipping?", a: "Available to Luxe Elite and Neural Vanguard tiers, teleport shipping uses priority courier links to deliver artifacts in under 24 hours globally." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2 border-b border-white/5 pb-4">
                    <h4 className="text-xs font-mono text-primary uppercase tracking-widest">{item.q}</h4>
                    <p className="text-[11px] font-mono text-white/50 leading-relaxed uppercase">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeModal === "feedback" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-light italic">Submit System Feedback</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5"><X size={18} /></button>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Rate System Performance</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button 
                        type="button" 
                        key={num}
                        onClick={() => setFeedbackRating(num)}
                        className={cn("w-10 h-10 rounded-xl border text-xs font-mono cursor-pointer transition-all", 
                          feedbackRating === num ? "bg-primary border-primary text-[var(--primary-color)]" : "border-white/10 text-white")}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Feedback Description</label>
                  <textarea 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter your system feedback here..."
                    rows={4}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-primary/40"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[var(--primary-color)] text-black rounded-xl text-xs font-mono uppercase tracking-widest font-bold mt-4 hover:scale-[1.01] transition-transform cursor-pointer">Submit Feedback</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- UTILS ---

function AddressCard({ type, address, isNew }: { type: string; address: string; isNew?: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-6 rounded-2xl border transition-all cursor-pointer group",
        isNew ? "border-white/5 bg-white/[0.02] hover:border-primary/40" : "border-primary/20 bg-primary/5"
      )}
    >
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{type}</span>
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <X size={12} className="text-white/40" />
          </div>
       </div>
       <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">{address}</p>
    </motion.div>
  );
}

function BenefitItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between">
       <span className={cn("text-[10px] font-mono uppercase tracking-widest", active ? "text-white/80" : "text-white/20")}>{label}</span>
       {active ? <CheckCircle2 size={14} className="text-primary" /> : <div className="w-3 h-3 rounded-full border border-white/10" />}
    </div>
  );
}

function NotificationToggle({ title, desc, active, onChange }: { title: string; desc: string; active?: boolean; onChange?: () => void }) {
  return (
    <div className="p-6 rounded-[24px] bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
       <div className="space-y-1">
          <h4 className="text-sm font-mono font-bold tracking-widest uppercase">{title}</h4>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{desc}</p>
       </div>
       <Toggle active={active || false} onChange={onChange} />
    </div>
  );
}

function OrderRow({ id, status, date }: { id: string; status: string; date: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 2, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
      whileTap={{ scale: 0.99 }}
      className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer group"
    >
       <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{id}</span>
          <span className="text-[8px] font-mono text-white/20 uppercase">{date}</span>
       </div>
       <div className="flex items-center gap-4">
          <span className={cn(
            "text-[8px] font-mono uppercase tracking-widest",
            status === "Delivered" || status === "delivered" ? "text-primary" : "text-yellow-400"
          )}>{status}</span>
          <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
       </div>
    </motion.div>
  );
}

function ThemeSettings() {
  const { user, profile } = useAuth();
  const [activeTheme, setActiveTheme] = useState("Noir Gold");
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
    setActiveTheme(savedTheme);

    const checkGold = () => {
      try {
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        const hasGoldLevel = (user?.user_metadata?.style_dna?.level || 0) >= 3;
        const isGoldProfile = profile?.tier === "Gold" || profile?.role === "admin";

        setIsGold(isGoldLocal || hasGoldLevel || isGoldProfile);
      } catch (e) {}
    };
    checkGold();
  }, [user, profile]);

  const handleSelectTheme = async (themeName: string, isExclusive: boolean) => {
    if (isExclusive && !isGold) {
      toast.error("🔒 Theme Locked. Unlock exclusive themes by reaching Gold loyalty tier!");
      return;
    }

    setActiveTheme(themeName);
    localStorage.setItem("luxe-theme", themeName);
    setCookie("luxe-theme", themeName, 365);
    
    // Trigger global theme apply
    const event = new CustomEvent("luxe-theme-change", { detail: themeName });
    window.dispatchEvent(event);

    if (user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ theme_preference: themeName })
          .eq("id", user.id);
        
        if (error) {
          // If theme_preference doesn't exist, save inside user metadata
          const { error: metaError } = await supabase.auth.updateUser({
            data: { theme_preference: themeName }
          });
          if (metaError) throw metaError;
        }
      } catch (err) {
        console.warn("Could not save theme to Supabase:", err);
      }
    }
    toast.success(`Theme updated to ${themeName}!`);
  };

  const themeList = [
    { name: "Noir Gold", bg: "#0A0A0F", card: "#12121A", text: "#F0EDE8", accent: "#C9A84C", desc: "Classic dark theme with warm gold accents.", exclusive: false },
    { name: "Champagne", bg: "#1A1610", card: "#22200A", text: "#F5EDD5", accent: "#E8C97A", desc: "Crisp and luxurious champagne style.", exclusive: false },
    { name: "Deep Slate", bg: "#0D1117", card: "#111827", text: "#E8EDF5", accent: "#7B9CCC", desc: "Professional deep slate look.", exclusive: false },
    { name: "Burgundy Luxe", bg: "#120810", card: "#1E0E1A", text: "#F5E0E8", accent: "#C9506A", desc: "Rich and moody burgundy essence.", exclusive: false },
    { name: "Royal Obsidian", bg: "#080B14", card: "#0E1220", text: "#EDE8FF", accent: "#8B6FD4", desc: "Exclusive obsidian with animated borders.", exclusive: true },
    { name: "Cognac", bg: "#0F0800", card: "#1F1000", text: "#FFE8CC", accent: "#D4AF37", desc: "Warm rich cognac with ember glows.", exclusive: true },
    { name: "Midnight Rose", bg: "#080510", card: "#100818", text: "#FFE8F0", accent: "#E8A0B0", desc: "Subtle rose shimmer on midnight sky.", exclusive: true }
  ];

  return (
    <div className="space-y-12 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Theme Configuration Hub</h2>
        <div className="text-[8px] font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Calibrated</div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeList.map((theme) => {
          const isSelected = activeTheme === theme.name;
          const isLocked = theme.exclusive && !isGold;

          return (
            <motion.div
              key={theme.name}
              whileHover={{ scale: isLocked ? 1.0 : 1.03, y: isLocked ? 0 : -4 }}
              whileTap={{ scale: isLocked ? 1.0 : 0.98 }}
              onClick={() => handleSelectTheme(theme.name, theme.exclusive)}
              className={cn(
                "p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[180px] relative overflow-hidden",
                isSelected 
                  ? "border-[#D4AF37] bg-white/[0.03] shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                  : isLocked 
                    ? "border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed" 
                    : "border-white/10 bg-white/[0.02] hover:border-[#D4AF37]/50"
              )}
              style={{
                boxShadow: isSelected ? `0 0 25px -5px ${theme.accent}` : "none"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    {theme.name}
                  </h4>
                  {isSelected ? (
                    <CheckCircle2 size={16} className="text-[#D4AF37]" />
                  ) : isLocked ? (
                    <Lock size={16} className="text-[#D4AF37]" />
                  ) : null}
                </div>
                <p className="text-[10px] font-sora text-white/40 leading-relaxed">
                  {theme.desc}
                </p>
              </div>

              <div className="flex gap-2 items-center mt-4">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} title="Background" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.card }} title="Card/Surface" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.text }} title="Text Color" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.accent }} title="Accent" />
                {theme.exclusive && (
                  <span className="text-[7px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase ml-auto tracking-widest">
                    Gold Member
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
