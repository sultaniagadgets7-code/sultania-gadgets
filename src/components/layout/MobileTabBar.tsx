'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, MessageCircle } from 'lucide-react';

const tabs = [
  { href: '/',        icon: Home,          label: 'Home' },
  { href: '/shop',    icon: LayoutGrid,    label: 'Shop' },
  { href: '/contact', icon: MessageCircle, label: 'Support' },
];

export function MobileTabBar() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active ? 'text-[#0a0a0a]' : 'text-gray-400'
              }`}
              aria-current={active ? 'page' : undefined}>
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform duration-200`} aria-hidden="true" />
              <span className="text-[10px] font-semibold">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[#e01e1e] mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
