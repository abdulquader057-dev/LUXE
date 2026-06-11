"use client";

import dynamic from "next/dynamic";

const SciFiHero = dynamic(
  () => import("@/components/home/SciFiHero"),
  { ssr: false, loading: () => (
    <div className="relative w-full h-screen bg-[#030305] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 border-2 border-white/5 border-t-[#00f2ff] rounded-full animate-spin" />
        <span className="text-[9px] font-mono tracking-[0.5em] text-[#00f2ff]/60 uppercase">SYNCHRONIZING APERTURE DATA...</span>
      </div>
    </div>
  ) }
);

export default function SciFiWrapper() {
  return <SciFiHero />;
}
