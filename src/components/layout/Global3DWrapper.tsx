"use client";

import dynamic from "next/dynamic";

const Global3DBackground = dynamic(
  () => import("@/components/layout/Global3DBackground"),
  { ssr: false, loading: () => null }
);

export default function Global3DWrapper() {
  return <Global3DBackground />;
}
