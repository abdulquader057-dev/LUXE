"use client";

import { useEffect } from "react";

export default function ThemeColorLoader() {
  useEffect(() => {
    try {
      const color = localStorage.getItem("luxe-theme-color");
      if (color) {
        document.documentElement.style.setProperty("--primary-color", color);
      }
    } catch (e) {
      console.warn("Could not load custom theme color:", e);
    }
  }, []);

  return null;
}
