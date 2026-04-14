import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  productId: string;
  categoryId: string | null;
}

async function getFrequentlyBoughtTogether(productId: string, categoryId: string | null): Promise<Product[]> {
  const supabase = await createClient();

  // Find order_ids that contain the current product
  const { data: currentItems } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', productId);

  if (currentItems && currentItems.length > 0) {
    const orderIds = currentItems.map((i) => i.order_id);

    // Find other products in those orders
    const { data: coItems } = await supabase
      .from('order_items')
      .select('product_id')
      .in('order_id', orderIds)
      .neq('product_id', productId);

    if (coItems && coItems.length > 0) {
      // Count frequency
      const freq: Record<string, number> = {};
      for (const item of coItems) {
        freq[item.product_id] = (freq[item.product_id] || 0) + 1;
      }

      const topIds = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id);

      if (topIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('*, product_images(*), category:categories(*)')
          .in('id', topIds)
          .eq('is_active', true);

        if (products && products.length > 0) {
          return products as Product[];
        }
      }
    }
  }

  // Fallback: same-category products
  if (!categoryId) return [];
  const { data: fallback } = await supabase
    .from('products')
    .select('*, product_images(*), category:categories(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(3);

  return (fallback as Product[]) || [];
}

export async function FrequentlyBoughtTogether({ productId, categoryId }: Props) {
  const products = await getFrequentlyBoughtTogether(productId, categoryId);
  if (!products.length) return null;

  return (
    <section className="border-t border-gray-100 max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <h2 className="heading-lg mb-6">Frequently Bought Together</h2>
      <div className="flex flex-wrap gap-4 items-start">
        {products.map((product, i) => (
          <div key={product.id} className="flex items-center gap-4">
            {i > 0 && <span className="text-2xl text-gray-300 font-light">+</span>}
            <Link href={`/product/${product.slug}`} className="group flex flex-col items-center w-[140px] sm:w-[160px]">
              <div className="relative w-full aspect-square bg-[#f7f7f7] rounded-[18px] overflow-hidden mb-2">
                <Image
                  src={getPrimaryImage(product.product_images)}
                  alt={product.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="160px"
                />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center line-clamp-2 leading-snug mb-1 group-hover:text-gray-500 transition-colors">
                {product.title}
              </p>
              <span className="text-sm font-bold text-gray-950">{formatPrice(product.price)}</span>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href={`/product/${products[0].slug}`}
          className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors"
        >
          View All Items
        </Link>
      </div>
    </section>
  );
}
