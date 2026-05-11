"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/ai/AIChatbot";
import { MOCK_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

const ProductPage = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const handleWhatsAppBuy = () => {
    const message = `Hi Zyvora! I want to buy:\n\n*Product:* ${product.name}\n*Price:* ₹${product.price}\n*Size:* ${selectedSize || 'N/A'}\n*Color:* ${selectedColor || 'N/A'}\n*Quantity:* ${quantity}\n\nCan you help me complete my order?`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/30 uppercase mb-12">
          <Link href="/">Home</Link> <ChevronRight size={12} />
          <Link href="/shop">Shop</Link> <ChevronRight size={12} />
          <span className="text-white/60">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[3/4] relative rounded-[2.5rem] overflow-hidden bg-muted group"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button className="absolute top-6 right-6 w-12 h-12 rounded-full glass-morphism flex items-center justify-center hover:scale-110 transition-transform">
                <Heart size={20} />
              </button>
            </motion.div>
            
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                    selectedImage === i ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <Image 
                    src={img} 
                    alt="" 
                    fill 
                    sizes="100px"
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">{product.category.replace("-", " ")}</span>
                <div className="h-px w-8 bg-white/20" />
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-white">{product.ratings}</span>
                  <span className="text-xs text-white/40">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">{product.name}</h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-4xl font-black tracking-tighter text-white">₹{product.price.toLocaleString()}</p>
                {product.discount && (
                  <p className="text-xl font-bold tracking-tighter text-white/30 line-through">₹{Math.round(product.price * (1 + product.discount/100)).toLocaleString()}</p>
                )}
              </div>

              <p className="text-white/60 text-lg leading-relaxed mb-10">{product.description}</p>

              {/* Selection Sections */}
              <div className="space-y-8 mb-12">
                {product.sizes && (
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Select Size</h4>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm transition-all border",
                            selectedSize === size 
                              ? "bg-white text-black border-white" 
                              : "border-white/10 hover:border-white/40"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && (
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Select Color</h4>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "px-6 py-3 rounded-xl flex items-center justify-center font-bold text-xs transition-all border",
                            selectedColor === color 
                              ? "bg-white text-black border-white" 
                              : "border-white/10 hover:border-white/40"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Quantity</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 glass border border-white/10 rounded-xl px-4 py-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/60 hover:text-white"><Minus size={18} /></button>
                      <span className="w-8 text-center font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-white/60 hover:text-white"><Plus size={18} /></button>
                    </div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{product.stock} units available</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="flex-1 py-5 bg-white text-black rounded-2xl font-black tracking-tight hover:bg-primary transition-colors flex items-center justify-center gap-3">
                  <ShoppingCart size={20} /> ADD TO CART
                </button>
                <button 
                  onClick={handleWhatsAppBuy}
                  className="flex-1 py-5 bg-[#25D366] text-white rounded-2xl font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle size={20} fill="white" /> BUY ON WHATSAPP
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-white/5">
                {[
                  { icon: ShieldCheck, label: "SECURE PAY", sub: "COD Available" },
                  { icon: Truck, label: "EXPRESS", sub: "2-4 Day Delivery" },
                  { icon: RotateCcw, label: "RETURNS", sub: "7 Day Policy" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.label}</p>
                      <p className="text-[9px] text-white/40 uppercase font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <AIChatbot />
    </main>
  );
};

export default ProductPage;
