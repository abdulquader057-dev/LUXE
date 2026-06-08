"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LuxeLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVisible(true);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(60), 80);
    const t2 = setTimeout(() => setProgress(85), 200);
    const t3 = setTimeout(() => setProgress(100), 400);
    const t4 = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setVisible(false), 300);
    }, 550);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[200000] h-[2px] pointer-events-none"
          style={{ background: "transparent" }}
        >
          <motion.div
            className="h-full"
            style={{
              background: "linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)",
              boxShadow: "0 0 12px rgba(201,168,76,0.8)",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
