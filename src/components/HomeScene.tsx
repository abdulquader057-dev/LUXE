"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import SceneLighting from "./SceneLighting";
import GarmentModel from "./GarmentModel";
import usePerformanceTier from "@/hooks/usePerformanceTier";

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
