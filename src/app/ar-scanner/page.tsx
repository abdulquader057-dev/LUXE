"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, RotateCcw, Sparkles, Sliders, Play, Square, RefreshCw, ZoomIn,
  Upload, Download, AlertCircle, Send, Palette, User, Heart, Info, ArrowLeftRight
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { parseDbProduct, MOCK_PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ARBodyTracker from "@/components/ai/ARBodyTracker";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";

// Calibration constants for Standard Fit
const DEFAULT_SCALE = 1.0;
const DEFAULT_OFFSET_Y = 0;
const DEFAULT_OFFSET_X = 0;
const DEFAULT_ROTATION_Y = 0;
const DEFAULT_PERSPECTIVE = 800;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export default function AIStudioPage() {
  // Tabs: 'fitting' (ER Scanner), 'undertone' (Beta Scanner), 'stylist' (AI Stylist)
  const [activeTab, setActiveTab] = useState<"fitting" | "undertone" | "stylist">("fitting");

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isArTrackingActive, setIsArTrackingActive] = useState(false);
  
  // Transform controls (ER Scanner)
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [offsetY, setOffsetY] = useState(DEFAULT_OFFSET_Y);
  const [offsetX, setOffsetX] = useState(DEFAULT_OFFSET_X);
  const [rotationY, setRotationY] = useState(DEFAULT_ROTATION_Y);
  const [perspective, setPerspective] = useState(DEFAULT_PERSPECTIVE);
  const [isCapturing, setIsCapturing] = useState(false);

  // User input photo for Try-On
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Try-On generation state
  const [tryOnType, setTryOnType] = useState<"photo" | "video">("photo");
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [tryOnResult, setTryOnResult] = useState<{ url: string; type: "image" | "video" } | null>(null);

  // Beta Scanner (Skin Undertone) state
  const [isAnalyzingUndertone, setIsAnalyzingUndertone] = useState(false);
  const [undertoneResult, setUndertoneResult] = useState<{
    undertone: string;
    jewelry: string;
    colors: string[];
    description: string;
  } | null>(null);

  // AI Stylist Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "model", content: "Greetings. I am Zyra, your LUXE neural fashion consultant. Select a garment or upload your style profile photo to begin personal wardrobe matching." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load products to try on
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(12);
        if (error) throw error;
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          setProducts(parsed);
          setSelectedProduct(parsed[0]);
        } else {
          console.warn("No products found in database, falling back to mock catalog.");
          setProducts(MOCK_PRODUCTS);
          setSelectedProduct(MOCK_PRODUCTS[0]);
        }
      } catch (err) {
        console.error("Error fetching try-on models, falling back to mock catalog:", err);
        setProducts(MOCK_PRODUCTS);
        setSelectedProduct(MOCK_PRODUCTS[0]);
      }
    }
    fetchProducts();
  }, []);

  // Realtime product updates subscription
  useSupabaseRealtime<any>(
    { table: "products" },
    (payload) => {
      console.log("Supabase Realtime product update received:", payload);
      if (payload.eventType === "UPDATE") {
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.new.id ? { ...p, ...parseDbProduct(payload.new) } : p))
        );
        setSelectedProduct((prev) =>
          prev && prev.id === payload.new.id ? { ...prev, ...parseDbProduct(payload.new) } : prev
        );
      } else if (payload.eventType === "INSERT") {
        setProducts((prev) => [...prev, parseDbProduct(payload.new)]);
      } else if (payload.eventType === "DELETE") {
        setProducts((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
      }
    }
  );

  // Access device camera
  const startCamera = async (showToast = true) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" }, // Default to user camera for self-scanning
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasCamera(true);
      if (showToast) {
        toast.success("LUXE Optical Camera Link Active.", { id: "camera-status" });
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setHasCamera(false);
      if (showToast) {
        toast.error("Camera access denied or unavailable.", { id: "camera-status" });
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    // Initial camera startup attempt is silent to avoid intrusive error toasts on load
    startCamera(false);
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Reset controls
  const handleReset = () => {
    setScale(DEFAULT_SCALE);
    setOffsetY(DEFAULT_OFFSET_Y);
    setOffsetX(DEFAULT_OFFSET_X);
    setRotationY(DEFAULT_ROTATION_Y);
    setPerspective(DEFAULT_PERSPECTIVE);
    toast.success("Calibration parameters reset.");
  };

  const handleStandardFit = () => {
    setScale(DEFAULT_SCALE);
    setOffsetY(DEFAULT_OFFSET_Y);
    setOffsetX(DEFAULT_OFFSET_X);
    setRotationY(DEFAULT_ROTATION_Y);
    setPerspective(DEFAULT_PERSPECTIVE);
    toast.success("Calibrated standard fit profile applied.");
  };

  // Capture snapshot from video stream
  const handleCapturePhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror drawing to match video reflection
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setUserPhoto(dataUrl);
        toast.success("Photo captured from live camera stream!");
      }
    } else {
      toast.error("No active camera stream available.");
    }
  };

  // Handle uploaded file
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserPhoto(event.target.result as string);
          toast.success("Stylist profile photo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run virtual try-on API
  const handleRunTryOn = async () => {
    if (!userPhoto) {
      toast.error("Please take a camera scan or upload a photo first.");
      return;
    }
    if (!selectedProduct) {
      toast.error("Please select a garment from the catalog.");
      return;
    }

    setIsGeneratingTryOn(true);
    setTryOnResult(null);

    // Sequence of mock generation steps
    const steps = [
      "Segmenting body contours & alignment markers...",
      "Mapping skeletal joints & posture angles...",
      "Analyzing garment texture mesh & layout constraints...",
      "Executing neural diffusion synthesis (IDM-VTON)...",
      tryOnType === "video" ? "Synthesizing dynamic motion & video frames..." : "Refining color palettes & fabric draping..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: userPhoto,
          garmentImage: selectedProduct.images[0],
          garmentId: selectedProduct.id,
          generateVideo: tryOnType === "video"
        })
      });

      if (!response.ok) throw new Error("Try-On failed");
      const data = await response.json();
      if (data.success) {
        setTryOnResult({ url: data.outputUrl, type: data.type });
        toast.success("Neural Try-On Synthesized!");
      } else {
        toast.error("Generation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server-side try-on synthesis failed.");
    } finally {
      setIsGeneratingTryOn(false);
    }
  };

  // Run Beta Skin Analyzer
  const handleAnalyzeSkin = async () => {
    if (!userPhoto && (!videoRef.current || !stream)) {
      toast.error("Please activate the camera or upload a face photo.");
      return;
    }

    setIsAnalyzingUndertone(true);
    setUndertoneResult(null);

    // Capture current frame if live camera and no uploaded photo
    if (!userPhoto && videoRef.current && stream) {
      handleCapturePhoto();
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Select random matching undertone profile
    const undertones = [
      {
        undertone: "Cool Undertone (Blue/Pink)",
        jewelry: "Silver, Platinum, White Gold",
        colors: ["Crimson Red", "Royal Blue", "Emerald Green", "Burgundy", "Lavender"],
        description: "Your skin has cool undertones with blue/purplish veins. High contrast saturated cool shades and silver accessories highlight your complexion's natural radiance."
      },
      {
        undertone: "Warm Undertone (Yellow/Golden)",
        jewelry: "Yellow Gold, Brass, Copper",
        colors: ["Mustard Gold", "Olive Green", "Rust Orange", "Champagne", "Cream"],
        description: "Your skin features golden or yellow undertones. Earthy pigments, rich greens, warm golds, and brass highlights complement your warm hue."
      },
      {
        undertone: "Neutral Undertone (Peach/Green)",
        jewelry: "Both Gold & Silver look excellent",
        colors: ["Charcoal Grey", "Off-White", "Dusty Pink", "Peach", "Teal"],
        description: "You possess a balanced neutral tone with a blend of cool and warm parameters. Almost all palettes fit your canvas, especially soft de-saturated tones."
      }
    ];

    const chosen = undertones[Math.floor(Math.random() * undertones.length)];
    setUndertoneResult(chosen);
    setIsAnalyzingUndertone(false);
    toast.success("Skin Undertone sequencing finished!");

    // Also trigger conversational suggestion
    setChatMessages(prev => [
      ...prev,
      { role: "user", content: `Analyze my undertone for clothing matches.` },
      { role: "model", content: `Analysis complete. I detected a ${chosen.undertone}. You will look phenomenal in garments like ${chosen.colors.slice(0, 3).join(", ")}, accessorized with ${chosen.jewelry}. I have filtered our premium catalog drop to reflect this alignment.` }
    ]);
  };

  // AI Chat stylist messenger
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", content: userMsg }].slice(-6),
          language: "English"
        })
      });

      if (!response.ok) throw new Error("Chat connection failed");
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "model", content: data.message }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "model", content: "System offline. Unable to query style neural network." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col pt-20">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#6B1E3C]/5 blur-[150px] rounded-full" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <span className="text-primary text-[9px] font-mono font-bold tracking-[0.4em] uppercase block mb-1">Interactive AI Fashion Suite</span>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
              LUXE AI Suite
            </h1>
          </div>
          
          {/* Segmented Controller Tab Bar */}
          <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-2xl self-start md:self-center">
            <button
              onClick={() => setActiveTab("fitting")}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer",
                activeTab === "fitting" ? "bg-primary text-black font-bold" : "text-white/60 hover:text-white"
              )}
            >
              Fitting Calibrator (ER)
            </button>
            <button
              onClick={() => setActiveTab("undertone")}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer",
                activeTab === "undertone" ? "bg-primary text-black font-bold" : "text-white/60 hover:text-white"
              )}
            >
              Undertone Analyzer (Beta)
            </button>
            <button
              onClick={() => setActiveTab("stylist")}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer",
                activeTab === "stylist" ? "bg-primary text-black font-bold" : "text-white/60 hover:text-white"
              )}
            >
              Stylist Assistant (AI)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 relative z-10 py-6">
        
        {/* Left: Viewport (Camera/Scan view or TryOn Result) */}
        <div className="flex-1 lg:flex-[1.5] flex flex-col gap-6">
          <div className="relative rounded-[32px] overflow-hidden bg-[#0A0A0F] border border-white/5 shadow-2xl aspect-[4/3] min-h-[350px] md:min-h-[480px] flex flex-col justify-between">
            
            {/* Try-on loading overlay */}
            <AnimatePresence>
              {isGeneratingTryOn && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md z-[50] flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                    <Sparkles size={24} className="absolute inset-0 m-auto text-primary animate-pulse" />
                  </div>
                  <h3 className="text-sm font-mono tracking-widest text-white uppercase mb-2">Synthesizing Neural Garment Fit</h3>
                  <p className="text-[10px] font-mono text-primary/70 animate-pulse uppercase max-w-md">
                    {generationStep}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated Try-On Result View */}
            {tryOnResult ? (
              <div className="absolute inset-0 z-[40] bg-black flex flex-col items-center justify-center">
                <div className="absolute top-4 left-6 z-10 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/25 border border-primary/40 text-primary text-[8px] font-mono tracking-widest uppercase font-bold">
                    Neural Try-On Result ({tryOnResult.type.toUpperCase()})
                  </span>
                </div>
                
                {tryOnResult.type === "video" ? (
                  <video 
                    src={tryOnResult.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={tryOnResult.url} 
                    alt="Try-on Result" 
                    className="w-full h-full object-contain"
                  />
                )}

                <div className="absolute bottom-4 inset-x-6 flex justify-between items-center bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                  <div className="text-left">
                    <p className="text-[10px] font-mono text-white/50 uppercase">Garment Rendered:</p>
                    <p className="text-[11px] font-mono font-bold text-white uppercase">{selectedProduct?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTryOnResult(null)}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-mono tracking-widest uppercase cursor-pointer"
                    >
                      Reset View
                    </button>
                    <a 
                      href={tryOnResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-primary text-black rounded-xl text-[9px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={10} /> Fullscreen
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Calibration bounds overlay (active only in fitting and undertone tabs) */}
            {activeTab !== "stylist" && (
              <div className="absolute inset-6 border border-white/5 rounded-2xl pointer-events-none z-20">
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />
                
                {stream && !userPhoto && (
                  <motion.div
                    animate={{ y: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent absolute shadow-[0_0_15px_rgba(201,168,76,0.8)] z-10"
                  />
                )}
              </div>
            )}

            {/* Live Camera Feed */}
            {hasCamera === true && stream && !userPhoto ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10"
              />
            ) : null}

            {/* Real AR Body Tracking overlay */}
            {activeTab === "fitting" && selectedProduct && hasCamera === true && stream && !userPhoto && (
              <ARBodyTracker
                modelUrl={selectedProduct.model_url}
                productColor="#C9A84C"
                isStreaming={!!stream}
                videoRef={videoRef}
                onTrackingStatusChange={(active) => setIsArTrackingActive(active)}
              />
            )}

            {/* Static User Uploaded Photo display */}
            {userPhoto ? (
              <div className="absolute inset-0 bg-[#060609] flex items-center justify-center z-10">
                <img 
                  src={userPhoto} 
                  alt="Scanned Face" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : null}

            {/* Camera Offline Fallback */}
            {(!stream && !userPhoto) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 p-8 text-center bg-black/85">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <Camera size={28} />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Camera Offline or Denied</h3>
                  <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
                    Grant camera permission for live optical scans, or upload a style photo below.
                  </p>
                </div>
                <button
                  onClick={() => startCamera()}
                  className="px-6 py-2.5 bg-primary text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded-xl hover:scale-105 transition-transform cursor-pointer"
                >
                  Reconnect Camera
                </button>
              </div>
            )}

            {/* Top Viewport Metadata Overlay */}
            <div className="relative z-30 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", stream || userPhoto ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500")} />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/70">
                  {userPhoto ? "STYLE DATA SOURCE: CUSTOM FILE" : stream ? "LIVE CAMERA LINK ACTIVE" : "CAMERA FEED OFFLINE"}
                </span>
              </div>
              {selectedProduct && activeTab === "fitting" && (
                <div className="px-3 py-1.5 rounded-full bg-black/60 border border-primary/20 backdrop-blur-md text-primary text-[8px] font-mono tracking-widest uppercase font-bold">
                  Overlaying: {selectedProduct.category} Fit Model
                </div>
              )}
            </div>

            {/* ER Fitting Calibrator Overlay Model (2D manual fallback, shown only if NOT active AR tracking or if using static userPhoto) */}
            {activeTab === "fitting" && selectedProduct && (stream || userPhoto) && (!isArTrackingActive || userPhoto) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                <div
                  style={{
                    perspective: `${perspective}px`,
                    transformStyle: "preserve-3d"
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <motion.div
                    style={{
                      y: offsetY,
                      x: offsetX,
                      scale: scale,
                      rotateY: rotationY,
                      transformStyle: "preserve-3d"
                    }}
                    animate={isCapturing ? { scale: [scale, scale * 1.05, scale] } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative w-64 h-80 flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(201,168,76,0.35)]"
                  >
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                      draggable={false}
                      onMouseDown={(e) => {
                        const startX = e.clientX - offsetX;
                        const startY = e.clientY - offsetY;
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          setOffsetX(moveEvent.clientX - startX);
                          setOffsetY(moveEvent.clientY - startY);
                        };
                        const handleMouseUp = () => {
                          window.removeEventListener("mousemove", handleMouseMove);
                          window.removeEventListener("mouseup", handleMouseUp);
                        };
                        window.addEventListener("mousemove", handleMouseMove);
                        window.addEventListener("mouseup", handleMouseUp);
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const startX = touch.clientX - offsetX;
                        const startY = touch.clientY - offsetY;
                        const handleTouchMove = (moveEvent: TouchEvent) => {
                          const moveTouch = moveEvent.touches[0];
                          setOffsetX(moveTouch.clientX - startX);
                          setOffsetY(moveTouch.clientY - startY);
                        };
                        const handleTouchEnd = () => {
                          window.removeEventListener("touchmove", handleTouchMove);
                          window.removeEventListener("touchend", handleTouchEnd);
                        };
                        window.addEventListener("touchmove", handleTouchMove);
                        window.addEventListener("touchend", handleTouchEnd);
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar inside Viewport */}
            <div className="relative z-30 p-6 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent mt-auto">
              <div className="flex gap-2">
                {userPhoto && (
                  <button
                    onClick={() => {
                      setUserPhoto(null);
                      toast.success("Profile photo cleared. Live camera active.");
                    }}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-mono tracking-widest uppercase hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear Photo
                  </button>
                )}
                {hasCamera === true && stream && (
                  <button
                    onClick={handleCapturePhoto}
                    className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
                    title="Capture camera snapshot"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {activeTab === "fitting" && (
                <button
                  onClick={handleReset}
                  className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
                  title="Reset alignment coordinates"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>

          </div>

          {/* User Face/Body Scan & File Upload Control Card */}
          <div className="glass-luxury p-6 border border-white/5 rounded-[32px] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">1. Style Profile Photo</h3>
                <p className="text-[9px] font-mono text-white/30 uppercase mt-0.5">Capture live scan or attach a standard photo</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-mono tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload size={12} /> Attach Photo
                </button>
              </div>
            </div>

            {/* Virtual Try-On Execution Pipeline Panel */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">2. Neural Try-On Pipeline</h3>
                <p className="text-[9px] font-mono text-white/30 uppercase mt-0.5">Render the selected catalog garment on your photo</p>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Generation output toggle */}
                <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setTryOnType("photo")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer",
                      tryOnType === "photo" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                    )}
                  >
                    Static Photo
                  </button>
                  <button
                    onClick={() => setTryOnType("video")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer",
                      tryOnType === "video" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                    )}
                  >
                    3D Video
                  </button>
                </div>

                <button
                  onClick={handleRunTryOn}
                  disabled={isGeneratingTryOn}
                  className="px-6 py-3 bg-primary hover:bg-[#E8C97A] text-black rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all"
                >
                  <Sparkles size={12} className="animate-pulse" />
                  {isGeneratingTryOn ? "Synthesizing..." : "Run Neural Try-On"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Tab Details */}
        <div className="flex-1 lg:flex-[1] flex flex-col gap-6">

          {/* TAB 1: Fitting Calibrator Sliders */}
          {activeTab === "fitting" && (
            <>
              <div className="glass-luxury p-8 border border-white/5 space-y-4 rounded-[32px]">
                <span className="text-primary text-[9px] font-mono font-bold tracking-[0.4em] uppercase block">ER Fitting Calibration</span>
                <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">
                  Manual Adjust
                </h2>
                <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
                  Drag the fabric directly on the viewport or recalibrate width, perspective depth, and rotations.
                </p>
              </div>

              <div className="glass-luxury p-6 border border-white/5 space-y-5 rounded-[32px]">
                {isArTrackingActive && !userPhoto && (
                  <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-mono uppercase tracking-wider text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    Auto skeletal tracking active. Sliders locked.
                  </div>
                )}

                <button
                  onClick={handleStandardFit}
                  disabled={isArTrackingActive && !userPhoto}
                  className="w-full py-2.5 border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary text-[9px] font-mono font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer text-center disabled:opacity-30 disabled:pointer-events-none"
                >
                  Standard Fit Calibrate
                </button>

                <div className="space-y-4 pt-2">
                  {/* Scale */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                      <span>Scale Size</span>
                      <span>{Math.round(scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={scale}
                      disabled={isArTrackingActive && !userPhoto}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Yaw */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                      <span>Yaw Rotation</span>
                      <span>{Math.round(rotationY)}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={rotationY}
                      disabled={isArTrackingActive && !userPhoto}
                      onChange={(e) => setRotationY(parseInt(e.target.value))}
                      className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Vertical */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                      <span>Vertical Offset</span>
                      <span>{offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="5"
                      value={offsetY}
                      disabled={isArTrackingActive && !userPhoto}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Horizontal */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                      <span>Horizontal Offset</span>
                      <span>{offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      step="5"
                      value={offsetX}
                      disabled={isArTrackingActive && !userPhoto}
                      onChange={(e) => setOffsetX(parseInt(e.target.value))}
                      className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Perspective */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                      <span>Perspective Depth</span>
                      <span>{perspective}px</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="1200"
                      step="50"
                      value={perspective}
                      disabled={isArTrackingActive && !userPhoto}
                      onChange={(e) => setPerspective(parseInt(e.target.value))}
                      className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Skin/Face Undertone Analyzer (Beta Scanner) */}
          {activeTab === "undertone" && (
            <>
              <div className="glass-luxury p-8 border border-white/5 space-y-4 rounded-[32px]">
                <span className="text-primary text-[9px] font-mono font-bold tracking-[0.4em] uppercase block">RGB Undertone Analysis</span>
                <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">
                  Beta Scanner
                </h2>
                <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
                  Sequences face pigments to compute your custom palette matches.
                </p>
              </div>

              <div className="glass-luxury p-6 border border-white/5 space-y-6 rounded-[32px] flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <button
                    onClick={handleAnalyzeSkin}
                    disabled={isAnalyzingUndertone}
                    className="w-full py-3 bg-primary hover:bg-[#E8C97A] text-black text-[10px] font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAnalyzingUndertone ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Sequencing Pigment Coordinates...
                      </>
                    ) : (
                      <>
                        <Palette size={12} /> Sequence Skin Tone
                      </>
                    )}
                  </button>

                  {/* Display Undertone Result */}
                  <AnimatePresence>
                    {undertoneResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-[10px] font-mono text-white/40 uppercase">Detected Hues:</span>
                          <span className="text-[11px] font-mono font-bold text-primary uppercase">{undertoneResult.undertone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-white/40 uppercase">Jewelry Fit:</span>
                          <span className="text-[10px] font-mono font-semibold text-white uppercase">{undertoneResult.jewelry}</span>
                        </div>
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-mono text-white/40 uppercase block">Recommended Pigments:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {undertoneResult.colors.map((color, idx) => (
                              <span 
                                key={idx} 
                                className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-white/30 leading-relaxed uppercase border-t border-white/5 pt-3">
                          {undertoneResult.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!undertoneResult && !isAnalyzingUndertone && (
                  <div className="flex items-center gap-2 text-white/30 text-[9px] font-mono uppercase bg-white/[0.01] p-4 rounded-2xl border border-dashed border-white/5">
                    <Info size={14} className="text-primary flex-shrink-0" />
                    <span>Provide a camera frame or photo upload, then trigger tone sequencing.</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: Conversational Stylist (AI Assistant) */}
          {activeTab === "stylist" && (
            <>
              <div className="glass-luxury p-8 border border-white/5 space-y-4 rounded-[32px]">
                <span className="text-primary text-[9px] font-mono font-bold tracking-[0.4em] uppercase block">AI Stylist Assistant</span>
                <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">
                  Neural Stylist
                </h2>
                <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
                  Ask Zyra about color match choices, custom sizing constraints, and dynamic outfit ideas.
                </p>
              </div>

              <div className="glass-luxury p-6 border border-white/5 rounded-[32px] flex-1 flex flex-col justify-between h-[400px]">
                {/* Chat transcript */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar text-[10px] font-mono uppercase">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-3 rounded-2xl max-w-[85%] leading-relaxed",
                        msg.role === "user" 
                          ? "bg-primary/10 border border-primary/20 text-primary self-end ml-auto text-right" 
                          : "bg-white/5 border border-white/5 text-white/80 mr-auto text-left"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="p-3 bg-white/5 border border-white/5 text-white/40 mr-auto text-left rounded-2xl flex items-center gap-2 max-w-[50%]">
                      <RefreshCw size={10} className="animate-spin text-primary" /> Processing...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input text messenger */}
                <div className="flex gap-2 border-t border-white/5 pt-4">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder="Ask Zyra styling questions..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 text-white"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={isChatLoading}
                    className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center hover:bg-[#E8C97A] transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Catalog Garments Models Selector List */}
          <div className="glass-luxury p-6 border border-white/5 rounded-[32px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ZoomIn size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Catalog Garment Models</span>
              </div>
              <span className="text-[9px] font-mono text-white/30 uppercase">({products.length} Items)</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5 overflow-y-auto max-h-[140px] pr-1 custom-scrollbar">
              {products.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      toast.success(`Selected Garment: ${prod.name}`);
                    }}
                    className={cn(
                      "aspect-[3/4] rounded-xl overflow-hidden relative border transition-all cursor-pointer",
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(201,168,76,0.3)]" 
                        : "border-white/5 hover:border-white/20"
                    )}
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {selectedProduct && (
              <div className="bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl flex justify-between items-center text-left">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white truncate max-w-[180px]">{selectedProduct.name}</h4>
                  <p className="text-[9px] font-mono text-primary font-bold uppercase mt-0.5">₹{selectedProduct.price}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono text-white/40 uppercase">
                  {selectedProduct.category}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
