import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const { amount: clientAmount, orderId } = await request.json();

    if (!clientAmount || typeof clientAmount !== "number" || !orderId) {
      return NextResponse.json({ error: "Invalid amount or orderId parameters" }, { status: 400 });
    }

    // 1. Resolve & Authenticate Session Server-side
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Fetch order from the public.orders table server-side to guarantee integrity
    const { data: dbOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, total_price, customer_id, delivery_address")
      .eq("id", orderId)
      .single();

    if (fetchError || !dbOrder) {
      return NextResponse.json({ error: "Order record not found" }, { status: 404 });
    }

    // 3. Ownership Verification
    if (dbOrder.customer_id !== user.id) {
      return NextResponse.json({ error: "Access denied. Order owner mismatch." }, { status: 403 });
    }

    // 4. Server-Side Price Verification
    const serverTotalPrice = Number(dbOrder.total_price) || 0;
    if (Math.abs(serverTotalPrice - clientAmount) > 1) {
      return NextResponse.json({ error: "Price verification mismatch" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay API keys are missing in environment variables.");
      return NextResponse.json({ error: "Payment gateway credentials offline" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Amount must be in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(serverTotalPrice * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId,
    });

    // Update the Supabase order with the Razorpay Order ID server-side
    let updatedDetails = {};
    try {
      const originalDetails = JSON.parse(dbOrder.delivery_address || "{}");
      updatedDetails = {
        ...originalDetails,
        razorpayOrderId: order.id,
      };
    } catch {
      updatedDetails = {
        rawAddress: dbOrder.delivery_address,
        razorpayOrderId: order.id,
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        razorpay_order_id: order.id, // Write to new indexed column
        delivery_address: JSON.stringify(updatedDetails),
      })
      .eq("id", orderId);

    if (updateError) {
      throw new Error(`Supabase update failed: ${updateError.message}`);
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create payment order" }, { status: 500 });
  }
}
