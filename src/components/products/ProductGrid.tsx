import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types';
import { PackageSearch } from 'lucide-react';

export function ProductGrid({ products, loading, emptyMessage = 'No products found.' }: {
  products: Product[]; loading?: boolean; emptyMessage?: string;
}) {
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );

  if (!products.length) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <PackageSearch className="w-14 h-14 text-gray-200 mb-4" aria-hidden="true" />
      <p className="text-gray-500 font-semibold">{emptyMessage}</p>
      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
