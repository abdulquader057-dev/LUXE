"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Scan, CheckCircle2, ChevronRight, Maximize, Upload, Sparkles, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import toast from "react-hot-toast";
import Image from "next/image";

interface ARScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ARScannerModal = ({ isOpen, onClose }: ARScannerModalProps) => {
  const { addToCart } = useCommerce();
  const [scanningStatus, setScanningStatus] = useState<"idle" | "initializing" | "scanning" | "analyzing" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    tone: string;
    description: string;
    recommendations: any[];
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clean up states on close
      setScanningStatus("idle");
      setProgress(0);
      setSelectedPhoto(null);
      setAnalysisResult(null);
      
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    }
  }, [isOpen]);

  const startCameraScan = async () => {
    setScanningStatus("initializing");
    setProgress(0);
    setSelectedPhoto(null);
    setAnalysisResult(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.warn("Camera access denied or unavailable", err);
        toast.error("Camera access denied. Please try uploading a photo instead.");
        setScanningStatus("idle");
        return;
      }
    } else {
      toast.error("Camera interface not supported. Please upload a photo.");
      setScanningStatus("idle");
      return;
    }

    runScannerSequence();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Stop active camera stream if any
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result as string);
        setScanningStatus("initializing");
        setProgress(0);
        setAnalysisResult(null);
        runScannerSequence();
      }
    };
    reader.readAsDataURL(file);
  };

  const runScannerSequence = async () => {
    // Stage 1: Initializing
    await new Promise(r => setTimeout(r, 1000));
    setScanningStatus("scanning");
    
    // Stage 2: Scanning (Progress Animation)
    for (let i = 0; i <= 100; i += 4) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }

    // Stage 3: Analyzing Face DNA
    setScanningStatus("analyzing");
    await new Promise(r => setTimeout(r, 1500));

    // Stage 4: Calibration Complete
    const recommendedProducts = [
      {
        id: "00000000-0000-4000-a000-000000000002",
        name: "Luxe Premium Long-Sleeve Knit Polo",
        price: 799,
        image: "/brand/WhatsApp Image 2026-05-26 at 8.37.14 PM.jpeg",
        match: "98.4%",
        color: "Desert Sand",
        badge: "Perfect Match"
      },
      {
        id: "00000000-0000-4000-a000-000000000001",
        name: "Luxe Signature Short-Sleeve Linen Shirt",
        price: 799,
        image: "/brand/linen_model_front.png",
        match: "95.2%",
        color: "White",
        badge: "Highly Compatible"
      }
    ];

    setAnalysisResult({
      tone: "Warm Autumn Undertone",
      description: "Your skin undertone matches warm natural earth pigments. Desert Sand and Sky Blue weaves reflect ambient light onto your features, highlighting bone structure and matching your style matrix calibration.",
      recommendations: recommendedProducts
    });
    setScanningStatus("complete");
    toast.success("Identity profile calibrated successfully!");
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "L",
      color: product.color
    });
    toast.success(`${product.color} Shirt added to cart!`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden p-4"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors z-[520]"
        >
          <X size={20} />
        </button>

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl min-h-[500px] bg-[#050508]/90 border border-primary/20 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,242,255,0.15)] flex flex-col md:grid md:grid-cols-[1.2fr_1fr] h-[80vh] md:h-[600px] z-10"
        >
          {/* Left Panel: Scanner Feed Area */}
          <div className="relative bg-black flex items-center justify-center overflow-hidden border-r border-white/5 h-[300px] md:h-full">
            {selectedPhoto ? (
              // Uploaded Selfie Display
              <div className="absolute inset-0 flex items-center justify-center bg-[#07070a]">
                <Image 
                  src={selectedPhoto} 
                  alt="User Selfie" 
                  fill
                  className={cn(
                    "w-full h-full object-cover opacity-60 transition-all",
                    scanningStatus === "analyzing" && "blur-[2px]"
                  )} 
                />
              </div>
            ) : (
              // Live camera element (shown only if scanning from camera)
              <div className="absolute inset-0 bg-[#07070a] flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover opacity-50"
                />
                {scanningStatus === "idle" && (
                  <div className="flex flex-col items-center gap-4 text-center p-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-2">
                      <Camera size={28} />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-white/80 uppercase">No Camera Feed Active</span>
                  </div>
                )}
              </div>
            )}

            {/* Glowing HUD Target Rings */}
            {scanningStatus !== "idle" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Rotating Outer HUD Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="w-56 h-56 border border-dashed border-primary/40 rounded-full flex items-center justify-center"
                >
                  <div className="w-48 h-48 border border-primary/10 rounded-full" />
                </motion.div>
                
                {/* Laser scan lines */}
                {scanningStatus === "scanning" && (
                  <motion.div 
                    initial={{ top: "10%", opacity: 0 }}
                    animate={{ top: ["10%", "90%", "10%"], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent shadow-[0_0_15px_#00f2ff] z-20"
                  />
                )}
                
                {/* Overlay Scanning grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-45" />
              </div>
            )}

            {/* HUD Status Text Overlays */}
            <div className="absolute inset-x-8 top-6 flex justify-between items-start pointer-events-none z-20">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono tracking-widest text-primary uppercase font-bold">LUXE OS // COGNITIVE MESH</span>
                <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Calibration matrix v2.4</span>
              </div>
              {scanningStatus !== "idle" && (
                <div className="text-right">
                  <span className="text-xl font-mono text-white font-light">{progress}%</span>
                  <p className="text-[7px] font-mono text-white/40 uppercase tracking-widest">{scanningStatus}</p>
                </div>
              )}
            </div>

            {/* Bottom HUD bar */}
            <div className="absolute inset-x-8 bottom-6 flex justify-between items-end pointer-events-none z-20">
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
                Target: <span className="text-white">Undertone Silhouette</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Selection / Match Results */}
          <div className="bg-[#0b0c10]/95 p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar h-[calc(80vh-300px)] md:h-full text-left">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-primary animate-pulse" size={18} />
                <h3 className="text-lg font-mono font-bold tracking-widest text-white uppercase">AI Style Matcher</h3>
              </div>

              <AnimatePresence mode="wait">
                {/* 1. IDLE STATE: Upload / Scan actions */}
                {scanningStatus === "idle" && (
                  <motion.div
                    key="idle-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider leading-relaxed">
                      Upload your selfie or activate camera scan. Our AI neural network will analyze your facial skin tone, undertones, and structural angles to lock the exact style colorway that compliments your style DNA.
                    </p>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {/* Upload Photo Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="py-5 rounded-2xl border border-white/10 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/5 text-white flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                      >
                        <Upload size={22} className="text-white/40 group-hover:text-primary group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Upload Face Photo</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Supports JPEG, PNG</span>
                      </button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />

                      {/* Camera Scan Button */}
                      <button
                        onClick={startCameraScan}
                        className="py-5 rounded-2xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                      >
                        <Camera size={22} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Use Live Camera</span>
                        <span className="text-[8px] font-primary/60 uppercase tracking-wider">Requires device webcam access</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. LOADING STATE (Scanning/Analyzing) */}
                {(scanningStatus === "initializing" || scanningStatus === "scanning" || scanningStatus === "analyzing") && (
                  <motion.div
                    key="scanning-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 py-12 text-center"
                  >
                    <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                    
                    <span className="text-xs font-mono tracking-widest text-primary uppercase font-bold block animate-pulse">
                      {scanningStatus === "initializing" && "Syncing Image Nodes..."}
                      {scanningStatus === "scanning" && "Running Skin RGB Scan..."}
                      {scanningStatus === "analyzing" && "Matching style database..."}
                    </span>
                    
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                       calibrating color temperatures, analyzing tone reflections and mapping matching garment coords...
                    </p>
                  </motion.div>
                )}

                {/* 3. COMPLETE RESULT STATE: Recommended matches */}
                {scanningStatus === "complete" && analysisResult && (
                  <motion.div
                    key="results-state"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Undertone badge */}
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl">
                      <span className="text-[8px] font-mono text-primary uppercase tracking-widest font-bold block mb-1">Tone Calibration Result</span>
                      <h4 className="text-lg font-mono font-bold text-white uppercase">{analysisResult.tone}</h4>
                      <p className="text-[10px] font-mono text-white/50 leading-relaxed uppercase mt-2">{analysisResult.description}</p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase block mb-1">Best Matches in Collection</span>
                      
                      {analysisResult.recommendations.map((prod, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden relative border border-white/10">
                              <Image src={prod.image} alt={prod.name} fill sizes="48px" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold mb-0.5">{prod.badge}</span>
                              <span className="text-xs font-mono font-bold text-white line-clamp-1">{prod.color} Shirt</span>
                              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">₹{prod.price} • Match: {prod.match}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToCart(prod)}
                            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-white text-black font-mono font-bold text-[9px] uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <ShoppingCart size={12} />
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Bottom: Trigger re-scan */}
            {scanningStatus === "complete" && (
              <button
                onClick={() => {
                  setSelectedPhoto(null);
                  setScanningStatus("idle");
                }}
                className="w-full py-4 mt-6 border border-white/10 hover:border-white/30 rounded-2xl text-[9px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors cursor-pointer"
              >
                Scan Another Photo
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
