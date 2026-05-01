import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { CouponsManager } from './CouponsManager';
import type { Coupon } from '@/types';

export const metadata: Metadata = { title: 'Coupons' };

export default async function AdminCouponsPage() {
  let coupons: Coupon[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    coupons = (data ?? []) as Coupon[];
  } catch (err) {
    console.error('AdminCouponsPage error:', err);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Coupon Codes</h1>
        <p className="text-sm text-gray-500 mt-1">Manage discount codes for your store</p>
      </div>
      <CouponsManager coupons={coupons} />
    </div>
  );
}
