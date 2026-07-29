import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { z } from "zod";

// Password schema: minimum 10 characters with at least one uppercase,
// one lowercase, and one digit. Prevents weak/trivially-guessable passwords.
const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: prevent bot mass-registration (5 signups/min per IP)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitResult = await rateLimit(ip, 5, 60);
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many signup attempts. Please wait." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    const { email, password, fullName, phone, turnstileToken } = body;

    // Bot protection: verify Cloudflare Turnstile token before processing signup
    const turnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!turnstileValid) {
      return NextResponse.json({ error: "Bot verification failed. Please try again." }, { status: 403 });
    }

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

    // Password strength validation
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      return NextResponse.json({ error: passwordResult.error.issues[0].message }, { status: 400 });
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
