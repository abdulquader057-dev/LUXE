"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles, Stars, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// The animated luxury centerpiece
function LuxuryCenterpiece() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
    // Subtle cinematic camera drift
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(state.clock.elapsedTime * 0.2) * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.cos(state.clock.elapsedTime * 0.2) * 1.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        {/* A complex, elegant knot representing intertwined fabric/luxury */}
        <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
        <MeshDistortMaterial
          color="#C9A84C"
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.2}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function Global3DBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#050505] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <React.Suspense fallback={null}>
          <Environment preset="city" />
          
          <LuxuryCenterpiece />

          {/* Deep space background */}
          <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
          
          {/* Glowing luxury dust / energy streams */}
          <Sparkles count={150} scale={12} size={3} speed={0.4} opacity={0.3} color="#E8C97A" />
          
          {/* Floor reflection shadow */}
          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#C9A84C" />
          
          {/* Cinematic lighting setup */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#C9A84C" />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
