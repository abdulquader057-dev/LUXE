import React from "react";
import LuxuryLoader from "@/components/ui/LuxuryLoader";

export default function CognitionLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] pt-20">
      <LuxuryLoader label="ENGAGING COGNITIVE STYLING NEURONS" />
    </div>
  );
}
