import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ShoppingBag, Clock, CheckCircle, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

// Safe stats fetch — never throws
async function safeGetStats() {
  try {
    const { getDashboardStats } = await import('@/lib/queries');
    return await getDashboardStats();
  } catch {
    return {
      totalProducts: 0, totalOrders: 0, pendingOrders: 0,
      confirmedOrders: 0, deliveredOrders: 0, lowStock: 0, outOfStock: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await safeGetStats();

  const cards = [
    { label: 'Active Products',   value: stats.totalProducts,   icon: Package,       color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/admin/products' },
    { label: 'Total Orders',      value: stats.totalOrders,     icon: ShoppingBag,   color: 'text-gray-600',   bg: 'bg-gray-50',   href: '/admin/orders' },
    { label: 'Pending Orders',    value: stats.pendingOrders,   icon: Clock,         color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/orders?status=pending' },
    { label: 'Confirmed Orders',  value: stats.confirmedOrders, icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50',  href: '/admin/orders?status=confirmed' },
    { label: 'Delivered Orders',  value: stats.deliveredOrders, icon: Truck,         color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/admin/orders?status=delivered' },
    { label: 'Low Stock Items',   value: stats.lowStock,        icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',    href: '/admin/stock' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors">
            + Add Product
          </Link>
          <Link href="/" target="_blank" className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
            View Store
          </Link>
        </div>
      </div>

      {stats.totalOrders === 0 && stats.totalProducts === 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          <strong>Note:</strong> Stats showing 0 — service role key may need updating in Vercel.{' '}
          <Link href="/admin/debug" className="underline font-semibold">Run diagnostics →</Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white border border-gray-100 rounded-[20px] p-5 hover:border-gray-300 hover:shadow-sm transition-all">
            <div className={`inline-flex p-2.5 rounded-2xl ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
            </div>
            <p className="text-2xl font-black text-gray-950">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold uppercase tracking-widest">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/orders?status=pending" className="bg-amber-50 border border-amber-200 rounded-[20px] p-5 hover:border-amber-400 transition-colors">
          <p className="font-bold text-amber-800 text-sm">Pending Orders</p>
          <p className="text-3xl font-black text-amber-700 mt-1">{stats.pendingOrders}</p>
          <p className="text-xs text-amber-600 mt-1 font-semibold">Require confirmation →</p>
        </Link>
        <Link href="/admin/products/new" className="bg-[#f7f7f7] border border-gray-100 rounded-[20px] p-5 hover:border-gray-300 transition-colors">
          <p className="font-bold text-gray-950 text-sm">Add New Product</p>
          <p className="text-xs text-gray-500 mt-2">Create a new product listing with images, specs, and pricing.</p>
          <p className="text-xs text-gray-950 font-bold mt-2">Go to product form →</p>
        </Link>
      </div>

      {stats.lowStock > 0 && (
        <Link href="/admin/stock" className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-[20px] p-5 hover:border-red-400 transition-colors">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold text-red-800 text-sm">
              {stats.lowStock} product{stats.lowStock !== 1 ? 's' : ''} running low on stock
            </p>
            <p className="text-xs text-red-600 mt-0.5">Click to review and restock →</p>
          </div>
        </Link>
      )}
    </div>
  );
}
