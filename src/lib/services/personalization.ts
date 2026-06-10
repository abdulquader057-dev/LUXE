import { Product } from "@/types";
import { supabase } from "@/lib/supabase";
import { parseDbProduct } from "@/data/products";

export interface UserPersona {
  preferredCategories: Record<string, number>;
  priceSensitivity: "low" | "medium" | "high";
  recentlyViewed: string[];
  wishlist: string[];
  purchaseHistory: string[];
  lastSearch?: string;
}

const STORAGE_KEY = "luxe_user_persona";

export class PersonalizationService {
  private static instance: PersonalizationService;
  private persona: UserPersona = {
    preferredCategories: {},
    priceSensitivity: "medium",
    recentlyViewed: [],
    wishlist: [],
    purchaseHistory: [],
  };
  private dbProducts: Product[] = [];
  private isLoaded = false;
  public loadPromise: Promise<void> | null = null;

  private constructor() {
    this.loadPersona();
    this.loadPromise = this.fetchProducts();
  }

  public static getInstance(): PersonalizationService {
    if (!PersonalizationService.instance) {
      PersonalizationService.instance = new PersonalizationService();
    }
    return PersonalizationService.instance;
  }

  private async fetchProducts() {
    try {
      const { data } = await supabase.from("products").select("*");
      if (data) {
        this.dbProducts = data.map(parseDbProduct);
        this.isLoaded = true;
      }
    } catch (err) {
      console.error("Personalization service failed to fetch products:", err);
    }
  }

  private loadPersona() {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.persona = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse user persona", e);
      }
    }
  }

  private savePersona() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.persona));
  }

  public async trackView(productId: string) {
    await this.ensureProductsLoaded();
    
    // Add to recently viewed (keep last 10)
    this.persona.recentlyViewed = [
      productId,
      ...this.persona.recentlyViewed.filter((id) => id !== productId),
    ].slice(0, 10);

    // Update category preference
    const product = this.dbProducts.find((p) => p.id === productId);
    if (product) {
      this.persona.preferredCategories[product.category] =
        (this.persona.preferredCategories[product.category] || 0) + 1;
    }

    this.savePersona();
  }

  public trackSearch(query: string) {
    this.persona.lastSearch = query;
    this.savePersona();
  }

  public async ensureProductsLoaded() {
    if (!this.isLoaded && this.loadPromise) {
      await this.loadPromise;
    }
  }

  public getRecentlyViewed(): Product[] {
    return this.persona.recentlyViewed
      .map((id) => this.dbProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }

  public getRecommendedProducts(): Product[] {
    const topCategories = Object.entries(this.persona.preferredCategories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);

    const recommendations = this.dbProducts.filter((p) => {
      const isPreferredCat = topCategories.includes(p.category);
      const isRecentlyViewed = this.persona.recentlyViewed.includes(p.id);
      return (isPreferredCat || p.isTrending) && !isRecentlyViewed;
    });

    // If we don't have enough recommendations, add some trending ones
    if (recommendations.length < 4) {
      const trending = this.dbProducts.filter(
        (p) => p.isTrending && !this.persona.recentlyViewed.includes(p.id)
      );
      const combined = [...new Set([...recommendations, ...trending])];
      if (combined.length < 4) {
        return [...new Set([...combined, ...this.dbProducts])].slice(0, 8);
      }
      return combined.slice(0, 8);
    }

    return recommendations.slice(0, 8);
  }

  public getOutfitPairing(productId: string): Product[] {
    const product = this.dbProducts.find((p) => p.id === productId);
    if (!product) return [];

    // Pairings should suggest other products, excluding the current one itself
    return this.dbProducts.filter(
      (p) => p.id !== product.id
    ).slice(0, 3);
  }

  public getPersona(): UserPersona {
    return this.persona;
  }
}

export const personalizationService = PersonalizationService.getInstance();
