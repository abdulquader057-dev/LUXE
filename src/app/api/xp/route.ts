import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabase';

const XP_REWARDS: Record<string, number> = {
  'product_view':   5,
  'swipe_right':    10,
  'purchase':       50,
  'share':          15,
  'wishlist_add':   8,
  'review_written': 25,
};

const XP_PER_LEVEL = 400;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cs) => { try { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Per-user Rate Limiting: Max 30 XP events per user per hour
    const limitResult = await rateLimit(user.id, 30, 3600);
    if (!limitResult.success) {
      return NextResponse.json({ error: 'XP rate limit exceeded. Please wait before earning more XP.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const { eventType, referenceId } = body || {};

    if (!eventType || !XP_REWARDS[eventType]) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    if (!referenceId || typeof referenceId !== 'string') {
      return NextResponse.json({ error: 'referenceId is required for XP events' }, { status: 400 });
    }

    const xpGain = XP_REWARDS[eventType];

    // 2. Event verification for purchase events
    if (eventType === 'purchase') {
      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('id, customer_id, status')
        .eq('id', referenceId)
        .single();

      if (orderErr || !order) {
        return NextResponse.json({ error: 'Invalid order reference ID' }, { status: 400 });
      }

      if (order.customer_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden: Order does not belong to you' }, { status: 403 });
      }

      if (order.status !== 'Paid' && order.status !== 'delivered') {
        return NextResponse.json({ error: 'Order is not in a valid state for XP award' }, { status: 400 });
      }
    }

    // 3. Database-enforced Uniqueness via ON CONFLICT / constraint check
    const { error: insertErr } = await supabaseAdmin
      .from('xp_events')
      .insert({
        user_id: user.id,
        event_type: eventType,
        reference_id: referenceId,
        xp_awarded: xpGain
      });

    if (insertErr) {
      // Check if it's a unique constraint violation (Postgres error code 23505)
      if (insertErr.code === '23505') {
        return NextResponse.json({ error: 'XP already awarded for this action', xpGain: 0 }, { status: 409 });
      }
      console.error('Failed to log XP event:', insertErr);
      return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 });
    }

    // 4. Update the user's style_dna stats
    const { data: current } = await supabaseAdmin
      .from('style_dna')
      .select('xp, level')
      .eq('id', user.id)
      .single();

    const currentXp = current?.xp ?? 0;
    const newXp = currentXp + xpGain;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > (current?.level ?? 1);

    const { error: upsertError } = await supabaseAdmin
      .from('style_dna')
      .upsert(
        { id: user.id, xp: newXp, level: newLevel, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error('XP upsert error:', upsertError);
      return NextResponse.json({ error: 'Failed to update XP metadata' }, { status: 500 });
    }

    // Update user auth metadata for front-end access
    await supabase.auth.updateUser({
      data: {
        style_dna: {
          ...(user.user_metadata?.style_dna || {}),
          totalXP: newXp,
          level: newLevel,
        },
      },
    });

    return NextResponse.json({ xpGain, newXp, newLevel, leveledUp, eventType });
  } catch (err: any) {
    console.error('XP route error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
