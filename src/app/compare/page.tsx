'use client';

import { useCompare } from '@/lib/compare';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function ComparePage() {
  const { products, remove, clear } = useCompare();

  if (!products.length) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 text-center">
        <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-black text-gray-950 mb-2">No products to compare</h1>
        <p className="text-gray-500 mb-6">Add products to compare by clicking &ldquo;+ Compare&rdquo; on any product card.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-950">Compare Products</h1>
        <button
          onClick={clear}
          className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          {/* Product headers */}
          <thead>
            <tr>
              <th className="w-32 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest pb-4 pr-4">
                Feature
              </th>
              {products.map((p) => (
                <th key={p.id} className="pb-4 px-3 align-top">
                  <div className="bg-[#f7f7f7] rounded-[20px] p-4 relative">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label={`Remove ${p.title} from compare`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative w-full aspect-square mb-3">
                      <Image
                        src={getPrimaryImage(p.product_images)}
                        alt={p.title}
                        fill
                        className="object-contain p-2"
                        sizes="200px"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-left line-clamp-2 mb-2">{p.title}</p>
                    {p.badge && (
                      <Badge variant={p.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}>{p.badge}</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {/* Price */}
            <tr>
              <td className="py-4 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Price</td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-3 text-center">
                  <span className="text-base font-black text-gray-950">{formatPrice(p.price)}</span>
                  {p.compare_at_price && p.compare_at_price > p.price && (
                    <span className="block text-xs text-gray-400 line-through">{formatPrice(p.compare_at_price)}</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Condition */}
            <tr>
              <td className="py-4 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Condition</td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-3 text-center text-sm text-gray-700">{p.condition || '—'}</td>
              ))}
            </tr>

            {/* Compatibility */}
            <tr>
              <td className="py-4 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Compatibility</td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-3 text-center text-sm text-gray-700">{p.compatibility || '—'}</td>
              ))}
            </tr>

            {/* Stock */}
            <tr>
              <td className="py-4 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Stock</td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-3 text-center">
                  {p.stock_quantity === 0 ? (
                    <span className="text-xs font-semibold text-red-500">Out of Stock</span>
                  ) : p.stock_quantity <= 3 ? (
                    <span className="text-xs font-semibold text-amber-600">Only {p.stock_quantity} left</span>
                  ) : (
                    <span className="text-xs font-semibold text-green-600">In Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Specs */}
            {(() => {
              const allKeys = new Set<string>();
              products.forEach((p) => {
                if (p.specs_json) Object.keys(p.specs_json).forEach((k) => allKeys.add(k));
              });
              return Array.from(allKeys).map((key) => (
                <tr key={key}>
                  <td className="py-4 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">{key}</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-4 px-3 text-center text-sm text-gray-700">
                      {(p.specs_json as Record<string, string> | null)?.[key] || '—'}
                    </td>
                  ))}
                </tr>
              ));
            })()}

            {/* Order Now */}
            <tr>
              <td className="py-4 pr-4"></td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-3 text-center">
                  <Link
                    href={`/product/${p.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors w-full"
                  >
                    Order Now
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
