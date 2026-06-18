import { describe, it, expect, vi } from 'vitest';
import { escapeString, validateEmail, validatePhone } from '@/lib/security';
import { rateLimit } from '@/lib/rateLimit';

describe('Security Input Sanitization & Validation', () => {
  it('should escape HTML characters to prevent XSS injection', () => {
    const rawInput = '<script>alert("hack")</script>';
    const escaped = escapeString(rawInput);
    expect(escaped).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
  });

  it('should validate correct and incorrect email patterns', () => {
    expect(validateEmail('test@luxe.com')).toBe(true);
    expect(validateEmail('test-luxe.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should validate phone numbers containing between 10 and 15 digits', () => {
    expect(validatePhone('917337246297')).toBe(true);
    expect(validatePhone('+91 73372-46297')).toBe(true);
    expect(validatePhone('12345')).toBe(false); // Too short
  });
});

describe('Serverless Rate Limiting Fallback', () => {
  it('should rate-limit requests using in-memory fallback when redis is unconfigured', async () => {
    const ip = '192.168.1.100';
    
    // Simulate multiple fast rate-limit hits (limit = 3)
    const res1 = await rateLimit(ip, 3, 2);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = await rateLimit(ip, 3, 2);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await rateLimit(ip, 3, 2);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);

    const res4 = await rateLimit(ip, 3, 2);
    expect(res4.success).toBe(false); // Hit rate limit limit
  });
});
