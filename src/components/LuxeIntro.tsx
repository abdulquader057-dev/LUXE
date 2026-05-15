"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- SOUND SYSTEM ---
const playCinematicSound = () => {
  if (typeof window === "undefined") return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    // Deep Bass Impact
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    
    bass.type = "sine";
    bass.frequency.setValueAtTime(40, ctx.currentTime);
    bass.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
    
    bassGain.gain.setValueAtTime(0.6, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
    
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    
    // Metallic Resonance
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    
    shimmer.type = "triangle";
    shimmer.frequency.setValueAtTime(440, ctx.currentTime);
    shimmer.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 3);
    
    shimmerGain.gain.setValueAtTime(0.05, ctx.currentTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
    
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    
    bass.start();
    shimmer.start();
    bass.stop(ctx.currentTime + 3);
    shimmer.stop(ctx.currentTime + 3);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

// --- 3D COMPONENTS ---

const CinematicCloth = ({ logoTexture }: { logoTexture: THREE.Texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [phase, setPhase] = useState(0); 
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    const material = meshRef.current.material as any;
    if (material) {
      if (material.distort !== undefined) {
         material.distort = THREE.MathUtils.lerp(material.distort, phase >= 1 ? 0 : 0.4, 0.02);
         material.speed = 1.5;
      }
      material.opacity = THREE.MathUtils.lerp(material.opacity, phase >= 1 ? 0 : 1, 0.05);
    }
    
    if (t > 2.5 && phase === 0) setPhase(1);
    if (t > 5 && phase === 1) setPhase(2);
  });

  return (
    <group>
      {/* The Logo Plate */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial 
          map={logoTexture} 
          metalness={1} 
          roughness={0.05} 
          emissive="#00f2ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* The Moving Fabric (Reveal Layer) */}
      <mesh ref={meshRef} position={[0, 0, 0.2]}>
        <planeGeometry args={[12, 12, 64, 64]} />
        <MeshDistortMaterial
          color="#050505"
          speed={1.5}
          distort={0.4}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
};

const EnergyPulse = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 8) * 0.1;
    meshRef.current.scale.set(s, s, s);
    meshRef.current.rotation.z += 0.005;
    (meshRef.current.material as any).opacity = 0.1 + Math.sin(t * 4) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.5]}>
      <ringGeometry args={[2.5, 2.55, 128]} />
      <meshBasicMaterial color="#00f2ff" transparent opacity={0.1} />
    </mesh>
  );
};

const Scene = ({ logoTexture }: { logoTexture: THREE.Texture | null }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (t > 5) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -8, 0.04);
    }
  });

  if (!logoTexture) return null;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      <ambientLight intensity={0.1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffd700" />
      <pointLight position={[-10, -10, 5]} intensity={1.5} color="#00f2ff" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />
      
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <CinematicCloth logoTexture={logoTexture} />
      </Float>
      
      <EnergyPulse />
      
      <Environment preset="night" />
    </>
  );
};

// --- MAIN COMPONENT ---

export const LuxeIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [showBrandName, setShowBrandName] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/logo.jpeg", (tex) => {
      setLogoTexture(tex);
      setIsReady(true);
    });
    
    const soundTimer = setTimeout(() => {
      playCinematicSound();
    }, 800);

    const nameTimer = setTimeout(() => {
      setShowBrandName(true);
    }, 3000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 7500);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(nameTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: "blur(40px)" }}
      transition={{ duration: 1.8, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center"
    >
      {!isReady && (
         <motion.div 
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-tech tracking-[1em] text-white/30 uppercase"
         >
            Initializing Neural System...
         </motion.div>
      )}

      {isReady && (
        <>
          {/* Background Ambience */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.03)_0%,transparent_70%)]" />
          
          {/* Cinematic 3D Scene */}
          <div className="absolute inset-0">
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
              <Scene logoTexture={logoTexture} />
            </Canvas>
          </div>

          {/* Overlay UI Elements */}
          <AnimatePresence>
            {showBrandName && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, scale: 1, letterSpacing: "2.5em" }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  className="text-7xl md:text-9xl font-display font-black text-white/95 uppercase mt-32 md:mt-48 mix-blend-difference"
                >
                  LUXE
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="text-[9px] md:text-[11px] font-tech tracking-[1.5em] text-primary mt-6 uppercase"
                >
                  Architect of Future Fashion
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Cinematic Tech Accents */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            <div className="absolute top-12 left-12 w-24 h-[1px] bg-white/5" />
            <div className="absolute top-12 left-12 w-[1px] h-24 bg-white/5" />
            
            <div className="absolute bottom-12 right-12 text-right">
              <div className="text-[8px] font-tech text-white/20 tracking-widest uppercase mb-2">Neural Engine ACTIVE</div>
              <div className="w-24 h-[1px] bg-white/5 ml-auto" />
              <div className="absolute top-0 right-0 w-[1px] h-24 bg-white/5" />
            </div>
          </motion.div>

          {/* Vignette & Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </>
      )}
    </motion.div>
  );
};
