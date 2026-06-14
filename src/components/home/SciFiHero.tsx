"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Cpu, Terminal, Sliders, X, Volume2, VolumeX } from "lucide-react";

// Preload the male mannequin model for instant switching
useGLTF.preload("/models/male_model.glb");

// ── SUBCOMPONENT: FLOWING SILK BACKDROP ──
function SilkBackdrop({ color, speed }: { color: THREE.Color; speed: number }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    const geom = geomRef.current;
    if (!geom) return;

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Organic sine/cosine wave deformation for flowing silk
      const z =
        Math.sin(x * 0.45 + time * speed * 0.9) * 0.28 +
        Math.cos(y * 0.35 + time * speed * 0.75) * 0.22 +
        Math.sin((x + y) * 0.3 + time * speed * 1.1) * 0.14;

      pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh position={[0, 0.3, -2.6]} receiveShadow>
      <planeGeometry ref={geomRef} args={[12, 8, 24, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.24}
        metalness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: DRAPED COTTON SILHOUETTE ──
function DrapedCotton({ color, speed }: { color: THREE.Color; speed: number }) {
  const geomRef = useRef<THREE.CylinderGeometry>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const geom = geomRef.current;
    const mesh = meshRef.current;
    if (!geom || !mesh) return;

    mesh.rotation.y = state.clock.getElapsedTime() * 0.12 * speed;

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Create vertical draped dress-folds using angular mathematics
      const angle = Math.atan2(pos.getZ(i), x);
      const ripple =
        Math.sin(angle * 7 + y * 1.2 + time * speed * 1.3) * 0.07 +
        Math.cos(y * 2.2 + time * speed * 0.8) * 0.05;

      const r = 1.05 + ripple - y * 0.12; // Taper at the top
      pos.setX(i, Math.cos(angle) * r);
      pos.setZ(i, Math.sin(angle) * r);
    }

    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} position={[0, -0.6, 0]} castShadow receiveShadow>
      <cylinderGeometry ref={geomRef} args={[0.7, 1.1, 2.0, 32, 16, true]} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: FLOWING LINEN SPHERE ──
function LinenSphere({ color, speed }: { color: THREE.Color; speed: number }) {
  const geomRef = useRef<THREE.SphereGeometry>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const geom = geomRef.current;
    const mesh = meshRef.current;
    if (!geom || !mesh) return;

    mesh.rotation.y = state.clock.getElapsedTime() * 0.15 * speed;
    mesh.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.08;

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      // Organic linen expansion/deflation waves
      const wave =
        Math.sin(x * 1.3 + time * speed * 1.1) * 0.07 +
        Math.cos(y * 1.3 + time * speed * 0.95) * 0.07 +
        Math.sin(z * 1.3 + time * speed * 1.25) * 0.05;

      pos.setX(i, nx * (1.25 + wave));
      pos.setY(i, ny * (1.25 + wave));
      pos.setZ(i, nz * (1.25 + wave));
    }

    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry ref={geomRef} args={[1.2, 24, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.78}
        metalness={0.03}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: MARBLE pedestal ──
function Pedestal() {
  return (
    <mesh position={[0, -2.1, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[1.8, 1.9, 0.35, 32]} />
      <meshStandardMaterial
        color="#15151A"
        roughness={0.42}
        metalness={0.68}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: CLOTHED MANNEQUIN ──
function Mannequin({ speed }: { speed: number }) {
  const { scene } = useGLTF("/models/male_model.glb");
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.58;
          mat.metalness = 0.08;
          mat.side = THREE.DoubleSide;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18 * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2.2} position={[0.2, -2.1, 0.3]} />
    </group>
  );
}

// ── MAIN EXPORT COMPONENT ──
export default function SciFiHero() {
  // Config states
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [activeColor, setActiveColor] = useState<string>("cyan"); // "cyan" | "gold" | "burgundy"
  const [activeGeometry, setActiveGeometry] = useState<string>("tesseract"); // "tesseract" | "spherical" | "hyperbolic"
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [logMessages, setLogMessages] = useState<string[]>([
    "INITIALIZING VALCERON DESIGN DECK...",
    "CALIBRATING WEAVE COMPOSITION: OPTIMAL",
    "HYDERABAD HUB SYNCED // DIRECT SHIFT",
    "DESIGN NEXUS PROTOCOL-L227 ACTIVE.",
  ]);

  // Animation reveal sync
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("luxe_intro_played");
    }
    return false;
  });

  useEffect(() => {
    // Reveal HUD shortly after mount
    const timer = setTimeout(() => {
      setIntroComplete(true);
      sessionStorage.setItem("luxe_intro_played", "true");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 3)]);
  };

  // Speed Slider Handler
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spd = parseFloat(e.target.value);
    setCurrentSpeed(spd);
    addLog(`WEAVE FLOW ROTATION MODIFIED: ${spd.toFixed(1)}x`);
  };

  // Mute Handler
  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    addLog(nextMute ? "AUDIO OUTPUT DEACTIVATED" : "AUDIO OUTPUT ACTIVATED // 440Hz SYNTH");
  };

  // Color selection triggers
  const selectColorProtocol = (mode: string) => {
    setActiveColor(mode);
    addLog(`PALETTE SELECTOR CONFIGURED: ${mode.toUpperCase()} EMBERS`);
  };

  // Geometry Silhouette synthesis
  const synthesizeGeometry = (geom: string) => {
    setActiveGeometry(geom);

    let label = "Tailored Mannequin";
    if (geom === "spherical") label = "Flowing Linen Orb";
    if (geom === "hyperbolic") label = "Draped Cotton Silhouette";
    addLog(`GARMENT SILHOUETTE PROFILE SYNTHESIZED -> ${label.toUpperCase()}`);

    // Synthesize audio feedback if unmuted
    if (!isMuted && typeof window !== "undefined" && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (err) {}
    }
  };

  const scrollToHero = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
      behavior: "smooth",
    });
  };

  // Map state strings to Three colors
  const COLORS = {
    cyan: {
      backdrop: new THREE.Color("#05222a"),
      lights: new THREE.Color("#00f2ff"),
    },
    gold: {
      backdrop: new THREE.Color("#30240d"),
      lights: new THREE.Color("#c9a84c"),
    },
    burgundy: {
      backdrop: new THREE.Color("#2d0614"),
      lights: new THREE.Color("#6b1e3c"),
    },
  };

  const currentColors = COLORS[activeColor as keyof typeof COLORS] || COLORS.cyan;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030305] z-30 select-none">
      {/* ── React Three Fiber Canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        className="absolute inset-0 w-full h-full z-0 block bg-[#030305]"
      >
        <color attach="background" args={["#030305"]} />
        
        {/* Soft, luxury ambient lighting */}
        <ambientLight intensity={0.7} />
        
        {/* Crisp studio key light & fill light */}
        <directionalLight
          position={[0, 4, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[0, 2, -5]} intensity={0.35} />

        {/* Dynamic colored point lights (act as futuristic rim reflections on the fabrics) */}
        <pointLight position={[-3, 2, 2]} intensity={2.2} color={currentColors.lights} />
        <pointLight position={[3, -2, 2]} intensity={1.6} color={currentColors.lights} />

        {/* Studio environment maps for realistic metallic/gloss reflections */}
        <Environment preset="studio" />

        <group position={[0, 0.2, 0]}>
          {/* Silk Cloth Backdrop waves continuously */}
          <SilkBackdrop color={currentColors.backdrop} speed={currentSpeed} />

          {/* Render active silhouette shape */}
          {activeGeometry === "tesseract" && (
            <>
              <Pedestal />
              <Mannequin speed={currentSpeed} />
            </>
          )}

          {activeGeometry === "spherical" && (
            <LinenSphere color={currentColors.backdrop} speed={currentSpeed} />
          )}

          {activeGeometry === "hyperbolic" && (
            <DrapedCotton color={currentColors.backdrop} speed={currentSpeed} />
          )}

          {/* Smooth contact shadows underneath the pedestal */}
          <ContactShadows
            position={[0, -2.09, 0]}
            opacity={0.65}
            scale={6}
            blur={2.2}
            far={2}
          />
        </group>

        {/* Orbit control allowing drag-to-rotate with auto-rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.3 * currentSpeed}
        />
      </Canvas>

      {/* Elegant overlay textures (Luxury, subtle noise overlay) */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-[0.012] z-10" />

      {/* Floating Holographic Interface Panels (HUD) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8 pointer-events-none mt-[80px]">
        
        {/* Top telemetry and status stats row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
          {/* Left Panel: Telemetry HUD */}
          <div
            className={`glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(201,168,76,0.04)] flex flex-col gap-3 max-w-[252px] w-full transition-all duration-[800ms] ease-in-out pointer-events-none ${
              introComplete
                ? "opacity-70 hover:opacity-100 hover:pointer-events-auto hover:duration-300"
                : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/10">
              <Cpu size={14} className="text-[#c9a84c] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">LUXE OS // BRAND HUB</span>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[8.5px] text-white/90 tracking-wider">
              <div className="flex justify-between">
                <span>WEAVE INTEGRITY:</span>
                <span className="text-[#c9a84c] font-bold animate-pulse">OPTIMAL // 100%</span>
              </div>
              <div className="flex justify-between">
                <span>FABRIC CORE TEMP:</span>
                <span className="text-[#c9a84c] font-bold">BREATHABLE // 28°C</span>
              </div>
              <div className="flex justify-between">
                <span>THREAD COUNT:</span>
                <span className="text-[#c9a84c] font-bold">800 TC // LUXE</span>
              </div>
              <div className="flex justify-between">
                <span>TRUST INDEX:</span>
                <span className="text-[#c9a84c] font-bold">100% SECURE</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Calibration logs */}
          <div
            className={`glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(201,168,76,0.04)] flex flex-col gap-3 max-w-[252px] w-full transition-all duration-[800ms] ease-in-out pointer-events-none ${
              introComplete
                ? "opacity-70 hover:opacity-100 hover:pointer-events-auto hover:duration-300"
                : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Terminal size={14} className="text-[#c9a84c]" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">BOUTIQUE LOG</span>
              </div>
              <button
                onClick={handleMuteToggle}
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 focus:outline-none flex items-center justify-center pointer-events-auto"
                title="Toggle Sound"
              >
                {isMuted ? (
                  <VolumeX size={12} className="text-white/40" />
                ) : (
                  <Volume2 size={12} className="text-[#c9a84c] animate-pulse" />
                )}
              </button>
            </div>
            <div className="flex flex-col gap-1 font-mono text-[8px] text-[#c9a84c] tracking-wide text-left h-[50px] overflow-hidden leading-relaxed">
              {logMessages.map((log, index) => (
                <div key={index} className="truncate">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Interactive Core Controls Panel */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none select-none max-w-[320px] md:max-w-md w-full">
          {controlsOpen ? (
            <div className="relative pointer-events-auto flex flex-col gap-6 w-full p-6 bg-[#050508]/85 border border-white/5 backdrop-blur-md rounded-[32px] shadow-2xl transition-all duration-300 transform scale-100 opacity-100">
              {/* Glass panel border brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#c9a84c]/40" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#c9a84c]/40" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#c9a84c]/40" />

              {/* Header Row with Title and CLOSE button */}
              <div className="flex justify-between items-center w-full pb-4 border-b border-white/10 relative">
                <div className="text-left">
                  <span className="text-[8px] font-mono tracking-[0.45em] text-white/70 uppercase block mb-0.5">STYLE DECK</span>
                  <h2 className="font-cormorant text-lg text-white uppercase tracking-wider font-bold">
                    THE FABRIC NEXUS
                  </h2>
                </div>
                <button
                  onClick={() => setControlsOpen(false)}
                  className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c9a84c]/60 bg-[#050508]/90 text-[#c9a84c] text-[9px] font-mono uppercase tracking-wider hover:bg-[#c9a84c] hover:text-[#050508] hover:shadow-[0_0_15px_#c9a84c] transition-all duration-200 cursor-pointer"
                  title="Close Control Deck"
                >
                  <X size={12} />
                  <span>CLOSE</span>
                </button>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[9px] text-white/90 tracking-wider">
                  <span>GARMENT ROTATION SPEED</span>
                  <span className="text-[#c9a84c] font-bold">{currentSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={currentSpeed}
                  onChange={handleSpeedChange}
                  className="w-full luxe-slider cursor-pointer focus:outline-none"
                />
              </div>

              {/* Color protocols triggers */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">FABRIC COLORWAY PALETTE</span>
                <div className="flex gap-2">
                  {[
                    { id: "cyan", label: "ONYX_NEON" },
                    { id: "gold", label: "CHAMPAGNE_GOLD" },
                    { id: "burgundy", label: "ROYAL_BURGUNDY" },
                  ].map((proto) => (
                    <button
                      key={proto.id}
                      onClick={() => selectColorProtocol(proto.id)}
                      className={`flex-1 py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider transition-all duration-200 ease-in-out cursor-pointer ${
                        activeColor === proto.id
                          ? "bg-[rgba(201,168,76,0.1)] border border-[#c9a84c] text-[#c9a84c] font-bold shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                          : "border border-[rgba(201,168,76,0.25)] bg-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {proto.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Geometry compiler */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">GARMENT SILHOUETTE PROFILE</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tesseract", label: "Tailored Mannequin" },
                    { id: "spherical", label: "Flowing Linen Orb" },
                    { id: "hyperbolic", label: "Draped Silhouette" },
                  ].map((geom) => (
                    <button
                      key={geom.id}
                      onClick={() => synthesizeGeometry(geom.id)}
                      className={`py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider transition-all duration-200 ease-in-out cursor-pointer ${
                        activeGeometry === geom.id
                          ? "bg-[rgba(201,168,76,0.1)] border border-[#c9a84c] text-[#c9a84c] font-bold shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                          : "border border-[rgba(201,168,76,0.25)] bg-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {geom.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <button
              onClick={() => setControlsOpen(true)}
              className="pointer-events-auto px-6 py-3 rounded-full border border-[#c9a84c]/60 bg-[#050508]/90 text-[#c9a84c] font-mono text-[10px] tracking-[0.25em] uppercase hover:border-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#050508] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-2xl"
            >
              <Sliders size={14} className="text-[#c9a84c] animate-pulse" />
              Open Control Deck
            </button>
          )}
        </div>

        {/* Scroll helper overlays */}
        <div className="flex justify-between items-end w-full relative z-20">
          <div className="font-mono text-[9px] text-white/60 uppercase tracking-[0.3em] pointer-events-auto">
            DELIVERY COORD: <span className="text-[#c9a84c]">HYDERABAD // IN</span>
          </div>

          {/* Interactive descend CTA */}
          <button
            onClick={scrollToHero}
            className={`flex flex-col items-center gap-2 text-center cursor-pointer group bg-transparent border-none outline-none transition-all duration-[1200ms] ease-in-out ${
              introComplete ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="text-[9px] font-mono text-white/60 tracking-[0.45em] uppercase group-hover:text-white group-hover:tracking-[0.55em] transition-all">
              Initialize Wardrobe
            </span>
          </button>

          <div className="font-mono text-[9px] text-white/60 uppercase tracking-[0.3em] pointer-events-auto">
            FIT MATRIX: <span className="text-[#c9a84c]">STABLE</span>
          </div>
        </div>

      </div>

      {/* Bottom status bar gradient background */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
