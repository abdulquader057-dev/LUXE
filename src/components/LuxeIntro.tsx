"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  MeshDistortMaterial, 
  Points, 
  PointMaterial,
  useTexture
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// --- SOUND SYSTEM (Ultra-Pro Max Cinematic) ---
const playCinematicSequence = () => {
  if (typeof window === "undefined") return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.connect(ctx.destination);

    const playBassImpact = (time: number, freq: number, volume: number, decay: number = 4) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + decay);
      g.gain.setValueAtTime(volume, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + decay);
      osc.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + decay);
    };

    const playEnergySurge = (time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      filter.type = "highpass";
      filter.frequency.setValueAtTime(100, time);
      filter.frequency.exponentialRampToValueAtTime(5000, time + 1.5);
      g.gain.setValueAtTime(0.08, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 1.5);
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      osc.start(time);
      osc.stop(time + 1.5);
    };

    // Sequence (5s Total)
    playBassImpact(ctx.currentTime, 50, 0.8, 2); // 0s Start
    playEnergySurge(ctx.currentTime + 1); // 1s Wake
    playBassImpact(ctx.currentTime + 2.5, 40, 1.0, 3); // 2.5s Reveal Impact
    playEnergySurge(ctx.currentTime + 4); // 4s Fly-through Surge
  } catch (e) {
    console.error("Audio failed", e);
  }
};

// --- 3D VFX COMPONENTS ---

