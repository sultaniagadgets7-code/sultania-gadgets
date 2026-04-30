import { createClient } from '@supabase/supabase-js';

// Service role client — bypasses RLS, use only in server actions
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error('Missing Supabase credentials:', { 
      hasUrl: !!url, 
      hasKey: !!key,
      keyPrefix: key?.substring(0, 10)
    });
    throw new Error('Missing Supabase admin credentials');
  }
  
  return createClient(url, key, {
    auth: { 
      autoRefreshToken: false, 
      persistSession: false 
    },
  });
}
