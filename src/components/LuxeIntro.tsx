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

 // --- 3D VFX COMPONENTS ---
 
 const LuxuryParticles = () => {
   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
   const count = isMobile ? 1000 : 3000;
   
   const points = useMemo(() => {
     const p = new Float32Array(count * 3);
     for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 40;
       p[i * 3 + 1] = (Math.random() - 0.5) * 40;
       p[i * 3 + 2] = (Math.random() - 0.5) * 40;
     }
     return p;
   }, [count]);
 
   const ref = useRef<THREE.Points>(null);
   useFrame((state) => {
     if (ref.current) {
       ref.current.rotation.y += 0.0005;
       ref.current.rotation.x += 0.0002;
     }
   });
 
   return (
     <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
       <PointMaterial
         transparent
         color="#00f2ff"
         size={0.015}
         sizeAttenuation={true}
         depthWrite={false}
         opacity={0.2}
         blending={THREE.AdditiveBlending}
       />
     </Points>
   );
 };
 
 const HolographicGrid = ({ opacity }: { opacity: number }) => {
   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
   const ringCount = isMobile ? 4 : 6;
 
   return (
     <group position={[0, 0, -2]}>
       {[...Array(ringCount)].map((_, i) => (
         <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -i * 2.5]}>
           <ringGeometry args={[i * 2.5, i * 2.5 + 0.01, 48]} />
           <meshBasicMaterial color="#00f2ff" transparent opacity={opacity * 0.08} />
         </mesh>
       ))}
     </group>
   );
 };
 
 const ForgedLogo = ({ logoTexture, opacity, pulse }: { logoTexture: THREE.Texture, opacity: number, pulse: number }) => {
   const logoRef = useRef<THREE.Group>(null);
   
   useFrame((state) => {
     if (logoRef.current && opacity > 0.1) {
       const time = state.clock.getElapsedTime();
       logoRef.current.rotation.y = Math.sin(time * 0.4) * 0.08;
       logoRef.current.rotation.x = Math.cos(time * 0.2) * 0.04;
       logoRef.current.position.y = Math.sin(time * 1.2) * 0.03;
     }
   });
 
   return (
     <group ref={logoRef}>
       {/* Background Glow */}
       <mesh position={[0, 0, -0.2]}>
         <planeGeometry args={[6, 6]} />
         <meshBasicMaterial 
           color="#00E5CC" 
           transparent 
           opacity={opacity * 0.05 * pulse} 
           blending={THREE.AdditiveBlending}
         />
       </mesh>
 
       {/* Forged Metal Plate */}
       <mesh position={[0, 0, -0.1]}>
         <planeGeometry args={[4.2, 4.2]} />
         <meshStandardMaterial 
           color="#050505"
           metalness={1}
           roughness={0.1}
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
           roughness={0.2} 
           transparent
           opacity={opacity}
           emissive="#ffffff"
           emissiveIntensity={pulse * 0.1}
         />
       </mesh>
 
       {/* Pulsing AI Ring */}
       <mesh position={[0, 0, 0.05]}>
         <ringGeometry args={[2.05, 2.08 + pulse * 0.03, 64]} />
         <meshBasicMaterial color="#00f2ff" transparent opacity={opacity * 0.3} />
       </mesh>
       
       {/* Scanning Beam */}
       <ScanningBeam pulse={pulse} opacity={opacity} />
     </group>
   );
 };
 
 const ScanningBeam = ({ pulse, opacity }: { pulse: number, opacity: number }) => {
   const meshRef = useRef<THREE.Mesh>(null);
 
   useFrame((state) => {
     const time = state.clock.getElapsedTime();
     if (meshRef.current) {
       meshRef.current.position.y = 2 - ((time * 0.8) % 4);
     }
   });
 
   return (
     <mesh ref={meshRef} position={[0, 0, 0.06]}>
       <planeGeometry args={[4, 0.02]} />
       <meshBasicMaterial 
         color="#00f2ff" 
         transparent 
         opacity={opacity * 0.4} 
         blending={THREE.AdditiveBlending}
       />
     </mesh>
   );
 };
 
 const HolographicSilhouette = ({ texture }: { texture: THREE.Texture }) => {
   const ref = useRef<THREE.Mesh>(null);
   useFrame((state) => {
     if (ref.current) {
       ref.current.position.y += Math.sin(state.clock.getElapsedTime() * 1.5) * 0.003;
       (ref.current.material as any).opacity = 0.15 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
     }
   });
 
   return (
     <mesh ref={ref} position={[3.5, 0, -4]}>
       <planeGeometry args={[3.5, 5.5]} />
       <meshBasicMaterial 
         map={texture} 
         transparent 
         opacity={0.2} 
         blending={THREE.AdditiveBlending}
         depthWrite={false}
       />
     </mesh>
   );
 };
 
 const CinematicClothReveal = ({ phase, logoTexture, pulse }: { phase: number, logoTexture: THREE.Texture, pulse: number }) => {
   const clothRef = useRef<THREE.Mesh>(null);
   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
   
   useFrame((state) => {
     if (clothRef.current) {
       const material = clothRef.current.material as any;
       if (phase >= 2) {
         material.distort = THREE.MathUtils.lerp(material.distort, isMobile ? 0.02 : 0.05, 0.02);
         material.opacity = THREE.MathUtils.lerp(material.opacity, phase >= 3 ? 0 : 1, 0.04);
       }
     }
   });
 
   return (
     <group>
       {/* The Revealed Logo - Slightly offset up to avoid text overlap */}
       <group position={[0, 1.2, 0]}>
         <ForgedLogo logoTexture={logoTexture} opacity={phase >= 3 ? 1 : 0} pulse={pulse} />
       </group>
       
       {/* The Luxury Fabric Overlay */}
       <mesh ref={clothRef} position={[0, 0, 1]}>
         <planeGeometry args={[isMobile ? 15 : 25, isMobile ? 15 : 25, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
         <MeshDistortMaterial
           color="#020202"
           speed={isMobile ? 1.5 : 2.5}
           distort={0.35}
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

const SystemBootHUD = ({ phase }: { phase: number }) => {
  const lines = [
    "INITIALIZING NEURAL LINK...",
    "ACCESSING LUXE CORE...",
    "CALIBRATING HOLOGRAPHIC ARRAY...",
    "SYNTHESIZING FABRIC MESH...",
    "SYSTEM READY."
  ];

  return (
    <div className="absolute top-12 left-12 font-tech text-[10px] text-primary/40 space-y-1">
      {lines.slice(0, phase).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="w-1 h-1 bg-primary/40" />
          {line}
        </motion.div>
      ))}
    </div>
  );
};

const InterfaceFragments = () => {
  const fragments = useMemo(() => {
    return [...Array(15)].map(() => ({
      position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 20],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.1 + Math.random() * 0.5
    }));
  }, []);

  return (
    <group>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position as any} rotation={frag.rotation as any} scale={frag.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const GlitchEffect = ({ phase }: { phase: number }) => {
  if (phase !== 4) return null;
  return (
    <motion.div 
      animate={{ opacity: [0, 0.2, 0, 0.3, 0] }}
      transition={{ duration: 0.2, repeat: Infinity }}
      className="absolute inset-0 z-50 pointer-events-none bg-primary/10 mix-blend-screen"
    />
  );
};

 const Scene = ({ phase, logoTexture, silhouetteTexture, pulse }: { 
  phase: number, 
  logoTexture: THREE.Texture | null, 
  silhouetteTexture: THREE.Texture | null,
  pulse: number
}) => {
  const { camera } = useThree();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
 
  useFrame(() => {
    if (phase === 5) {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.position.z = THREE.MathUtils.lerp(pCam.position.z, -12, 0.03);
      pCam.fov = THREE.MathUtils.lerp(pCam.fov, isMobile ? 120 : 150, 0.03);
      pCam.updateProjectionMatrix();
    }
  });
 
  if (!logoTexture) return null;
 
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={isMobile ? 45 : 35} />
      
      {/* Optimized Lighting Suite */}
      <ambientLight intensity={0.1} />
      <spotLight position={[5, 10, 10]} angle={0.15} penumbra={1} intensity={15} color="#00f2ff" />
      <pointLight position={[-10, 0, 5]} intensity={8} color="#ffffff" />
 
      <LuxuryParticles />
      <HolographicGrid opacity={phase >= 2 ? 1 : 0} />
      
      <group scale={phase === 5 ? 1 + (10 - camera.position.z) * 0.15 : 1}>
        <CinematicClothReveal phase={phase} logoTexture={logoTexture} pulse={pulse} />
      </group>
 
      {phase >= 3 && !isMobile && <InterfaceFragments />}
      {phase >= 4 && silhouetteTexture && <HolographicSilhouette texture={silhouetteTexture} />}
      
      <Environment preset="city" />
    </>
  );
};
 
// --- MAIN ENGINE ---
 
export const LuxeIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [silhouetteTexture, setSilhouetteTexture] = useState<THREE.Texture | null>(null);
  const [phase, setPhase] = useState(0); 
  const [pulse, setPulse] = useState(0);
  const [showText, setShowText] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
 
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Attempt parallel load with fallback
    const loadAssets = async () => {
      try {
        const [logo, silhouette] = await Promise.all([
          new Promise<THREE.Texture>((res) => loader.load("/logo.jpeg", res)),
          new Promise<THREE.Texture>((res) => loader.load("/silhouette.png", res, undefined, () => {
            // Fallback for missing silhouette
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 2;
            res(new THREE.CanvasTexture(canvas));
          }))
        ]);
        setLogoTexture(logo);
        setSilhouetteTexture(silhouette);
        
        // PRECISE CINEMATIC TIMELINE
        const tl = gsap.timeline({
          delay: 0.5,
          onComplete: () => {
            gsap.to(".intro-overlay", {
              opacity: 0,
              duration: 1,
              ease: "power4.inOut",
              onComplete: onComplete
            });
          }
        });
 
        tl.to({}, { duration: 1.2, onStart: () => setPhase(1) })
          .to({}, { duration: 1.0, onStart: () => setPhase(2) })
          .to({}, { duration: 1.5, onStart: () => { setPhase(3); setShowText(true); } })
          .to({}, { duration: 1.0, onStart: () => setPhase(4) })
          .to({}, { duration: 1.0, onStart: () => setPhase(5) });
 
        // Pulsing Logic
        gsap.to({ v: 0 }, {
          v: 1,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          onUpdate: function() { setPulse(this.targets()[0].v); }
        });
 
      } catch (err) {
        console.warn("Intro assets failed to load, skipping to main app", err);
        onComplete();
      }
    };
 
    loadAssets();
  }, [onComplete]);
 
  // Handle sound on first interaction or phase change
  useEffect(() => {
    if (phase === 1 && !audioStarted) {
      playCinematicSequence();
      setAudioStarted(true);
    }
  }, [phase, audioStarted]);
 
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="intro-overlay fixed inset-0 z-[9999] bg-[#020205] overflow-hidden flex items-center justify-center"
      onClick={() => {
        if (!audioStarted) {
          playCinematicSequence();
          setAudioStarted(true);
        }
      }}
    >
      <div className="absolute inset-0">
        <Canvas 
          dpr={[1, 1.2]} 
          gl={{ antialias: false, alpha: true, stencil: false, depth: true }}
          performance={{ min: 0.5 }}
        >
          <Scene phase={phase} logoTexture={logoTexture} silhouetteTexture={silhouetteTexture} pulse={pulse} />
        </Canvas>
      </div>

       <GlitchEffect phase={phase} />
      <SystemBootHUD phase={phase} />

      {/* TEXT LAYER */}
      <AnimatePresence>
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-[30vh] flex flex-col items-center"
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
                    className="text-7xl md:text-[13rem] font-display font-black text-white uppercase mix-blend-difference leading-none tracking-tighter"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 0.6, letterSpacing: "1.5em" }}
                transition={{ delay: 1, duration: 2 }}
                className="text-[9px] md:text-xs font-tech uppercase text-[#00f2ff] mt-8 pl-[1.5em] flex items-center gap-4"
              >
                <div className="w-8 h-[1px] bg-[#00f2ff]/30" />
                NEURAL SYNTHESIS // ACTIVE
                <div className="w-8 h-[1px] bg-[#00f2ff]/30" />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HUD OVERLAYS */}
      <div className="absolute inset-8 pointer-events-none opacity-40">
        {/* Advanced Top HUD */}
        <div className="absolute top-0 right-0 text-[8px] font-tech text-primary uppercase tracking-widest text-right space-y-1">
          <div><span className="text-white/40">Status:</span> Active</div>
          <div><span className="text-white/40">Link:</span> Secure_Node</div>
          <div><span className="text-white/40">Auth:</span> LUXE_SYS</div>
        </div>
        
        {/* Advanced Corners */}
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-primary/40" />
      </div>

      {/* CINEMATIC POST-PROCESSING */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none film-grain" />
    </motion.div>
  );
};