const LuxuryParticles = () => {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
      ref.current.rotation.x += 0.0004;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFD700"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const HolographicSilhouette = ({ texture }: { texture: THREE.Texture }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.005;
      (ref.current.material as any).opacity = 0.2 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={[3, 0, -5]}>
      <planeGeometry args={[4, 6]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.3} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const InterfaceFragments = () => {
  const fragments = useMemo(() => {
    return [...Array(10)].map(() => ({
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.1 + Math.random() * 0.4
    }));
  }, []);

  return (
    <group>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position as any} rotation={frag.rotation as any} scale={frag.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const ForgedLogo = ({ logoTexture, opacity, pulse }: { logoTexture: THREE.Texture, opacity: number, pulse: number }) => {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current && opacity > 0.5) {
      const time = state.clock.getElapsedTime();
      logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      logoRef.current.rotation.x = Math.cos(time * 0.3) * 0.05;
      logoRef.current.position.y = Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group ref={logoRef}>
      {/* Forged Metal Plate */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshStandardMaterial 
          color="#050505"
          metalness={1}
          roughness={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Brand Logo Content */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial 
          map={logoTexture} 
          metalness={1} 
          roughness={0.1} 
          transparent
          opacity={opacity}
          emissive="#FFD700"
          emissiveIntensity={pulse * 0.3}
        />
      </mesh>

      {/* Pulsing AI Ring */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[2.1, 2.15 + pulse * 0.05, 64]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={opacity * 0.4} />
      </mesh>
      
      {/* Golden Highlight Sweep */}
      <HighlightSweep pulse={pulse} />
    </group>
  );
};

const HighlightSweep = ({ pulse }: { pulse: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = -3 + (time % 2) * 3;
    }
    if (meshRef2.current) {
      meshRef2.current.position.x = -2 + ((time + 0.5) % 2.5) * 2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.05, 10]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={pulse * 0.8} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={meshRef2} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.02, 10]} />
        <meshBasicMaterial 
          color="#00f2ff" 
          transparent 
          opacity={pulse * 0.4} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

const CinematicClothReveal = ({ phase, logoTexture, pulse }: { phase: number, logoTexture: THREE.Texture, pulse: number }) => {
  const clothRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (clothRef.current) {
      const material = clothRef.current.material as any;
      if (phase >= 2) {
        material.distort = THREE.MathUtils.lerp(material.distort, 0.05, 0.03);
        material.opacity = THREE.MathUtils.lerp(material.opacity, phase >= 3 ? 0 : 1, 0.05);
      }
    }
  });

  return (
    <group>
      {/* The Revealed Logo - Slightly offset up to avoid text overlap */}
      <group position={[0, 1.5, 0]}>
        <ForgedLogo logoTexture={logoTexture} opacity={phase >= 3 ? 1 : 0} pulse={pulse} />
      </group>
      
      {/* The Luxury Fabric Overlay */}
      <mesh ref={clothRef} position={[0, 0, 0.8]}>
        <planeGeometry args={[20, 20, 64, 64]} />
        <MeshDistortMaterial
          color="#020202"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={1}
          roughness={0.01}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
};

const Scene = ({ phase, logoTexture, silhouetteTexture, pulse }: { 
  phase: number, 
  logoTexture: THREE.Texture | null, 
  silhouetteTexture: THREE.Texture | null,
  pulse: number
}) => {
  const { camera } = useThree();

  useFrame(() => {
    if (phase === 5) {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.position.z = THREE.MathUtils.lerp(pCam.position.z, -10, 0.04);
      pCam.fov = THREE.MathUtils.lerp(pCam.fov, 140, 0.04);
      pCam.updateProjectionMatrix();
    }
  });

  if (!logoTexture) return null;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
      
      {/* Lighting Suite */}
      <ambientLight intensity={0.02} />
      <spotLight position={[5, 10, 10]} angle={0.15} penumbra={1} intensity={15} color="#FFD700" />
      <pointLight position={[-10, 0, 5]} intensity={8} color="#00f2ff" />
      <rectAreaLight position={[0, 0, 5]} width={10} height={10} intensity={2} color="#020205" />

      <LuxuryParticles />
      
      <group scale={phase === 5 ? 1 + (10 - camera.position.z) * 0.2 : 1}>
        <CinematicClothReveal phase={phase} logoTexture={logoTexture} pulse={pulse} />
      </group>

      {phase >= 4 && <InterfaceFragments />}
      {phase >= 4 && silhouetteTexture && <HolographicSilhouette texture={silhouetteTexture} />}
      
      <Environment preset="night" />
    </>
  );
};

// --- MAIN ENGINE ---

export const LuxeIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [silhouetteTexture, setSilhouetteTexture] = useState<THREE.Texture | null>(null);
  const [phase, setPhase] = useState(0); // 0-5
  const [pulse, setPulse] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Parallel Load
    Promise.all([
      new Promise<THREE.Texture>((res) => loader.load("/logo.jpeg", res)),
      new Promise<THREE.Texture>((res) => loader.load("/silhouette.png", res))
    ]).then(([logo, silhouette]) => {
      setLogoTexture(logo);
      setSilhouetteTexture(silhouette);
      setIsReady(true);
      
      // PRECISE 5s TIMELINE
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 200);
        }
      });

      // 0-1s: Awakening
      tl.to({}, { duration: 1, onStart: () => { setPhase(1); playCinematicSequence(); } })
        // 1-2s: Waves
        .to({}, { duration: 1, onStart: () => setPhase(2) })
        // 2-3s: Fabric Reveal
        .to({}, { duration: 1, onStart: () => { setPhase(3); setShowText(true); } })
        // 3-4s: Energy Surge
        .to({}, { duration: 1, onStart: () => setPhase(4) })
        // 4-5s: Fly-through
        .to({}, { duration: 1, onStart: () => setPhase(5) });

      // Pulsing Logic
      gsap.to({ v: 0 }, {
        v: 1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        onUpdate: function() { setPulse(this.targets()[0].v); }
      });
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(50px)" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#020205] overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <Scene phase={phase} logoTexture={logoTexture} silhouetteTexture={silhouetteTexture} pulse={pulse} />
        </Canvas>
      </div>

      {/* TEXT LAYER */}
      <AnimatePresence>
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-[45vh] flex flex-col items-center"
            >
              <div className="flex gap-4 md:gap-8 overflow-hidden">
                {"LUXE".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 200, rotate: 20, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.1, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="text-7xl md:text-[13rem] font-display font-black text-white uppercase mix-blend-difference leading-none"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 0.6, letterSpacing: "1.5em" }}
                transition={{ delay: 1, duration: 2 }}
                className="text-[9px] md:text-xs font-tech uppercase text-primary mt-12 pl-[1.5em] flex items-center gap-4"
              >
                <div className="w-8 h-[1px] bg-primary/30" />
                Neural Synthesis Active
                <div className="w-8 h-[1px] bg-primary/30" />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HUD OVERLAYS */}
      <div className="absolute inset-12 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-12 h-[1px] bg-primary" />
        <div className="absolute top-0 left-0 w-[1px] h-12 bg-primary" />
        <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-primary" />
        <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-primary" />
      </div>

      {/* CINEMATIC POST-PROCESSING */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </motion.div>
  );
};
