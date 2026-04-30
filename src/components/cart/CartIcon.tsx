'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function CartIcon() {
  const { count, openCart } = useCart();
  return (
    <button onClick={openCart}
      className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white touch-manipulation"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}
      style={{ touchAction: 'manipulation' }}>
      <ShoppingBag className="w-5 h-5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-[#dc2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none pulse-red">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
