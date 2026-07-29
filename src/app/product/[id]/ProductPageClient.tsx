"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  Share2,
  Heart,
  Sparkles,
  Zap,
  BrainCircuit,
  Eye,
  ArrowRight,
  Bell
} from "lucide-react";
import TrustBadges from "@/components/shop/TrustBadges";
import { cn } from "@/lib/utils";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import { Magnetic } from "@/components/ui/Magnetic";
import ProductCard from "@/components/shop/ProductCard";
import LuxeButton from "@/components/ui/LuxeButton";
import { useTilt } from "@/hooks/useTilt";
import { usePersonalization } from "@/lib/hooks/usePersonalization";
import { useCommerce } from "@/lib/contexts/CommerceContext";
import { useXP } from "@/lib/hooks/useXP";
import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";
import toast from "react-hot-toast";
import { telemetry } from "@/lib/telemetry";
import dynamic from "next/dynamic";

// Lazy-load the heavy 3D viewer to optimize page load times
const ProductViewer3D = dynamic(
  () => import("@/components/shop/ProductViewer3D").then((m) => m.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square rounded-[40px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest animate-pulse">Constructing 3D Workspace...</span>
      </div>
    )
  }
);

// R3F viewer — only loaded when product has a GLB model_url
const ProductViewer3DReal = dynamic(
  () => import('@/components/shop/ProductViewer3DReal').then(m => m.ProductViewer3DReal),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[600px] rounded-[32px] bg-gradient-to-b from-[#0D0D14] to-[#1A1A26] border border-[rgba(201,168,76,0.1)] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        <span className="text-[9px] font-mono text-[#C9A962] tracking-widest uppercase">Loading 3D Environment...</span>
      </div>
    )
  }
);

