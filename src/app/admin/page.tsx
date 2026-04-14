import type { Metadata } from 'next';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/queries';
import { Package, ShoppingBag, Clock, CheckCircle, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/products' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-gray-600', bg: 'bg-gray-50', href: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/orders?status=pending' },
    { label: 'Confirmed Orders', value: stats.confirmedOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/orders?status=confirmed' },
    { label: 'Delivered Orders', value: stats.deliveredOrders, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/orders?status=delivered' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', href: '/admin/products' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-3 py-2 rounded transition-colors">
            + Add Product
          </Link>
          <Link href="/" target="_blank" className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-3 py-2 rounded transition-colors">
            View Store
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white border border-gray-200 rounded p-4 hover:border-blue-300 transition-colors">
            <div className={`inline-flex p-2 rounded ${bg} mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/orders?status=pending" className="bg-orange-50 border border-orange-200 rounded p-4 hover:border-orange-400 transition-colors">
          <p className="font-semibold text-orange-800 text-sm">Pending Orders</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">{stats.pendingOrders}</p>
          <p className="text-xs text-orange-600 mt-1">Require confirmation →</p>
        </Link>
        <Link href="/admin/products/new" className="bg-blue-50 border border-blue-200 rounded p-4 hover:border-blue-400 transition-colors">
          <p className="font-semibold text-blue-800 text-sm">Add New Product</p>
          <p className="text-xs text-blue-600 mt-2">Create a new product listing with images, specs, and pricing.</p>
          <p className="text-xs text-blue-700 font-semibold mt-2">Go to product form →</p>
        </Link>
      </div>
    </div>
  );
}
