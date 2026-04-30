import Link from 'next/link';
import type { Category } from '@/types';

export function CategoryCarousel({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
  if (!categories.length) return null;

  return (
    <div className="w-full">
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
              ? 'bg-[#0f172a] text-white'
              : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
          }`}>
          All
        </Link>

        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              activeSlug === cat.slug
                ? 'bg-[#0f172a] text-white'
                : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
            }`}>
            {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
