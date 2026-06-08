import React from "react";
import LuxuryLoader from "@/components/ui/LuxuryLoader";

export default function ProductLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] pt-20">
      <LuxuryLoader label="DECODING PATTERN SPECIFICATIONS" />
    </div>
  );
}
