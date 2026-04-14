'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { waUrl } from '@/lib/whatsapp';

interface ExchangeRequest {
  id: string;
  order_id: string | null;
  customer_name: string;
  phone: string;
  product_name: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-orange-100 text-orange-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  resolved: 'bg-green-100 text-green-700',
};

export function ExchangeRequestsTable({ requests }: { requests: ExchangeRequest[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from('exchange_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
      {requests.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">No exchange requests yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.customer_name}</p>
                    <p className="text-xs text-gray-400">{r.phone}</p>
                    {r.order_id && <p className="text-xs text-gray-400 font-mono">#{r.order_id.slice(0, 8)}</p>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-700 text-xs">{r.product_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{r.reason}</td>
                  <td className="px-4 py-3">
                    <select value={r.status} disabled={updatingId === r.id}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {['pending','approved','rejected','resolved'].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('en-PK')}
                  </td>
                  <td className="px-4 py-3">
                    <a href={waUrl(`Assalamualaikum ${r.customer_name}, regarding your exchange request for *${r.product_name}*.`, r.phone)}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
