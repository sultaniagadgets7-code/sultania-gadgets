'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markCodCollected } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Download, Banknote } from 'lucide-react';

interface CodOrder {
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
}

function groupByDate(orders: CodOrder[]) {
  const groups: Record<string, CodOrder[]> = {};
  for (const o of orders) {
    const date = new Date(o.created_at).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(o);
  }
  return groups;
}

function todayKey() {
  return new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function CodCollectionClient({ orders }: { orders: CodOrder[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const today = todayKey();
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    return d === today;
  });

  const todayPending = todayOrders.filter((o) => !o.cod_collected).reduce((s, o) => s + o.total, 0);
  const todayCollected = todayOrders.filter((o) => o.cod_collected).reduce((s, o) => s + o.total, 0);
  const allTimeCollected = orders.filter((o) => o.cod_collected).reduce((s, o) => s + o.total, 0);

  const grouped = groupByDate(orders);

  async function handleMark(orderId: string) {
    setLoading(orderId);
    await markCodCollected(orderId, 'admin');
    setLoading(null);
    router.refresh();
  }

  function exportDailyCSV() {
    const todayCollectedOrders = todayOrders.filter((o) => o.cod_collected);
    const headers = ['Order ID', 'Customer', 'Phone', 'City', 'Total', 'Collected At'];
    let running = 0;
    const rows = todayCollectedOrders.map((o) => {
      running += o.total;
      return [
        o.id.slice(0, 8).toUpperCase(),
        o.customer_name,
        o.phone,
        o.city,
        o.total,
        o.cod_collected_at ? new Date(o.cod_collected_at).toLocaleTimeString('en-PK') : '',
      ];
    });
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cod-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Banknote className="w-6 h-6 text-[#e01e1e]" />
        COD Collection
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Today&apos;s Pending</p>
          <p className="text-2xl font-bold text-orange-700">{formatPrice(todayPending)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Today&apos;s Collected</p>
          <p className="text-2xl font-bold text-green-700">{formatPrice(todayCollected)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">All-Time Collected</p>
          <p className="text-2xl font-bold text-blue-700">{formatPrice(allTimeCollected)}</p>
        </div>
      </div>

      {/* Daily Report */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Daily Report — {today}</h2>
          <button
            onClick={exportDailyCSV}
            className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
        {todayOrders.filter((o) => o.cod_collected).length === 0 ? (
          <p className="p-6 text-sm text-gray-500 text-center">No collections today yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">City</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Collected At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(() => {
                  let running = 0;
                  return todayOrders.filter((o) => o.cod_collected).map((o) => {
                    running += o.total;
                    return (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{o.customer_name}</p>
                          <p className="text-xs text-gray-500">{o.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{o.city}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatPrice(o.total)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {o.cod_collected_at ? new Date(o.cod_collected_at).toLocaleTimeString('en-PK') : '—'}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">Running Total</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">
                    {formatPrice(todayOrders.filter((o) => o.cod_collected).reduce((s, o) => s + o.total, 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* All delivered orders grouped by date */}
      {Object.entries(grouped).map(([date, dateOrders]) => (
        <div key={date} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700 text-sm">{date}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {dateOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.phone} · {order.city}</p>
                </div>
                <p className="font-semibold text-gray-900 shrink-0">{formatPrice(order.total)}</p>
                {order.cod_collected ? (
                  <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      Collected
                      {order.cod_collected_at && (
                        <span className="text-gray-400 font-normal ml-1">
                          {new Date(order.cod_collected_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMark(order.id)}
                    disabled={loading === order.id}
                    className="shrink-0 bg-[#e01e1e] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    {loading === order.id ? 'Saving...' : 'Mark Collected'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No delivered orders yet.</div>
      )}
    </div>
  );
}
