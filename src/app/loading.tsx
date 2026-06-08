import React from "react";
import LuxuryLoader from "@/components/ui/LuxuryLoader";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508]">
      <LuxuryLoader label="CALIBRATING INTEL ARCHITECTURE" />
    </div>
  );
}
