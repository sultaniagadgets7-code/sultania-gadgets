import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getUserWishlist } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { WishlistRemoveButton } from './WishlistRemoveButton';

export const metadata: Metadata = { title: 'Wishlist' };

export default async function WishlistPage() {
  const items = await getUserWishlist() as any[];

  if (!items.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Heart className="w-14 h-14 text-[#e2e8f0] mb-4" aria-hidden="true" />
      <p className="font-semibold text-[#64748b]">Your wishlist is empty</p>
      <p className="text-sm text-[#94a3b8] mt-1 mb-6">Save products you love to find them later.</p>
      <Link href="/shop" className="bg-[#0f172a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#1e293b] transition-colors touch-manipulation" style={{ touchAction: 'manipulation' }}>
        Browse Products
      </Link>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-[#94a3b8] mb-4">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {(items as any[]).map((item: any) => {
          const product = (item.product || {}) as any;
          if (!product.id) return null;
          const img = product.product_images?.[0]?.image_url || '/placeholder-product.jpg';
          return (
            <div key={item.id} className="group relative">
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative w-full aspect-square bg-[#f8fafc] rounded-2xl overflow-hidden mb-3">
                  <Image src={img} alt={product.product_images?.[0]?.alt_text || product.title}
                    fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw, 33vw" />
                </div>
                <p className="text-sm font-semibold text-[#0f172a] line-clamp-2 leading-snug mb-1">{product.title}</p>
                <p className="text-sm font-bold text-[#0f172a]">{formatPrice(product.price)}</p>
              </Link>
              <WishlistRemoveButton productId={product.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
