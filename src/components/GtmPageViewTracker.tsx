"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";
      const url = pathname + search;
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "page_view",
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GtmPageViewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
