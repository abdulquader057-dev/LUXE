"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  SpotLight,
  Float,
  Html,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCommerce } from "@/lib/contexts/CommerceContext";

// Individual Product Stage
function ProductStage({ product, index, total }: { product: any; index: number; total: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Layout products in a circle or line
  const spacing = 4;
  const xOffset = (index - (total - 1) / 2) * spacing;

  useFrame((state) => {
    if (!groupRef.current) return;
    // Magnetic hover effect (tilt slightly towards cursor if hovered)
    if (hovered) {
      const targetRotationX = (state.pointer.y * Math.PI) / 10;
      const targetRotationY = (state.pointer.x * Math.PI) / 10;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0.5, 0.1);
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.05);
    }
  });

  return (
    <group position={[xOffset, 0, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
        <group 
          ref={groupRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Glass Card Geometry (Behind the HTML) */}
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[2.8, 3.8]} />
            <meshPhysicalMaterial 
              color="#0a0a0f"
              metalness={0.8}
              roughness={0.2}
              transmission={0.5}
              thickness={0.5}
              envMapIntensity={2}
              clearcoat={1}
            />
          </mesh>

          {/* HTML Overlay for actual product rendering */}
          <Html transform distanceFactor={10} position={[0, 0, 0]} zIndexRange={[100, 0]}>
            <Link href={`/product/${product.id}`}>
              <div 
                className="w-[260px] h-[360px] rounded-xl overflow-hidden flex flex-col justify-end p-4 relative group cursor-pointer border border-white/10 transition-all duration-500"
                style={{
                  background: "rgba(10, 10, 15, 0.4)",
                  backdropFilter: "blur(10px)",
                  boxShadow: hovered ? "0 0 30px rgba(0, 150, 255, 0.2)" : "none"
                }}
              >
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={product.image || product.images?.[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[9px] font-mono text-blue-400/80 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-sm font-sora font-semibold text-white tracking-wide truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-xs font-mono text-white/70 tracking-widest">₹{product.price}</span>
                    <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-blue-400 transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </Html>
        </group>
      </Float>

      {/* Dynamic Spotlight */}
      <SpotLight
        position={[xOffset, 5, 2]}
        target-position={[xOffset, 0, 0]}
        penumbra={1}
        radiusTop={0.5}
        radiusBottom={4}
        distance={10}
        angle={0.4}
        attenuation={5}
        anglePower={5}
        intensity={hovered ? 2 : 0.5}
        color={hovered ? "#4fa3ff" : "#ffffff"}
      />
    </group>
  );
}

// Scene wrapper
function ShowcaseScene({ products }: { products: any[] }) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Drag to scroll logic
  const [dragX, setDragX] = useState(0);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    // Very gentle auto-pan or follow pointer
    const targetX = (state.pointer.x * viewport.width) / 4 + dragX;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
  });

  return (
    <>
      <color attach="background" args={["#030508"]} />
      <fog attach="fog" args={["#030508", 5, 15]} />
      <Environment preset="city" />
      <ambientLight intensity={0.2} />

      <group ref={groupRef}>
        {products.map((p, i) => (
          <ProductStage key={p.id} product={p} index={i} total={products.length} />
        ))}
      </group>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
    </>
  );
}

export default function CinematicShowcase({ products }: { products: any[] }) {
  // Take only top 4 or 5 products for the featured 3D showcase
  const featured = products.slice(0, 5);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-3xl border border-white/5 bg-[#030508] mt-16 group/section">
      
      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h2 className="text-2xl font-orbitron text-white uppercase tracking-widest">
          Museum <span className="text-white/40">Archive</span>
        </h2>
        <p className="text-[10px] font-mono text-blue-400/60 uppercase tracking-[0.2em] mt-2">
          Featured Collectibles // Vol. 01
        </p>
      </div>

      {/* 3D Showcase Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <React.Suspense fallback={null}>
            <ShowcaseScene products={featured} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030508] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030508] to-transparent z-20 pointer-events-none" />
    </section>
  );
}
