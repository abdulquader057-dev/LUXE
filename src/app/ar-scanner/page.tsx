"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RotateCcw, Sparkles, Sliders, Play, Square, RefreshCw, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

// LUXE-FIX [7]: Calibration constants for Standard Fit
const DEFAULT_SCALE = 1.0;
const DEFAULT_OFFSET_Y = 0;
const DEFAULT_OFFSET_X = 0;
const DEFAULT_ROTATION_Y = 0;
const DEFAULT_PERSPECTIVE = 800;

export default function ARScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Transform controls
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [offsetY, setOffsetY] = useState(DEFAULT_OFFSET_Y);
  const [offsetX, setOffsetX] = useState(DEFAULT_OFFSET_X);
  const [rotationY, setRotationY] = useState(DEFAULT_ROTATION_Y);
  const [perspective, setPerspective] = useState(DEFAULT_PERSPECTIVE);
  const [isCapturing, setIsCapturing] = useState(false);

  // Load products to try on
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(8);
        if (error) throw error;
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          setProducts(parsed);
          setSelectedProduct(parsed[0]);
        } else {
          toast.error("No try-on models found in catalog.");
        }
      } catch (err) {
        console.error("Error fetching try-on models:", err);
        toast.error("Unable to load try-on models from catalog.");
      }
    }
    fetchProducts();
  }, []);

  // Access device camera
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
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
      toast.success("Neural Optical Link Synced.");
    } catch (err) {
      console.error("Camera access failed:", err);
      setHasCamera(false);
      toast.error("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Reset controls
  const handleReset = () => {
    setScale(DEFAULT_SCALE);
    setOffsetY(DEFAULT_OFFSET_Y);
    setOffsetX(DEFAULT_OFFSET_X);
    setRotationY(DEFAULT_ROTATION_Y);
    setPerspective(DEFAULT_PERSPECTIVE);
    toast.success("Spatial Calibration Reset.");
  };

  // LUXE-FIX [7]: Standard Fit resets parameters and triggers calibrated toast
  const handleStandardFit = () => {
    setScale(DEFAULT_SCALE);
    setOffsetY(DEFAULT_OFFSET_Y);
    setOffsetX(DEFAULT_OFFSET_X);
    setRotationY(DEFAULT_ROTATION_Y);
    setPerspective(DEFAULT_PERSPECTIVE);
    toast.success("Calibrated", { duration: 1500 });
  };

  // Simulate snapshot capture
  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      toast.success("Neural Fit coordinates recorded! Saved to your Style Profile.");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-6 relative z-10 py-6">
        
        {/* Left: Interactive AR Viewport */}
        <div className="flex-1 lg:flex-[2] relative rounded-[32px] overflow-hidden bg-[#0A0A0F] border border-white/5 shadow-2xl flex flex-col justify-between aspect-[9/16] lg:aspect-video max-h-[75vh] min-h-[450px]">
          
          {/* Scanner bounds overlay */}
          <div className="absolute inset-6 border border-white/5 rounded-2xl pointer-events-none z-20">
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />
            
            {/* Pulsing Scan Line */}
            {stream && (
              <motion.div
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent absolute shadow-[0_0_15px_rgba(201,168,76,0.8)] z-10"
              />
            )}
          </div>

          {/* Real Camera Video Feed */}
          {hasCamera === true && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 p-8 text-center bg-black/80">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Camera size={28} />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Camera Access Required</h3>
                <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
                  We need camera permission to render the interactive clothing overlay. Please grant camera access or re-enable the link.
                </p>
              </div>
              {/* LUXE-FIX [4]: Replace rounded-xl on button with rounded-luxe */}
              <button
                onClick={startCamera}
                className="px-6 py-2.5 bg-primary text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded-luxe hover:scale-105 transition-transform cursor-pointer"
              >
                Sync Device Optical Link
              </button>
            </div>
          )}

          {/* Top Info Bar */}
          <div className="relative z-30 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", stream ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500")} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/70">
                {stream ? "NEURAL OPTICAL LINK ACTIVE" : "OPTICAL LINK OFFLINE"}
              </span>
            </div>
            {selectedProduct && (
              <div className="px-3 py-1.5 rounded-full bg-black/60 border border-primary/20 backdrop-blur-md text-primary text-[8px] font-mono tracking-widest uppercase font-bold">
                {selectedProduct.category} fit model
              </div>
            )}
          </div>

          {/* Interactive CSS 3D Clothing Overlay */}
          {selectedProduct && stream && (
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
                  
                  {/* Subtle alignment aids */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-primary/20 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-1/4 border-b border-dashed border-primary/20 pointer-events-none" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Bottom Actions Overlay */}
          <div className="relative z-30 p-6 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent mt-auto">
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
              title="Reset Spatial Calibration"
            >
              <RotateCcw size={16} />
            </button>

            {/* LUXE-FIX [4]: Replace rounded-full on button with rounded-luxe */}
            <button
              onClick={handleCapture}
              disabled={!stream || isCapturing}
              className={cn(
                "px-8 py-3 rounded-luxe font-mono font-bold text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer border",
                isCapturing 
                  ? "bg-primary border-primary text-black" 
                  : "bg-black/60 border-primary/40 text-primary hover:bg-primary hover:text-black"
              )}
            >
              {isCapturing ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Recording Coordinates
                </>
              ) : (
                <>
                  <Sparkles size={12} /> Capture Fit Sync
                </>
              )}
            </button>

            {hasCamera === true && stream ? (
              <button
                onClick={stopCamera}
                className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                title="Disconnect Optical Link"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all cursor-pointer"
                title="Establish Optical Link"
              >
                <Play size={16} className="ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div className="flex-1 lg:flex-[1] flex flex-col gap-6">
          
          {/* Header Info */}
          <div className="glass-luxury p-8 border border-white/5 space-y-4 rounded-[32px]">
            <span className="text-primary text-[9px] font-mono font-bold tracking-[0.4em] uppercase block">Spatial Calibrator</span>
            <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">
              Neural Fitter
            </h2>
            <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed">
              Drag the garment directly on-screen or use the sliders below to calibrate size, rotation, and alignment coordinates.
            </p>
          </div>

          {/* Sliders Control Panel */}
          <div className="glass-luxury p-8 border border-white/5 space-y-6 rounded-[32px]">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Sliders size={14} className="text-primary" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Calibration Sliders</span>
            </div>

            {/* LUXE-FIX [7]: Standard Fit button resets all sliders */}
            <button
              onClick={handleStandardFit}
              className="w-full py-2.5 border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary text-[9px] font-mono font-bold tracking-widest uppercase rounded-luxe transition-all cursor-pointer text-center"
            >
              Standard Fit
            </button>

            {/* Scale Slider */}
            <div className="space-y-2">
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
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer"
              />
            </div>

            {/* Rotation Y Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                <span>Yaw / Rotation Y</span>
                <span>{Math.round(rotationY)}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotationY}
                onChange={(e) => setRotationY(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer"
              />
            </div>

            {/* Y Offset Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                <span>Vertical Alignment (Y)</span>
                <span>{offsetY}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="5"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer"
              />
            </div>

            {/* X Offset Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono uppercase text-white/40 tracking-wider">
                <span>Horizontal Alignment (X)</span>
                <span>{offsetX}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="5"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer"
              />
            </div>

            {/* Perspective Slider */}
            <div className="space-y-2">
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
                onChange={(e) => setPerspective(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-full h-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Clothing Selector */}
          <div className="glass-luxury p-8 border border-white/5 flex-1 flex flex-col justify-between rounded-[32px] min-h-[200px]">
            <div>
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                <ZoomIn size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Select Garment Models</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[150px] pr-1 custom-scrollbar">
                {products.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    // LUXE-FIX [4]: Replace rounded-xl on card button with rounded-luxe
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        toast.success(`Active Garment Model: ${prod.name}`);
                      }}
                      className={cn(
                        "aspect-[3/4] rounded-luxe overflow-hidden relative border transition-all cursor-pointer",
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(201,168,76,0.3)]" 
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
            </div>

            {selectedProduct && (
              <div className="border-t border-white/5 pt-4 mt-4 text-left">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white truncate">{selectedProduct.name}</h4>
                <p className="text-[10px] font-mono text-[#00f2ff] font-bold uppercase mt-1">₹{selectedProduct.price}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
