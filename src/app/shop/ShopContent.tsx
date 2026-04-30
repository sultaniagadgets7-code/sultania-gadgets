'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryCarousel } from '@/components/ui/CategoryCarousel';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import type { Product, Category, ProductFilters } from '@/types';

interface Props { initialProducts: Product[]; categories: Category[]; initialFilters: ProductFilters; }

export function ShopContent({ initialProducts, categories, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const push = useCallback((f: ProductFilters) => {
    const p = new URLSearchParams();
    if (f.search) p.set('search', f.search);
    if (f.category && f.category !== 'all') p.set('category', f.category);
    if (f.minPrice) p.set('minPrice', f.minPrice);
    if (f.maxPrice) p.set('maxPrice', f.maxPrice);
    if (f.sort && f.sort !== 'newest') p.set('sort', f.sort);
    router.push(`${pathname}?${p.toString()}`);
  }, [router, pathname]);

  const set = (k: keyof ProductFilters, v: string) => setFilters((prev) => ({ ...prev, [k]: v }));
  const apply = () => { push(filters); setDrawerOpen(false); };
  const reset = () => { const r: ProductFilters = { search: '', category: 'all', minPrice: '', maxPrice: '', sort: 'newest' }; setFilters(r); push(r); setDrawerOpen(false); };

  const inp = 'w-full bg-[#f8fafc] border-0 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition';

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <p className="label text-[#94a3b8] mb-3">Price (PKR)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} className={inp} />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} className={inp} />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={apply} className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold label py-3 rounded-full transition-colors">Apply</button>
        <button onClick={reset} className="px-4 text-sm font-semibold text-[#94a3b8] hover:text-[#0f172a] transition-colors">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* Mobile search */}
      <div className="md:hidden px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" aria-hidden="true" />
          <input type="search" placeholder="Search products..." value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="w-full bg-[#f8fafc] border-0 rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            aria-label="Search" />
        </div>
      </div>

      {/* Category pills */}
      <div className="py-4 border-b border-[#e2e8f0]">
        <CategoryCarousel categories={categories} activeSlug={filters.category !== 'all' ? filters.category : undefined} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-xl hidden md:block">All Products</h1>
            <p className="text-sm text-[#94a3b8] mt-0.5">{initialProducts.length} products</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" aria-hidden="true" />
              <input type="search" placeholder="Search..." value={filters.search}
                onChange={(e) => set('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
                className="bg-[#f8fafc] border-0 rounded-full pl-11 pr-5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#dc2626]" />
            </div>
            {/* Sort */}
            <div className="relative">
              <select value={filters.sort}
                onChange={(e) => { set('sort', e.target.value); push({ ...filters, sort: e.target.value as ProductFilters['sort'] }); }}
                className="appearance-none bg-[#f8fafc] border-0 rounded-full pl-3 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#dc2626] cursor-pointer max-w-[130px] sm:max-w-none"
                aria-label="Sort">
                {[['newest','Newest'],['featured','Featured'],['price_asc','Price ↑'],['price_desc','Price ↓']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#94a3b8] pointer-events-none" />
            </div>
            {/* Mobile filter */}
            <button onClick={() => setDrawerOpen(!drawerOpen)}
              className="md:hidden flex items-center gap-1.5 bg-[#f8fafc] rounded-full px-3 py-2.5 text-xs font-semibold text-[#64748b]"
              aria-label="Filters">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {drawerOpen && (
          <div className="md:hidden bg-white border border-[#e2e8f0] rounded-[20px] p-5 mb-6 shadow-sm fade-up">
            <div className="flex justify-between items-center mb-5">
              <span className="font-bold text-[#0f172a]">Filters</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close"><X className="w-4 h-4 text-[#94a3b8]" /></button>
            </div>
            <Filters />
          </div>
        )}

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-48 shrink-0">
            <div className="sticky top-24">
              <p className="label text-[#94a3b8] mb-5">Filters</p>
              <Filters />
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <ProductGrid products={initialProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
