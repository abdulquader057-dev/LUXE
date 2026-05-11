import { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "zy-001",
    name: "Cyber-Modest Tech Kaftan",
    description: "A fusion of traditional modest wear and futuristic techwear aesthetics. Features waterproof fabric, adjustable straps, and integrated neon piping.",
    price: 4999,
    currency: "INR",
    category: "modest-wear",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109132314-34759616b408?q=80&w=1000&auto=format&fit=crop"
    ],
    stock: 100,
    isTrending: true,
    discount: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Obsidian Black", "Cyber Cyan"],
    ratings: 4.8,
    reviewsCount: 124
  },
  {
    id: "zy-002",
    name: "Neon-Pulse Sneakers X1",
    description: "Limited edition luxury sneakers with pressure-sensitive LED soles and premium leather finish. Engineered for the street, designed for the future.",
    price: 12999,
    currency: "INR",
    category: "sneakers",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
    ],
    stock: 100,
    isTrending: true,
    isPreorder: true,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Phantom White", "Neon Purple"],
    ratings: 4.9,
    reviewsCount: 89
  },
  {
    id: "zy-003",
    name: "Vortex Chrono Watch",
    description: "Futuristic skeleton watch with a liquid-metal aesthetic strap. Precision mechanical movement with an industrial vibe.",
    price: 8499,
    currency: "INR",
    category: "watches",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aac29623b66?q=80&w=1000&auto=format&fit=crop"
    ],
    stock: 100,
    discount: 10,
    colors: ["Chrome Silver", "Matte Black"],
    ratings: 4.7,
    reviewsCount: 56
  },
  {
    id: "zy-004",
    name: "Zenith Utility Vest",
    description: "High-performance utility vest with multiple modular pockets and magnetic fasteners. Perfect for the modern urban explorer.",
    price: 3299,
    currency: "INR",
    category: "mixed-fashion",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"
    ],
    stock: 100,
    sizes: ["M", "L", "XL"],
    colors: ["Olive Drab", "Midnight Blue"],
    ratings: 4.5,
    reviewsCount: 42
  },
  {
    id: "zy-005",
    name: "Cyber-Wrap Sunglasses",
    description: "Ultraviolet protection with a futuristic wrap-around design. Lightweight alloy frame with polarized iridescent lenses.",
    price: 1899,
    currency: "INR",
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1511499767390-a73350ff96ad?q=80&w=1000&auto=format&fit=crop"
    ],
    stock: 100,
    discount: 20,
    colors: ["Iridium", "Gold Spike"],
    ratings: 4.6,
    reviewsCount: 210
  }
];
