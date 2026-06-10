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

    // We listen to payment.captured or order.paid
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        console.log(`Razorpay Payment Captured for Order ID: ${orderId}, Payment ID: ${paymentId}`);

        // Update the order in Supabase to mark it as paid and processing
        // We find the order that contains the Razorpay order ID in its transaction details, or we query it.
        // Wait, when the order is created, we can save the Razorpay order ID directly in a column,
        // or inside the delivery_address JSON payload!
        // Wait! Let's check how the order is stored.
        // In the existing database schema, `orders` has columns:
        // `id` (uuid), `customer_id` (uuid), `total_price`, `status`, `delivery_address` (text).
        // Since we can't alter the `orders` schema dynamically easily without breaking anything,
        // we can store the Razorpay Order ID in the `delivery_address` JSON string,
        // or search for the order where `delivery_address` contains the Razorpay order ID!
        // Let's do that! That is extremely clever.
        // Or wait, when we query `orders`, we can select all pending orders and find the one that has the matching Razorpay order ID inside its `delivery_address`.
        
        // Let's query all 'processing' or 'Pending' orders and check their delivery_address JSON.
        const { data: pendingOrders, error: fetchError } = await supabaseAdmin
          .from("orders")
          .select("id, delivery_address")
          .eq("status", "Pending");

        if (fetchError) throw fetchError;

        let targetOrder = null;
        if (pendingOrders) {
          for (const order of pendingOrders) {
            try {
              const details = JSON.parse(order.delivery_address || "{}");
              if (details.razorpayOrderId === orderId) {
                targetOrder = order;
                break;
              }
            } catch (jsonErr) {
              // Not a JSON address
            }
          }
        }

        if (targetOrder) {
          // Update status to 'Paid' or 'processing'
          // We can also append the razorpayPaymentId in delivery_address to keep records!
          try {
            const originalDetails = JSON.parse(targetOrder.delivery_address || "{}");
            const updatedDetails = {
              ...originalDetails,
              razorpayPaymentId: paymentId,
              paymentStatus: "SUCCESS"
            };

            const { error: updateError } = await supabaseAdmin
              .from("orders")
              .update({
                status: "Paid",
                delivery_address: JSON.stringify(updatedDetails)
              })
              .eq("id", targetOrder.id);

            if (updateError) throw updateError;
            console.log(`Order status updated successfully for LUXE Order: ${targetOrder.id}`);
          } catch (updateErr) {
            console.error("Failed to update transaction state in Supabase:", updateErr);
          }
        } else {
          console.warn(`No pending order found matching Razorpay Order ID: ${orderId}`);
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Razorpay Webhook handler exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
