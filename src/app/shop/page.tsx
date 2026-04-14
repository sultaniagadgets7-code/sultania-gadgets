import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { ShopContent } from './ShopContent';

export const metadata: Metadata = {
  title: 'Shop All Products — Sultania Gadgets',
  description: 'Browse all genuine tech accessories — chargers, earbuds, cables, power banks. Cash on delivery across Pakistan.',
};

interface ShopPageProps {
  searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'featured') || 'newest',
    }),
    getCategories(),
  ]);

  return (
    <Suspense>
      <ShopContent
        initialProducts={products}
        categories={categories}
        initialFilters={{
          search: params.search || '',
          category: params.category || 'all',
          minPrice: params.minPrice || '',
          maxPrice: params.maxPrice || '',
          sort: (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'featured') || 'newest',
        }}
      />
    </Suspense>
  );
}
