'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderRow {
  id: string;
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
  city: string;
  order_items: { product_title_snapshot: string; quantity: number }[];
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending:   { icon: Clock,         color: 'text-orange-500 bg-orange-50',  label: 'Pending Confirmation' },
  confirmed: { icon: CheckCircle,   color: 'text-blue-500 bg-blue-50',      label: 'Confirmed' },
  shipped:   { icon: Truck,         color: 'text-purple-500 bg-purple-50',  label: 'Shipped' },
  delivered: { icon: CheckCircle,   color: 'text-green-500 bg-green-50',    label: 'Delivered' },
  cancelled: { icon: XCircle,       color: 'text-red-500 bg-red-50',        label: 'Cancelled' },
};

export function TrackOrderForm() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'phone' | 'id'>('phone');
  const [orderId, setOrderId] = useState('');

  async function search(payload: { phone?: string; orderId?: string }) {
    setLoading(true);
    setError('');
    setOrders(null);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (!data.orders || data.orders.length === 0) {
        setError(
          payload.phone
            ? 'No orders found for this phone number. Make sure you enter the same number used during checkout.'
            : 'No order found with this ID. Please check and try again.'
        );
      } else {
        setOrders(data.orders as OrderRow[]);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  function handlePhoneSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    search({ phone: phone.trim() });
  }

  function handleIdSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    search({ orderId: orderId.trim() });
  }

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 transition';

  return (
    <div>
      {/* Toggle */}
      <div className="flex bg-[#f7f7f7] rounded-2xl p-1 mb-5">
        <button type="button" onClick={() => { setMode('phone'); setOrders(null); setError(''); }}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors ${mode === 'phone' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-400'}`}>
          By Phone
        </button>
        <button type="button" onClick={() => { setMode('id'); setOrders(null); setError(''); }}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors ${mode === 'id' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-400'}`}>
          By Order ID
        </button>
      </div>

      {mode === 'phone' ? (
        <form onSubmit={handlePhoneSearch} className="flex gap-2 mb-6">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="03XX-XXXXXXX" className={`${inp} flex-1`} autoComplete="tel"
            aria-label="Phone number" />
          <button type="submit" disabled={loading || !phone.trim()}
            className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-5 rounded-2xl transition-colors disabled:opacity-40 shrink-0 touch-manipulation"
            style={{ touchAction: 'manipulation' }}>
            {loading
              ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              : <Search className="w-4 h-4" />}
            {loading ? '' : 'Track'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleIdSearch} className="flex gap-2 mb-6">
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID (e.g. ABC12345)" className={`${inp} flex-1`}
            aria-label="Order ID" />
          <button type="submit" disabled={loading || !orderId.trim()}
            className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-5 rounded-2xl transition-colors disabled:opacity-40 shrink-0 touch-manipulation"
            style={{ touchAction: 'manipulation' }}>
            {loading
              ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              : <Search className="w-4 h-4" />}
            {loading ? '' : 'Find'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 text-center mb-4">
          {error}
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const shortId = order.id.slice(0, 8).toUpperCase();
            return (
              <div key={order.id} className="bg-[#f7f7f7] rounded-[20px] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-gray-950">#{shortId}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{order.city}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {cfg.label}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.order_items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                      <span className="line-clamp-1">{item.product_title_snapshot}</span>
                      <span className="text-gray-400 shrink-0">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-black text-gray-950">{formatPrice(order.total)}</p>
                  <Link href={`/order/${order.id}`}
                    className="text-xs font-bold text-gray-500 hover:text-gray-950 underline underline-offset-4 transition-colors">
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
