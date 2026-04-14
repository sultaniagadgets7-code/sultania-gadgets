'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions';

export function WishlistRemoveButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    await toggleWishlist(productId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={handle} disabled={loading}
      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
      aria-label="Remove from wishlist">
      <X className="w-3.5 h-3.5" />
    </button>
  );
}
