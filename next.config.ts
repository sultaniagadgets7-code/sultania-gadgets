import type { NextConfig } from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 days
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      allowedOrigins: isDev 
        ? ['localhost:3000']
        : ['sultaniagadgets.com', 'www.sultaniagadgets.com', 'sultania-gadgets.vercel.app'],
    },
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js', '@supabase/ssr'],
    // Reduce prefetch timeout to avoid QUIC errors
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { 
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://embed.tawk.to https://static.cloudflareinsights.com",
              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://embed.tawk.to https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev https://www.google-analytics.com https://www.facebook.com https://connect.facebook.net https://cloudflareinsights.com",
              "frame-src https://embed.tawk.to",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; ')
          },
        ],
      },
      // Aggressive caching for static assets
      {
        source: '/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache JS/CSS chunks
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // No caching for API routes — auth cookies must not be cached
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

if (!isDev) {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}

export default nextConfig;
