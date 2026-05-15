"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  MeshDistortMaterial, 
  Stars, 
  Points, 
  PointMaterial,
  useTexture,
  Center
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// --- SOUND SYSTEM (Synthesized for Premium Texture) ---
const playCinematicSequence = () => {
  if (typeof window === "undefined") return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.connect(ctx.destination);

    const playBassImpact = (time: number, freq: number, volume: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 4);
      g.gain.setValueAtTime(volume, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 4);
      osc.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + 4);
    };

    const playMetallicSweep = (time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, time);
      filter.frequency.exponentialRampToValueAtTime(100, time + 2);
      g.gain.setValueAtTime(0.05, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 2);
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + 2);
    };

    // Sequence
    playBassImpact(ctx.currentTime, 50, 0.8); // 0s Initial Impact
    playMetallicSweep(ctx.currentTime + 1.5); // 1.5s Fabric Start
    playBassImpact(ctx.currentTime + 3, 40, 1.0); // 3s Logo Reveal Impact
    playMetallicSweep(ctx.currentTime + 5); // 5s Energy Surge
  } catch (e) {
    console.error("Audio failed", e);
  }
};

// --- 3D VFX COMPONENTS ---

const LuxuryParticles = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.x += 0.0005;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFD700"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const NeuralEnergyLines = () => {
  const linesRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z += 0.002;
      linesRef.current.children.forEach((child: any, i) => {
        child.material.opacity = 0.1 + Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <ringGeometry args={[3 + i * 0.5, 3.01 + i * 0.5, 32]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
};

const ForgedLogo = ({ logoTexture, opacity }: { logoTexture: THREE.Texture, opacity: number }) => {
  return (
    <group>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial 
          color="#FFD700"
          metalness={1}
          roughness={0.1}
          transparent
          opacity={opacity * 0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial 
          map={logoTexture} 
          metalness={1} 
          roughness={0.05} 
          transparent
          opacity={opacity}
          emissive="#00f2ff"
          emissiveIntensity={opacity * 0.2}
        />
      </mesh>
      {/* Chrome Edge Detail */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[2, 2.02, 4]} />
        <meshStandardMaterial 
          color="#E5E4E2" 
          metalness={1} 
          roughness={0} 
          transparent 
          opacity={opacity * 0.5} 
        />
      </mesh>
    </group>
  );
};

const CinematicClothReveal = ({ phase, logoTexture }: { phase: number, logoTexture: THREE.Texture }) => {
  const clothRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (clothRef.current) {
      const t = state.clock.getElapsedTime();
      const material = clothRef.current.material as any;
      if (phase >= 1) {
        material.distort = THREE.MathUtils.lerp(material.distort, 0.1, 0.02);
        material.opacity = THREE.MathUtils.lerp(material.opacity, phase >= 2 ? 0 : 1, 0.03);
      }
    }
  });

  return (
    <group>
      {/* The Revealed Logo */}
      <ForgedLogo logoTexture={logoTexture} opacity={phase >= 2 ? 1 : 0} />
      
      {/* The Luxury Fabric Overlay */}
    <mesh ref={clothRef} position={[0, 0, 0.5]}>
        <planeGeometry args={[15, 15, 64, 64]} />
        <MeshDistortMaterial
          color="#030303"
          speed={2}
          distort={0.4}
          radius={1}
          metalness={1}
          roughness={0.02}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
};

const Scene = ({ phase, logoTexture }: { phase: number, logoTexture: THREE.Texture | null }) => {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    if (phase >= 4) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -5, 0.05);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 120, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  if (!logoTexture) return null;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      
      {/* Lighting Architecture */}
      <ambientLight intensity={0.05} />
      <spotLight position={[10, 10, 15]} angle={0.2} penumbra={1} intensity={10} color="#FFD700" />
      <pointLight position={[-10, -5, 5]} intensity={5} color="#00f2ff" />
      <pointLight position={[0, 5, 10]} intensity={2} color="#ffffff" />
      <rectAreaLight position={[0, 0, 10]} width={20} height={20} intensity={0.5} color="#5C2BE8" />

      <LuxuryParticles />
      
      <group scale={phase >= 4 ? 1 + (phase - 4) * 0.5 : 1}>
        <CinematicClothReveal phase={phase} logoTexture={logoTexture} />
      </group>

      {phase >= 3 && <NeuralEnergyLines />}
      
      <Environment preset="night" />
    </>
  );
};

// --- MAIN ENGINE ---

export const LuxeIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [phase, setPhase] = useState(0); // 0: Ambient, 1: Cloth Move, 2: Reveal, 3: Surge, 4: Fly-through
  const [isReady, setIsReady] = useState(false);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/logo.jpeg", (tex) => {
      setLogoTexture(tex);
      setIsReady(true);
      
      // Orchestrate the Marvel-level Sequence
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 500);
        }
      });

      tl.to({}, { duration: 1, onStart: () => { setPhase(0); playCinematicSequence(); } })
        .to({}, { duration: 1, onStart: () => setPhase(1) })
        .to({}, { duration: 1, onStart: () => { setPhase(2); setShowUI(true); } })
        .to({}, { duration: 1, onStart: () => setPhase(3) })
        .to({}, { duration: 1, onStart: () => setPhase(4) });
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 2, filter: "blur(100px)" }}
      transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020205] overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0">
        <Canvas 
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
        >
          <Scene phase={phase} logoTexture={logoTexture} />
        </Canvas>
      </div>

      {/* VFX OVERLAYS */}
      <AnimatePresence>
        {showUI && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mt-[30vh]"
            >
              <h1 className="text-8xl md:text-[12rem] font-display font-black text-white/95 uppercase tracking-[1.5em] ml-[1.5em] mix-blend-difference">
                LUXE
              </h1>
              <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary" />
                <span className="text-[10px] font-tech tracking-[1em] uppercase text-primary">Neural Identity Authenticated</span>
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CINEMATIC HUD ACCENTS */}
      <div className="absolute inset-12 border border-white/5 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />
        
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />
          ))}
        </div>
      </div>

      {/* GRAIN & VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </motion.div>
  );
};
