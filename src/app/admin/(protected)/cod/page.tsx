import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import { CodTable } from './CodTable';

export const metadata: Metadata = { title: 'COD Collection' };

export default async function CodPage() {
  let all: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data: orders } = await supabase
      .from('orders')
      .select('id, customer_name, phone, city, total, status, cod_collected, cod_collected_at, cod_collected_by, created_at, order_items(product_title_snapshot, quantity)')
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });
    all = orders ?? [];
  } catch (err) {
    console.error('CodPage error:', err);
  }
  const pending = all.filter((o) => !o.cod_collected);
  const collected = all.filter((o) => o.cod_collected);

  const pendingTotal = pending.reduce((s, o) => s + o.total, 0);
  const collectedTotal = collected.reduce((s, o) => s + o.total, 0);

  // Today's collections
  const today = new Date().toISOString().slice(0, 10);
  const todayCollected = collected.filter((o) => o.cod_collected_at?.startsWith(today));
  const todayTotal = todayCollected.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">COD Collection</h1>
        <p className="text-sm text-gray-500 mt-1">Track cash collection for delivered orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <p className="text-2xl font-bold text-orange-600">{formatPrice(pendingTotal)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Pending Collection ({pending.length} orders)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <p className="text-2xl font-bold text-green-600">{formatPrice(todayTotal)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Collected Today ({todayCollected.length} orders)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(collectedTotal)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Collected ({collected.length} orders)</p>
        </div>
      </div>

      <CodTable orders={all} />
    </div>
  );
}
