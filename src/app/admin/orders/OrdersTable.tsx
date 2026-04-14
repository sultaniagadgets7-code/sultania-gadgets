'use client';

import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus, updateOrderNote } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import { ChevronDown, ChevronUp, Download, MessageCircle, Save } from 'lucide-react';
import { PrintSlip } from './PrintSlip';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

interface OrdersTableProps {
  orders: Order[];
  initialStatus: string;
}

function exportCSV(orders: Order[]) {
  const headers = ['Order ID', 'Customer', 'Phone', 'City', 'Address', 'Total', 'Status', 'Date', 'Items'];
  const rows = orders.map((o) => [
    o.id.slice(0, 8).toUpperCase(),
    o.customer_name,
    o.phone,
    o.city,
    `"${o.address}"`,
    o.total,
    o.status,
    new Date(o.created_at).toLocaleDateString('en-PK'),
    o.order_items?.map((i) => `${i.product_title_snapshot}x${i.quantity}`).join(' | ') || '',
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function buildWhatsAppUrl(order: Order) {
  const items = order.order_items?.map((i) => `${i.product_title_snapshot} x${i.quantity}`).join(', ') || '';
  const orderId = order.id.slice(0, 8).toUpperCase();
  const text = `Assalamualaikum ${order.customer_name}, your order ${orderId} for ${items} has been confirmed. Total: Rs. ${order.total}. It will be delivered to ${order.city} in 2-4 days. Thank you for shopping with Sultania Gadgets!`;
  return `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export function OrdersTable({ orders, initialStatus }: OrdersTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, o.notes_internal ?? '']))
  );
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch =
      !search ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.id.includes(search);
    return matchStatus && matchSearch;
  });

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, status);
    setUpdatingId(null);
    router.refresh();
  }

  async function handleSaveNote(orderId: string) {
    setSavingNote(orderId);
    await updateOrderNote(orderId, notes[orderId] ?? '');
    setSavingNote(null);
    setSavedNote(orderId);
    setTimeout(() => setSavedNote(null), 2000);
  }

  return (
    <div>
      {/* Filters + Export */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="search"
          placeholder="Search by name, phone, or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search orders"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            const params = new URLSearchParams();
            if (e.target.value !== 'all') params.set('status', e.target.value);
            router.push(`/admin/orders?${params.toString()}`);
          }}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors shrink-0"
          aria-label="Export orders as CSV"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden sm:table-cell">City</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden md:table-cell">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-600">{order.id.slice(0, 8).toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-700">{order.city}</td>
                      <td className="px-4 py-3 hidden md:table-cell font-medium text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={updatingId === order.id}
                          className={`text-xs font-semibold px-2 py-1 rounded border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${STATUS_COLORS[order.status]}`}
                          aria-label={`Update status for order ${order.id.slice(0, 8)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-PK')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className="text-gray-400 hover:text-gray-700"
                          aria-label={expandedId === order.id ? 'Collapse order details' : 'Expand order details'}
                          aria-expanded={expandedId === order.id}
                        >
                          {expandedId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Delivery Address</p>
                              <p className="text-gray-600">{order.address}, {order.city}</p>
                              {order.notes && <p className="text-gray-500 mt-1 text-xs">Note: {order.notes}</p>}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Order Items</p>
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex justify-between text-gray-600">
                                  <span>{item.product_title_snapshot} × {item.quantity}</span>
                                  <span>{formatPrice(item.price_snapshot * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between font-semibold text-gray-900">
                                <span>Total (incl. delivery)</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Internal Note */}
                          <div className="mb-4">
                            <p className="font-semibold text-gray-700 mb-1.5 text-sm">Internal Note</p>
                            <div className="flex gap-2">
                              <textarea
                                value={notes[order.id] ?? ''}
                                onChange={(e) => setNotes({ ...notes, [order.id]: e.target.value })}
                                placeholder="Add an internal note (not visible to customer)..."
                                rows={2}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                aria-label="Internal note"
                              />
                              <button
                                onClick={() => handleSaveNote(order.id)}
                                disabled={savingNote === order.id}
                                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-xl transition-colors self-start ${savedNote === order.id ? 'bg-green-100 text-green-700' : 'bg-[#0a0a0a] hover:bg-gray-800 text-white'} disabled:opacity-50`}
                                aria-label="Save internal note"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {savedNote === order.id ? 'Saved' : 'Save'}
                              </button>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <a
                              href={buildWhatsAppUrl(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Send WhatsApp Confirmation
                            </a>
                            <PrintSlip order={order} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
