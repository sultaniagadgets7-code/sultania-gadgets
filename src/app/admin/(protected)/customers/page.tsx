import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import { Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Customers' };

interface CustomerRow {
  phone: string;
  customer_name: string;
  city: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  last_status: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminCustomersPage() {
  let customers: CustomerRow[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('orders')
      .select('customer_name, phone, city, total, status, created_at')
      .order('created_at', { ascending: false });

    const orders = data ?? [];
    const customerMap = new Map<string, CustomerRow>();
    for (const o of orders) {
      if (!customerMap.has(o.phone)) {
        customerMap.set(o.phone, {
          phone: o.phone,
          customer_name: o.customer_name,
          city: o.city,
          total_orders: 0,
          total_spent: 0,
          last_order_date: o.created_at,
          last_status: o.status,
        });
      }
      const c = customerMap.get(o.phone)!;
      c.total_orders += 1;
      c.total_spent += o.total;
    }
    customers = Array.from(customerMap.values());
  } catch (err) {
    console.error('AdminCustomersPage error:', err);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} unique customers</p>
        </div>
        <div className="p-2 bg-purple-50 rounded-xl">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">City</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Orders</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Total Spent</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden lg:table-cell">Last Order</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden lg:table-cell">Last Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.phone} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{c.customer_name}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-gray-700 text-xs">{c.city}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-gray-900">{c.total_orders}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell font-medium text-gray-900">
                      {formatPrice(c.total_spent)}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-500">
                      {new Date(c.last_order_date).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[c.last_status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.last_status}
                      </span>
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
