"use client";

import React, { useState, useEffect, useCallback } from "react";
import OpeningAnimation from "@/components/OpeningAnimation";

export default function CinematicRevealWrapper({ children }: { children: React.ReactNode }) {
  const [revealActive, setRevealActive] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);

  const handleStartReveal = useCallback(() => {
    setRevealActive(true);
  }, []);

  const handleComplete = useCallback(() => {
    setRevealActive(true);
    setOpeningDone(true);
  }, []);

  return (
    <>
      {!openingDone && (
        <OpeningAnimation
          onStartReveal={handleStartReveal}
          onComplete={handleComplete}
        />
      )}
      <div
        style={{
          opacity: revealActive ? 1 : 0,
          transition: openingDone ? "none" : "opacity 2.2s cubic-bezier(0.25, 1, 0.5, 1)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {children}
      </div>
    </>
  );
}
