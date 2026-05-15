import { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/data/products";

export interface SearchResult {
  products: Product[];
  suggestions: string[];
  intent?: string;
}

export class SearchService {
  private static instance: SearchService;

  private constructor() {}

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  public async search(query: string): Promise<SearchResult> {
    const q = query.toLowerCase();
    
    // 1. Intent Detection (Simplified NLP)
    const isBudgetSearch = q.includes("under") || q.includes("budget") || q.includes("cheap");
    const isCategorySearch = q.includes("modest") || q.includes("sneaker") || q.includes("watch") || q.includes("accessory");

    // 2. Semantic Matching
    let results = MOCK_PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q.replace("wear", ""));
      
      return nameMatch || descMatch || catMatch;
    });

    // 3. Natural Language Filtering
    if (isBudgetSearch) {
      const priceMatch = q.match(/(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[0]);
        results = results.filter(p => p.price <= maxPrice);
      }
    }

    // 4. Ranking (Simulated Vector Rank)
    results = results.sort((a, b) => {
      if (a.isTrending && !b.isTrending) return -1;
      if (b.isTrending && !a.isTrending) return 1;
      return b.ratings - a.ratings;
    });

    return {
      products: results,
      suggestions: this.getSuggestions(q),
      intent: isBudgetSearch ? "budget_conscious" : "general_discovery"
    };
  }

  private getSuggestions(query: string): string[] {
    const baseSuggestions = [
      "Cyber-Modest techwear",
      "Oversized hoodies under ₹2000",
      "Neon sneakers",
      "Minimalist watches",
      "Utility vests for streetwear"
    ];

    if (!query) return baseSuggestions;

    return baseSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
  }
}

export const searchService = SearchService.getInstance();
