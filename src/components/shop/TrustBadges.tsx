// src/components/shop/TrustBadges.tsx
"use client";

import { Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import React from "react";

export default function TrustBadges() {
  const badges = [
    { icon: <Truck size={20} className="text-gold" />, label: "Free Delivery" },
    { icon: <RefreshCcw size={20} className="text-gold" />, label: "Easy Returns" },
    { icon: <ShieldCheck size={20} className="text-gold" />, label: "Authenticity Guaranteed" },
  ];

  return (
    <div className="flex gap-6 justify-center py-4">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2 text-sm font-sora text-gold">
          {b.icon}
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
