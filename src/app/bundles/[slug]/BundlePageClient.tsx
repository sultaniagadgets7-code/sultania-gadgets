'use client';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Tag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface BundleProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  product_images?: { image_url: string; alt_text: string | null }[];
}

interface BundleItem {
  id: string;
  quantity: number;
  product: BundleProduct;
}

interface Bundle {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discount_percent: number;
  bundle_items: BundleItem[];
}

export function BundlePageClient({ bundle }: { bundle: Bundle }) {
  const { addItem, openCart } = useCart();
  const router = useRouter();

  const originalTotal = bundle.bundle_items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round((originalTotal * bundle.discount_percent) / 100);
  const bundleTotal = originalTotal - discountAmount;

  function handleAddBundle() {
    for (const item of bundle.bundle_items) {
      const img = item.product.product_images?.[0]?.image_url ?? '';
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.product.id,
          slug: item.product.slug,
          title: item.product.title,
          price: item.product.price,
          image: img,
          maxQty: 10,
        });
      }
    }
    openCart();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        {bundle.discount_percent > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-[#e01e1e] text-white text-sm font-bold px-4 py-1.5 rounded-full">
            <Tag className="w-3.5 h-3.5" />
            Save {bundle.discount_percent}%
          </span>
        )}
        <h1 className="text-3xl font-black text-gray-900">{bundle.title}</h1>
        {bundle.description && (
          <p className="text-gray-500 max-w-xl mx-auto">{bundle.description}</p>
        )}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bundle.bundle_items.map((item) => {
          const img = item.product.product_images?.[0]?.image_url;
          return (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
              {img ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <Image src={img} alt={item.product.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{item.product.title}</p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                )}
                <p className="text-[#e01e1e] font-bold text-sm mt-1">{formatPrice(item.product.price)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing summary */}
      <div className="bg-[#f7f7f7] rounded-2xl p-6 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Original Total</span>
          <span className="line-through">{formatPrice(originalTotal)}</span>
        </div>
        {bundle.discount_percent > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-semibold">
            <span>Bundle Discount ({bundle.discount_percent}%)</span>
            <span>- {formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3">
          <span>Bundle Price</span>
          <span className="text-[#e01e1e]">{formatPrice(bundleTotal)}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleAddBundle}
        className="w-full flex items-center justify-center gap-2 bg-[#e01e1e] hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest py-4 rounded-full transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        Add Bundle to Cart
      </button>
    </div>
  );
}
