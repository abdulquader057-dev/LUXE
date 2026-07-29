'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Rotate3d, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductViewer3DRealProps {
  modelUrl: string;
  productName: string;
  selectedColor?: string;
}

function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive
        object={scene}
        scale={1.8}
        position={[0, -0.5, 0]}
      />
    </Center>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1.5, 0.1]} />
      <meshStandardMaterial color="#1A1A26" wireframe />
    </mesh>
  );
}

export const ProductViewer3DReal = ({ modelUrl, productName, selectedColor = 'Default' }: ProductViewer3DRealProps) => {
  const controlsRef = useRef<any>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoom, setZoom] = useState(4);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setZoom(4);
    setIsAutoRotating(true);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#0D0D14] to-[#1A1A26] border border-[rgba(201,168,76,0.1)] group">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, zoom], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={() => setIsAutoRotating(false)}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8f0" />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#C9A84C" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#E8C97A" />

        <Suspense fallback={<LoadingFallback />}>
          <GLBModel url={modelUrl} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          autoRotate={isAutoRotating}
          autoRotateSpeed={1.5}
          enableZoom
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* HUD Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={resetCamera}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] flex items-center justify-center transition-all backdrop-blur-md"
          title="Reset view"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={() => { setZoom(z => Math.max(2, z - 0.5)); setIsAutoRotating(false); }}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.2)] text-white/70 flex items-center justify-center transition-all backdrop-blur-md"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => { setZoom(z => Math.min(8, z + 0.5)); setIsAutoRotating(false); }}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.2)] text-white/70 flex items-center justify-center transition-all backdrop-blur-md"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
      </div>

      {/* Auto-rotate toggle */}
      <button
        onClick={() => setIsAutoRotating(!isAutoRotating)}
        className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border text-[9px] font-mono tracking-widest uppercase transition-all ${
          isAutoRotating
            ? 'bg-[rgba(201,168,76,0.15)] border-[rgba(201,168,76,0.4)] text-[#C9A962]'
            : 'bg-black/40 border-white/10 text-white/40'
        }`}
      >
        <Rotate3d size={12} className={isAutoRotating ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
        {isAutoRotating ? '360° Live' : 'Paused'}
      </button>

      {/* Bottom label */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-10">
        <div className="bg-black/60 backdrop-blur-xl border border-[rgba(201,168,76,0.2)] px-4 py-2 rounded-full">
          <div className="text-[8px] font-mono tracking-[0.2em] text-[#C9A962] uppercase font-bold">
            3D Model View
          </div>
          <div className="text-[7px] font-mono text-white/30 tracking-wider">
            Drag to rotate · Scroll to zoom
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-full">
          <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">
            Color: <span className="text-[#C9A962]">{selectedColor}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductViewer3DReal;
