import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AccountNav } from './AccountNav';

export const metadata: Metadata = {
  title: 'My Account — Sultania Gadgets',
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/account/orders');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <h1 className="font-black text-xl sm:text-2xl text-gray-950 tracking-tight mb-6">My Account</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <aside className="md:w-48 shrink-0">
          <AccountNav />
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
