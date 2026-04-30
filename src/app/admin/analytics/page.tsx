import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

export const metadata: Metadata = { title: 'Analytics' };

interface OrderRow {
  total: number;
  status: string;
  created_at: string;
  order_items: { product_title_snapshot: string; quantity: number }[];
}

function getDateRange(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function AdminAnalyticsPage() {
  const supabase = createAdminClient();

  // Fetch orders and order_items separately to avoid nested query issues
  const { data: rawOrders } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .order('created_at', { ascending: false });

  const { data: allOrdersForCustomers } = await supabase
    .from('orders')
    .select('phone');

  // Fetch order items separately
  const orderIds = (rawOrders ?? []).map(o => o.id);
  const { data: rawItems } = orderIds.length > 0
    ? await supabase
        .from('order_items')
        .select('order_id, product_title_snapshot, quantity')
        .in('order_id', orderIds)
    : { data: [] };

  // Merge items into orders
  const orders: OrderRow[] = (rawOrders ?? []).map(o => ({
    ...o,
    order_items: (rawItems ?? []).filter(item => item.order_id === o.id),
  })) as OrderRow[];
  const nonCancelled = orders.filter((o) => o.status !== 'cancelled');

  // Date boundaries
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

  const revenueThisMonth = nonCancelled
    .filter((o) => o.created_at >= thisMonthStart)
    .reduce((s, o) => s + o.total, 0);

  const revenueLastMonth = nonCancelled
    .filter((o) => o.created_at >= lastMonthStart && o.created_at <= lastMonthEnd)
    .reduce((s, o) => s + o.total, 0);

  const revenueDiff = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : 0;

  // Last 14 days bar chart data
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).toISOString();
    const revenue = nonCancelled
      .filter((o) => o.created_at >= dayStart && o.created_at <= dayEnd)
      .reduce((s, o) => s + o.total, 0);
    return {
      label: d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
      revenue,
    };
  });

  const maxRevenue = Math.max(...last14.map((d) => d.revenue), 1);

  // Top 5 products
  const productMap: Record<string, number> = {};
  for (const order of nonCancelled) {
    for (const item of order.order_items ?? []) {
      const key = item.product_title_snapshot;
      productMap[key] = (productMap[key] || 0) + item.quantity;
    }
  }
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Order status breakdown
  const statusMap: Record<string, number> = {};
  for (const o of orders) {
    statusMap[o.status] = (statusMap[o.status] || 0) + 1;
  }

  // Customers
  const uniquePhones = new Set((allOrdersForCustomers ?? []).map((o) => o.phone));
  const totalCustomers = uniquePhones.size;

  // AOV
  const aov = nonCancelled.length > 0
    ? nonCancelled.reduce((s, o) => s + o.total, 0) / nonCancelled.length
    : 0;

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-orange-400',
    confirmed: 'bg-blue-400',
    shipped: 'bg-purple-400',
    delivered: 'bg-green-400',
    cancelled: 'bg-red-400',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Store performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            {revenueDiff !== 0 && (
              <span className={`flex items-center gap-1 text-xs font-semibold ${revenueDiff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {revenueDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(revenueDiff)}%
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900">{formatPrice(revenueThisMonth)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Revenue this month</p>
          <p className="text-xs text-gray-400 mt-1">Last month: {formatPrice(revenueLastMonth)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <div className="p-2 bg-blue-50 rounded-xl inline-flex mb-3">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{nonCancelled.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total orders</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <div className="p-2 bg-purple-50 rounded-xl inline-flex mb-3">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{totalCustomers}</p>
          <p className="text-xs text-gray-500 mt-0.5">Unique customers</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <div className="p-2 bg-orange-50 rounded-xl inline-flex mb-3">
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatPrice(aov)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Avg. order value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <p className="font-bold text-sm text-gray-900 mb-4">Revenue — Last 14 Days</p>
          <div className="flex items-end gap-1 h-32">
            {last14.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gray-900 rounded-t-sm transition-all"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 4 : 0)}%` }}
                  title={`${day.label}: ${formatPrice(day.revenue)}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">{last14[0]?.label}</span>
            <span className="text-xs text-gray-400">{last14[last14.length - 1]?.label}</span>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5">
          <p className="font-bold text-sm text-gray-900 mb-4">Order Status Breakdown</p>
          <div className="space-y-2.5">
            {Object.entries(statusMap).map(([status, count]) => {
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(statusMap).length === 0 && (
              <p className="text-sm text-gray-400">No orders yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5">
        <p className="font-bold text-sm text-gray-900 mb-4">Top 5 Selling Products</p>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400">No sales data yet.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map(([title, qty], i) => {
              const maxQty = topProducts[0][1];
              const pct = Math.round((qty / maxQty) * 100);
              return (
                <div key={title} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 shrink-0">{qty} sold</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
