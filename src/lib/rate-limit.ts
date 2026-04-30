import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

export const rateLimitConfigs = {
  upload: { interval: 60000, maxRequests: 5 }, // 5 uploads per minute
  api: { interval: 60000, maxRequests: 60 }, // 60 requests per minute
  auth: { interval: 300000, maxRequests: 5 }, // 5 attempts per 5 minutes
  contact: { interval: 60000, maxRequests: 10 }, // 10 requests per minute for contact/newsletter
};

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ success: boolean; reset: number }> {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return { success: true, reset: now + config.interval };
  }

  if (record.count >= config.maxRequests) {
    return { success: false, reset: record.resetTime };
  }

  // Increment count
  record.count++;
  return { success: true, reset: record.resetTime };
}

export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
    }
  );
}

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 600000);
