import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json();

    if (!amount || typeof amount !== "number" || !orderId) {
      return NextResponse.json({ error: "Invalid amount or orderId parameters" }, { status: 400 });
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
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId,
    });

    // Update the Supabase order with the Razorpay Order ID server-side
    const { data: dbOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("delivery_address")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      throw new Error(`Supabase fetch failed: ${fetchError.message}`);
    }

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

