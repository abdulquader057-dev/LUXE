"use client";

import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground"), { ssr: false });
const EntranceAnimation = dynamic(() => import("@/components/EntranceAnimation"), { ssr: false });
const FloatingWidgets = dynamic(() => import("@/components/FloatingWidgets"), { ssr: false });

export default function DynamicLayoutWidgets() {
  return (
    <>
      <AnimatedBackground />
      <EntranceAnimation />
      <FloatingWidgets />
    </>
  );
}
