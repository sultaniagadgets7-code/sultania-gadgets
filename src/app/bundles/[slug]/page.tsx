import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { AddBundleToCart } from './AddBundleToCart';
import { Badge } from '@/components/ui/Badge';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('bundles').select('title, description').eq('slug', slug).single();
  if (!data) return { title: 'Bundle Not Found' };
  return { title: `${data.title} Bundle`, description: data.description || '' };
}

export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: bundle } = await supabase
    .from('bundles')
    .select('*, bundle_items(quantity, product:products(id, slug, title, price, product_images(*)))')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!bundle) notFound();

  const items = bundle.bundle_items ?? [];
  const originalTotal = items.reduce((s: number, i: { quantity: number; product: { price: number } | null }) =>
    s + (i.product?.price ?? 0) * i.quantity, 0);
  const discountedTotal = Math.round(originalTotal * (1 - bundle.discount_percent / 100));
  const savings = originalTotal - discountedTotal;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {bundle.discount_percent > 0 && <Badge variant="sale">Save {bundle.discount_percent}%</Badge>}
        </div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight mb-2">{bundle.title}</h1>
        {bundle.description && <p className="text-gray-500">{bundle.description}</p>}
      </div>

      {/* Products in bundle */}
      <div className="space-y-4 mb-8">
        {items.map((item: { quantity: number; product: { id: string; slug: string; title: string; price: number; product_images?: { image_url: string; alt_text?: string | null }[] } | null }, i: number) => {
          if (!item.product) return null;
          return (
            <div key={i} className="flex items-center gap-4 bg-[#f7f7f7] rounded-[20px] p-4">
              <div className="relative w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0">
                <Image src={getPrimaryImage(item.product.product_images)} alt={item.product.title}
                  fill className="object-contain p-2" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}
                  className="font-semibold text-gray-900 hover:text-gray-500 transition-colors line-clamp-1">
                  {item.product.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-950 shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      <div className="bg-[#f7f7f7] rounded-[20px] p-5 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Original Total</span><span className="line-through">{formatPrice(originalTotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Bundle Discount ({bundle.discount_percent}%)</span><span>−{formatPrice(savings)}</span>
          </div>
        )}
        <div className="flex justify-between font-black text-gray-950 text-lg border-t border-gray-200 pt-2 mt-1">
          <span>Bundle Price</span><span>{formatPrice(discountedTotal)}</span>
        </div>
      </div>

      <AddBundleToCart bundle={bundle} items={items} />
    </div>
  );
}
