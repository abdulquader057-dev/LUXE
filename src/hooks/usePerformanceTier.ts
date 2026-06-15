"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "low";

export default function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 768;
    const isLowCpu = (navigator.hardwareConcurrency || 4) <= 4;
    const isLowDpr = window.devicePixelRatio < 1.5;

    if (isMobile || isLowCpu || isLowDpr) {
      setTier("low");
    } else {
      setTier("high");
    }
  }, []);

  return tier;
}
