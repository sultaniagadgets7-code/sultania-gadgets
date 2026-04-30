'use client';

import { RotateCcw } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

interface OrderItem {
  product_id?: string;
  product_title_snapshot: string;
  price_snapshot: number;
  quantity: number;
  product?: { slug?: string; product_images?: { image_url: string }[] };
}

export function ReorderButton({ items }: { items: OrderItem[] }) {
  const { addItem } = useCart();
  const [done, setDone] = useState(false);

  function handleReorder() {
    items.forEach((item) => {
      if (!item.product_id) return;
      addItem({
        id: item.product_id,
        slug: item.product?.slug || item.product_id,
        title: item.product_title_snapshot,
        price: item.price_snapshot,
        image: item.product?.product_images?.[0]?.image_url || '/placeholder-product.jpg',
        maxQty: 10,
      });
    });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      onClick={handleReorder}
      className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors touch-target"
      style={{ touchAction: 'manipulation' }}
    >
      <RotateCcw className="w-3 h-3" />
      {done ? 'Added!' : 'Reorder'}
    </button>
  );
}
