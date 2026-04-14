import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { User, ShoppingBag, Heart, Star } from 'lucide-react';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const nav = [
    { href: '/account/orders',  icon: ShoppingBag, label: 'My Orders' },
    { href: '/account/wishlist', icon: Heart,       label: 'Wishlist' },
    { href: '/account/loyalty',  icon: Star,        label: 'Loyalty Points' },
    { href: '/account/profile',  icon: User,        label: 'Profile' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-black text-2xl text-gray-950 tracking-tight mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-48 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
            {nav.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-[#f7f7f7] hover:text-gray-950 transition-colors whitespace-nowrap">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
