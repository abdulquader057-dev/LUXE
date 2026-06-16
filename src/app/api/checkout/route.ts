import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Request body is required" }, { status: 400 });
    }

    const { customer_id, total_price, status, delivery_address } = body;

    if (total_price === undefined || total_price === null) {
      return NextResponse.json({ success: false, error: "total_price is required" }, { status: 400 });
    }

    if (!delivery_address) {
      return NextResponse.json({ success: false, error: "delivery_address is required" }, { status: 400 });
    }

    // Insert order into the public.orders table using supabaseAdmin client
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          customer_id: customer_id || null,
          total_price,
          status: status || "Pending",
          delivery_address,
        }
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating order on server:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Internal server error in checkout API:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
