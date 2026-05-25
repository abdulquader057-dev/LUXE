import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages, language = "English" } = await req.json();
    
    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format the conversation history for Gemini
    // Gemini expects an array of { role: "user" | "model", parts: [{ text: "..." }] }
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const latestMessage = messages[messages.length - 1].content;

    // Start a chat session with system instruction context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `System Prompt: You are LUXE AI, an ultra-premium, highly sophisticated AI fashion stylist for the brand 'LUXE by SYEDS'. Your tone is elegant, confident, minimalist, and deeply knowledgeable about high-end techwear, avant-garde fashion, luxury aesthetics, and futuristic streetwear. You speak in a highly professional, polite, and cinematic manner. Keep your responses concise (2-4 sentences max unless asked for a detailed list). Recommend dark color palettes, chrome, silver, vantablack, and technical fabrics. Do not break character. IMPORTANT: You must ONLY respond in ${language}. Do not respond in English unless the requested language is English.` }]
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
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
