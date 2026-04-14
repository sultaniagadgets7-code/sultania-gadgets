import type { Metadata } from 'next';
import { getUserOrders } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Orders' };

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped:   'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="w-14 h-14 text-gray-200 mb-4" aria-hidden="true" />
      <p className="font-semibold text-gray-500">No orders yet</p>
      <p className="text-sm text-gray-400 mt-1 mb-6">Your orders will appear here once you place one.</p>
      <Link href="/shop" className="bg-[#0a0a0a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      {orders.map((order) => (
        <div key={order.id} className="bg-[#f7f7f7] rounded-[20px] p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-mono text-xs font-bold text-gray-950">{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-1 mb-3">
            {order.order_items?.map((item: { product_title_snapshot: string; quantity: number; price_snapshot: number }, i: number) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1">{item.product_title_snapshot} × {item.quantity}</span>
                <span className="shrink-0 ml-2">{formatPrice(item.price_snapshot * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <p className="text-xs text-gray-400">{order.city} · COD</p>
            <p className="font-black text-gray-950">{formatPrice(order.total)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
