"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "react-three-fiber" /* Wait, we import THREE from "three" directly. Let's correct this. */;
import * as THREE_CORE from "three";

// Custom procedural weave bump map texture generator for premium fabric feeling
const createWeaveBumpMap = () => {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Base height representation (mid-gray)
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 64, 64);
  
  // High-frequency weave lines
  ctx.fillStyle = "#9a9a9a";
  for (let y = 0; y < 64; y += 4) {
    ctx.fillRect(0, y, 64, 1);
  }
  for (let x = 0; x < 64; x += 4) {
    ctx.fillRect(x, 0, 1, 64);
  }
  
  // Fine diagonal cross-stitch details
  ctx.fillStyle = "#606060";
  for (let i = 0; i < 64; i += 2) {
    ctx.fillRect(i, i, 1, 1);
    ctx.fillRect(62 - i, i, 1, 1);
  }
  
  const texture = new THREE_CORE.CanvasTexture(canvas);
  texture.wrapS = THREE_CORE.RepeatWrapping;
  texture.wrapT = THREE_CORE.RepeatWrapping;
  texture.repeat.set(45, 45);
  return texture;
};

// Displace vertices on cylinder/sphere to simulate organic cloth folds
const displaceVerticesForCloth = (geo: THREE_CORE.BufferGeometry, type: string) => {
  const pos = geo.attributes.position as THREE_CORE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const angle = Math.atan2(z, x);
    const r = Math.sqrt(x * x + z * z);

    let displace = 0;
    // Multi-frequency wave combinations for natural tailoring folds
    displace += Math.sin(y * 5.8 + angle * 3.0) * 0.045;
    displace += Math.cos(y * 12.0 - angle * 2.0) * 0.015;
    displace += Math.sin(angle * 7.0) * 0.007;

    if (type === "hoodie") {
      displace += Math.sin(y * 3.2) * 0.065; // baggy volume
    } else if (type === "blazer") {
      displace *= 0.45; // structured stiffer fabric
    } else if (type === "oversized") {
      displace += Math.sin(y * 2.5) * 0.12; // heavy cocoon flare
    } else if (type === "cargo") {
      displace += Math.cos(y * 4.8) * 0.025; // utilitarian heavy drape
    }

    pos.setX(i, Math.cos(angle) * (r + displace));
    pos.setZ(i, Math.sin(angle) * (r + displace));
  }
  geo.computeVertexNormals();
};

