import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing required verification fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Gateway configuration error" }, { status: 500 });
    }

    // Verify signature: HMACSha256(razorpay_order_id + "|" + razorpay_payment_id, keySecret)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed: Signature mismatch" }, { status: 400 });
    }

    // Update order status in database using admin client (bypassing RLS)
    const { data: orderData, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("delivery_address")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch order: ${fetchError.message}`);
    }

    let updatedDetails = {};
    try {
      const originalDetails = JSON.parse(orderData.delivery_address || "{}");
      updatedDetails = {
        ...originalDetails,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "SUCCESS",
      };
    } catch {
      updatedDetails = {
        rawAddress: orderData.delivery_address,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "SUCCESS",
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "Paid",
        delivery_address: JSON.stringify(updatedDetails),
      })
      .eq("id", orderId);

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    return NextResponse.json({ status: "verified" });
  } catch (error: any) {
    console.error("Verification endpoint exception:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
