'use client';

import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ARBodyTrackerProps {
  modelUrl?: string | null;
  productColor?: string;
  isStreaming: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTrackingStatusChange?: (active: boolean) => void;
}

// Procedural premium digital mannequin chest/vest model (fallback when no GLB exists)
function ProceduralGarment({ color = '#C9A84C' }: { color?: string }) {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef1.current) {
      meshRef1.current.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.y = -Math.sin(elapsed * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Upper Chest / Shoulders Plate */}
      <mesh ref={meshRef1} position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.3, 0.42, 0.4, 12, 6, true]} />
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.7} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Abdomen / Waist Plate */}
      <mesh ref={meshRef2} position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.35, 0.4, 12, 6, true]} />
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.6} 
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>
      {/* Dynamic light refraction rings */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.015, 8, 24]} />
        <meshStandardMaterial color="#C9A962" transparent opacity={0.8} emissive="#C9A962" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// GLB model loader for real garments
function GLBGarment({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Clone scene to prevent caching conflicts across renders
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Clean materials to fit luxury brand styling (glass/gold undertone shader adjustments)
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness, 0.35);
          mat.envMapIntensity = 1.8;
        }
      }
    });
  }, [clonedScene]);

  return (
    <Center>
      <primitive object={clonedScene} scale={1.75} position={[0, -0.65, 0]} />
    </Center>
  );
}

