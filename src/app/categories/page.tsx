import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Shop by Category — Sultania Gadgets',
  description: 'Browse all mobile and laptop accessory categories. Chargers, earbuds, cables, power banks and more.',
};

export const revalidate = 600;

export default async function CategoriesPage() {
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts({ sort: 'newest' }),
  ]);

  // Count products per category
  const countMap: Record<string, number> = {};
  for (const p of allProducts) {
    if (p.category_id) {
      countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    }
  }

  const activeCategories = categories.filter((c) => (countMap[c.id] || 0) > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs text-[#94a3b8] mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0a0a0f] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#64748b]">Categories</span>
        </nav>
        <h1 className="heading-xl text-[#0a0a0f]">Shop by Category</h1>
        <p className="text-[#64748b] text-sm mt-2">{activeCategories.length} categories · {allProducts.length} products</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* All Products card */}
        <Link href="/shop"
          className="group bg-[#0a0a0f] rounded-[20px] p-5 sm:p-6 flex flex-col hover:bg-[#111] transition-all border border-[#0a0a0f] hover:border-[#dc2626] col-span-2 sm:col-span-1">
          <div className="text-4xl mb-3" aria-hidden="true">🛍️</div>
          <h2 className="text-white font-bold text-base mb-1">All Products</h2>
          <p className="text-[#64748b] text-xs mb-4">{allProducts.length} products</p>
          <span className="mt-auto inline-flex items-center gap-1.5 text-[#dc2626] text-xs font-bold group-hover:gap-2.5 transition-all">
            Browse All <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {activeCategories.map((cat) => {
          const count = countMap[cat.id] || 0;
          return (
            <Link key={cat.id} href={`/category/${cat.slug}`}
              className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-[20px] p-5 sm:p-6 flex flex-col hover:border-[#dc2626] hover:shadow-md transition-all">
              <div className="text-4xl mb-3" aria-hidden="true">{cat.emoji || '📦'}</div>
              <h2 className="text-[#0a0a0f] font-bold text-sm sm:text-base mb-1 group-hover:text-[#dc2626] transition-colors">{cat.name}</h2>
              {cat.description && (
                <p className="text-[#94a3b8] text-xs leading-relaxed mb-3 line-clamp-2 hidden sm:block">{cat.description}</p>
              )}
              <p className="text-[#94a3b8] text-xs mb-4">{count} product{count !== 1 ? 's' : ''}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[#dc2626] text-xs font-bold group-hover:gap-2.5 transition-all">
                Shop Now <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          );
        })}
      </div>

      {activeCategories.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#64748b]">No categories found.</p>
          <Link href="/shop" className="mt-4 inline-flex items-center gap-2 bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full hover:bg-[#b91c1c] transition-colors">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
