'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, Heart, Flame } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function MobileTabBar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();

  if (pathname.startsWith('/admin')) return null;
  if (pathname.startsWith('/checkout')) return null;

  const tabs = [
    { href: '/',               icon: Home,         label: 'Home',    action: null },
    { href: '/shop',           icon: LayoutGrid,   label: 'Shop',    action: null },
    { href: null,              icon: ShoppingCart, label: 'Cart',    action: 'cart' },
    { href: '/deals',          icon: Flame,        label: 'Deals',   action: null, red: true },
    { href: '/account/wishlist', icon: Heart,      label: 'Wishlist', action: null },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f] border-t border-white/10"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
      aria-label="Mobile navigation"
      role="navigation">
      <div className="flex items-center justify-around h-[56px]">
        {tabs.map(({ href, icon: Icon, label, action, red }) => {
          const active = href ? (href === '/' ? pathname === '/' : pathname.startsWith(href)) : false;

          if (action === 'cart') {
            return (
              <button key="cart" onClick={openCart}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-white/50 active:text-white transition-colors relative"
                aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                <div className="relative">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#dc2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none pulse-red">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          }

          return (
            <Link key={href} href={href!}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active
                  ? red ? 'text-[#dc2626]' : 'text-white'
                  : red ? 'text-[#dc2626]/60 active:text-[#dc2626]' : 'text-white/50 active:text-white'
              }`}
              aria-current={active ? 'page' : undefined}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} aria-hidden="true" />
                {active && (
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${red ? 'bg-[#dc2626]' : 'bg-[#dc2626]'}`} />
                )}
              </div>
              <span className={`text-[10px] font-semibold`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
