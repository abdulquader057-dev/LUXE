"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LuxeLogoProps {
  className?: string;
  showTagline?: boolean;
}

const LuxeLogo = ({ className, showTagline = true }: LuxeLogoProps) => {
  return (
    <div className={cn("logo-container", className)}>
      {/* Ornament: SVG diamond */}
      <div className="logo-ornament">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 2L22 12L12 22L2 12L12 2" 
            stroke="#C9A96E" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 6L18 12L12 18L6 12L12 6" 
            fill="#C9A96E" 
            fillOpacity="0.3" 
            stroke="#C9A96E" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Brand Word */}
      <div className="logo-main">
        <h1 className="logo-luxe">LUXE</h1>
      </div>

      {/* Byline */}
      <div className="logo-byline">
        <span className="separator-line left"></span>
        <span className="logo-by">by</span>
        <span className="separator-line right"></span>
      </div>

      {/* Designer Brand name */}
      <div className="logo-syeds">SYEDS</div>

      {/* Tagline */}
      {showTagline && (
        <p className="logo-tagline">
          Beyond Luxury. Beyond Imaginable.
        </p>
      )}
    </div>
  );
};

export default LuxeLogo;
