import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;
let warned = false;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token) {
  try {
    redis = new Redis({ url, token });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "60 s"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  } catch (err) {
    console.error("Failed to initialize Upstash Redis Rate Limiter:", err);
  }
}

// In-memory sliding-window fallback for local development or unconfigured deployments
const memoryCache = new Map<string, number[]>();

async function inMemoryRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const timestamps = memoryCache.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (validTimestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: validTimestamps[0] + windowMs
    };
  }
  
  validTimestamps.push(now);
  memoryCache.set(ip, validTimestamps);
  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    reset: now + windowMs
  };
}

/**
 * Serverless-safe rate limiter function.
 * Connects to Upstash Redis if available; otherwise falls back to a safe in-memory cache.
 */
export async function rateLimit(
  ip: string,
  limitCount = 20,
  windowSeconds = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (ratelimit && redis) {
    try {
      const currentRatelimit = (limitCount === 20 && windowSeconds === 60)
        ? ratelimit
        : new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limitCount, `${windowSeconds} s`),
            prefix: `@upstash/ratelimit:${limitCount}:${windowSeconds}`,
          });

      const result = await currentRatelimit.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset
      };
    } catch (err) {
      console.error("Upstash rate limiting error, falling back to in-memory:", err);
    }
  }

  if (!warned && !url) {
    console.warn("Upstash Redis credentials are not configured. Rate limiting is running in serverless-unsafe in-memory fallback mode.");
    warned = true;
  }

  return inMemoryRateLimit(ip, limitCount, windowSeconds * 1000);
}
