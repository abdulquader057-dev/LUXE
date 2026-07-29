import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://va.vercel-scripts.com https://vercel.live https://www.googletagmanager.com https://unpkg.com https://cdn.jsdelivr.net https://*.gstatic.com https://challenges.cloudflare.com",
      "worker-src 'self' blob: data: https://unpkg.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' blob: data: https://images.unsplash.com https://images.pexels.com https://*.supabase.co https://*.supabase.in https://lh3.googleusercontent.com https://www.googletagmanager.com https://raw.githubusercontent.com",
      "connect-src 'self' blob: data: https://*.supabase.co https://*.supabase.in https://generativelanguage.googleapis.com https://va.vercel-scripts.com wss://*.supabase.co https://raw.githack.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://unpkg.com https://www.googletagmanager.com https://challenges.cloudflare.com",
      "frame-src 'self' https://vercel.live https://challenges.cloudflare.com",
      "frame-ancestors 'self' https://vercel.com https://*.vercel.com https://*.vercel.app",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
