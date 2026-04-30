'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

interface Props {
  productId: string; slug: string; title: string;
  price: number; image: string; maxQty: number;
  className?: string; size?: 'sm' | 'md' | 'lg';
}

export function AddToCartButton({ productId, slug, title, price, image, maxQty, className, size = 'md' }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id: productId, slug, title, price, image, maxQty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const sizes = { sm: 'px-3 py-2 text-xs gap-1.5 touch-target', md: 'px-5 py-3 text-xs gap-2 touch-target', lg: 'px-7 py-4 text-sm gap-2 touch-target' };

  return (
    <button onClick={handleAdd} disabled={maxQty === 0}
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-xl transition-all duration-200 touch-manipulation btn-3d',
        added ? 'bg-green-600 text-white' : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        sizes[size], className
      )}
      aria-label={added ? 'Added to cart' : 'Add to cart'}
      style={{ touchAction: 'manipulation' }}>
      {added
        ? <><Check className="w-4 h-4" aria-hidden="true" /> Added</>
        : <><ShoppingBag className="w-4 h-4" aria-hidden="true" /> Add to Cart</>
      }
    </button>
  );
}
