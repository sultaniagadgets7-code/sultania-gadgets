import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { ExchangeRequestsTable } from './ExchangeRequestsTable';

export const metadata: Metadata = { title: 'Exchange Requests' };

export default async function ExchangeRequestsPage() {
  let requests: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('exchange_requests').select('*').order('created_at', { ascending: false });
    requests = data ?? [];
  } catch (err) {
    console.error('ExchangeRequestsPage error:', err);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Exchange Requests</h1>
        <span className="text-sm text-gray-500">{requests.length} total</span>
      </div>
      <ExchangeRequestsTable requests={requests} />
    </div>
  );
}
