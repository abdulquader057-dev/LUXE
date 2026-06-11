"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicShowcase({ products }: { products: any[] }) {
  const featured = products.slice(0, 6);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!featured.length) return null;

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive((next + featured.length) % featured.length);
  };

  const product = featured[active];

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/5 mt-8"
      style={{ background: "linear-gradient(135deg, #06060C 0%, #0A0A16 100%)" }}>

      {/* Gold accent top line */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }} />

      <div className="flex flex-col lg:flex-row min-h-[520px]">

        {/* Left: featured product image */}
        <div className="relative flex-1 min-h-[340px] lg:min-h-[520px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.35, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={product.image || product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to right, transparent 50%, #06060C 100%), linear-gradient(to top, #06060C 0%, transparent 40%)" }} />
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <div className="absolute bottom-6 left-6 flex gap-3 z-20">
            <button onClick={() => go(active - 1)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all text-white/60">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => go(active + 1)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all text-white/60">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {featured.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className="transition-all duration-300"
                style={{
                  width: i === active ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === active ? "#C9A84C" : "rgba(255,255,255,0.2)",
                }} />
            ))}
          </div>
        </div>

        {/* Right: product details */}
        <div className="flex flex-col justify-center p-8 lg:p-12 lg:w-[380px] flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] mb-3 block"
                style={{ color: "#C9A84C" }}>
                Featured Drop · {active + 1}/{featured.length}
              </span>

              <h3 className="text-2xl lg:text-3xl font-cormorant font-light text-white leading-tight mb-4 tracking-wide">
                {product.name}
              </h3>

              <p className="text-xs font-sora text-white/50 leading-relaxed mb-6 tracking-wide max-w-xs">
                {product.description || "Premium luxury fabric. Crafted for the bold generation."}
              </p>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-xl font-mono font-bold" style={{ color: "#C9A84C" }}>
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-mono text-white/30 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <Link href={`/product/${product.id}`}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-xs font-sora font-semibold uppercase tracking-[0.15em] transition-all duration-300"
                style={{
                  background: "#C9A84C",
                  color: "#050508",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.25)",
                }}>
                View Collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="border-t border-white/5 p-4 flex gap-3 overflow-x-auto">
        {featured.map((p, i) => (
          <button key={p.id} onClick={() => go(i)}
            className="flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300"
            style={{ borderColor: i === active ? "#C9A84C" : "transparent", opacity: i === active ? 1 : 0.5 }}>
            <Image src={p.image || p.images?.[0] || "/placeholder.jpg"} alt={p.name} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </section>
  );
}
