"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import useReducedMotion from "@/hooks/useReducedMotion";
import "@/styles/opening.css";

const BRAND_NAME = "LUXE";

interface OpeningAnimationProps {
  onStartReveal?: () => void;
  onComplete: () => void;
}

// Dictionary of procedural 3D target coordinates tracing out L-U-X-E letter forms
type PointGenerator = (centerX: number) => THREE.Vector3[];

const characterPaths: Record<string, PointGenerator> = {
  L: (cx) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      pts.push(new THREE.Vector3(cx - 0.4, -1.1 + (i / 29) * 2.2, 0));
    }
    for (let i = 1; i <= 15; i++) {
      pts.push(new THREE.Vector3(cx - 0.4 + (i / 15) * 0.9, -1.1, 0));
    }
    return pts;
  },
  U: (cx) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 18; i++) {
      pts.push(new THREE.Vector3(cx - 0.5, -0.3 + (i / 17) * 1.4, 0));
    }
    for (let i = 0; i < 18; i++) {
      pts.push(new THREE.Vector3(cx + 0.5, -0.3 + (i / 17) * 1.4, 0));
    }
    for (let i = 0; i < 9; i++) {
      const angle = Math.PI + (i / 8) * Math.PI;
      pts.push(new THREE.Vector3(cx + Math.cos(angle) * 0.5, -0.3 + Math.sin(angle) * 0.4, 0));
    }
    return pts;
  },
  X: (cx) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 22; i++) {
      const y = -1.1 + (i / 21) * 2.2;
      pts.push(new THREE.Vector3(cx + y * 0.82, y, 0));
    }
    for (let i = 0; i < 23; i++) {
      const y = -1.1 + (i / 22) * 2.2;
      pts.push(new THREE.Vector3(cx - y * 0.82, y, 0));
    }
    return pts;
  },
  E: (cx) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 24; i++) {
      pts.push(new THREE.Vector3(cx - 0.4, -1.1 + (i / 23) * 2.2, 0));
    }
    for (let i = 1; i <= 7; i++) {
      pts.push(new THREE.Vector3(cx - 0.4 + (i / 7) * 0.8, 1.1, 0));
    }
    for (let i = 1; i <= 7; i++) {
      pts.push(new THREE.Vector3(cx - 0.4 + (i / 7) * 0.6, 0.0, 0));
    }
    for (let i = 1; i <= 7; i++) {
      pts.push(new THREE.Vector3(cx - 0.4 + (i / 7) * 0.8, -1.1, 0));
    }
    return pts;
  }
};

const getFallbackPoints = (cx: number): THREE.Vector3[] => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 15; i++) pts.push(new THREE.Vector3(cx - 0.4, -1.1 + (i / 14) * 2.2, 0));
  for (let i = 0; i < 15; i++) pts.push(new THREE.Vector3(cx + 0.4, -1.1 + (i / 14) * 2.2, 0));
  return pts;
};

