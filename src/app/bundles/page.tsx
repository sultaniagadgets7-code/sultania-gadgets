import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Product Bundles — Save More | Sultania Gadgets Pakistan',
  description: 'Shop curated product bundles in Pakistan. Get chargers, earbuds, cables and accessories together at discounted prices. Cash on delivery nationwide.',
  keywords: ['product bundles pakistan', 'tech accessories bundle', 'charger earbuds bundle', 'buy bundle online pakistan', 'cod bundle deals'],
  alternates: { canonical: 'https://sultaniagadgets.com/bundles' },
  openGraph: {
    title: 'Product Bundles — Save More | Sultania Gadgets',
    description: 'Curated tech bundles at discounted prices. COD across Pakistan.',
    url: 'https://sultaniagadgets.com/bundles',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Product Bundles — Sultania Gadgets', description: 'Save more with curated tech bundles. COD Pakistan.' },
};

export default async function BundlesPage() {
  const supabase = await createClient();
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*, bundle_items(quantity, product:products(id, slug, title, price, product_images(*)))')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!bundles || bundles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Bundles Available</h1>
        <p className="text-gray-500 mb-8">Check back soon for amazing bundle deals!</p>
        <Link href="/shop" className="inline-flex bg-[#0a0a0a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Shop All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <p className="label text-gray-400 mb-2">Save More</p>
        <h1 className="heading-xl mb-3">Product Bundles</h1>
        <p className="text-gray-500">Get multiple products together at discounted prices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle: any) => {
          const items = bundle.bundle_items ?? [];
          const originalTotal = items.reduce((s: number, i: any) =>
            s + (i.product?.price ?? 0) * i.quantity, 0);
          const discountedTotal = Math.round(originalTotal * (1 - bundle.discount_percent / 100));
          const savings = originalTotal - discountedTotal;

          return (
            <Link key={bundle.id} href={`/bundles/${bundle.slug}`}
              className="group bg-white border border-gray-100 rounded-[24px] p-6 hover:border-[#e01e1e] transition-all hover:shadow-lg">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-950 mb-1 group-hover:text-[#e01e1e] transition-colors">
                    {bundle.title}
                  </h2>
                  {bundle.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{bundle.description}</p>
                  )}
                </div>
                {bundle.discount_percent > 0 && (
                  <Badge variant="sale">Save {bundle.discount_percent}%</Badge>
                )}
              </div>

              {/* Products preview */}
              <div className="flex flex-wrap gap-2 mb-4">
                {items.slice(0, 4).map((item: any, i: number) => {
                  if (!item.product) return null;
                  return (
                    <div key={i} className="relative w-16 h-16 bg-[#f7f7f7] rounded-xl overflow-hidden">
                      <Image
                        src={getPrimaryImage(item.product.product_images)}
                        alt={item.product.title}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    </div>
                  );
                })}
                {items.length > 4 && (
                  <div className="w-16 h-16 bg-[#f7f7f7] rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">+{items.length - 4}</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-black text-gray-950">{formatPrice(discountedTotal)}</span>
                {savings > 0 && (
                  <>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(originalTotal)}</span>
                    <span className="text-sm font-semibold text-green-600">Save {formatPrice(savings)}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{items.length} products included</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
