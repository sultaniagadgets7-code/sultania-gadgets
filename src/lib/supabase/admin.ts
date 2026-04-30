import { createClient } from '@supabase/supabase-js';

// Service role client — bypasses RLS, use only in server actions
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  // Validate service role key — must be a JWT (starts with eyJ)
  const isValidServiceKey = serviceKey && serviceKey.startsWith('eyJ');

  if (!isValidServiceKey) {
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY is missing or invalid format. ' +
      'It must be a JWT token starting with "eyJ". ' +
      'Get it from: Supabase Dashboard → Project Settings → API → service_role key. ' +
      'Falling back to anon key (RLS will apply).'
    );
    // Fall back to anon key — some queries may fail due to RLS
    return createClient(url, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