export const ARBodyTracker = ({
  modelUrl,
  productColor = '#C9A84C',
  isStreaming,
  videoRef,
  onTrackingStatusChange
}: ARBodyTrackerProps) => {
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transform coordinates updated in real time by MediaPipe
  const [transform, setTransform] = useState({
    posX: 0,
    posY: -0.2,
    posZ: 0,
    scaleX: 1.0,
    scaleY: 1.0,
    scaleZ: 1.0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  const poseRef = useRef<any>(null);
  const onTrackingStatusChangeRef = useRef(onTrackingStatusChange);

  useEffect(() => {
    onTrackingStatusChangeRef.current = onTrackingStatusChange;
  }, [onTrackingStatusChange]);

  // Landmark processing & coordinate conversion
  const onPoseResults = useCallback((results: any) => {
    const landmarks = results.poseLandmarks;
    if (!landmarks || landmarks.length === 0) {
      setIsTracking((prev) => {
        if (prev) {
          onTrackingStatusChangeRef.current?.(false);
        }
        return false;
      });
      return;
    }

    setIsTracking((prev) => {
      if (!prev) {
        onTrackingStatusChangeRef.current?.(true);
      }
      return true;
    });

    // Capture Key Landmarks:
    // Left Shoulder (11), Right Shoulder (12)
    // Left Hip (23), Right Hip (24)
    const lSh = landmarks[11];
    const rSh = landmarks[12];
    const lHp = landmarks[23];
    const rHp = landmarks[24];

    if (!lSh || !rSh) return;

    // Calculate Torso metrics
    const shCenterX = (lSh.x + rSh.x) / 2;
    const shCenterY = (lSh.y + rSh.y) / 2;
    const shCenterZ = (lSh.z + rSh.z) / 2;

    const hpCenterX = lHp && rHp ? (lHp.x + rHp.x) / 2 : shCenterX;
    const hpCenterY = lHp && rHp ? (lHp.y + rHp.y) / 2 : shCenterY + 0.45;

    // Convert coordinates to Three.js R3F space
    // Standard camera position in canvas: Z = 4.0. Width of viewport is ~3.3, Height is ~2.5
    const viewHeight = 2.8;
    const viewWidth = viewHeight * (window.innerWidth / window.innerHeight);

    // X coordinates are mirrored since webcam is mirrored
    const posX = -(shCenterX - 0.5) * viewWidth;
    // Y coordinates in MediaPipe go 0 (top) to 1 (bottom), invert and shift to chest level
    const posY = -(shCenterY - 0.5) * viewHeight - 0.22;
    // Z depth represents scaling factor
    const posZ = -shCenterZ * 2.0;

    // Calculate Shoulder width and Torso height for dynamic scaling
    const shoulderWidth = Math.hypot(lSh.x - rSh.x, lSh.y - rSh.y);
    const torsoHeight = Math.hypot(shCenterX - hpCenterX, shCenterY - hpCenterY);

    const scaleX = shoulderWidth * 3.8;
    const scaleY = torsoHeight * 2.8;
    const scaleZ = scaleX * 0.9;

    // Rotations:
    // Yaw: Shoulder rotation around Y axis
    const rotY = Math.atan2(rSh.z - lSh.z, rSh.x - lSh.x);
    // Roll: Shoulder tilt around Z axis
    const rotZ = Math.atan2(rSh.y - lSh.y, rSh.x - lSh.x);
    // Pitch: forward bending around X axis
    const rotX = (lSh.z + rSh.z) * 0.5 * 1.5;

    setTransform({
      posX,
      posY,
      posZ,
      scaleX,
      scaleY,
      scaleZ,
      rotX,
      rotY: -rotY, // Adjust mirroring rotation direction
      rotZ: -rotZ
    });
  }, []);

  // Initialize MediaPipe Pose Estimator
  const initPoseEstimator = useCallback(() => {
    if (!(window as any).Pose) return;

    try {
      const pose = new (window as any).Pose({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      pose.onResults(onPoseResults);
      poseRef.current = pose;
    } catch (e) {
      console.error('Error initializing MediaPipe Pose:', e);
      setErrorMsg('Error initializing AR skeleton pipeline.');
    }
  }, [onPoseResults]);

  useEffect(() => {
    let active = true;

    // Load scripts dynamically from CDN
    const loadMediaPipe = async () => {
      try {
        if (!(window as any).Pose) {
          const loadScript = (src: string) => {
            return new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = src;
              script.crossOrigin = 'anonymous';
              script.async = true;
              script.onload = () => resolve();
              script.onerror = () => reject(new Error(`Script load error for ${src}`));
              document.head.appendChild(script);
            });
          };

          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        }

        if (active) {
          setIsLibraryLoading(false);
          initPoseEstimator();
        }
      } catch (err) {
        console.error('Failed to load MediaPipe Pose scripts:', err);
        if (active) {
          setErrorMsg('Failed to load AR tracking libraries.');
          setIsLibraryLoading(false);
        }
      }
    };

    loadMediaPipe();

    return () => {
      active = false;
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [initPoseEstimator]);

  // Run camera frames through pose processor
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!isStreaming || !videoElement || !poseRef.current || isLibraryLoading) return;

    let active = true;
    let animFrame: number;

    const processFrames = async () => {
      if (!active || !videoRef.current) return;
      const el = videoRef.current;
      
      // Ensure video has loaded metadata and actual dimensions
      if (el.readyState >= 2) {
        try {
          await poseRef.current.send({ image: el });
        } catch (e) {
          console.warn('Frame processing dropped:', e);
        }
      }

      animFrame = requestAnimationFrame(processFrames);
    };

    processFrames();

    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
    };
  }, [isStreaming, videoRef, isLibraryLoading]);

  return (
    <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
      {/* Library loading overlay */}
      {isLibraryLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
          <div className="relative flex flex-col items-center">
            <div className="w-[120px] h-[180px] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#C9A84C]/5 blur-xl rounded-full animate-pulse" />
              <svg width="120" height="180" viewBox="0 0 120 180" className="opacity-80">
                <g stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                  {/* Shoulders */}
                  <line x1="40" y1="50" x2="80" y2="50" className="animate-pulse" />
                  {/* Spine */}
                  <line x1="60" y1="50" x2="60" y2="100" />
                  {/* Hips */}
                  <line x1="45" y1="100" x2="75" y2="100" />
                  
                  {/* Left Arm */}
                  <line x1="40" y1="50" x2="30" y2="75" />
                  <line x1="30" y1="75" x2="25" y2="95" />
                  
                  {/* Right Arm */}
                  <line x1="80" y1="50" x2="90" y2="75" />
                  <line x1="90" y1="75" x2="95" y2="95" />
                  
                  {/* Left Leg */}
                  <line x1="45" y1="100" x2="40" y2="135" />
                  <line x1="40" y1="135" x2="35" y2="170" />
                  
                  {/* Right Leg */}
                  <line x1="75" y1="100" x2="80" y2="135" />
                  <line x1="80" y1="135" x2="85" y2="170" />
                </g>
                
                <g fill="#C9A84C">
                  {/* Head */}
                  <circle cx="60" cy="30" r="7" />
                  
                  {/* Joint dots */}
                  <circle cx="40" cy="50" r="3" />
                  <circle cx="80" cy="50" r="3" />
                  <circle cx="30" cy="75" r="2.5" />
                  <circle cx="90" cy="75" r="2.5" />
                  <circle cx="25" cy="95" r="2.5" className="animate-pulse" />
                  <circle cx="95" cy="95" r="2.5" className="animate-pulse" />
                  <circle cx="45" cy="100" r="3" />
                  <circle cx="75" cy="100" r="3" />
                  <circle cx="40" cy="135" r="2.5" />
                  <circle cx="80" cy="135" r="2.5" />
                  <circle cx="35" cy="170" r="2.5" className="animate-pulse" />
                  <circle cx="85" cy="170" r="2.5" className="animate-pulse" />
                </g>
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C] uppercase animate-pulse">
              Calibrating AR Body Mesh...
            </span>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
              fitting skeletal landmarks to real-time silhouette
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="absolute inset-x-6 top-6 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-400">
          <AlertTriangle size={16} />
          <span className="text-[9px] font-mono tracking-wider uppercase">{errorMsg}</span>
        </div>
      )}

      {/* Active skeleton tracking confirmation */}
      {isTracking && (
        <div className="absolute top-4 left-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 backdrop-blur-md">
          <ShieldCheck size={12} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold tracking-widest uppercase">AR Skeletal Tracking Engaged</span>
        </div>
      )}

      {/* R3F Canvas overlay */}
      {!isLibraryLoading && !errorMsg && (
        <Canvas
          camera={{ position: [0, 0, 4.0], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 3]} intensity={1.5} color="#fff8f0" />
          <directionalLight position={[-2, 1, -1]} intensity={0.4} color="#C9A84C" />
          <pointLight position={[0, 3, 1]} intensity={0.7} color="#E8C97A" />

          <group
            position={[transform.posX, transform.posY, transform.posZ]}
            scale={[transform.scaleX, transform.scaleY, transform.scaleZ]}
            rotation={[transform.rotX, transform.rotY, transform.rotZ]}
          >
            <Suspense fallback={null}>
              {modelUrl ? (
                <GLBGarment url={modelUrl} />
              ) : (
                <ProceduralGarment color={productColor} />
              )}
              <Environment preset="city" />
            </Suspense>
          </group>
        </Canvas>
      )}
    </div>
  );
};

export default ARBodyTracker;
