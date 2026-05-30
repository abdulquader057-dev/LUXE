"use client";

import { useEffect } from "react";

export const THEMES: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  "Noir Gold": { bg: "#0D0A06", card: "#1A1408", text: "#F5E6C8", accent: "#D4AF37" },
  "Champagne": { bg: "#1C1410", card: "#2A1F0E", text: "#F5E6C8", accent: "#D4AF37" },
  "Deep Slate": { bg: "#0A0F1A", card: "#111827", text: "#E8E0D0", accent: "#D4AF37" },
  "Burgundy Luxe": { bg: "#0F0608", card: "#1A0A0E", text: "#F5E0E8", accent: "#D4AF37" },
  "Royal Obsidian": { bg: "#050308", card: "#0D0A14", text: "#EDE8FF", accent: "#D4AF37" },
  "Cognac": { bg: "#0F0800", card: "#1F1000", text: "#FFE8CC", accent: "#D4AF37" },
  "Midnight Rose": { bg: "#080510", card: "#100818", text: "#FFE8F0", accent: "#D4AF37" }
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
      const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
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
