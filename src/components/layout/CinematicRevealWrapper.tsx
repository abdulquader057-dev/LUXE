"use client";

import React, { useState, useEffect } from "react";
import OpeningAnimation from "@/components/OpeningAnimation";

export default function CinematicRevealWrapper({ children }: { children: React.ReactNode }) {
  const [openingDone, setOpeningDone] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleComplete = React.useCallback(() => {
    setOpeningDone(true);
  }, []);

  useEffect(() => {
    if (openingDone) {
      // Set a tiny timeout to ensure the DOM mounts before we trigger the opacity transition
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [openingDone]);

  return (
    <>
      {!openingDone && (
        <OpeningAnimation
          onComplete={handleComplete}
        />
      )}
      {openingDone && (
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: "opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}

