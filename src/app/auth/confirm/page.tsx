import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Confirming...' };

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const params = await searchParams;
  const { token_hash, type, next } = params;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as 'email' | 'recovery' | 'signup' });
    if (!error) {
      redirect(next || '/');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24 text-center">
      <h1 className="font-bold text-xl text-gray-950 mb-2">Confirmation Failed</h1>
      <p className="text-gray-500 text-sm mb-6">The link may have expired. Please try again.</p>
      <a href="/" className="text-sm font-semibold text-gray-950 underline underline-offset-4">Go Home</a>
    </div>
  );
}
