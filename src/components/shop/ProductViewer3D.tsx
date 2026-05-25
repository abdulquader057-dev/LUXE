"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, useGLTF } from "@react-three/drei";
import { Sparkles, Maximize2, Rotate3D, View } from "lucide-react";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProductViewer3DProps {
  images: string[];
  productName: string;
}

// Fallback abstract 3D shape if no GLB is provided
function AbstractProduct() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.5, 2]} />
        <meshPhysicalMaterial 
          color="#00f2ff" 
          metalness={0.9} 
          roughness={0.1} 
          transmission={0.5}
          thickness={2}
          wireframe={true}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]} scale={0.8}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export const ProductViewer3D = ({ images, productName }: ProductViewer3DProps) => {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="relative w-full aspect-[3/4] rounded-[48px] overflow-hidden bg-[#050508] border border-white/10 group">
      
      {/* 2D Image View */}
      <AnimatePresence>
        {viewMode === "2D" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Image
              src={images[0] || "/hero-1.jpg"}
              alt={productName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas View */}
      <AnimatePresence>
        {viewMode === "3D" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onMouseDown={() => setIsInteracting(true)}
            onMouseUp={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f2ff" />
              
              <Suspense fallback={null}>
                <AbstractProduct />
                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              </Suspense>
              
              <OrbitControls 
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
                autoRotate={!isInteracting}
                autoRotateSpeed={2}
              />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => setViewMode(viewMode === "2D" ? "3D" : "2D")}
          className={`w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all ${
            viewMode === "3D" 
              ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,242,255,0.4)]" 
              : "bg-black/40 text-white/70 border-white/20 hover:text-white hover:bg-white/10"
          }`}
        >
          {viewMode === "3D" ? <View size={20} /> : <Rotate3D size={20} />}
        </button>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-primary/30 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl pointer-events-auto">
          <Sparkles size={16} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
            {viewMode === "3D" ? "Neural 3D Matrix" : "Neural Sync 98.4%"}
          </span>
        </div>

        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all pointer-events-auto">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
