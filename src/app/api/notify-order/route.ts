import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    // ─── Build WhatsApp message ───────────────────────────────────────────────
    const itemsText = (items as any[])
      .map(
        (i: any) =>
          `• ${i.name} (Size: ${i.size || "L"}, Color: ${i.color || "White"}) x${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`
      )
      .join("\n");

    const waMsg =
      `🛍️ *New LUXE Order!*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Customer: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📍 Address: ${address}, ${city} - ${pincode}\n` +
      `💳 Payment: ${paymentMethod}${paymentMethod === "UPI" && upi ? ` (${upi})` : ""}\n\n` +
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
        subject: `🛍️ New LUXE Order – ₹${total} – ${name}`,
        html: `
          <div style="font-family:sans-serif;background:#020203;color:#F9FAFB;padding:32px;border-radius:12px;max-width:600px;">
            <h1 style="color:#D4AF37;font-size:22px;margin-bottom:8px;">🛍️ New LUXE Order</h1>
            <hr style="border-color:#D4AF37;opacity:0.3;margin-bottom:20px;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="color:#aaa;padding:6px 0;">Customer</td><td style="font-weight:bold;">${name}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Phone</td><td>${phone}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Address</td><td>${address}, ${city} – ${pincode}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Payment</td><td>${paymentMethod}${paymentMethod === "UPI" && upi ? ` (${upi})` : ""}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Delivery</td><td>${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</td></tr>
              <tr><td style="color:#aaa;padding:6px 0;">Order ID</td><td>${orderId || "N/A"}</td></tr>
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
        order_id: orderId || null,
        customer_name: name,
        customer_phone: phone,
        total_amount: total,
        payment_method: paymentMethod,
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
