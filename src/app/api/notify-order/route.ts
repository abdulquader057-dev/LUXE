import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { validatePhone, validateUpiId, validateLength, escapeString } from "@/lib/security";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Request body is required" }, { status: 400 });
    }

    const {
      name,
      phone,
      address,
      city,
      pincode,
      paymentMethod,
      upi,
      items,
      subtotal,
      deliveryFee,
      total,
      orderId,
    } = body;

    // 1. Validate required fields presence
    if (
      typeof name !== "string" || !name.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof address !== "string" || !address.trim() ||
      typeof city !== "string" || !city.trim() ||
      typeof pincode !== "string" || !pincode.trim() ||
      typeof paymentMethod !== "string" ||
      !Array.isArray(items) || items.length === 0
    ) {
      return NextResponse.json({ success: false, error: "Required fields are missing or invalid" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const trimmedPincode = pincode.trim();
    const trimmedPayment = paymentMethod.trim();
    const trimmedUpi = typeof upi === "string" ? upi.trim() : "";
    const trimmedOrderId = typeof orderId === "string" ? orderId.trim() : "";

    // 2. Validate lengths
    if (
      !validateLength(trimmedName, 255) ||
      !validateLength(trimmedPhone, 255) ||
      !validateLength(trimmedAddress, 255) ||
      !validateLength(trimmedCity, 255) ||
      !validateLength(trimmedPincode, 255) ||
      !validateLength(trimmedPayment, 255) ||
      !validateLength(trimmedUpi, 255) ||
      !validateLength(trimmedOrderId, 255)
    ) {
      return NextResponse.json({ success: false, error: "Oversized inputs detected (max 255 characters)" }, { status: 400 });
    }

    // 3. Format validation
    if (!validatePhone(trimmedPhone)) {
      return NextResponse.json({ success: false, error: "Invalid phone number format" }, { status: 400 });
    }

    if (trimmedPayment !== "COD" && trimmedPayment !== "UPI") {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
    }

    if (trimmedPayment === "UPI" && (!trimmedUpi || !validateUpiId(trimmedUpi))) {
      return NextResponse.json({ success: false, error: "Invalid UPI ID format" }, { status: 400 });
    }

    // Validate and escape items
    const escapedItems = [];
    for (const item of items) {
      if (
        typeof item !== "object" || item === null ||
        typeof item.name !== "string" || !item.name.trim() ||
        (typeof item.price !== "number" && isNaN(Number(item.price))) ||
        (typeof item.quantity !== "number" && isNaN(Number(item.quantity)))
      ) {
        return NextResponse.json({ success: false, error: "Invalid items structure" }, { status: 400 });
      }
      escapedItems.push({
        id: typeof item.id === "string" ? escapeString(item.id.trim()) : "",
        name: escapeString(item.name.trim()),
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: typeof item.size === "string" ? escapeString(item.size.trim()) : "L",
        color: typeof item.color === "string" ? escapeString(item.color.trim()) : "White"
      });
    }

    // Escape inputs
    const escapedName = escapeString(trimmedName);
    const escapedPhone = escapeString(trimmedPhone);
    const escapedAddress = escapeString(trimmedAddress);
    const escapedCity = escapeString(trimmedCity);
    const escapedPincode = escapeString(trimmedPincode);
    const escapedPaymentMethod = escapeString(trimmedPayment);
    const escapedUpi = trimmedUpi ? escapeString(trimmedUpi) : "";
    const escapedOrderId = trimmedOrderId ? escapeString(trimmedOrderId) : "";


    // ─── Build WhatsApp message ───────────────────────────────────────────────
    const itemsText = escapedItems
      .map(
        (i: any) =>
          `• ${i.name} (Size: ${i.size || "L"}, Color: ${i.color || "White"}) x${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`
      )
      .join("\n");

    const waMsg =
      `🛍️ *New LUXE Order!*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Customer: ${escapedName}\n` +
      `📞 Phone: ${escapedPhone}\n` +
      `📍 Address: ${escapedAddress}, ${escapedCity} - ${escapedPincode}\n` +
      `💳 Payment: ${escapedPaymentMethod}${escapedPaymentMethod === "UPI" && escapedUpi ? ` (${escapedUpi})` : ""}\n\n` +
      `🛒 Items:\n${itemsText}\n\n` +
      `💰 Subtotal: ₹${subtotal}\n` +
      `🚚 Delivery: ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}\n` +
      `🧾 *Total: ₹${total}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔗 View in Admin: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`;

    const waLinks = {
      primary: `https://wa.me/917995338472?text=${encodeURIComponent(waMsg)}`,
      secondary: `https://wa.me/917337246297?text=${encodeURIComponent(waMsg)}`,
    };

    // ─── Send Email Notification ──────────────────────────────────────────────
    let emailSent = false;
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"LUXE Store" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🛍️ New LUXE Order – ₹${total} – ${escapedName}`,
        html: `
          <div style="font-family:sans-serif;background:#020203;color:#F9FAFB;padding:32px;border-radius:12px;max-width:600px;">
            <h1 style="color:#D4AF37;font-size:22px;margin-bottom:8px;">🛍️ New LUXE Order</h1>
            <hr style="border-color:#D4AF37;opacity:0.3;margin-bottom:20px;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="color:#aaa;padding:6px 0;">Customer</td><td style="font-weight:bold;">${escapedName}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Phone</td><td>${escapedPhone}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Address</td><td>${escapedAddress}, ${escapedCity} – ${escapedPincode}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Payment</td><td>${escapedPaymentMethod}${escapedPaymentMethod === "UPI" && escapedUpi ? ` (${escapedUpi})` : ""}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Delivery</td><td>${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Order ID</td><td>${escapedOrderId || "N/A"}</td></tr>
            </table>
            <h3 style="color:#D4AF37;margin-top:24px;">Items Ordered</h3>
            <pre style="background:#0A0A0C;padding:16px;border-radius:8px;font-size:13px;color:#F9FAFB;">${itemsText}</pre>
            <div style="background:#0A0A0C;border:1px solid #D4AF37;border-radius:8px;padding:16px;margin-top:16px;">
              <p style="margin:4px 0;">Subtotal: ₹${subtotal}</p>
              <p style="margin:4px 0;">Delivery: ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</p>
              <p style="margin:4px 0;font-size:18px;font-weight:bold;color:#D4AF37;">Total: ₹${total}</p>
            </div>
            <div style="margin-top:24px;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin"
                style="background:#D4AF37;color:#020203;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
                View in Admin Dashboard
              </a>
            </div>
            <p style="color:#555;font-size:11px;margin-top:24px;">Sent by LUXE Order Notification System</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    // ─── Log notification to Supabase ─────────────────────────────────────────
    const { error: logError } = await supabase.from("order_notifications").insert([
      {
        order_id: escapedOrderId || null,
        customer_name: escapedName,
        customer_phone: escapedPhone,
        total_amount: total,
        payment_method: escapedPaymentMethod,
        email_sent: emailSent,
        wa_primary_sent: true,
        wa_secondary_sent: true,
        payload: body,
        created_at: new Date().toISOString(),
      },
    ]);


    if (logError) {
      // Non-fatal: just log the error, don't fail the response
      console.warn("Could not log notification to Supabase:", logError.message);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      waLinks,
    });
  } catch (err: any) {
    console.error("notify-order route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
