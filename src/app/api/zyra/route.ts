export const runtime = 'nodejs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabase';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit) { rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); return false; }
  if (now > limit.resetTime) { rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); return false; }
  if (limit.count >= 20) return true;
  limit.count += 1;
  return false;
}

function sanitize(text: string): string {
  if (typeof text !== 'string') return '';
  return text.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 500);
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  if (isRateLimited(ip)) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  let body: any;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }

  const { messages = [], styleDna } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Messages required', { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return new Response('API key not configured', { status: 500 });

  // Fetch catalog
  const { data: catalog } = await supabaseAdmin.from('products').select('id, name, category').eq('is_active', true);
  const catalogStr = catalog && catalog.length > 0
    ? catalog.map((p: any, i: number) => `${i+1}. ${p.name} [ID: ${p.id}]`).join('\n')
    : 'Catalog loading.';

  const dnaCtx = styleDna
    ? `This customer is Level ${styleDna.level} (${styleDna.xp} XP). ${styleDna.favoriteCategories?.length ? `Their style preferences: ${styleDna.favoriteCategories.join(', ')}.` : ''} ${styleDna.recentPurchases?.length ? `Recent purchases: ${styleDna.recentPurchases.slice(0,3).join(', ')}.` : ''}`
    : 'Customer style profile: new member.';

  const systemPrompt = `You are Zyra, the exclusive AI style oracle for LUXE — a premium Indian streetwear brand from Hyderabad. Speak like a warm luxury personal stylist. Help with outfit recommendations, sizing (Indian: XS=34, S=36, M=38, L=40, XL=42, XXL=44), styling for Indian occasions (weddings, festive, casual, streetwear, office). Keep responses under 100 words unless detail is asked. Always end with a styling follow-up question. Never mention competitor brands. ${dnaCtx}

Our current catalog:
${catalogStr}

When recommending a product, append [RECOMMEND: uuid] using the exact product ID.`;

  // Build history (exclude last message, that's the user's current message)
  const historyMsgs = messages.slice(0, -1).filter((m: any) =>
    !m.content?.includes('Welcome to LUXE') && !m.content?.includes('I am LUXE')
  );
  const history: { role: string; parts: { text: string }[] }[] = [];
  for (const msg of historyMsgs) {
    const role = msg.role === 'user' ? 'user' : 'model';
    const content = sanitize(msg.content);
    if (history.length > 0 && history[history.length - 1].role === role) {
      history[history.length - 1].parts[0].text += '\n' + content;
    } else {
      history.push({ role, parts: [{ text: content }] });
    }
  }
  if (history.length > 0 && history[0].role === 'model') history.shift();

  const userMessage = sanitize(messages[messages.length - 1].content);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am Zyra, your LUXE style oracle. Ready to curate your perfect look.' }] },
      ...history,
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(userMessage);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.enqueue(encoder.encode('\n[DONE]'));
        controller.close();
      } catch (err) {
        console.error('Zyra stream error:', err);
        controller.enqueue(encoder.encode('\n[ERROR] Neural uplink degraded. Please try again.'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
