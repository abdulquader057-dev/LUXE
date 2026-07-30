"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoLightbox from "@/components/ui/LogoLightbox";

interface LuxeLogoProps {
  className?: string;
  showTagline?: boolean; // Kept for backward compatibility, though image replaces it
}

export default function LuxeLogo({ className }: LuxeLogoProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsLightboxOpen(true)}
        className={cn(
          "group relative flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.02]",
          className
        )}
        aria-label="View LUXE THREADS Logo"
      >
        <span className="font-cormorant text-[18px] md:text-[22px] font-normal tracking-[0.2em] uppercase whitespace-nowrap text-[#F5F0E8]">
          LUXE THREADS<span style={{ color: '#C9A962', fontSize: '1.2em', position: 'relative', top: '-2px' }}>.</span>
        </span>
      </button>

      <LogoLightbox 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </>
  );
}
