'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HorizontalScroll } from '@/components/ui/HorizontalScroll';
import { ProductCardSlim } from './ProductCardSlim';
import { getRecentlyViewedIds } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/types';

interface RecentlyViewedProps {
  currentProductId: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ids = getRecentlyViewedIds().filter((id) => id !== currentProductId);
      if (!ids.length) { setLoading(false); return; }

      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*, product_images(*), category:categories(*)')
        .in('id', ids)
        .eq('is_active', true);

      if (data) {
        // Preserve the order from localStorage
        const ordered = ids
          .map((id) => data.find((p) => p.id === id))
          .filter(Boolean) as Product[];
        setProducts(ordered);
      }
      setLoading(false);
    }
    load();
  }, [currentProductId]);

  if (loading || !products.length) return null;

  return (
    <section className="border-t border-gray-100 max-w-7xl mx-auto py-8">
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
