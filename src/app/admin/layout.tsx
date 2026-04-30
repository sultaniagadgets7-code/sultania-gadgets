import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Zap, LayoutDashboard, Package, ShoppingBag, LogOut, Star, Tag,
  BarChart2, Users, AlertTriangle, Ticket, HelpCircle, MessageSquare, Settings,
  Banknote, RefreshCw, Package2, FileText,
} from 'lucide-react';
import { adminSignOut } from '@/lib/actions';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin — Sultania Gadgets' },
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: '/admin',                   icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/analytics',         icon: BarChart2,       label: 'Analytics' },
  { href: '/admin/orders',            icon: ShoppingBag,     label: 'Orders' },
  { href: '/admin/customers',         icon: Users,           label: 'Customers' },
  { href: '/admin/cod',               icon: Banknote,        label: 'COD Collection' },
  { href: '/admin/exchange-requests', icon: RefreshCw,       label: 'Exchanges' },
  { href: '/admin/products',          icon: Package,         label: 'Products' },
  { href: '/admin/stock',             icon: AlertTriangle,   label: 'Low Stock' },
  { href: '/admin/bundles',           icon: Package2,        label: 'Bundles' },
  { href: '/admin/categories',   icon: Tag,             label: 'Categories' },
  { href: '/admin/coupons',      icon: Ticket,          label: 'Coupons' },
  { href: '/admin/reviews',      icon: Star,            label: 'Reviews' },
  { href: '/admin/faqs',         icon: HelpCircle,      label: 'FAQs' },
  { href: '/admin/testimonials', icon: MessageSquare,   label: 'Testimonials' },
  { href: '/admin/blog',         icon: FileText,        label: 'Blog Posts' },
  { href: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-52 bg-gray-900 text-gray-300 flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2 text-white font-bold text-sm">
            <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" />
            Sultania Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <form action={adminSignOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-sm">
            <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" />
            Admin
          </Link>
          <div className="flex gap-3 text-xs overflow-x-auto">
            <Link href="/admin" className="text-gray-300 hover:text-white whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/orders" className="text-gray-300 hover:text-white whitespace-nowrap">Orders</Link>
            <Link href="/admin/products" className="text-gray-300 hover:text-white whitespace-nowrap">Products</Link>
            <Link href="/admin/analytics" className="text-gray-300 hover:text-white whitespace-nowrap">Analytics</Link>
          </div>
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
