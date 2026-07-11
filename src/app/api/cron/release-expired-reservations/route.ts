import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    // 1. Basic security check: verify CRON_SECRET if configured
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(req.url);
      const querySecret = url.searchParams.get('secret');
      if (querySecret !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 2. Call the database function to release expired stock reservations (defaults to 30 minutes)
    const { data: count, error } = await supabaseAdmin.rpc('release_expired_reservations', {
      p_expiry_minutes: 30
    });

    if (error) {
      console.error('Error executing release_expired_reservations RPC:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Released ${count} expired stock reservations successfully.` 
    });
  } catch (err: any) {
    console.error('Expired reservations cleanup cron error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST support for ease of webhook trigger configuration
export async function POST(req: Request) {
  return GET(req);
}
