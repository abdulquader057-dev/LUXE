"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "INR" | "USD" | "EUR" | "GBP";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CommerceContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
  convertPrice: (priceUSD: number) => { amount: number; symbol: string };
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

const exchangeRates = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
};

const currencySymbols = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("luxe-currency") as Currency;
    if (savedCurrency) setCurrency(savedCurrency);

    const savedCart = localStorage.getItem("luxe-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const handleSetCurrency = (cur: Currency) => {
    setCurrency(cur);
    localStorage.setItem("luxe-currency", cur);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
    alert(`Added ${item.name} to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.id !== id);
      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const convertPrice = (priceUSD: number) => {
    const converted = priceUSD * exchangeRates[currency];
    return {
      amount: Math.round(converted),
      symbol: currencySymbols[currency],
    };
  };

  return (
    <CommerceContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        cart,
        addToCart,
        removeFromCart,
        cartCount,
        convertPrice,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (context === undefined) {
    throw new Error("useCommerce must be used within a CommerceProvider");
  }
  return context;
}
