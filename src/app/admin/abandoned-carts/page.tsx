import { createClient } from '@/lib/supabase/server';
import { AbandonedCartsClient } from './AbandonedCartsClient';

export const metadata = { title: 'Abandoned Carts' };

export default async function AbandonedCartsPage() {
  const supabase = await createClient();
  const { data: carts } = await supabase
    .from('abandoned_carts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200);

  return <AbandonedCartsClient carts={carts ?? []} />;
}
