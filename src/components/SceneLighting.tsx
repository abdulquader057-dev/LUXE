"use client";

import React from "react";

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
      />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#a0c4ff" />
    </>
  );
}
