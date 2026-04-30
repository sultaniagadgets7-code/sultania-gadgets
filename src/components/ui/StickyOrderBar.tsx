'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Props {
  title: string;
  price: number;
  onOrder: () => void;
  isOutOfStock?: boolean;
}

export function StickyOrderBar({ title, price, onOrder, isOutOfStock }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show after scrolling past ~400px (past the order form)
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isOutOfStock) return null;

  return (
    <div
      className={`md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+8px)] left-0 right-0 z-40 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-3 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#94a3b8] font-medium truncate">{title}</p>
          <p className="text-base font-black text-[#0f172a]">{formatPrice(price)}</p>
        </div>
        <button
          onClick={() => {
            onOrder();
            document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="shrink-0 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full transition-colors flex items-center gap-2 touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <ShoppingBag className="w-4 h-4" />
          Order Now
        </button>
      </div>
    </div>
  );
}
