"use client";

import React, { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { useGLTF, Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Preload the GLB model to speed up rendering
try {
  useGLTF.preload("/models/male_model.glb");
} catch (e) {
  console.warn("Failed to preload male_model.glb:", e);
}

// ── ERROR BOUNDARY CLASS FOR WEBGL GLB LOADING ──
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError: () => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("WebGL Error caught by GarmentModel ErrorBoundary, falling back to particles:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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

      // Multi-wave calculations to simulate wind folds in a vertical sheet of cloth
      const z =
        Math.sin(x * 0.45 + time * speed * 0.85) * 0.3 +
        Math.cos(y * 0.35 + time * speed * 0.7) * 0.24 +
        Math.sin((x + y) * 0.28 + time * speed * 1.05) * 0.15;

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
        roughness={0.8}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: WINDING SILK RIBBON ──
function SilkRibbon({ color, speed }: { color: THREE.Color; speed: number }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    const geom = geomRef.current;
    if (!geom) return;

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const origX = pos.getX(i);
      const origY = pos.getY(i); // Y height goes from -3 to +3

      // Helix wrap angle around the mannequin
      const angle = (origY + 3) * 0.95 + time * speed * 0.65;
      const baseRadius = 1.1 + Math.sin(origY * 0.75 + time * 0.8) * 0.08;
      const radius = baseRadius + origX;

      // Organic wind flutter ripples
      const ripple = Math.sin(origY * 3.5 - time * speed * 1.5) * 0.07;

      const targetX = Math.sin(angle) * (radius + ripple);
      const targetZ = Math.cos(angle) * (radius + ripple);
      const targetY = origY * 0.52; // Scale down vertical height

      pos.setX(i, targetX);
      pos.setY(i, targetY);
      pos.setZ(i, targetZ);
    }

    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
      <planeGeometry ref={geomRef} args={[0.2, 5.0, 4, 64]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.2}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// ── SUBCOMPONENT: GLB MODEL RENDERER ──
interface GlbModelProps {
  onLoaded: () => void;
}

function GlbModel({ onLoaded }: GlbModelProps) {
  const { scene } = useGLTF("/models/male_model.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Notify parent component that loading completed successfully
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  // Configure material properties for non-metallic fabric aesthetics
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.8; // High roughness for soft fabric appearance
          mat.metalness = 0.0; // Non-reflective cloth look
        }
      }
    });
  }, [scene]);

  // Apply continuous Y-axis rotation, scroll parallax, and slow floating sway
  useFrame((state) => {
    if (groupRef.current) {
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      // Slow rotation + scroll reaction rotation offset
      groupRef.current.rotation.y = scrollY * 0.0012 + state.clock.elapsedTime * 0.18;
      groupRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Mannequin model rendered at center-stage */}
      <primitive object={scene} scale={2.2} />
      {/* Helical Silk Ribbon wrapping dynamically around the mannequin */}
      <SilkRibbon color={new THREE.Color("#c9a84c")} speed={0.8} />
    </group>
  );
}

// ── SUBCOMPONENT: PARTICLE FALLBACK FIELD ──
interface ParticleFallbackProps {
  tier: "high" | "low";
}

function ParticleFallback({ tier }: ParticleFallbackProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = tier === "high" ? 3500 : 1000;

  // Generate grid coordinates with subtle organic offsets
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const side = Math.ceil(Math.sqrt(count));
    const spacing = 6 / side;

    let idx = 0;
    for (let i = 0; i < side; i++) {
      for (let j = 0; j < side; j++) {
        if (idx >= count) break;
        const gridX = -3 + i * spacing;
        const gridZ = -3 + j * spacing;
        const xNoise = (Math.random() - 0.5) * spacing * 0.8;
        const zNoise = (Math.random() - 0.5) * spacing * 0.8;

        arr[idx * 3] = gridX + xNoise;     // X
        arr[idx * 3 + 1] = 0;               // Y (starts flat, animated in useFrame)
        arr[idx * 3 + 2] = gridZ + zNoise; // Z
        idx++;
      }
    }

    // Fill any remainder positions
    while (idx < count) {
      arr[idx * 3] = (Math.random() - 0.5) * 6;
      arr[idx * 3 + 1] = 0;
      arr[idx * 3 + 2] = (Math.random() - 0.5) * 6;
      idx++;
    }

    return arr;
  }, [count]);

  // Animate the particles to ripple like a soft fabric structure in wind
  useFrame((state) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      // Ripple wave driven by sine pattern
      arr[i * 3 + 1] = Math.sin(time * 0.5 + x * 1.5) * 0.3;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e8e0d0"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

// ── MAIN EXPORT: GARMENT MODEL MANAGER ──
interface GarmentModelProps {
  tier: "high" | "low";
}

export default function GarmentModel({ tier }: GarmentModelProps) {
  const [useParticles, setUseParticles] = useState<boolean>(tier === "low");
  const [hasLoadedGlb, setHasLoadedGlb] = useState<boolean>(false);

  useEffect(() => {
    if (tier === "low") {
      setUseParticles(true);
      return;
    }

    // If GLB doesn't mount and load successfully within 5 seconds, fallback to particles
    const timer = setTimeout(() => {
      if (!hasLoadedGlb) {
        console.warn("Mannequin model failed to load in 5 seconds. Activating particle fallback.");
        setUseParticles(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [tier, hasLoadedGlb]);

  const handleGlbLoaded = () => {
    setHasLoadedGlb(true);
  };

  const handleGlbError = () => {
    setUseParticles(true);
  };

  if (useParticles) {
    return <ParticleFallback tier={tier} />;
  }

  return (
    <ErrorBoundary fallback={<ParticleFallback tier={tier} />} onError={handleGlbError}>
      <Suspense fallback={null}>
        {/* Soft, wind-blown charcoal silk backdrop in the background */}
        <SilkBackdrop color={new THREE.Color("#0a0a0c")} speed={0.4} />
        <GlbModel onLoaded={handleGlbLoaded} />
      </Suspense>
    </ErrorBoundary>
  );
}
