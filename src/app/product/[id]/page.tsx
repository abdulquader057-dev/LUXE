"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  ArrowRight
} from "lucide-react";
import { ProductViewer3D } from "@/components/shop/ProductViewer3D";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import { Magnetic } from "@/components/ui/Magnetic";
import ProductCard from "@/components/shop/ProductCard";

import { usePersonalization } from "@/lib/hooks/usePersonalization";
import { useEffect } from "react";

import { useCurrency } from "@/lib/contexts/CurrencyContext";

const ProductPage = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isStyleAnalysisOpen, setIsStyleAnalysisOpen] = useState(false);
  const { trackView, getOutfitPairing } = usePersonalization();
  const { currency, formatPrice } = useCurrency();

  useEffect(() => {
    if (product) {
      trackView(product.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const outfitPairings = getOutfitPairing(product.id);

  const handleWhatsAppBuy = () => {
    const formattedPrice = formatPrice(product.price);
    const message = `Hi Luxe! I want to buy:\n\n*Product:* ${product.name}\n*Price:* ${formattedPrice}\n*Size:* ${selectedSize || 'N/A'}\n*Color:* ${selectedColor || 'N/A'}\n*Quantity:* ${quantity}\n\nCan you help me complete my order?`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`, "_blank");
  };

  const matchRate = 96.8;

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
              <ProductViewer3D images={product.images} productName={product.name} />
            </MotionItem>
            
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {product.images.map((img, i) => (
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
                
                <div className="flex items-baseline gap-6 mb-12">
                  <p className="text-5xl font-black tracking-tighter text-gradient">{formatPrice(product.price)}</p>
                  {product.discount && (
                    <p className="text-2xl font-black tracking-tighter text-white/10 line-through">{formatPrice(Math.round(product.price * (1 + product.discount/100)))}</p>
                  )}
                </div>

                <p className="text-white/40 text-xl leading-relaxed mb-16 font-medium max-w-xl">{product.description}</p>
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
                      <h4 className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase">Select Architecture</h4>
                      <button className="text-[10px] font-black text-primary/60 hover:text-primary tracking-widest uppercase underline underline-offset-4">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
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
                  </MotionItem>
                )}

                <MotionItem animation="slideUp" delay={0.1}>
                  <h4 className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase mb-6">Quantum Quantity</h4>
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
                        className="h-full bg-primary" 
                      />
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{product.stock} Units left</p>
                  </div>
                </MotionItem>
              </div>

              {/* Action Buttons - Transaction Layer */}
              <div className="flex flex-col sm:flex-row gap-6 mb-20">
                <Magnetic>
                  <button className="w-full py-6 glass rounded-[24px] border border-white/10 flex items-center justify-center gap-4 hover:bg-white/5 hover:border-white/20 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 [transition-timing-function:var(--ease-out-expo)]" />
                    <ShoppingCart size={20} className="text-primary group-hover:scale-110 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)]" />
                    <span className="text-xs font-black tracking-[0.3em] uppercase">Add to Cart</span>
                 </button>
                </Magnetic>
                <Magnetic>
                  <button 
                    onClick={handleWhatsAppBuy}
                    className="btn-luxury btn-luxury-primary w-full !py-6"
                  >
                    <MessageCircle size={20} /> <span>WhatsApp Concierge</span>
                  </button>
                </Magnetic>
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
            {outfitPairings.map((p) => (
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
                  className="w-full mt-16 py-6 bg-primary text-black rounded-[24px] font-black tracking-widest text-xs uppercase hover:bg-white transition-all"
                >
                  Close Analysis
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductPage;
