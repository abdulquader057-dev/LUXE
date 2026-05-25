"use client";

import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020203]">
      {/* Deep Blue Cinematic Ambient Lighting */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#0A1128]/20 to-transparent opacity-60" />
      <div className="absolute bottom-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[#050A15] blur-[100px] opacity-80 translate-x-1/4 translate-y-1/4" />
      
      {/* Extremely subtle tech grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
