'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Heart, Star, LayoutDashboard } from 'lucide-react';

const nav = [
  { href: '/account',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/account/orders',   icon: ShoppingBag,     label: 'My Orders' },
  { href: '/account/wishlist', icon: Heart,           label: 'Wishlist' },
  { href: '/account/loyalty',  icon: Star,            label: 'Loyalty Points' },
  { href: '/account/profile',  icon: User,            label: 'Profile' },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar touch-manipulation">
      {nav.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/account' ? pathname === '/account' : pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap touch-target ${
              isActive
                ? 'bg-[#dc2626] text-white'
                : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`}
            style={{ touchAction: 'manipulation' }}>
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
