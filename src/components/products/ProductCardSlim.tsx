import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getPrimaryImage, getDiscountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types';

export function ProductCardSlim({ product }: { product: Product }) {
  const img = getPrimaryImage(product.product_images);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const pct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const oos = product.stock_quantity === 0;

  return (
    <Link href={`/product/${product.slug}`} className="group shrink-0 w-[160px] sm:w-[180px] block">
      <div className="relative w-full aspect-square bg-[#f7f7f7] rounded-[18px] overflow-hidden mb-3">
        <Image src={img} alt={product.title} fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="180px" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && <Badge variant="new">{product.badge}</Badge>}
          {hasDiscount && !product.badge && <Badge variant="sale">−{pct}%</Badge>}
        </div>
        {oos && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-[18px]">
            <span className="label text-gray-400 text-[9px]">Sold Out</span>
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-900 clamp-2 leading-snug mb-1 group-hover:text-gray-500 transition-colors">{product.title}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-gray-950">{formatPrice(product.price)}</span>
        {hasDiscount && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.compare_at_price!)}</span>}
      </div>
    </Link>
  );
}
