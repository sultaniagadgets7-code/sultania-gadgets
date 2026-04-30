import type { Metadata } from 'next';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import { Package2, Plus } from 'lucide-react';

export const metadata: Metadata = { title: 'Bundles' };

export default async function AdminBundlesPage() {
  const supabase = createAdminClient();
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*, bundle_items(id, quantity, product:products(title, price))')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Product Bundles</h1>
        <Link href="/admin/bundles/new"
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors">
          <Plus className="w-4 h-4" /> New Bundle
        </Link>
      </div>

      {!bundles?.length ? (
        <div className="bg-white border border-gray-200 rounded-[20px] p-12 text-center">
          <Package2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No bundles yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a bundle to sell multiple products together at a discount.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map((bundle) => {
            const items = bundle.bundle_items ?? [];
            const originalTotal = items.reduce((s: number, i: { quantity: number; product: { price: number } | null }) =>
              s + (i.product?.price ?? 0) * i.quantity, 0);
            const discountedTotal = originalTotal * (1 - bundle.discount_percent / 100);

            return (
              <div key={bundle.id} className="bg-white border border-gray-200 rounded-[20px] p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{bundle.title}</p>
                    {bundle.discount_percent > 0 && (
                      <span className="bg-[#e01e1e] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {bundle.discount_percent}% OFF
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${bundle.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {bundle.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{items.length} products · {formatPrice(discountedTotal)} (was {formatPrice(originalTotal)})</p>
                </div>
                <Link href={`/admin/bundles/${bundle.id}/edit`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0">
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
