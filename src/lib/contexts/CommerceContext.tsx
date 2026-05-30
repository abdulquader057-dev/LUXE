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
  convertPrice: (priceINR: number, skipDiscount?: boolean) => { amount: number; symbol: string };
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

  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const checkGoldStatus = () => {
      try {
        const savedMockProfile = localStorage.getItem("luxe-mock-profile");
        const savedMockUser = localStorage.getItem("luxe-mock-user");
        const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
        const isGoldTheme = ["Royal Obsidian", "Cognac", "Midnight Rose"].includes(activeTheme);
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        
        let hasGoldLevel = false;
        if (savedMockUser) {
          const userObj = JSON.parse(savedMockUser);
          if (userObj?.user_metadata?.style_dna?.level >= 3) {
            hasGoldLevel = true;
          }
        }

        let isGoldProfile = false;
        if (savedMockProfile) {
          const profileObj = JSON.parse(savedMockProfile);
          if (profileObj?.tier === "Gold" || profileObj?.role === "admin") {
            isGoldProfile = true;
          }
        }

        setIsGold(isGoldTheme || isGoldLocal || hasGoldLevel || isGoldProfile);
      } catch (e) {}
    };

    checkGoldStatus();
    
    window.addEventListener("storage", checkGoldStatus);
    const interval = setInterval(checkGoldStatus, 1500);
    return () => {
      window.removeEventListener("storage", checkGoldStatus);
      clearInterval(interval);
    };
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
    // GTM Event Tracking
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: currency,
          value: item.price * item.quantity,
          items: [{
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
            item_size: item.size,
            item_color: item.color
          }]
        }
      });
    }

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

  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const rawTotalPrice = cart.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  const totalPrice = isGold ? rawTotalPrice * 0.85 : rawTotalPrice;

  const convertPrice = (priceINR: number, skipDiscount = false) => {
    let finalPrice = priceINR;
    if (isGold && !skipDiscount) {
      finalPrice = priceINR * 0.85;
    }
    const converted = finalPrice * exchangeRates[currency];
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
