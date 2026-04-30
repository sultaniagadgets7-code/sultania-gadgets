'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions';
import { cn } from '@/lib/utils';

export function WishlistButton({ productId, initialWishlisted = false }: {
  productId: string; initialWishlisted?: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    const result = await toggleWishlist(productId);
    if (result.success) setWishlisted(result.wishlisted);
    setLoading(false);
  }

  return (
    <button onClick={handle} disabled={loading}
      className={cn(
        'w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 touch-manipulation',
        wishlisted
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'bg-[#f8fafc] border-transparent text-[#94a3b8] hover:text-red-400 hover:bg-red-50'
      )}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
      style={{ touchAction: 'manipulation' }}>
      <Heart className={cn('w-5 h-5 transition-transform', wishlisted && 'fill-current scale-110')} aria-hidden="true" />
    </button>
  );
}
