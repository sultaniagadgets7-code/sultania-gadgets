import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HorizontalScroll } from '@/components/ui/HorizontalScroll';
import { ProductCardSlim } from './ProductCardSlim';
import type { Product } from '@/types';

export function ProductCarousel({ title, subtitle, products, viewAllHref }: {
  title: string; subtitle?: string; products: Product[]; viewAllHref?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="py-8">
      {/* Header — hidden when title is empty (e.g. inside a custom section) */}
      {title && (
        <div className="flex items-end justify-between px-4 sm:px-6 mb-5">
          <div>
            {subtitle && <p className="label text-[#94a3b8] mb-1">{subtitle}</p>}
            <h2 className="heading-lg">{title}</h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref}
              className="flex items-center gap-1 text-xs font-semibold text-[#94a3b8] hover:text-[#0f172a] transition-colors uppercase tracking-widest shrink-0">
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      <div className="px-4 sm:px-6">
        <HorizontalScroll>
          {products.map((p) => <ProductCardSlim key={p.id} product={p} />)}
        </HorizontalScroll>
      </div>
    </section>
  );
}
