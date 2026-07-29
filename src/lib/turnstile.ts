/**
 * Server-side Cloudflare Turnstile token verification.
 * Guards public form submissions (signup, waitlist, VIP) against bots.
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile is not configured, fail open in development but closed in production
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY is not configured in production. Rejecting request.");
      return false;
    }
    console.warn("TURNSTILE_SECRET_KEY not configured — skipping Turnstile verification in development.");
    return true;
  }

  if (!token || typeof token !== "string") {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification request failed:", err);
    return false;
  }
}
