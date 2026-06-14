"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

// Helper to generate target point positions for L-U-X-E letter outlines in 3D
function generateLetterPoints(): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  // L: Centered around X = -2.8, Y = 0
  // Vertical line (30 points) & Horizontal base (15 points)
  for (let i = 0; i < 30; i++) {
    points.push(new THREE.Vector3(-2.8, -1.1 + (i / 29) * 2.2, 0));
  }
  for (let i = 1; i <= 15; i++) {
    points.push(new THREE.Vector3(-2.8 + (i / 15) * 1.0, -1.1, 0));
  }

  // U: Centered around X = -0.9, Y = 0
  // Left vertical (18 points), Right vertical (18 points), Arc bottom (9 points)
  for (let i = 0; i < 18; i++) {
    points.push(new THREE.Vector3(-1.4, -0.3 + (i / 17) * 1.4, 0));
  }
  for (let i = 0; i < 18; i++) {
    points.push(new THREE.Vector3(-0.4, -0.3 + (i / 17) * 1.4, 0));
  }
  for (let i = 0; i < 9; i++) {
    const angle = Math.PI + (i / 8) * Math.PI;
    points.push(new THREE.Vector3(-0.9 + Math.cos(angle) * 0.5, -0.3 + Math.sin(angle) * 0.4, 0));
  }

  // X: Centered around X = 0.9, Y = 0
  // Diagonal 1 (22 points), Diagonal 2 (23 points)
  for (let i = 0; i < 22; i++) {
    const y = -1.1 + (i / 21) * 2.2;
    points.push(new THREE.Vector3(0.9 + y * 0.82, y, 0));
  }
  for (let i = 0; i < 23; i++) {
    const y = -1.1 + (i / 22) * 2.2;
    points.push(new THREE.Vector3(0.9 - y * 0.82, y, 0));
  }

  // E: Centered around X = 2.8, Y = 0
  // Vertical line (24 points), Top bar (7 points), Middle bar (7 points), Bottom bar (7 points)
  for (let i = 0; i < 24; i++) {
    points.push(new THREE.Vector3(2.3, -1.1 + (i / 23) * 2.2, 0));
  }
  for (let i = 1; i <= 7; i++) {
    points.push(new THREE.Vector3(2.3 + (i / 7) * 0.9, 1.1, 0));
  }
  for (let i = 1; i <= 7; i++) {
    points.push(new THREE.Vector3(2.3 + (i / 7) * 0.7, 0.0, 0));
  }
  for (let i = 1; i <= 7; i++) {
    points.push(new THREE.Vector3(2.3 + (i / 7) * 0.9, -1.1, 0));
  }

  return points;
}

