"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EntranceAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide animation after 3.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      window.dispatchEvent(new CustomEvent("open-country-modal"));
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#020202] overflow-hidden"
        >
          {/* Animated Tech Grid Background */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
                 backgroundSize: '40px 40px',
                 transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
               }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Reveal Sequence */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="text-4xl md:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400 tracking-[0.5em] ml-[0.5em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                LUXE
              </div>
            </motion.div>

            {/* Neural Initializing Bar */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "250px", opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent mt-8 relative"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200px" }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute top-[-1px] left-0 w-10 h-[3px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.2, duration: 1.2 }}
              className="mt-6 flex flex-col items-center gap-1.5"
            >
              <div className="text-[10px] font-sora tracking-[0.3em] text-white/80 uppercase">
                Smart Fashion OS
              </div>
              <div className="text-[8px] font-rajdhani tracking-[0.2em] text-white/40">
                System Sync... Active
              </div>
            </motion.div>
          </div>

          {/* Flash Effect before exiting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2.8, duration: 0.5 }}
            className="absolute inset-0 bg-white/10 mix-blend-screen pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntranceAnimation;
