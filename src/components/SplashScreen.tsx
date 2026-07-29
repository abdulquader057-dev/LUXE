"use client";

import React, { useEffect, useState } from "react";
import { CinematicAtmosphere } from "./CinematicAtmosphere";

export default function SplashScreen() {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
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

    sessionStorage.setItem("splashShown", "true");

    setTimeout(() => {
      const ornament = document.querySelector(".splash-ornament") as HTMLElement;
      if (ornament) {
        ornament.style.cssText = `
          transform: rotate(45deg) scale(1);
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.15, 1);
        `;
      }
    }, 300);

    setTimeout(() => {
      const progress = document.querySelector(".splash-progress") as HTMLElement;
      if (progress) {
        progress.style.cssText = `
          width: 100%;
          transition: width 2600ms cubic-bezier(0.25, 1, 0.15, 1);
        `;
      }
    }, 700);

    setTimeout(() => {
      const luxe = document.querySelector(".splash-luxe") as HTMLElement;
      if (luxe) {
        luxe.style.cssText = `
          opacity: 1;
          transform: translateY(0);
          transition: 
            opacity 1s cubic-bezier(0.25, 1, 0.15, 1),
            transform 1s cubic-bezier(0.25, 1, 0.15, 1);
        `;
        setTimeout(() => {
          luxe.style.backgroundPosition = "100% 50%";
          luxe.style.transition += ", background-position 1.5s ease";
        }, 800);
      }
    }, 800);

    setTimeout(() => {
      const byline = document.querySelector(".splash-byline") as HTMLElement;
      if (byline) {
        byline.style.cssText = `
          opacity: 1;
          transition: opacity 0.6s ease;
        `;
        setTimeout(() => {
          const leftLine = document.querySelector(".splash-line-left") as HTMLElement;
          const rightLine = document.querySelector(".splash-line-right") as HTMLElement;
          if (leftLine) {
            leftLine.style.cssText = `
              transform: scaleX(1);
              transition: transform 0.6s cubic-bezier(0.25, 1, 0.15, 1);
            `;
          }
          if (rightLine) {
            rightLine.style.cssText = `
              transform: scaleX(1);
              transition: transform 0.6s cubic-bezier(0.25, 1, 0.15, 1) 0.1s;
            `;
          }
        }, 100);
      }
    }, 1300);

    setTimeout(() => {
      const syeds = document.querySelector(".splash-syeds") as HTMLElement;
      if (syeds) {
        syeds.style.cssText = `
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 1, 0.15, 1);
        `;
      }
    }, 1700);

    setTimeout(() => {
      const tagEl = document.querySelector(".splash-tagline") as HTMLElement;
      if (tagEl) {
        tagEl.style.opacity = "1";
        const text = "The House of Refined Futures";
        let i = 0;
        const type = () => {
          if (i < text.length) {
            tagEl.textContent = text.slice(0, ++i);
            setTimeout(type, 45);
          }
        };
        type();
      }
    }, 2100);

    setTimeout(() => {
      const status = document.querySelector(".splash-status") as HTMLElement;
      if (status) {
        status.style.cssText = `
          opacity: 1;
          transition: opacity 0.8s ease;
        `;
      }
    }, 2500);

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
              transition: transform 1s ease-in-out, opacity 0.2s ease 0.8s;
            `;
            setTimeout(() => {
              scanline.style.opacity = "0";
            }, 900);
          });
        });
      }
    }, 2900);

    setTimeout(() => {
      if (splash) {
        splash.style.cssText = `
          transform: translateY(-100%);
          opacity: 0;
          transition: 
            transform 1s cubic-bezier(0.76, 0, 0.24, 1),
            opacity 0.6s ease 0.4s;
          pointer-events: none;
        `;
      }
    }, 3300);

    setTimeout(() => {
      const main = document.querySelector('main');
      if (main) {
        main.style.cssText = `
          opacity: 1;
          transition: opacity 1s cubic-bezier(0.25, 1, 0.15, 1);
        `;
      }
    }, 3500);

    setTimeout(() => {
      setShouldRender(false);
    }, 4500);
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
          <h1 className="splash-luxe">LUXE THREADS</h1>
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
            OBSIDIAN CORE LOADED
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
          background: #020202;
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
          font-family: var(--font-cormorant), serif;
          font-weight: 300;
          font-size: clamp(56px, 16vw, 140px);
          letter-spacing: 0.15em;
          line-height: 1;
          background: linear-gradient(135deg, #B76E79 0%, #E0BFB8 45%, #D4AF37 80%, #B76E79 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
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
          gap: 16px;
          opacity: 0;
          margin: 8px 0;
        }

        .splash-line-left,
        .splash-line-right {
          display: block;
          height: 1px;
          background: rgba(224,191,184,0.3);
          transform: scaleX(0);
        }
        .splash-line-left  { width: 60px; transform-origin: right; }
        .splash-line-right { width: 60px; transform-origin: left; }

        .splash-by {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 16px;
          color: rgba(253,251,247,0.5);
          letter-spacing: 0.1em;
        }

        .splash-syeds {
          font-family: var(--font-sora), sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(253,251,247,0.7);
          opacity: 0;
          transform: translateY(10px);
          white-space: nowrap;
        }

        .splash-tagline {
          font-family: var(--font-sora), sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(253,251,247,0.4);
          margin-top: 16px;
          opacity: 0;
          white-space: nowrap;
        }

        .splash-status {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 40px;
          opacity: 0;
        }

        .splash-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #F4C2C2;
          box-shadow: 0 0 10px rgba(244,194,194,0.6);
          animation: dotBlink 1.5s ease-in-out infinite;
        }

        @keyframes dotBlink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.8); }
        }

        .splash-status-text {
          font-family: var(--font-sora), sans-serif;
          font-size: 8px;
          letter-spacing: 0.3em;
          color: rgba(244,194,194,0.6);
          text-transform: uppercase;
        }

        .splash-ornament {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(224,191,184,0.2);
          transform: rotate(45deg) scale(0);
          margin-bottom: 24px;
          position: relative;
        }

        .splash-ornament::after {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(224,191,184,0.15);
          transform: rotate(0deg);
        }

        .splash-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(244,194,194,0.0) 20%,
            rgba(244,194,194,0.3) 50%,
            rgba(244,194,194,0.0) 80%,
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
          height: 2px;
          width: 0%;
          background: linear-gradient(90deg, #B76E79, #F4C2C2);
          z-index: 20;
        }
      `}} />
    </div>
  );
}
