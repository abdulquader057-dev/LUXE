"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Environment,
  Sparkles,
  Stars,
  Float,
  CameraControls,
  MeshReflectorMaterial
} from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function Scene() {
  const { viewport, camera } = useThree();
  const textRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Parallax based on mouse
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth mouse follow
    const x = (state.pointer.x * viewport.width) / 5;
    const y = (state.pointer.y * viewport.height) / 5;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.05);
    
    // Slow camera drift
    camera.position.x = Math.sin(t * 0.1) * 0.5;
    camera.position.y = Math.cos(t * 0.1) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#030508"]} />
      <fog attach="fog" args={["#030508", 5, 25]} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.2} color="#4fa3ff" />
      <spotLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" penumbra={1} castShadow />
      
      <group ref={groupRef}>
        {/* Core Logo */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            ref={textRef}
            font="https://fonts.gstatic.com/s/sora/v11/xMQbuNd5115vs1xE.woff"
            fontSize={viewport.width > 5 ? 2.5 : 1.5}
            letterSpacing={0.1}
            position={[0, 0, 0]}
          >
            LUXE
            <meshPhysicalMaterial 
              color="#ffffff"
              metalness={1}
              roughness={0.1}
              envMapIntensity={2}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text>
        </Float>
        
        {/* Floating Abstract Shapes for Depth */}
        {Array.from({ length: 15 }).map((_, i) => (
          <Float 
            key={i}
            speed={1 + Math.random()} 
            rotationIntensity={Math.random() * 2} 
            floatIntensity={Math.random() * 2}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10 - 5
            ]}
          >
            <mesh scale={Math.random() * 0.5 + 0.1}>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial 
                color="#88ccff" 
                transmission={0.9} 
                opacity={1} 
                metalness={0} 
                roughness={0} 
                ior={1.5} 
                thickness={0.5} 
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Atmospheric Particles */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={15} size={2} speed={0.4} opacity={0.2} color="#aaccff" />
      
      {/* Reflective Dark Floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          mirror={1}
        />
      </mesh>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
}

export default function CinematicHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030508]">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </Canvas>
      </div>

      {/* HTML Overlay UI */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-24 px-4 pointer-events-none">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 1, 0.15, 1] }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          <p className="text-white/60 font-sora text-xs md:text-sm uppercase tracking-[0.3em] mb-8 leading-relaxed">
            The Future of Luxury Fashion. <br/>
            Engineered for the next generation.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto">
            <Link
              href="/shop"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-xs font-sora font-semibold text-white uppercase tracking-[0.2em]">
                Enter Collection
              </span>
              <ArrowRight size={14} className="relative z-10 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </motion.div>
        
        {/* Cinematic Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em]">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
