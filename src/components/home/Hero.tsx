"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LuxeLogo from "../LuxeLogo";
import MagneticWrapper from "../MagneticWrapper";

const Hero = () => {

    <section className="hero relative z-10">
      {/* BACKGROUND AREA NOW HANDLED BY CinematicAtmosphere GLOBALLY */}

      {/* HERO CONTENT (Z-INDEX 10) */}
      <div className="hero-content relative z-10">
        {/* Row 1: Logo fades in as one unit */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <LuxeLogo />
        </motion.div>

        {/* Row 2: Subtitle fades in */}
        <motion.p
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-subtitle"
        >
          Experience the evolution of digital identity.
          Neural-powered luxury curation for the 
          architects of the next-gen fashion universe.
        </motion.p>

        {/* Row 3: Buttons fade in */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-buttons"
        >
          <MagneticWrapper>
            <button className="btn-primary clickable">Initialize Search</button>
          </MagneticWrapper>
          <MagneticWrapper>
            <button className="btn-secondary clickable">Explore Drops</button>
          </MagneticWrapper>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
