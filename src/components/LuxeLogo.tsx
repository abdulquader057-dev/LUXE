"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LuxeLogoProps {
  className?: string;
  showTagline?: boolean;
}

const LuxeLogo = ({ className, showTagline = true }: LuxeLogoProps) => {
  const words = ["Where", "Craft", "Meets", "Consciousness"];
  const [visibleWords, setVisibleWords] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animateWords = () => {
      setVisibleWords(0);
      let i = 0;
      const showNext = () => {
        if (i < words.length) {
          i++;
          setVisibleWords(i);
          timeout = setTimeout(showNext, 800);
        } else {
          timeout = setTimeout(() => setCycle(c => c + 1), 10000);
        }
      };
      showNext();
    };
    animateWords();
    return () => clearTimeout(timeout);
  }, [cycle]);

  return (
    <div className={cn("logo-container", className)}>
      <div style={{ animation: 'float 4s ease-in-out infinite' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2" stroke="#C9A962" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6L18 12L12 18L6 12L12 6" fill="#C9A962" fillOpacity="0.15" stroke="#C9A962" strokeWidth="0.75" />
        </svg>
      </div>
      <div className="logo-main">
        <h1 className="logo-luxe">LUXE THREADS</h1>
      </div>
      <div className="uppercase mt-4" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, letterSpacing: '0.4em', color: 'rgba(158,150,138,0.6)' }}>
        HYDERABAD
      </div>
      {showTagline && (
        <p className="font-cormorant italic mt-4" style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(201,169,98,0.7)', minHeight: '28px' }}>
          {words.slice(0, visibleWords).map((word, i) => (
            <span key={`${cycle}-${i}`} style={{ display: 'inline-block', marginRight: '0.3em', animation: 'fadeInWord 0.6s ease forwards', opacity: 0 }}>
              {word}
            </span>
          ))}
        </p>
      )}
      <style jsx>{`
        @keyframes fadeInWord { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
    </div>
  );
};

export default LuxeLogo;
