"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Currency, commerceService } from "../services/commerce";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    const stored = localStorage.getItem("luxe_currency") as Currency;
    if (stored) setCurrencyState(stored);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("luxe_currency", newCurrency);
  };

  const convertPrice = (amount: number) => {
    return commerceService.convertPrice(amount, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCommerce must be used within a CurrencyProvider");
  return context;
};
