"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, CreditCard, MapPin, 
  Settings2, Shirt, Watch, Crown, 
  Bell, HelpCircle, Camera, Cpu, 
  History, Share2, MessageSquare, 
  CheckCircle2, ChevronRight, X,
  LogOut, Globe, Moon, Eye, Sparkles, Diamond, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import LuxeButton from "@/components/ui/LuxeButton";

const SETTINGS_MENU = [
  { id: "account", label: "Account", icon: User, color: "#00f2ff" },
  { id: "preferences", label: "Preferences", icon: Shirt, color: "#c084fc" },
  { id: "accessories", label: "Accessory Hub", icon: Watch, color: "#ffcc00" },
  { id: "subscription", label: "Luxe Elite", icon: Crown, color: "#ff4466" },
  { id: "notifications", label: "Status Feed", icon: Bell, color: "#00ff9d" },
  { id: "support", label: "Support", icon: HelpCircle, color: "#f8f8f8" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
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
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 group relative overflow-hidden",
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
                  </button>
                );
              })}
            </nav>

            {/* Logout / Secondary Action */}
            <div className="pt-8 border-t border-white/[0.03]">
              <button className="w-full flex items-center gap-4 px-6 py-4 text-red-400/60 hover:text-red-400 transition-colors group">
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase">Terminate Session</span>
              </button>
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
    </main>
  );
}

// --- SUB-COMPONENTS ---

function AccountSettings() {
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
             <InputField label="Name" placeholder="Abdul Quader" />
             <InputField label="Email" placeholder="abdul@luxe.ai" />
             <LuxeButton size="sm">Update Identity</LuxeButton>
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
                <Toggle active={true} />
             </div>
             <LuxeButton variant="outline" size="sm" className="w-full">Modify Password</LuxeButton>
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
            <div className="aspect-video rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative overflow-hidden group">
               <Camera size={40} className="text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,204,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="absolute bottom-4 text-[8px] font-mono text-primary uppercase tracking-[0.5em]">Initialize AR Scanner</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Material Filter</h3>
            <div className="flex flex-wrap gap-2">
               {["Silk", "Merino Wool", "Bioplastic", "Chrome Fiber", "Organic Cotton"].map(m => (
                 <button key={m} className="px-4 py-2 rounded-full border border-white/10 text-[9px] font-mono uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">
                   {m}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Fit Profile</h3>
              <div className="grid grid-cols-3 gap-2">
                 {["Oversized", "Athletic", "Skin"].map(f => (
                   <button key={f} className={cn(
                     "p-4 rounded-2xl border text-[9px] font-mono uppercase tracking-widest transition-all",
                     f === "Oversized" ? "bg-primary text-black border-primary" : "border-white/5 text-white/40"
                   )}>
                     {f}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Personalization</h3>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Monogramming</span>
                    <Toggle active={false} />
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

function AccessoryHub() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Accessory Selection</h2>
        <div className="text-[8px] font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Premium</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <AccessoryCategory icon={Watch} title="Horology" count={12} />
         <AccessoryCategory icon={Diamond} title="Jewelry" count={8} />
         <AccessoryCategory icon={ShoppingBag} title="Artifacts" count={24} />
      </div>

      <div className="glass-panel !rounded-[24px] p-8 border border-white/5 relative overflow-hidden">
         <div className="relative z-10 space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">360° Inspection Module</h3>
            <div className="h-64 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
               <span className="text-[10px] font-mono text-primary/40 uppercase tracking-[1em] animate-pulse">Initializing Virtual Turntable</span>
            </div>
            <div className="flex justify-center gap-4">
               <LuxeButton size="sm" variant="outline">Calibrate View</LuxeButton>
               <LuxeButton size="sm">Capture Snapshot</LuxeButton>
            </div>
         </div>
      </div>
    </div>
  );
}

function SubscriptionServices() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Elite Membership</h2>
        <div className="text-[8px] font-mono text-red-400 bg-red-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Tier 1</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="p-8 rounded-[32px] bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 space-y-6 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <Crown className="text-primary" size={32} />
            <div className="space-y-2">
               <h3 className="text-2xl font-display font-light italic">Luxe Elite</h3>
               <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  Priority drops, free global teleport shipping, and direct neural link to master stylists.
               </p>
            </div>
            <div className="text-3xl font-display font-light">$49<span className="text-sm">/MO</span></div>
            <LuxeButton className="w-full">Renew Status</LuxeButton>
         </div>

         <div className="space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Elite Benefits</h3>
            <div className="space-y-4">
               <BenefitItem label="Priority Access" active />
               <BenefitItem label="Master Stylist Sessions" active />
               <BenefitItem label="Neural Style Guides" active />
               <BenefitItem label="Custom UI Theme" />
            </div>
         </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Status Feedback</h2>
        <div className="text-[8px] font-mono text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Connected</div>
      </div>

      <div className="space-y-4">
         <NotificationToggle 
           title="Order Updates" 
           desc="Real-time tracking and delivery sequence logs."
           active
         />
         <NotificationToggle 
           title="Exclusive Drops" 
           desc="Neural alerts for limited edition artifacts."
           active
         />
         <NotificationToggle 
           title="Fashion Insights" 
           desc="Weekly architectural digests and trend forecasts."
         />
         <NotificationToggle 
           title="System Status" 
           desc="Critical app updates and security protocols."
           active
         />
      </div>
    </div>
  );
}

function SupportCenter() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-light italic">Support Terminal</h2>
        <div className="text-[8px] font-mono text-white/30 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">V.4.2</div>
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
                 <LuxeButton size="sm" className="w-full">Initialize Chat</LuxeButton>
              </div>

              <div className="p-6 rounded-[24px] bg-accent/5 border border-accent/20 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm font-mono font-bold tracking-widest uppercase">Expert Stylist</h4>
                       <p className="text-[9px] font-mono text-white/30 uppercase">Next Slot: 14:00 GMT</p>
                    </div>
                 </div>
                 <LuxeButton variant="outline" size="sm" className="w-full">Schedule Session</LuxeButton>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Transmission</h3>
            <div className="space-y-4">
               <LuxeButton variant="outline" className="w-full justify-between">
                  OPEN FAQ ARCHIVE <ChevronRight size={14} />
               </LuxeButton>
               <LuxeButton variant="outline" className="w-full justify-between">
                  SUBMIT SYSTEM FEEDBACK <ChevronRight size={14} />
               </LuxeButton>
            </div>
         </div>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
         <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-6">Recent Order Logs</h3>
         <div className="space-y-4">
            <OrderRow id="LX-9942" status="In Transit" date="May 14, 2026" />
            <OrderRow id="LX-9831" status="Delivered" date="May 10, 2026" />
         </div>
      </div>
    </div>
  );
}

// --- UTILS ---

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest ml-4">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-primary/40 transition-all"
      />
    </div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div className={cn(
      "w-10 h-5 rounded-full relative transition-colors duration-500",
      active ? "bg-primary" : "bg-white/10"
    )}>
      <motion.div 
        animate={{ x: active ? 22 : 4 }}
        className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
      />
    </div>
  );
}

