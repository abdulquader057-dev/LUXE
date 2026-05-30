/**
 * Utility functions for input validation and sanitization (XSS prevention).
 */

/**
 * Escapes special HTML characters to prevent XSS injection.
 */
export function escapeString(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates whether the given string is a valid UPI ID (username@bank).
 */
export function validateUpiId(upi: string): boolean {
  if (!upi) return false;
  const upiRegex = /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9\.\-_]+$/;
  return upi.length <= 255 && upiRegex.test(upi);
}

/**
 * Validates whether the given string is a valid phone number (10 to 15 digits).
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Validates whether the given string matches standard email formatting.
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length <= 255 && emailRegex.test(email);
}

/**
 * Validates that the input length does not exceed a maximum limit.
 */
export function validateLength(val: string | null | undefined, max: number = 255): boolean {
  if (!val) return true; // Empty checks are handled separately if required
  return val.length <= max;
}
