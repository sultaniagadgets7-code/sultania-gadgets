'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { getPrimaryImage } from '@/lib/utils';

interface BundleItem {
  quantity: number;
  product: {
    id: string; slug: string; title: string; price: number;
    product_images?: { image_url: string }[];
  } | null;
}

interface Props {
  bundle: { title: string; discount_percent: number };
  items: BundleItem[];
}

export function AddBundleToCart({ items }: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddAll() {
    for (const item of items) {
      if (!item.product) continue;
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.product.id,
          slug: item.product.slug,
          title: item.product.title,
          price: item.product.price,
          image: getPrimaryImage(item.product.product_images),
          maxQty: 10,
        });
      }
    }
    router.push('/checkout');
  }

  return (
    <button onClick={handleAddAll}
      className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors">
      <ShoppingBag className="w-4 h-4" aria-hidden="true" />
      Add Bundle to Cart — COD
    </button>
  );
}
