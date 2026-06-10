"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export type Currency = "INR" | "USD" | "EUR" | "GBP";

import { useAuth } from "@/lib/contexts/AuthContext";
import { track } from "@vercel/analytics";

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
  const { user, profile } = useAuth();

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
        const activeTheme = localStorage.getItem("luxe-theme") || "Noir Gold";
        const isGoldTheme = ["Royal Obsidian", "Cognac", "Midnight Rose"].includes(activeTheme);
        const isGoldLocal = localStorage.getItem("luxe-is-gold") === "true";
        const userLevel = user?.user_metadata?.style_dna?.level || 0;
        
        setIsGold(
          isGoldTheme || 
          isGoldLocal || 
          userLevel >= 3 || 
          profile?.tier === "Gold" || 
          profile?.role === "admin"
        );
      } catch (e) {}
    };

    checkGoldStatus();
  }, [user, profile]);

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
    try {
      track("cart_item_added", {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "L",
        color: item.color || "White"
      });
    } catch (e) {
      console.warn("Vercel track error:", e);
    }

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
      } else {
        newCart = [...prev, item];
      }

      const pInfo = convertPrice(item.price);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-slide-in" : "animate-slide-out"
          } max-w-md w-full bg-[#050508] border border-white/10 shadow-[0_10px_50px_rgba(0,240,255,0.1)] rounded-2xl pointer-events-auto flex p-4 items-center gap-4`}
          style={{ transition: "all 0.3s ease" }}
        >
          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/5">
            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono font-bold text-white tracking-widest uppercase truncate">{item.name}</p>
            <p className="text-[9px] font-mono text-white/40 uppercase mt-0.5 truncate">
              {item.size ? `Size: ${item.size}` : ""} {item.color ? `• Color: ${item.color}` : ""}
            </p>
            <p className="text-xs font-mono text-primary mt-1 font-bold">
              {pInfo.symbol}{pInfo.amount}
            </p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsCartOpen(true);
            }}
            className="text-[9px] font-mono tracking-widest uppercase bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg transition-colors border border-primary/20 cursor-pointer whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      ), { duration: 3000, position: "bottom-center" });

      localStorage.setItem("luxe-cart", JSON.stringify(newCart));
      return newCart;
    });
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
