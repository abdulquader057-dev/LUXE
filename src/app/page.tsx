"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import { cn } from "@/lib/utils";
import Link from "next/link";

const collections = [
  {
    id: "blush-tailoring",
    title: "Blush Tailoring",
    subtitle: "SS.27 Editorial",
    image: "/hero-1.jpg", 
    size: "large", // spans 2 cols, 2 rows
    align: "bottom-left"
  },
  {
    id: "neo-utility",
    title: "Neo Utility",
    subtitle: "Structural Forms",
    image: "/hero-2.jpg",
    size: "tall", // spans 1 col, 2 rows
    align: "top-right"
  },
  {
    id: "obsidian-core",
    title: "Obsidian Core",
    subtitle: "The Foundation",
    image: "/hero-3.jpg",
    size: "wide", // spans 2 cols, 1 row
    align: "center"
  },
  {
    id: "neural-layering",
    title: "Neural Layering",
    subtitle: "Adaptive Fabrics",
    image: "/hero-4.jpg",
    size: "standard", // 1 col, 1 row
    align: "bottom-right"
  },
  {
    id: "street-atelier",
    title: "Street Atelier",
    subtitle: "Urban Luxe",
    image: "/hero-1.jpg",
    size: "standard",
    align: "center"
  },
  {
    id: "luxe-objects",
    title: "Luxe Objects",
    subtitle: "Hardware & Accessories",
    image: "/hero-2.jpg",
    size: "wide",
    align: "bottom-left"
  }
];

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden bg-bg-base" style={{ opacity: 0 }}>
      <Hero />

      <section className="relative z-10 container mx-auto px-6 py-32 md:py-48">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="mb-24 md:mb-32 flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div>
            <span className="text-[10px] font-sora text-rose-gold uppercase tracking-[0.3em] block mb-4">
              Curated Selection
            </span>
            <h3 className="text-4xl md:text-6xl font-cormorant font-light tracking-tight">
              Featured <br />
              <span className="italic text-white/50">Collections</span>
            </h3>
          </div>
          <Link href="/shop" className="text-xs font-sora uppercase tracking-[0.2em] border-b border-rose-gold/30 hover:border-rose-gold text-white/70 hover:text-white transition-colors pb-1">
            View Complete Archive
          </Link>
        </motion.div>

        {/* Asymmetrical Grid (Mobile: Vertical Storytelling) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 auto-rows-[450px] md:auto-rows-[400px]">
          {collections.map((collection, i) => {
            
            // Layout mapping
            const sizeClasses = {
              "large": "md:col-span-2 md:row-span-2",
              "tall": "md:col-span-1 md:row-span-2",
              "wide": "md:col-span-2 lg:col-span-2 md:row-span-1",
              "standard": "md:col-span-1 lg:col-span-1 md:row-span-1"
            };

            const alignClasses = {
              "bottom-left": "justify-end items-start",
              "top-right": "justify-start items-end text-right",
              "center": "justify-center items-center text-center",
              "bottom-right": "justify-end items-end text-right"
            };

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                className={cn(
                  "group relative overflow-hidden bg-bg-surface rounded-sm clickable border border-white/5",
                  sizeClasses[collection.size as keyof typeof sizeClasses]
                )}
              >
                {/* Image & Parallax wrapper */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.15,1)] opacity-40 group-hover:opacity-70 grayscale group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  {/* Luxury Glow Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-0 bg-rose-gold/0 group-hover:bg-rose-gold/10 transition-colors duration-1000 mix-blend-overlay" />
                </div>

                {/* Content - Touch-first mobile typography */}
                <div className={cn("absolute inset-0 p-8 md:p-12 flex flex-col z-10", alignClasses[collection.align as keyof typeof alignClasses])}>
                  <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,1,0.5,1]">
                    <span className="text-[9px] font-sora uppercase tracking-[0.4em] text-rose-gold-light/70 block mb-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      {collection.subtitle}
                    </span>
                    <h4 className="text-3xl md:text-4xl font-cormorant font-light tracking-tight text-white group-hover:text-rose-gold transition-colors duration-700 shadow-sm">
                      {collection.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </section>
    </main>
  );
}
