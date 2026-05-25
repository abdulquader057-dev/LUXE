import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  'AIzaSyBaY7RnDcRRxE3ytOZfirGDC1OXR4C1urk'
].filter(Boolean);

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { messages, language = "English" } = await req.json();
    
    if (API_KEYS.length === 0) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const latestMessage = messages[messages.length - 1].content;

    // We will attempt with the current key. If it fails due to limits/auth, we rotate and retry.
    let attempt = 0;
    while (attempt < API_KEYS.length) {
      try {
        const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "System Prompt: You are LUXE AI, an ultra-premium, highly sophisticated AI fashion stylist for the brand 'LUXE by SYEDS'. Your tone is elegant, confident, minimalist, and deeply knowledgeable about high-end techwear, avant-garde fashion, luxury aesthetics, and futuristic streetwear. You speak in a highly professional, polite, and cinematic manner. Keep your responses concise (2-4 sentences max unless asked for a detailed list). Recommend dark color palettes, chrome, silver, vantablack, and technical fabrics. Do not break character. IMPORTANT: You must ONLY respond in . Do not respond in English unless the requested language is English." }]
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
      "I recommend pairing our Quantum Runners with the Obsidian Hoodie for a sleek, functional look.",
      "The Aero-Tech Modest Set is currently trending. Its minimal silhouette is perfect for any occasion.",
      "Based on your aesthetic, you might appreciate our Vanta-Brutalist Coat. It absorbs light completely.",
      "I am LUXE AI. My neural network suggests the Cyberpunk Cargo Pants for ultimate utility and style."
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return NextResponse.json({ message: randomResponse });
  }
}
