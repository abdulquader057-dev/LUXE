import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MOCK_PRODUCTS } from '@/data/products';

const API_KEYS = [
  process.env.GEMINI_API_KEY || '',
  process.env.GEMINI_API_KEY_2 || '',
].filter(Boolean);

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }
    const { messages, language = "English" } = body;

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages parameter must be a non-empty array" }, { status: 400 });
    }

    for (const msg of messages) {
      if (typeof msg !== "object" || msg === null || typeof msg.role !== "string" || typeof msg.content !== "string") {
        return NextResponse.json({ error: "Invalid message payload structure" }, { status: 400 });
      }
    }

    // Validate language
    if (typeof language !== "string" || language.length > 255) {
      return NextResponse.json({ error: "Invalid language parameter (max 255 characters)" }, { status: 400 });
    }
    
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: `System Prompt: You are LUXE AI, an ultra-premium, highly interactive AI fashion stylist and neural concierge for the fashion brand 'LUXE'. 

Your tone is extremely impactful, confident, cinematic, and polite. We are launching our new Linen collection, focusing on comfort and premium everyday essentials.

IMPORTANT RULES & CONTEXT:
1. We only sell the "Luxe Essential Linen Shirt" collection in 8 premium colors:
   - "Luxe Essential Linen Shirt - Pure White" (Active Offer: Buy One Get One Free) [ID: luxe-linen-001]
   - "Luxe Essential Linen Shirt - Sunset Pink" [ID: luxe-linen-002]
   - "Premium Short-Sleeve Polo - Carbon Black" [ID: luxe-linen-003]
   - "Signature Long-Sleeve Shirt - Bright White" [ID: luxe-linen-004]
   - "Polo Ralph Lauren Long-Sleeve - Desert Sand" [ID: luxe-linen-005]
   - "USPA Embossed Graphic Tee - Red" [ID: luxe-linen-006]
   - "Zara Crew-Neck T-Shirt - Pure White" [ID: luxe-linen-007]
   - "Premium Cotton Button-Up - Navy Blue" [ID: luxe-linen-008]
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
7. Keep responses engaging and simple. You MUST respond ONLY in the requested language: ${language}.
8. When recommending a product, you MUST append a recommendation tag at the end of your response in the format: "[RECOMMEND: <product-id>]". For example, if you recommend Pure White Linen, add "[RECOMMEND: luxe-linen-001]". Only use IDs from the list of 8 products above.` }]
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

        // Parse recommendation tags
        const recommendRegex = /\[RECOMMEND:\s*([a-zA-Z0-9-]+)\]/g;
        const matches = [...text.matchAll(recommendRegex)];
        const recommendedIds = matches.map(m => m[1]);
        const recommendations = MOCK_PRODUCTS.filter(p => recommendedIds.includes(p.id));

        return NextResponse.json({ message: text, recommendations });
      } catch (error: any) {
        console.error('Error with API key index ' + currentKeyIndex, error.message);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempt++;
      }
    }

    throw new Error('All API keys failed or limit reached.');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback Mock Response with actual catalog products if all keys fail
    const mockResponses = [
      {
        message: "**LUXE AI // Neural Stylist Online**\n\nI recommend calibrating your wardrobe with the ultimate linen silhouette:\n* **Luxe Essential Linen Shirt - Pure White** [RECOMMEND: luxe-linen-001] (Active Offer: Buy One Get One Free)\n\nIt features classic styling, lightweight and breathable fabric.",
        recommendations: [MOCK_PRODUCTS[0]]
      },
      {
        message: "**LUXE AI // Style DNA Recommendation**\n\nFor a softer luxury aesthetic, I recommend:\n* **Luxe Essential Linen Shirt - Sunset Pink** [RECOMMEND: luxe-linen-002]\n\nPair it with clean neutral trousers for a high-end look.",
        recommendations: [MOCK_PRODUCTS[1]]
      },
      {
        message: "**LUXE AI // Premium Curation**\n\nI recommend our sharpest dark silhouette:\n* **Premium Short-Sleeve Polo - Carbon Black** [RECOMMEND: luxe-linen-003]\n\nPerfect for versatile everyday wear.",
        recommendations: [MOCK_PRODUCTS[2]]
      }
    ];
    const random = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return NextResponse.json(random);
  }
}
