"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function CinematicSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const exit = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => setGone(true), 1300);
  };

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("luxe-splash-shown")) {
      setGone(true);
      return;
    }
    sessionStorage.setItem("luxe-splash-shown", "1");

    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060605, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const CYAN = 0x00f2ff;

    /* ── Cyan wireframe sphere ── */
    const sGeo = new THREE.SphereGeometry(1.6, 28, 28);
    const sLineMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.75 });
    const sphere = new THREE.LineSegments(new THREE.WireframeGeometry(sGeo), sLineMat);
    scene.add(sphere);

    /* ── Fragment particles (shatter) ── */
    const sPos = sGeo.attributes.position as THREE.BufferAttribute;
    const FC = sPos.count;
    const origP = new Float32Array(FC * 3);
    const blastDir = new Float32Array(FC * 3);
    const fragP = new Float32Array(FC * 3);

    for (let i = 0; i < FC; i++) {
      const x = sPos.getX(i), y = sPos.getY(i), z = sPos.getZ(i);
      origP[i * 3] = x; origP[i * 3 + 1] = y; origP[i * 3 + 2] = z;
      fragP[i * 3] = x; fragP[i * 3 + 1] = y; fragP[i * 3 + 2] = z;
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      const mag = 5 + Math.random() * 10;
      blastDir[i * 3] = (x / len) * mag + (Math.random() - 0.5) * 4;
      blastDir[i * 3 + 1] = (y / len) * mag + (Math.random() - 0.5) * 4;
      blastDir[i * 3 + 2] = (z / len) * mag + (Math.random() - 0.5) * 4;
    }

    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute("position", new THREE.BufferAttribute(fragP, 3));
    const fMat = new THREE.PointsMaterial({ color: CYAN, size: 0.07, transparent: true, opacity: 0 });
    scene.add(new THREE.Points(fGeo, fMat));

    /* ── Concentric orbiting rings ── */
    const rings: any[] = [];
    ([
      [2.6, 0.003, Math.PI / 3, 0, 0.38],
      [3.2, 0.002, -Math.PI / 5, Math.PI / 4, -0.22],
      [3.8, 0.002, Math.PI / 7, Math.PI / 2, 0.15],
      [4.4, 0.0015, -Math.PI / 3, Math.PI / 6, -0.09],
    ] as [number, number, number, number, number][]).forEach(([r, t, rx, rz, spd]) => {
      const rg = new THREE.TorusGeometry(r, t, 2, 200);
      const rl = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.28 });
      const ring = new THREE.LineSegments(new THREE.WireframeGeometry(rg), rl) as any;
      ring.rotation.x = rx;
      ring.rotation.z = rz;
      ring.userData.spd = spd;
      ring.visible = false;
      scene.add(ring);
      rings.push(ring);
    });

    /* ── Background cyan dust ── */
    const BGCT = 700;
    const bgP = new Float32Array(BGCT * 3);
    const bgV = new Float32Array(BGCT);
    for (let i = 0; i < BGCT; i++) {
      bgP[i * 3] = (Math.random() - 0.5) * 32;
      bgP[i * 3 + 1] = (Math.random() - 0.5) * 22;
      bgP[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
      bgV[i] = 0.002 + Math.random() * 0.004;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgP, 3));
    const bgPts = new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: CYAN, size: 0.038, transparent: true, opacity: 0.45 }));
    scene.add(bgPts);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl = new THREE.PointLight(CYAN, 3, 12);
    pl.position.set(0, 0, 3);
    scene.add(pl);

    /* ── Animation state machine ── */
    const easeOut  = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let phase: "intact" | "exploding" | "reforming" | "looping" = "intact";
    let phaseStart = 0;
    let ringsShown = false;
    const startTime = performance.now();
    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const elapsed = (performance.now() - startTime) / 1000;

      /* Phase transitions */
      if (elapsed > 0.5 && phase === "intact") { phase = "exploding"; phaseStart = elapsed; sLineMat.opacity = 0; fMat.opacity = 1; }
      if (elapsed > 1.7 && phase === "exploding") { phase = "reforming"; phaseStart = elapsed; }
      if (elapsed > 3.2 && phase === "reforming") {
        phase = "looping";
        sLineMat.opacity = 0.75;
        fMat.opacity = 0;
        if (!ringsShown) { ringsShown = true; rings.forEach(r => r.visible = true); setTextVisible(true); }
      }

      /* Blast interpolation */
      let blastP = 0;
      if (phase === "exploding") blastP = easeOut(Math.min((elapsed - phaseStart) / 1.2, 1));
      if (phase === "reforming") blastP = 1 - easeInOut(Math.min((elapsed - phaseStart) / 1.5, 1));

      if (phase === "exploding" || phase === "reforming") {
        for (let i = 0; i < FC; i++) {
          fragP[i * 3]     = origP[i * 3]     + blastDir[i * 3]     * blastP;
          fragP[i * 3 + 1] = origP[i * 3 + 1] + blastDir[i * 3 + 1] * blastP;
          fragP[i * 3 + 2] = origP[i * 3 + 2] + blastDir[i * 3 + 2] * blastP;
        }
        fGeo.attributes.position.needsUpdate = true;
      }

      sphere.rotation.y = elapsed * 0.18;
      sphere.rotation.x = elapsed * 0.10;
      sphere.rotation.z = elapsed * 0.04;

      rings.forEach(r => { r.rotation.y += r.userData.spd * 0.012; });

      for (let i = 0; i < BGCT; i++) {
        bgP[i * 3 + 1] += bgV[i];
        if (bgP[i * 3 + 1] > 13) bgP[i * 3 + 1] = -13;
      }
      bgGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* Auto-exit after 9 s */
    const timer = setTimeout(() => exit(), 9000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        zIndex: 99999,
        background: "#060605",
        opacity: exiting ? 0 : 1,
        transition: "opacity 1.3s ease",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Brand name */}
      <div
        className="relative z-10 text-center select-none"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: "clamp(5rem, 12vw, 9rem)",
            fontWeight: 300,
            letterSpacing: "0.35em",
            background: "linear-gradient(135deg, #0088cc, #00f2ff, #a0f9ff, #00f2ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            marginBottom: "0.8rem",
          }}
        >
          LUXE
        </div>
        <div
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "0.6rem",
            fontWeight: 500,
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            color: "rgba(0, 242, 255, 0.55)",
          }}
        >
          Luxury &nbsp;·&nbsp; Redefined
        </div>
      </div>
 
      {/* Skip button */}
      <button
        onClick={exit}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "2.5rem",
          fontFamily: "var(--font-sora), sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(0, 242, 255, 0.5)",
          border: "1px solid rgba(0, 242, 255, 0.2)",
          padding: "0.55rem 1.3rem",
          cursor: "pointer",
          background: "transparent",
          borderRadius: "2px",
          opacity: textVisible ? 1 : 0,
          transition: "opacity 0.5s, color 0.3s, border-color 0.3s",
        }}
        onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = "#00f2ff"; (e.target as HTMLButtonElement).style.borderColor = "rgba(0, 242, 255, 0.5)"; }}
        onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = "rgba(0, 242, 255, 0.5)"; (e.target as HTMLButtonElement).style.borderColor = "rgba(0, 242, 255, 0.2)"; }}
      >
        Enter &nbsp;→
      </button>
    </div>
  );
}
