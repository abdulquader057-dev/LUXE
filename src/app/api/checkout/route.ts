import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { calculateOrderPriceServerSide } from "@/lib/pricing";
import { rateLimit } from "@/lib/rateLimit";
import { generateNotifyToken } from "@/lib/notifyToken";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: prevent checkout abuse (10 requests/min per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitResult = await rateLimit(ip, 10, 60);
    if (!limitResult.success) {
      return NextResponse.json({ success: false, error: "Too many checkout requests. Please wait." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Request body is required" }, { status: 400 });
    }

    const { 
      items, 
      total_price: clientTotalPrice, 
      status, 
      delivery_address: deliveryAddressRaw, 
      activePlan = null, 
      couponDiscountPercent = 0, 
      distance = null 
    } = body;

    // 1. Mandatory Parameter Validations
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Items array is required and cannot be empty" }, { status: 400 });
    }
    if (clientTotalPrice === undefined || clientTotalPrice === null) {
      return NextResponse.json({ success: false, error: "total_price is required" }, { status: 400 });
    }
    if (!deliveryAddressRaw) {
      return NextResponse.json({ success: false, error: "delivery_address is required" }, { status: 400 });
    }

    // 2. Authentication & Session Resolution (Server-side session)
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Fallback: If auth fails, reject. Never trust customer_id from request body.
    const resolvedCustomerId = user?.id || null;

    // Parse delivery address payload to insert custom attributes
    let deliveryDetails: any = {};
    try {
      deliveryDetails = typeof deliveryAddressRaw === "string" 
        ? JSON.parse(deliveryAddressRaw) 
        : deliveryAddressRaw;
    } catch (e) {
      return NextResponse.json({ success: false, error: "delivery_address must be valid JSON" }, { status: 400 });
    }

    // 3. Server-Side Price Calculation & Verification
    let priceResult;
    try {
      priceResult = await calculateOrderPriceServerSide(
        items.map((it: any) => ({ id: it.id, quantity: it.quantity })),
        activePlan,
        Number(couponDiscountPercent) || 0,
        distance !== null ? Number(distance) : null
      );
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || "Pricing verification failed" }, { status: 400 });
    }

    // Grand total float tolerance comparison (allow 1 INR rounding diff)
    if (Math.abs(priceResult.grandTotal - Number(clientTotalPrice)) > 1) {
      return NextResponse.json({ 
        success: false, 
        error: `Price verification mismatch. Client: ${clientTotalPrice}, Server calculated: ${priceResult.grandTotal}` 
      }, { status: 400 });
    }

    // 4. Drop Gates Server-Side Verification
    for (const item of items) {
      const { data: gate } = await supabaseAdmin
        .from("drop_gates")
        .select("required_xp_level")
        .eq("product_id", item.id)
        .maybeSingle();

      if (gate) {
        if (!resolvedCustomerId) {
          return NextResponse.json({ 
            success: false, 
            error: `Product ${priceResult.dbProducts[item.id].name} is a level-gated drop. Please log in first.` 
          }, { status: 403 });
        }

        // Fetch user level
        const { data: dna } = await supabaseAdmin
          .from("style_dna")
          .select("level")
          .eq("id", resolvedCustomerId)
          .maybeSingle();

        const userLevel = dna?.level || 1;
        if (userLevel < gate.required_xp_level) {
          return NextResponse.json({
            success: false,
            error: `Gated item locked: Product requires level ${gate.required_xp_level}, your level is ${userLevel}.`
          }, { status: 403 });
        }
      }
    }

    // Format the items list for database insertion (adding server-validated unit price)
    const secureOrderItems = items.map((it: any) => ({
      id: it.id,
      quantity: it.quantity,
      unit_price: priceResult.dbProducts[it.id].price
    }));

    // Update delivery details JSON to capture server calculations
    deliveryDetails.calculatedPrice = priceResult;
    const finalDeliveryAddressString = JSON.stringify(deliveryDetails);

    // Determine initial status securely
    const finalStatus = status === "processing" ? "processing" : "Pending";

    // 5. Transaction-Safe Creation via Postgres secure runner
    const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc("create_order_secure", {
      p_customer_id: resolvedCustomerId,
      p_total_price: priceResult.grandTotal,
      p_delivery_address: finalDeliveryAddressString,
      p_items: secureOrderItems,
      p_status: finalStatus
    });

    if (rpcErr) {
      console.error("Secure order creation RPC error:", rpcErr);
      
      // Check if it was a user out-of-stock exception
      if (rpcErr.message && rpcErr.message.includes("OUT_OF_STOCK")) {
        return NextResponse.json({ 
          success: false, 
          error: rpcErr.message.replace("exception: ", "") 
        }, { status: 409 });
      }

      return NextResponse.json({ success: false, error: rpcErr.message }, { status: 500 });
    }

    // Generate a short-lived HMAC token so the client can call /api/notify-order
    // only for this specific order. Prevents unauthenticated notification spam.
    let notifyToken: string | null = null;
    try {
      notifyToken = generateNotifyToken(rpcRes.id);
    } catch {
      // Non-fatal: NOTIFY_ORDER_SECRET may not be configured yet
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: rpcRes.id, notifyToken } 
    });

  } catch (err: any) {
    console.error("Internal server error in checkout API:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
