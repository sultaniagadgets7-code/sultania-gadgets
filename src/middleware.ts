import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Note: Next.js 16 shows a deprecation warning about middleware file convention.
// This will be addressed in Next.js 17. Current implementation is still fully functional.
// See: https://nextjs.org/docs/messages/middleware-to-proxy

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
