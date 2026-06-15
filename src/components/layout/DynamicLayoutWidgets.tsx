"use client";

import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground"), { ssr: false });
const FloatingWidgets = dynamic(() => import("@/components/FloatingWidgets"), { ssr: false });

export default function DynamicLayoutWidgets() {
  return (
    <>
      <AnimatedBackground />
      <FloatingWidgets />
    </>
  );
}
