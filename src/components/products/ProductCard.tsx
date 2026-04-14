import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getPrimaryImage, getDiscountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const img = getPrimaryImage(product.product_images);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const pct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const oos = product.stock_quantity === 0;
  const low = !oos && product.stock_quantity <= 3;

  return (
    <article className="card-root group">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative w-full aspect-square bg-[#f7f7f7] rounded-[20px] overflow-hidden mb-3.5">
          <Image src={img} alt={product.product_images?.[0]?.alt_text || product.title}
            fill className="card-img object-contain p-5"
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && <Badge variant={product.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}>{product.badge}</Badge>}
            {hasDiscount && !product.badge && <Badge variant="sale">−{pct}%</Badge>}
            {low && <Badge variant="low-stock">Low Stock</Badge>}
          </div>

          {/* OOS overlay */}
          {oos && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[20px]">
              <span className="label text-gray-400">Sold Out</span>
            </div>
          )}

          {/* Hover CTA */}
          {!oos && (
            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <AddToCartButton
                productId={product.id} slug={product.slug} title={product.title}
                price={product.price} image={img} maxQty={product.stock_quantity}
                className="w-full justify-center"
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="text-sm font-semibold text-gray-900 clamp-2 leading-snug mb-1.5 group-hover:text-gray-500 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-gray-950">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_at_price!)}</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Cash on Delivery</p>
        </div>
      </Link>
    </article>
  );
}
