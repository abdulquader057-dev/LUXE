import { createSupabaseServerClient } from "@/lib/supabaseServer";
import ProductPageClient from "./ProductPageClient";
import Link from "next/link";
import Image from "next/image";
import { Lock, ShieldAlert, BrainCircuit, ArrowLeft, LogIn } from "lucide-react";
import { parseDbProduct } from "@/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPageWrapper({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // 1. Fetch Product from Supabase
  let product = null;
  const { data: dbProduct } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (dbProduct) {
    product = parseDbProduct(dbProduct);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#020203] text-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="text-[#C9A84C] mb-4" size={48} />
        <h1 className="text-2xl font-display uppercase tracking-widest text-white mb-2">Manifest Not Found</h1>
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-6">The requested product ID does not exist in LUXE OS catalog.</p>
        <Link href="/shop" className="px-6 py-3 border border-[#C9A84C] text-[#C9A84C] font-mono text-xs uppercase tracking-widest hover:bg-[#C9A84C]/5 transition-colors">
          Return to Archive
        </Link>
      </main>
    );
  }

  // 2. Check if product is gated under a Drop Gate requirement
  const { data: gate } = await supabase
    .from("drop_gates")
    .select("*")
    .eq("product_id", product.id)
    .single();

  if (gate) {
    // Check authenticated user details securely using official getUser helper (avoiding client cookie decoding)
    const { data: { user } } = await supabase.auth.getUser();
    let isLocked = true;
    let userLevel = 0;
    let userXp = 0;

    if (user) {
      const { data: dna } = await supabase
        .from("style_dna")
        .select("*")
        .eq("id", user.id)
        .single();
      
      userLevel = dna?.level || 1;
      userXp = dna?.xp || 0;
      
      if (userLevel >= gate.required_xp_level) {
        isLocked = false;
      }
    }

    if (isLocked) {
      // Render Locked UI (Server-Rendered for complete bypass security)
      const requiredLevel = gate.required_xp_level;
      const progressPercent = userLevel > 0 ? Math.min(100, (userLevel / requiredLevel) * 100) : 0;
      const firstImage = Array.isArray(product.images) ? product.images[0] : product.images;

      return (
        <main className="min-h-screen bg-[#020203] text-[#F9FAFB] relative overflow-hidden flex items-center justify-center pt-28 pb-20 px-6">
          {/* Blurred Background Asset Overlay */}
          {firstImage && (
            <div className="absolute inset-0 opacity-[0.04] blur-2xl scale-110 pointer-events-none">
              <Image src={firstImage} alt="" fill className="object-cover" />
            </div>
          )}
          
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#C9A84C]/5 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-lg bg-[#0A0A0C]/80 border border-white/5 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-2xl space-y-8 text-center relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 animate-pulse">
                <Lock size={28} />
              </div>
              <h1 className="text-3xl font-display font-light italic tracking-tight text-white mb-2">Gated Drop Lockout</h1>
              <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">LUXE Class Protection Level In Effect</p>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Asset</span>
                <span className="text-xs font-bold text-white uppercase">{product.name}</span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                  <span>Level Requirement</span>
                  <span className="text-[#C9A84C] font-bold">Level {requiredLevel}</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                  <span>Your Current Identity</span>
                  <span className={user ? "text-white font-bold" : "text-white/30"}>
                    {user ? `Level ${userLevel}` : "Guest Identity (Unauthenticated)"}
                  </span>
                </div>
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-[#C9A84C] transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {user && (
                  <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest text-right mt-1">
                    {userXp} XP accumulated
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {!user ? (
                <>
                  <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">
                    You must authenticate your LUXE account node to check your XP Level and unlock restricted drop vaults.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link 
                      href={`/auth?redirect=/product/${product.id}`}
                      className="w-full py-4 bg-[#C9A84C] text-[#020203] font-mono font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#C9A84C]/90 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn size={14} /> Authenticate Node
                    </Link>
                    <Link 
                      href="/shop"
                      className="w-full py-4 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={14} /> Return to Shop
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 text-left">
                    <BrainCircuit className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">
                      Styling Node Level inadequate. Gain XP by participating in brand events, active styling challenges, and purchase manifests to elevate your Style DNA level.
                    </p>
                  </div>
                  <Link 
                    href="/shop"
                    className="w-full py-4 border border-[#C9A84C] text-[#C9A84C] font-mono text-xs uppercase tracking-widest rounded-2xl hover:bg-[#C9A84C]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Return to Shop
                  </Link>
                </>
              )}
            </div>
          </div>
        </main>
      );
    }
  }

  // Render normal ProductPage Client Component if unlocked
  return <ProductPageClient product={product} />;
}
