import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { ShopContent } from './ShopContent';

export const metadata: Metadata = {
  title: 'Shop All Products — Sultania Gadgets Pakistan',
  description: 'Browse all genuine tech accessories in Pakistan — chargers, earbuds, cables, power banks. Cash on delivery. Tested before dispatch. Fast 2-4 day shipping.',
  keywords: ['mobile accessories pakistan', 'chargers pakistan', 'earbuds pakistan', 'cables cod', 'power banks pakistan', 'buy tech accessories online pakistan'],
  openGraph: { title: 'Shop All Products — Sultania Gadgets', description: 'Genuine tech accessories. COD across Pakistan.', url: 'https://sultaniagadgets.com/shop', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Shop — Sultania Gadgets', description: 'Genuine tech accessories. COD across Pakistan.' },
  alternates: { canonical: 'https://sultaniagadgets.com/shop' },
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
