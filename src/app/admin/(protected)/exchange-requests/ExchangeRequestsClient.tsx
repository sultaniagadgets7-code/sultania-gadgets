'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RefreshCw } from 'lucide-react';

type ExchangeStatus = 'pending' | 'approved' | 'rejected' | 'resolved';

interface ExchangeRequest {
  id: string;
  order_id: string | null;
  customer_name: string;
  phone: string;
  product_name: string;
  reason: string;
  description: string | null;
  status: ExchangeStatus;
  created_at: string;
}

const STATUS_COLORS: Record<ExchangeStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  resolved: 'bg-green-100 text-green-700',
};

export function ExchangeRequestsClient({ requests }: { requests: ExchangeRequest[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: ExchangeStatus) {
    setUpdating(id);
    const supabase = createClient();
    await supabase
      .from('exchange_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    setUpdating(null);
    router.refresh();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <RefreshCw className="w-6 h-6 text-[#e01e1e]" />
        Exchange Requests
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">No exchange requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {req.id.slice(0, 8).toUpperCase()}
                      {req.order_id && <span className="block text-gray-400">#{req.order_id}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{req.customer_name}</td>
                    <td className="px-4 py-3 text-gray-600">{req.phone}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <p>{req.product_name}</p>
                      {req.description && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{req.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{req.reason}</td>
                    <td className="px-4 py-3">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ExchangeStatus)}
                        disabled={updating === req.id}
                        className={`text-xs font-semibold px-2 py-1 rounded border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${STATUS_COLORS[req.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(req.created_at).toLocaleDateString('en-PK')}
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
