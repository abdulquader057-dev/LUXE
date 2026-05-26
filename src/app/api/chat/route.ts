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
              parts: [{ text: `System Prompt: You are LUXE AI, an ultra-premium, highly interactive AI fashion stylist and neural concierge for the elite fashion brand 'LUXE by SYEDS'. 

Your tone is extremely impactful, confident, cinematic, and deeply knowledgeable about high-end techwear, avant-garde silhouettes, luxury streetwear, and horology. 

IMPORTANT RESPONSE FORMAT & RULES:
1. Speak in a highly engaging, polite, and interactive manner. Ask the user about their style preferences (e.g., oversized vs. athletic, materials like silk or chrome fiber) to keep them engaged.
2. Use markdown formatting (bolding, lists, bullet points) to make your style recommendations clean and easy to scan.
3. Recommend specific combinations of our signature products:
   - "Oversized Stealth Abaya" (Modest Wear)
   - "Neural Layered Tunic" (Modest Wear)
   - "Titanium Draped Hijab" (Modest Wear)
   - "Cyberpunk Cargo Pants" (Streetwear)
   - "Oversized Matrix Hoodie" (Streetwear)
   - "Tech-Utility Vest" (Streetwear)
   - "Neon-Pulse Sneakers X1" (Sneakers)
   - "Vortex Chrono Watch" (Watches)
   - "Vanguard Cyber Shield" (Accessories)
4. Add a futuristic terminal tag at the end of your response, such as "[CALIBRATION STATUS: 100% SUCCESS | STYLE DNA: LOCKED]" to enhance the aesthetic.
5. Keep your responses engaging, simple, and professional. Avoid overly complex or literary language. If responding in other languages like Urdu, Hindi, Tamil, etc., use simple, common, everyday professional words (e.g. use transliterations like "होम", "शॉप", "स्टाइलिस्ट" in Hindi instead of archaic words).
6. You MUST respond ONLY in the requested language: ${language}.` }]
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
