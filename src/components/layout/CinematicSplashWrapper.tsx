"use client";

import dynamic from "next/dynamic";

const CinematicSplash = dynamic(
  () => import("@/components/layout/CinematicSplash"),
  { ssr: false, loading: () => null }
);

export default function CinematicSplashWrapper() {
  return <CinematicSplash />;
}
