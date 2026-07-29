"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useReducedMotion from "@/hooks/useReducedMotion";
import "@/styles/opening.css";

const BRAND_NAME = "LUXE THREADS";

interface OpeningAnimationProps {
  onStartReveal?: () => void;
  onComplete: () => void;
}

export default function OpeningAnimation({ onStartReveal, onComplete }: OpeningAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const isReducedMotion = useReducedMotion();

  const onStartRevealRef = useRef(onStartReveal);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStartRevealRef.current = onStartReveal;
    onCompleteRef.current = onComplete;
  }, [onStartReveal, onComplete]);

  // Singleton guard state to prevent duplicate rendering and animation timelines
  const [shouldRender, setShouldRender] = React.useState(false);
  const animationCompletedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__LUXE_INTRO_PLAYED__) {
        console.log("[Luxe] Intro singleton guard. Skipping animation rendering.");
        if (onStartRevealRef.current) onStartRevealRef.current();
        onCompleteRef.current();
        return;
      }
      // Set played flag immediately to lock other potential mounts
      (window as any).__LUXE_INTRO_PLAYED__ = true;
      setShouldRender(true);
    }
  }, []);

  // Strict mode / early unmount cleanup guard
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && !animationCompletedRef.current) {
        console.log("[Luxe] Intro unmounted before completion. Resetting played flag.");
        delete (window as any).__LUXE_INTRO_PLAYED__;
      }
    };
  }, []);

  // Handle skip if reduced motion is requested
  useEffect(() => {
    if (isReducedMotion) {
      if (onStartRevealRef.current) onStartRevealRef.current();
      setTimeout(() => {
        onCompleteRef.current();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("open-country-modal"));
        }
      }, 300);
    }
  }, [isReducedMotion]);

  // 1. Procedural static fabric/silk weave background drawing with warm luxury gold threads
  useEffect(() => {
    if (isReducedMotion || !shouldRender) return;

    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFabricBackground = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Fill canvas background
      ctx.fillStyle = "#0A0A0C";
      ctx.fillRect(0, 0, width, height);

      // Helper function to draw weave lines with subtle organic Y wobble
      const drawWobbleLine = (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        isHorizontal: boolean
      ) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        const segments = 30;
        const length = isHorizontal ? endX - startX : endY - startY;
        const step = length / segments;

        for (let i = 1; i <= segments; i++) {
          const currentX = isHorizontal ? startX + step * i : startX;
          const currentY = isHorizontal ? startY : startY + step * i;
          const wobble = Math.random() * 1.5 - 0.75;

          if (isHorizontal) {
            ctx.lineTo(currentX, currentY + wobble);
          } else {
            ctx.lineTo(currentX + wobble, currentY);
          }
        }

        const opacity = 0.02 + Math.random() * 0.02; // max 0.04
        ctx.strokeStyle = `rgba(201, 169, 98, ${opacity})`;
        ctx.lineWidth = 0.5 + Math.random() * 0.5;
        ctx.stroke();
      };

      // Draw horizontal lines
      const horizontalLineCount = 90;
      const horizontalSpacing = height / (horizontalLineCount - 1);
      for (let i = 0; i < horizontalLineCount; i++) {
        const y = i * horizontalSpacing;
        drawWobbleLine(0, y, width, y, true);
      }

      // Draw vertical lines
      const verticalLineCount = 90;
      const verticalSpacing = width / (verticalLineCount - 1);
      for (let i = 0; i < verticalLineCount; i++) {
        const x = i * verticalSpacing;
        drawWobbleLine(x, 0, x, height, false);
      }
    };

    drawFabricBackground();
    window.addEventListener("resize", drawFabricBackground);

    return () => {
      window.removeEventListener("resize", drawFabricBackground);
    };
  }, [isReducedMotion, shouldRender]);

  // 2. Classy GSAP Typography Reveal Timeline
  useEffect(() => {
    if (isReducedMotion || !shouldRender) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Step 1: Fade weave background canvas from 0 to 1 over 1.2s
      tl.fromTo(
        bgCanvasRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" },
        0.1
      );

      // Step 2: Elegant typography reveal of "LUXE THREADS" letters
      tl.to(
        ".opening-brand span",
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.8,
          stagger: 0.05,
          ease: "CustomEase.create('custom', '0.16, 1, 0.3, 1')",
        },
        0.5
      );

      // Step 3: Expand shimmer bar line
      tl.to(
        ".opening-shimmer-line",
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        1.1
      );

      // Step 4: Reveal luxury taglines
      tl.to(
        [".opening-tagline", ".opening-subtagline"],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        },
        1.3
      );

      // Step 5: Fade out HTML text overlay
      tl.to(
        [".opening-brand", ".opening-shimmer-line", ".opening-taglines"],
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: "power2.out",
        },
        3.4
      );

      // Step 6: Fade out full overlay container to reveal main site content
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 1.0,
          ease: "power2.out",
          onStart: () => {
            if (onStartRevealRef.current) {
              onStartRevealRef.current();
            }
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("open-country-modal"));
            }
          },
        },
        3.8
      );
    });

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, shouldRender]);

  if (isReducedMotion || !shouldRender) return null;

  return (
    <div ref={overlayRef} className="opening-overlay">
      {/* Background static canvas for organic luxury silk weave */}
      <canvas ref={bgCanvasRef} className="opening-canvas" style={{ opacity: 0 }} />

      {/* Typography Overlay */}
      <div className="opening-brand">
        {BRAND_NAME.split("").map((letter, idx) => (
          <span
            key={idx}
            style={{
              display: letter === " " ? "inline-block" : "inline-block",
              width: letter === " " ? "0.4em" : "auto",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>

      {/* Shimmer Line */}
      <div className="opening-shimmer-line">
        <div className="opening-shimmer-bar" />
      </div>

      <div className="opening-taglines">
        <p className="opening-tagline">Premium Indian Fashion</p>
        <p className="opening-subtagline">Hyderabad · Est. 2026</p>
      </div>
    </div>
  );
}
