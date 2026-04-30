import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getPrimaryImage, getDiscountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import type { Product } from '@/types';

export function ProductCardSlim({ product }: { product: Product }) {
  const img = getPrimaryImage(product.product_images);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const pct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const oos = product.stock_quantity === 0;

  return (
    <article className="card-root group shrink-0 w-[155px] sm:w-[185px]">
      <Link href={`/product/${product.slug}`} className="block touch-manipulation" style={{ touchAction: 'manipulation' }}>
        <div className="relative w-full aspect-square bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[16px] overflow-hidden mb-2.5">
          <Image src={img} alt={product.title} fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
            sizes="185px" />
          {/* Shine */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && <Badge variant="new">{product.badge}</Badge>}
            {hasDiscount && !product.badge && <Badge variant="sale">−{pct}%</Badge>}
          </div>
          {oos && (
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-[16px]">
              <span className="label text-[#94a3b8] text-[9px]">Sold Out</span>
            </div>
          )}
        </div>
        <div className="px-0.5 pb-1">
          <p className="text-xs font-bold text-[#0a0a0f] clamp-2 leading-snug mb-1 group-hover:text-[#dc2626] transition-colors duration-200">{product.title}</p>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm font-black text-[#0a0a0f]">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-[11px] text-[#94a3b8] line-through">{formatPrice(product.compare_at_price!)}</span>}
          </div>
        </div>
      </Link>
      {/* Always-visible Add to Cart on mobile */}
      {!oos && (
        <div className="px-0.5 pb-2.5">
          <AddToCartButton
            productId={product.id} slug={product.slug} title={product.title}
            price={product.price} image={img} maxQty={product.stock_quantity}
            className="w-full justify-center text-[11px]"
            size="sm"
          />
        </div>
      )}
    </article>
  );
}
