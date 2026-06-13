"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Global3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized pixel ratio for bg performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050508, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    const GOLD = 0xc9a84c;

    /* ── Subtle rotating gold wireframe sphere (centerpiece of background) ── */
    const sphereGeo = new THREE.SphereGeometry(1.8, 22, 22);
    const sphereMat = new THREE.LineBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.12, // Very subtle background opacity
    });
    const sphere = new THREE.LineSegments(new THREE.WireframeGeometry(sphereGeo), sphereMat);
    scene.add(sphere);

    /* ── Orbiting concentric rings ── */
    const rings: any[] = [];
    ([
      [2.8, 0.002, Math.PI / 4, 0, 0.2],
      [3.5, 0.0025, -Math.PI / 6, Math.PI / 5, -0.12],
      [4.2, 0.0018, Math.PI / 8, Math.PI / 3, 0.08],
    ] as [number, number, number, number, number][]).forEach(([r, t, rx, rz, spd]) => {
      const ringGeo = new THREE.TorusGeometry(r, t, 3, 80);
      const ringMat = new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.06,
      });
      const ring = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeo), ringMat) as any;
      ring.rotation.x = rx;
      ring.rotation.z = rz;
      ring.userData.spd = spd;
      scene.add(ring);
      rings.push(ring);
    });

    /* ── Drifting gold dust particles ── */
    const DUST_COUNT = 350;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustSpeeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      // Spread particles in a 3D box bounding volume
      dustPositions[i * 3] = (Math.random() - 0.5) * 24;      // X
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;  // Y
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2; // Z
      dustSpeeds[i] = 0.003 + Math.random() * 0.006;           // Speed
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: GOLD,
      size: 0.038,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Simple ambient and directional lights for depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(GOLD, 1.2, 15);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    /* ── Interactive mouse movement (Parallax) ── */
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse positions between -1 and 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    /* ── Animation Loop ── */
    let animId: number;
    const startTime = performance.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const elapsed = (performance.now() - startTime) / 1000;

      // Rotate centerpiece sphere
      sphere.rotation.y = elapsed * 0.04;
      sphere.rotation.x = elapsed * 0.02;
      sphere.rotation.z = elapsed * 0.01;

      // Rotate orbit rings
      rings.forEach((ring) => {
        ring.rotation.y += ring.userData.spd * 0.01;
      });

      // Drifting gold dust upwards
      const positions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        positions[i * 3 + 1] += dustSpeeds[i]; // Increment Y position
        // Wrap around when particle moves off-screen
        if (positions[i * 3 + 1] > 9) {
          positions[i * 3 + 1] = -9;
          positions[i * 3] = (Math.random() - 0.5) * 24; // New random X
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Apply smooth mouse parallax interpolation (lerp)
      targetX += (mouseX * 1.2 - targetX) * 0.03;
      targetY += (mouseY * 0.8 - targetY) * 0.03;
      
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    loop();

    /* ── Resize handler ── */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
