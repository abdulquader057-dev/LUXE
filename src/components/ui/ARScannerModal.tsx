"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Scan, CheckCircle2, ChevronRight, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface ARScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ARScannerModal = ({ isOpen, onClose }: ARScannerModalProps) => {
  const [scanningStatus, setScanningStatus] = useState<"initializing" | "scanning" | "analyzing" | "complete">("initializing");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setScanningStatus("initializing");
    setProgress(0);

    // Simulate accessing camera and scanning
    
    
    // Request camera access (simulated for demo purposes, but attempts real camera if available)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => console.log("Camera access denied or unavailable", err));
    }

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1500));
      setScanningStatus("scanning");
      
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 100));
      }

      setScanningStatus("analyzing");
      await new Promise(r => setTimeout(r, 2000));
      setScanningStatus("complete");
    };

    sequence();

    return () => {
      
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-3xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors z-[510]"
        >
          <X size={20} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl aspect-[4/3] md:aspect-video bg-[#050508] rounded-[48px] overflow-hidden border border-primary/20 shadow-[0_0_100px_rgba(0,242,255,0.15)]"
        >
          {/* Camera Feed Background */}
          <div className="absolute inset-0 bg-[#111]">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover opacity-40 mix-blend-screen"
            />
          </div>

          {/* AR UI Overlay */}
          <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
            {/* Top HUD */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">Live Feed</span>
                </div>
                <div className="text-[8px] font-mono text-primary/50 tracking-[0.4em] uppercase">
                  Matrix AR Vision v3.4
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-display text-white/90 font-light tabular-nums">
                  {progress}%
                </div>
                <div className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">
                  {scanningStatus}
                </div>
              </div>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-white/20" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-px h-8 bg-white/20" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-px bg-white/20" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-px bg-white/20" />
              
              {scanningStatus === "scanning" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-full bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 absolute top-0"
                />
              )}
              
              {scanningStatus === "complete" && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
              )}
            </div>

            {/* Corners */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/50" />

            {/* Bottom HUD */}
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-[0.2em] text-white/50">
                  Target: <span className="text-white">Neural Silhouette</span>
                </div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-white/50">
                  Precision: <span className="text-primary">99.8%</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-white/10 transition-colors">
                  <Maximize size={16} className="text-white/70" />
                </button>
                <button className="px-6 h-12 rounded-full bg-primary text-black font-black tracking-widest text-[10px] uppercase pointer-events-auto hover:bg-white transition-colors flex items-center gap-2">
                  <Scan size={14} /> Scan Environment
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

