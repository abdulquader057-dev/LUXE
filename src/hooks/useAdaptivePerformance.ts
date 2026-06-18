import { useEffect, useState } from "react";

export type PerformanceTier = "low" | "medium" | "high";

/**
 * Custom hook that runs client-side diagnostic profiling to determine device performance capability.
 * Evaluates CPU cores, memory limits, mobile agent flags, and GPU rendering tags.
 */
export function useAdaptivePerformance(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    // 1. CPU Core check
    const cores = navigator.hardwareConcurrency || 4;
    
    // 2. RAM check (where supported, e.g. Chrome/Android)
    const memory = (navigator as any).deviceMemory || 8;

    // 3. Mobile agent check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // 4. GPU Performance check via WebGL debug information
    let isLowEndGPU = false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || (canvas as any).getContext("experimental-webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
          // Detect mobile or low-end integrated graphics chipsets
          if (
            /Mali|Adreno|PowerVR|Software|llvmpipe|SwiftShader/i.test(renderer) ||
            (/Intel/i.test(renderer) && !/Iris|Pro|UHD Graphics 6[3-9]0/i.test(renderer))
          ) {
            isLowEndGPU = true;
          }
        }
      }
    } catch (e) {
      isLowEndGPU = true;
    }

    // Assign performance tiers based on profiling indicators
    if (isMobile || isLowEndGPU || cores <= 4 || memory <= 4) {
      if (cores <= 2 || memory <= 2) {
        setTier("low");
      } else {
        setTier("medium");
      }
    } else {
      setTier("high");
    }
  }, []);

  return tier;
}
