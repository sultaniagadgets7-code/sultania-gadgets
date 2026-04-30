'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HorizontalScroll } from '@/components/ui/HorizontalScroll';
import { ProductCardSlim } from './ProductCardSlim';
import { getRecentlyViewedIds } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/types';

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds().filter((id) => id !== currentProductId);
    if (!ids.length) return;

    const supabase = createClient();
    supabase
      .from('products')
      .select('id, slug, title, price, compare_at_price, badge, stock_quantity, product_images(image_url, alt_text, sort_order)')
      .in('id', ids)
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) {
          const ordered = ids
            .map((id) => data.find((p) => p.id === id))
            .filter(Boolean) as Product[];
          setProducts(ordered);
        }
      });
  }, [currentProductId]);

  if (!products.length) return null;

  return (
    <section className="border-t border-[#e2e8f0] max-w-7xl mx-auto py-8">
      <div className="flex items-end justify-between px-4 sm:px-6 mb-5">
        <h2 className="heading-lg">Recently Viewed</h2>
      </div>
      <div className="px-4 sm:px-6">
        <HorizontalScroll>
          {products.map((p) => <ProductCardSlim key={p.id} product={p} />)}
        </HorizontalScroll>
      </div>
    </section>
  );
}