// Procedural 3D Garment Generator for Luxury Showroom
const createGarment = (type: string, baseColor: THREE_CORE.Color, bumpMap: THREE_CORE.Texture | null) => {
  const group = new THREE_CORE.Group();

  // Premium fabric material catching rim light and gold highlight
  const fabricMat = new THREE_CORE.MeshPhysicalMaterial({
    color: baseColor,
    roughness: 0.6,
    metalness: 0.15,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    sheen: 1.0,
    sheenRoughness: 0.3,
    sheenColor: new THREE_CORE.Color(0x00f2ff),
    bumpMap: bumpMap || undefined,
    bumpScale: 0.003,
    side: THREE_CORE.DoubleSide,
  });

  // Satin luxury inner lining
  const liningMat = new THREE_CORE.MeshStandardMaterial({
    color: new THREE_CORE.Color(0x08080c),
    roughness: 0.22,
    metalness: 0.88,
    side: THREE_CORE.BackSide,
  });

  // Polished gold details (buttons, zips, trim)
  const trimMat = new THREE_CORE.MeshStandardMaterial({
    color: new THREE_CORE.Color(0xc9a84c),
    roughness: 0.12,
    metalness: 0.95,
  });

  // Helper to clone and store original positions for dynamic simulation
  const storeOrigPositions = (mesh: THREE_CORE.Mesh) => {
    mesh.userData.origPositions = mesh.geometry.attributes.position.clone();
  };

  // Helper to add fine glowing stitching detailing (Layer 3)
  const addStitchLine = (points: THREE_CORE.Vector3[]) => {
    const geo = new THREE_CORE.BufferGeometry().setFromPoints(points);
    const mat = new THREE_CORE.LineBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.55,
      blending: THREE_CORE.AdditiveBlending,
    });
    const line = new THREE_CORE.Line(geo, mat);
    group.add(line);
  };

  if (type === "jacket") {
    // 1. Torso base with open front
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.7, 0.82, 1.8, 32, 24, true);
    displaceVerticesForCloth(torsoGeo, "jacket");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const liningGeo = torsoGeo.clone();
    liningGeo.scale(0.98, 0.98, 0.98);
    const lining = new THREE_CORE.Mesh(liningGeo, liningMat);
    group.add(lining);

    // 2. Sleeves
    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.24, 0.16, 1.35, 24, 16);
    displaceVerticesForCloth(sleeveGeo, "jacket");
    
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.85, 0.32, 0);
    leftSleeve.rotation.z = Math.PI / 5.5;
    leftSleeve.rotation.x = Math.PI / 10;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.85;
    rightSleeve.rotation.z = -Math.PI / 5.5;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

    // 3. Gold Lapel Torus Collar
    const collarGeo = new THREE_CORE.TorusGeometry(0.32, 0.08, 10, 30, Math.PI);
    const collar = new THREE_CORE.Mesh(collarGeo, trimMat);
    collar.position.set(0, 0.88, -0.06);
    collar.rotation.x = -Math.PI / 6;
    group.add(collar);

    // 4. Zipper Detailing
    const zipperGeo = new THREE_CORE.BoxGeometry(0.015, 1.62, 0.015);
    const zipper = new THREE_CORE.Mesh(zipperGeo, trimMat);
    zipper.position.set(0.04, 0.05, 0.73);
    group.add(zipper);

    // 5. Stitching outline down center seams
    addStitchLine([
      new THREE_CORE.Vector3(-0.02, -0.8, 0.74),
      new THREE_CORE.Vector3(-0.02, 0.8, 0.74),
    ]);
    addStitchLine([
      new THREE_CORE.Vector3(0.06, -0.8, 0.74),
      new THREE_CORE.Vector3(0.06, 0.8, 0.74),
    ]);

  } else if (type === "hoodie") {
    // Streetwear draped silhouette
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.68, 0.76, 1.6, 24, 24);
    displaceVerticesForCloth(torsoGeo, "hoodie");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.24, 0.17, 1.25, 16, 16);
    displaceVerticesForCloth(sleeveGeo, "hoodie");
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.82, 0.26, 0);
    leftSleeve.rotation.z = Math.PI / 5.0;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.82;
    rightSleeve.rotation.z = -Math.PI / 5.0;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

    // Cocooning hood shape
    const hoodGeo = new THREE_CORE.SphereGeometry(0.44, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.75);
    const posH = hoodGeo.attributes.position;
    for (let i = 0; i < posH.count; i++) {
      const hz = posH.getZ(i);
      const hy = posH.getY(i);
      if (hz < 0) {
        posH.setY(i, hy * 0.82); // back drape
      }
    }
    hoodGeo.computeVertexNormals();
    const hood = new THREE_CORE.Mesh(hoodGeo, fabricMat);
    hood.position.set(0, 0.84, -0.08);
    hood.rotation.x = Math.PI / 10;
    group.add(hood);

    // Hem cuff stitching
    addStitchLine([
      new THREE_CORE.Vector3(-0.68, -0.76, 0.1),
      new THREE_CORE.Vector3(0.68, -0.76, 0.1),
    ]);

  } else if (type === "blazer") {
    // Sharp corporate structure
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.66, 0.74, 1.7, 24, 24, true);
    displaceVerticesForCloth(torsoGeo, "blazer");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const lapelGeo = new THREE_CORE.BoxGeometry(0.12, 1.15, 0.04);
    const leftLapel = new THREE_CORE.Mesh(lapelGeo, trimMat);
    leftLapel.position.set(-0.15, 0.36, 0.66);
    leftLapel.rotation.y = Math.PI / 6.5;
    leftLapel.rotation.z = -Math.PI / 12;
    group.add(leftLapel);

    const rightLapel = leftLapel.clone();
    rightLapel.position.x = 0.15;
    rightLapel.rotation.y = -Math.PI / 6.5;
    rightLapel.rotation.z = Math.PI / 12;
    group.add(rightLapel);

    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.21, 0.15, 1.32, 16, 12);
    displaceVerticesForCloth(sleeveGeo, "blazer");
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.78, 0.28, 0);
    leftSleeve.rotation.z = Math.PI / 6.8;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.78;
    rightSleeve.rotation.z = -Math.PI / 6.8;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

  } else if (type === "shirt") {
    // Crisp formal drape
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.58, 0.64, 1.55, 20, 20);
    displaceVerticesForCloth(torsoGeo, "shirt");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.18, 0.13, 1.3, 16, 16);
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.72, 0.22, 0);
    leftSleeve.rotation.z = Math.PI / 6;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.72;
    rightSleeve.rotation.z = -Math.PI / 6;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

    const collarGeo = new THREE_CORE.TorusGeometry(0.24, 0.045, 8, 24);
    const collar = new THREE_CORE.Mesh(collarGeo, trimMat);
    collar.position.set(0, 0.78, 0);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

  } else if (type === "cargo") {
    // Utilitarian structured jacket
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.68, 0.76, 1.7, 24, 24, true);
    displaceVerticesForCloth(torsoGeo, "cargo");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const liningGeo = torsoGeo.clone();
    liningGeo.scale(0.98, 0.98, 0.98);
    const lining = new THREE_CORE.Mesh(liningGeo, liningMat);
    group.add(lining);

    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.24, 0.18, 1.35, 16, 16);
    displaceVerticesForCloth(sleeveGeo, "cargo");
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.82, 0.28, 0);
    leftSleeve.rotation.z = Math.PI / 5.5;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.82;
    rightSleeve.rotation.z = -Math.PI / 5.5;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

    // Cargo pocket boxes
    const pocketGeo = new THREE_CORE.BoxGeometry(0.25, 0.35, 0.08);
    
    const p1 = new THREE_CORE.Mesh(pocketGeo, fabricMat);
    p1.position.set(-0.25, 0.2, 0.68);
    p1.rotation.y = 0.15;
    group.add(p1);

    const p2 = p1.clone();
    p2.position.set(0.25, 0.2, 0.68);
    p2.rotation.y = -0.15;
    group.add(p2);

    const p3 = p1.clone();
    p3.position.set(-0.3, -0.4, 0.72);
    p3.scale.set(1.2, 1.2, 1.0);
    group.add(p3);

    const p4 = p3.clone();
    p4.position.set(0.3, -0.4, 0.72);
    p4.rotation.y = -0.15;
    group.add(p4);

    // Tactical straps (trimMat)
    const strapGeo = new THREE_CORE.BoxGeometry(0.18, 0.02, 0.02);
    const strapL = new THREE_CORE.Mesh(strapGeo, trimMat);
    strapL.position.set(-0.55, -0.1, 0.5);
    strapL.rotation.y = 0.5;
    group.add(strapL);

    const strapR = strapL.clone();
    strapR.position.x = 0.5;
    strapR.rotation.y = -0.5;
    group.add(strapR);

  } else if (type === "oversized") {
    // Exaggerated cocoon silhouette
    const torsoGeo = new THREE_CORE.CylinderGeometry(0.55, 1.15, 1.8, 32, 24, true);
    displaceVerticesForCloth(torsoGeo, "oversized");
    const torso = new THREE_CORE.Mesh(torsoGeo, fabricMat);
    storeOrigPositions(torso);
    group.add(torso);

    const liningGeo = torsoGeo.clone();
    liningGeo.scale(0.98, 0.98, 0.98);
    const lining = new THREE_CORE.Mesh(liningGeo, liningMat);
    group.add(lining);

    const sleeveGeo = new THREE_CORE.CylinderGeometry(0.26, 0.38, 1.25, 20, 16);
    displaceVerticesForCloth(sleeveGeo, "oversized");
    const leftSleeve = new THREE_CORE.Mesh(sleeveGeo, fabricMat);
    leftSleeve.position.set(-0.85, 0.2, 0);
    leftSleeve.rotation.z = Math.PI / 4.8;
    storeOrigPositions(leftSleeve);
    group.add(leftSleeve);

    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x = 0.85;
    rightSleeve.rotation.z = -Math.PI / 4.8;
    storeOrigPositions(rightSleeve);
    group.add(rightSleeve);

    const cowlGeo = new THREE_CORE.TorusGeometry(0.35, 0.14, 8, 24);
    const cowl = new THREE_CORE.Mesh(cowlGeo, fabricMat);
    cowl.position.set(0, 0.86, -0.05);
    cowl.rotation.x = Math.PI / 2.3;
    group.add(cowl);
  }

  return group;
};

