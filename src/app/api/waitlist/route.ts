import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateEmail, validateLength, escapeString } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email presence, format, and length
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail) || !validateLength(trimmedEmail, 255)) {
      return NextResponse.json({ error: "Invalid or oversized email address" }, { status: 400 });
    }

    // Escape input (sanitize)
    const sanitizedEmail = escapeString(trimmedEmail);

    // Save subscriber to waitlist table in Supabase
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email: sanitizedEmail });

    if (dbError) {
      console.error("Waitlist DB error:", dbError);
      return NextResponse.json({ error: "Failed to subscribe to waitlist" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error: any) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
