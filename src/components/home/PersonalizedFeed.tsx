"use client";

import React from "react";
import { usePersonalization } from "@/lib/hooks/usePersonalization";
import ProductCard from "@/components/shop/ProductCard";
import { MotionContainer, MotionItem } from "@/components/MotionContainer";
import { Sparkles, History } from "lucide-react";

export const PersonalizedFeed = () => {
  const { recommendations, recentlyViewed } = usePersonalization();

  if (recommendations.length === 0 && recentlyViewed.length === 0) return null;

  return (
    <div className="space-y-40 pb-40">
      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="container mx-auto px-6 relative">
          <div className="absolute -left-20 top-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
          <MotionContainer animation="stagger" className="flex items-center gap-6 mb-16 relative z-10">
            <div className="w-16 h-16 rounded-[24px] glass-3 border border-white/5 flex items-center justify-center text-white/40 shadow-xl">
              <History size={28} />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.8]">Recently <br/><span className="text-white/40">Synced.</span></h2>
              <p className="text-[10px] font-black tracking-[0.4em] text-primary/40 uppercase mt-2">Your aesthetic evolution trail</p>
            </div>
            <div className="h-px flex-1 bg-white/5 ml-8 hidden md:block" />
          </MotionContainer>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {recentlyViewed.slice(0, 4).map((product) => (
              <MotionItem key={product.id} animation="scale">
                <ProductCard product={product} />
              </MotionItem>
            ))}
          </div>
        </section>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section className="container mx-auto px-6 relative py-32 rounded-[60px] overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 -skew-y-3 scale-110" />
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full" />
          
          <div className="relative z-10">
            <MotionContainer animation="stagger" className="flex items-center gap-6 mb-16">
              <div className="w-16 h-16 rounded-[24px] bg-secondary flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,0,255,0.4)]">
                <Sparkles size={28} />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.8]">Neural <br/><span className="text-gradient">Curation.</span></h2>
                <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mt-2">Architected by ZYRA Intelligence</p>
              </div>
              <div className="h-px flex-1 bg-white/5 ml-8 hidden md:block opacity-20" />
            </MotionContainer>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {recommendations.map((product) => (
                <MotionItem key={product.id} animation="scale">
                  <ProductCard product={product} />
                </MotionItem>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
