import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    const { email, password, fullName, phone } = body;

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (
      email.length > 255 ||
      password.length > 255 ||
      fullName.length > 255 ||
      phone.length > 255
    ) {
      return NextResponse.json({ error: "Oversized inputs are rejected" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create and auto-confirm user using admin client (bypasses default SMTP verification)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        phone_number: phone.trim(),
      }
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Insert user profile into public.profiles table
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        email: normalizedEmail,
        role: "customer",
        full_name: fullName.trim(),
        phone_number: phone.trim()
      });

    if (profileErr) {
      console.error("Error upserting customer profile:", profileErr);
    }

    return NextResponse.json({ success: true, message: "User registered and auto-confirmed successfully." });
  } catch (err: any) {
    console.error("Signup endpoint exception:", err);
    return NextResponse.json({ error: err.message || "Signup failed" }, { status: 500 });
  }
}
