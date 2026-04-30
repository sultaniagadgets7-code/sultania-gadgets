import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { ExchangeRequestsTable } from './ExchangeRequestsTable';

export const metadata: Metadata = { title: 'Exchange Requests' };

export default async function ExchangeRequestsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('exchange_requests')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Exchange Requests</h1>
        <span className="text-sm text-gray-500">{data?.length ?? 0} total</span>
      </div>
      <ExchangeRequestsTable requests={data ?? []} />
    </div>
  );
}
