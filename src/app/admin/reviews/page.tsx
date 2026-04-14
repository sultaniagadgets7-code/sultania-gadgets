import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AdminReviewsTable } from './AdminReviewsTable';
import { AddReviewForm } from './AddReviewForm';

export const metadata: Metadata = { title: 'Reviews' };

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase
      .from('reviews')
      .select('*, product:products(title, slug)')
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('id, title')
      .eq('is_active', true)
      .order('title'),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <span className="text-sm text-gray-500">{reviews?.length ?? 0} total</span>
      </div>

      {/* Admin add review */}
      <div className="mb-6">
        <AddReviewForm products={products ?? []} />
      </div>

      <AdminReviewsTable reviews={reviews ?? []} />
    </div>
  );
}
