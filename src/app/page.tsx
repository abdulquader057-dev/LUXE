import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/shop/ProductCard";
import AIChatbot from "@/components/ai/AIChatbot";
import Footer from "@/components/Footer";
import { MOCK_PRODUCTS } from "@/data/products";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const trendingProducts = MOCK_PRODUCTS.filter(p => p.isTrending);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Featured Collection */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              CURRENT <span className="text-primary">DROPS.</span>
            </h2>
            <p className="text-white/40 max-w-md font-medium tracking-wide">
              Hand-picked futuristic essentials, from techwear-inspired modest pieces to hyper-luxury accessories.
            </p>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-xs font-black tracking-[0.2em] text-white/60 hover:text-white transition-colors">
            VIEW ALL COLLECTIONS <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* AI Experience Teaser */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 scale-110" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass-morphism rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-16 border-primary/20">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,242,255,0.4)]">
                <Sparkles size={24} className="text-black" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                EVOLVE YOUR <br />
                <span className="text-gradient">IDENTITY.</span>
              </h2>
              <p className="text-lg text-white/60 mb-12 max-w-lg leading-relaxed">
                Our proprietary Fashion Intelligence Engine analyzes your persona, preferences, 
                and physical traits to curate a truly unique futuristic wardrobe.
              </p>
              <Link href="/ai-style" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black tracking-tight hover:bg-primary transition-colors">
                FIND MY STYLE <Sparkles size={20} />
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square glass rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-primary/40 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary animate-pulse opacity-40 blur-3xl" />
                <div className="text-center z-10">
                  <p className="text-5xl font-black tracking-tighter mb-2">98%</p>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Match Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 container mx-auto px-6">
        <h2 className="text-3xl font-black tracking-tighter mb-12 flex items-center gap-4">
          <div className="w-8 h-px bg-primary" /> CATEGORIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 aspect-[16/9] md:aspect-auto md:h-[600px] relative rounded-3xl overflow-hidden group cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1539109132314-34759616b408?q=80&w=1000&auto=format&fit=crop"
              alt="Modest Wear"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
              <h3 className="text-4xl font-black tracking-tighter mb-2">MODEST TECH</h3>
              <p className="text-white/60 mb-6 text-sm">Minimalist silhouettes. Maximum utility.</p>
              <button className="w-fit text-xs font-bold tracking-widest border-b border-primary text-primary pb-1">DISCOVER NOW</button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px]">
              <Image 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
                alt="Sneakers"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-black tracking-tighter mb-1">HYPE KICKS</h3>
                <button className="w-fit text-[10px] font-bold tracking-widest text-primary">SHOP SNEAKERS</button>
              </div>
            </div>
            <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px]">
              <Image 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                alt="Accessories"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-black tracking-tighter mb-1">CYBER ACCS</h3>
                <button className="w-fit text-[10px] font-bold tracking-widest text-primary">SHOP ACCESSORIES</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </main>
  );
}

// Add a helper for Next.js Image component in server component if needed, 
// but since I'm using "use client" in many components, I'll keep it simple here.
import Image from "next/image";
