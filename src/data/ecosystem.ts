import { AIOutfit, VirtualStylist, TrendItem, LiveDrop, FashionReel, Badge, CommunityFit, StyleDNA } from "@/types";
import { MOCK_PRODUCTS } from "./products";

// ──────────────────────────────────────────────
// AI-GENERATED OUTFITS
// ──────────────────────────────────────────────
export const MOCK_OUTFITS: AIOutfit[] = [
  {
    id: "outfit-001",
    name: "Midnight Neural",
    description: "A sleek all-black tech-modest ensemble that merges future utility with understated luxury.",
    aesthetic: "Cyber-Minimal",
    occasion: "Evening / Gallery",
    confidence: 94,
    items: [
      { productId: "zy-001", role: "top" },
      { productId: "zy-004", role: "outerwear" },
      { productId: "zy-002", role: "footwear" },
      { productId: "zy-003", role: "watch" },
    ],
    totalPrice: 29697,
    fashionScore: 96,
    colorHarmony: 92,
    trendAlignment: 88,
  },
  {
    id: "outfit-002",
    name: "Solar Vortex",
    description: "A bold streetwear kit channeling Gen-Z energy. High-contrast layers with utility accents.",
    aesthetic: "Streetwear Futurism",
    occasion: "Street / Festival",
    confidence: 91,
    items: [
      { productId: "zy-004", role: "top" },
      { productId: "zy-002", role: "footwear" },
      { productId: "zy-005", role: "accessory" },
    ],
    totalPrice: 18197,
    fashionScore: 89,
    colorHarmony: 85,
    trendAlignment: 94,
  },
  {
    id: "outfit-003",
    name: "Quantum Modest",
    description: "Tech-modest excellence. Breathable fabrics meet geometric precision and tonal elegance.",
    aesthetic: "Tech-Modest",
    occasion: "Daily / Formal",
    confidence: 97,
    items: [
      { productId: "zy-001", role: "top" },
      { productId: "zy-003", role: "watch" },
      { productId: "zy-005", role: "accessory" },
    ],
    totalPrice: 15397,
    fashionScore: 93,
    colorHarmony: 96,
    trendAlignment: 82,
  },
  {
    id: "outfit-004",
    name: "Neon Apex",
    description: "Maximum impact. Neon accents across every layer for the digital-native personality.",
    aesthetic: "Neon-Luxury",
    occasion: "Night Out / Event",
    confidence: 88,
    items: [
      { productId: "zy-001", role: "top" },
      { productId: "zy-002", role: "footwear" },
      { productId: "zy-005", role: "accessory" },
      { productId: "zy-003", role: "watch" },
    ],
    totalPrice: 28396,
    fashionScore: 91,
    colorHarmony: 78,
    trendAlignment: 96,
  },
];

// ──────────────────────────────────────────────
// VIRTUAL STYLISTS
// ──────────────────────────────────────────────
export const VIRTUAL_STYLISTS: VirtualStylist[] = [
  {
    id: "stylist-01",
    name: "NOVA",
    personality: "Minimalist Architect",
    speciality: "Clean silhouettes, tonal layering, and spatial elegance.",
    avatar: "🤍",
    tone: "Calm, precise, editorial",
    greeting: "Let's build something timeless. Less noise, more presence.",
    accentColor: "#00f2ff",
  },
  {
    id: "stylist-02",
    name: "BLAZE",
    personality: "Streetwear Maximalist",
    speciality: "Bold graphics, oversized fits, sneaker-culture obsession.",
    avatar: "🔥",
    tone: "Hype, energetic, Gen-Z slang",
    greeting: "Yo! Let's cook up something fire. What's the vibe today?",
    accentColor: "#ff6b35",
  },
  {
    id: "stylist-03",
    name: "AURA",
    personality: "Modest Luxury Expert",
    speciality: "Elevated modest fashion, cultural sensitivity, premium fabrics.",
    avatar: "✨",
    tone: "Warm, sophisticated, culturally aware",
    greeting: "Elegance begins with intention. Let me curate your signature look.",
    accentColor: "#c084fc",
  },
  {
    id: "stylist-04",
    name: "FLUX",
    personality: "Sneaker & Watch Specialist",
    speciality: "Sneaker science, horology culture, limited drops.",
    avatar: "⚡",
    tone: "Expert, collector-minded, enthusiast",
    greeting: "Checking the grail radar... Let's find your next icon piece.",
    accentColor: "#00ff9d",
  },
];

// ──────────────────────────────────────────────
// TREND RADAR
// ──────────────────────────────────────────────
export const TREND_RADAR: TrendItem[] = [
  { name: "Cyber-Modest", category: "aesthetic", momentum: 87, popularity: 78, forecast: "rising" },
  { name: "Obsidian Black", category: "color", momentum: 64, popularity: 91, forecast: "peaking" },
  { name: "Chunky Soles", category: "sneaker", momentum: -12, popularity: 72, forecast: "declining" },
  { name: "Neo-Utility Vest", category: "silhouette", momentum: 93, popularity: 45, forecast: "emerging" },
  { name: "Iridescent Accents", category: "material", momentum: 56, popularity: 62, forecast: "rising" },
  { name: "Digital Lavender", category: "color", momentum: 78, popularity: 54, forecast: "rising" },
  { name: "Futuristic Wrap", category: "aesthetic", momentum: 42, popularity: 38, forecast: "emerging" },
  { name: "Phantom White", category: "color", momentum: -5, popularity: 85, forecast: "peaking" },
  { name: "Retro-Runners", category: "sneaker", momentum: 91, popularity: 67, forecast: "rising" },
  { name: "Oversized Tech", category: "silhouette", momentum: 35, popularity: 88, forecast: "peaking" },
];

