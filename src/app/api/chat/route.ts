export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { rateLimit } from '@/lib/rateLimit';

const API_KEYS = [
  process.env.GEMINI_API_KEY || '',
  process.env.GEMINI_API_KEY_2 || '',
].filter(Boolean);

let currentKeyIndex = 0;

// Input sanitization: strips HTML tags and clamps input to 500 characters
function sanitizeInput(text: string): string {
  if (typeof text !== "string") return "";
  const clean = text.replace(/<\/?[^>]+(>|$)/g, "");
  return clean.slice(0, 500);
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const limitResult = await rateLimit(ip, 20, 60);
    if (!limitResult.success) {
      return NextResponse.json(
        { message: "Too many requests, please wait" },
        { status: 429 }
      );
    }

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

    const history: { role: string; parts: { text: string }[] }[] = [];
    const chatHistoryMessages = messages.filter((msg: { role: string; content: string }) => {
      const content = msg.content || "";
      return (
        !content.includes("Welcome to LUXE AI. I am your personal stylist.") &&
        !content.includes("I am LUXE, your Neural Style Consultant.") &&
        !content.includes("How shall we architect your silhouette today?")
      );
    }).slice(0, -1);

    for (const msg of chatHistoryMessages) {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Sanitize history messages content
      const cleanContent = sanitizeInput(msg.content);
      if (history.length > 0 && history[history.length - 1].role === role) {
        history[history.length - 1].parts[0].text += "\n" + cleanContent;
      } else {
        history.push({
          role,
          parts: [{ text: cleanContent }]
        });
      }
    }

    // Ensure history starts with 'user'. If it starts with 'model', remove it
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    const { supabaseAdmin } = await import('@/lib/supabase');

    // Fetch active products list with resilience fallback
    let dbCatalog: any[] | null = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('id, name');
      if (!error) {
        dbCatalog = data;
      }
    } catch (e) {
      console.warn("Supabase Catalog fetch failed in api/chat, falling back to empty:", e);
    }

    const catalogListString = dbCatalog && dbCatalog.length > 0
      ? dbCatalog.map((p: any, idx: number) => `${idx + 1}. ${p.name} [ID: ${p.id}]`).join('\n')
      : 'No products currently available in the catalog.';

    const latestMessage = messages[messages.length - 1].content;
    // 2. Sanitize user input
    const sanitizedLatestMessage = sanitizeInput(latestMessage);

    // Attempt with current key. Rotate and retry if it fails
    let attempt = 0;
    while (attempt < API_KEYS.length) {
      try {
        const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `You are Zyra, the exclusive AI style consultant for LUXE — a premium Indian fashion brand. You are warm and speak like a luxury personal stylist. Help customers with outfit recommendations, sizing (Indian charts: XS=34, S=36, M=38, L=40, XL=42, XXL=44), styling for Indian occasions (weddings, festive, casual, office), fabric care, and shipping info (standard 3-5 days across India, express 1-2 days to Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata). Never discuss competitor brands. Always end with a helpful follow-up question. Keep responses under 120 words unless asked for detail. Reply in the same language the customer uses — Hindi or English.

When recommending a product from our catalog, you must append a recommendation tag at the end of your response in the format: "[RECOMMEND: <product-uuid>]". For example, if you recommend a product, append "[RECOMMEND: <uuid>]" using the exact ID. Available products in our catalog are:
${catalogListString}
Do not discuss or recommend competitor brands.`;

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: systemPrompt }]
            },
            {
              role: "model",
              parts: [{ text: "Understood. I am LUXE AI. I am ready to curate the future of fashion for our clients." }]
            },
            ...history
          ]
        });

        const result = await chat.sendMessage(sanitizedLatestMessage);
        const response = await result.response;
        const text = response.text();

        // Parse recommendation tags
        const recommendRegex = /\[RECOMMEND:\s*([a-zA-Z0-9-]+)\]/g;
        const matches = [...text.matchAll(recommendRegex)];
        const recommendedIds = matches.map(m => m[1]);
        
        let recommendations: any[] = [];
        if (recommendedIds.length > 0) {
          try {
            const { data } = await supabaseAdmin
              .from('products')
              .select('*')
              .in('id', recommendedIds);
            
            if (data) {
              const { parseDbProduct } = await import('@/data/products');
              recommendations = data.map(parseDbProduct);
            }
          } catch (dbErr) {
            console.warn("Recommendations database query failed, using empty array:", dbErr);
          }
        }

        return NextResponse.json({ message: text, recommendations });
      } catch (error) {
        console.error('Error with API key index ' + currentKeyIndex, error instanceof Error ? error.message : String(error));
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempt++;
      }
    }

    throw new Error('All API keys failed or limit reached.');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    return NextResponse.json(
      { 
        message: "Neural uplink degraded. Zyra's cognitive core is currently offline. Please calibrate your system credentials or try again shortly.", 
        recommendations: [] 
      }, 
      { status: 503 }
    );
  }
}
