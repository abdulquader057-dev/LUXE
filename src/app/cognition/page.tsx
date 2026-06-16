"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Globe, Server, Activity, ShieldAlert, Cpu, X, Terminal, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CognitionHub() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [activeNode, setActiveNode] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (!activeNode) return;
    
    // Simulate rolling terminal logs for the active node
    setLogs([`Initializing node sync: ${activeNode.title.toUpperCase()}...`, "Accessing secure proxy...", "Uplink established."]);
    
    const interval = setInterval(() => {
      const randomLogs = activeNode.logPool;
      const nextLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${nextLog}`]);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeNode]);

  const handleSyncNode = () => {
    setIsSyncing(true);
    toast.success(`Recalibrating ${activeNode?.title} node parameters...`);
    setTimeout(() => {
      setIsSyncing(false);
      setLogs((prev) => [...prev, `[SYSTEM] Node recalibrated. Efficiency optimized to 99.98%.`]);
    }, 2000);
  };

  const nodes = [
    {
      icon: Globe,
      title: "Global Logistics",
      desc: "Real-time tracking of automated supply chains. Current network efficiency: 99.8%.",
      status: "Operational",
      btnText: "ACCESS LOGISTICS FEED",
      logPool: [
        "Cargo drone LX-492 departing Singapore Hub.",
        "Customs protocol cleared at Rotterdam Port.",
        "Smart container temperature nominal: 22°C.",
        "Optimizing routing vectors for Mars Colony Alpha.",
        "Cargo drone LX-493 arriving Tokyo Depot.",
        "Delivery sequence verified for Customer ID 9214."
      ]
    },
    {
      icon: Server,
      title: "Data Integrity",
      desc: "Encrypted neural vaults protecting user identity and style preference vectors.",
      status: "Secured",
      btnText: "DECRYPT VAULT RECORDS",
      logPool: [
        "Verifying integrity hash for user profiles...",
        "SSL Handshake completed with central vault.",
        "User style vectors locked behind AES-256.",
        "Intrusion prevention system: 0 alerts.",
        "Generating new cryptographic profile keys...",
        "Data sync complete. 100% block integrity."
      ]
    },
    {
      icon: Activity,
      title: "AI Synthesis",
      desc: "Predictive modeling for upcoming fashion trends. Model generation currently active.",
      status: "Processing",
      btnText: "VIEW MODEL ENGINE",
      logPool: [
        "Analyzing fashion sentiment from community feed...",
        "Deep learning model training at epoch 492/500.",
        "Generated new clothing silhouette recommendation.",
        "Aesthetic index score: 98.4 (Premium).",
        "Updating dynamic catalog item predictions...",
        "Model synthesis active. Latency: 4ms."
      ]
    },
    {
      icon: ShieldAlert,
      title: "Neural Policy",
      desc: "Ethical AI usage guidelines and user privacy architecture protocols.",
      status: "Enforced",
      btnText: "READ POLICY ARCHIVE",
      logPool: [
        "Auditing neural stylists for compliance...",
        "Decentralized identity protocol verification: PASS.",
        "Enforcing user-controlled data access limits.",
        "Auditing Supabase RLS security policies...",
        "Bypassing third-party trackers. Privacy index: 100%.",
        "Policy guidelines successfully broadcasted."
      ]
    },
    {
      icon: Cpu,
      title: "Core Servers",
      desc: "Server cluster telemetry. Latency: 12ms. Processing load: 45%.",
      status: "Nominal",
      btnText: "CHECK SERVER TELEMETRY",
      logPool: [
        "CPU Core temperature: 38°C (Nominal).",
        "Vercel deployment ping response: 12ms.",
        "Supabase cluster load: 14% memory, 8% CPU.",
        "Synchronizing cloud database replicas...",
        "Clearing static page caches on Edge Network.",
        "All server clusters report NOMINAL status."
      ]
    }
  ];

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="flex flex-col items-center justify-center mb-20 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_50px_rgba(0,240,255,0.2)]"
        >
          <BrainCircuit size={48} className="text-primary animate-pulse" />
        </motion.div>
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-7xl font-orbitron tracking-widest text-white mb-6 uppercase"
        >
          Neural <span className="text-primary">Cognition</span> Hub
        </motion.h1>
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-sm font-sora text-white/50 max-w-2xl tracking-widest leading-relaxed uppercase"
        >
          Global Logistics • Artificial Intelligence Policy • System Status
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nodes.map((node, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02, backgroundColor: "rgba(0, 240, 255, 0.02)", border: "1px solid rgba(0, 240, 255, 0.2)" }}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 15,
              delay: 0.2 + (i * 0.1) 
            }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:text-primary transition-colors">
                  <node.icon size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-primary/70 tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {node.status}
                </div>
              </div>
              <h3 className="text-xl font-display font-light italic mb-3 text-white">{node.title}</h3>
              <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase mb-6">{node.desc}</p>
            </div>
            
            <motion.button 
              onClick={() => setActiveNode(node)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono tracking-widest uppercase hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 cursor-pointer"
            >
              {node.btnText}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Node Logs Modal */}
      <AnimatePresence>
        {activeNode && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveNode(null)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[550px] shadow-2xl relative z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-primary animate-pulse" />
                  <h3 className="text-lg font-display italic text-white">{activeNode.title} Node Feed</h3>
                </div>
                <button 
                  onClick={() => setActiveNode(null)} 
                  className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Console log list */}
              <div className="flex-1 p-6 bg-black/40 font-mono text-[10px] text-green-400 space-y-2 overflow-y-auto custom-scrollbar flex flex-col justify-start">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed border-l border-green-500/20 pl-3">
                    {log}
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-white/10 bg-white/[0.01] flex justify-between items-center gap-4">
                <span className="text-[9px] font-mono text-white/30 uppercase">Secure telemetry synclink.</span>
                <button 
                  onClick={handleSyncNode}
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-primary/20 border border-primary/30 text-primary rounded-xl text-[9px] font-mono tracking-widest uppercase hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center gap-2"
                >
                  <RefreshCw size={12} className={cn(isSyncing && "animate-spin")} />
                  {isSyncing ? "Syncing..." : "Sync Parameters"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