// ──────────────────────────────────────────────
// LIVE DROPS
// ──────────────────────────────────────────────
export const LIVE_DROPS: LiveDrop[] = [
  {
    id: "drop-001",
    product: MOCK_PRODUCTS[1], // Neon-Pulse Sneakers X1
    dropDate: new Date(Date.now() + 3600000 * 72).toISOString(), // 72 hours
    totalStock: 50,
    remainingStock: 50,
    rarity: "ultra-rare",
    hypeScore: 97,
    waitlistCount: 1240,
    exclusive: true,
  },
  {
    id: "drop-002",
    product: MOCK_PRODUCTS[2], // Vortex Chrono Watch
    dropDate: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours
    totalStock: 100,
    remainingStock: 0,
    rarity: "exclusive",
    hypeScore: 85,
    waitlistCount: 680,
  },
  {
    id: "drop-003",
    product: MOCK_PRODUCTS[0], // Cyber-Modest Tech Kaftan
    dropDate: new Date(Date.now() + 3600000 * 168).toISOString(), // 7 days
    totalStock: 200,
    remainingStock: 200,
    rarity: "limited",
    hypeScore: 72,
    waitlistCount: 340,
  },
];

// ──────────────────────────────────────────────
// FASHION REELS
// ──────────────────────────────────────────────
export const FASHION_REELS: FashionReel[] = [
  {
    id: "reel-001",
    type: "product",
    mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
    title: "CYBER-MODEST KAFTAN",
    subtitle: "Tech meets tradition",
    product: MOCK_PRODUCTS[0],
    likes: 2400,
    saves: 890,
  },
  {
    id: "reel-002",
    type: "outfit",
    mediaUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400&auto=format&fit=crop",
    title: "NEON PULSE DROP",
    subtitle: "Limited edition incoming",
    product: MOCK_PRODUCTS[1],
    likes: 5200,
    saves: 2100,
  },
  {
    id: "reel-003",
    type: "campaign",
    mediaUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    title: "VORTEX CHRONO",
    subtitle: "Time. Redefined.",
    product: MOCK_PRODUCTS[2],
    likes: 3800,
    saves: 1500,
  },
  {
    id: "reel-004",
    type: "trend",
    mediaUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop",
    title: "UTILITY ERA",
    subtitle: "The vest is back",
    product: MOCK_PRODUCTS[3],
    likes: 1900,
    saves: 720,
  },
  {
    id: "reel-005",
    type: "product",
    mediaUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop",
    title: "NEURAL AESTHETIC",
    subtitle: "AI-curated collection",
    likes: 4100,
    saves: 1800,
  },
];

// ──────────────────────────────────────────────
// BADGES
// ──────────────────────────────────────────────
export const ALL_BADGES: Badge[] = [
  { id: "badge-01", name: "First Login", description: "Welcome to the neural network", icon: "🌀", rarity: "common" },
  { id: "badge-02", name: "Style Seeker", description: "Viewed 10 products", icon: "👁️", rarity: "common" },
  { id: "badge-03", name: "Outfit Architect", description: "Created your first AI outfit", icon: "🏗️", rarity: "rare" },
  { id: "badge-04", name: "Drop Hunter", description: "Copped a limited drop", icon: "🎯", rarity: "rare" },
  { id: "badge-05", name: "Trend Prophet", description: "Identified 5 emerging trends", icon: "🔮", rarity: "epic" },
  { id: "badge-06", name: "Fashion Neural", description: "Reached Level 10", icon: "🧠", rarity: "epic" },
  { id: "badge-07", name: "Grail Collector", description: "Own 3 ultra-rare items", icon: "👑", rarity: "legendary" },
  { id: "badge-08", name: "Style Deity", description: "Fashion Score above 95", icon: "⚡", rarity: "legendary" },
];

// ──────────────────────────────────────────────
// COMMUNITY FITS
// ──────────────────────────────────────────────
export const COMMUNITY_FITS: CommunityFit[] = [
  {
    id: "fit-001",
    userId: "user-01",
    username: "cyber_nomad",
    avatar: "🤖",
    outfit: MOCK_OUTFITS[0],
    votes: 342,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aesthetic: "Cyber-Minimal",
  },
  {
    id: "fit-002",
    userId: "user-02",
    username: "neural_entity",
    avatar: "🔥",
    outfit: MOCK_OUTFITS[1],
    votes: 218,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aesthetic: "Streetwear Futurism",
  },
  {
    id: "fit-003",
    userId: "user-03",
    username: "modest_flux",
    avatar: "✨",
    outfit: MOCK_OUTFITS[2],
    votes: 567,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    aesthetic: "Tech-Modest",
  },
];

// ──────────────────────────────────────────────
// DEFAULT STYLE DNA
// ──────────────────────────────────────────────
export const DEFAULT_STYLE_DNA: StyleDNA = {
  dominantColors: ["Obsidian Black", "Cyber Cyan", "Phantom White"],
  preferredAesthetics: ["Cyber-Minimal", "Tech-Modest", "Streetwear Futurism"],
  favoriteCategories: ["modest-wear", "sneakers", "watches"],
  stylePersonality: "Neural Minimalist",
  fashionEra: "Future Primitive",
  wardrobeCompletion: 34,
  evolutionStage: 2,
  totalXP: 2450,
  level: 7,
  badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2]],
};
