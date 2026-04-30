import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account/orders';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Only check profile completeness if heading to checkout
      if (next === '/checkout' || next.startsWith('/checkout')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone, city, address')
          .eq('id', data.user.id)
          .single();

        const incomplete = !profile?.phone || !profile?.city || !profile?.address;
        if (incomplete) {
          return NextResponse.redirect(`${origin}/auth/login?next=${encodeURIComponent(next)}&needs_address=1`);
        }
      }

      // Go straight to destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — back to login
  return NextResponse.redirect(`${origin}/auth/login?next=${encodeURIComponent(next)}&error=oauth_failed`);
}
