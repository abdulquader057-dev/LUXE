export type Category = 'modest-wear' | 'accessories' | 'sneakers' | 'watches' | 'mixed-fashion' | 'streetwear';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'INR' | 'USD';
  category: Category;
  originalPrice?: number;
  images: string[];
  stock: number;
  isTrending?: boolean;
  isPreorder?: boolean;
  isRare?: boolean;
  isDrop?: boolean;
  dropDate?: string;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  ratings: number;
  reviewsCount: number;
  aesthetic?: string[];
  compatibilityTags?: string[];
  fashionScore?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// AI Outfit System
export interface OutfitItem {
  productId: string;
  role: 'top' | 'bottom' | 'footwear' | 'accessory' | 'outerwear' | 'watch';
}

export interface AIOutfit {
  id: string;
  name: string;
  description: string;
  aesthetic: string;
  occasion: string;
  confidence: number;
  items: OutfitItem[];
  totalPrice: number;
  fashionScore: number;
  colorHarmony: number;
  trendAlignment: number;
}

// Wardrobe Memory / Style DNA
export interface StyleDNA {
  dominantColors: string[];
  preferredAesthetics: string[];
  favoriteCategories: Category[];
  stylePersonality: string;
  fashionEra: string;
  wardrobeCompletion: number;
  evolutionStage: number;
  totalXP: number;
  level: number;
  badges: Badge[];
}

export interface WardrobeItem {
  product: Product;
  savedAt: string;
  folder: string;
  liked: boolean;
}

// Fashion XP & Gamification
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface XPEvent {
  type: 'view' | 'like' | 'save' | 'purchase' | 'outfit_create' | 'community_vote' | 'streak';
  points: number;
  timestamp: string;
}

// Live Drop System
export interface LiveDrop {
  id: string;
  product: Product;
  dropDate: string;
  totalStock: number;
  remainingStock: number;
  rarity: 'limited' | 'exclusive' | 'ultra-rare';
  hypeScore: number;
  waitlistCount: number;
}

// Community & Social
export interface CommunityFit {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  outfit: AIOutfit;
  votes: number;
  createdAt: string;
  aesthetic: string;
}

export interface Moodboard {
  id: string;
  name: string;
  aesthetic: string;
  items: Product[];
  createdAt: string;
  isPublic: boolean;
}

// Trend Radar
export interface TrendItem {
  name: string;
  category: 'aesthetic' | 'color' | 'sneaker' | 'material' | 'silhouette';
  momentum: number; // -100 to 100
  popularity: number; // 0-100
  forecast: 'rising' | 'peaking' | 'declining' | 'emerging';
}

// Virtual Stylist
export interface VirtualStylist {
  id: string;
  name: string;
  personality: string;
  speciality: string;
  avatar: string;
  tone: string;
  greeting: string;
  accentColor: string;
}

// Reel Feed
export interface FashionReel {
  id: string;
  type: 'product' | 'outfit' | 'campaign' | 'trend';
  mediaUrl: string;
  thumbnailUrl: string;
  title: string;
  subtitle: string;
  product?: Product;
  outfit?: AIOutfit;
  likes: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
}
