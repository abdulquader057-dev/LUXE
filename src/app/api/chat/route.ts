import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  process.env.NEXT_PUBLIC_GEMINI_API_KEY_2 || 'AIzaSyBaY7RnDcRRxE3ytOZfirGDC1OXR4C1urk',
].filter(Boolean);

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { messages, language = "English" } = await req.json();
    
    if (API_KEYS.length === 0) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Clean and alternate history to prevent validation issues with startChat
    const history: any[] = [];
    const chatHistoryMessages = messages.filter((msg: any) => {
      const content = msg.content || "";
      return (
        !content.includes("Welcome to LUXE AI. I am your personal stylist.") &&
        !content.includes("I am LUXE, your Neural Style Consultant.") &&
        !content.includes("How shall we architect your silhouette today?")
      );
    }).slice(0, -1);

    for (const msg of chatHistoryMessages) {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Ensure we alternate roles. If same role, append to the last text block
      if (history.length > 0 && history[history.length - 1].role === role) {
        history[history.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        history.push({
          role,
          parts: [{ text: msg.content }]
        });
      }
    }

    // Ensure history starts with 'user'. If it starts with 'model', remove it
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    const latestMessage = messages[messages.length - 1].content;

    // Attempt with current key. Rotate and retry if it fails
    let attempt = 0;
    while (attempt < API_KEYS.length) {
      try {
        const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: `System Prompt: You are LUXE AI, an ultra-premium, highly interactive AI fashion stylist and neural concierge for the fashion brand 'LUXE'. 

Your tone is extremely impactful, confident, cinematic, and polite. We are launching our new Linen collection, focusing on comfort and premium everyday essentials.

IMPORTANT RULES & CONTEXT:
1. We only sell the "Luxe Essential Linen Shirt" collection in 8 premium colors:
   - "Luxe Essential Linen Shirt - Pure White" (Active Offer: Buy One Get One Free)
   - "Luxe Essential Linen Shirt - Sky Blue" (Active Offer: Buy One Get One Free)
   - "Luxe Essential Linen Shirt - Desert Sand" (Active Offer: 10% Off Discount)
   - "Luxe Essential Linen Shirt - Olive Green" (Active Offer: 10% Off Discount)
   - "Luxe Essential Linen Shirt - Sunset Pink"
   - "Luxe Essential Linen Shirt - Navy Blue" (Active Offer: Buy One Get One Free)
   - "Luxe Essential Linen Shirt - Carbon Black"
   - "Luxe Essential Linen Shirt - Cocoa Brown"
2. All shirts are priced at ₹549 base. They are everyday essential, premium, and luxury-inspired (rates are minimal, with no extra charges or hidden charges).
3. The brand operates out of "Hafiz Baba Nagar, Hyderabad, Telangana, India".
4. Delivery rules:
   - Delivery is currently exclusive to Hyderabad.
   - Cash on Delivery (COD) is available and capped at ₹1,999.
   - Orders above ₹1,999 get free delivery.
   - Delivery is free within a 5 km radius from Baba Nagar. After 5 km, it charges ₹7.5 per km overall.
   - Prepaid orders unlock a 10% OFF coupon code for the next order.
5. Keep your recommendations structured with markdown (bullet points). Help the client choose the perfect colorway (pastel vs. dark vs. white) and size (M, L, XL, XXL).
6. Add a terminal tag at the end of your response, such as "[LINEN DNA: SYNCHRONIZED | TERMINAL: nominal]".
7. Keep responses engaging and simple. You MUST respond ONLY in the requested language: ${language}.` }]
            },
            {
              role: "model",
              parts: [{ text: "Understood. I am LUXE AI. I am ready to curate the future of fashion for our clients." }]
            },
            ...history
          ]
        });

        const result = await chat.sendMessage(latestMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text });
      } catch (error: any) {
        console.error('Error with API key index ' + currentKeyIndex, error.message);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempt++;
      }
    }

    throw new Error('All API keys failed or limit reached.');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback Mock Response for demo purposes if all keys fail
    const mockResponses = [
      "**LUXE AI // Neural Stylist Online**\n\nI recommend calibrating your wardrobe with the ultimate tactical ensemble:\n• **Oversized Stealth Abaya** (Matte Obsidian Black)\n• **Cyberpunk Cargo Pants** (Tactical Olive)\n• **Vortex Chrono Watch** (Titanium Chrome)\n\n*Would you prefer to calibrate this for an oversized look, or an athletic silhouette?*\n\n`[SYSTEM SYNC: 100% | CALIBRATION: NOMINAL]`",
      
      "**LUXE AI // Style DNA Recommendation**\n\nYour profile indicates a strong affinity for avant-garde Streetwear. Consider this curated combination:\n• **Oversized Matrix Hoodie** (Heavyweight French Terry)\n• **Neon-Pulse Sneakers X1** (Procedural Neon Glow)\n• **Vanguard Cyber Shield** (Reflective Glass)\n\n*Would you like me to add these items directly to your cart?*\n\n`[PROFILE INTEGRITY: SECURED | STYLE INDEX: 98.4%]`",
      
      "**LUXE AI // Modest Tech Curation**\n\nAchieve maximum coverage with maximum futuristic impact:\n• **Neural Layered Tunic** (Desert Sand)\n• **Titanium Draped Hijab** (Metallic Sheen)\n\n*Shall I customize this setup with custom laser-etched monogramming?*\n\n`[NEXUS CONNECT: ACTIVE | MONOGRAM: PENDING]`"
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return NextResponse.json({ message: randomResponse });
  }
}
