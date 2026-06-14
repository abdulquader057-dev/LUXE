"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CinematicSplash() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const exit = () => {
    if (exiting) return;
    setExiting(true);

    const tl = gsap.timeline({
      onComplete: () => setGone(true)
    });

    // Elegant curtain slide transition
    tl.to(containerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.4,
      ease: "power4.inOut"
    });

    tl.to([".splash-letter", ".thread-svg", ".splash-subtitle"], {
      opacity: 0,
      y: -40,
      duration: 0.6,
      stagger: 0.04,
      ease: "power2.in"
    }, 0);
  };

  useEffect(() => {
    // Check session storage so it only plays once per session
    if (sessionStorage.getItem("luxe-splash-shown")) {
      setGone(true);
      return;
    }
    sessionStorage.setItem("luxe-splash-shown", "1");

    const tl = gsap.timeline({
      onComplete: () => {
        // Automatically transition into the homepage after a brief pause
        gsap.delayedCall(1.8, exit);
      }
    });

    // Initial positioning
    gsap.set(".splash-letter", { opacity: 0, y: 45, filter: "blur(12px)", scale: 0.85 });
    gsap.set(".splash-subtitle", { opacity: 0, y: 15 });
    gsap.set(".splash-skip", { opacity: 0 });

    // Golden Tailoring Thread drawing animation
    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      tl.to(path, {
        strokeDashoffset: 0,
        duration: 3.2,
        ease: "power2.inOut"
      });
    }

    // Reveal logo letters as the thread weaves by
    tl.to(".splash-letter", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.4,
      stagger: 0.28,
      ease: "power4.out"
    }, "-=2.6");

    // Reveal brand subtitle
    tl.to(".splash-subtitle", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.8");

    // Reveal skip button
    tl.to(".splash-skip", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={containerRef}
      className="splash-overlay fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        zIndex: 99999,
        background: "#07070B",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      {/* Organic thread background animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45">
        <svg
          className="thread-svg w-[90vw] max-w-[1100px] h-[300px]"
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldThreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9A7B30" />
              <stop offset="30%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="#F5EDD5" />
              <stop offset="70%" stopColor="#E8C97A" />
              <stop offset="100%" stopColor="#9A7B30" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* A winding tailor's thread path that weaves around the coordinates of L-U-X-E */}
          <path
            ref={pathRef}
            d="M 50,150 C 130,80 180,60 210,130 C 240,200 310,240 370,180 C 430,120 420,70 480,90 C 540,110 570,220 630,220 C 690,220 730,130 770,130 C 810,130 850,190 950,150"
            stroke="url(#goldThreadGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#goldGlow)"
          />
        </svg>
      </div>

      {/* Typography container */}
      <div className="relative z-10 text-center select-none px-6">
        <h1
          className="flex justify-center items-center gap-[0.1em] font-cormorant font-light text-white tracking-[0.25em]"
          style={{
            fontSize: "clamp(4.5rem, 14vw, 8.5rem)",
            lineHeight: 1,
            marginBottom: "1.2rem",
          }}
        >
          {/* Animate each letter individually */}
          <span className="splash-letter inline-block">L</span>
          <span className="splash-letter inline-block">U</span>
          <span className="splash-letter inline-block">X</span>
          <span className="splash-letter inline-block">E</span>
        </h1>
        
        <p
          className="splash-subtitle text-[9px] font-sora font-light tracking-[0.45em] uppercase"
          style={{
            color: "var(--text-secondary, #A89F94)",
          }}
        >
          Neural Tailoring &nbsp;·&nbsp; Luxury Redefined
        </p>
      </div>

      {/* Skip Button */}
      <button
        onClick={exit}
        className="splash-skip absolute bottom-12 right-12 font-sora text-[10px] tracking-[0.25em] text-white/50 border border-white/10 hover:text-white hover:border-[#C9A84C]/50 px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer bg-white/[0.02] backdrop-blur-sm shadow-lg active:scale-95"
      >
        ENTER COLLECTION &nbsp;→
      </button>
    </div>
  );
}
