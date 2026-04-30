import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Heart, Star, Package, ArrowRight, RefreshCw } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'My Account' };

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();

  const [ordersRes, wishlistRes, loyaltyRes, profileRes] = await Promise.all([
    admin.from('orders').select('id, status, total, created_at, order_items(product_title_snapshot, quantity)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    admin.from('wishlist').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    admin.from('loyalty_points').select('points').eq('user_id', user.id).single(),
    admin.from('profiles').select('full_name').eq('id', user.id).single(),
  ]);

  const orders = ordersRes.data ?? [];
  const wishlistCount = wishlistRes.count ?? 0;
  const loyaltyPoints = loyaltyRes.data?.points ?? 0;
  const name = profileRes.data?.full_name || user.email?.split('@')[0] || 'there';
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  const STATUS_STYLE: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-black text-[#0f172a]">Hello, {name}! 👋</h2>
        <p className="text-sm text-[#94a3b8] mt-1">Welcome to your account dashboard.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag, href: '/account/orders', color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: Package, href: '/account/orders', color: 'bg-green-50 text-green-600' },
          { label: 'Loyalty Points', value: `${loyaltyPoints} pts`, icon: Star, href: '/account/loyalty', color: 'bg-amber-50 text-amber-600' },
          { label: 'Wishlist Items', value: wishlistCount, icon: Heart, href: '/account/wishlist', color: 'bg-red-50 text-red-600' },
        ].map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 hover:border-[#dc2626]/30 transition-all group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-[#0f172a]">{value}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#0f172a]">Recent Orders</h3>
            <Link href="/account/orders" className="text-xs font-semibold text-[#94a3b8] hover:text-[#dc2626] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#0f172a]">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#64748b] line-clamp-1">
                    {(order.order_items as any[])?.map((i: any) => i.product_title_snapshot).join(', ')}
                  </p>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <p className="text-sm font-black text-[#0f172a]">{formatPrice(order.total)}</p>
                    <Link href={`/order/${order.id}`} className="text-xs font-semibold text-[#dc2626] hover:underline">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-10 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
          <ShoppingBag className="w-10 h-10 text-[#e2e8f0] mx-auto mb-3" />
          <p className="font-semibold text-[#64748b]">No orders yet</p>
          <Link href="/shop" className="mt-4 inline-flex items-center gap-2 bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full hover:bg-[#b91c1c] transition-colors">
            Start Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/account/profile" className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 hover:border-[#dc2626]/30 transition-all">
          <div className="w-8 h-8 bg-[#0a0a0f] rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a]">Edit Profile</p>
            <p className="text-xs text-[#94a3b8]">Update your details</p>
          </div>
        </Link>
        <Link href="/exchange-request" className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 hover:border-[#dc2626]/30 transition-all">
          <div className="w-8 h-8 bg-[#dc2626]/10 rounded-xl flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a]">Exchange Request</p>
            <p className="text-xs text-[#94a3b8]">Defective item?</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
