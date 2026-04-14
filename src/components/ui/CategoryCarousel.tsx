import Link from 'next/link';
import type { Category } from '@/types';

const cfg: Record<string, string> = {
  chargers: '⚡', earbuds: '🎧', cables: '🔗',
  accessories: '📱', 'power-banks': '🔋', adapters: '🔄',
};

export function CategoryCarousel({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
  if (!categories.length) return null;

  return (
    <div className="w-full">
      {/* Scrollable row — full width, no centering wrapper that blocks overflow */}
      <div
        className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-1"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <Link href="/shop"
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
            !activeSlug
              ? 'bg-[#0a0a0a] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          All
        </Link>

        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeSlug === cat.slug
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <span aria-hidden="true">{cfg[cat.slug] || '📦'}</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
