import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Missing authentication parameters" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Signature verification failed for Razorpay webhook.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Resolve payment details from payload
    const paymentEntity = payload.payload.payment?.entity;
    const orderId = paymentEntity?.order_id || payload.payload.order?.entity?.id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      return NextResponse.json({ status: "ignored", message: "No Razorpay Order ID in payload" });
    }

    // 1. Direct O(1) Index lookup by razorpay_order_id
    const { data: targetOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, status, delivery_address")
      .eq("razorpay_order_id", orderId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!targetOrder) {
      console.warn(`No order found matching Razorpay Order ID: ${orderId}`);
      return NextResponse.json({ status: "ignored", message: "Order not found" });
    }

    // 2. Parse existing address details
    let originalDetails = {};
    try {
      originalDetails = JSON.parse(targetOrder.delivery_address || "{}");
    } catch {
      originalDetails = { rawAddress: targetOrder.delivery_address };
    }

    // 3. Process events based on state machine rules
    let nextStatus: string | null = null;
    let paymentStatusText = "";

    if (event === "payment.captured" || event === "order.paid") {
      // Transition: Pending -> Paid
      if (targetOrder.status === "Pending") {
        nextStatus = "Paid";
        paymentStatusText = "SUCCESS";
      }
    } else if (event === "payment.failed") {
      // Transition: Pending -> failed
      if (targetOrder.status === "Pending") {
        nextStatus = "failed";
        paymentStatusText = "FAILED";
      }
    } else if (event === "refund.processed") {
      // Transition: Paid or delivered -> refunded
      if (targetOrder.status === "Paid" || targetOrder.status === "delivered" || targetOrder.status === "shipped") {
        nextStatus = "refunded";
        paymentStatusText = "REFUNDED";
        
        // Restore stock when order is refunded
        const { data: items } = await supabaseAdmin
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", targetOrder.id);

        if (items) {
          for (const item of items) {
            await supabaseAdmin.rpc("restore_stock", {
              p_product_id: item.product_id,
              p_quantity: item.quantity
            });
          }
        }
      }
    }

    if (nextStatus) {
      const updatedDetails = {
        ...originalDetails,
        razorpayPaymentId: paymentId || (originalDetails as any).razorpayPaymentId,
        paymentStatus: paymentStatusText,
      };

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: nextStatus,
          delivery_address: JSON.stringify(updatedDetails)
        })
        .eq("id", targetOrder.id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Razorpay Webhook handler exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
