"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LuxeLogoProps {
  className?: string;
  showTagline?: boolean;
}

const LuxeLogo = ({ className, showTagline = true }: LuxeLogoProps) => {
  const [taglineText, setTaglineText] = useState("");
  const fullText = "Beyond Luxury. Beyond Imaginable.";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startTyping = () => {
      setTaglineText("");
      setIsTyping(true);
      let i = 0;
      
      const typeChar = () => {
        if (i < fullText.length) {
          setTaglineText(fullText.substring(0, i + 1));
          i++;
          timeout = setTimeout(typeChar, 35);
        } else {
          setIsTyping(false);
          // Wait 10 seconds, then restart
          timeout = setTimeout(startTyping, 10000);
        }
      };
      
      typeChar();
    };

    startTyping();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={cn("logo-container", className)}>
      {/* Ornament: SVG diamond */}
      <div className="logo-ornament">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 2L22 12L12 22L2 12L12 2" 
            stroke="#00f2ff" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 6L18 12L12 18L6 12L12 6" 
            fill="#00f2ff" 
            fillOpacity="0.3" 
            stroke="#00f2ff" 
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
      <div className="logo-syeds">
        {"SYEDS".split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>

      {/* Tagline */}
      {showTagline && (
        <p className="logo-tagline min-h-[15px]">
          {taglineText}
          <span className={cn("inline-block w-[3px] h-[10px] ml-[2px] bg-[rgba(0,242,255,0.8)] align-middle", !isTyping && "animate-pulse")}></span>
        </p>
      )}
    </div>
  );
};

export default LuxeLogo;
