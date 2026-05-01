import { createAdminClient } from '@/lib/supabase/admin';
import { AbandonedCartsClient } from './AbandonedCartsClient';

export const metadata = { title: 'Abandoned Carts' };

export default async function AbandonedCartsPage() {
  let carts: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('abandoned_carts').select('*').order('updated_at', { ascending: false }).limit(200);
    carts = data ?? [];
  } catch (err) {
    console.error('AbandonedCartsPage error:', err);
  }
  return <AbandonedCartsClient carts={carts} />;
}
