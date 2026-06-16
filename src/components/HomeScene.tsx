"use client";

import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import SceneLighting from "./SceneLighting";
import GarmentModel from "./GarmentModel";
import usePerformanceTier from "@/hooks/usePerformanceTier";

// Subcomponent to safely attach context lost/restored handlers in R3F environment
function WebGLContextHandler() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("[Luxe WebGL] context lost in HomeScene Canvas");
    };

    const handleContextRestored = () => {
      console.log("[Luxe WebGL] context restored in HomeScene Canvas");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  return null;
}

export default function HomeScene() {
  const tier = usePerformanceTier();

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <Canvas
        dpr={tier === "high" ? [1, 2] : [1, 1]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
        gl={{ alpha: true }}
        style={{ background: "transparent", position: "absolute", inset: 0 }}
      >
        <WebGLContextHandler />
        <SceneLighting />
        <Suspense fallback={null}>
          <GarmentModel tier={tier} />
        </Suspense>
        {tier === "high" && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.3} intensity={0.4} />
            <Vignette offset={0.3} darkness={0.6} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
