"use client";

import React from "react";
import { useCurrency } from "../lib/contexts/CurrencyContext";
import { Currency } from "../lib/services/commerce";
import { Globe } from "lucide-react";
import { cn } from "../lib/utils";

export const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const currencies: Currency[] = ["INR", "USD", "EUR", "GBP"];

  return (
    <div className="flex items-center gap-2 bg-[rgba(10,10,20,0.4)] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)]">
      <Globe size={14} strokeWidth={1.5} className="text-white/40 ml-1" />
      <div className="flex gap-1">
        {currencies.map((curr) => (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={cn(
              "text-[10px] font-black tracking-widest transition-all px-2 py-1 rounded-full",
              currency === curr 
                ? "text-primary bg-primary/10 border border-primary/40 shadow-[0_0_10px_rgba(0,245,212,0.2)]" 
                : "text-white/40 hover:text-white/80 border border-transparent"
            )}
          >
            {curr}
          </button>
        ))}
      </div>
    </div>
  );
};
