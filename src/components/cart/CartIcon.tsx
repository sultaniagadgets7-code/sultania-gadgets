'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function CartIcon() {
  const { count, openCart } = useCart();
  return (
    <button onClick={openCart}
      className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#0a0a0a]"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}>
      <ShoppingBag className="w-5 h-5" aria-hidden="true" />
      {count > 0 && (
        // Red badge — small accent, not overwhelming
        <span className="absolute top-1 right-1 bg-[#e01e1e] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