export default function CinematicSplash() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const exit = () => {
    if (exiting) return;
    setExiting(true);

    const tl = gsap.timeline({
      onComplete: () => setGone(true)
    });

    // Wipes screen like a luxury folding canvas curtain
    tl.to(containerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.3,
      ease: "power4.inOut"
    });

    tl.to([".splash-letter", ".splash-subtitle"], {
      opacity: 0,
      y: -30,
      duration: 0.5,
      stagger: 0.03,
      ease: "power2.in"
    }, 0);
  };

  useEffect(() => {
    if (sessionStorage.getItem("luxe-splash-shown")) {
      setGone(true);
      return;
    }
    sessionStorage.setItem("luxe-splash-shown", "1");

    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── WebGL Renderer Setup ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7.0;

    /* ── Studio Lighting for Glass Refraction ── */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-2, -3, -4);
    scene.add(rimLight);

    // Warm Gold Point Lights at the center of each letter (L, U, X, E)
    const letterLights = [
      new THREE.PointLight(0xd4af37, 0, 8), // L center
      new THREE.PointLight(0xd4af37, 0, 8), // U center
      new THREE.PointLight(0xd4af37, 0, 8), // X center
      new THREE.PointLight(0xd4af37, 0, 8), // E center
    ];

    letterLights[0].position.set(-2.3, 0, 0.2);
    letterLights[1].position.set(-0.9, 0, 0.2);
    letterLights[2].position.set(0.9, 0, 0.2);
    letterLights[3].position.set(2.5, 0, 0.2);

    letterLights.forEach(light => scene.add(light));

    /* ── Glass Material Configuration ── */
    // High transmission PBR material to render crystal/glass shards realistically
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      transmission: 0.96, // High glass transparency
      roughness: 0.06,
      metalness: 0.1,
      ior: 1.54, // Refractive index of crystal glass
      thickness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide
    });

    /* ── Generate Shards & Assemble ── */
    const shards: THREE.Mesh[] = [];
    const targetPoints = generateLetterPoints();

    targetPoints.forEach((targetPoint) => {
      // Alternate geometries to represent jagged broken shards
      let geom: THREE.BufferGeometry;
      if (Math.random() > 0.5) {
        geom = new THREE.ConeGeometry(0.04 + Math.random() * 0.05, 0.14 + Math.random() * 0.18, 3);
      } else {
        geom = new THREE.IcosahedronGeometry(0.06 + Math.random() * 0.06, 0);
      }

      const mesh = new THREE.Mesh(geom, glassMat);

      // Distribute shards in an exploded, scattered shell at startup
      const radius = 9 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 2,
        radius * Math.cos(phi) - 2.5
      );

      // Rotate shards randomly
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(mesh);
      shards.push(mesh);
    });

    /* ── GSAP reverse explosion timeline ── */
    const tl = gsap.timeline({
      onComplete: () => {
        // Automatically exit after display
        gsap.delayedCall(2.2, exit);
      }
    });

    // Animate shards flying together to form the letters
    shards.forEach((shard, i) => {
      const target = targetPoints[i];
      const staggerDelay = Math.random() * 0.45;

      // Fly to target positions
      gsap.to(shard.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 2.5,
        delay: staggerDelay,
        ease: "power3.inOut"
      });

      // Align rotation to flat front facing planes
      gsap.to(shard.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2.5,
        delay: staggerDelay,
        ease: "power3.inOut"
      });
    });

    // Fade in gold light inside the letters as the shards join
    tl.to(letterLights, {
      intensity: 4.5,
      duration: 1.1,
      ease: "power2.out"
    }, 2.0); // Trigger just before they assemble completely

    // Reveal logo text overlays
    tl.to({}, {
      duration: 0.1,
      onComplete: () => {
        setTextVisible(true);
      }
    }, 2.3);

    // Gently float/dissolve shards away after letters have completed
    tl.to({}, {
      duration: 0.1,
      onComplete: () => {
        shards.forEach((shard, i) => {
          const target = targetPoints[i];
          
          // Shards drift back and fade away
          gsap.to(shard.position, {
            x: target.x + (Math.random() - 0.5) * 1.5,
            y: target.y + (Math.random() - 0.5) * 1.5,
            z: target.z - (1.5 + Math.random() * 2.5),
            duration: 2.2,
            ease: "power2.out"
          });

          // Create a clone material for individual fade out
          const individualMat = glassMat.clone();
          shard.material = individualMat;
          
          gsap.to(individualMat, {
            opacity: 0,
            duration: 1.8,
            ease: "power2.out",
            onComplete: () => {
              geom.dispose();
              individualMat.dispose();
            }
          });
        });

        // Fade out letter lights
        gsap.to(letterLights, {
          intensity: 0,
          duration: 1.8,
          ease: "power2.inOut"
        });
      }
    }, 2.9);

    /* ── Render Loop ── */
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      
      // Gentle camera sway
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
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      glassMat.dispose();
      shards.forEach(s => {
        if (s.geometry) s.geometry.dispose();
      });
    };
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
      {/* Three.js Canvas for Glass Assembler */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Elegant overlay textures (Luxury, subtle noise overlay) */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-[0.015] z-10" />

      {/* Typography container (Fades in over the assembled shards) */}
      <div 
        className="relative z-20 text-center select-none px-6 transition-all duration-1000 ease-out"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "scale(1)" : "scale(0.95)",
        }}
      >
        <h1
          className="flex justify-center items-center gap-[0.1em] font-cormorant font-light text-white tracking-[0.25em]"
          style={{
            fontSize: "clamp(4.5rem, 14vw, 8.5rem)",
            lineHeight: 1,
            marginBottom: "1.2rem",
            textShadow: "0 0 40px rgba(212, 175, 55, 0.15)",
          }}
        >
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
        className="splash-skip absolute bottom-12 right-12 font-sora text-[10px] tracking-[0.25em] text-white/50 border border-white/10 hover:text-white hover:border-[#C9A84C]/50 px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer bg-white/[0.02] backdrop-blur-sm shadow-lg active:scale-95 z-30"
        style={{
          opacity: textVisible ? 0.7 : 0,
          transition: "opacity 0.8s, border-color 0.3s, color 0.3s",
        }}
      >
        ENTER COLLECTION &nbsp;→
      </button>
    </div>
  );
}
