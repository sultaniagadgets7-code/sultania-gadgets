import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { FaqsManager } from './FaqsManager';
import type { FaqItem } from '@/types';

export const metadata: Metadata = { title: 'FAQs' };

export default async function AdminFaqsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('faq_items')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">FAQs</h1>
        <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions</p>
      </div>
      <FaqsManager faqs={(data ?? []) as FaqItem[]} />
    </div>
  );
}
