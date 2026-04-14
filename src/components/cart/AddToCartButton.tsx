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

  const sizes = { sm: 'px-3 py-2 text-xs gap-1.5', md: 'px-5 py-3 text-xs gap-2', lg: 'px-7 py-4 text-sm gap-2' };

  return (
    <button onClick={handleAdd} disabled={maxQty === 0}
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-all duration-200',
        // Black normally, green on success — red is NOT used here (too aggressive for add to cart)
        added ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] hover:bg-gray-800 text-white',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        sizes[size], className
      )}
      aria-label={added ? 'Added to cart' : 'Add to cart'}>
      {added
        ? <><Check className="w-4 h-4" aria-hidden="true" /> Added</>
        : <><ShoppingBag className="w-4 h-4" aria-hidden="true" /> Add to Cart</>
      }
    </button>
  );
}
