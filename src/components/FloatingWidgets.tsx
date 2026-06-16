"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "@/components/BackToTop";

// Lazy-load client-only widgets with SSR disabled to optimize FCP/hydration
const ZyraChat = dynamic(() => import("@/components/ZyraChat"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
  loading: () => <div className="cursor-placeholder" />,
});

export default function FloatingWidgets() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      
      {/* Offline Status Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[10000] bg-red-950/90 backdrop-blur-md border-b border-red-500/30 py-2.5 px-4 flex items-center justify-center gap-2 text-red-200"
          >
            <WifiOff size={12} className="animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
              You are offline. Some features may not work.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING COMPONENTS GEOMETRY LOCK */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
        <ZyraChat />
        <BackToTop />
      </div>
    </>
  );
}
