import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryCarousel } from '@/components/ui/CategoryCarousel';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { Tag, Zap, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Deals & Discounts — Sultania Gadgets',
  description: 'Best deals on chargers, earbuds, cables and accessories. Limited time offers with cash on delivery.',
};

export default async function DealsPage() {
  const [allProducts, categories] = await Promise.all([
    getProducts({ sort: 'newest' }),
    getCategories(),
  ]);

  // Products with a compare_at_price (discounted)
  const saleProducts = allProducts.filter(
    (p) => p.compare_at_price && p.compare_at_price > p.price
  );

  // Sort by biggest discount first
  const sorted = [...saleProducts].sort((a, b) => {
    const pctA = getDiscountPercent(a.price, a.compare_at_price!);
    const pctB = getDiscountPercent(b.price, b.compare_at_price!);
    return pctB - pctA;
  });

  // Stats
  const maxDiscount = sorted.length > 0
    ? getDiscountPercent(sorted[0].price, sorted[0].compare_at_price!)
    : 0;

  const totalSavings = sorted.reduce((sum, p) => {
    return sum + (p.compare_at_price! - p.price);
  }, 0);

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#e01e1e 0,#e01e1e 1px,transparent 0,transparent 50%)', backgroundSize: '12px 12px' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#e01e1e] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              Limited Time Deals
            </div>
            <h1 className="display text-white mb-4">
              Deals &<br />
              <em className="not-italic text-[#e01e1e]">Discounts</em>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Genuine products at reduced prices. Cash on delivery. Tested before dispatch.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{sorted.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Products on Sale</p>
              </div>
              <div className="w-px bg-gray-800" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#e01e1e]">Up to {maxDiscount}%</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Off</p>
              </div>
              <div className="w-px bg-gray-800" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{formatPrice(totalSavings)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Total Savings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-[#e01e1e] py-3">
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-1 px-4">
          {['All prices include delivery', 'Cash on Delivery', 'Tested before dispatch', 'Easy exchange'].map((t) => (
            <span key={t} className="text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-300 inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="py-5 border-b border-gray-100">
        <CategoryCarousel categories={categories} />
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {sorted.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="heading-lg">Current Deals</h2>
                <p className="text-sm text-gray-400 mt-1">{sorted.length} products on sale</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Updated daily
              </div>
            </div>
            <ProductGrid products={sorted} />
          </>
        ) : (
          <div className="text-center py-24">
            <Zap className="w-14 h-14 text-gray-200 mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-bold text-xl text-gray-900 mb-2">No deals right now</h2>
            <p className="text-gray-400 text-sm mb-6">Check back soon — we update deals regularly.</p>
            <Link href="/shop"
              className="inline-flex items-center bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors">
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {sorted.length > 0 && (
        <section className="bg-[#f7f7f7] py-12 px-5 text-center">
          <p className="label text-gray-400 mb-2">Don&apos;t miss out</p>
          <h2 className="heading-xl mb-3">All deals include Cash on Delivery</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            No advance payment. Pay when your order arrives at your door.
          </p>
          <Link href="/shop"
            className="inline-flex items-center bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors">
            View All Products
          </Link>
        </section>
      )}
    </div>
  );
}