export default function ProductPageClient({ product }: { product: any }) {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const tilt = useTilt(8);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const [isStyleAnalysisOpen, setIsStyleAnalysisOpen] = useState(false);
  const { trackView } = usePersonalization();
  const { convertPrice, addToCart } = useCommerce();
  const { awardXP } = useXP();
  const [outfitPairings, setOutfitPairings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPairings() {
      if (!product?.id) return;
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .neq("id", product.id)
          .limit(3);
        if (data && data.length > 0) {
          const parsed = data.map(parseDbProduct);
          setOutfitPairings(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch outfit pairings from DB:", err);
      }
    }
    fetchPairings();
  }, [product?.id]);

  // Price Drop Modal and shipping pincode states
  const [showChatToOrderLabel, setShowChatToOrderLabel] = useState(false);
  const [pincodeVal, setPincodeVal] = useState("");
  const [pincodeResult, setPincodeResult] = useState("");
  const [showPriceDropModal, setShowPriceDropModal] = useState(false);
  const [emailAlert, setEmailAlert] = useState("");
  const [phoneAlert, setPhoneAlert] = useState("");
  const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);

  useEffect(() => {
    // Show 'Chat to order' label on first mobile visit for 4 seconds
    const hasVisited = localStorage.getItem("luxe-whatsapp-visited");
    if (!hasVisited) {
      setShowChatToOrderLabel(true);
      const timer = setTimeout(() => setShowChatToOrderLabel(false), 4000);
      localStorage.setItem("luxe-whatsapp-visited", "true");
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (product) {
      telemetry.track("product_viewed", {
        product_id: product.id,
        name: product.name,
        price: product.price
      });
    }
  }, [product]);

  // Award XP after 5 seconds of viewing a product
  useEffect(() => {
    if (!product?.id) return;
    const timer = setTimeout(() => {
      awardXP('product_view');
    }, 5000);
    return () => clearTimeout(timer);
  }, [product?.id, awardXP]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handlePincodeCheck = (val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(0, 6);
    if (cleanVal.length === 6) {
      const prefixes = ["400", "110", "560", "500", "600", "700"];
      const isMetro = prefixes.some(pref => cleanVal.startsWith(pref));
      if (isMetro) {
        setPincodeResult("Delivery in 1-2 business days");
      } else {
        setPincodeResult("Delivery in 3-5 business days");
      }
    } else if (cleanVal.length > 0) {
      setPincodeResult("Please enter a valid pincode");
    } else {
      setPincodeResult("");
    }
  };

  const handlePriceDropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAlert || !phoneAlert) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsAlertSubmitting(true);
    try {
      const { error } = await supabase.from("price_drop_alerts").insert([
        {
          product_id: product?.id,
          email: emailAlert,
          phone: phoneAlert,
          target_price: product?.price
        }
      ]);
      if (error) throw error;
      toast.success("Price drop alert set successfully!");
      setShowPriceDropModal(false);
      setEmailAlert("");
      setPhoneAlert("");
    } catch (err) {
      console.error(err);
      toast.error("Could not set alert. Please try again.");
    } finally {
      setIsAlertSubmitting(false);
    }
  };

  // Reset selected image index when color changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  useEffect(() => {
    if (product) {
      trackView(product.id);
      
      // Auto-select color based on query param or product name
      const queryColor = searchParams?.get("color");
      if (queryColor && product.colors?.includes(queryColor)) {
        setSelectedColor(queryColor);
      } else {
        const nameLower = product.name.toLowerCase();
        let defaultColor = product.colors?.[0] || "White";
        if (nameLower.includes("white")) defaultColor = "White";
        else if (nameLower.includes("sky blue")) defaultColor = "Sky Blue";
        else if (nameLower.includes("desert sand")) defaultColor = "Desert Sand";
        else if (nameLower.includes("olive green")) defaultColor = "Olive Green";
        else if (nameLower.includes("sunset pink")) defaultColor = "Sunset Pink";
        else if (nameLower.includes("navy blue")) defaultColor = "Navy Blue";
        else if (nameLower.includes("carbon black")) defaultColor = "Carbon Black";
        else if (nameLower.includes("cocoa brown")) defaultColor = "Cocoa Brown";
        
        setSelectedColor(defaultColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, searchParams]);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  // Find variant images based on selectedColor from modelImages
  const variantData = product.modelImages?.variants?.[selectedColor];
  let activeImages = variantData
    ? [variantData.front, variantData.back, variantData.side, variantData.original]
        .filter((img): img is string => !!img && img !== "/model_placeholder.png")
    : [];

  if (activeImages.length === 0) {
    activeImages = product.images;
  }

  // Deduplicate activeImages to avoid showing repeated photos
  activeImages = activeImages.filter((img, index, self) => self.indexOf(img) === index);

  

  const handleWhatsAppBuy = () => {
    const message = `Hi, I'd like to order ${product.name} | Size: ${selectedSize || 'N/A'} | Color: ${selectedColor || 'N/A'} | Qty: ${quantity}`;
    window.open(`https://wa.me/917995338472?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-mesh pt-16 pb-40">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <MotionItem animation="fade" className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-16">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link> <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-primary transition-colors">Archive</Link> <ChevronRight size={12} />
          <span className="text-white/60">{product.name}</span>
        </MotionItem>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
          {/* Left: Image Architecture */}
          <MotionContainer animation="stagger" className="space-y-8">
            <MotionItem animation="scale" className="relative group w-full">
              <div
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                style={tilt.style}
                className="w-full h-full"
              >
{product.model_url ? (
                  <ProductViewer3DReal
                    modelUrl={product.model_url}
                    productName={product.name}
                    selectedColor={selectedColor}
                  />
                ) : (
                  <ProductViewer3D 
                    images={activeImages} 
                    productName={product.name} 
                    selectedColor={selectedColor} 
                    currentIndex={selectedImage}
                    onChangeIndex={setSelectedImage}
                  />
                )}
              </div>
            </MotionItem>
            
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {activeImages.map((img: string, i: number) => (
                <MotionItem key={i} animation="slideUp" delay={i * 0.1}>
                  <button
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-28 aspect-square rounded-[24px] overflow-hidden border-2 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)]",
                      selectedImage === i ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill sizes="150px" className="object-cover" />
                  </button>
                </MotionItem>
              ))}
            </div>

            {/* Color Swatch Selector below thumbnails */}
            {product.colors && (
              <MotionItem animation="slideUp" className="pt-6 border-t border-white/10 mt-6">
                <div className="flex items-center gap-4 justify-start">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Swatch Selection:</span>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color: string) => {
                      const colorMap: Record<string, string> = {
                        "white": "#ffffff",
                        "light blue": "#a8d5e5",
                        "sky blue": "#a8d5e5",
                        "pink": "#e8b0b0",
                        "sunset pink": "#e8b0b0",
                        "olive green": "#657053",
                        "tan beige": "#d7c6b5",
                        "desert sand": "#d7c6b5",
                        "cocoa brown": "#5c4033",
                        "navy blue": "#1d2a44",
                        "carbon black": "#151515"
                      };
                      const hex = colorMap[color.toLowerCase()] || "#cccccc";
                      const isWhite = color.toLowerCase() === "white";
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                            selectedColor === color 
                              ? "border-[#D4AF37] scale-110 shadow-lg" 
                              : "border-white/5 hover:border-white/20"
                          )}
                          title={color}
                        >
                          <span 
                            className="w-5.5 h-5.5 rounded-full block border"
                            style={{ 
                              backgroundColor: hex, 
                              borderColor: isWhite ? "rgba(255,255,255,0.2)" : "transparent" 
                            }} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </MotionItem>
            )}
          </MotionContainer>

          {/* Right: Cognition & Selection */}
          <div className="flex flex-col">
            <MotionContainer animation="stagger">
              <MotionItem animation="slideRight">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">{product.category.replace("-", " ")}</span>
                  <div className="h-px w-12 bg-white/10" />
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-black text-white">{product.ratings}</span>
                    <span className="text-[10px] text-white/20 font-bold tracking-widest ml-1 uppercase">({product.reviewsCount} Insights)</span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.8] uppercase">{product.name}</h1>
                
                <div className="flex flex-col gap-2 mb-12">
                  <div className="flex items-baseline gap-6">
                    <p className="text-5xl font-black tracking-tighter text-gradient">{convertPrice(product.price).symbol}{convertPrice(product.price).amount}</p>
                    {product.discount && (
                      <p className="text-2xl font-black tracking-tighter text-white/10 line-through">{convertPrice(Math.round(product.price * (1 + product.discount/100))).symbol}{convertPrice(Math.round(product.price * (1 + product.discount/100))).amount}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Inclusive of all taxes</span>
                  
                  <button
                    onClick={() => setShowPriceDropModal(true)}
                    className="w-max mt-2 text-[8px] font-mono tracking-[0.2em] text-[#C9A962] border border-[#D4AF37]/20 hover:border-[#D4AF37] px-4 py-2 rounded-xl uppercase transition-all bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 flex items-center gap-2 cursor-pointer"
                  >
                    <Bell size={10} /> Set Price Drop Alert
                  </button>
                </div>

                <p className="text-white/40 text-xl leading-relaxed mb-16 font-medium max-w-xl">{product.description}</p>
                <TrustBadges />
              </MotionItem>

              {/* AI Styling Intelligence Panel */}
              <MotionItem animation="slideUp" className="mb-16 p-8 glass-3 !rounded-[32px] border-primary/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-700 [transition-timing-function:var(--ease-out-expo)]">
                    <BrainCircuit size={40} className="text-primary" />
                 </div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                       <Zap size={20} className="text-primary" />
                    </div>
                    <h4 className="text-sm font-black tracking-widest uppercase">LUXE Stylist Insights</h4>
                 </div>
                 <p className="text-sm text-white/60 mb-6 leading-relaxed font-medium italic">
                   &quot;Architected for a futuristic silhouette. This piece aligns with your recent interest in tech-modest aesthetics. Pair with our Bio-Metal accessories for maximum impact.&quot;
                 </p>
                 <button 
                  onClick={() => setIsStyleAnalysisOpen(true)}
                  className="text-[10px] font-black tracking-[0.4em] text-primary uppercase hover:translate-x-2 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] inline-flex items-center gap-2"
                >
                  View Full Style Analysis <ArrowRight size={14} />
                </button>
              </MotionItem>

              {/* Selection Logic */}
              <div className="space-y-12 mb-20">
                {product.sizes && (
                  <MotionItem animation="slideUp">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase">Select Size</h4>
                      <button className="text-[10px] font-black text-primary/60 hover:text-primary tracking-widest uppercase underline underline-offset-4">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={cn(
                            "w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-sm transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] border-2",
                            selectedSize === size 
                              ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                              : "border-white/5 hover:border-white/20 glass"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Shipping UX Pincode delivery date estimator */}
                    <div className="mt-8 p-5 rounded-2xl border border-white/5 bg-white/[0.01] max-w-sm">
                      <h5 className="text-[9px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase mb-3">{"// Check Delivery Estimate"}</h5>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          pattern="\d*"
                          maxLength={6}
                          value={pincodeVal}
                          placeholder="Enter 6-digit Pincode"
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono w-44 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setPincodeVal(val);
                            handlePincodeCheck(val);
                          }}
                        />
                      </div>
                      {pincodeResult && (
                        <div className="mt-3 text-[10px] font-mono text-[#C9A962] uppercase tracking-widest flex items-center gap-2 animate-pulse">
                          <span>🚚</span> {pincodeResult}
                        </div>
                      )}
                    </div>
                  </MotionItem>
                )}

                {product.colors && (
                  <MotionItem animation="slideUp" delay={0.05}>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase">Select Color</h4>
                      {selectedColor && (
                        <span className="text-[10px] font-black text-[#C9A962] uppercase tracking-widest">{selectedColor}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map((color: string) => {
                        const colorMap: Record<string, string> = {
                          "white": "#ffffff",
                          "light blue": "#a8d5e5",
                          "sky blue": "#a8d5e5",
                          "pink": "#e8b0b0",
                          "sunset pink": "#e8b0b0",
                          "olive green": "#657053",
                          "tan beige": "#d7c6b5",
                          "desert sand": "#d7c6b5",
                          "cocoa brown": "#5c4033",
                          "navy blue": "#1d2a44",
                          "carbon black": "#151515"
                        };
                        const hex = colorMap[color.toLowerCase()] || "#cccccc";
                        const isWhite = color.toLowerCase() === "white";

                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                              selectedColor === color 
                                ? "border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/20" 
                                : "border-white/5 hover:border-white/20"
                            )}
                            title={color}
                          >
                            <span 
                              className="w-8 h-8 rounded-full block border"
                              style={{ 
                                backgroundColor: hex, 
                                borderColor: isWhite ? "rgba(255,255,255,0.2)" : "transparent" 
                              }} 
                            />
                          </button>
                        );
                      })}
                    </div>
                  </MotionItem>
                )}

                <MotionItem animation="slideUp" delay={0.1}>
                  <h4 className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase mb-6">Quantity</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-6 glass border border-white/10 rounded-[20px] px-6 py-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-primary transition-colors"><Minus size={20} /></button>
                      <span className="w-10 text-center font-black text-xl">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-primary transition-colors"><Plus size={20} /></button>
                    </div>
                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-[#D4AF37]" 
                      />
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{product.stock} Units left</p>
                  </div>
                </MotionItem>
              </div>

              {/* Action Buttons - Transaction Layer */}
              <div className="flex flex-col sm:flex-row gap-6 mb-20 mobile-sticky-actions">
                {product.stock === 0 ? (
                  <button 
                    disabled
                    className="w-full py-6 bg-red-500/10 border border-red-500/20 text-red-500/60 rounded-[24px] flex items-center justify-center gap-4 cursor-not-allowed opacity-50 text-xs font-black tracking-[0.3em] uppercase font-mono"
                  >
                    Out of Stock / Unavailable
                  </button>
                ) : (
                  <>
                    <Magnetic>
                      <LuxeButton 
                        variant="hud"
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: activeImages[0],
                            quantity: quantity,
                            size: selectedSize || "L",
                            color: selectedColor || "White"
                          });
                          telemetry.track("cart_added", {
                            product_id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity
                          });
                          toast.success("Added to Cart manifest");
                        }}
                        className="w-full !py-6 flex items-center justify-center gap-4 hover:border-primary/50 group overflow-hidden"
                      >
                        <ShoppingCart size={20} className="text-primary group-hover:scale-110 transition-transform duration-700" />
                        <span className="text-xs font-black tracking-[0.3em] uppercase">Add to Ensemble</span>
                      </LuxeButton>
                    </Magnetic>
                    <Magnetic>
                      <LuxeButton 
                        variant="gold"
                        onClick={handleWhatsAppBuy}
                        className="w-full !py-6 flex items-center justify-center gap-4"
                      >
                        <MessageCircle size={20} /> <span>WhatsApp Concierge</span>
                      </LuxeButton>
                    </Magnetic>
                  </>
                )}
              </div>

              {/* Core Features / Trust Architecture */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
                {[
                  { icon: ShieldCheck, label: "Identity Secure", sub: "COD Available" },
                  { icon: Truck, label: "Hyper-Speed", sub: "2-4 Day Logistics" },
                  { icon: RotateCcw, label: "7-Day Rebirth", sub: "No-Question Return" },
                ].map((item, i) => (
                  <MotionItem key={i} animation="slideUp" delay={0.2 + i * 0.1} className="flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-primary shadow-lg">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">{item.sub}</p>
                    </div>
                  </MotionItem>
                ))}
              </div>
            </MotionContainer>
          </div>
        </div>
      </div>

      {/* Neural Pairings / Recommendations */}
      {outfitPairings.length > 0 && (
        <section className="container mx-auto px-6 py-40 border-t border-white/5">
          <MotionContainer animation="stagger" className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-secondary shadow-[0_0_30px_rgba(255,0,255,0.2)]">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-[0.8]">Neural <br/><span className="text-gradient">Pairings.</span></h2>
              <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Aesthetically compatible pieces</p>
            </div>
          </MotionContainer>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {outfitPairings.map((p: any) => (
              <MotionItem key={p.id} animation="scale">
                <ProductCard product={p} />
              </MotionItem>
            ))}
          </div>
        </section>
      )}

      {/* Style Analysis Modal - Mockup */}
      <AnimatePresence>
        {isStyleAnalysisOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
          >
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 30 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="max-w-2xl w-full glass-3 !rounded-[40px] p-12 border-primary/30 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-4">
                      <BrainCircuit size={32} className="text-primary" />
                      <h2 className="text-3xl font-black tracking-tighter uppercase">Style Analysis</h2>
                   </div>
                   <button onClick={() => setIsStyleAnalysisOpen(false)} className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-all text-white/40">
                      <ChevronRight size={24} className="rotate-90" />
                   </button>
                </div>

                <div className="space-y-10">
                   {[
                     { label: "Silhouette Architecture", value: "Boxy / Futuristic", score: 95 },
                     { label: "Material Composition", value: "Neural Fiber / Tech-Knit", score: 88 },
                     { label: "Aesthetic Alignment", value: "Cyber-Luxury / Modest", score: 97 },
                     { label: "Drop Exclusivity", value: "Limited Alpha", score: 92 },
                   ].map((metric, i) => (
                     <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">{metric.label}</span>
                           <span className="text-xs font-black text-primary uppercase">{metric.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${metric.score}%` }}
                             transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                             className="h-full bg-gradient-to-r from-primary to-secondary" 
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => setIsStyleAnalysisOpen(false)}
                  className="w-full mt-16 py-6 bg-[var(--primary-color)] text-black rounded-[24px] font-black tracking-widest text-xs uppercase hover:bg-white transition-all cursor-pointer"
                >
                  Close Analysis
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Defensive: escape '<' to prevent script tag injection in JSON-LD
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": activeImages[0],
            "description": product.description,
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": `https://valceron.in/product/${product.id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "priceValidUntil": "2027-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "LUXE"
            }
          }).replace(/</g, '\\u003c')
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Defensive: escape '<' to prevent script tag injection in JSON-LD
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://valceron.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://valceron.in/shop"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": `https://valceron.in/product/${product.id}`
              }
            ]
          }).replace(/</g, '\\u003c')
        }}
      />

      {/* Mobile Sticky WhatsApp Button with pulse and label */}
      <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3 md:hidden">
        <AnimatePresence>
          {showChatToOrderLabel && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              className="bg-green-500 text-black font-mono font-bold text-[9px] tracking-widest uppercase py-2.5 px-4 rounded-xl shadow-2xl animate-bounce"
            >
              Chat to order
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={handleWhatsAppBuy}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-colors cursor-pointer"
        >
          <MessageCircle size={24} fill="currentColor" className="text-black" />
        </motion.button>
      </div>

      {/* Price Drop Alert Modal */}
      <AnimatePresence>
        {showPriceDropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="max-w-md w-full bg-[#050508] border border-white/10 rounded-3xl p-8 shadow-2xl text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-mono font-bold text-white uppercase tracking-widest">Price Drop Alert</h3>
                <button 
                  onClick={() => setShowPriceDropModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePriceDropSubmit} className="space-y-4">
                <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-wider">
                  We will notify you immediately via email/SMS when the price of **{product.name}** drops below **{convertPrice(product.price).symbol}{convertPrice(product.price).amount}**.
                </p>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={emailAlert}
                    onChange={(e) => setEmailAlert(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={phoneAlert}
                    onChange={(e) => setPhoneAlert(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAlertSubmitting}
                  className="w-full py-4 mt-2 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-[#D4AF37]/10 cursor-pointer"
                >
                  {isAlertSubmitting ? "Setting alert..." : "Set Price Alert"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
