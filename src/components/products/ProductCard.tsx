import Link from 'next/link';
import Image from 'next/image';
import { Star, Zap } from 'lucide-react';
import { formatPrice, getPrimaryImage, getDiscountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { CompareButton } from '@/components/compare/CompareButton';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const img = getPrimaryImage(product.product_images);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const pct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const oos = product.stock_quantity === 0;
  const low = !oos && product.stock_quantity <= 3;

  return (
    <article className="card-root group cursor-pointer">
      <Link href={`/product/${product.slug}`} className="block touch-manipulation" style={{ touchAction: 'manipulation' }}>
        {/* Image container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[18px] overflow-hidden mb-3.5">
          <Image src={img} alt={product.product_images?.[0]?.alt_text || product.title}
            fill className="card-img object-contain p-3 sm:p-5"
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />

          {/* Shine overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

          {/* Top badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
            {product.badge && <Badge variant={product.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}>{product.badge}</Badge>}
            {hasDiscount && !product.badge && <Badge variant="sale">−{pct}%</Badge>}
            {low && <Badge variant="low-stock">Low Stock</Badge>}
          </div>

          {/* OOS overlay */}
          {oos && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[18px]">
              <span className="label text-[#64748b]">Sold Out</span>
            </div>
          )}

          {/* Desktop hover CTA — hidden on touch devices */}
          {!oos && (
            <div className="hidden sm:block absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 space-y-1.5">
              <AddToCartButton
                productId={product.id} slug={product.slug} title={product.title}
                price={product.price} image={img} maxQty={product.stock_quantity}
                className="w-full justify-center shadow-lg"
                size="sm"
              />
              <CompareButton product={product} className="w-full touch-target" size="sm" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-1 pb-1 sm:pb-3">
          <h3 className="text-sm font-bold text-[#0a0a0f] clamp-2 leading-snug mb-1.5 group-hover:text-[#dc2626] transition-colors duration-200">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base font-black text-[#0a0a0f]">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-xs text-[#94a3b8] line-through">{formatPrice(product.compare_at_price!)}</span>}
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5" aria-label="Highly rated">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="text-[10px] text-[#94a3b8] font-semibold ml-0.5">COD</span>
            </div>
            {product.price >= 100 && (
              <div className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] text-amber-600 font-bold">{Math.floor(product.price / 100)} pts</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile always-visible Add to Cart — only on touch devices */}
      {!oos && (
        <div className="sm:hidden px-1 pb-3">
          <AddToCartButton
            productId={product.id} slug={product.slug} title={product.title}
            price={product.price} image={img} maxQty={product.stock_quantity}
            className="w-full justify-center"
            size="sm"
          />
        </div>
      )}
    </article>
  );
}
