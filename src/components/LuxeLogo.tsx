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
        <Image
          src="/brand/luxe-logo-cropped.webp"
          alt="LUXE THREADS"
          width={400}
          height={150}
          className="w-auto h-[24px] md:h-[28px] object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          priority
        />
      </button>

      <LogoLightbox 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </>
  );
}
