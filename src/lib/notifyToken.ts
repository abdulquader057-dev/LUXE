import * as crypto from "crypto";

const ALGORITHM = "sha256";
const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generates a short-lived HMAC-signed token binding a specific order ID
 * to the notify-order endpoint. Prevents unauthenticated callers from
 * spamming the admin notification channel.
 */
export function generateNotifyToken(orderId: string): string {
  const secret = process.env.NOTIFY_ORDER_SECRET;
  if (!secret) {
    throw new Error("NOTIFY_ORDER_SECRET is not configured");
  }

  const payload = `${orderId}:${Date.now()}`;
  const signature = crypto
    .createHmac(ALGORITHM, secret)
    .update(payload)
    .digest("hex");

  // Encode as base64 for safe transport: payload.signature
  return Buffer.from(`${payload}.${signature}`).toString("base64");
}

/**
 * Verifies that a notify token is valid and was issued for the given orderId
 * within the allowed TTL window. Guards against replay and forgery.
 */
export function verifyNotifyToken(token: string, orderId: string): boolean {
  const secret = process.env.NOTIFY_ORDER_SECRET;
  if (!secret) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;

    const payload = decoded.substring(0, lastDot);
    const providedSig = decoded.substring(lastDot + 1);

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac(ALGORITHM, secret)
      .update(payload)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig))) {
      return false;
    }

    // Parse payload and verify orderId + TTL
    const [tokenOrderId, timestampStr] = payload.split(":");
    if (tokenOrderId !== orderId) return false;

    const issuedAt = parseInt(timestampStr, 10);
    if (isNaN(issuedAt) || Date.now() - issuedAt > TOKEN_TTL_MS) return false;

    return true;
  } catch {
    return false;
  }
}
