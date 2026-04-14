import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchPageClient } from './SearchPageClient';
import type { Product } from '@/types';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: q ? `Search results for "${q}" on Sultania Gadgets` : 'Search products on Sultania Gadgets',
  };
}

async function SearchResults({ query }: { query: string }) {
  const supabase = await createClient();
  let products: Product[] = [];

  if (query.trim()) {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*), category:categories(*)')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,short_description.ilike.%${query}%`)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    products = (data as Product[]) || [];
  }

  return (
    <div>
      {query.trim() ? (
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-900">{products.length} result{products.length !== 1 ? 's' : ''}</span>
          {' '}for &ldquo;<span className="text-gray-700">{query}</span>&rdquo;
        </p>
      ) : (
        <p className="text-sm text-gray-500 mb-6">Enter a search term to find products.</p>
      )}
      <ProductGrid
        products={products}
        emptyMessage={`No products found for "${query}". Try browsing our shop.`}
      />
      {!products.length && query.trim() && (
        <div className="text-center mt-8">
          <a href="/shop" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Browse All Products
          </a>
        </div>
      )}
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-950 mb-4">Search</h1>
        <SearchPageClient initialQuery={q} />
      </div>
      <Suspense fallback={<ProductGrid products={[]} loading />}>
        <SearchResults query={q} />
      </Suspense>
    </div>
  );
}
