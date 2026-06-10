import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// XP amounts per event type
const XP_REWARDS: Record<string, number> = {
  'product_view':   5,   // Viewed product for >5s
  'swipe_right':    10,  // Liked a product
  'purchase':       50,  // Completed a purchase
  'share':          15,  // Shared a product
  'wishlist_add':   8,   // Added to wishlist
  'review_written': 25,  // Wrote a product review
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
          setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { eventType } = body || {};

    if (!eventType || !XP_REWARDS[eventType]) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    const xpGain = XP_REWARDS[eventType];

    // Fetch current style_dna row
    const { data: current } = await supabase
      .from('style_dna')
      .select('xp, level')
      .eq('id', user.id)
      .single();

    const currentXp = current?.xp ?? 0;
    const newXp = currentXp + xpGain;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > (current?.level ?? 1);

    // Upsert style_dna row, incrementing XP
    const { error: upsertError } = await supabase
      .from('style_dna')
      .upsert(
        { id: user.id, xp: newXp, level: newLevel, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error('XP upsert error:', upsertError);
      return NextResponse.json({ error: 'Failed to update XP' }, { status: 500 });
    }

    // Also update user metadata for client-side access
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
  } catch (err) {
    console.error('XP route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