export default function SciFiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Pointer interaction state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const dragProgress = useRef(0); // For smooth dynamic focal zoom on interaction

  // Session guard to ensure intro only plays once per browser session
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("luxe_intro_played");
    }
    return false;
  });

  const scrollToHero = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE_CORE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 1); // Pitch black background

    const scene = new THREE_CORE.Scene();
    scene.fog = new THREE_CORE.FogExp2(0x000000, 0.08); // Mist fading into void

    const camera = new THREE_CORE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    /* ── Custom Color Palette ── */
    const COLORS = {
      cyan: new THREE_CORE.Color(0x00f2ff),
      gold: new THREE_CORE.Color(0xc9a84c),
      burgundy: new THREE_CORE.Color(0x6b1e3c),
      white: new THREE_CORE.Color(0xf0ede8),
      black: new THREE_CORE.Color(0x0b0b0f),
      purple: new THREE_CORE.Color(0x3c1e6b),
    };

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    /* ── Environment & Showroom Geometry (Mega-Scale) ── */
    const environmentGroup = new THREE_CORE.Group();
    scene.add(environmentGroup);

    // 1. Colossal Outer Neon Ring
    const colossalRingGeo1 = new THREE_CORE.TorusGeometry(8.2, 0.04, 16, 120);
    const colossalRingMat1 = new THREE_CORE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.14,
      blending: THREE_CORE.AdditiveBlending,
    });
    const outerRing1 = new THREE_CORE.Mesh(colossalRingGeo1, colossalRingMat1);
    outerRing1.rotation.x = Math.PI / 2.1;
    environmentGroup.add(outerRing1);

    // 2. Colossal Inner Gold Ring
    const colossalRingGeo2 = new THREE_CORE.TorusGeometry(12.0, 0.02, 8, 80);
    const colossalRingMat2 = new THREE_CORE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.08,
      blending: THREE_CORE.AdditiveBlending,
    });
    const outerRing2 = new THREE_CORE.Mesh(colossalRingGeo2, colossalRingMat2);
    outerRing2.rotation.y = Math.PI / 3;
    outerRing2.rotation.x = Math.PI / 4;
    environmentGroup.add(outerRing2);

    // 3. Metallic showroom base floor
    const showroomFloorGeo = new THREE_CORE.CylinderGeometry(5.2, 5.4, 0.15, 64);
    const showroomFloorMat = new THREE_CORE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.15,
      metalness: 0.95,
      transparent: true,
      opacity: 0.8,
    });
    const floor = new THREE_CORE.Mesh(showroomFloorGeo, showroomFloorMat);
    floor.position.y = -3.2;
    environmentGroup.add(floor);

    // 4. Vertical Architectural Columns of Light
    const columnCount = 6;
    const columnsGroup = new THREE_CORE.Group();
    const columnGeo = new THREE_CORE.CylinderGeometry(0.015, 0.015, 8, 8, 1, true);
    const columnMat = new THREE_CORE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.05,
      blending: THREE_CORE.AdditiveBlending,
    });
    for (let i = 0; i < columnCount; i++) {
      const colAngle = (i * Math.PI * 2) / columnCount;
      const colMesh = new THREE_CORE.Mesh(columnGeo, columnMat);
      colMesh.position.set(Math.cos(colAngle) * 6.5, 0, Math.sin(colAngle) * 6.5);
      columnsGroup.add(colMesh);
    }
    environmentGroup.add(columnsGroup);

    /* ── Anti-Gravity Wardrobe Chamber ── */
    const hologramGroup = new THREE_CORE.Group();
    scene.add(hologramGroup);

    const bumpMap = createWeaveBumpMap();

    // 1. Center stage primary main suspended jacket
    const mainJacket = createGarment("jacket", COLORS.black, bumpMap);
    mainJacket.visible = false;
    hologramGroup.add(mainJacket);

    // 2. Multi-Garment Ecosystem Orbit System
    const orbitGarments: THREE_CORE.Group[] = [];
    
    // Scale particles adaptive
    const PARTICLE_COUNT = isMobile ? 120 : isTablet ? 250 : 420;

    if (!isMobile) {
      // 2. Hoodie
      const hoodie = createGarment("hoodie", COLORS.white, bumpMap);
      hoodie.scale.setScalar(0.48);
      hoodie.visible = false;
      hologramGroup.add(hoodie);
      orbitGarments.push(hoodie);

      // 3. Blazer
      const blazer = createGarment("blazer", COLORS.burgundy, bumpMap);
      blazer.scale.setScalar(0.48);
      blazer.visible = false;
      hologramGroup.add(blazer);
      orbitGarments.push(blazer);

      if (!isTablet) {
        // 4. Premium Shirt
        const shirt = createGarment("shirt", COLORS.gold, bumpMap);
        shirt.scale.setScalar(0.48);
        shirt.visible = false;
        hologramGroup.add(shirt);
        orbitGarments.push(shirt);

        // 5. Cargo Jacket
        const cargo = createGarment("cargo", COLORS.cyan, bumpMap);
        cargo.scale.setScalar(0.48);
        cargo.visible = false;
        hologramGroup.add(cargo);
        orbitGarments.push(cargo);

        // 6. Oversized Piece
        const oversized = createGarment("oversized", COLORS.purple, bumpMap);
        oversized.scale.setScalar(0.48);
        oversized.visible = false;
        hologramGroup.add(oversized);
        orbitGarments.push(oversized);
      }
    }

    // 3. Anti-gravity chamber inner rings
    const rings = new THREE_CORE.Group();
    rings.visible = false;
    
    const ringGeo1 = new THREE_CORE.TorusGeometry(2.5, 0.008, 8, 90);
    const ringMat1 = new THREE_CORE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.25,
      blending: THREE_CORE.AdditiveBlending,
    });
    const ring1 = new THREE_CORE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.2;
    rings.add(ring1);

    const ringGeo2 = new THREE_CORE.TorusGeometry(1.9, 0.005, 8, 80);
    const ringMat2 = new THREE_CORE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.15,
      blending: THREE_CORE.AdditiveBlending,
    });
    const ring2 = new THREE_CORE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.2;
    ring2.position.y = 0.45;
    rings.add(ring2);
    hologramGroup.add(rings);

    // 4. Intro Single Thread Setup (Phase 1)
    const singleThreadPoints: THREE_CORE.Vector3[] = [];
    for (let i = 0; i < 50; i++) {
      singleThreadPoints.push(new THREE_CORE.Vector3(0, (i / 49 - 0.5) * 3, 0));
    }
    const singleThreadGeo = new THREE_CORE.BufferGeometry().setFromPoints(singleThreadPoints);
    const singleThreadMat = new THREE_CORE.LineBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.9,
    });
    const singleThread = new THREE_CORE.Line(singleThreadGeo, singleThreadMat);
    hologramGroup.add(singleThread);

    // 5. Weaving threads swarms (Phase 2 & 3 & 4)
    const threadCount = isMobile ? 120 : isTablet ? 300 : 500;
    const threadGroup = new THREE_CORE.Group();
    threadGroup.visible = false;
    for (let i = 0; i < threadCount; i++) {
      const points = [];
      const radius = 1.2 + Math.random() * 2.2;
      const startAngle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.8;
      for (let j = 0; j < 6; j++) {
        const t = j / 5;
        const angle = startAngle + t * 2.5;
        const r = radius + Math.sin(t * Math.PI) * 0.3;
        points.push(new THREE_CORE.Vector3(
          Math.cos(angle) * r,
          height + t * 0.9,
          Math.sin(angle) * r
        ));
      }
      const curve = new THREE_CORE.CatmullRomCurve3(points);
      const threadGeo = new THREE_CORE.BufferGeometry().setFromPoints(curve.getPoints(16));
      const threadMat = new THREE_CORE.LineBasicMaterial({
        color: Math.random() > 0.55 ? COLORS.cyan : COLORS.gold,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.28,
        blending: THREE_CORE.AdditiveBlending,
      });
      const threadLine = new THREE_CORE.Line(threadGeo, threadMat);
      threadGroup.add(threadLine);
    }
    hologramGroup.add(threadGroup);

    // 6. Helix Energy Embroidery Trails (Layer 4 & 5)
    const ribbonCount = 2;
    const ribbons: THREE_CORE.Line[] = [];
    for (let r = 0; r < ribbonCount; r++) {
      const ribbonPoints = [];
      const ribbonHeight = 2.8;
      const ribbonTurns = 4.5;
      const ribbonSegs = 60;
      for (let i = 0; i < ribbonSegs; i++) {
        const t = i / (ribbonSegs - 1);
        const angle = t * Math.PI * 2 * ribbonTurns + (r * Math.PI);
        const radius = 1.05 + Math.sin(t * Math.PI) * 0.25;
        ribbonPoints.push(new THREE_CORE.Vector3(
          Math.cos(angle) * radius,
          (t - 0.5) * ribbonHeight,
          Math.sin(angle) * radius
        ));
      }
      const ribbonCurve = new THREE_CORE.CatmullRomCurve3(ribbonPoints);
      const ribbonGeo = new THREE_CORE.BufferGeometry().setFromPoints(ribbonCurve.getPoints(80));
      const ribbonMat = new THREE_CORE.LineBasicMaterial({
        color: r === 0 ? COLORS.gold : COLORS.cyan,
        transparent: true,
        opacity: 0.28,
        blending: THREE_CORE.AdditiveBlending,
      });
      const ribbonLine = new THREE_CORE.Line(ribbonGeo, ribbonMat);
      ribbonLine.visible = false;
      hologramGroup.add(ribbonLine);
      ribbons.push(ribbonLine);
    }

    // 7. Multi-Layer Particle System (Layer 1, 2, 3, 6)
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleAngles = new Float32Array(PARTICLE_COUNT);
    const particleRadii = new Float32Array(PARTICLE_COUNT);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particleY = new Float32Array(PARTICLE_COUNT);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 1.4 + Math.random() * 3.6;
      particleY[i] = (Math.random() - 0.5) * 6;
      particleSpeeds[i] = 0.003 + Math.random() * 0.007;

      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = particleY[i];
      particlePositions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];

      // Layer 6: Reflective fragments vs Layer 1: Luxury dust
      const isReflective = Math.random() > 0.65;
      if (isReflective) {
        particleColors[i * 3] = 0.9;
        particleColors[i * 3 + 1] = 0.96;
        particleColors[i * 3 + 2] = 1.0;
      } else {
        particleColors[i * 3] = 0.79;
        particleColors[i * 3 + 1] = 0.66;
        particleColors[i * 3 + 2] = 0.3;
      }
    }

    const particleGeo = new THREE_CORE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE_CORE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE_CORE.BufferAttribute(particleColors, 3));
    
    const particleMat = new THREE_CORE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE_CORE.AdditiveBlending,
    });
    const particleSystem = new THREE_CORE.Points(particleGeo, particleMat);
    hologramGroup.add(particleSystem);

    /* ── Cinematic Multi-Layer Lighting ── */
    const ambientLight = new THREE_CORE.AmbientLight(0xffffff, 0.06);
    scene.add(ambientLight);

    // Electric cyan rim highlights
    const cyanRimLight = new THREE_CORE.DirectionalLight(0x00f2ff, 4.5);
    cyanRimLight.position.set(-4, 3, -5);
    scene.add(cyanRimLight);

    // Chrome reflection lighting
    const chromeRefLight = new THREE_CORE.DirectionalLight(0xffffff, 2.8);
    chromeRefLight.position.set(4, 4, 5);
    scene.add(chromeRefLight);

    // Dynamic gold highlights
    const goldHighlightLight = new THREE_CORE.PointLight(0xc9a84c, 4.0, 15);
    goldHighlightLight.position.set(0, -3.5, 3.5);
    scene.add(goldHighlightLight);

    /* ── Camera & Interaction Controls ── */
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const hasIntroPlayed = !!sessionStorage.getItem("luxe_intro_played");
    let introFinished = hasIntroPlayed;

    if (hasIntroPlayed) {
      singleThread.visible = false;
      threadGroup.visible = false;
      mainJacket.visible = true;
      ribbons.forEach((r) => (r.visible = true));
      orbitGarments.forEach((g) => {
        g.visible = true;
        g.scale.setScalar(0.48);
      });
      rings.visible = true;
      camera.position.z = 7.8;
    }

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouse.current = { x: clientX, y: clientY };
      dragVelocity.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const isTouch = "touches" in e;
      if (isTouch && e.touches.length === 0) return;
      const clientX = isTouch ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = isTouch ? e.touches[0].clientY : (e as MouseEvent).clientY;

      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      if (!isDragging.current) return;

      const deltaX = clientX - prevMouse.current.x;
      const deltaY = clientY - prevMouse.current.y;

      hologramGroup.rotation.y += deltaX * 0.007;
      hologramGroup.rotation.x += deltaY * 0.007;

      dragVelocity.current = {
        x: deltaX * 0.007,
        y: deltaY * 0.007,
      };

      prevMouse.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    // Skip sequence on click
    const handleSkipClick = () => {
      if (!introFinished) {
        introFinished = true;
        sessionStorage.setItem("luxe_intro_played", "true");
        setIntroComplete(true);
        camera.position.z = 7.8;
        mainJacket.visible = true;
        mainJacket.scale.setScalar(1.0);
        orbitGarments.forEach((g) => {
          g.visible = true;
          g.scale.setScalar(0.48);
        });
        rings.visible = true;
        rings.scale.setScalar(1.0);
        ribbons.forEach((r) => (r.visible = true));
        threadGroup.visible = false;
        singleThread.visible = false;
        canvas.removeEventListener("click", handleSkipClick);
      }
    };

    if (!hasIntroPlayed) {
      canvas.addEventListener("click", handleSkipClick);
    }

    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("mouseleave", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    /* ── Cloth Animation Solver ── */
    const animateMeshVertices = (mesh: THREE_CORE.Mesh, garmentType: string, elapsed: number, transformActive: boolean) => {
      const orig = mesh.userData.origPositions as THREE_CORE.BufferAttribute;
      if (!orig) return;
      const pos = mesh.geometry.attributes.position as THREE_CORE.BufferAttribute;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const ox = orig.getX(i);
        const oy = orig.getY(i);
        const oz = orig.getZ(i);

        const angle = Math.atan2(oz, ox);
        const r = Math.sqrt(ox * ox + oz * oz);

        // 1. Natural breathing wave + low gravity wind ripple
        let wave = Math.sin(elapsed * 1.6 + oy * 5.0 + angle * 2.0) * 0.012;
        wave += Math.cos(elapsed * 3.0 - oy * 6.5) * 0.004;

        // 2. Cuff / Hem displacement
        if (oy < -0.3) {
          wave += Math.sin(elapsed * 1.1 + angle * 1.5) * 0.01;
        }

        // 3. Morph transform reaction
        let morph = 0;
        if (transformActive) {
          morph = Math.sin(elapsed * 2.4 + angle * 0.5) * 0.025 * (1.0 - Math.abs(oy));
        }

        const newR = r + wave + morph;
        pos.setX(i, Math.cos(angle) * newR);
        pos.setZ(i, Math.sin(angle) * newR);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    };

    /* ── Animation Loop ── */
    let animId: number;
    const startTime = performance.now();
    let lastRevealTime = 0;
    let revealActive = false;
    let revealGarmentIndex = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const elapsed = (performance.now() - startTime) / 1000;

      // 1. Inertia rotation damping when released
      if (!isDragging.current) {
        dragVelocity.current.x *= 0.95;
        dragVelocity.current.y *= 0.95;
        hologramGroup.rotation.y += dragVelocity.current.x;
        hologramGroup.rotation.x += dragVelocity.current.y;
      }
      // Clamping limits to vertical rotation to avoid tumbling upside down
      hologramGroup.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, hologramGroup.rotation.x));

      // 2. Cloth reveal state logic (Triggers subtle fold adjustments every 6s)
      if (elapsed - lastRevealTime > 6.0) {
        lastRevealTime = elapsed;
        revealActive = true;
        revealGarmentIndex = Math.floor(Math.random() * (orbitGarments.length + 1));
      }
      if (revealActive && elapsed - lastRevealTime > 2.5) {
        revealActive = false;
      }

      // 3. 7-Second Opening Film Timeline
      if (!introFinished) {
        const elapsedMs = performance.now() - startTime;
        if (elapsedMs < 1200) {
          // Phase 1: Pure darkness. Wavy glowing single thread (0.0s - 1.2s)
          singleThread.visible = true;
          threadGroup.visible = false;
          mainJacket.visible = false;
          rings.visible = false;

          const sArray = singleThreadGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < 50; i++) {
            const t = i / 49;
            sArray[i * 3] = Math.sin(elapsed * 15.0 + t * 6) * 0.45;
            sArray[i * 3 + 1] = (t - 0.5) * 3;
            sArray[i * 3 + 2] = Math.cos(elapsed * 12.0 + t * 4) * 0.25;
          }
          singleThreadGeo.attributes.position.needsUpdate = true;

        } else if (elapsedMs < 2500) {
          // Phase 2 & 3: Hundreds of energy threads emerge & swarm (1.2s - 2.5s)
          singleThread.visible = false;
          threadGroup.visible = true;
          threadGroup.rotation.y = elapsed * 3.5;
          threadGroup.scale.setScalar(1.5 + Math.sin(elapsed) * 0.2);

        } else if (elapsedMs < 3800) {
          // Phase 4: Weave luxury fabric (threads contract coordinates) (2.5s - 3.8s)
          threadGroup.visible = true;
          threadGroup.rotation.y = elapsed * 4.8;
          const progress = (elapsedMs - 2500) / 1300;
          const weaveScale = 1.2 - progress * 1.1; // contract directly into jacket center
          threadGroup.scale.setScalar(weaveScale);

        } else if (elapsedMs < 4800) {
          // Phase 5: Fabric forms garment (Jacket dissolves in) (3.8s - 4.8s)
          threadGroup.visible = false;
          mainJacket.visible = true;
          const progress = (elapsedMs - 3800) / 1000;
          mainJacket.scale.setScalar(progress);

        } else if (elapsedMs < 5600) {
          // Phase 6: Garments assemble + Rings activate (4.8s - 5.6s)
          mainJacket.visible = true;
          mainJacket.scale.setScalar(1.0);
          rings.visible = true;
          const progress = (elapsedMs - 4800) / 800;
          rings.scale.setScalar(progress);
          ribbons.forEach((r) => {
            r.visible = true;
            r.scale.setScalar(progress);
          });

        } else if (elapsedMs < 6800) {
          // Phase 7: Universe revealed (camera pulls back) (5.6s - 6.8s)
          mainJacket.visible = true;
          rings.visible = true;
          rings.scale.setScalar(1.0);
          
          const progress = (elapsedMs - 5600) / 1200;
          orbitGarments.forEach((g) => {
            g.visible = true;
            g.scale.setScalar(progress * 0.48);
          });
          camera.position.z = 4.8 + progress * 3.0; // Dynamic pull back

          if (!introComplete) {
            setIntroComplete(true);
          }

        } else {
          // Finalize intro state
          introFinished = true;
          sessionStorage.setItem("luxe_intro_played", "true");
          setIntroComplete(true);
          camera.position.z = 7.8;
          mainJacket.visible = true;
          mainJacket.scale.setScalar(1.0);
          orbitGarments.forEach((g) => {
            g.visible = true;
            g.scale.setScalar(0.48);
          });
          rings.visible = true;
          rings.scale.setScalar(1.0);
          ribbons.forEach((r) => (r.visible = true));
          threadGroup.visible = false;
          singleThread.visible = false;
          canvas.removeEventListener("click", handleSkipClick);
        }
      }

      // 4. Animate centerpiece jacket vertices for breathing & dynamic draping folds
      if (mainJacket.visible) {
        // Slow cinematic base rotation
        mainJacket.rotation.y = elapsed * 0.1;
        mainJacket.rotation.x = Math.sin(elapsed * 0.15) * 0.05;

        const transformJacket = revealActive && revealGarmentIndex === 0;
        mainJacket.children.forEach((child) => {
          if (child instanceof THREE_CORE.Mesh) {
            animateMeshVertices(child, "jacket", elapsed, transformJacket);
          }
        });
      }

      // 5. Multi-Garment Orbit System
      orbitGarments.forEach((g, idx) => {
        if (!g.visible) return;
        const angle = elapsed * 0.12 + (idx * Math.PI * 2) / orbitGarments.length;
        
        // Anti-gravity non-mechanical paths
        const rx = 3.6 + Math.sin(elapsed * 0.08 + idx) * 0.4;
        const rz = 3.6 + Math.cos(elapsed * 0.06 + idx) * 0.4;
        
        g.position.x = Math.sin(angle) * rx;
        g.position.z = Math.cos(angle * 2) * rz;
        g.position.y = Math.sin(angle * 1.5) * 0.6 + Math.cos(elapsed * 0.15 + idx) * 0.25;

        // Face the centerpiece elegantly with swaying tilt
        g.lookAt(0, g.position.y * 0.4, 0);
        g.rotation.z += Math.sin(elapsed * 0.25 + idx) * 0.06;

        // Apply vertex simulation to orbiting garments for realism
        const transformThis = revealActive && revealGarmentIndex === (idx + 1);
        g.children.forEach((child) => {
          if (child instanceof THREE_CORE.Mesh) {
            animateMeshVertices(child, "orbital", elapsed, transformThis);
          }
        });
      });

      // 6. Volumetric lighting and atmosphere rings slow movement
      if (rings.visible) {
        rings.rotation.y = -elapsed * 0.05;
        rings.rotation.x = Math.sin(elapsed * 0.08) * 0.03;
      }

      // Rotate mega-scale environmental constructs
      environmentGroup.rotation.y = -elapsed * 0.02;

      // Animate ribbons (Layer 4 & 5)
      ribbons.forEach((ribbon, rIdx) => {
        if (ribbon.visible) {
          ribbon.rotation.y = elapsed * 0.6 * (rIdx === 0 ? 1 : -1);
          ribbon.scale.y = 1.0 + Math.sin(elapsed * 1.2) * 0.04;
        }
      });

      // 7. Physics-Reactive Particle System (Layer 1, 2, 3, 6)
      const pPos = particleGeo.attributes.position.array as Float32Array;
      const mainPos = new THREE_CORE.Vector3(0, 0, 0);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Drift upwards
        particleY[i] += particleSpeeds[i];
        if (particleY[i] > 3.0) {
          particleY[i] = -3.0; // Wrap coordinates
        }
        particleAngles[i] += 0.003;
        
        const r = particleRadii[i] + Math.sin(elapsed * 0.3 + i) * 0.05;
        const curPx = Math.cos(particleAngles[i]) * r;
        const curPy = particleY[i];
        const curPz = Math.sin(particleAngles[i]) * r;

        const pVec = new THREE_CORE.Vector3(curPx, curPy, curPz);

        // Repulsion from centerpiece jacket
        const distMain = pVec.distanceTo(mainPos);
        if (distMain < 1.15) {
          const force = pVec.clone().sub(mainPos).normalize().multiplyScalar((1.15 - distMain) * 0.12);
          pVec.add(force);
        }

        // Repulsion from floating secondary garments
        orbitGarments.forEach((g) => {
          if (!g.visible) return;
          const distG = pVec.distanceTo(g.position);
          if (distG < 0.8) {
            const force = pVec.clone().sub(g.position).normalize().multiplyScalar((0.8 - distG) * 0.1);
            pVec.add(force);
          }
        });

        pPos[i * 3] = pVec.x;
        pPos[i * 3 + 1] = pVec.y;
        pPos[i * 3 + 2] = pVec.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // 8. Cinematic camera auto-drift & user-controlled focal zoom
      if (isDragging.current) {
        dragProgress.current += (1.0 - dragProgress.current) * 0.05; // inspect focus zoom
      } else {
        dragProgress.current += (0.0 - dragProgress.current) * 0.05; // drift return
      }

      targetCameraX += (mouseX * 1.5 - targetCameraX) * 0.03;
      targetCameraY += (mouseY * 1.0 - targetCameraY) * 0.03;

      const cameraDriftX = Math.sin(elapsed * 0.28) * 0.5;
      const cameraDriftY = Math.cos(elapsed * 0.22) * 0.3;
      const cameraDriftZ = 7.8 - dragProgress.current * 0.8; // zoom closer to inspect textures

      camera.position.x = targetCameraX + cameraDriftX;
      camera.position.y = targetCameraY + cameraDriftY;
      camera.position.z = cameraDriftZ;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

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
      singleThreadGeo.dispose();
      singleThreadMat.dispose();
      threadGroup.children.forEach((c) => {
        if (c instanceof THREE_CORE.Line) c.geometry.dispose();
      });
      ribbons.forEach((r) => r.geometry.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      colossalRingGeo1.dispose();
      colossalRingMat1.dispose();
      colossalRingGeo2.dispose();
      colossalRingMat2.dispose();
      showroomFloorGeo.dispose();
      showroomFloorMat.dispose();
      columnGeo.dispose();
      columnMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ambientLight.dispose();
      cyanRimLight.dispose();
      chromeRefLight.dispose();
      goldHighlightLight.dispose();
      if (bumpMap) bumpMap.dispose();
    };
  }, []);

  const animFrameIdRef = useRef<number>(0);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black z-30 select-none">
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Atmospheric dark vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/95 z-10" />

      {/* High-End Luxury Editorial Typography UI Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 pointer-events-none mt-[80px]">
        
        {/* Minimal Editorial Headers */}
        <div className="flex justify-between items-start w-full opacity-60">
          <div className="font-sora text-[9px] text-white/60 tracking-[0.4em] uppercase font-light">
            LUXE ATELIER // EDITION 01
          </div>
          <div className="font-sora text-[9px] text-[#c9a84c] tracking-[0.4em] uppercase font-bold">
            AUTUMN WINTER 2026
          </div>
        </div>

        {/* Centerpiece Text & CTAs (Fades in smoothly after intro sequence) */}
        <div className={`absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center max-w-lg w-full transition-all duration-[1400ms] ease-out pointer-events-none select-none ${
          introComplete ? "opacity-100 transform scale-100" : "opacity-0 transform scale-95"
        }`}>
          <div className="mb-4">
            <span className="text-[10px] font-sora tracking-[0.6em] text-[#c9a84c] uppercase block mb-1 font-semibold">THE ANTIGRAVITY CHAMBER</span>
            <h1 
              className="font-cormorant text-white uppercase"
              style={{
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                fontWeight: 300,
                letterSpacing: "0.25em",
                textShadow: "0 0 40px rgba(201,168,76,0.15)",
                lineHeight: 1.1
              }}
            >
              LUXE
            </h1>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent mx-auto mt-4" />
          </div>

          <p className="text-white/40 text-[11px] font-sora tracking-widest max-w-xs mb-10 leading-relaxed font-light">
            Interact with organic fabric dynamics in an impossible space.
          </p>

          {/* Luxury Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center pointer-events-auto px-6">
            <button 
              onClick={scrollToHero}
              className="w-full sm:w-auto px-9 py-3.5 bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#9a7b30] text-black font-sora text-[9.5px] font-bold tracking-[0.25em] uppercase rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(201,168,76,0.35)]"
            >
              Enter The Wardrobe
            </button>
            <button 
              onClick={() => router.push('/shop')}
              className="w-full sm:w-auto px-9 py-3.5 border border-[#c9a84c]/20 bg-black/55 backdrop-blur-md text-white font-sora text-[9.5px] font-semibold tracking-[0.25em] uppercase rounded-xl hover:border-[#c9a84c]/60 hover:text-[#c9a84c] hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-300 cursor-pointer"
            >
              Explore Collection
            </button>
            <button 
              onClick={() => router.push('/ai-style')}
              className="w-full sm:w-auto px-9 py-3.5 border border-white/5 bg-transparent text-white/30 font-sora text-[9.5px] font-semibold tracking-[0.25em] uppercase rounded-xl hover:bg-white/5 hover:text-white/80 transition-all duration-300 cursor-pointer"
            >
              AI Stylist
            </button>
          </div>
        </div>

        {/* Minimalist Bottom Borders */}
        <div className="flex justify-between items-end w-full relative z-20 opacity-60">
          <div className="font-sora text-[9px] text-white/60 uppercase tracking-[0.4em]">
            HYDERABAD, INDIA
          </div>
          <div className="font-sora text-[9px] text-white/60 uppercase tracking-[0.4em]">
            © 2026 LUXE COUTURE
          </div>
        </div>

      </div>
    </section>
  );
}
