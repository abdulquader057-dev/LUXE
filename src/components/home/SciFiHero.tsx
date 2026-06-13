"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cpu, Terminal, Compass, Zap, Shield, HelpCircle, Layers, ArrowDown, Volume2, VolumeX } from "lucide-react";

export default function SciFiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setGeometryRef = useRef<((shape: string) => void) | null>(null);
  
  // Interactive state refs to share with the Three.js animation loop without re-triggering useEffect
  const speedRef = useRef<number>(1.0);
  const colorModeRef = useRef<string>("cyan"); // "cyan" | "gold" | "burgundy"
  const geometryTypeRef = useRef<string>("tesseract"); // "tesseract" | "spherical" | "hyperbolic"
  const explosionTriggerRef = useRef<number>(0); // Timestamp of last explosion

  // React states for HUD metrics displays
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [activeColor, setActiveColor] = useState<string>("cyan");
  const [activeGeometry, setActiveGeometry] = useState<string>("tesseract");
  const [logMessages, setLogMessages] = useState<string[]>([
    "INITIALIZING WEARABLE TAILOR ENGINE...",
    "CALIBRATING THREAD DENSITY: OPTIMAL",
    "HYDERABAD HUB SYNCED // DIRECT SHIFT",
    "DESIGN MATRIX PROTOCOL-L227 ACTIVE.",
  ]);

  // LUXE-FIX [1] & [2]: Track animation frame ID and mute refs
  const animFrameIdRef = useRef<number>(0);
  const isMutedRef = useRef<boolean>(true); // Audio defaults to muted (gain = 0)
  const muteIconRef = useRef<HTMLDivElement>(null);
  const unmuteIconRef = useRef<HTMLDivElement>(null);

  // Add a helper to push logs
  const addLog = (msg: string) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x030305, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.08);

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    /* ── Color Palette Constants ── */
    const COLORS = {
      cyan: new THREE.Color(0x00f2ff),
      gold: new THREE.Color(0xc9a84c),
      burgundy: new THREE.Color(0x6b1e3c),
    };

    /* ── 3D Holographic Core Geometries ── */
    // Inner structure (Mannequin/Torus Core)
    const torusKnotGeo = new THREE.TorusKnotGeometry(0.9, 0.28, 120, 16);
    const torusKnotMat = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const torusKnotMesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material> = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    scene.add(torusKnotMesh);

    // Outer cage structure (Dodecahedron wireframe)
    const outerDodecahedronGeo = new THREE.DodecahedronGeometry(2.3, 0);
    const outerCageMat = new THREE.LineBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.18,
    });
    const outerCage = new THREE.LineSegments(new THREE.WireframeGeometry(outerDodecahedronGeo), outerCageMat);
    scene.add(outerCage);

    // LUXE-FIX [6]: Volumetric glow on outer cage wireframe (scaled to 1.05x, basic material, additive blending, opacity 0.08)
    const glowCage = outerCage.clone() as any;
    glowCage.scale.multiplyScalar(1.05);
    const glowCageMat = new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      wireframe: true,
    });
    glowCage.material = glowCageMat;
    scene.add(glowCage);

    // Swap geometries helpers
    const setGeometryShape = (shape: string) => {
      torusKnotMesh.geometry.dispose();
      if (shape === "tesseract") {
        torusKnotMesh.geometry = new THREE.TorusKnotGeometry(0.9, 0.28, 120, 16);
      } else if (shape === "spherical") {
        torusKnotMesh.geometry = new THREE.SphereGeometry(1.2, 16, 16);
      } else if (shape === "hyperbolic") {
        torusKnotMesh.geometry = new THREE.OctahedronGeometry(1.3, 1);
      }
    };
    setGeometryRef.current = setGeometryShape;

    /* ── Scanning laser planes (glowing rings) ── */
    const laserGroup = new THREE.Group();
    const laserRingGeo = new THREE.TorusGeometry(2.4, 0.015, 6, 80);
    const laserMat = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.6,
    });
    const laserRing1 = new THREE.Mesh(laserRingGeo, laserMat);
    laserRing1.rotation.x = Math.PI / 2;
    laserGroup.add(laserRing1);

    const laserRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.01, 6, 80), new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.4,
    }));
    laserRing2.rotation.x = Math.PI / 2;
    laserGroup.add(laserRing2);

    scene.add(laserGroup);

    /* ── Swirling Particle Vortex ── */
    const PARTICLE_COUNT = 600;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleAngles = new Float32Array(PARTICLE_COUNT);
    const particleRadii = new Float32Array(PARTICLE_COUNT);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particleY = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 1.2 + Math.random() * 2.2;
      particleSpeeds[i] = 0.008 + Math.random() * 0.015;
      particleY[i] = (Math.random() - 0.5) * 5;

      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = particleY[i];
      particlePositions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: COLORS.cyan,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    /* ── Lights ── */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(COLORS.cyan, 3, 15);
    cyanLight.position.set(-2, 2, 3);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(COLORS.gold, 2.5, 15);
    goldLight.position.set(2, -2, 3);
    scene.add(goldLight);

    /* ── Mouse Interaction & Parallax ── */
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    /* ── Animation Loop ── */
    let animId: number;
    const startTime = performance.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const elapsed = (performance.now() - startTime) / 1000;
      const sysSpeed = speedRef.current;
      const colorMode = colorModeRef.current;
      const geomType = geometryTypeRef.current;

      // Handle active color updates dynamically
      const targetColor = COLORS[colorMode as keyof typeof COLORS] || COLORS.cyan;
      torusKnotMat.color.lerp(targetColor, 0.05);
      laserMat.color.lerp(targetColor, 0.05);
      particleMat.color.lerp(targetColor, 0.05);
      cyanLight.color.lerp(targetColor, 0.05);
      glowCageMat.color.lerp(targetColor, 0.05);

      // Core rotation
      torusKnotMesh.rotation.y = elapsed * 0.25 * sysSpeed;
      torusKnotMesh.rotation.x = elapsed * 0.15 * sysSpeed;
      outerCage.rotation.y = -elapsed * 0.1 * sysSpeed;
      outerCage.rotation.z = elapsed * 0.05 * sysSpeed;
      glowCage.rotation.y = outerCage.rotation.y;
      glowCage.rotation.z = outerCage.rotation.z;

      // Laser scanner sweeping
      laserRing1.position.y = Math.sin(elapsed * 1.5) * 2.2;
      laserRing2.position.y = Math.cos(elapsed * 1.5) * 2.2;
      laserGroup.rotation.y = elapsed * 0.15;

      // Particles Vortex movement
      const positions = particleGeo.attributes.position.array as Float32Array;
      const now = performance.now();
      const isExploding = now - explosionTriggerRef.current < 1200;
      const explosionProgress = (now - explosionTriggerRef.current) / 1200;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleAngles[i] += particleSpeeds[i] * sysSpeed;
        
        let currentRadius = particleRadii[i];
        
        // Dynamic explosion expansion
        if (isExploding) {
          const force = Math.sin(explosionProgress * Math.PI) * 2.8;
          currentRadius += force;
        }

        // Add subtle wave fluctuation
        currentRadius += Math.sin(elapsed * 2 + particleY[i]) * 0.08;

        positions[i * 3] = Math.cos(particleAngles[i]) * currentRadius;
        positions[i * 3 + 1] = particleY[i] + Math.cos(elapsed + particleAngles[i]) * 0.1;
        positions[i * 3 + 2] = Math.sin(particleAngles[i]) * currentRadius;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Smooth camera lerp parallax
      targetCameraX += (mouseX * 2.2 - targetCameraX) * 0.035;
      targetCameraY += (mouseY * 1.4 - targetCameraY) * 0.035;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    // LUXE-FIX [1]: IntersectionObserver on canvas element to pause loop out of view
    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!animFrameIdRef.current) {
            animFrameIdRef.current = requestAnimationFrame(loop);
          }
        } else {
          if (animFrameIdRef.current) {
            cancelAnimationFrame(animFrameIdRef.current);
            animFrameIdRef.current = 0;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    /* ── Resize handler ── */
    const onResize = () => {
      if (!canvas) return;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      outerDodecahedronGeo.dispose();
      outerCageMat.dispose();
      glowCageMat.dispose();
      laserRingGeo.dispose();
      laserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Handler to adjust speed
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spd = parseFloat(e.target.value);
    speedRef.current = spd;
    setCurrentSpeed(spd);
    addLog(`COMPILER VELOCITY MODIFIED: ${spd.toFixed(1)}x`);
  };

  // LUXE-FIX [2]: Toggle mute state and update speaker icons
  const handleMuteToggle = () => {
    isMutedRef.current = !isMutedRef.current;
    if (isMutedRef.current) {
      if (muteIconRef.current) muteIconRef.current.style.display = "block";
      if (unmuteIconRef.current) unmuteIconRef.current.style.display = "none";
      addLog("AUDIO OUTPUT DEACTIVATED");
    } else {
      if (muteIconRef.current) muteIconRef.current.style.display = "none";
      if (unmuteIconRef.current) unmuteIconRef.current.style.display = "block";
      addLog("AUDIO OUTPUT ACTIVATED // 440Hz SYNTH");
    }
  };

  // Handler to swap color protocols
  const selectColorProtocol = (mode: string) => {
    colorModeRef.current = mode;
    setActiveColor(mode);
    addLog(`COLORWAY MATRIX CONFIGURED: ${mode.toUpperCase()} EMBERS`);
  };

  // Handler to synthesize and morph structure
  const synthesizeGeometry = (geom: string) => {
    geometryTypeRef.current = geom;
    setActiveGeometry(geom);
    explosionTriggerRef.current = performance.now();
    
    let label = "Knit";
    if (geom === "spherical") label = "Linen";
    if (geom === "hyperbolic") label = "Cotton";
    addLog(`THREAD ARCHITECTURE RE-COMPILED -> ${label.toUpperCase()} WEAVE`);

    if (setGeometryRef.current) {
      setGeometryRef.current(geom);
    }
    
    // Play synthesis audio beep feedback in browser if supported
    if (typeof window !== "undefined" && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        // LUXE-FIX [2]: Default to gain = 0 when muted, else 0.08
        const volume = isMutedRef.current ? 0 : 0.08;
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
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
      behavior: "smooth"
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030305] z-30 select-none">
      {/* Three.js Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Futuristic Scanner Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,242,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] z-10" />

      {/* Floating Holographic Interface Panels (HUD) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8 pointer-events-none mt-[80px]">
        
        {/* Top telemetry and status stats row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
          {/* Left Panel: Telemetry HUD */}
          {/* LUXE-FIX [3]: Change panel background, critical numerical readouts, and secondary labels for high contrast */}
          <div className="glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col gap-3 pointer-events-auto max-w-[280px] w-full">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/10">
              <Cpu size={14} className="text-[#00f2ff] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">LUXE OS // NEURAL TAILOR</span>
            </div>
            
            <div className="flex flex-col gap-1.5 font-mono text-[8.5px] text-white/90 tracking-wider">
              <div className="flex justify-between">
                <span>WEAVE INTEGRITY:</span>
                <span className="text-[#00f2ff] font-bold animate-pulse">OPTIMAL // 100%</span>
              </div>
              <div className="flex justify-between">
                <span>FABRIC CORE TEMP:</span>
                <span className="text-[#00f2ff] font-bold">BREATHABLE // 28°C</span>
              </div>
              <div className="flex justify-between">
                <span>THREAD COUNT:</span>
                <span className="text-[#00f2ff] font-bold">800 TC // SHIFT</span>
              </div>
              <div className="flex justify-between">
                <span>COD TRANSACTIONS:</span>
                <span className="text-[#00f2ff] font-bold">100% SECURE</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Active Calibration logs */}
          {/* LUXE-FIX [3]: Change panel background to bg-[#050508]/85 */}
          <div className="glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col gap-3 pointer-events-auto max-w-[280px] w-full">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Terminal size={14} className="text-[#c9a84c]" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">WEAVE SYNTHESIS LOG</span>
              </div>
              {/* LUXE-FIX [2]: Audio mute/unmute toggle speaker button */}
              <button
                onClick={handleMuteToggle}
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 focus:outline-none flex items-center justify-center"
                title="Toggle Sound"
              >
                <div ref={unmuteIconRef} style={{ display: "none" }}><Volume2 size={12} className="text-[#00f2ff]" /></div>
                <div ref={muteIconRef} style={{ display: "block" }}><VolumeX size={12} className="text-white/40" /></div>
              </button>
            </div>
            <div className="flex flex-col gap-1 font-mono text-[8px] text-[#00f2ff] tracking-wide text-left h-[50px] overflow-hidden leading-relaxed">
              {logMessages.map((log, index) => (
                <div key={index} className="truncate">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Interactive Core Controls Panel */}
        {/* LUXE-FIX [3]: Change panel background to bg-[#050508]/85 and adjust label/readout contrast */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none select-none max-w-[320px] md:max-w-md w-full">
          <div className="relative pointer-events-auto flex flex-col gap-6 w-full p-6 bg-[#050508]/85 border border-white/5 backdrop-blur-md rounded-[32px] shadow-2xl">
            {/* Glass panel border brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00f2ff]/60" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00f2ff]/60" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00f2ff]/60" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00f2ff]/60" />

            <div>
              <span className="text-[8px] font-mono tracking-[0.45em] text-white/90 uppercase block mb-1">STYLE DECK</span>
              <h2 className="text-3xl font-cormorant tracking-[0.1em] text-white uppercase font-bold">THE FABRIC NEXUS</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent mx-auto mt-3" />
            </div>

            {/* Slider Control */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[9px] text-white/90 tracking-wider">
                <span>DESIGN FRAME ROTATION</span>
                <span className="text-[#00f2ff] font-bold">{currentSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={currentSpeed}
                onChange={handleSpeedChange}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff] hover:bg-white/20 transition-all focus:outline-none"
              />
            </div>

            {/* Color protocols triggers */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">DESIGN COLORWAY PROTOCOL</span>
              <div className="flex gap-2">
                {[
                  { id: "cyan", label: "ONYX_NEON" },
                  { id: "gold", label: "CHAMPAGNE_GOLD" },
                  { id: "burgundy", label: "ROYAL_BURGUNDY" },
                ].map((proto) => (
                  <button
                    key={proto.id}
                    onClick={() => selectColorProtocol(proto.id)}
                    className={`flex-1 py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      activeColor === proto.id
                        ? "bg-white/5 border-[#00f2ff] text-white font-bold shadow-[0_0_15px_rgba(0,242,255,0.15)]"
                        : "border-white/5 bg-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    {proto.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Geometry compiler */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">ACTIVE TEXTILE FILAMENT</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "tesseract", label: "Oversized Knit" },
                  { id: "spherical", label: "Luxury Linen" },
                  { id: "hyperbolic", label: "Supima Cotton" },
                ].map((geom) => (
                  <button
                    key={geom.id}
                    onClick={() => synthesizeGeometry(geom.id)}
                    className={`py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                      activeGeometry === geom.id
                        ? "bg-white/5 border-[#c9a84c] text-white font-bold shadow-[0_0_15px_rgba(201,168,76,0.15)]"
                        : "border-white/5 bg-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    {geom.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll helper overlays */}
        <div className="flex justify-between items-end w-full">
          <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] pointer-events-auto">
            DELIVERY COORD: <span className="text-[#00f2ff]">HYDERABAD // IN</span>
          </div>

          {/* Interactive descend CTA */}
          <button 
            onClick={scrollToHero}
            className="flex flex-col items-center gap-2 text-center pointer-events-auto cursor-pointer group bg-transparent border-none outline-none"
          >
            <span className="text-[9px] font-mono text-white/50 tracking-[0.45em] uppercase group-hover:text-white group-hover:tracking-[0.55em] transition-all">
              Initialize Wardrobe
            </span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-colors shadow-lg animate-bounce">
              <ArrowDown size={14} />
            </div>
          </button>

          <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] pointer-events-auto">
            FIT MATRIX: <span className="text-[#c9a84c]">STABLE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
