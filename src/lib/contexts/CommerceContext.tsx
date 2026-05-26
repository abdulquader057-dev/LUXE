"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export type Currency = "INR" | "USD" | "EUR" | "GBP";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CommerceContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  convertPrice: (priceINR: number) => { amount: number; symbol: string };
  country: string;
  setCountry: (country: string) => void;
  availableCurrencies: Currency[];
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

const exchangeRates = {
  INR: 1,
  USD: 1 / 83.5,
  EUR: 1 / 90.5,
  GBP: 1 / 106.0,
};

const currencySymbols = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<string>("India");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const availableCurrencies: Currency[] = country === "India" ? ["INR", "USD", "EUR"] : ["USD", "EUR"];

  useEffect(() => {
    const savedCountry = localStorage.getItem("luxe-country") || "India";
    setCountry(savedCountry);

    const savedCurrency = localStorage.getItem("luxe-currency") as Currency;
    const allowed = savedCountry === "India" ? ["INR", "USD", "EUR"] : ["USD", "EUR"];
    
    if (savedCurrency && allowed.includes(savedCurrency)) {
      setCurrency(savedCurrency);
    } else {
      const defaultCur = savedCountry === "India" ? "INR" : "USD";
      setCurrency(defaultCur as Currency);
      localStorage.setItem("luxe-currency", defaultCur);
    }

    const savedCart = localStorage.getItem("luxe-cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load saved UI Theme color
    const savedTheme = localStorage.getItem("luxe-theme-color") || "#00f2ff";
    document.documentElement.style.setProperty("--primary-color", savedTheme);
  }, []);

  const handleSetCurrency = (cur: Currency) => {
    setCurrency(cur);
    localStorage.setItem("luxe-currency", cur);
  };

  const handleSetCountry = (newCountry: string) => {
    setCountry(newCountry);
    localStorage.setItem("luxe-country", newCountry);

    const allowed = newCountry === "India" ? ["INR", "USD", "EUR"] : ["USD", "EUR"];
    if (!allowed.includes(currency)) {
      const defaultCur = newCountry === "India" ? "INR" : "USD";
      setCurrency(defaultCur as Currency);
      localStorage.setItem("luxe-currency", defaultCur);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size && i.color === item.color);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        toast.success(`Increased quantity for ${item.name}`);
      } else {
        newCart = [...prev, item];
        toast.success(`Added ${item.name} to Arsenal`);
      }
      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => !(i.id === id && i.size === size && i.color === color));
      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.error("Item removed from Arsenal");
  };

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return removeFromCart(id, size, color);
    setCart((prev) => {
      const newCart = prev.map(i => (i.id === id && i.size === size && i.color === color) ? { ...i, quantity } : i);
      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("luxe-cart");
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const convertPrice = (priceINR: number) => {
    const converted = priceINR * exchangeRates[currency];
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
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
        isCartOpen,
        toggleCart,
        convertPrice,
        country,
        setCountry: handleSetCountry,
        availableCurrencies,
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
