import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateEmail, validatePhone, validateLength, escapeString } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, user_id, tier } = body;

    // 1. Validate required fields presence
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedAddress = typeof address === "string" ? address.trim() : "";
    const trimmedTier = typeof tier === "string" ? tier.trim() : "";

    // 2. Validate input lengths
    if (!validateLength(trimmedName, 255) ||
        !validateLength(trimmedPhone, 255) ||
        !validateLength(trimmedEmail, 255) ||
        !validateLength(trimmedAddress, 255) ||
        !validateLength(trimmedTier, 255)) {
      return NextResponse.json({ error: "Oversized input fields (max 255 characters)" }, { status: 400 });
    }

    // 3. Validate formats
    if (!validatePhone(trimmedPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 4. Escape inputs
    const sanitizedName = escapeString(trimmedName);
    const sanitizedPhone = escapeString(trimmedPhone);
    const sanitizedEmail = trimmedEmail ? escapeString(trimmedEmail) : null;
    const sanitizedAddress = trimmedAddress ? escapeString(trimmedAddress) : null;
    const sanitizedTier = trimmedTier ? escapeString(trimmedTier) : null;

    // Validate UUID format if user_id is provided
    let validUserId = null;
    if (user_id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id);
      if (isUuid) {
        validUserId = user_id;
      }
    }

    // 5. Insert into vip_migration table in Supabase
    const { error: dbError } = await supabase
      .from("vip_migration")
      .insert({
        name: sanitizedName,
        phone: sanitizedPhone,
        email: sanitizedEmail,
        address: sanitizedAddress,
        user_id: validUserId,
        tier: sanitizedTier || "Elite",
        joined_at: new Date().toISOString(),
      });

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "This account has already joined the Inner Circle" }, { status: 400 });
      }
      console.error("VIP Migration DB error:", dbError);
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully migrated to VIP" });
  } catch (error: any) {
    console.error("VIP Migration API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
