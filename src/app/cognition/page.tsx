"use client";
import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Globe, Server, Activity, ShieldAlert, Cpu } from "lucide-react";

const CognitionHub = () => {
  return (
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="flex flex-col items-center justify-center mb-20 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
        >
          <BrainCircuit size={48} className="text-primary animate-pulse" />
        </motion.div>
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-7xl font-bebas tracking-widest text-white mb-6 uppercase"
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
        {[
          {
            icon: Globe,
            title: "Global Logistics",
            desc: "Real-time tracking of automated supply chains. Current network efficiency: 99.8%.",
            status: "Operational"
          },
          {
            icon: Server,
            title: "Data Integrity",
            desc: "Encrypted neural vaults protecting user identity and style preference vectors.",
            status: "Secured"
          },
          {
            icon: Activity,
            title: "AI Synthesis",
            desc: "Predictive modeling for upcoming fashion trends. Model generation currently active.",
            status: "Processing"
          },
          {
            icon: ShieldAlert,
            title: "Neural Policy",
            desc: "Ethical AI usage guidelines and user privacy architecture protocols.",
            status: "Enforced"
          },
          {
            icon: Cpu,
            title: "Core Servers",
            desc: "Server cluster telemetry. Latency: 12ms. Processing load: 45%.",
            status: "Nominal"
          }
        ].map((node, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-colors group cursor-crosshair"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:text-primary transition-colors">
                <node.icon size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-primary/70 tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {node.status}
              </div>
            </div>
            <h3 className="text-xl font-display font-light italic mb-3">{node.title}</h3>
            <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase">{node.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CognitionHub;
