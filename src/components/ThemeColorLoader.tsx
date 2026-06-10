"use client";

import { useEffect } from "react";
import { getCookie } from "@/lib/cookies";

export const THEMES: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  "Noir Gold": { bg: "#0A0A0F", card: "#12121A", text: "#F0EDE8", accent: "#C9A84C" },
  "Champagne": { bg: "#1A1610", card: "#22200A", text: "#F5EDD5", accent: "#E8C97A" },
  "Deep Slate": { bg: "#0D1117", card: "#111827", text: "#E8EDF5", accent: "#7B9CCC" },
  "Burgundy Luxe": { bg: "#120810", card: "#1E0E1A", text: "#F5E0E8", accent: "#C9506A" },
  "Royal Obsidian": { bg: "#080B14", card: "#0E1220", text: "#EDE8FF", accent: "#8B6FD4" },
  "Cognac": { bg: "#0F0800", card: "#1F1000", text: "#FFE8CC", accent: "#D4AF37" },
  "Midnight Rose": { bg: "#080510", card: "#100818", text: "#FFE8F0", accent: "#E8A0B0" }
};

export function applyTheme(themeName: string) {
  const theme = THEMES[themeName] || THEMES["Noir Gold"];
  const root = document.documentElement;
  
  root.style.setProperty("--theme-bg", theme.bg);
  root.style.setProperty("--theme-card", theme.card);
  root.style.setProperty("--theme-text", theme.text);
  root.style.setProperty("--theme-accent", theme.accent);
  
  root.style.setProperty("--bg-void", theme.bg);
  root.style.setProperty("--bg-base", theme.bg);
  root.style.setProperty("--bg-surface", theme.card);
  root.style.setProperty("--bg-elevated", theme.card);
  root.style.setProperty("--text-primary", theme.text);
  
  root.style.setProperty("--primary-color", theme.accent);
  root.style.setProperty("--gold-accent", theme.accent);

  Object.keys(THEMES).forEach((t) => {
    root.classList.remove(`theme-${t.toLowerCase().replace(/\s+/g, "-")}`);
  });
  root.classList.add(`theme-${themeName.toLowerCase().replace(/\s+/g, "-")}`);
}

export default function ThemeColorLoader() {
  useEffect(() => {
    const handleUpdate = () => {
      const activeTheme = getCookie("luxe-theme") || localStorage.getItem("luxe-theme") || "Noir Gold";
      applyTheme(activeTheme);
    };

    handleUpdate();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("luxe-theme-change", handleUpdate);
    
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("luxe-theme-change", handleUpdate);
    };
  }, []);

  return null;
}
