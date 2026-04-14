'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { markCodCollected } from '@/lib/actions';

interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  cod_collected: boolean;
  cod_collected_at: string | null;
  cod_collected_by: string | null;
  created_at: string;
  order_items: { product_title_snapshot: string; quantity: number }[];
}

export function CodTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'collected'>('pending');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter === 'pending') return !o.cod_collected;
    if (filter === 'collected') return o.cod_collected;
    return true;
  });

  async function handleMark(orderId: string) {
    setMarkingId(orderId);
    await markCodCollected(orderId);
    setMarkingId(null);
    router.refresh();
  }

  function exportCSV() {
    const rows = filtered.map((o) => [
      o.id.slice(0, 8).toUpperCase(),
      o.customer_name, o.phone, o.city,
      o.total,
      o.cod_collected ? 'Collected' : 'Pending',
      o.cod_collected_at ? new Date(o.cod_collected_at).toLocaleDateString('en-PK') : '',
    ]);
    const csv = [['Order','Customer','Phone','City','Total','Status','Collected At'], ...rows]
      .map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cod-report-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {(['all', 'pending', 'collected'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${
              filter === f ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f}
          </button>
        ))}
        <button onClick={exportCSV}
          className="ml-auto flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">City</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{order.city}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      {order.cod_collected ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Collected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full w-fit">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                      {order.cod_collected_at && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(order.cod_collected_at).toLocaleDateString('en-PK')}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!order.cod_collected && (
                        <button onClick={() => handleMark(order.id)} disabled={markingId === order.id}
                          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors disabled:opacity-50">
                          {markingId === order.id ? '...' : 'Mark Collected'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
