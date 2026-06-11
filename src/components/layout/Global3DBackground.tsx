"use client";

import React, { Component, type ErrorInfo, type ReactNode, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ThreeErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.warn("[Global3D] WebGL crashed, hiding background:", err.message, info);
  }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

// ─── Animated Gold Torus Knot ──────────────────────────────────────────────────
function GoldKnot() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    // Rotate the knot
    mesh.current.rotation.y = t * 0.15;
    mesh.current.rotation.x = t * 0.08;
    // Cinematic camera drift — no lookAt, just smooth float
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 0.18) * 2, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(t * 0.12) * 1, 0.02);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={mesh} scale={2.2}>
        <torusKnotGeometry args={[1.2, 0.38, 200, 48]} />
        <meshStandardMaterial
          color="#C9A84C"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={1.8}
          emissive="#7A5000"
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}

// ─── Floating Orbs ─────────────────────────────────────────────────────────────
function FloatingOrbs() {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    group.current.rotation.y = clock.elapsedTime * 0.05;
  });

  const orbs = [
    { pos: [4, 2, -3] as [number, number, number], scale: 0.35, color: "#E8C97A" },
    { pos: [-5, -1, -4] as [number, number, number], scale: 0.5, color: "#C9A84C" },
    { pos: [3, -3, -5] as [number, number, number], scale: 0.28, color: "#9A7B30" },
    { pos: [-4, 3, -6] as [number, number, number], scale: 0.4, color: "#D4AF37" },
    { pos: [0, 4, -7] as [number, number, number], scale: 0.22, color: "#E8C97A" },
  ];

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.pos} scale={o.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={o.color}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Inner Canvas Scene ────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Deep space stars */}
      <Stars radius={80} depth={60} count={3500} factor={3.5} saturation={0} fade speed={0.8} />

      {/* Gold dust / energy streams */}
      <Sparkles count={120} scale={14} size={2.5} speed={0.3} opacity={0.25} color="#E8C97A" />

      {/* Main centerpiece */}
      <GoldKnot />

      {/* Floating accent orbs */}
      <FloatingOrbs />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 8, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-6, 4, 2]} intensity={3} color="#C9A84C" distance={25} decay={2} />
      <pointLight position={[6, -4, -2]} intensity={2} color="#9A7B30" distance={20} decay={2} />
    </>
  );
}

// ─── Public Export ─────────────────────────────────────────────────────────────
export default function Global3DBackground() {
  // Only render on client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1, background: "#050508" }}
      aria-hidden="true"
    >
      <ThreeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 11], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#050508"), 1);
          }}
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