function AddressCard({ type, address, isNew }: { type: string; address: string; isNew?: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all cursor-pointer group",
      isNew ? "border-white/5 bg-white/[0.02] hover:border-primary/40" : "border-primary/20 bg-primary/5"
    )}>
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{type}</span>
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <X size={12} className="text-white/40" />
          </div>
       </div>
       <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">{address}</p>
    </div>
  );
}

function AccessoryCategory({ icon: Icon, title, count }: { icon: any; title: string; count: number }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all cursor-pointer group">
       <Icon size={24} className="text-primary/40 group-hover:text-primary transition-colors mb-4" />
       <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1">{title}</h4>
       <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{count} AR Artifacts</span>
    </div>
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

function NotificationToggle({ title, desc, active }: { title: string; desc: string; active?: boolean }) {
  return (
    <div className="p-6 rounded-[24px] bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
       <div className="space-y-1">
          <h4 className="text-sm font-mono font-bold tracking-widest uppercase">{title}</h4>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{desc}</p>
       </div>
       <Toggle active={active || false} />
    </div>
  );
}

function OrderRow({ id, status, date }: { id: string; status: string; date: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer group">
       <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{id}</span>
          <span className="text-[8px] font-mono text-white/20 uppercase">{date}</span>
       </div>
       <div className="flex items-center gap-4">
          <span className={cn(
            "text-[8px] font-mono uppercase tracking-widest",
            status === "Delivered" ? "text-primary" : "text-yellow-400"
          )}>{status}</span>
          <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
       </div>
    </div>
  );
}
