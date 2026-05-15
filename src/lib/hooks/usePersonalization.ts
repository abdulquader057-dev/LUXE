"use client";

import { useState, useEffect } from "react";
import { personalizationService, UserPersona } from "../services/personalization";
import { Product } from "@/types";

export function usePersonalization() {
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const p = personalizationService.getPersona();
    setPersona(p);
    setRecommendations(personalizationService.getRecommendedProducts());
    setRecentlyViewed(personalizationService.getRecentlyViewed());
  }, []);

  const trackView = (productId: string) => {
    personalizationService.trackView(productId);
    // Refresh state
    setRecentlyViewed(personalizationService.getRecentlyViewed());
    setRecommendations(personalizationService.getRecommendedProducts());
    setPersona({ ...personalizationService.getPersona() });
  };

  const getOutfitPairing = (productId: string) => {
    return personalizationService.getOutfitPairing(productId);
  };

  return {
    persona,
    recommendations,
    recentlyViewed,
    trackView,
    getOutfitPairing
  };
}
