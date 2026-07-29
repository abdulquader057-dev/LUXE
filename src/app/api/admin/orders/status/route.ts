import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

// State machine transition helper
function isValidTransition(current: string, next: string): boolean {
  if (current === next) return true;
  
  const transitions: Record<string, string[]> = {
    'Pending': ['Paid', 'cancelled', 'failed'],
    'Paid': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled'],
    'delivered': ['refunded'],
    'processing': ['shipped', 'cancelled'],
    'cancelled': [],
    'refunded': [],
    'failed': []
  };

  return (transitions[current] || []).includes(next);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: protect admin status transitions (30 requests/min per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitResult = await rateLimit(ip, 30, 60);
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'store-admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'orderId and newStatus are required' }, { status: 400 });
    }

    // Fetch current order status
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, status, customer_id')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 1. Enforce Server-Side State Transitions
    if (!isValidTransition(order.status, newStatus)) {
      return NextResponse.json({ 
        error: `Invalid transition from state ${order.status} to ${newStatus}` 
      }, { status: 400 });
    }

    // 2. Enforce stock restoration if transitioning to cancelled
    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      if (items && items.length > 0) {
        for (const item of items) {
          await supabaseAdmin.rpc('restore_stock', {
            p_product_id: item.product_id,
            p_quantity: item.quantity
          });
        }
      }
    }

    // 3. Perform update securely
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 4. Return success
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin order status change error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
