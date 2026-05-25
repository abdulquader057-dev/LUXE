"use client";

import React, { useEffect, useState } from "react";
import { CinematicAtmosphere } from "./CinematicAtmosphere";

export default function SplashScreen() {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem("splashShown") === "true") {
      setShouldRender(false);
      const main = document.querySelector('main');
      if (main) main.style.opacity = '1';
      return;
    }

    if (prefersReducedMotion) {
      sessionStorage.setItem("splashShown", "true");
      setTimeout(() => {
        setShouldRender(false);
        const main = document.querySelector('main');
        if (main) main.style.opacity = '1';
      }, 1000);
      return;
    }

    const splash = document.getElementById("splash-screen");
    if (!splash) return;

    // Set splash as shown
    sessionStorage.setItem("splashShown", "true");

    // t = 300ms: Ornament spins in
    setTimeout(() => {
      const ornament = document.querySelector(".splash-ornament") as HTMLElement;
      if (ornament) {
        ornament.style.cssText = `
          transform: rotate(45deg) scale(1);
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
        `;
      }
    }, 300);

    // t = 700ms: Progress bar starts
    setTimeout(() => {
      const progress = document.querySelector(".splash-progress") as HTMLElement;
      if (progress) {
        progress.style.cssText = `
          width: 100%;
          transition: width 2600ms linear;
        `;
      }
    }, 700);

    // t = 800ms: "LUXE" fades and rises in
    setTimeout(() => {
      const luxe = document.querySelector(".splash-luxe") as HTMLElement;
      if (luxe) {
        luxe.style.cssText = `
          opacity: 1;
          transform: translateY(0);
          transition: 
            opacity 0.8s cubic-bezier(0.16,1,0.3,1),
            transform 0.8s cubic-bezier(0.16,1,0.3,1);
        `;
        setTimeout(() => {
          luxe.style.backgroundPosition = "100% 50%";
          luxe.style.transition += ", background-position 1.2s ease";
        }, 800);
      }
    }, 800);

    // t = 1300ms: Separator lines draw outward
    setTimeout(() => {
      const byline = document.querySelector(".splash-byline") as HTMLElement;
      if (byline) {
        byline.style.cssText = `
          opacity: 1;
          transition: opacity 0.4s ease;
        `;
        setTimeout(() => {
          const leftLine = document.querySelector(".splash-line-left") as HTMLElement;
          const rightLine = document.querySelector(".splash-line-right") as HTMLElement;
          if (leftLine) {
            leftLine.style.cssText = `
              transform: scaleX(1);
              transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
            `;
          }
          if (rightLine) {
            rightLine.style.cssText = `
              transform: scaleX(1);
              transition: transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s;
            `;
          }
        }, 100);
      }
    }, 1300);

    // t = 1700ms: "SYEDS" fades up
    setTimeout(() => {
      const syeds = document.querySelector(".splash-syeds") as HTMLElement;
      if (syeds) {
        syeds.style.cssText = `
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
        `;
      }
    }, 1700);

    // t = 2100ms: Tagline typewriter
    setTimeout(() => {
      const tagEl = document.querySelector(".splash-tagline") as HTMLElement;
      if (tagEl) {
        tagEl.style.opacity = "1";
        const text = "Beyond Luxury. Beyond Imaginable. Crafted to Define Legacy.";
        let i = 0;
        const type = () => {
          if (i < text.length) {
            tagEl.textContent = text.slice(0, ++i);
            setTimeout(type, 38);
          }
        };
        type();
      }
    }, 2100);

    // t = 2500ms: Status indicator appears
    setTimeout(() => {
      const status = document.querySelector(".splash-status") as HTMLElement;
      if (status) {
        status.style.cssText = `
          opacity: 1;
          transition: opacity 0.5s ease;
        `;
      }
    }, 2500);

    // t = 2900ms: Scanline sweeps top to bottom
    setTimeout(() => {
      const scanline = document.querySelector(".splash-scanline") as HTMLElement;
      if (scanline) {
        scanline.style.cssText = `
          opacity: 1;
          transform: translateY(-50vh);
          transition: none;
        `;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scanline.style.cssText = `
              opacity: 1;
              transform: translateY(150vh);
              transition: transform 0.8s ease-in-out, opacity 0.1s ease 0.7s;
            `;
            setTimeout(() => {
              scanline.style.opacity = "0";
            }, 700);
          });
        });
      }
    }, 2900);

    // t = 3300ms: Splash screen slides UP and away
    setTimeout(() => {
      if (splash) {
        splash.style.cssText = `
          transform: translateY(-100%);
          opacity: 0;
          transition: 
            transform 0.9s cubic-bezier(0.76, 0, 0.24, 1),
            opacity 0.6s ease 0.3s;
          pointer-events: none;
        `;
      }
    }, 3300);

    // t = 3500ms: Reveal main app
    setTimeout(() => {
      const main = document.querySelector('main');
      if (main) {
        main.style.cssText = `
          opacity: 1;
          transition: opacity 0.8s ease;
        `;
      }
    }, 3500);

    // t = 4300ms: Remove splash from DOM entirely
    setTimeout(() => {
      setShouldRender(false);
    }, 4300);
  }, []);

  if (!shouldRender) return null;

  return (
    <div id="splash-screen">
      <div className="splash-bg">
        <CinematicAtmosphere />
      </div>
      
      <div className="splash-content">
        <div className="splash-ornament"></div>
        <div className="splash-logo">
          <h1 className="splash-luxe">LUXE</h1>
          <div className="splash-byline">
            <span className="splash-line-left"></span>
            <span className="splash-by">by</span>
            <span className="splash-line-right"></span>
          </div>
          <div className="splash-syeds">SYEDS</div>
        </div>
        <p className="splash-tagline"></p>
        <div className="splash-status">
          <span className="splash-dot"></span>
          <span className="splash-status-text">
            NEURAL SYNTHESIS ACTIVE
          </span>
        </div>
      </div>
      
      <div className="splash-scanline"></div>
      <div className="splash-progress"></div>

      <style dangerouslySetInnerHTML={{__html: `
        #splash-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #03030A;
          overflow: hidden;
        }

        .splash-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          position: relative;
          z-index: 10;
        }

        .splash-luxe {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(56px, 16vw, 140px);
          letter-spacing: 0.35em;
          line-height: 1;
          background: linear-gradient(135deg, #C9A96E 0%, #F5E6C8 45%, #E8C87A 80%, #C9A96E 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          padding-right: 0.35em;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(20px);
        }

        @media (min-width: 768px) {
          .splash-luxe {
            font-size: clamp(72px, 12vw, 140px);
          }
        }

        .splash-byline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          opacity: 0;
        }

        .splash-line-left,
        .splash-line-right {
          display: block;
          height: 1px;
          background: rgba(201,169,110,0.5);
          transform: scaleX(0);
        }
        .splash-line-left  { width: 52px; transform-origin: right; }
        .splash-line-right { width: 52px; transform-origin: left; }

        .splash-by {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(201,169,110,0.8);
          letter-spacing: 0.35em;
        }

        .splash-syeds {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: clamp(18px, 3vw, 28px);
          letter-spacing: 0.55em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.9);
          opacity: 0;
          transform: translateY(10px);
          white-space: nowrap;
          padding-right: 0.55em;
        }

        .splash-tagline {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.45);
          margin-top: 8px;
          opacity: 0;
          white-space: nowrap;
        }

        .splash-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          opacity: 0;
        }

        .splash-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00E5CC;
          box-shadow: 0 0 8px rgba(0,229,204,0.8);
          animation: dotBlink 1.2s ease-in-out infinite;
        }

        @keyframes dotBlink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }

        .splash-status-text {
          font-family: 'Orbitron', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: rgba(0,229,204,0.7);
          text-transform: uppercase;
        }

        .splash-ornament {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(201,169,110,0.4);
          transform: rotate(45deg) scale(0);
          margin-bottom: 24px;
          position: relative;
        }

        .splash-ornament::after {
          content: '';
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(201,169,110,0.25);
          transform: rotate(0deg);
        }

        .splash-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(0,229,204,0.0) 10%,
            rgba(0,229,204,0.6) 50%,
            rgba(0,229,204,0.0) 90%,
            transparent 100%
          );
          transform: translateY(-50vh);
          opacity: 0;
          z-index: 20;
          pointer-events: none;
        }

        .splash-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 0%;
          background: linear-gradient(90deg, #C9A96E, #00E5CC);
          z-index: 20;
        }
      `}} />
    </div>
  );
}
