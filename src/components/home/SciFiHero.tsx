"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Cpu, Terminal, Compass, Zap, Shield, HelpCircle, Layers, ArrowDown, Volume2, VolumeX, Sliders, X } from "lucide-react";

export default function SciFiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setGeometryRef = useRef<((shape: string) => void) | null>(null);
  
  // Interactive state refs to share with the Three.js animation loop without re-triggering useEffect
  const speedRef = useRef<number>(1.0);
  const colorModeRef = useRef<string>("cyan"); // "cyan" | "gold" | "burgundy"
  const geometryTypeRef = useRef<string>("tesseract"); // "tesseract" | "spherical" | "hyperbolic"
  const explosionTriggerRef = useRef<number>(0); // Timestamp of last explosion

  // React states for HUD metrics displays
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [activeColor, setActiveColor] = useState<string>("cyan");
  const [activeGeometry, setActiveGeometry] = useState<string>("tesseract");
  const [logMessages, setLogMessages] = useState<string[]>([
    "INITIALIZING WEARABLE TAILOR ENGINE...",
    "CALIBRATING THREAD DENSITY: OPTIMAL",
    "HYDERABAD HUB SYNCED // DIRECT SHIFT",
    "DESIGN MATRIX PROTOCOL-L227 ACTIVE.",
  ]);

  // LUXE-FIX [1] & [2]: Track animation frame ID and mute refs
  const animFrameIdRef = useRef<number>(0);
  const isMutedRef = useRef<boolean>(true); // Audio defaults to muted (gain = 0)
  const muteIconRef = useRef<HTMLDivElement>(null);
  const unmuteIconRef = useRef<HTMLDivElement>(null);

  // LUXE-ANIM-1: Drag-to-rotate hologram group with inertia damping
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });

  // LUXE-ANIM-4: HUD fade-in sync with intro animation
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("luxe_intro_played");
    }
    return false;
  });

  // Collapsible control panel state
  const [controlsOpen, setControlsOpen] = useState(true);

  // Add a helper to push logs
  const addLog = (msg: string) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x030305, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.08);

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    /* ── Color Palette Constants ── */
    const COLORS = {
      cyan: new THREE.Color(0x00f2ff),
      gold: new THREE.Color(0xc9a84c),
      burgundy: new THREE.Color(0x6b1e3c),
    };

    // LUXE-ANIM-1: Drag-to-rotate hologram group with inertia damping
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    /* ── 3D Holographic Core Geometries ── */
    // Inner structure (Mannequin/Torus Core)
    const torusKnotGeo = new THREE.TorusKnotGeometry(0.9, 0.28, 120, 16);
    const torusKnotMat = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const torusKnotMesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material> = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    hologramGroup.add(torusKnotMesh);

    // Load custom male mannequin model
    const loader = new GLTFLoader();
    let maleModel: THREE.Group | null = null;
    
    loader.load(
      "/models/male_model.glb",
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Use original materials with clothing textures, configuring Standard properties for realistic fabric
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.6;
              mat.metalness = 0.1;
              mat.side = THREE.DoubleSide;
            }
          }
        });
        
        // Scale and position the model to center it perfectly inside the hologram core
        model.scale.setScalar(2.2);
        model.position.set(0.2, -1.9, 0.3);
        
        maleModel = model;
        
        // Default active geometry is "tesseract" (Oversized Knit), so show the model immediately if active
        if (geometryTypeRef.current === "tesseract") {
          hologramGroup.add(maleModel);
          torusKnotMesh.visible = false;
        }
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D male model:", err);
      }
    );

    // LUXE-FIX A: Core brightness
    // Outer cage structure (Dodecahedron wireframe)
    const outerDodecahedronGeo = new THREE.DodecahedronGeometry(2.3, 0);
    const outerCageMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x00f2ff),
      linewidth: 1.5,
      transparent: true,
      opacity: 0.18,
    });
    const outerCage = new THREE.LineSegments(new THREE.WireframeGeometry(outerDodecahedronGeo), outerCageMat);
    hologramGroup.add(outerCage);

    const coreLight = new THREE.PointLight(0x00f2ff, 2.0, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // LUXE-FIX B: 3D torus ring
    const ctaTorusGeo = new THREE.TorusGeometry(2.2, 0.008, 3, 120);
    const ctaTorusMat = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.7,
    });
    const ctaTorusMesh = new THREE.Mesh(ctaTorusGeo, ctaTorusMat);
    ctaTorusMesh.rotation.x = Math.PI / 2.4;
    ctaTorusMesh.position.set(0, -2.8, 0);
    scene.add(ctaTorusMesh);

    // LUXE-FIX [6]: Volumetric glow on outer cage wireframe (scaled to 1.05x, basic material, additive blending, opacity 0.08)
    const glowCage = outerCage.clone() as any;
    glowCage.scale.multiplyScalar(1.05);
    const glowCageMat = new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      wireframe: true,
    });
    glowCage.material = glowCageMat;
    hologramGroup.add(glowCage);

    // Swap geometries helpers
    const setGeometryShape = (shape: string) => {
      if (shape === "tesseract") {
        torusKnotMesh.visible = false;
        if (maleModel) {
          hologramGroup.add(maleModel);
        }
      } else {
        torusKnotMesh.visible = true;
        if (maleModel) {
          hologramGroup.remove(maleModel);
        }
        
        torusKnotMesh.geometry.dispose();
        if (shape === "spherical") {
          torusKnotMesh.geometry = new THREE.SphereGeometry(1.2, 16, 16);
        } else if (shape === "hyperbolic") {
          torusKnotMesh.geometry = new THREE.OctahedronGeometry(1.3, 1);
        }
      }
    };
    setGeometryRef.current = setGeometryShape;

    /* ── Scanning laser planes (glowing rings) ── */
    const laserGroup = new THREE.Group();
    const laserRingGeo = new THREE.TorusGeometry(2.4, 0.015, 6, 80);
    const laserMat = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.6,
    });
    const laserRing1 = new THREE.Mesh(laserRingGeo, laserMat);
    laserRing1.rotation.x = Math.PI / 2;
    laserGroup.add(laserRing1);

    const laserRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.01, 6, 80), new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.4,
    }));
    laserRing2.rotation.x = Math.PI / 2;
    laserGroup.add(laserRing2);

    hologramGroup.add(laserGroup);

    /* ── Swirling Particle Vortex ── */
    // LUXE-FIX C: Particle depth
    const PARTICLE_COUNT = 600;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleAngles = new Float32Array(PARTICLE_COUNT);
    const particleRadii = new Float32Array(PARTICLE_COUNT);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particleY = new Float32Array(PARTICLE_COUNT);
    const particleZ = new Float32Array(PARTICLE_COUNT);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particleOpacities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 1.2 + Math.random() * 2.2;
      particleY[i] = (Math.random() - 0.5) * 5;

      const zVal = Math.random() * 400 - 200;
      particleZ[i] = zVal;

      const baseSpeed = 0.008 + Math.random() * 0.015;
      particleSpeeds[i] = baseSpeed * (0.4 + Math.abs(zVal) / 200);

      particleSizes[i] = 0.8 + (1 - zVal / 200) * 1.4;

      let opacityVal = 0.65;
      if (zVal > 0) {
        opacityVal = 1.0;
      } else if (zVal < -100) {
        opacityVal = 0.3;
      } else {
        opacityVal = 0.3 + ((zVal + 100) / 100) * 0.7;
      }
      particleOpacities[i] = opacityVal;

      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = particleY[i];
      particlePositions[i * 3 + 2] = zVal;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("aSize", new THREE.BufferAttribute(particleSizes, 1));
    particleGeo.setAttribute("aOpacity", new THREE.BufferAttribute(particleOpacities, 1));

    const particleMat = new THREE.PointsMaterial({
      color: COLORS.cyan,
      size: 0.085,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    hologramGroup.add(particleSystem);

    // LUXE-ANIM-3: Particle motion trails using lagged position buffer
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(PARTICLE_COUNT * 3);
    trailPositions.set(particlePositions);
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));

    const trailMat = new THREE.PointsMaterial({
      color: COLORS.cyan,
      size: 0.6,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const trailSystem = new THREE.Points(trailGeo, trailMat);
    hologramGroup.add(trailSystem);

    /* ── Lights ── */
    // Brighten ambient light to make textures clearly visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Front directional light for clear illumination of the clothing
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 3, 5);
    scene.add(frontLight);

    // Back directional light for depth and rim highlight
    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(0, 1, -5);
    scene.add(backLight);

    // Dynamic colored point lights to cast futuristic glows on the clothing sides
    const cyanLight = new THREE.PointLight(COLORS.cyan, 2.5, 12);
    cyanLight.position.set(-3, 2, 2);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(COLORS.gold, 2.0, 12);
    goldLight.position.set(3, -2, 2);
    scene.add(goldLight);

    // LUXE-ANIM-2 & ANIM-3: Cinematic shatter-reform intro and lag positions initialization
    const originalPositions = new Float32Array(particlePositions);
    const lagPositions = new Float32Array(PARTICLE_COUNT * 3);
    lagPositions.set(particlePositions);

    const hasIntroPlayed = !!sessionStorage.getItem('luxe_intro_played');
    let introFinished = hasIntroPlayed;

    const handleSkipClick = () => {
      if (!introFinished) {
        introFinished = true;
        sessionStorage.setItem('luxe_intro_played', 'true');
        setIntroComplete(true);
        camera.position.z = 7.5;
        hologramGroup.scale.set(1.0, 1.0, 1.0);
        canvas.removeEventListener("click", handleSkipClick);
      }
    };
    if (!hasIntroPlayed) {
      canvas.addEventListener("click", handleSkipClick);
    }

    /* ── Mouse & Touch Drag Interaction (Inertia Orbiting) ── */
    // LUXE-ANIM-1: Drag-to-rotate hologram group with inertia damping
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouse.current = { x: clientX, y: clientY };
      dragVelocity.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const isTouch = 'touches' in e;
      if (isTouch && e.touches.length === 0) return;
      const clientX = isTouch ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = isTouch ? e.touches[0].clientY : (e as MouseEvent).clientY;

      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      if (!isDragging.current) return;

      const deltaX = clientX - prevMouse.current.x;
      const deltaY = clientY - prevMouse.current.y;

      hologramGroup.rotation.y += deltaX * 0.008;
      hologramGroup.rotation.x += deltaY * 0.008;

      dragVelocity.current = {
        x: deltaX * 0.008,
        y: deltaY * 0.008
      };

      prevMouse.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    window.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("mouseleave", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    /* ── Animation Loop ── */
    let animId: number;
    const startTime = performance.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const elapsed = (performance.now() - startTime) / 1000;
      const sysSpeed = speedRef.current;
      const colorMode = colorModeRef.current;

      // LUXE-ANIM-1: Drag-to-rotate hologram group with inertia damping
      if (!isDragging.current) {
        dragVelocity.current.x *= 0.95;
        dragVelocity.current.y *= 0.95;
        hologramGroup.rotation.y += dragVelocity.current.x;
        hologramGroup.rotation.x += dragVelocity.current.y;
      }
      hologramGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, hologramGroup.rotation.x));

      // LUXE-ANIM-2: Cinematic shatter-reform intro with session guard and click-to-skip
      const now = performance.now();
      const onLoadAge = now - startTime;

      let explosionForce = 0;
      if (!introFinished) {
        if (onLoadAge < 3500) {
          // Fade in the scene: renderer alpha from 0 to 1 over 0.3s
          renderer.setClearAlpha(Math.min(onLoadAge / 300, 1.0));

          // Camera zoom
          const t = Math.min(onLoadAge / 3500, 1.0);
          const easeZoom = 1 - Math.pow(1 - t, 3); // cubicEaseOut
          camera.position.z = 18 - easeZoom * 10.5;

          if (onLoadAge < 1200) {
            // Phase 1 - Shatter (0.0s to 1.2s)
            const progress = onLoadAge / 1200;
            explosionForce = progress; // Math.min(elapsed / 1.2, 1.0)
            const easeScale = 1 - Math.pow(1 - progress, 3); // cubicEaseOut
            const groupScale = 1.0 + easeScale * 1.8; // scale from 1.0 to 2.8
            hologramGroup.scale.setScalar(groupScale);
          } else {
            // Phase 2 - Reform (1.2s to 3.5s)
            const progress = (onLoadAge - 1200) / 2300;
            const easeProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2; // cubicEaseInOut
            explosionForce = 1.0 - easeProgress; // Reverse explosionForce from 1.0 back to 0
            const groupScale = 1.0 + explosionForce * 1.8;
            hologramGroup.scale.setScalar(groupScale);
          }
        } else {
          introFinished = true;
          sessionStorage.setItem('luxe_intro_played', 'true');
          setIntroComplete(true);
          camera.position.z = 7.5;
          hologramGroup.scale.set(1.0, 1.0, 1.0);
          canvas.removeEventListener("click", handleSkipClick);
        }
      } else {
        camera.position.z = 7.5;
        hologramGroup.scale.set(1.0, 1.0, 1.0);
      }

      // Handle active color updates dynamically
      const targetColor = COLORS[colorMode as keyof typeof COLORS] || COLORS.cyan;
      torusKnotMat.color.lerp(targetColor, 0.05);
      laserMat.color.lerp(targetColor, 0.05);
      particleMat.color.lerp(targetColor, 0.05);
      cyanLight.color.lerp(targetColor, 0.05);
      glowCageMat.color.lerp(targetColor, 0.05);
      outerCageMat.color.lerp(targetColor, 0.05);
      coreLight.color.lerp(targetColor, 0.05);
      ctaTorusMat.color.lerp(targetColor, 0.05);
      trailMat.color.lerp(targetColor, 0.05);

      if (maleModel) {
        maleModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.color) {
              // Keep base color white so clothing textures render with natural colors
              mat.color.setHex(0xffffff);
            }
          }
        });
      }

      // Core rotation
      torusKnotMesh.rotation.y = elapsed * 0.25 * sysSpeed;
      torusKnotMesh.rotation.x = elapsed * 0.15 * sysSpeed;
      if (maleModel) {
        maleModel.rotation.y = elapsed * 0.25 * sysSpeed;
        maleModel.rotation.x = Math.sin(elapsed * 0.5) * 0.05;
      }
      outerCage.rotation.y = -elapsed * 0.1 * sysSpeed;
      outerCage.rotation.z = elapsed * 0.05 * sysSpeed;
      glowCage.rotation.y = outerCage.rotation.y;
      glowCage.rotation.z = outerCage.rotation.z;

      // LUXE-FIX B: 3D torus ring pulsing animation
      ctaTorusMesh.scale.setScalar(0.98 + Math.sin(elapsed * 1.5) * 0.02);

      // Laser scanner sweeping
      laserRing1.position.y = Math.sin(elapsed * 1.5) * 2.2;
      laserRing2.position.y = Math.cos(elapsed * 1.5) * 2.2;
      laserGroup.rotation.y = elapsed * 0.15;

      // Particles Vortex movement
      const positions = particleGeo.attributes.position.array as Float32Array;
      const trailPositionsArray = trailGeo.attributes.position.array as Float32Array;

      // LUXE-ANIM-3: Particle motion trails using lagged position buffer
      trailPositionsArray.set(lagPositions);
      trailGeo.attributes.position.needsUpdate = true;

      // During shatter phase: boost trailSystem opacity to 0.4 and size to 1.2 for dramatic warp effect
      if (explosionForce > 0.05) {
        trailMat.opacity = 0.4;
        trailMat.size = 1.2;
      } else {
        trailMat.opacity = 0.15;
        trailMat.size = 0.6;
      }

      const isManualExploding = now - explosionTriggerRef.current < 1200;
      const manualExplosionProgress = (now - explosionTriggerRef.current) / 1200;
      let manualForce = 0;
      if (isManualExploding) {
        manualForce = Math.sin(manualExplosionProgress * Math.PI) * 2.8;
      }

      const activeExplosionForce = explosionForce + (manualForce > 0 ? manualForce / 2.8 : 0);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleAngles[i] += particleSpeeds[i] * sysSpeed;
        
        let currentRadius = particleRadii[i];
        
        // Add subtle wave fluctuation
        currentRadius += Math.sin(elapsed * 2 + particleY[i]) * 0.08;

        const orbitX = Math.cos(particleAngles[i]) * currentRadius;
        const orbitY = particleY[i] + Math.cos(elapsed + particleAngles[i]) * 0.1;
        const orbitZ = particleZ[i];

        positions[i * 3] = orbitX * (1.0 + activeExplosionForce * 4.0);
        positions[i * 3 + 1] = orbitY * (1.0 + activeExplosionForce * 4.0);
        positions[i * 3 + 2] = orbitZ * (1.0 + activeExplosionForce * 4.0);
      }
      particleGeo.attributes.position.needsUpdate = true;

      lagPositions.set(positions);

      // Smooth camera lerp parallax
      targetCameraX += (mouseX * 2.2 - targetCameraX) * 0.035;
      targetCameraY += (mouseY * 1.4 - targetCameraY) * 0.035;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    // LUXE-FIX [1]: IntersectionObserver on canvas element to pause loop out of view
    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!animFrameIdRef.current) {
            animFrameIdRef.current = requestAnimationFrame(loop);
          }
        } else {
          if (animFrameIdRef.current) {
            cancelAnimationFrame(animFrameIdRef.current);
            animFrameIdRef.current = 0;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    /* ── Resize handler ── */
    const onResize = () => {
      if (!canvas) return;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      observer.disconnect();
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("mouseleave", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      canvas.removeEventListener("click", handleSkipClick);
      window.removeEventListener("resize", onResize);

      renderer.dispose();
      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      outerDodecahedronGeo.dispose();
      outerCageMat.dispose();
      glowCageMat.dispose();
      laserRingGeo.dispose();
      laserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ctaTorusGeo.dispose();
      ctaTorusMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();

      if (maleModel) {
        maleModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  // Handler to adjust speed
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spd = parseFloat(e.target.value);
    speedRef.current = spd;
    setCurrentSpeed(spd);
    addLog(`COMPILER VELOCITY MODIFIED: ${spd.toFixed(1)}x`);
  };

  // LUXE-FIX [2]: Toggle mute state and update speaker icons
  const handleMuteToggle = () => {
    isMutedRef.current = !isMutedRef.current;
    if (isMutedRef.current) {
      if (muteIconRef.current) muteIconRef.current.style.display = "block";
      if (unmuteIconRef.current) unmuteIconRef.current.style.display = "none";
      addLog("AUDIO OUTPUT DEACTIVATED");
    } else {
      if (muteIconRef.current) muteIconRef.current.style.display = "none";
      if (unmuteIconRef.current) unmuteIconRef.current.style.display = "block";
      addLog("AUDIO OUTPUT ACTIVATED // 440Hz SYNTH");
    }
  };

  // Handler to swap color protocols
  const selectColorProtocol = (mode: string) => {
    colorModeRef.current = mode;
    setActiveColor(mode);
    addLog(`COLORWAY MATRIX CONFIGURED: ${mode.toUpperCase()} EMBERS`);
  };

  // Handler to synthesize and morph structure
  const synthesizeGeometry = (geom: string) => {
    geometryTypeRef.current = geom;
    setActiveGeometry(geom);
    explosionTriggerRef.current = performance.now();
    
    let label = "Knit";
    if (geom === "spherical") label = "Linen";
    if (geom === "hyperbolic") label = "Cotton";
    addLog(`THREAD ARCHITECTURE RE-COMPILED -> ${label.toUpperCase()} WEAVE`);

    if (setGeometryRef.current) {
      setGeometryRef.current(geom);
    }
    
    // Play synthesis audio beep feedback in browser if supported
    if (typeof window !== "undefined" && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        // LUXE-FIX [2]: Default to gain = 0 when muted, else 0.08
        const volume = isMutedRef.current ? 0 : 0.08;
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (err) {}
    }
  };

  const scrollToHero = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030305] z-30 select-none">
      {/* Three.js Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Futuristic Scanner Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,242,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] z-10" />

      {/* Floating Holographic Interface Panels (HUD) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8 pointer-events-none mt-[80px]">
        
        {/* Top telemetry and status stats row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
          {/* Left Panel: Telemetry HUD */}
          {/* LUXE-ANIM-4: HUD fade-in sync with intro animation */}
          <div 
            className={`glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col gap-3 max-w-[252px] w-full transition-all duration-[800ms] ease-in-out pointer-events-none ${
              introComplete 
                ? "opacity-70 hover:opacity-100 hover:pointer-events-auto hover:duration-300" 
                : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/10">
              <Cpu size={14} className="text-[#00f2ff] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">LUXE OS // NEURAL TAILOR</span>
            </div>
            
            <div className="flex flex-col gap-1.5 font-mono text-[8.5px] text-white/90 tracking-wider">
              <div className="flex justify-between">
                <span>WEAVE INTEGRITY:</span>
                <span className="text-[#00f2ff] font-bold animate-pulse">OPTIMAL // 100%</span>
              </div>
              <div className="flex justify-between">
                <span>FABRIC CORE TEMP:</span>
                <span className="text-[#00f2ff] font-bold">BREATHABLE // 28°C</span>
              </div>
              <div className="flex justify-between">
                <span>THREAD COUNT:</span>
                <span className="text-[#00f2ff] font-bold">800 TC // SHIFT</span>
              </div>
              <div className="flex justify-between">
                <span>COD TRANSACTIONS:</span>
                <span className="text-[#00f2ff] font-bold">100% SECURE</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Active Calibration logs */}
          {/* LUXE-ANIM-4: HUD fade-in sync with intro animation */}
          <div 
            className={`glass bg-[#050508]/85 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col gap-3 max-w-[252px] w-full transition-all duration-[800ms] ease-in-out pointer-events-none ${
              introComplete 
                ? "opacity-70 hover:opacity-100 hover:pointer-events-auto hover:duration-300" 
                : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Terminal size={14} className="text-[#c9a84c]" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-white font-bold">WEAVE SYNTHESIS LOG</span>
              </div>
              {/* LUXE-FIX [2]: Audio mute/unmute toggle speaker button */}
              <button
                onClick={handleMuteToggle}
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 focus:outline-none flex items-center justify-center"
                title="Toggle Sound"
              >
                <div ref={unmuteIconRef} style={{ display: "none" }}><Volume2 size={12} className="text-[#00f2ff]" /></div>
                <div ref={muteIconRef} style={{ display: "block" }}><VolumeX size={12} className="text-white/40" /></div>
              </button>
            </div>
            <div className="flex flex-col gap-1 font-mono text-[8px] text-[#00f2ff] tracking-wide text-left h-[50px] overflow-hidden leading-relaxed">
              {logMessages.map((log, index) => (
                <div key={index} className="truncate">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Interactive Core Controls Panel */}
        {/* LUXE-FIX [3]: Change panel background to bg-[#050508]/85 and adjust label/readout contrast */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none select-none max-w-[320px] md:max-w-md w-full">
          {controlsOpen ? (
            <div className="relative pointer-events-auto flex flex-col gap-6 w-full p-6 bg-[#050508]/85 border border-white/5 backdrop-blur-md rounded-[32px] shadow-2xl transition-all duration-300 transform scale-100 opacity-100">
              {/* Glass panel border brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00f2ff]/60" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00f2ff]/60" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00f2ff]/60" />

              {/* Header Row with Title and CLOSE button */}
              <div className="flex justify-between items-center w-full pb-4 border-b border-white/10 relative">
                <div className="text-left">
                  <span className="text-[8px] font-mono tracking-[0.45em] text-white/70 uppercase block mb-0.5">STYLE DECK</span>
                  <h2 className="font-cormorant text-lg text-white uppercase tracking-wider font-bold">
                    THE FABRIC NEXUS
                  </h2>
                </div>
                <button 
                  onClick={() => setControlsOpen(false)}
                  className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00f2ff]/60 bg-[#050508]/90 text-[#00f2ff] text-[9px] font-mono uppercase tracking-wider hover:bg-[#00f2ff] hover:text-[#050508] hover:shadow-[0_0_15px_#00f2ff] transition-all duration-200 cursor-pointer"
                  title="Close Control Deck"
                >
                  <X size={12} />
                  <span>CLOSE</span>
                </button>
              </div>

              {/* Slider Control */}
              {/* LUXE-FIX D: Custom sci-fi slider styling */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[9px] text-white/90 tracking-wider">
                  <span>DESIGN FRAME ROTATION</span>
                  <span className="text-[#00f2ff] font-bold">{currentSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={currentSpeed}
                  onChange={handleSpeedChange}
                  className="w-full luxe-slider cursor-pointer focus:outline-none"
                />
              </div>

              {/* Color protocols triggers */}
              {/* LUXE-FIX E: Colorway + textile button active/inactive states */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">DESIGN COLORWAY PROTOCOL</span>
                <div className="flex gap-2">
                  {[
                    { id: "cyan", label: "ONYX_NEON" },
                    { id: "gold", label: "CHAMPAGNE_GOLD" },
                    { id: "burgundy", label: "ROYAL_BURGUNDY" },
                  ].map((proto) => (
                    <button
                      key={proto.id}
                      onClick={() => selectColorProtocol(proto.id)}
                      className={`flex-1 py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider transition-all duration-200 ease-in-out cursor-pointer ${
                        activeColor === proto.id
                          ? "bg-[rgba(0,242,255,0.1)] border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                          : "border border-[rgba(0,242,255,0.25)] bg-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {proto.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Geometry compiler */}
              {/* LUXE-FIX E: Colorway + textile button active/inactive states */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.3em] block text-left">ACTIVE TEXTILE FILAMENT</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tesseract", label: "Oversized Knit" },
                    { id: "spherical", label: "Luxury Linen" },
                    { id: "hyperbolic", label: "Supima Cotton" },
                  ].map((geom) => (
                    <button
                      key={geom.id}
                      onClick={() => synthesizeGeometry(geom.id)}
                      className={`py-2 rounded-xl text-[7.5px] font-mono uppercase tracking-wider transition-all duration-200 ease-in-out cursor-pointer ${
                        activeGeometry === geom.id
                          ? "bg-[rgba(0,242,255,0.1)] border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                          : "border border-[rgba(0,242,255,0.25)] bg-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {geom.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <button
              onClick={() => setControlsOpen(true)}
              className="pointer-events-auto px-6 py-3 rounded-full border border-[#00f2ff]/60 bg-[#050508]/90 text-[#00f2ff] font-mono text-[10px] tracking-[0.25em] uppercase hover:border-[#00f2ff] hover:bg-[#00f2ff] hover:text-[#050508] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-2xl"
            >
              <Sliders size={14} className="text-[#00f2ff] animate-pulse" />
              Open Control Deck
            </button>
          )}
        </div>

        {/* Scroll helper overlays */}
        {/* LUXE-FIX H: Bottom status bar legibility */}
        <div className="flex justify-between items-end w-full relative z-20">
          <div className="font-mono text-[9px] text-white/60 uppercase tracking-[0.3em] pointer-events-auto">
            DELIVERY COORD: <span className="text-[#00f2ff]">HYDERABAD // IN</span>
          </div>

          {/* Interactive descend CTA */}
          {/* LUXE-ANIM-4: HUD fade-in sync with intro animation */}
          <button 
            onClick={scrollToHero}
            className={`flex flex-col items-center gap-2 text-center cursor-pointer group bg-transparent border-none outline-none transition-all duration-[1200ms] ease-in-out ${
              introComplete ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="text-[9px] font-mono text-white/60 tracking-[0.45em] uppercase group-hover:text-white group-hover:tracking-[0.55em] transition-all">
              Initialize Wardrobe
            </span>
          </button>

          <div className="font-mono text-[9px] text-white/60 uppercase tracking-[0.3em] pointer-events-auto">
            FIT MATRIX: <span className="text-[#c9a84c]">STABLE</span>
          </div>
        </div>

      </div>

      {/* LUXE-FIX H: Bottom status bar gradient background */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