export default function OpeningAnimation({ onStartReveal, onComplete }: OpeningAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const glassCanvasRef = useRef<HTMLCanvasElement>(null);
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
    console.log("[Luxe] OpeningAnimation mounted. prefers-reduced-motion status:", isReducedMotion);
    if (isReducedMotion) {
      console.log("[Luxe] Skipping opening animation to respect user accessibility preferences.");
      if (onStartRevealRef.current) onStartRevealRef.current();
      setTimeout(() => {
        onCompleteRef.current();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("open-country-modal"));
        }
      }, 300);
    }
  }, [isReducedMotion]);

  // 1. Procedural static fabric weave background drawing
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

      // Fill canvas background (#0a0a0a)
      ctx.fillStyle = "#0a0a0a";
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
          const progress = i / segments;
          const currentX = isHorizontal ? startX + step * i : startX;
          const currentY = isHorizontal ? startY : startY + step * i;
          const wobble = Math.random() * 2 - 1;

          if (isHorizontal) {
            ctx.lineTo(currentX, currentY + wobble);
          } else {
            ctx.lineTo(currentX + wobble, currentY);
          }
        }

        const opacity = 0.04 + Math.random() * 0.08;
        ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
        ctx.lineWidth = 0.5 + Math.random() * 0.5;
        ctx.stroke();
      };

      // Draw horizontal lines
      const horizontalLineCount = 100;
      const horizontalSpacing = height / (horizontalLineCount - 1);
      for (let i = 0; i < horizontalLineCount; i++) {
        const y = i * horizontalSpacing;
        drawWobbleLine(0, y, width, y, true);
      }

      // Draw vertical lines
      const verticalLineCount = 100;
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

  // 2. Three.js Refractive Glass Shards Assembly setup
  useEffect(() => {
    if (isReducedMotion || !shouldRender) return;

    const canvas = glassCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7.5;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.8);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa0c4ff, 0.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Dynamic scale calculations for responsive mobile layout alignment
    const aspect = window.innerWidth / window.innerHeight;
    let spacing = 1.9;
    let shardScaleMultiplier = 1.0;

    if (aspect < 1.0) {
      // Mobile / Portrait viewports
      spacing = Math.max(1.0, 1.9 * aspect * 1.1);
      shardScaleMultiplier = Math.max(0.5, aspect * 1.15);
    } else if (aspect < 1.5) {
      // Tablets
      spacing = 1.55;
      shardScaleMultiplier = 0.8;
    }

    const totalWidth = (BRAND_NAME.length - 1) * spacing;
    const startX = -totalWidth / 2;

    const targetPoints: THREE.Vector3[] = [];
    const letterPointsIndices: number[][] = [];

    let currentGlobalIndex = 0;
    for (let i = 0; i < BRAND_NAME.length; i++) {
      const char = BRAND_NAME[i].toUpperCase();
      const cx = startX + i * spacing;
      const generator = characterPaths[char] || getFallbackPoints;
      const pts = generator(cx);

      const indices: number[] = [];
      pts.forEach((pt) => {
        // Apply responsive vertical center alignment adjusting target coordinates
        targetPoints.push(pt);
        indices.push(currentGlobalIndex);
        currentGlobalIndex++;
      });
      letterPointsIndices.push(indices);
    }

    // Local point lights behind each letter for glowing refraction
    const letterLights: THREE.PointLight[] = [];
    for (let i = 0; i < BRAND_NAME.length; i++) {
      const cx = startX + i * spacing;
      const light = new THREE.PointLight(0x00f2ff, 0, 8);
      light.position.set(cx, 0, 0.2);
      scene.add(light);
      letterLights.push(light);
    }

    // High Transmission Physical Glass Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      transmission: 0.96,
      roughness: 0.06,
      metalness: 0.1,
      ior: 1.54,
      thickness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
    });

    // Generate responsive size shards
    const shards: THREE.Mesh[] = [];
    targetPoints.forEach((target) => {
      let geom: THREE.BufferGeometry;
      if (Math.random() > 0.5) {
        geom = new THREE.ConeGeometry(
          (0.04 + Math.random() * 0.05) * shardScaleMultiplier,
          (0.14 + Math.random() * 0.18) * shardScaleMultiplier,
          3
        );
      } else {
        geom = new THREE.IcosahedronGeometry((0.06 + Math.random() * 0.06) * shardScaleMultiplier, 0);
      }

      const mesh = new THREE.Mesh(geom, glassMat);

      // Start scattered in 3D space (Particle Formation start state)
      mesh.position.set(
        target.x + (Math.random() - 0.5) * 6.0,
        target.y + (Math.random() - 0.5) * 6.0,
        target.z + 4.0 + Math.random() * 4.0
      );

      // Add a full random rotation for organic glass facet look
      mesh.rotation.set(
        (Math.random() - 0.5) * 2 * Math.PI,
        (Math.random() - 0.5) * 2 * Math.PI,
        (Math.random() - 0.5) * 2 * Math.PI
      );

      scene.add(mesh);
      shards.push(mesh);
    });

    // ── Timings & Timeline ──
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Step 0: Fade in WebGL canvas instantly at start to show scattered shards
      tl.to(
        glassCanvasRef.current,
        { opacity: 1, duration: 0.1, ease: "none" },
        0
      );

      // Ensure glass material starts fully opaque at t=0s
      tl.set(glassMat, { opacity: 0.9 }, 0);

      // Step 1: Fade weave background from 0 to 1 over 1.2s starting at 0.1s
      tl.fromTo(
        bgCanvasRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.inOut" },
        0.1
      );

      // Slowly push camera Z position in from 7.5 to 5.2 over 2.5s
      tl.to(
        camera.position,
        {
          z: 5.2,
          duration: 2.5,
          ease: "power1.inOut",
        },
        0.3
      );

      // Step 2: Assemble shards to target position (Particle Formation) from t=0.1s to t=1.4s
      shards.forEach((shard, i) => {
        const target = targetPoints[i];
        
        tl.to(
          shard.position,
          {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 1.3,
            ease: "power2.out",
          },
          0.1
        );
        
        tl.to(
          shard.rotation,
          {
            x: (Math.random() - 0.5) * 0.15,
            y: (Math.random() - 0.5) * 0.15,
            z: (Math.random() - 0.5) * 0.15,
            duration: 1.3,
            ease: "power2.out",
          },
          0.1
        );
      });

      // Step 3: Fade in lighting behind shards to make them glow (LUXE Reveal) at t=1.2s
      tl.to(
        letterLights,
        {
          intensity: 4.5,
          duration: 0.6,
          ease: "power2.out",
        },
        1.2
      );

      // Step 4: Shatter / Explode glass shards and fade out material at t=1.9s
      shards.forEach((shard, i) => {
        const target = targetPoints[i];
        
        tl.to(
          shard.position,
          {
            x: target.x + (Math.random() - 0.5) * 5.0,
            y: target.y + (Math.random() - 0.5) * 5.0,
            z: target.z + 8.0 + Math.random() * 4.0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          1.9
        );
        
        tl.to(
          shard.rotation,
          {
            x: (Math.random() - 0.5) * Math.PI,
            y: (Math.random() - 0.5) * Math.PI,
            z: (Math.random() - 0.5) * Math.PI,
            duration: 1.2,
            ease: "power2.inOut",
          },
          1.9
        );
      });

      // Fade out material and point lights during shatter
      tl.to(
        glassMat,
        {
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        1.9
      );

      tl.to(
        letterLights,
        {
          intensity: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        1.9
      );

      // Step 5: Fade out the entire overlay to reveal the home page (starting at t=1.8s)
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          scale: 1.04,
          pointerEvents: "none",
          duration: 1.2,
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
        1.8
      );
    });

    // ── WebGL Context Loss Handlers ──
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("[Luxe WebGL] context lost in OpeningAnimation");
      cancelAnimationFrame(animId);
    };

    const handleContextRestored = () => {
      console.log("[Luxe WebGL] context restored in OpeningAnimation");
      loop();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    // ── Three.js Loop ──
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const time = performance.now() * 0.001;
      camera.position.x = Math.sin(time * 0.5) * 0.15;
      camera.position.y = Math.cos(time * 0.5) * 0.1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      glassMat.dispose();
      shards.forEach((s) => {
        if (s.geometry) s.geometry.dispose();
      });
      ctx.revert();
    };
  }, [isReducedMotion, shouldRender]);

  if (isReducedMotion || !shouldRender) return null;

  return (
    <div ref={overlayRef} className="opening-overlay">
      {/* Background static canvas for organic weave */}
      <canvas ref={bgCanvasRef} className="opening-canvas" style={{ opacity: 0 }} />

      {/* Foreground WebGL canvas for glass shards */}
      <canvas ref={glassCanvasRef} className="glass-shards-canvas" />
    </div>
  );
}
